import { useState } from "react";
import {
  useListTeachers, useUpdateTeacher, useDeleteTeacher, getListTeachersQueryKey,
} from "@/lib/hooks";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { trackTeacherAdded, trackTeacherUpdated, trackTeacherDeleted } from "@/lib/analytics";
import {
  collection, addDoc, serverTimestamp, doc, setDoc,
  getDocs, query, where,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  createFirebaseAuthUser, generateTempPassword,
  buildCredentialMessage, getLoginUrl,
} from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, Pencil, Trash2, MoreVertical, Eye, EyeOff, RefreshCw,
  Mail, MessageCircle, Copy, Link2, KeyRound, Send, CheckCircle2,
  Loader2, ShieldCheck, UserPlus, RotateCcw, Clock, UserCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

type Teacher = {
  id: string; name: string; phone?: string | null; email?: string | null;
  subject?: string | null; salary?: number | null; joinedAt: string;
  hasFirebaseAuth?: boolean; uid?: string | null;
};

const emptyForm = {
  name: "", phone: "", email: "", subject: "", salary: "",
  joinedAt: new Date().toISOString().split("T")[0],
  password: "", passwordMode: "generate" as "manual" | "generate",
};

type CreatedCredentials = {
  name: string; email: string; password: string;
  role: "Teacher"; orgName: string; loginUrl: string;
};

type TeacherRequest = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

// ── Credentials Dialog ─────────────────────────────────────────────────────────

