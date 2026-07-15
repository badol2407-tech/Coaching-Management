import { useState } from "react";
import { useListAllUsers, useUpdateUser, useDeleteUser, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, UserCheck, MailCheck, Trash2, ShieldOff, ShieldCheck } from "lucide-react";

export default function OrgAdmins() {
  const [search, setSearch] = useState("");
  const { data: allUsers = [], isLoading } = useListAllUsers(search || undefined);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { user } = useAuth();
  const { toast } = useToast();

  const admins = allUsers.filter((u: any) => u.role === "org_admin");

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password reset email sent", description: email });
    } catch {
      toast({ title: "Failed", variant: "destructive" });
    }
  };

  const handleToggleDisable = async (u: any) => {
    await updateUser.mutateAsync({ uid: u.uid, data: { disabled: !u.disabled } });
    await logSuperAdminAction({ action: u.disabled ? "enable_user" : "disable_user", actorEmail: user?.email ?? "", targetId: u.uid });
    toast({ title: u.disabled ? "Account enabled" : "Account disabled" });
  };

  const handleDelete = async (u: any) => {
    if (!confirm(`Delete "${u.name || u.email}"? This cannot be undone.`)) return;
    await deleteUser.mutateAsync({ uid: u.uid });
    await logSuperAdminAction({ action: "delete_user", actorEmail: user?.email ?? "", targetId: u.uid });
    toast({ title: "User deleted" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Admins</h1>
        <p className="text-muted-foreground text-sm mt-1">All org_admin accounts across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total Admins</p><p className="text-3xl font-bold mt-1">{admins.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold mt-1 text-green-500">{admins.filter((u: any) => !u.disabled).length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Disabled</p><p className="text-3xl font-bold mt-1 text-red-500">{admins.filter((u: any) => u.disabled).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base flex items-center gap-2"><UserCheck className="h-4 w-4" /> Org Admin Accounts</CardTitle>
            <div className="relative ml-auto w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by name, email…" className="pl-8 h-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
          ) : admins.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No org admins found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Name</th>
                    <th className="text-left py-2 pr-4 font-medium">Email</th>
                    <th className="text-left py-2 pr-4 font-medium">Org ID</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((u: any) => (
                    <tr key={u.uid} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 pr-4 font-medium">{u.name || "—"}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{u.email}</td>
                      <td className="py-2.5 pr-4 font-mono text-xs text-muted-foreground">{u.orgId || "—"}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant={u.disabled ? "destructive" : "default"} className="text-xs">
                          {u.disabled ? "Disabled" : "Active"}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" title="Send password reset" onClick={() => handleResetPassword(u.email)}><MailCheck className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" title={u.disabled ? "Enable" : "Disable"} onClick={() => handleToggleDisable(u)}>
                            {u.disabled ? <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> : <ShieldOff className="h-3.5 w-3.5 text-amber-500" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" title="Delete" onClick={() => handleDelete(u)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
