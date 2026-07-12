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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {},
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User) => {
    try {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Omit<UserProfile, "uid">;

        // ── Super Admin gate ─────────────────────────────────────────────
        // Grant super_admin ONLY when BOTH conditions are met:
        //   1. Email is in the whitelist
        //   2. Firestore role === "super_admin"
        // If email is whitelisted but Firestore role != "super_admin",
        // fall through to the normal login flow (no elevation).
        if (data.role === "super_admin" && !isSuperAdminEmail(u.email)) {
          // Role is super_admin in Firestore but email is NOT whitelisted.
          // Treat as no profile → redirect to landing page for security.
          setUserProfile(null);
          return;
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
        setUserProfile(profile);
        identifyUser(u.uid, { role: data.role, email: data.email, name: data.name, orgId: data.orgId, orgName });
      } else {
        // No Firestore profile exists — no super_admin auto-creation by email alone.
        // Redirect to Setup so the user completes onboarding.
        setUserProfile(null);
      }
    } catch {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u);
      } else {
        setUserProfile(null);
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
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
