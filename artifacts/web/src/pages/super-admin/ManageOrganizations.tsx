import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  useListOrganizations, useCreateOrganization, useDeleteOrganization,
  useUpdateOrganization, logSuperAdminAction, useAddPaymentRecord,
} from "@/lib/super-admin-hooks";
import { createFirebaseAuthUser, generateTempPassword, buildCredentialMessage, getLoginUrl } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Trash2, Copy, Loader2, Building2,
  CheckCircle2, Mail, MessageCircle, Eye, EyeOff,
  RefreshCw, ShieldCheck, PauseCircle, PlayCircle,
  Edit, DollarSign, CreditCard, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  { value: "free", label: "Free Trial", price: 0 },
  { value: "basic", label: "Basic — ৳499/mo", price: 499 },
  { value: "pro", label: "Pro — ৳999/mo", price: 999 },
];

// ── Credentials Dialog ─────────────────────────────────────────────────────────

function CredentialsDialog({
  open, onClose, creds,
}: {
  open: boolean;
  onClose: () => void;
  creds: { orgName: string; name: string; email: string; password: string } | null;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  if (!creds) return null;

  const message = buildCredentialMessage({
    orgName: creds.orgName, name: creds.name, role: "Teacher",
    email: creds.email, password: creds.password, loginUrl: getLoginUrl(),
  }).replace("Role: Teacher", "Role: Organization Admin");

  function copyAll() {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!" });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <DialogTitle>Organization Created!</DialogTitle>
              <DialogDescription className="text-xs">Share these credentials with the org admin</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-sm font-mono">
          <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="font-medium">{creds.orgName}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{creds.email}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Temp Password</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-primary">{creds.password}</span>
              <button onClick={() => { navigator.clipboard.writeText(creds.password); toast({ title: "Password copied!" }); }} className="text-muted-foreground hover:text-foreground">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><Badge variant="secondary">Organization Admin</Badge></div>
        </div>
        <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          The admin will be asked to set a new password on their first login.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => { const s = encodeURIComponent(`Your ${creds.orgName} EduTrack account`); window.open(`mailto:${creds.email}?subject=${s}&body=${encodeURIComponent(message)}`); }} className="gap-2">
            <Mail className="h-4 w-4" /> Send via Email
          </Button>
          <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={copyAll} className="w-full gap-2 text-xs">
          {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy Full Message"}
        </Button>
        <Button onClick={onClose} className="w-full">Done</Button>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Organization Sheet ────────────────────────────────────────────────────

function EditOrgSheet({
  open, onClose, org,
}: {
  open: boolean;
  onClose: () => void;
  org: any | null;
}) {
  const { user } = useAuth();
  const updateOrg = useUpdateOrganization();
  const { toast } = useToast();
  const [name, setName] = useState(org?.name ?? "");
  const [saving, setSaving] = useState(false);

  if (!org) return null;

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateOrg.mutateAsync({ id: org.id, data: { name: name.trim() } });
      await logSuperAdminAction({ action: `Renamed org "${org.name}" → "${name.trim()}"`, actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: name.trim() });
      toast({ title: "Organization updated" });
      onClose();
    } catch {
      toast({ title: "Error updating organization", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent>
        <SheetHeader><SheetTitle>Edit Organization</SheetTitle></SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label>Organization Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <SheetFooter>
          <Button onClick={handleSave} disabled={saving || !name.trim()} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ── Payment Record Dialog ──────────────────────────────────────────────────────

function AddPaymentDialog({
  open, onClose, org,
}: {
  open: boolean;
  onClose: () => void;
  org: any | null;
}) {
  const { user } = useAuth();
  const addPayment = useAddPaymentRecord();
  const updateOrg = useUpdateOrganization();
  const { toast } = useToast();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  if (!org) return null;
  const plan = org.plan ?? "free";
  const amount = plan === "basic" ? 499 : plan === "pro" ? 999 : 0;

  async function handleAdd() {
    setSaving(true);
    try {
      await addPayment.mutateAsync({ orgId: org.id, orgName: org.name, amount, plan, month, note });
      await updateOrg.mutateAsync({ id: org.id, data: { paymentStatus: "paid" } });
      await logSuperAdminAction({ action: `Recorded payment ৳${amount} for "${org.name}" (${month})`, actorEmail: user?.email ?? "", targetId: org.id, targetType: "payment", orgName: org.name });
      toast({ title: "Payment recorded and org marked as paid" });
      onClose();
    } catch {
      toast({ title: "Error recording payment", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>{org.name} · {plan} plan · ৳{amount}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. bKash #012345…" rows={2} />
          </div>
        </div>
        <Button onClick={handleAdd} disabled={saving} className="w-full gap-2 mt-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          {saving ? "Saving…" : `Mark Paid — ৳${amount}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ManageOrganizations() {
  const { user } = useAuth();
  const { data: orgs = [], isLoading } = useListOrganizations();
  const createOrg = useCreateOrganization();
  const deleteOrg = useDeleteOrganization();
  const updateOrg = useUpdateOrganization();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: "", adminName: "", adminEmail: "", password: "", passwordMode: "generate" as "generate" | "manual" });
  const [showPassword, setShowPassword] = useState(true);
  const [saving, setSaving] = useState(false);

  const [credsOpen, setCredsOpen] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ orgName: string; name: string; email: string; password: string } | null>(null);

  const [editOrg, setEditOrg] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [paymentOrg, setPaymentOrg] = useState<any | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const filtered = (orgs as any[]).filter((o: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.name?.toLowerCase().includes(s) || o.adminEmail?.toLowerCase().includes(s) || o.id?.toLowerCase().includes(s);
  });

  function openSheet() {
    const pw = generateTempPassword();
    setForm({ name: "", adminName: "", adminEmail: "", password: pw, passwordMode: "generate" });
    setShowPassword(true);
    setSheetOpen(true);
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.adminEmail.trim()) {
      toast({ title: "Organization name and admin email are required", variant: "destructive" }); return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      const orgResult = await new Promise<{ id: string }>((resolve, reject) => {
        createOrg.mutate({ name: form.name.trim(), adminEmail: form.adminEmail.trim() }, { onSuccess: resolve, onError: reject });
      });
      let uid: string;
      try {
        uid = await createFirebaseAuthUser(form.adminEmail.trim(), form.password);
      } catch (err: any) {
        if (err?.code === "auth/email-already-in-use") {
          toast({ title: "Email already has a Firebase account", description: "Org doc was created. Manually link the existing account.", variant: "destructive" });
          setSaving(false); setSheetOpen(false); return;
        }
        throw err;
      }
      await setDoc(doc(db, "users", uid), {
        role: "org_admin", orgId: orgResult.id,
        name: form.adminName.trim() || form.adminEmail.trim(),
        email: form.adminEmail.trim(), mustChangePassword: true,
        createdByAdmin: true, createdAt: serverTimestamp(),
      });
      await logSuperAdminAction({ action: `Created org "${form.name.trim()}"`, actorEmail: user?.email ?? "", targetId: orgResult.id, targetType: "organization", orgName: form.name.trim() });
      setCreatedCreds({ orgName: form.name.trim(), name: form.adminName.trim() || form.adminEmail.trim(), email: form.adminEmail.trim(), password: form.password });
      setSheetOpen(false); setCredsOpen(true);
    } catch (err: any) {
      toast({ title: "Error creating organization", description: err?.message ?? "Something went wrong", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteOrg.mutate({ id }, {
      onSuccess: async () => {
        await logSuperAdminAction({ action: `Deleted org "${name}"`, actorEmail: user?.email ?? "", targetId: id, targetType: "organization", orgName: name });
        toast({ title: "Organization deleted" });
      },
      onError: () => toast({ title: "Error deleting organization", variant: "destructive" }),
    });
  }

  async function handleTogglePause(org: any) {
    const isPaused = org.status === "paused";
    const newStatus = isPaused ? "active" : "paused";
    await updateOrg.mutateAsync({ id: org.id, data: { status: newStatus } });
    await logSuperAdminAction({ action: `${isPaused ? "Resumed" : "Paused"} org "${org.name}"`, actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: org.name });
    toast({ title: isPaused ? "Organization resumed" : "Organization paused" });
  }

  async function handleChangePlan(org: any, plan: string) {
    await updateOrg.mutateAsync({ id: org.id, data: { plan } });
    await logSuperAdminAction({ action: `Changed plan for "${org.name}" to ${plan}`, actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: org.name });
    toast({ title: `Plan changed to ${plan}` });
  }

  async function handleTogglePaid(org: any) {
    const isPaid = org.paymentStatus === "paid";
    const newStatus = isPaid ? "unpaid" : "paid";
    await updateOrg.mutateAsync({ id: org.id, data: { paymentStatus: newStatus } });
    await logSuperAdminAction({ action: `Marked org "${org.name}" as ${newStatus}`, actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: org.name });
    toast({ title: `Marked as ${newStatus}` });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage all coaching centers</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-60" placeholder="Search orgs…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={openSheet}><Plus className="h-4 w-4 mr-2" /> New Organization</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => <Card key={i}><CardContent className="h-48 animate-pulse bg-muted/30 mt-4" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground"><Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>{search ? "No organizations match your search." : "No organizations yet."}</p></CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((org: any) => (
            <Card key={org.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">{org.name}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{org.adminEmail}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant={org.status === "paused" ? "secondary" : "default"} className="text-xs">
                        {org.status === "paused" ? <><PauseCircle className="h-2.5 w-2.5 mr-1" />Paused</> : "Active"}
                      </Badge>
                      <Badge variant={org.paymentStatus === "paid" ? "default" : "outline"} className={`text-xs ${org.paymentStatus === "paid" ? "bg-green-600" : "text-red-600 border-red-300"}`}>
                        {org.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Select value={org.plan ?? "free"} onValueChange={(v) => handleChangePlan(org, v)}>
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLANS.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <p className="text-xs font-mono flex-1 truncate text-muted-foreground">{org.id}</p>
                  <button onClick={() => { navigator.clipboard.writeText(org.id); toast({ title: "ID copied!" }); }} className="text-muted-foreground hover:text-foreground">
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "—"}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => { setEditOrg(org); setEditOpen(true); }} className="gap-1 h-7 text-xs">
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTogglePause(org)} disabled={updateOrg.isPending} className="gap-1 h-7 text-xs">
                    {org.status === "paused" ? <><PlayCircle className="h-3 w-3" /> Resume</> : <><PauseCircle className="h-3 w-3" /> Pause</>}
                  </Button>
                  <Button size="sm" variant={org.paymentStatus === "paid" ? "outline" : "default"} onClick={() => handleTogglePaid(org)} disabled={updateOrg.isPending} className="gap-1 h-7 text-xs">
                    <DollarSign className="h-3 w-3" />
                    {org.paymentStatus === "paid" ? "Mark Unpaid" : "Mark Paid"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setPaymentOrg(org); setPaymentOpen(true); }} className="gap-1 h-7 text-xs">
                    <CreditCard className="h-3 w-3" /> Record Payment
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(org.id, org.name)} disabled={deleteOrg.isPending} className="gap-1 h-7 text-xs">
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create org sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>New Organization</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Organization Name <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Brilliant Academy" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Admin Full Name</Label>
              <Input placeholder="e.g. Md. Karim Uddin" value={form.adminName} onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Admin Email <span className="text-destructive">*</span></Label>
              <Input type="email" placeholder="admin@school.com" value={form.adminEmail} onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} />
              <p className="text-xs text-muted-foreground">A Firebase Auth account will be created automatically.</p>
            </div>
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-sm font-semibold">Admin Login Password</Label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm((f) => ({ ...f, passwordMode: "generate" }))} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left ${form.passwordMode === "generate" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  <RefreshCw className="h-3.5 w-3.5 mb-1" /> Generate
                </button>
                <button type="button" onClick={() => { setForm((f) => ({ ...f, passwordMode: "manual", password: "" })); setShowPassword(true); }} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left ${form.passwordMode === "manual" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                  Set Manually
                </button>
              </div>
              {form.passwordMode === "generate" ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={form.password} readOnly className="pr-16 font-mono bg-background" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-muted-foreground hover:text-foreground p-1">{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                      <button type="button" onClick={() => { navigator.clipboard.writeText(form.password); toast({ title: "Copied!" }); }} className="text-muted-foreground hover:text-foreground p-1"><Copy className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, password: generateTempPassword() }))} className="gap-2 w-full">
                    <RefreshCw className="h-3.5 w-3.5" /> Generate New Password
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Enter password (min 6 chars)" className="pr-10 font-mono" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                </div>
              )}
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleCreate} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Creating…" : "Create Organization & Account"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <CredentialsDialog open={credsOpen} onClose={() => { setCredsOpen(false); setCreatedCreds(null); }} creds={createdCreds} />
      <EditOrgSheet open={editOpen} onClose={() => { setEditOpen(false); setEditOrg(null); }} org={editOrg} />
      <AddPaymentDialog open={paymentOpen} onClose={() => { setPaymentOpen(false); setPaymentOrg(null); }} org={paymentOrg} />
    </div>
  );
}
