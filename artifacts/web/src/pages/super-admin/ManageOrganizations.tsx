import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useListOrganizations, useCreateOrganization, useDeleteOrganization } from "@/lib/hooks";
import { createFirebaseAuthUser, generateTempPassword, buildCredentialMessage, getLoginUrl } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Trash2, Copy, Loader2, Building2,
  CheckCircle2, Mail, MessageCircle, Eye, EyeOff,
  RefreshCw, ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Credentials Dialog ─────────────────────────────────────────────────────────

function CredentialsDialog({
  open,
  onClose,
  creds,
}: {
  open: boolean;
  onClose: () => void;
  creds: { orgName: string; name: string; email: string; password: string } | null;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  if (!creds) return null;

  const message = buildCredentialMessage({
    orgName: creds.orgName,
    name: creds.name,
    role: "Teacher", // reuse message builder, role label is cosmetic
    email: creds.email,
    password: creds.password,
    loginUrl: getLoginUrl(),
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
              <DialogDescription className="text-xs">
                Share these credentials with the org admin
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organization</span>
            <span className="font-medium">{creds.orgName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{creds.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Temp Password</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-primary">{creds.password}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(creds.password); toast({ title: "Password copied!" }); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">Organization Admin</Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          The admin will be asked to set a new password on their first login.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const subject = encodeURIComponent(`Your ${creds.orgName} EduTrack account`);
              window.open(`mailto:${creds.email}?subject=${subject}&body=${encodeURIComponent(message)}`);
            }}
            className="gap-2"
          >
            <Mail className="h-4 w-4" /> Send via Email
          </Button>
          <Button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
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

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ManageOrganizations() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const createOrg = useCreateOrganization();
  const deleteOrg = useDeleteOrganization();
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ name: "", adminName: "", adminEmail: "", password: "", passwordMode: "generate" as "generate" | "manual" });
  const [showPassword, setShowPassword] = useState(true);
  const [saving, setSaving] = useState(false);

  // Credentials dialog after creation
  const [credsOpen, setCredsOpen] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ orgName: string; name: string; email: string; password: string } | null>(null);

  function openSheet() {
    const pw = generateTempPassword();
    setForm({ name: "", adminName: "", adminEmail: "", password: pw, passwordMode: "generate" });
    setShowPassword(true);
    setSheetOpen(true);
  }

  function handleGeneratePassword() {
    setForm((f) => ({ ...f, password: generateTempPassword(), passwordMode: "generate" }));
    setShowPassword(true);
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.adminEmail.trim()) {
      toast({ title: "Organization name and admin email are required", variant: "destructive" });
      return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // 1. Create the organization Firestore doc
      const orgResult = await new Promise<{ id: string }>((resolve, reject) => {
        createOrg.mutate(
          { name: form.name.trim(), adminEmail: form.adminEmail.trim() },
          { onSuccess: resolve, onError: reject }
        );
      });

      // 2. Create Firebase Auth account for org admin (secondary app — doesn't sign out super admin)
      let uid: string;
      try {
        uid = await createFirebaseAuthUser(form.adminEmail.trim(), form.password);
      } catch (err: any) {
        const code = err?.code ?? "";
        if (code === "auth/email-already-in-use") {
          toast({
            title: "Email already has a Firebase account",
            description: "The org Firestore doc was created. To link the existing account, manually set their Firestore profile.",
            variant: "destructive",
          });
          setSaving(false);
          setSheetOpen(false);
          return;
        }
        throw err;
      }

      // 3. Write Firestore user profile for the org admin
      await setDoc(doc(db, "users", uid), {
        role: "org_admin",
        orgId: orgResult.id,
        name: form.adminName.trim() || form.adminEmail.trim(),
        email: form.adminEmail.trim(),
        mustChangePassword: true,
        createdByAdmin: true,
        createdAt: serverTimestamp(),
      });

      // 4. Show credentials
      setCreatedCreds({
        orgName: form.name.trim(),
        name: form.adminName.trim() || form.adminEmail.trim(),
        email: form.adminEmail.trim(),
        password: form.password,
      });
      setSheetOpen(false);
      setCredsOpen(true);
    } catch (err: any) {
      toast({ title: "Error creating organization", description: err?.message ?? "Something went wrong", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteOrg.mutate({ id }, {
      onSuccess: () => toast({ title: "Organization deleted" }),
      onError: () => toast({ title: "Error deleting organization", variant: "destructive" }),
    });
  }

  function copyCode(id: string) {
    navigator.clipboard.writeText(id);
    toast({ title: "Org ID copied!" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage all coaching centers</p>
        </div>
        <Button onClick={openSheet}>
          <Plus className="h-4 w-4 mr-2" /> New Organization
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => <Card key={i}><CardContent className="h-32 animate-pulse bg-muted/30" /></Card>)}
        </div>
      ) : (orgs as any[]).length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No organizations yet. Click "New Organization" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(orgs as any[]).map((org: any) => (
            <Card key={org.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{org.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">{org.adminEmail}</p>
                  </div>
                  <Badge variant={org.status === "active" ? "default" : "secondary"}>
                    {org.status ?? "active"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <p className="text-xs font-mono flex-1 truncate text-muted-foreground">{org.id}</p>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copyCode(org.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created: {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : "—"}
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm" variant="destructive"
                    onClick={() => handleDelete(org.id, org.name)}
                    disabled={deleteOrg.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
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
          <SheetHeader>
            <SheetTitle>New Organization</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Organization Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. Brilliant Academy"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Admin Full Name</Label>
              <Input
                placeholder="e.g. Md. Karim Uddin"
                value={form.adminName}
                onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Admin Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="admin@school.com"
                value={form.adminEmail}
                onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                A Firebase Auth account will be created for this email automatically.
              </p>
            </div>

            {/* Password section */}
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-sm font-semibold">Admin Login Password</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, passwordMode: "generate" }))}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left ${
                    form.passwordMode === "generate"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5 mb-1" />
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => { setForm((f) => ({ ...f, passwordMode: "manual", password: "" })); setShowPassword(true); }}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left ${
                    form.passwordMode === "manual"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  Set Manually
                </button>
              </div>

              {form.passwordMode === "generate" ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      readOnly
                      className="pr-16 font-mono bg-background"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-muted-foreground hover:text-foreground p-1">
                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button type="button" onClick={() => { navigator.clipboard.writeText(form.password); toast({ title: "Copied!" }); }} className="text-muted-foreground hover:text-foreground p-1">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword} className="gap-2 w-full">
                    <RefreshCw className="h-3.5 w-3.5" /> Generate New Password
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Enter password (min 6 chars)"
                    className="pr-10 font-mono"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                The admin will be required to change this on their first login.
              </p>
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

      {/* Credentials dialog */}
      <CredentialsDialog
        open={credsOpen}
        onClose={() => { setCredsOpen(false); setCreatedCreds(null); }}
        creds={createdCreds}
      />
    </div>
  );
}
