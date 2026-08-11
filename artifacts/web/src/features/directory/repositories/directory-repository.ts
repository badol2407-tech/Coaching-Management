import {
  placeholderDirectoryDataProvider,
  type DirectoryDataProvider,
} from "@/features/directory/providers/placeholder-directory-data-provider";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  GuardianRecord,
} from "@/features/directory/types";

/**
 * Repository boundary for organization-scoped directory collections.
 *
 * Only collection reads are defined for the preparation phase. Mutations are
 * intentionally absent until the product defines its Firestore write flows
 * and security rules.
 */
export interface DirectoryRepository {
  listGuardians(params: DirectoryCollectionParams): Promise<GuardianRecord[]>;
  listAdministrativeStaff(
    params: DirectoryCollectionParams,
  ): Promise<AdministrativeStaffRecord[]>;
}

export function createDirectoryRepository(
  provider: DirectoryDataProvider = placeholderDirectoryDataProvider,
): DirectoryRepository {
  return {
    listGuardians: (params) => provider.listGuardians(params),
    listAdministrativeStaff: (params) =>
      provider.listAdministrativeStaff(params),
  };
}
