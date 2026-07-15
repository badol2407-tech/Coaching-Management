import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  useListOrganizations, useCreateOrganization, useDeleteOrganization,
  useUpdateOrganization, logSuperAdminAction, useAddPaymentRecord,
} from "@/lib/super-admin-hooks";
import { createFirebaseAuthUser, generateTempPassword, buildCredentialMessage, getLoginUrl } from "@/lib/auth-utils";
import {
  ALL_TIERS, PLAN_CONFIG, PlanTier, computeExpiryDate,
  tierToLegacyPlan, getEffectiveTier, getTierLabel, getTierPriceLabel,
} from "@/lib/plan-config";
import { getOrgAccessStatus, getRemainingDays, formatExpiryDate } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Trash2, Copy, Loader2, Building2,
  CheckCircle2, Eye, EyeOff,
  RefreshCw, PauseCircle, PlayCircle,
  Edit, CreditCard, Search, CalendarClock,
  Clock, RotateCcw, ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Tier helpers ───────────────────────────────────────────────────────────────

const TIER_COLORS: Record<PlanTier, { badge: string; dot: string }> = {
  free_trial: { badge: "bg-slate-500/15 text-slate-300 border-slate-500/30", dot: "bg-slate-400" },
  founder_launch: { badge: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  annual_premium: { badge: "bg-violet-500/15 text-violet-300 border-violet-500/30", dot: "bg-violet-400" },
};

function TierBadge({ tier }: { tier: PlanTier }) {
  const { badge } = TIER_COLORS[tier] ?? TIER_COLORS.free_trial;
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold capitalize px-2 ${badge}`}>
      {getTierLabel(tier)}
    </Badge>
  );
}

function OrgStatusBadge({ org }: { org: any }) {
  const status = getOrgAccessStatus(org);
  const map = {
    active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    expired: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    paused: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    unpaid_blocked: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  } as const;
  const label = { active: "Active", expired: "Expired", paused: "Paused", unpaid_blocked: "Unpaid" };
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold ${map[status]}`}>
      {label[status]}
    </Badge>
  );
}

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
        </div>
        <Button onClick={copyAll} className="gap-2 w-full" variant="outline">
          {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy All Credentials"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Org Sheet ─────────────────────────────────────────────────────────────

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
  const [saving, setSaving] = useState(false);

  const effectiveTier = org ? getEffectiveTier(org) : "free_trial";
  const [name, setName] = useState(org?.name ?? "");
  const [tier, setTier] = useState<PlanTier>(effectiveTier);
  const [expiryDate, setExpiryDate] = useState<string>(
    org?.subscriptionExpiryDate ? new Date(org.subscriptionExpiryDate).toISOString().slice(0, 10) : ""
  );
  const [paymentStatus, setPaymentStatus] = useState<string>(org?.paymentStatus ?? "unpaid");
  const [accountStatus, setAccountStatus] = useState<string>(
    org?.accountStatus ?? org?.status ?? "active"
  );

  if (!org) return null;

  const remaining = getRemainingDays(org.subscriptionExpiryDate);
  const accessStatus = getOrgAccessStatus(org);

  function handleRenew() {
    // Extend from current expiry (if future) or from today
    const base = org.subscriptionExpiryDate && new Date(org.subscriptionExpiryDate) > new Date()
      ? new Date(org.subscriptionExpiryDate)
      : new Date();
    const newExpiry = computeExpiryDate(tier, base);
    setExpiryDate(newExpiry.toISOString().slice(0, 10));
    toast({ title: "Expiry date updated", description: `New expiry: ${formatExpiryDate(newExpiry.toISOString())}` });
  }

  function handleSetFromToday() {
    const newExpiry = computeExpiryDate(tier, new Date());
    setExpiryDate(newExpiry.toISOString().slice(0, 10));
  }

  async function handleSave() {
    if (!name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const expiryISO = expiryDate ? new Date(expiryDate).toISOString() : null;
      await updateOrg.mutateAsync({
        id: org.id,
        data: {
          name: name.trim(),
          tier,
          plan: tierToLegacyPlan(tier),       // backward compat
          subscriptionExpiryDate: expiryISO,
          subscriptionStartDate: org.subscriptionStartDate ?? new Date().toISOString(),
          paymentStatus,
          accountStatus,
          status: accountStatus,               // backward compat
        },
      });
      await logSuperAdminAction({
        action: `Updated org "${org.name}" — tier:${tier}, payment:${paymentStatus}, status:${accountStatus}`,
        actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: org.name,
      });
      toast({ title: "Organization updated" });
      onClose();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Organization</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 py-5">
          {/* Status summary */}
          <div className="rounded-xl border bg-muted/20 p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <OrgStatusBadge org={org} />
              <TierBadge tier={effectiveTier} />
            </div>
            {remaining !== null && (
              <span className={`text-xs font-semibold ${remaining <= 3 ? "text-rose-400" : remaining <= 7 ? "text-amber-400" : "text-emerald-400"}`}>
                {remaining > 0 ? `${remaining}d left` : "Expired"}
              </span>
            )}
          </div>

          {/* Org name */}
          <div className="space-y-1.5">
            <Label>Organization Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <Separator />

          {/* Tier */}
          <div className="space-y-1.5">
            <Label className="font-semibold">Subscription Tier</Label>
            <Select value={tier} onValueChange={(v) => setTier(v as PlanTier)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_TIERS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {PLAN_CONFIG[t].name} — {getTierPriceLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription expiry date */}
          <div className="space-y-1.5">
            <Label className="font-semibold flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5" />
              Subscription Expiry Date
            </Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleRenew} className="gap-1.5 flex-1 text-xs">
                <RotateCcw className="h-3 w-3" /> Renew / Extend
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleSetFromToday} className="gap-1.5 flex-1 text-xs">
                <Clock className="h-3 w-3" /> Start from Today
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              "Renew/Extend" adds one billing period from current expiry. "Start from Today" resets from now.
            </p>
          </div>

          <Separator />

          {/* Payment status */}
          <div className="space-y-1.5">
            <Label className="font-semibold">Payment Status</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">✅ Paid</SelectItem>
                <SelectItem value="unpaid">❌ Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account status */}
          <div className="space-y-1.5">
            <Label className="font-semibold">Account Status</Label>
            <Select value={accountStatus} onValueChange={setAccountStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">▶ Active</SelectItem>
                <SelectItem value="paused">⏸ Paused</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Paused orgs lose portal access immediately until resumed.
            </p>
          </div>

          {/* Access status preview */}
          <div
            className="rounded-xl p-3 text-xs"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-muted-foreground mb-1">Current access status</p>
            <p className="font-semibold capitalize text-foreground">{accessStatus.replace("_", " ")}</p>
            {org.subscriptionExpiryDate && (
              <p className="text-muted-foreground mt-1">
                Expires {formatExpiryDate(org.subscriptionExpiryDate)}
              </p>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving} className="gap-2 w-full">
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
  const tier = getEffectiveTier(org);
  const cfg = PLAN_CONFIG[tier];
  const amount = cfg.price;

  async function handleAdd() {
    setSaving(true);
    try {
      await addPayment.mutateAsync({ orgId: org.id, orgName: org.name, amount, plan: tier, month, note });
      await updateOrg.mutateAsync({ id: org.id, data: { paymentStatus: "paid" } });
      await logSuperAdminAction({
        action: `Recorded payment ৳${amount} for "${org.name}" (${month})`,
        actorEmail: user?.email ?? "", targetId: org.id, targetType: "payment", orgName: org.name,
      });
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
          <DialogDescription>
            {org.name} · {cfg.name} · ৳{amount.toLocaleString()}
          </DialogDescription>
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
          {saving ? "Saving…" : `Mark Paid — ৳${amount.toLocaleString()}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ManageOrganizations() {
  const { user } = useAuth();
  const { data: orgs = [], isLoading } = useListOrganizations();
  const createOrg = useCreateOrganization();
  const deleteOrg = useDeleteOrganization();
  const updateOrg = useUpdateOrganization();
  const { toast } = useToast();

  const [search, setSearch] = useState("");

  // Create sheet
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", adminName: "", adminEmail: "", password: "",
    passwordMode: "generate" as "generate" | "manual",
    tier: "free_trial" as PlanTier,
  });
  const [showPassword, setShowPassword] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialogs
  const [credsOpen, setCredsOpen] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ orgName: string; name: string; email: string; password: string } | null>(null);
  const [editOrg, setEditOrg] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [paymentOrg, setPaymentOrg] = useState<any | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);

  const filtered = (orgs as any[]).filter((o: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return o.name?.toLowerCase().includes(s) || o.adminEmail?.toLowerCase().includes(s) || o.id?.toLowerCase().includes(s);
  });

  function openSheet() {
    const pw = generateTempPassword();
    setForm({ name: "", adminName: "", adminEmail: "", password: pw, passwordMode: "generate", tier: "free_trial" });
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
      const startDate = new Date();
      const expiryDate = computeExpiryDate(form.tier, startDate);

      const orgResult = await new Promise<{ id: string }>((resolve, reject) => {
        createOrg.mutate({
          name: form.name.trim(),
          adminEmail: form.adminEmail.trim(),
          tier: form.tier,
          subscriptionStartDate: startDate.toISOString(),
          subscriptionExpiryDate: expiryDate.toISOString(),
        }, { onSuccess: resolve, onError: reject });
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
        createdAt: serverTimestamp(), createdByAdmin: true,
      });

      await logSuperAdminAction({
        action: `Created org "${form.name}" with tier ${form.tier}`,
        actorEmail: user?.email ?? "", targetId: orgResult.id, targetType: "organization", orgName: form.name,
      });

      setCreatedCreds({ orgName: form.name.trim(), name: form.adminName.trim() || form.adminEmail, email: form.adminEmail.trim(), password: form.password });
      setSheetOpen(false);
      setCredsOpen(true);
      toast({ title: "Organization created!" });
    } catch (err: any) {
      toast({ title: "Failed to create organization", description: err?.message ?? "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(org: any) {
    setDeleteConfirm(org);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    try {
      await deleteOrg.mutateAsync({ id: deleteConfirm.id });
      await logSuperAdminAction({
        action: `Deleted org "${deleteConfirm.name}"`,
        actorEmail: user?.email ?? "", targetId: deleteConfirm.id, targetType: "organization", orgName: deleteConfirm.name,
      });
      toast({ title: "Organization deleted" });
    } catch (err: any) {
      const msg = err?.code === "permission-denied"
        ? "Permission denied — check Firestore rules."
        : (err?.message ?? "Unknown error");
      toast({ title: "Error deleting organization", description: msg, variant: "destructive" });
    } finally {
      setDeleteConfirm(null);
    }
  }

  async function handleTogglePause(org: any) {
    const isPaused = (org.accountStatus ?? org.status) === "paused";
    const newStatus = isPaused ? "active" : "paused";
    await updateOrg.mutateAsync({ id: org.id, data: { accountStatus: newStatus, status: newStatus } });
    await logSuperAdminAction({
      action: `${isPaused ? "Resumed" : "Paused"} org "${org.name}"`,
      actorEmail: user?.email ?? "", targetId: org.id, targetType: "organization", orgName: org.name,
    });
    toast({ title: isPaused ? "Organization resumed" : "Organization paused" });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-muted-foreground text-sm">Manage all coaching centers and their subscriptions</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 w-56" placeholder="Search orgs…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={openSheet}><Plus className="h-4 w-4 mr-2" /> New Organization</Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: orgs.length, color: "text-foreground" },
          { label: "Active", value: (orgs as any[]).filter((o) => getOrgAccessStatus(o) === "active").length, color: "text-emerald-400" },
          { label: "Expired/Paused", value: (orgs as any[]).filter((o) => ["expired","paused","unpaid_blocked"].includes(getOrgAccessStatus(o))).length, color: "text-amber-400" },
          { label: "Paid", value: (orgs as any[]).filter((o: any) => o.paymentStatus === "paid").length, color: "text-violet-400" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Org grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => <Card key={i}><CardContent className="h-48 animate-pulse bg-muted/30 mt-4" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>{search ? "No organizations match your search." : "No organizations yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((org: any) => {
            const tier = getEffectiveTier(org);
            const remaining = getRemainingDays(org.subscriptionExpiryDate);
            const accessStatus = getOrgAccessStatus(org);

            return (
              <Card key={org.id} className={accessStatus !== "active" ? "border-amber-500/20" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{org.name}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{org.adminEmail}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        <TierBadge tier={tier} />
                        <OrgStatusBadge org={org} />
                        {org.paymentStatus === "paid" ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Paid</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/30">Unpaid</Badge>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {remaining !== null ? (
                        <div className={`text-xs font-bold ${remaining <= 0 ? "text-rose-400" : remaining <= 3 ? "text-rose-400" : remaining <= 7 ? "text-amber-400" : "text-emerald-400"}`}>
                          {remaining > 0 ? `${remaining}d` : "Expired"}
                        </div>
                      ) : null}
                      {org.subscriptionExpiryDate && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          exp {formatExpiryDate(org.subscriptionExpiryDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs text-muted-foreground font-mono">
                    ID: {org.id}
                  </div>
                  <div className="flex gap-2 flex-wrap pt-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => { setEditOrg(org); setEditOpen(true); }}>
                      <Edit className="h-3 w-3" /> Edit / Renew
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => { setPaymentOrg(org); setPaymentOpen(true); }}>
                      <CreditCard className="h-3 w-3" /> Payment
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className={`h-7 text-xs gap-1.5 ${(org.accountStatus ?? org.status) === "paused" ? "text-emerald-400 hover:text-emerald-300" : "text-blue-400 hover:text-blue-300"}`}
                      onClick={() => handleTogglePause(org)}
                    >
                      {(org.accountStatus ?? org.status) === "paused" ? <><PlayCircle className="h-3 w-3" /> Resume</> : <><PauseCircle className="h-3 w-3" /> Pause</>}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5 text-destructive hover:text-destructive" onClick={() => handleDelete(org)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create org sheet */}
      <Sheet open={sheetOpen} onOpenChange={(v) => { if (!v) setSheetOpen(false); }}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>New Organization</SheetTitle></SheetHeader>
          <div className="space-y-5 py-5">

            {/* Org details */}
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-sm font-semibold">Organization Details</Label>
              <div className="space-y-1">
                <Label className="text-xs">Organization Name *</Label>
                <Input placeholder="e.g. Bright Future Academy" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
            </div>

            {/* Tier selection — REQUIRED */}
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                Subscription Tier *
              </Label>
              <Select value={form.tier} onValueChange={(v) => setForm((f) => ({ ...f, tier: v as PlanTier }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_TIERS.map((t) => {
                    const cfg = PLAN_CONFIG[t];
                    return (
                      <SelectItem key={t} value={t}>
                        <div>
                          <span className="font-medium">{cfg.name}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {getTierPriceLabel(t)}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                {form.tier === "free_trial" && "7-day full premium access. Expiry auto-computed from today."}
                {form.tier === "founder_launch" && "Monthly subscription. First billing period starts today."}
                {form.tier === "annual_premium" && "Annual subscription. Access valid for 1 year from today."}
              </div>
            </div>

            {/* Admin details */}
            <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
              <Label className="text-sm font-semibold">Admin Account</Label>
              <div className="space-y-1">
                <Label className="text-xs">Admin Name (optional)</Label>
                <Input placeholder="e.g. Md. Karim Uddin" value={form.adminName} onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Admin Email *</Label>
                <Input type="email" placeholder="admin@example.com" value={form.adminEmail} onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} />
              </div>
              <p className="text-xs text-muted-foreground">A Firebase Auth account will be created automatically.</p>
            </div>

            {/* Password */}
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
            <Button onClick={handleCreate} disabled={saving} className="gap-2 w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {saving ? "Creating…" : "Create Organization & Account"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              Delete "{deleteConfirm?.name}"? This cannot be undone. Student and teacher data inside the org will remain in Firestore.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CredentialsDialog open={credsOpen} onClose={() => { setCredsOpen(false); setCreatedCreds(null); }} creds={createdCreds} />
      <EditOrgSheet open={editOpen} onClose={() => { setEditOpen(false); setEditOrg(null); }} org={editOrg} />
      <AddPaymentDialog open={paymentOpen} onClose={() => { setPaymentOpen(false); setPaymentOrg(null); }} org={paymentOrg} />
    </div>
  );
}
