import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  GuardianRecord,
} from "@/features/directory/types";

/**
 * The temporary provider deliberately returns an honest empty collection.
 *
 * It is the only provider used by the directory service today. A future
 * Firestore provider can implement the same read-only contract without
 * changing the hooks or pages. No Firebase SDK is imported here by design.
 */
export interface DirectoryDataProvider {
  listGuardians(params: DirectoryCollectionParams): Promise<GuardianRecord[]>;
  listAdministrativeStaff(
    params: DirectoryCollectionParams,
  ): Promise<AdministrativeStaffRecord[]>;
}

export const placeholderDirectoryDataProvider: DirectoryDataProvider = {
  async listGuardians() {
    return [];
  },

  async listAdministrativeStaff() {
    return [];
  },
};
