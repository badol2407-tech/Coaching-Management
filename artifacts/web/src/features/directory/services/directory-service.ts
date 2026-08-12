import {
  createDirectoryRepository,
  type DirectoryRepository,
} from "@/features/directory/repositories/directory-repository";
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
  listStudents(params: DirectoryCollectionParams): Promise<StudentLinkRecord[]>;
  setGuardianStudentLink(input: GuardianStudentLinkInput): Promise<void>;
  updateGuardian(input: GuardianUpdateInput): Promise<void>;
  setGuardianStatus(input: GuardianStatusInput): Promise<void>;
  deleteGuardian(input: GuardianDeleteInput): Promise<void>;
  createRecord(input: DirectoryCreateInput): Promise<DirectoryCreateResult>;
}

export function createDirectoryService(
  repository: DirectoryRepository = createDirectoryRepository(),
): DirectoryService {
  return {
    listGuardians: (params) => repository.listGuardians(params),
    listAdministrativeStaff: (params) =>
      repository.listAdministrativeStaff(params),
    listStudents: (params) => repository.listStudents(params),
    setGuardianStudentLink: (input) => repository.setGuardianStudentLink(input),
    updateGuardian: (input) => repository.updateGuardian(input),
    setGuardianStatus: (input) => repository.setGuardianStatus(input),
    deleteGuardian: (input) => repository.deleteGuardian(input),
    createRecord: (input) => repository.createRecord(input),
  };
}

export const directoryService = createDirectoryService();
