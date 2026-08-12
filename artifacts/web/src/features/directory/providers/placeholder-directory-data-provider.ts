import {
  collection,
  getDocs,
  query,
  runTransaction,
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
  GuardianDeleteInput,
  GuardianStatusInput,
  GuardianStudentLinkInput,
  GuardianRecord,
  GuardianUpdateInput,
  StudentLinkRecord,
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
  listStudents(params: DirectoryCollectionParams): Promise<StudentLinkRecord[]>;
  setGuardianStudentLink(input: GuardianStudentLinkInput): Promise<void>;
  updateGuardian(input: GuardianUpdateInput): Promise<void>;
  setGuardianStatus(input: GuardianStatusInput): Promise<void>;
  deleteGuardian(input: GuardianDeleteInput): Promise<void>;
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

  async listStudents(params) {
    const snapshot = await getDocs(
      collection(db, "organizations", params.organizationId, "students"),
    );
    const normalizedSearch = params.search?.trim().toLowerCase() ?? "";

    return snapshot.docs
      .map((studentDoc) => {
        const data = studentDoc.data();
        return {
          id: studentDoc.id,
          name: typeof data.name === "string" ? data.name : "Unnamed student",
          email: (data.email as string | null | undefined) ?? null,
          phone: (data.phone as string | null | undefined) ?? null,
          className: (data.className as string | null | undefined) ?? null,
          section: (data.section as string | null | undefined) ?? null,
          batch: (data.batch as string | null | undefined) ?? null,
          rollNumber: (data.rollNumber as string | null | undefined) ?? null,
          status:
            data.status === "inactive" || data.status === "invited"
              ? data.status
              : "active",
        } satisfies StudentLinkRecord;
      })
      .filter((student) => {
        if (!normalizedSearch) return true;
        return [
          student.name,
          student.email,
          student.phone,
          student.rollNumber,
          student.className,
          student.batch,
        ].some((value) => value?.toLowerCase().includes(normalizedSearch));
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async setGuardianStudentLink(input) {
    const guardianRef = doc(db, "users", input.guardianId);
    const studentRef = doc(
      db,
      "organizations",
      input.organizationId,
      "students",
      input.studentId,
    );

    await runTransaction(db, async (transaction) => {
      const guardianSnapshot = await transaction.get(guardianRef);
      const studentSnapshot = await transaction.get(studentRef);

      if (!guardianSnapshot.exists()) {
        throw new Error("Guardian account was not found.");
      }
      if (!studentSnapshot.exists()) {
        throw new Error("Student record was not found.");
      }

      const guardianData = guardianSnapshot.data();
      if (
        guardianData.role !== "guardian" ||
        guardianData.orgId !== input.organizationId
      ) {
        throw new Error(
          "This guardian does not belong to the selected organization.",
        );
      }

      const existingIds = [
        ...(Array.isArray(guardianData.linkedStudentIds)
          ? guardianData.linkedStudentIds
          : []),
        ...(Array.isArray(guardianData.studentIds)
          ? guardianData.studentIds
          : []),
        ...(Array.isArray(guardianData.childrenIds)
          ? guardianData.childrenIds
          : []),
        ...(typeof guardianData.studentId === "string"
          ? [guardianData.studentId]
          : []),
      ].filter((id): id is string => typeof id === "string" && id.length > 0);

      const nextIds = new Set(existingIds);
      if (input.linked) {
        nextIds.add(input.studentId);
      } else {
        nextIds.delete(input.studentId);
      }

      transaction.update(guardianRef, {
        linkedStudentIds: [...nextIds],
        updatedAt: serverTimestamp(),
      });
    });
  },

  async updateGuardian(input) {
    const guardianRef = doc(db, "users", input.guardianId);

    await runTransaction(db, async (transaction) => {
      const guardianSnapshot = await transaction.get(guardianRef);
      assertGuardianForOrganization(guardianSnapshot, input.organizationId);

      const name = input.name.trim();
      const phone = input.phone.trim();
      if (name.length < 2) {
        throw new Error("Guardian name must be at least 2 characters.");
      }
      if (!phone) {
        throw new Error("Guardian phone number is required.");
      }

      transaction.update(guardianRef, {
        name,
        phone,
        updatedAt: serverTimestamp(),
      });
    });
  },

  async setGuardianStatus(input) {
    const guardianRef = doc(db, "users", input.guardianId);

    await runTransaction(db, async (transaction) => {
      const guardianSnapshot = await transaction.get(guardianRef);
      assertGuardianForOrganization(guardianSnapshot, input.organizationId);
      transaction.update(guardianRef, {
        status: input.status,
        updatedAt: serverTimestamp(),
      });
    });
  },

  async deleteGuardian(input) {
    const guardianRef = doc(db, "users", input.guardianId);

    await runTransaction(db, async (transaction) => {
      const guardianSnapshot = await transaction.get(guardianRef);
      assertGuardianForOrganization(guardianSnapshot, input.organizationId);
      transaction.delete(guardianRef);
    });
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

function assertGuardianForOrganization(
  snapshot: {
    exists: () => boolean;
    data: () => unknown;
  },
  organizationId: string,
) {
  if (!snapshot.exists()) {
    throw new Error("Guardian account was not found.");
  }

  const data = snapshot.data() as Record<string, unknown>;
  if (data.role !== "guardian" || data.orgId !== organizationId) {
    throw new Error(
      "This guardian does not belong to the selected organization.",
    );
  }
}

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
          ? [
              ...new Set(
                data.linkedStudentIds.filter(
                  (id): id is string => typeof id === "string" && id.length > 0,
                ),
              ),
            ]
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
