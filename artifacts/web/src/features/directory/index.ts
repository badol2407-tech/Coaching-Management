export {
  getAdministrativeStaffCollectionQueryKey,
  getGuardiansCollectionQueryKey,
  getStudentsCollectionQueryKey,
  useCreateDirectoryRecord,
  useAdministrativeStaffCollection,
  useGuardiansCollection,
  useSetGuardianStudentLink,
  useStudentsCollection,
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
  DirectoryRecordKind,
  DirectoryRecord,
  DirectoryStatus,
  GuardianStudentLinkInput,
  GuardianRecord,
  StudentLinkRecord,
} from "@/features/directory/types";
