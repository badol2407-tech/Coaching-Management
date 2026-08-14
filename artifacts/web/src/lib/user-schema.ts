import {
  mapFirebaseAuthRole,
  type UserRole,
} from "./roles";
import type { SetupWizardState } from "./setup-wizard";

export interface FirestoreUserProfile {
  role: UserRole;
  orgId: string | null;
  name: string;
  email: string;
  photoUrl?: string | null;
  studentId?: string;
  linkedStudentIds?: string[];
  studentIds?: string[];
  childrenIds?: string[];
  mustChangePassword?: boolean;
  setupWizard?: SetupWizardState;
  [key: string]: unknown;
}

/**
 * Parse the persisted users/{uid} document before it becomes an application
 * profile. Unknown roles fail closed instead of reaching a layout or route.
 */
export function parseFirestoreUserProfile(value: unknown): FirestoreUserProfile | null {
  if (!value || typeof value !== "object") return null;

  const raw = value as Record<string, unknown>;
  const role = mapFirebaseAuthRole(raw.role);
  const orgId = raw.orgId === undefined ? null : raw.orgId;

  if (
    !role ||
    (typeof orgId !== "string" && orgId !== null) ||
    typeof raw.name !== "string" ||
    typeof raw.email !== "string"
  ) {
    return null;
  }

  return {
    ...raw,
    role,
    orgId,
    name: raw.name,
    email: raw.email,
  } as FirestoreUserProfile;
}