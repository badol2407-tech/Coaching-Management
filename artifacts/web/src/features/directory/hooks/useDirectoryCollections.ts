import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { directoryService } from "@/features/directory/services/directory-service";
import type {
  AdministrativeStaffRecord,
  DirectoryCreateInput,
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

export function useCreateDirectoryRecord() {
  const queryClient = useQueryClient();
  const { userProfile } = useAuth();

  return useMutation({
    mutationFn: (input: Omit<DirectoryCreateInput, "organizationId">) => {
      const organizationId = userProfile?.orgId;
      if (!organizationId) throw new Error("No organization is selected.");
      return directoryService.createRecord({ ...input, organizationId });
    },
    onSuccess: (_, input) => {
      const organizationId = userProfile?.orgId;
      if (!organizationId) return;
      const queryKey =
        input.kind === "guardian"
          ? getGuardiansCollectionQueryKey(organizationId)
          : getAdministrativeStaffCollectionQueryKey(organizationId);
      void queryClient.invalidateQueries({ queryKey: queryKey.slice(0, 3) });
    },
  });
}
