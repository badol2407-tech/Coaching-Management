export {
  getAdministrativeStaffCollectionQueryKey,
  getGuardiansCollectionQueryKey,
  getStudentsCollectionQueryKey,
  useCreateDirectoryRecord,
  useDeleteGuardian,
  useAdministrativeStaffCollection,
  useGuardiansCollection,
  useSetGuardianStatus,
  useSetGuardianStudentLink,
  useStudentsCollection,
  useUpdateGuardian,
} from "@/features/directory/hooks/useDirectoryCollections";
export {
  createDirectoryRepository,
  type DirectoryRepository,
} from "@/features/directory/repositories/directory-repository";
export {
  placeholderDirectoryDataProvider,
  type DirectoryDataProvider,
} from "@/features/directory/providers/placeholder-directory-data-provider";
export {
  createDirectoryService,
  directoryService,
  type DirectoryService,
} from "@/features/directory/services/directory-service";
export type {
  AdministrativeStaffRecord,
  AdministrativeStaffRole,
  DirectoryCollectionParams,
  DirectoryCreateInput,
  DirectoryCreateResult,
  GuardianDeleteInput,
  GuardianStatusInput,
  DirectoryRecordKind,
  DirectoryRecord,
  DirectoryStatus,
  GuardianStudentLinkInput,
  GuardianRecord,
  GuardianUpdateInput,
  StudentLinkRecord,
} from "@/features/directory/types";
