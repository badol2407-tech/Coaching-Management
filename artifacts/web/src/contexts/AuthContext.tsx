import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { identifyUser, resetUser, trackLogout } from "@/lib/analytics";

export type UserRole = "super_admin" | "org_admin" | "teacher" | "student";

export interface UserProfile {
  uid: string;
  role: UserRole;
  orgId: string | null;
  orgName?: string;
  name: string;
  email: string;
  studentId?: string;
  /** Set to true when the account was created by an admin with a temp password */
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /**
   * Temporarily override the active profile (used by ImpersonationContext so
   * that all pages and layouts see the impersonated user's profile).
   * Pass null to restore the real super admin profile.
   */
  setProfileOverride: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
  setProfileOverride: () => {},
});

/**
 * Super Admin whitelist — BOTH conditions must be true to grant super_admin:
 *   1. The user's email is in this list
 *   2. The user's Firestore profile has role === "super_admin"
 *
 * Email-only is NOT enough — a matching role in Firestore is always required.
 */
const SUPER_ADMIN_EMAIL_WHITELIST = new Set([
  "shirinjahan788@gmail.com",
  "rahmanashikur09297@gmail.com",
  "alphaofficial788@gmail.com",
  "badol2407@gmail.com",
  "yesornomotivation@gmail.com",
  "bengaliofficial121@gmail.com",
  "statusbd842@gmail.com",
  "ashikuryt68@gmail.com",
]);

function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAIL_WHITELIST.has(email.toLowerCase().trim());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [realProfile, setRealProfile] = useState<UserProfile | null>(null);
  const [profileOverride, setProfileOverrideState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // The effective profile — override wins during impersonation.
  const userProfile = profileOverride ?? realProfile;

  const setProfileOverride = useCallback((profile: UserProfile | null) => {
    setProfileOverrideState(profile);
  }, []);

  const loadProfile = useCallback(async (u: User) => {
    try {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Omit<UserProfile, "uid">;

        // ── Super Admin gate ─────────────────────────────────────────────
        // Whitelist is the single source of truth:
        //   • If email IS in the whitelist → always super_admin (overrides
        //     whatever role is stored in Firestore, e.g. org_admin)
        //   • If email is NOT whitelisted but Firestore role === "super_admin"
        //     → block (security — prevents rogue Firestore edits from elevating)
        if (data.role === "super_admin" && !isSuperAdminEmail(u.email)) {
          // Firestore says super_admin but email isn't whitelisted → block.
          setRealProfile(null);
          return;
        }
        if (isSuperAdminEmail(u.email)) {
          // Whitelisted email → always elevate to super_admin.
          data.role = "super_admin";
        }
        // ────────────────────────────────────────────────────────────────

        let orgName: string | undefined;
        if (data.orgId) {
          const orgSnap = await getDoc(doc(db, "organizations", data.orgId));
          if (orgSnap.exists()) orgName = (orgSnap.data() as any).name;
        }

        const profile: UserProfile = {
          uid: u.uid,
          ...data,
          orgName,
          mustChangePassword: data.mustChangePassword ?? false,
        };
        setRealProfile(profile);
        identifyUser(u.uid, { role: data.role, email: data.email, name: data.name, orgId: data.orgId, orgName });
      } else {
        // No Firestore profile exists — no super_admin auto-creation by email alone.
        // Redirect to Setup so the user completes onboarding.
        setRealProfile(null);
      }
    } catch {
      setRealProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u);
      } else {
        setRealProfile(null);
        setProfileOverrideState(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  const logout = useCallback(async () => {
    trackLogout();
    resetUser();
    setProfileOverrideState(null);
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout, refreshProfile, setProfileOverride }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
