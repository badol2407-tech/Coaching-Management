import {
  placeholderDirectoryDataProvider,
  type DirectoryDataProvider,
} from "@/features/directory/providers/placeholder-directory-data-provider";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  DirectoryCreateInput,
  DirectoryCreateResult,
  GuardianStudentLinkInput,
  GuardianRecord,
  StudentLinkRecord,
} from "@/features/directory/types";

/**
 * Repository boundary for organization-scoped directory collections.
 *
 * Reads and writes stay behind the repository boundary so pages do not depend
 * on a particular persistence provider.
 */
export interface DirectoryRepository {
  listGuardians(params: DirectoryCollectionParams): Promise<GuardianRecord[]>;
  listAdministrativeStaff(
    params: DirectoryCollectionParams,
  ): Promise<AdministrativeStaffRecord[]>;
  listStudents(params: DirectoryCollectionParams): Promise<StudentLinkRecord[]>;
  setGuardianStudentLink(input: GuardianStudentLinkInput): Promise<void>;
  createRecord(input: DirectoryCreateInput): Promise<DirectoryCreateResult>;
}

export function createDirectoryRepository(
  provider: DirectoryDataProvider = placeholderDirectoryDataProvider,
): DirectoryRepository {
  return {
    listGuardians: (params) => provider.listGuardians(params),
    listAdministrativeStaff: (params) =>
      provider.listAdministrativeStaff(params),
    listStudents: (params) => provider.listStudents(params),
    setGuardianStudentLink: (input) => provider.setGuardianStudentLink(input),
    createRecord: (input) => provider.createRecord(input),
  };
}
