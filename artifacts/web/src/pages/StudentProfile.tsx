import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Pencil, UserCircle, Phone, Mail, BookOpen,
  Users, CalendarDays, Hash, PhoneCall, ShieldCheck, Clock,
  MapPin, ImagePlus, Loader2, Save, ToggleLeft, ToggleRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";
import { useListClasses } from "@/lib/class-hooks";

// ── Types ─────────────────────────────────────────────────────────────────────

type StudentDoc = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  enrolledAt?: string | null;
  hasFirebaseAuth?: boolean;
  uid?: string | null;
  // Sprint 1 additions
  status?: "active" | "inactive" | null;
  rollNumber?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  photoUrl?: string | null;
  createdAt?: any;
  source?: string | null;
};

// ── Helper ────────────────────────────────────────────────────────────────────

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-medium mt-0.5 break-words">{value || <span className="text-muted-foreground">—</span>}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function StudentProfile() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/students/:id");
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const { data: classes = [] } = useListClasses();

  const [student, setStudent] = useState<StudentDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Edit sheet state
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    name: "", phone: "", address: "", className: "", section: "", batch: "",
    guardianName: "", guardianPhone: "", enrolledAt: "",
    rollNumber: "", emergencyContact: "", emergencyPhone: "",
    photoUrl: "", status: "active" as "active" | "inactive",
  });

  const studentId = (params as any)?.id as string | undefined;
  const orgId = userProfile?.orgId;

  useEffect(() => {
    if (!studentId || !orgId) return;
    setLoading(true);
    getDoc(doc(db, "organizations", orgId, "students", studentId))
      .then((snap) => {
        if (!snap.exists()) {
          setNotFound(true);
        } else {
          setStudent({ id: snap.id, ...(snap.data() as any) });
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [studentId, orgId]);

  function openEdit() {
    if (!student) return;
    // Revoke any leftover local preview from a previous edit session
    if (localPhotoPreview) {
      URL.revokeObjectURL(localPhotoPreview);
      setLocalPhotoPreview(null);
    }
    setPhotoFile(null);
    setEditForm({
      name: student.name ?? "",
      phone: student.phone ?? "",
      address: student.address ?? "",
      className: student.className ?? "",
      section: student.section ?? "",
      batch: student.batch ?? "",
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone ?? "",
      enrolledAt: student.enrolledAt ?? "",
      rollNumber: student.rollNumber ?? "",
      emergencyContact: student.emergencyContact ?? "",
      emergencyPhone: student.emergencyPhone ?? "",
      photoUrl: student.photoUrl ?? "",
      status: (student.status ?? "active") as "active" | "inactive",
    });
    setEditOpen(true);
  }

  async function handleSave() {
    if (!studentId || !orgId) return;
    setSaving(true);
    try {
      // Upload the staged photo file now (only on Save, not on selection)
      let finalPhotoUrl = editForm.photoUrl || null;
      if (photoFile) {
        try {
          const path = `organizations/${orgId}/student-photos/${Date.now()}_${photoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
          const sRef = storageRef(storage, path);
          // Race the upload against a 25-second timeout so a hanging Storage
          // request doesn't freeze the Save button forever.
          await Promise.race([
            uploadBytes(sRef, photoFile),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 25000)
            ),
          ]);
          finalPhotoUrl = await getDownloadURL(sRef);
        } catch (err: any) {
          const isTimeout = err?.message === "timeout";
          toast({
            title: isTimeout
              ? "Photo upload timed out. Save will proceed without the new photo."
              : "Photo upload failed. Check Firebase Storage rules.",
            variant: "destructive",
          });
          // Fall through — save other fields using the existing photoUrl
          finalPhotoUrl = editForm.photoUrl || null;
          // Clear the pending file so the form resets cleanly
          if (localPhotoPreview) { URL.revokeObjectURL(localPhotoPreview); setLocalPhotoPreview(null); }
          setPhotoFile(null);
        }
      }

      const data: Record<string, unknown> = {
        name: editForm.name,
        phone: editForm.phone || null,
        address: editForm.address || null,
        className: editForm.className || null,
        section: editForm.section || null,
        batch: editForm.batch || null,
        guardianName: editForm.guardianName || null,
        guardianPhone: editForm.guardianPhone || null,
        enrolledAt: editForm.enrolledAt || null,
        rollNumber: editForm.rollNumber || null,
        emergencyContact: editForm.emergencyContact || null,
        emergencyPhone: editForm.emergencyPhone || null,
        photoUrl: finalPhotoUrl,
        status: editForm.status,
      };
      await updateDoc(doc(db, "organizations", orgId, "students", studentId), data);

      // Sync photoUrl to the student's auth user doc so the portal sidebar picks it up
      if (student?.uid && finalPhotoUrl !== undefined) {
        try {
          await setDoc(doc(db, "users", student.uid), { photoUrl: finalPhotoUrl }, { merge: true });
        } catch {
          // Non-fatal — portal avatar sync failed silently
        }
      }

      // Clean up local object URL
      if (localPhotoPreview) {
        URL.revokeObjectURL(localPhotoPreview);
        setLocalPhotoPreview(null);
      }
      setPhotoFile(null);

      setStudent((prev) => prev ? { ...prev, ...data, id: prev.id } as StudentDoc : prev);
      toast({ title: "Student updated!" });
      setEditOpen(false);
    } catch {
      toast({ title: "Failed to save changes", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  const selectedClass = (classes as any[]).find((c: any) => c.name === editForm.className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  if (!match) return null;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound || !student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <UserCircle className="h-14 w-14 text-muted-foreground" />
        <p className="text-lg font-semibold">Student not found</p>
        <p className="text-sm text-muted-foreground">This student may have been deleted or you may not have access.</p>
        <Button variant="outline" onClick={() => navigate("/students")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Students
        </Button>
      </div>
    );
  }

  const isActive = (student.status ?? "active") === "active";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/students")} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Students
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={openEdit}
          className="gap-2"
        >
          <Pencil className="h-4 w-4" /> Edit Student
        </Button>
      </div>

      {/* Profile Hero */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600" />
        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex items-end gap-4 -mt-10">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={student.name}
                className="h-20 w-20 rounded-2xl object-cover border-4 border-background shadow-md shrink-0"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-background shadow-md shrink-0">
                {student.name[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{student.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {isActive ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs gap-1 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" /> Inactive
                  </Badge>
                )}
                {student.hasFirebaseAuth && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <ShieldCheck className="h-3 w-3 text-green-500" /> Portal Access
                  </Badge>
                )}
                {student.rollNumber && (
                  <Badge variant="outline" className="gap-1 text-xs font-mono">
                    <Hash className="h-3 w-3" /> {student.rollNumber}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              icon={<Mail className="h-4 w-4 text-blue-500" />}
              label="Email"
              value={student.email}
            />
            <Field
              icon={<Phone className="h-4 w-4 text-green-500" />}
              label="Phone"
              value={student.phone}
            />
            <Field
              icon={<MapPin className="h-4 w-4 text-orange-500" />}
              label="Address"
              value={student.address}
            />
          </CardContent>
        </Card>

        {/* Academic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              icon={<BookOpen className="h-4 w-4 text-indigo-500" />}
              label="Class"
              value={student.className}
            />
            <Field
              icon={<Users className="h-4 w-4 text-purple-500" />}
              label="Section / Batch"
              value={[student.section, student.batch].filter(Boolean).join(" · ") || null}
            />
            <Field
              icon={<Hash className="h-4 w-4 text-orange-500" />}
              label="Roll Number"
              value={student.rollNumber}
            />
            <Field
              icon={<CalendarDays className="h-4 w-4 text-teal-500" />}
              label="Admission Date"
              value={student.enrolledAt}
            />
          </CardContent>
        </Card>

        {/* Guardian Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Parent / Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              icon={<UserCircle className="h-4 w-4 text-pink-500" />}
              label="Guardian Name"
              value={student.guardianName}
            />
            <Field
              icon={<Phone className="h-4 w-4 text-green-500" />}
              label="Guardian Phone"
              value={student.guardianPhone}
            />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              icon={<PhoneCall className="h-4 w-4 text-destructive" />}
              label="Contact Name"
              value={student.emergencyContact}
            />
            <Field
              icon={<Phone className="h-4 w-4 text-destructive" />}
              label="Contact Phone"
              value={student.emergencyPhone}
            />
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Student ID: <span className="font-mono">{student.id}</span></span>
            </div>
            {student.source && (
              <div className="flex items-center gap-1.5">
                <span>Source: <span className="capitalize">{student.source}</span></span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Inline Edit Sheet ──────────────────────────────────────────────────── */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit Student Profile</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-4">
            {/* Photo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <ImagePlus className="h-3.5 w-3.5 text-muted-foreground" /> Student Photo
              </Label>
              <div className="flex items-center gap-3">
                {(localPhotoPreview || editForm.photoUrl) ? (
                  <img
                    src={localPhotoPreview || editForm.photoUrl}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover border shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center shrink-0 border">
                    <UserCircle className="h-7 w-7 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <Button
                    type="button" variant="outline" size="sm"
                    onClick={() => photoFileRef.current?.click()}
                    className="gap-2 w-full"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    {photoFile ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <input
                    ref={photoFileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (localPhotoPreview) URL.revokeObjectURL(localPhotoPreview);
                      setPhotoFile(f);
                      setLocalPhotoPreview(URL.createObjectURL(f));
                    }}
                  />
                  <Input
                    value={localPhotoPreview ? "" : editForm.photoUrl}
                    disabled={!!localPhotoPreview}
                    onChange={(e) => setEditForm((f) => ({ ...f, photoUrl: e.target.value }))}
                    placeholder={localPhotoPreview ? "Photo ready — will upload on Save" : "or paste photo URL"}
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="Student's full name" />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} placeholder="01XXXXXXXXX" />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Address</Label>
              <Input value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} placeholder="Residential address" />
            </div>

            {/* Class */}
            <div className="space-y-1">
              <Label>Class</Label>
              {(classes as any[]).length > 0 ? (
                <Select value={editForm.className} onValueChange={(val) => setEditForm((f) => ({ ...f, className: val, batch: "" }))}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {(classes as any[]).map((c: any) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={editForm.className} onChange={(e) => setEditForm((f) => ({ ...f, className: e.target.value }))} placeholder="e.g. Class 10" />
              )}
            </div>

            {/* Section */}
            <div className="space-y-1">
              <Label>Section</Label>
              <Select value={editForm.section} onValueChange={(val) => setEditForm((f) => ({ ...f, section: val }))}>
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
              <Label>Batch</Label>
              {availableBatches.length > 0 ? (
                <Select value={editForm.batch} onValueChange={(val) => setEditForm((f) => ({ ...f, batch: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((b: string) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={editForm.batch} onChange={(e) => setEditForm((f) => ({ ...f, batch: e.target.value }))} placeholder="e.g. Morning Batch" />
              )}
            </div>

            {/* Guardian */}
            <div className="space-y-1">
              <Label>Guardian Name</Label>
              <Input value={editForm.guardianName} onChange={(e) => setEditForm((f) => ({ ...f, guardianName: e.target.value }))} placeholder="Guardian's name" />
            </div>
            <div className="space-y-1">
              <Label>Guardian Phone</Label>
              <Input value={editForm.guardianPhone} onChange={(e) => setEditForm((f) => ({ ...f, guardianPhone: e.target.value }))} placeholder="01XXXXXXXXX" />
            </div>

            {/* Admission Date */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> Admission Date</Label>
              <Input type="date" value={editForm.enrolledAt} onChange={(e) => setEditForm((f) => ({ ...f, enrolledAt: e.target.value }))} />
            </div>

            {/* Roll Number */}
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-muted-foreground" /> Roll Number</Label>
              <Input value={editForm.rollNumber} onChange={(e) => setEditForm((f) => ({ ...f, rollNumber: e.target.value }))} placeholder="e.g. 2024-001" />
            </div>

            {/* Emergency Contact */}
            <div className="rounded-xl border bg-muted/10 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-destructive" />
                <Label className="text-sm font-semibold">Emergency Contact</Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Contact Name</Label>
                <Input value={editForm.emergencyContact} onChange={(e) => setEditForm((f) => ({ ...f, emergencyContact: e.target.value }))} placeholder="Emergency contact name" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Contact Phone</Label>
                <Input value={editForm.emergencyPhone} onChange={(e) => setEditForm((f) => ({ ...f, emergencyPhone: e.target.value }))} placeholder="01XXXXXXXXX" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Student Status</Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, status: "active" }))}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    editForm.status === "active"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-border text-muted-foreground hover:border-green-300"
                  }`}
                >
                  <ToggleRight className={`h-4 w-4 ${editForm.status === "active" ? "text-green-500" : ""}`} />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, status: "inactive" }))}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    editForm.status === "inactive"
                      ? "border-gray-400 bg-gray-50 text-gray-600"
                      : "border-border text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  <ToggleLeft className="h-4 w-4" />
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
