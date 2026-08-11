import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { directoryService } from "@/features/directory/services/directory-service";
import type {
  AdministrativeStaffRecord,
  GuardianRecord,
} from "@/features/directory/types";

interface DirectoryCollectionOptions {
  search?: string;
  enabled?: boolean;
}

export const getGuardiansCollectionQueryKey = (
  organizationId?: string | null,
  search = "",
) => ["directory", "guardians", organizationId ?? "", search];

export const getAdministrativeStaffCollectionQueryKey = (
  organizationId?: string | null,
  search = "",
) => ["directory", "administrative-staff", organizationId ?? "", search];

export function useGuardiansCollection(
  options: DirectoryCollectionOptions = {},
) {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.orgId;
  const search = options.search?.trim() ?? "";

  return useQuery<GuardianRecord[]>({
    queryKey: getGuardiansCollectionQueryKey(organizationId, search),
    queryFn: () =>
      directoryService.listGuardians({
        organizationId: organizationId!,
        search,
      }),
    enabled: Boolean(organizationId) && options.enabled !== false,
  });
}

export function useAdministrativeStaffCollection(
  options: DirectoryCollectionOptions = {},
) {
  const { userProfile } = useAuth();
  const organizationId = userProfile?.orgId;
  const search = options.search?.trim() ?? "";

  return useQuery<AdministrativeStaffRecord[]>({
    queryKey: getAdministrativeStaffCollectionQueryKey(organizationId, search),
    queryFn: () =>
      directoryService.listAdministrativeStaff({
        organizationId: organizationId!,
        search,
      }),
    enabled: Boolean(organizationId) && options.enabled !== false,
  });
}
