import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useListAllUsers, useUpdateUser, useDeleteUser, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Search, Edit, Trash2, MailCheck, Ban, CheckCircle,
  Loader2, User, ChevronDown, ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700 border-red-200",
  org_admin: "bg-purple-100 text-purple-700 border-purple-200",
  teacher: "bg-blue-100 text-blue-700 border-blue-200",
  student: "bg-green-100 text-green-700 border-green-200",
};

// ── Edit User Sheet ────────────────────────────────────────────────────────────

function EditUserSheet({
  open, onClose, user: targetUser,
}: {
  open: boolean;
  onClose: () => void;
  user: any | null;
}) {
  const { user: adminUser } = useAuth();
  const updateUser = useUpdateUser();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: targetUser?.name ?? "",
    email: targetUser?.email ?? "",
    role: targetUser?.role ?? "student",
    orgId: targetUser?.orgId ?? "",
  });
  const [saving, setSaving] = useState(false);

  if (!targetUser) return null;

  async function handleSave() {
    setSaving(true);
    try {
      await updateUser.mutateAsync({
        uid: targetUser.uid,
        data: { name: form.name, role: form.role, orgId: form.orgId || null },
      });
      await logSuperAdminAction({
        action: `Edited user "${targetUser.email}"`,
        actorEmail: adminUser?.email ?? "",
        targetId: targetUser.uid,
        targetType: "user",
        details: { name: form.name, role: form.role, orgId: form.orgId },
      });
      toast({ title: "User updated" });
      onClose();
    } catch {
      toast({ title: "Error updating user", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader><SheetTitle>Edit User</SheetTitle></SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-1">
            <Label>Email (display only)</Label>
            <Input value={form.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email is managed by Firebase Auth — change via Firebase console.</p>
          </div>
          <div className="space-y-1">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="org_admin">Org Admin</SelectItem>
                <SelectItem value="super_admin" disabled>Super Admin (restricted)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Organization ID</Label>
            <Input value={form.orgId} onChange={(e) => setForm((f) => ({ ...f, orgId: e.target.value }))} placeholder="Leave blank for no org" />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Reset Password Confirm Dialog ──────────────────────────────────────────────

function ResetPasswordDialog({
  open, onClose, email,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
}) {
  const { user: adminUser } = useAuth();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      await logSuperAdminAction({ action: `Sent password reset to "${email}"`, actorEmail: adminUser?.email ?? "", targetType: "user" });
      toast({ title: "Password reset email sent", description: email });
      onClose();
    } catch (err: any) {
      toast({ title: "Error sending reset email", description: err?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Send a password reset email to <strong>{email}</strong>?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSend} disabled={sending} className="flex-1 gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
            {sending ? "Sending…" : "Send Reset Email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── User Row ───────────────────────────────────────────────────────────────────

function UserRow({
  user: u,
  onEdit,
  onDelete,
  onReset,
  onToggleDisable,
}: {
  user: any;
  onEdit: (u: any) => void;
  onDelete: (u: any) => void;
  onReset: (email: string) => void;
  onToggleDisable: (u: any) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={u.disabled ? "opacity-60 border-dashed" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium truncate">{u.name || "(no name)"}</p>
              <Badge variant="outline" className={`text-xs capitalize ${ROLE_COLORS[u.role] ?? ""}`}>{u.role}</Badge>
              {u.disabled && <Badge variant="secondary" className="text-xs">Disabled</Badge>}
            </div>
            <p className="text-sm text-muted-foreground truncate">{u.email}</p>
            {u.orgId && <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">org: {u.orgId}</p>}
          </div>
          <button onClick={() => setExpanded((v) => !v)} className="text-muted-foreground hover:text-foreground shrink-0 p-1">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(u)} className="gap-1 h-7 text-xs">
              <Edit className="h-3 w-3" /> Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onReset(u.email)} className="gap-1 h-7 text-xs">
              <MailCheck className="h-3 w-3" /> Reset Password
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={() => onToggleDisable(u)}
              className={`gap-1 h-7 text-xs ${u.disabled ? "text-green-600" : "text-amber-600"}`}
            >
              {u.disabled ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
              {u.disabled ? "Enable" : "Disable"}
            </Button>
            {u.role !== "super_admin" && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(u)} className="gap-1 h-7 text-xs">
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

const ROLE_FILTERS = ["all", "super_admin", "org_admin", "teacher", "student"];

export default function ManageUsers() {
  const { user: adminUser } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { data: users = [], isLoading } = useListAllUsers(search);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [editUser, setEditUser] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = (users as any[]).filter((u: any) =>
    roleFilter === "all" || u.role === roleFilter
  );

  async function handleDelete(u: any) {
    if (u.role === "super_admin") { toast({ title: "Cannot delete a Super Admin", variant: "destructive" }); return; }
    if (!confirm(`Delete user "${u.email}"? This removes the Firestore profile only (not Firebase Auth).`)) return;
    deleteUser.mutate({ uid: u.uid }, {
      onSuccess: async () => {
        await logSuperAdminAction({ action: `Deleted user "${u.email}"`, actorEmail: adminUser?.email ?? "", targetId: u.uid, targetType: "user" });
        toast({ title: "User profile deleted" });
      },
      onError: () => toast({ title: "Error deleting user", variant: "destructive" }),
    });
  }

  async function handleToggleDisable(u: any) {
    const newDisabled = !u.disabled;
    await updateUser.mutateAsync({ uid: u.uid, data: { disabled: newDisabled } });
    await logSuperAdminAction({ action: `${newDisabled ? "Disabled" : "Enabled"} user "${u.email}"`, actorEmail: adminUser?.email ?? "", targetId: u.uid, targetType: "user" });
    toast({ title: newDisabled ? "User disabled" : "User enabled" });
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all users across all organizations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, email, UID, org ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {ROLE_FILTERS.map((r) => (
            <Button key={r} size="sm" variant={roleFilter === r ? "default" : "outline"} onClick={() => setRoleFilter(r)} className="capitalize text-xs">
              {r === "all" ? "All Roles" : r.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="text-sm text-muted-foreground">
        Showing {filtered.length} of {(users as any[]).length} users
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Card key={i}><CardContent className="h-16 animate-pulse bg-muted/30 mt-4" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><User className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>No users found.</p></CardContent></Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((u: any) => (
            <UserRow
              key={u.uid}
              user={u}
              onEdit={(u) => { setEditUser(u); setEditOpen(true); }}
              onDelete={handleDelete}
              onReset={(email) => { setResetEmail(email); setResetOpen(true); }}
              onToggleDisable={handleToggleDisable}
            />
          ))}
        </div>
      )}

      <EditUserSheet open={editOpen} onClose={() => { setEditOpen(false); setEditUser(null); }} user={editUser} />
      <ResetPasswordDialog open={resetOpen} onClose={() => { setResetOpen(false); setResetEmail(""); }} email={resetEmail} />
    </div>
  );
}
