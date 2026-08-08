/**
 * AccessPortal — lets a Super Admin view an organisation's portal
 * as a specific role (Org Admin / Teacher / Student).
 *
 * Security:
 *  • Only rendered inside SuperAdminLayout (role guard in App.tsx).
 *  • Entry/exit are logged server-side to `super_admin_impersonation`
 *    (Firestore rules require super_admin role to write there).
 *  • No passwords are shared or changed.
 */

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useImpersonation, type ImpersonatedRole } from "@/contexts/ImpersonationContext";
import { useListOrganizations } from "@/lib/super-admin-hooks";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, ShieldCheck, AlertTriangle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLES: { value: ImpersonatedRole; label: string; description: string }[] = [
  { value: "org_admin", label: "Org Admin", description: "View the admin dashboard for this organisation" },
  { value: "teacher", label: "Teacher", description: "View the teacher portal — select a specific teacher" },
  { value: "student", label: "Student", description: "View the student portal — select a specific student" },
];

function useOrgUsers(orgId: string | null, role: ImpersonatedRole | null) {
  return useQuery({
    queryKey: ["impersonation_users", orgId, role],
    enabled: !!orgId && !!role && role !== "org_admin",
    queryFn: async () => {
      if (!orgId || !role || role === "org_admin") return [];
      const snap = await getDocs(
        query(collection(db, "users"), where("orgId", "==", orgId), where("role", "==", role))
      );
      return snap.docs.map((d) => ({
        uid: d.id,
        name: (d.data() as any).name ?? "(no name)",
        email: (d.data() as any).email ?? "",
        role: (d.data() as any).role,
      }));
    },
  });
}

function useOrgAdmins(orgId: string | null) {
  return useQuery({
    queryKey: ["impersonation_org_admins", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(
        query(collection(db, "users"), where("orgId", "==", orgId), where("role", "==", "org_admin"))
      );
      return snap.docs.map((d) => ({
        uid: d.id,
        name: (d.data() as any).name ?? "(no name)",
        email: (d.data() as any).email ?? "",
      }));
    },
  });
}

export default function AccessPortal() {
  const { user } = useAuth();
  const { startImpersonation } = useImpersonation();
  const { toast } = useToast();

  const { data: orgs = [], isLoading: orgsLoading } = useListOrganizations();

  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<ImpersonatedRole | "">("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [entering, setEntering] = useState(false);

  const selectedOrg = (orgs as any[]).find((o: any) => o.id === selectedOrgId);

  const { data: orgUsers = [], isLoading: usersLoading } = useOrgUsers(
    selectedOrgId || null,
    (selectedRole || null) as ImpersonatedRole | null
  );

  const { data: orgAdmins = [], isLoading: adminsLoading } = useOrgAdmins(
    selectedRole === "org_admin" ? selectedOrgId || null : null
  );

  // For org_admin role, pick the first admin or let user choose
  const targetUsers =
    selectedRole === "org_admin" ? orgAdmins : (orgUsers as any[]);

  const selectedUser = (targetUsers as any[]).find((u: any) => u.uid === selectedUserId);

  // When org changes reset downstream
  function handleOrgChange(orgId: string) {
    setSelectedOrgId(orgId);
    setSelectedRole("");
    setSelectedUserId("");
  }

  function handleRoleChange(role: ImpersonatedRole) {
    setSelectedRole(role);
    setSelectedUserId("");
  }

  const canAccess =
    !!selectedOrgId &&
    !!selectedRole &&
    (selectedRole === "org_admin" ? targetUsers.length > 0 && !!selectedUserId : !!selectedUserId);

  async function handleAccess() {
    if (!canAccess || !selectedOrg || !selectedUser) return;
    setEntering(true);
    try {
      await startImpersonation(user?.email ?? "", {
        orgId: selectedOrgId,
        orgName: selectedOrg.name,
        role: selectedRole as ImpersonatedRole,
        targetUid: selectedUser.uid,
        targetName: selectedUser.name,
        targetEmail: selectedUser.email,
      });
      // ImpersonationContext will update; App.tsx will render the portal.
    } catch (err: any) {
      toast({
        title: "Failed to access portal",
        description: err?.message ?? "Something went wrong",
        variant: "destructive",
      });
      setEntering(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Access Organisation Portal</h1>
        <p className="text-muted-foreground">
          View any organisation's portal as a specific role. Your Super Admin session remains
          active — a full audit log is recorded.
        </p>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 text-sm">
        <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-semibold">Audit-logged access</p>
          <p>Every portal access (entry and exit) is recorded to Firestore with your email, the
          organisation, role, target user, and timestamp. You remain signed in as Super Admin
          throughout — no passwords are shared or changed.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" /> Portal Access</CardTitle>
          <CardDescription>Select an organisation, role, and user to impersonate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Step 1: Select Org */}
          <div className="space-y-1.5">
            <Label>1. Select Organisation</Label>
            {orgsLoading ? (
              <div className="h-10 animate-pulse rounded-md bg-muted" />
            ) : (
              <Select value={selectedOrgId} onValueChange={handleOrgChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an organisation…" />
                </SelectTrigger>
                <SelectContent>
                  {(orgs as any[]).map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center gap-2">
                        <span>{org.name}</span>
                        {org.status === "paused" && (
                          <Badge variant="secondary" className="text-xs">Paused</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Step 2: Select Role */}
          {selectedOrgId && (
            <div className="space-y-1.5">
              <Label>2. Select Role</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => handleRoleChange(r.value)}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      selectedRole === r.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select User */}
          {selectedOrgId && selectedRole && (
            <div className="space-y-1.5">
              <Label>
                3. Select {selectedRole === "org_admin" ? "Org Admin" : selectedRole === "teacher" ? "Teacher" : "Student"}
              </Label>
              {(usersLoading || adminsLoading) ? (
                <div className="h-10 animate-pulse rounded-md bg-muted" />
              ) : targetUsers.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  No {selectedRole === "org_admin" ? "org admins" : selectedRole === "teacher" ? "teachers" : "students"} found in this organisation.
                </div>
              ) : (
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(targetUsers as any[]).map((u: any) => (
                      <SelectItem key={u.uid} value={u.uid}>
                        <div>
                          <span className="font-medium">{u.name}</span>
                          <span className="text-muted-foreground ml-1.5 text-xs">{u.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Warning about paused org */}
          {selectedOrg?.status === "paused" && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/30 p-3 text-sm text-orange-700 dark:text-orange-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              This organisation is paused. You can still view its portal for audit purposes.
            </div>
          )}

          {/* Access button */}
          <Button
            onClick={handleAccess}
            disabled={!canAccess || entering}
            className="w-full gap-2"
            size="lg"
          >
            {entering ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Entering Portal…</>
            ) : (
              <><Eye className="h-4 w-4" /> Access Portal</>
            )}
          </Button>

          {!canAccess && selectedOrgId && selectedRole && targetUsers.length > 0 && !selectedUserId && (
            <p className="text-xs text-muted-foreground text-center">Select a user to continue</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
