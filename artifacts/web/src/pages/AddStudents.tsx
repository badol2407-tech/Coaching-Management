import { useState, useRef } from "react";
import { Link } from "wouter";
import * as XLSX from "xlsx";
import {
  collection, addDoc, serverTimestamp, getDocs, doc, setDoc,
  query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createFirebaseAuthUser } from "@/lib/auth-utils";
import { useAuth } from "@/contexts/AuthContext";
import { useListClasses } from "@/lib/class-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Upload, Download, FileSpreadsheet, Link2, CheckCircle2, XCircle,
  ArrowLeft, Users, AlertCircle, Copy, RefreshCw, UserCheck, Clock,
  Loader2, UserPlus, Eye, EyeOff,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// ── Types ─────────────────────────────────────────────────────────────────────

type ImportRow = {
  name: string;
  phone?: string;
  email?: string;
  className?: string;
  guardianName?: string;
  guardianPhone?: string;
  enrolledAt?: string;
  _status?: "valid" | "error";
  _error?: string;
};

type AdmissionRequest = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  className?: string;
  section?: string;
  batch?: string;
  guardianName?: string;
  guardianPhone?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

type ActiveTab = "manual" | "excel" | "admission";
type ImportStep = "upload" | "preview" | "importing" | "done";

// ── Template download ─────────────────────────────────────────────────────────

function downloadTemplate() {
  const headers = ["Name *", "Phone", "Email", "Class", "Guardian Name", "Guardian Phone", "Enrolled Date (YYYY-MM-DD)"];
  const sample = [
    ["Rahim Uddin", "01711-123456", "rahim@example.com", "Class 9", "Karim Uddin", "01711-654321", "2025-01-15"],
    ["Nasrin Akter", "01812-234567", "nasrin@example.com", "Class 10", "Abdur Rahim", "01812-765432", "2025-02-01"],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  ws["!cols"] = headers.map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, "student_import_template.xlsx");
}

// ── Manual Single-Student Add ─────────────────────────────────────────────────

