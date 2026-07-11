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

const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL ?? "ashikuryt68@gmail.com";

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
        let orgName: string | undefined;
        if (data.orgId) {
          const orgSnap = await getDoc(doc(db, "organizations", data.orgId));
          if (orgSnap.exists()) orgName = (orgSnap.data() as any).name;
        }
        const profile = { uid: u.uid, ...data, orgName };
        setUserProfile(profile);
        identifyUser(u.uid, { role: data.role, email: data.email, name: data.name, orgId: data.orgId, orgName });
      } else if (SUPER_ADMIN_EMAIL && u.email === SUPER_ADMIN_EMAIL) {
        const profile: UserProfile = {
          uid: u.uid,
          role: "super_admin",
          orgId: null,
          name: u.displayName ?? u.email!,
          email: u.email!,
        };
        await setDoc(ref, { role: profile.role, orgId: null, name: profile.name, email: profile.email });
        setUserProfile(profile);
        identifyUser(u.uid, { role: "super_admin", email: profile.email, name: profile.name, orgId: null });
      } else {
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
