/**
 * Firestore-ready contracts for the people directory.
 *
 * These types intentionally describe application data, not Firebase SDK
 * snapshots. The repository boundary can map Firestore documents to these
 * records later without coupling page components to a persistence provider.
 */

export type DirectoryStatus = "active" | "inactive" | "invited";

export interface DirectoryCollectionParams {
  organizationId: string;
  search?: string;
}

export type DirectoryRecordKind = "guardian" | "administrative_staff";

export interface DirectoryCreateInput {
  organizationId: string;
  kind: DirectoryRecordKind;
  name: string;
  email: string;
  phone: string;
  role?: AdministrativeStaffRole;
}

export interface DirectoryCreateResult {
  id: string;
  temporaryPassword: string;
}

export interface DirectoryRecord {
  id: string;
  organizationId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface GuardianRecord extends DirectoryRecord {
  name: string;
  email: string;
  phone: string;
  linkedStudentIds: string[];
  status: DirectoryStatus;
  lastActiveAt?: string | null;
}

export type AdministrativeStaffRole =
  | "organization_admin"
  | "office_manager"
  | "finance"
  | "admissions"
  | "support"
  | "other";

export interface AdministrativeStaffRecord extends DirectoryRecord {
  name: string;
  email: string;
  phone: string;
  role: AdministrativeStaffRole;
  status: DirectoryStatus;
  lastActiveAt?: string | null;
}