function ManualAdd() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: classes = [] } = useListClasses();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", className: "", batch: "",
    guardianName: "", guardianPhone: "", enrolledAt: new Date().toISOString().split("T")[0],
  });

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  const selectedClass = (classes as any[]).find((c: any) => c.name === form.className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const requiredFields: { key: keyof typeof form; label: string }[] = [
    { key: "name", label: "Full Name" },
    { key: "className", label: "Class" },
    { key: "batch", label: "Batch" },
    { key: "phone", label: "Phone Number" },
    { key: "email", label: "Email" },
    { key: "guardianName", label: "Guardian Name" },
    { key: "guardianPhone", label: "Guardian Phone" },
    { key: "enrolledAt", label: "Enrollment Date" },
  ];
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  function getMissingFields() {
    return requiredFields.filter(f => !form[f.key].trim());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userProfile?.orgId) return;

    // Password validation — checked separately before field completeness
    if (!form.password.trim()) {
      setErrors(er => ({ ...er, password: true }));
      toast({ title: "Password is required", description: "Enter a login password for this student.", variant: "destructive" });
      return;
    }
    if (form.password.length < 6) {
      setErrors(er => ({ ...er, password: true }));
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    const missing = getMissingFields();
    if (missing.length > 0) {
      setErrors(Object.fromEntries(missing.map(f => [f.key, true])));
      toast({
        title: "সব field পূরণ করুন",
        description: `এই field(s) বাকি আছে: ${missing.map(f => f.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // Step 1 — create Firebase Auth account via secondary app so admin stays signed in
      let uid: string;
      try {
        uid = await createFirebaseAuthUser(form.email.trim(), form.password);
      } catch (authErr: any) {
        const code = (authErr?.code ?? "") as string;
        if (code === "auth/email-already-in-use") {
          setErrors(er => ({ ...er, email: true }));
          toast({ title: "Email already in use", description: "A login account with this email already exists. Use a different email.", variant: "destructive" });
        } else if (code === "auth/weak-password") {
          setErrors(er => ({ ...er, password: true }));
          toast({ title: "Weak password", description: "Password must be at least 6 characters.", variant: "destructive" });
        } else if (code === "auth/invalid-email") {
          setErrors(er => ({ ...er, email: true }));
          toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
        } else {
          toast({ title: "Account creation failed", description: authErr?.message ?? "Could not create login account. Try again.", variant: "destructive" });
        }
        return;
      }

      // Step 2 — write the student record linked to the new Firebase Auth UID
      await addDoc(collection(db, "organizations", userProfile.orgId, "students"), {
        uid,
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim(),
        className: form.className.trim() || null,
        batch: form.batch.trim() || null,
        guardianName: form.guardianName.trim() || null,
        guardianPhone: form.guardianPhone.trim() || null,
        enrolledAt: form.enrolledAt || new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
        source: "manual",
        hasFirebaseAuth: true,
      });

      // Step 3 — write the user profile so the student can log in
      await setDoc(doc(db, "users", uid), {
        role: "student",
        orgId: userProfile.orgId,
        name: form.name.trim(),
        email: form.email.trim(),
        mustChangePassword: false,
        createdByAdmin: true,
        createdAt: serverTimestamp(),
      });

      qc.invalidateQueries({ queryKey: [userProfile.orgId, "students"] });
      toast({ title: `${form.name} added!`, description: "Account created — they can now log in with their email & password." });
      setDone(true);
    } catch {
      toast({ title: "Error", description: "Could not add student. Try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="py-14 text-center space-y-5">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <p className="text-xl font-bold">{form.name} added!</p>
          <p className="text-sm text-muted-foreground mt-1">Account created — they can now log in with their email & password.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setDone(false); setShowPassword(false); setForm({ name: "", phone: "", email: "", password: "", className: "", batch: "", guardianName: "", guardianPhone: "", enrolledAt: new Date().toISOString().split("T")[0] }); }}>
            Add Another
          </Button>
          <Button asChild><Link href="/students">View Students</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="m-name">Full Name <span className="text-destructive">*</span></Label>
          <Input id="m-name" placeholder="যেমন: Rahim Uddin" value={form.name}
            onChange={e => { set("name")(e); setErrors(er => ({ ...er, name: false })); }}
            className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-class">Class <span className="text-destructive">*</span></Label>
          {(classes as any[]).length > 0 ? (
            <Select
              value={form.className}
              onValueChange={val => { setForm(f => ({ ...f, className: val, batch: "" })); setErrors(er => ({ ...er, className: false })); }}
            >
              <SelectTrigger id="m-class" className={errors.className ? "border-destructive focus:ring-destructive" : ""}><SelectValue placeholder="Class বেছে নিন" /></SelectTrigger>
              <SelectContent>
                {(classes as any[]).map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input id="m-class" placeholder="যেমন: Class 9, SSC 2026" value={form.className}
              onChange={e => { set("className")(e); setErrors(er => ({ ...er, className: false })); }}
              className={errors.className ? "border-destructive focus-visible:ring-destructive" : ""} />
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-batch">Batch <span className="text-destructive">*</span></Label>
          {availableBatches.length > 0 ? (
            <Select
              value={form.batch}
              onValueChange={val => { setForm(f => ({ ...f, batch: val })); setErrors(er => ({ ...er, batch: false })); }}
            >
              <SelectTrigger id="m-batch" className={errors.batch ? "border-destructive focus:ring-destructive" : ""}><SelectValue placeholder="Batch বেছে নিন" /></SelectTrigger>
              <SelectContent>
                {availableBatches.map((b: string) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input id="m-batch" placeholder="যেমন: Morning Batch" value={form.batch}
              onChange={e => { set("batch")(e); setErrors(er => ({ ...er, batch: false })); }}
              className={errors.batch ? "border-destructive focus-visible:ring-destructive" : ""} />
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-phone">Phone Number <span className="text-destructive">*</span></Label>
          <Input id="m-phone" placeholder="01XXXXXXXXX" value={form.phone}
            onChange={e => { set("phone")(e); setErrors(er => ({ ...er, phone: false })); }}
            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-email">Email <span className="text-destructive">*</span></Label>
          <Input id="m-email" type="email" placeholder="student@example.com" value={form.email}
            onChange={e => { set("email")(e); setErrors(er => ({ ...er, email: false })); }}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-password">Password <span className="text-destructive">*</span></Label>
          <div className="relative">
            <Input
              id="m-password"
              type={showPassword ? "text" : "password"}
              placeholder="কমপক্ষে ৬ character"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: false })); }}
              className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Student logs in with this. Must be ≥ 6 characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-guardian">Guardian Name <span className="text-destructive">*</span></Label>
          <Input id="m-guardian" placeholder="Guardian-এর নাম" value={form.guardianName}
            onChange={e => { set("guardianName")(e); setErrors(er => ({ ...er, guardianName: false })); }}
            className={errors.guardianName ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-gphone">Guardian Phone <span className="text-destructive">*</span></Label>
          <Input id="m-gphone" placeholder="01XXXXXXXXX" value={form.guardianPhone}
            onChange={e => { set("guardianPhone")(e); setErrors(er => ({ ...er, guardianPhone: false })); }}
            className={errors.guardianPhone ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="m-enrolled">Enrollment Date <span className="text-destructive">*</span></Label>
          <Input id="m-enrolled" type="date" value={form.enrolledAt}
            onChange={e => { set("enrolledAt")(e); setErrors(er => ({ ...er, enrolledAt: false })); }}
            className={errors.enrolledAt ? "border-destructive focus-visible:ring-destructive" : ""} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !form.name.trim()} className="gap-2 min-w-[140px]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {loading ? "Adding…" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}

// ── Excel Import Tab ──────────────────────────────────────────────────────────

function ExcelImport() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<ImportStep>("upload");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);

  function parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        if (json.length < 2) {
          toast({ title: "Empty file", description: "The template has no data rows.", variant: "destructive" });
          return;
        }
        const parsed: ImportRow[] = json.slice(1).filter(r => r[0]?.toString().trim()).map((r) => {
          const name = r[0]?.toString().trim();
          const row: ImportRow = {
            name,
            phone: r[1]?.toString().trim() || undefined,
            email: r[2]?.toString().trim() || undefined,
            className: r[3]?.toString().trim() || undefined,
            guardianName: r[4]?.toString().trim() || undefined,
            guardianPhone: r[5]?.toString().trim() || undefined,
            enrolledAt: r[6]?.toString().trim() || new Date().toISOString().split("T")[0],
          };
          if (!name) {
            row._status = "error";
            row._error = "Name is required";
          } else {
            row._status = "valid";
          }
          return row;
        });
        setRows(parsed);
        setStep("preview");
      } catch {
        toast({ title: "Parse error", description: "Could not read the file. Use the template.", variant: "destructive" });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function runImport() {
    if (!userProfile?.orgId) return;
    setStep("importing");
    const orgId = userProfile.orgId;
    const valid = rows.filter(r => r._status === "valid");
    let done = 0;
    for (const row of valid) {
      try {
        await addDoc(collection(db, "organizations", orgId, "students"), {
          name: row.name,
          phone: row.phone ?? null,
          email: row.email ?? null,
          className: row.className ?? null,
          guardianName: row.guardianName ?? null,
          guardianPhone: row.guardianPhone ?? null,
          enrolledAt: row.enrolledAt ?? new Date().toISOString().split("T")[0],
          createdAt: serverTimestamp(),
          source: "excel_import",
        });
        done++;
        setProgress(Math.round((done / valid.length) * 100));
      } catch {
        // continue
      }
    }
    setImportedCount(done);
    qc.invalidateQueries({ queryKey: [orgId, "students"] });
    setStep("done");
  }

  function reset() {
    setStep("upload");
    setRows([]);
    setProgress(0);
    setImportedCount(0);
    if (fileRef.current) fileRef.current.value = "";
  }

  const validCount = rows.filter(r => r._status === "valid").length;
  const errorCount = rows.filter(r => r._status === "error").length;

  if (step === "upload") {
    return (
      <div className="space-y-6">
        {/* Download template */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Download Template</p>
              <p className="text-xs text-muted-foreground">Fill it with student data, then upload below</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2 shrink-0">
            <Download className="h-4 w-4" />
            Template
          </Button>
        </div>

        {/* Upload zone */}
        <div
          className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition-all"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) parseFile(file);
          }}
        >
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Drop your Excel file here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse — .xlsx, .xls supported</p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) parseFile(e.target.files[0]); }}
          />
        </div>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{rows.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total rows</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{validCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ready to import</p>
          </div>
          {errorCount > 0 && (
            <div className="rounded-xl border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-destructive">{errorCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Errors (skipped)</p>
            </div>
          )}
        </div>

        {/* Preview table */}
        <div className="rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Enrolled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 50).map((row, i) => (
                  <TableRow key={i} className={row._status === "error" ? "bg-destructive/5" : ""}>
                    <TableCell>
                      {row._status === "valid"
                        ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                        : <XCircle className="h-4 w-4 text-destructive" />}
                    </TableCell>
                    <TableCell className="font-medium">{row.name || <span className="text-destructive text-xs">{row._error}</span>}</TableCell>
                    <TableCell className="text-muted-foreground">{row.className ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.guardianName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.enrolledAt ?? "—"}</TableCell>
                  </TableRow>
                ))}
                {rows.length > 50 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-2">
                      +{rows.length - 50} more rows not shown
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={reset}>Upload different file</Button>
          <Button onClick={runImport} disabled={validCount === 0} className="gap-2">
            <Upload className="h-4 w-4" />
            Import {validCount} students
          </Button>
        </div>
      </div>
    );
  }

  if (step === "importing") {
    return (
      <div className="py-16 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div>
          <p className="text-lg font-semibold">Importing students…</p>
          <p className="text-sm text-muted-foreground mt-1">{progress}% complete</p>
        </div>
        <div className="mx-auto w-64 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  // done
  return (
    <div className="py-16 text-center space-y-5">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <p className="text-xl font-bold">{importedCount} students imported!</p>
        <p className="text-sm text-muted-foreground mt-1">They are now available in your Students list.</p>
      </div>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={reset} className="gap-2">
          <Upload className="h-4 w-4" />
          Import more
        </Button>
        <Button asChild>
          <Link href="/students">View Students</Link>
        </Button>
      </div>
    </div>
  );
}

// ── Admission Link Tab ────────────────────────────────────────────────────────

function AdmissionLinkTab() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdmissionRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const qc = useQueryClient();

  const orgId = userProfile?.orgId;
  const studentLink = orgId
    ? `${window.location.origin}/join/${orgId}/student`
    : null;

  function copyStudentLink() {
    if (!studentLink) return;
    navigator.clipboard.writeText(studentLink);
    toast({ title: "Student link copied!", description: "Share this link — only the student form (with email & password) will show." });
  }

  async function loadRequests() {
    if (!orgId) return;
    setLoadingRequests(true);
    try {
      const q = query(
        collection(db, "organizations", orgId, "admission_requests"),
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
          className: r.className,
          section: r.section,
          batch: r.batch,
          guardianName: r.guardianName,
          guardianPhone: r.guardianPhone,
          status: r.status,
          createdAt: r.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        } as AdmissionRequest;
      });
      setRequests(data);
    } finally {
      setLoadingRequests(false);
    }
  }

  function refreshAll() {
    loadRequests();
  }

  async function approve(req: AdmissionRequest) {
    if (!orgId) return;
    setProcessingId(req.id);
    try {
      await addDoc(collection(db, "organizations", orgId, "students"), {
        uid: req.uid ?? null,
        name: req.name,
        phone: req.phone ?? null,
        email: req.email ?? null,
        className: req.className ?? null,
        section: req.section ?? null,
        batch: req.batch ?? null,
        guardianName: req.guardianName ?? null,
        guardianPhone: req.guardianPhone ?? null,
        enrolledAt: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
        source: "admission_link",
        hasFirebaseAuth: !!req.uid,
      });
      // The student already chose their own email/password on the join form —
      // creating their `users/{uid}` profile here is what turns that on for login.
      if (req.uid) {
        await setDoc(doc(db, "users", req.uid), {
          role: "student",
          orgId,
          name: req.name,
          email: req.email ?? null,
          mustChangePassword: false,
          createdByAdmin: false,
          createdAt: serverTimestamp(),
        });
      }
      await setDoc(
        doc(db, "organizations", orgId, "admission_requests", req.id),
        { status: "approved" },
        { merge: true },
      );
      setRequests((r) => r.filter((x) => x.id !== req.id));
      qc.invalidateQueries({ queryKey: [orgId, "students"] });
      toast({ title: `${req.name} approved!`, description: "Added to student list. They can now log in with the email & password they chose." });
    } catch {
      toast({ title: "Error", description: "Could not approve request.", variant: "destructive" });
    } finally {
      setProcessingId(null);
    }
  }

  async function reject(req: AdmissionRequest) {
    if (!orgId) return;
    setProcessingId(req.id);
    try {
      await setDoc(
        doc(db, "organizations", orgId, "admission_requests", req.id),
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
    <div className="space-y-6">
      {/* Link card */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/[0.02] p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Student Join Link</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only students fill this up — with their own email &amp; password. Looking for the teacher link? Find it in the Teachers tab.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 min-w-0 rounded-lg border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground truncate font-mono">
              {studentLink ?? "—"}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={copyStudentLink} className="gap-1.5 shrink-0">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Unique to your organization</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Admin approval required</span>
        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Works on any device</span>
      </div>

      {/* Pending student requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Pending Student Requests</h3>
            {requests.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">{requests.length}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshAll}
            disabled={loadingRequests}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingRequests ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {requests.length === 0 && !loadingRequests && (
          <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center">
            <UserCheck className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No pending student requests</p>
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
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Batch</TableHead>
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
                      <Badge variant="outline" className="text-xs">{req.className ?? "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      {req.section ? <Badge variant="outline" className="text-xs">{req.section}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell>
                      {req.batch ? <Badge variant="secondary" className="text-xs">{req.batch}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddStudents() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("manual");

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; desc: string }[] = [
    {
      id: "manual",
      label: "সরাসরি যোগ করুন",
      icon: UserPlus,
      desc: "একজন student-এর তথ্য সরাসরি form-এ দিন",
    },
    {
      id: "excel",
      label: "Bulk Excel Import",
      icon: FileSpreadsheet,
      desc: "Upload a spreadsheet to add many students at once",
    },
    {
      id: "admission",
      label: "Admission Link",
      icon: Link2,
      desc: "Let students register themselves via a link",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0">
          <Link href="/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Add Students
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose how you want to add students to your organization
          </p>
        </div>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative text-left rounded-xl border p-4 transition-all
                ${active
                  ? "border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold leading-tight ${active ? "text-primary" : "text-foreground"}`}>
                    {tab.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{tab.desc}</p>
                </div>
              </div>
              {active && (
                <div className="absolute top-3 right-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            {activeTab === "manual"
              ? <UserPlus className="h-4 w-4 text-primary" />
              : activeTab === "excel"
              ? <FileSpreadsheet className="h-4 w-4 text-primary" />
              : <Link2 className="h-4 w-4 text-primary" />}
            <CardTitle className="text-base">
              {activeTab === "manual" ? "নতুন Student যোগ করুন" : activeTab === "excel" ? "Excel Import" : "Admission Link"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {activeTab === "manual"
              ? "Student-এর তথ্য নিচের form-এ দিন এবং সরাসরি যোগ করুন।"
              : activeTab === "excel"
              ? "Download the template, fill it in, and upload to import students in bulk."
              : "Share your unique link. Students self-register with their own email & password, and you approve them below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === "manual" ? <ManualAdd /> : activeTab === "excel" ? <ExcelImport /> : <AdmissionLinkTab />}
        </CardContent>
      </Card>

      {/* Info notice */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Admin only —</span> This feature is only available to Organization Admins. Students added here will automatically appear in your Students list.
        </p>
      </div>
    </div>
  );
}