function CredentialsDialog({
  open, onClose, creds,
}: {
  open: boolean; onClose: () => void; creds: CreatedCredentials | null;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!creds) return null;

  const message = buildCredentialMessage(creds);

  function copyAll() {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  }

  function sendEmail() {
    const subject = encodeURIComponent(`Your ${creds!.orgName} account credentials`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${creds!.email}?subject=${subject}&body=${body}`);
  }

  function sendWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
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
              <DialogTitle>Account Created!</DialogTitle>
              <DialogDescription className="text-xs">
                Share login credentials with {creds.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Credential card */}
        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{creds.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Temp Password</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-primary">{creds.password}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(creds.password);
                  toast({ title: "Password copied!" });
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <Badge variant="secondary">{creds.role}</Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
          The user will be asked to set a new password on their first login.
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={sendEmail} className="gap-2">
            <Mail className="h-4 w-4" /> Send via Email
          </Button>
          <Button
            onClick={sendWhatsApp}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4" /> Send via WhatsApp
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

// ── Resend / Regenerate Dialog ─────────────────────────────────────────────────

function RegenerateDialog({
  open, onClose, teacher, orgName,
}: {
  open: boolean; onClose: () => void; teacher: Teacher | null; orgName: string;
}) {
  const { toast } = useToast();
  const [newPassword] = useState(() => generateTempPassword());
  const [copied, setCopied] = useState(false);

  if (!teacher || !teacher.email) return null;

  const creds: CreatedCredentials = {
    name: teacher.name, email: teacher.email, password: newPassword,
    role: "Teacher", orgName, loginUrl: getLoginUrl(),
  };
  const message = buildCredentialMessage(creds);

  function copyAll() {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!" });
  }

  function sendEmail() {
    const subject = encodeURIComponent(`Your ${orgName} account — new password`);
    window.open(`mailto:${teacher!.email}?subject=${subject}&body=${encodeURIComponent(message)}`);
  }

  function sendWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }

  async function sendResetEmail() {
    try {
      await sendPasswordResetEmail(auth, teacher!.email!);
      toast({ title: "Password reset email sent!", description: "User will receive a reset link." });
      onClose();
    } catch {
      toast({ title: "Error sending reset email", variant: "destructive" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Share Login Credentials</DialogTitle>
              <DialogDescription className="text-xs">{teacher.name}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{teacher.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Suggested Password</span>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-primary">{newPassword}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(newPassword); toast({ title: "Copied!" }); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <strong>Note:</strong> To apply this new password to the user's Firebase account, use the <em>Send Password Reset Email</em> option below — the user can then set this as their new password.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={sendEmail} className="gap-2">
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button onClick={sendWhatsApp} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="ghost" size="sm" onClick={copyAll} className="gap-2 text-xs">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            Copy Message
          </Button>
          <Button variant="outline" size="sm" onClick={sendResetEmail} className="gap-2 text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Send Reset Email
          </Button>
        </div>
        <Button onClick={onClose} className="w-full">Done</Button>
      </DialogContent>
    </Dialog>
  );
}

// ── Teacher Join Link section ────────────────────────────────────────────────
// Self-registration link: teacher fills their own name/email/password (mandatory)
// on a role-locked form, then appears here as a pending request for approval.

function TeacherJoinLinkSection() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [requests, setRequests] = useState<TeacherRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const orgId = userProfile?.orgId;
  const teacherLink = orgId
    ? `${window.location.origin}/join/${orgId}/teacher`
    : null;

  function copyTeacherLink() {
    if (!teacherLink) return;
    navigator.clipboard.writeText(teacherLink);
    toast({ title: "Teacher link copied!", description: "Share this link — only the teacher form (with email & password mandatory) will show." });
  }

  async function loadRequests() {
    if (!orgId) return;
    setLoadingRequests(true);
    try {
      const q = query(
        collection(db, "organizations", orgId, "teacher_requests"),
        where("status", "==", "pending"),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => {
        const r = d.data() as any;
        return {
          id: d.id,
          uid: r.uid,
          name: r.name,
          email: r.email,
          phone: r.phone,
          subject: r.subject,
          status: r.status,
          createdAt: r.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        } as TeacherRequest;
      });
      setRequests(data);
    } finally {
      setLoadingRequests(false);
    }
  }

  async function approve(req: TeacherRequest) {
    if (!orgId) return;
    setProcessingId(req.id);
    try {
      await addDoc(collection(db, "organizations", orgId, "teachers"), {
        uid: req.uid ?? null,
        name: req.name,
        phone: req.phone ?? null,
        email: req.email ?? null,
        subject: req.subject ?? null,
        salary: null,
        joinedAt: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
        source: "join_link",
        hasFirebaseAuth: !!req.uid,
      });
      // The teacher already chose their own email/password on the join form —
      // creating their `users/{uid}` profile here is what turns that on for login.
      if (req.uid) {
        await setDoc(doc(db, "users", req.uid), {
          role: "teacher",
          orgId,
          name: req.name,
          email: req.email ?? null,
          mustChangePassword: false,
          createdByAdmin: false,
          createdAt: serverTimestamp(),
        });
      }
      await setDoc(
        doc(db, "organizations", orgId, "teacher_requests", req.id),
        { status: "approved" },
        { merge: true },
      );
      setRequests((r) => r.filter((x) => x.id !== req.id));
      qc.invalidateQueries({ queryKey: getListTeachersQueryKey() });
      toast({ title: `${req.name} approved!`, description: "Added to teacher list. They can now log in with the email & password they chose." });
    } catch {
      toast({ title: "Error", description: "Could not approve request.", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(req: TeacherRequest) {
    if (!orgId) return;
    setProcessingId(req.id);
    try {
      await setDoc(
        doc(db, "organizations", orgId, "teacher_requests", req.id),
        { status: "rejected" },
        { merge: true },
      );
      setRequests((r) => r.filter((x) => x.id !== req.id));
      toast({ title: "Request rejected" });
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Link card */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/[0.02] p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Teacher Join Link</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share this so teachers can self-register. Only the teacher form shows — name, email &amp; password are all mandatory.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 min-w-0 rounded-lg border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground truncate font-mono">
              {teacherLink ?? "—"}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={copyTeacherLink} className="gap-1.5 shrink-0">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>

      {/* Pending requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Pending Teacher Requests</h3>
            {requests.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{requests.length}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadRequests}
            disabled={loadingRequests}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingRequests ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {requests.length === 0 && !loadingRequests && (
          <div className="rounded-xl border border-dashed bg-muted/20 py-10 text-center">
            <UserCheck className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No pending teacher requests</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Click Refresh after sharing the link
            </p>
          </div>
        )}

        {loadingRequests && (
          <div className="rounded-xl border p-8 text-center">
            <Loader2 className="h-6 w-6 text-muted-foreground/50 mx-auto animate-spin" />
          </div>
        )}

        {requests.length > 0 && (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{req.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{req.subject ?? "—"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reject(req)}
                          disabled={processingId === req.id}
                          className="h-7 px-3 text-xs text-destructive border-destructive/30 hover:bg-destructive/5"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approve(req)}
                          disabled={processingId === req.id}
                          className="h-7 px-3 text-xs gap-1"
                        >
                          {processingId === req.id
                            ? <Loader2 className="h-3 w-3 animate-spin" />
                            : <CheckCircle2 className="h-3 w-3" />}
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Teachers() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null);
  const [credDialogOpen, setCredDialogOpen] = useState(false);
  const [regenTeacher, setRegenTeacher] = useState<Teacher | null>(null);
  const [regenOpen, setRegenOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: teachers = [], isLoading } = useListTeachers();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListTeachersQueryKey() });

  const orgId = userProfile?.orgId;
  const orgName = userProfile?.orgName ?? "Your Organization";

  function openAdd() {
    setEditing(null);
    const pw = generateTempPassword();
    setForm({ ...emptyForm, password: pw, passwordMode: "generate" });
    setShowPassword(true);
    setSheetOpen(true);
  }

  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({
      name: t.name, phone: t.phone ?? "", email: t.email ?? "",
      subject: t.subject ?? "", salary: t.salary != null ? String(t.salary) : "",
      joinedAt: t.joinedAt, password: "", passwordMode: "generate",
    });
    setShowPassword(false);
    setSheetOpen(true);
  }

  function handleGeneratePassword() {
    setForm((f) => ({ ...f, password: generateTempPassword(), passwordMode: "generate" }));
    setShowPassword(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        // ── Edit existing teacher ──────────────────────────────────────────
        const data: Record<string, unknown> = {
          name: form.name, phone: form.phone || null, email: form.email || null,
          subject: form.subject || null,
          salary: form.salary ? Number(form.salary) : null,
          joinedAt: form.joinedAt,
        };
        await updateTeacher.mutateAsync({ id: editing.id, data });
        trackTeacherUpdated();
        toast({ title: "Teacher updated" });
        setSheetOpen(false);
        invalidate();
      } else {
        // ── Create new teacher ─────────────────────────────────────────────
        const email = form.email.trim();
        const password = form.password.trim();

        if (!email) {
          toast({ title: "Email is required for new teachers", variant: "destructive" });
          setSaving(false);
          return;
        }
        if (!password || password.length < 6) {
          toast({ title: "Password must be at least 6 characters", variant: "destructive" });
          setSaving(false);
          return;
        }
        if (!orgId) {
          toast({ title: "No organization found", variant: "destructive" });
          setSaving(false);
          return;
        }

        // 1. Create Firebase Auth user (secondary app — doesn't log out admin)
        let uid: string;
        try {
          uid = await createFirebaseAuthUser(email, password);
        } catch (err: any) {
          const code = err?.code ?? "";
          if (code === "auth/email-already-in-use") {
            toast({ title: "Email already registered", description: "This email already has a Firebase account.", variant: "destructive" });
          } else {
            toast({ title: "Could not create account", description: err?.message ?? "Firebase error", variant: "destructive" });
          }
          setSaving(false);
          return;
        }

        // 2. Write Firestore user profile (for login routing)
        try {
          await setDoc(doc(db, "users", uid), {
            role: "teacher",
            orgId,
            name: form.name.trim(),
            email,
            mustChangePassword: true,
            createdByAdmin: true,
            createdAt: serverTimestamp(),
          });
        } catch {
          // Firestore write may fail if security rules don't allow cross-user writes.
          // The teacher can still complete profile via the Setup flow on first login.
        }

        // 3. Write teacher record to org sub-collection (use uid as doc id)
        await addDoc(collection(db, "organizations", orgId, "teachers"), {
          uid,
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email,
          subject: form.subject.trim() || null,
          salary: form.salary ? Number(form.salary) : null,
          joinedAt: form.joinedAt,
          hasFirebaseAuth: true,
          createdAt: serverTimestamp(),
        });

        trackTeacherAdded();
        invalidate();
        setSheetOpen(false);

        // 4. Show credential sharing dialog
        setCreatedCreds({
          name: form.name.trim(), email, password,
          role: "Teacher", orgName, loginUrl: getLoginUrl(),
        });
        setCredDialogOpen(true);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message ?? "Something went wrong.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTeacher.mutate(
      { id: deleteId },
      {
        onSuccess: () => { trackTeacherDeleted(); toast({ title: "Teacher deleted" }); invalidate(); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
    setDeleteId(null);
  }

  function copyLoginUrl() {
    navigator.clipboard.writeText(getLoginUrl());
    toast({ title: "Login URL copied!" });
  }

  function copyLoginInfo(t: Teacher) {
    const info = `Name: ${t.name}\nEmail: ${t.email ?? "—"}\nRole: Teacher\nLogin: ${getLoginUrl()}`;
    navigator.clipboard.writeText(info);
    toast({ title: "Login info copied!" });
  }

  async function sendPasswordReset(t: Teacher) {
    if (!t.email) {
      toast({ title: "No email on file", variant: "destructive" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, t.email);
      toast({ title: "Reset email sent!", description: `Password reset sent to ${t.email}` });
    } catch {
      toast({ title: "Could not send reset email", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-12 animate-pulse bg-muted/30" />
                </TableRow>
              ))
            ) : (teachers as Teacher[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No teachers found. Click "Add Teacher" to get started.
                </TableCell>
              </TableRow>
            ) : (
              (teachers as Teacher[]).map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.subject ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.phone ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.salary != null ? `৳${Number(t.salary).toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.joinedAt}</TableCell>
                  <TableCell>
                    {t.hasFirebaseAuth ? (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <ShieldCheck className="h-3 w-3 text-green-500" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">No login</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(t)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          {/* Credential actions */}
                          {t.hasFirebaseAuth && t.email && (
                            <>
                              <DropdownMenuItem
                                onClick={() => { setRegenTeacher(t); setRegenOpen(true); }}
                                className="gap-2"
                              >
                                <RefreshCw className="h-4 w-4 text-blue-500" />
                                Resend Credentials
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => sendPasswordReset(t)}
                                className="gap-2"
                              >
                                <RotateCcw className="h-4 w-4 text-orange-500" />
                                Send Password Reset Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => copyLoginInfo(t)} className="gap-2">
                            <Copy className="h-4 w-4" /> Copy Login Info
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={copyLoginUrl} className="gap-2">
                            <Link2 className="h-4 w-4" /> Copy Login URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(t.id)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Teacher
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Teacher self-registration join link */}
      <TeacherJoinLinkSection />

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Teacher" : "Add Teacher"}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Teacher's full name"
              />
            </div>
            {/* Email */}
            <div className="space-y-1">
              <Label>
                Email {!editing && <span className="text-destructive">*</span>}
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="teacher@example.com"
                disabled={!!editing}
                className={editing ? "bg-muted cursor-not-allowed" : ""}
              />
              {editing && (
                <p className="text-xs text-muted-foreground">Email cannot be changed after creation.</p>
              )}
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
            </div>
            {/* Subject */}
            <div className="space-y-1">
              <Label>Subject</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Mathematics"
              />
            </div>
            {/* Salary */}
            <div className="space-y-1">
              <Label>Salary (৳)</Label>
              <Input
                type="number"
                value={form.salary}
                onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
              />
            </div>
            {/* Joined date */}
            <div className="space-y-1">
              <Label>Joining Date</Label>
              <Input
                type="date"
                value={form.joinedAt}
                onChange={(e) => setForm((f) => ({ ...f, joinedAt: e.target.value }))}
              />
            </div>

            {/* Password section — only for new teachers */}
            {!editing && (
              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold">Login Password</Label>
                </div>

                {/* Mode toggle */}
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
                    Generate (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, passwordMode: "manual", password: "" }));
                      setShowPassword(true);
                    }}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left ${
                      form.passwordMode === "manual"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <Pencil className="h-3.5 w-3.5 mb-1" />
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
                        className="pr-20 font-mono bg-background"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(form.password);
                            toast({ title: "Password copied!" });
                          }}
                          className="text-muted-foreground hover:text-foreground p-1"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="gap-2 w-full"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Generate New Password
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
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  The teacher will be prompted to change this on first login.
                </p>
              </div>
            )}
          </div>

          <SheetFooter>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editing ? (
                <Pencil className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              {saving
                ? "Saving…"
                : editing
                ? "Save Changes"
                : "Add Teacher & Create Account"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the teacher from the system. Their Firebase login account will remain active but they won't have access to this organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Credentials dialog (shown after creating a new teacher) */}
      <CredentialsDialog
        open={credDialogOpen}
        onClose={() => { setCredDialogOpen(false); setCreatedCreds(null); }}
        creds={createdCreds}
      />

      {/* Resend / Regenerate credentials dialog */}
      <RegenerateDialog
        open={regenOpen}
        onClose={() => { setRegenOpen(false); setRegenTeacher(null); }}
        teacher={regenTeacher}
        orgName={orgName}
      />
    </div>
  );
}
