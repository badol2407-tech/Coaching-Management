import {
  createDirectoryRepository,
  type DirectoryRepository,
} from "@/features/directory/repositories/directory-repository";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  GuardianRecord,
} from "@/features/directory/types";

/**
 * Application service for directory collection reads.
 *
 * Keeping this layer separate from hooks makes future authorization,
 * normalization, and provider-specific error handling testable without
 * moving persistence concerns into React components.
 */
export interface DirectoryService {
  listGuardians(params: DirectoryCollectionParams): Promise<GuardianRecord[]>;
  listAdministrativeStaff(
    params: DirectoryCollectionParams,
  ): Promise<AdministrativeStaffRecord[]>;
}

export function createDirectoryService(
  repository: DirectoryRepository = createDirectoryRepository(),
): DirectoryService {
  return {
    listGuardians: (params) => repository.listGuardians(params),
    listAdministrativeStaff: (params) =>
      repository.listAdministrativeStaff(params),
  };
}

export const directoryService = createDirectoryService();
