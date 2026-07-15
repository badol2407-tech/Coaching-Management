import { useState } from "react";
import {
  useListStudents, useUpdateStudent, useDeleteStudent, getListStudentsQueryKey,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackStudentAdded, trackStudentUpdated, trackStudentDeleted } from "@/lib/analytics";
import {
  collection, addDoc, serverTimestamp, doc, setDoc,
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Pencil, Trash2, Search, MoreVertical, Eye, EyeOff,
  RefreshCw, Mail, MessageCircle, Copy, Link2, KeyRound,
  CheckCircle2, Loader2, ShieldCheck, UserPlus, RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";

// ── Types ─────────────────────────────────────────────────────────────────────

type Student = {
  id: string; name: string; phone?: string | null; email?: string | null;
  className?: string | null; section?: string | null; batch?: string | null;
  guardianName?: string | null; guardianPhone?: string | null;
  enrolledAt: string; hasFirebaseAuth?: boolean; uid?: string | null;
};


const emptyForm = {
  name: "", phone: "", email: "", address: "", className: "", section: "", batch: "",
  guardianName: "", guardianPhone: "",
  enrolledAt: new Date().toISOString().split("T")[0],
  password: "", passwordMode: "generate" as "manual" | "generate",
};

type CreatedCredentials = {
  name: string; email: string; password: string;
  role: "Student"; orgName: string; loginUrl: string;
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
                onClick={() => { navigator.clipboard.writeText(creds.password); toast({ title: "Password copied!" }); }}
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
          The student will be asked to set a new password on their first login.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const subject = encodeURIComponent(`Your ${creds.orgName} account credentials`);
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

// ── Resend credentials Dialog ──────────────────────────────────────────────────

function ResendDialog({
  open, onClose, student, orgName,
}: {
  open: boolean; onClose: () => void; student: Student | null; orgName: string;
}) {
  const { toast } = useToast();
  const [newPassword] = useState(() => generateTempPassword());
  const [copied, setCopied] = useState(false);

  if (!student || !student.email) return null;

  const creds: CreatedCredentials = {
    name: student.name, email: student.email, password: newPassword,
    role: "Student", orgName, loginUrl: getLoginUrl(),
  };
  const message = buildCredentialMessage(creds);

  async function sendResetEmail() {
    try {
      await sendPasswordResetEmail(auth, student!.email!);
      toast({ title: "Password reset email sent!" });
      onClose();
    } catch {
      toast({ title: "Could not send reset email", variant: "destructive" });
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
              <DialogDescription className="text-xs">{student.name}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{student.email}</span>
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
          <strong>Note:</strong> To apply this new password, use <em>Send Password Reset Email</em> — the student can then set their new password.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const subject = encodeURIComponent(`Your ${orgName} account`);
              window.open(`mailto:${student.email}?subject=${subject}&body=${encodeURIComponent(message)}`);
            }}
            className="gap-2"
          >
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="ghost" size="sm"
            onClick={() => {
              navigator.clipboard.writeText(message);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
              toast({ title: "Copied!" });
            }}
            className="gap-2 text-xs"
          >
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

// ── Main component ─────────────────────────────────────────────────────────────

export default function Students() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<CreatedCredentials | null>(null);
  const [credDialogOpen, setCredDialogOpen] = useState(false);
  const [resendStudent, setResendStudent] = useState<Student | null>(null);
  const [resendOpen, setResendOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: students = [], isLoading } = useListStudents({ search: search || undefined });
  const { data: classes = [] } = useListClasses();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListStudentsQueryKey() });

  const orgId = userProfile?.orgId;
  const orgName = userProfile?.orgName ?? "Your Organization";

  function openAdd() {
    setEditing(null);
    const pw = generateTempPassword();
    setForm({ ...emptyForm, password: pw, passwordMode: "generate" });
    setShowPassword(true);
    setSheetOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      name: s.name, phone: s.phone ?? "", email: s.email ?? "", address: "",
      className: s.className ?? "", section: s.section ?? "", batch: s.batch ?? "",
      guardianName: s.guardianName ?? "", guardianPhone: s.guardianPhone ?? "",
      enrolledAt: s.enrolledAt, password: "", passwordMode: "generate",
    });
    setShowPassword(false);
    setSheetOpen(true);
  }

  function handleGeneratePassword() {
    setForm((f) => ({ ...f, password: generateTempPassword(), passwordMode: "generate" }));
    setShowPassword(true);
  }

  const requiredFieldDefs: { key: keyof typeof emptyForm; label: string }[] = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "className", label: "Class" },
    { key: "section", label: "Section" },
    { key: "batch", label: "Batch" },
    { key: "guardianName", label: "Guardian Name" },
    { key: "guardianPhone", label: "Guardian Phone" },
    { key: "enrolledAt", label: "Enrollment Date" },
  ];

  function getMissingFields() {
    return requiredFieldDefs.filter((f) => !String(form[f.key] ?? "").trim());
  }

  async function handleSave() {
    const missing = getMissingFields();
    if (missing.length > 0) {
      toast({
        title: "সব ঘর পূরণ করুন (All fields are required)",
        description: `Missing: ${missing.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        // ── Edit existing student ──────────────────────────────────────────
        const data: Record<string, unknown> = {
          name: form.name, phone: form.phone || null, email: form.email || null,
          address: form.address || null, className: form.className || null,
          section: form.section || null,
          batch: form.batch || null, guardianName: form.guardianName || null,
          guardianPhone: form.guardianPhone || null, enrolledAt: form.enrolledAt,
        };
        await updateStudent.mutateAsync({ id: editing.id, data });
        trackStudentUpdated();
        toast({ title: "Student updated" });
        setSheetOpen(false);
        invalidate();
      } else {
        // ── Create new student ─────────────────────────────────────────────
        const email = form.email.trim();
        const password = form.password.trim();

        if (!email) {
          toast({ title: "Email is required for new students", variant: "destructive" });
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
            role: "student",
            orgId,
            name: form.name.trim(),
            email,
            mustChangePassword: true,
            createdByAdmin: true,
            createdAt: serverTimestamp(),
          });
        } catch {
          // Firestore write may fail if security rules don't allow cross-user writes.
          // Student can complete profile via Setup flow on first login.
        }

        // 3. Write to org students sub-collection (link uid for portal)
        const studentDocRef = await addDoc(
          collection(db, "organizations", orgId, "students"),
          {
            uid,
            name: form.name.trim(),
            phone: form.phone.trim() || null,
            email,
            className: form.className.trim() || null,
            section: form.section.trim() || null,
            batch: form.batch.trim() || null,
            guardianName: form.guardianName.trim() || null,
            guardianPhone: form.guardianPhone.trim() || null,
            enrolledAt: form.enrolledAt,
            hasFirebaseAuth: true,
            createdAt: serverTimestamp(),
            source: "admin",
          }
        );

        // 4. Link studentId back into the user profile
        try {
          await setDoc(doc(db, "users", uid), { studentId: studentDocRef.id }, { merge: true });
        } catch { /* non-critical */ }

        trackStudentAdded();
        invalidate();
        setSheetOpen(false);

        // 5. Show credential sharing dialog
        setCreatedCreds({
          name: form.name.trim(), email, password,
          role: "Student", orgName, loginUrl: getLoginUrl(),
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
    deleteStudent.mutate(
      { id: deleteId },
      {
        onSuccess: () => { trackStudentDeleted(); toast({ title: "Student deleted" }); invalidate(); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
    setDeleteId(null);
  }

  function copyLoginUrl() {
    navigator.clipboard.writeText(getLoginUrl());
    toast({ title: "Login URL copied!" });
  }

  function copyLoginInfo(s: Student) {
    const info = `Name: ${s.name}\nEmail: ${s.email ?? "—"}\nRole: Student\nLogin: ${getLoginUrl()}`;
    navigator.clipboard.writeText(info);
    toast({ title: "Login info copied!" });
  }

  async function sendPasswordReset(s: Student) {
    if (!s.email) { toast({ title: "No email on file", variant: "destructive" }); return; }
    try {
      await sendPasswordResetEmail(auth, s.email);
      toast({ title: "Reset email sent!", description: `Sent to ${s.email}` });
    } catch {
      toast({ title: "Could not send reset email", variant: "destructive" });
    }
  }

  const selectedClass = (classes as any[]).find((c: any) => c.name === form.className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={openAdd}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Access</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={9} className="h-12 animate-pulse bg-muted/30" />
                </TableRow>
              ))
            ) : (students as Student[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  {search ? "No students match your search." : "No students yet. Click \"Add Student\" to get started."}
                </TableCell>
              </TableRow>
            ) : (
              (students as Student[]).map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.className ?? "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    {s.section ? <Badge variant="outline">{s.section}</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {s.batch ? <Badge variant="secondary">{s.batch}</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.phone ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{s.guardianName ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{s.enrolledAt}</TableCell>
                  <TableCell>
                    {s.hasFirebaseAuth ? (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <ShieldCheck className="h-3 w-3 text-green-500" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">No login</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          {s.hasFirebaseAuth && s.email && (
                            <>
                              <DropdownMenuItem
                                onClick={() => { setResendStudent(s); setResendOpen(true); }}
                                className="gap-2"
                              >
                                <RefreshCw className="h-4 w-4 text-blue-500" />
                                Resend Credentials
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => sendPasswordReset(s)}
                                className="gap-2"
                              >
                                <RotateCcw className="h-4 w-4 text-orange-500" />
                                Send Password Reset Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem onClick={() => copyLoginInfo(s)} className="gap-2">
                            <Copy className="h-4 w-4" /> Copy Login Info
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={copyLoginUrl} className="gap-2">
                            <Link2 className="h-4 w-4" /> Copy Login URL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(s.id)}
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Student
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

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Student" : "Add Student"}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Student's full name"
              />
            </div>
            {/* Email */}
            <div className="space-y-1">
              <Label>Email {!editing && <span className="text-destructive">*</span>}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="student@example.com"
                disabled={!!editing}
                className={editing ? "bg-muted cursor-not-allowed" : ""}
              />
              {editing && (
                <p className="text-xs text-muted-foreground">Email cannot be changed after creation.</p>
              )}
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone <span className="text-destructive">*</span></Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
            </div>
            {/* Class */}
            <div className="space-y-1">
              <Label>Class <span className="text-destructive">*</span></Label>
              {(classes as any[]).length > 0 ? (
                <Select
                  value={form.className}
                  onValueChange={(val) => setForm((f) => ({ ...f, className: val, batch: "" }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {(classes as any[]).map((c: any) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={form.className}
                  onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                  placeholder="e.g. Class 10"
                />
              )}
            </div>
            {/* Section */}
            <div className="space-y-1">
              <Label>Section <span className="text-destructive">*</span></Label>
              <Select
                value={form.section}
                onValueChange={(val) => setForm((f) => ({ ...f, section: val }))}
              >
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Batch */}
            <div className="space-y-1">
              <Label>Batch <span className="text-destructive">*</span></Label>
              {availableBatches.length > 0 ? (
                <Select
                  value={form.batch}
                  onValueChange={(val) => setForm((f) => ({ ...f, batch: val }))}
                >
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((b: string) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={form.batch}
                  onChange={(e) => setForm((f) => ({ ...f, batch: e.target.value }))}
                  placeholder="e.g. Morning Batch"
                />
              )}
            </div>
            {/* Guardian */}
            <div className="space-y-1">
              <Label>Guardian Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.guardianName}
                onChange={(e) => setForm((f) => ({ ...f, guardianName: e.target.value }))}
                placeholder="Guardian's name"
              />
            </div>
            <div className="space-y-1">
              <Label>Guardian Phone <span className="text-destructive">*</span></Label>
              <Input
                value={form.guardianPhone}
                onChange={(e) => setForm((f) => ({ ...f, guardianPhone: e.target.value }))}
                placeholder="01XXXXXXXXX"
              />
            </div>
            {/* Enrolled date */}
            <div className="space-y-1">
              <Label>Enrollment Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={form.enrolledAt}
                onChange={(e) => setForm((f) => ({ ...f, enrolledAt: e.target.value }))}
              />
            </div>

            {/* Password section — only for new students */}
            {!editing && (
              <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  <Label className="text-sm font-semibold">Login Password</Label>
                </div>

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
                          onClick={() => { navigator.clipboard.writeText(form.password); toast({ title: "Password copied!" }); }}
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
                  The student will be prompted to change this on their first login.
                </p>
              </div>
            )}
          </div>

          <SheetFooter>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
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
                : "Add Student & Create Account"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student and all related records. Their Firebase login account will remain active.
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

      {/* Credentials dialog */}
      <CredentialsDialog
        open={credDialogOpen}
        onClose={() => { setCredDialogOpen(false); setCreatedCreds(null); }}
        creds={createdCreds}
      />

      {/* Resend credentials dialog */}
      <ResendDialog
        open={resendOpen}
        onClose={() => { setResendOpen(false); setResendStudent(null); }}
        student={resendStudent}
        orgName={orgName}
      />
    </div>
  );
}
