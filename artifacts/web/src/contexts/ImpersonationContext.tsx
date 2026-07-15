/**
 * ImpersonationContext — lets an authenticated Super Admin "view" an
 * organisation's portal as a specific role (org_admin / teacher / student)
 * WITHOUT changing their own auth session.
 *
 * Security properties:
 *  • The super admin stays signed in with their own account throughout.
 *  • All Firestore reads run under the super admin's token (rules allow it).
 *  • Every entry and exit is logged to `super_admin_impersonation` in
 *    Firestore (enforced server-side: only super_admin role can write there).
 *  • The active userProfile in AuthContext is temporarily overridden so that
 *    all pages and layouts automatically show the right data without any prop
 *    threading.
 *  • No passwords are ever revealed, changed, or exchanged.
 */

import {
  createContext, useContext, useState, useCallback, ReactNode,
} from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth, type UserProfile } from "@/contexts/AuthContext";

export type ImpersonatedRole = "org_admin" | "teacher" | "student";

export interface ImpersonationTarget {
  sessionId: string;         // Firestore doc id of the audit entry
  orgId: string;
  orgName: string;
  role: ImpersonatedRole;
  targetUid: string;
  targetName: string;
  targetEmail: string;
  startedAt: number;         // epoch ms
}

interface ImpersonationContextType {
  impersonation: ImpersonationTarget | null;
  /** Start impersonating — writes audit log, stores state, overrides auth profile. */
  startImpersonation: (
    actorEmail: string,
    target: Omit<ImpersonationTarget, "sessionId" | "startedAt">
  ) => Promise<void>;
  /** End impersonation — writes exit log, clears state, restores auth profile. */
  exitImpersonation: (actorEmail: string) => Promise<void>;
}

const ImpersonationContext = createContext<ImpersonationContextType>({
  impersonation: null,
  startImpersonation: async () => {},
  exitImpersonation: async () => {},
});

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const { setProfileOverride } = useAuth();
  const [impersonation, setImpersonation] = useState<ImpersonationTarget | null>(null);

  const startImpersonation = useCallback(
    async (
      actorEmail: string,
      target: Omit<ImpersonationTarget, "sessionId" | "startedAt">
    ) => {
      // Write audit entry — server-side Firestore rules verify super_admin role.
      const ref = await addDoc(collection(db, "super_admin_impersonation"), {
        actorEmail,
        orgId: target.orgId,
        orgName: target.orgName,
        role: target.role,
        targetUid: target.targetUid,
        targetName: target.targetName,
        targetEmail: target.targetEmail,
        action: "ENTER",
        startedAt: serverTimestamp(),
      });

      // Also log to the main activity feed.
      try {
        await addDoc(collection(db, "super_admin_logs"), {
          action: `Accessed "${target.orgName}" as ${target.role} (${target.targetEmail})`,
          actorEmail,
          targetId: target.targetUid,
          targetType: "impersonation",
          orgName: target.orgName,
          createdAt: serverTimestamp(),
        });
      } catch {
        // non-critical
      }

      const session: ImpersonationTarget = {
        ...target,
        sessionId: ref.id,
        startedAt: Date.now(),
      };

      // Override the AuthContext profile so every page/layout sees this user.
      const fakeProfile: UserProfile = {
        uid: target.targetUid,
        role: target.role,
        orgId: target.orgId,
        orgName: target.orgName,
        name: target.targetName,
        email: target.targetEmail,
        mustChangePassword: false,
      };
      setProfileOverride(fakeProfile);
      setImpersonation(session);
    },
    [setProfileOverride]
  );

  const exitImpersonation = useCallback(
    async (actorEmail: string) => {
      if (!impersonation) return;

      try {
        await addDoc(collection(db, "super_admin_impersonation"), {
          actorEmail,
          orgId: impersonation.orgId,
          orgName: impersonation.orgName,
          role: impersonation.role,
          targetUid: impersonation.targetUid,
          targetName: impersonation.targetName,
          targetEmail: impersonation.targetEmail,
          action: "EXIT",
          originalSessionId: impersonation.sessionId,
          durationMs: Date.now() - impersonation.startedAt,
          exitedAt: serverTimestamp(),
        });

        await addDoc(collection(db, "super_admin_logs"), {
          action: `Exited impersonation of "${impersonation.orgName}" (was ${impersonation.role})`,
          actorEmail,
          targetId: impersonation.targetUid,
          targetType: "impersonation",
          orgName: impersonation.orgName,
          createdAt: serverTimestamp(),
        });
      } catch {
        // non-critical — still clear state
      }

      // Restore the real super admin profile.
      setProfileOverride(null);
      setImpersonation(null);
    },
    [impersonation, setProfileOverride]
  );

  return (
    <ImpersonationContext.Provider
      value={{ impersonation, startImpersonation, exitImpersonation }}
    >
      {children}
    </ImpersonationContext.Provider>
  );
}

export const useImpersonation = () => useContext(ImpersonationContext);
