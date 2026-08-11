import {
  createDirectoryRepository,
  type DirectoryRepository,
} from "@/features/directory/repositories/directory-repository";
import type {
  AdministrativeStaffRecord,
  DirectoryCollectionParams,
  DirectoryCreateInput,
  DirectoryCreateResult,
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
  createRecord(input: DirectoryCreateInput): Promise<DirectoryCreateResult>;
}

export function createDirectoryService(
  repository: DirectoryRepository = createDirectoryRepository(),
): DirectoryService {
  return {
    listGuardians: (params) => repository.listGuardians(params),
    listAdministrativeStaff: (params) =>
      repository.listAdministrativeStaff(params),
    createRecord: (input) => repository.createRecord(input),
  };
}

export const directoryService = createDirectoryService();
