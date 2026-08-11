import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  doc,
} from "firebase/firestore";
import { createFirebaseAuthUser, generateTempPassword } from "@/lib/auth-utils";
import { db } from "@/lib/firebase";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  DirectoryCreateInput,
  DirectoryCreateResult,
  GuardianRecord,
} from "@/features/directory/types";

/**
 * The directory is backed by the existing organization-scoped user profiles.
 * Keeping this provider behind the repository boundary lets the pages stay
 * independent from Firebase while still making the add flows persistent.
 */
export interface DirectoryDataProvider {
  listGuardians(params: DirectoryCollectionParams): Promise<GuardianRecord[]>;
  listAdministrativeStaff(
    params: DirectoryCollectionParams,
  ): Promise<AdministrativeStaffRecord[]>;
  createRecord(input: DirectoryCreateInput): Promise<DirectoryCreateResult>;
}

export const placeholderDirectoryDataProvider: DirectoryDataProvider = {
  async listGuardians(params) {
    const rows = await listOrganizationUsers(params.organizationId, "guardian");
    return filterDirectoryRows(rows, params.search) as GuardianRecord[];
  },

  async listAdministrativeStaff(params) {
    const rows = await listOrganizationUsers(
      params.organizationId,
      "administrative_staff",
    );
    return filterDirectoryRows(rows, params.search).map((row) => ({
      ...row,
      role: row.staffRole ?? "other",
    })) as AdministrativeStaffRecord[];
  },

  async createRecord(input) {
    const email = input.email.trim().toLowerCase();
    const temporaryPassword = generateTempPassword();
    const uid = await createFirebaseAuthUser(email, temporaryPassword);

    await setDoc(doc(db, "users", uid), {
      role: input.kind,
      orgId: input.organizationId,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      ...(input.kind === "guardian"
        ? { linkedStudentIds: [] }
        : { staffRole: input.role ?? "other" }),
      status: "active",
      mustChangePassword: true,
      createdByAdmin: true,
      createdAt: serverTimestamp(),
    });

    return { id: uid, temporaryPassword };
  },
};

type DirectoryUserRow = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "invited";
  createdAt?: string | null;
  updatedAt?: string | null;
  lastActiveAt?: string | null;
  linkedStudentIds?: string[];
  staffRole?: AdministrativeStaffRecord["role"];
};

async function listOrganizationUsers(
  organizationId: string,
  role: "guardian" | "administrative_staff",
): Promise<DirectoryUserRow[]> {
  const snapshot = await getDocs(
    query(collection(db, "users"), where("orgId", "==", organizationId)),
  );

  return snapshot.docs
    .map((userDoc) => {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        organizationId,
        name: typeof data.name === "string" ? data.name : "",
        email: typeof data.email === "string" ? data.email : "",
        phone: typeof data.phone === "string" ? data.phone : "",
        status:
          data.status === "inactive" || data.status === "invited"
            ? data.status
            : "active",
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
        lastActiveAt: toIsoString(data.lastActiveAt),
        linkedStudentIds: Array.isArray(data.linkedStudentIds)
          ? data.linkedStudentIds
          : [],
        staffRole: data.staffRole,
        role: data.role,
      } as DirectoryUserRow & { role?: string };
    })
    .filter((user) => user.role === role)
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

function filterDirectoryRows(rows: DirectoryUserRow[], search = "") {
  const normalizedSearch = search.trim().toLowerCase();
  if (!normalizedSearch) return rows;

  return rows.filter((row) =>
    [row.name, row.email, row.phone].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }
  return typeof value === "string" ? value : null;
}
