import {
  placeholderDirectoryDataProvider,
  type DirectoryDataProvider,
} from "@/features/directory/providers/placeholder-directory-data-provider";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  DirectoryCreateInput,
  DirectoryCreateResult,
  GuardianRecord,
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
  createRecord(input: DirectoryCreateInput): Promise<DirectoryCreateResult>;
}

export function createDirectoryRepository(
  provider: DirectoryDataProvider = placeholderDirectoryDataProvider,
): DirectoryRepository {
  return {
    listGuardians: (params) => provider.listGuardians(params),
    listAdministrativeStaff: (params) =>
      provider.listAdministrativeStaff(params),
    createRecord: (input) => provider.createRecord(input),
  };
}
