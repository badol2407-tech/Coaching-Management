import { useEffect, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { collection, doc, getDoc, getDocs, query, updateDoc, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadStudentPhoto, uploadErrorMessage, deleteCloudinaryImage, MAX_FILE_MB } from "@/lib/image-upload";
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
  guardianEmail?: string | null;
  enrolledAt?: string | null;
  hasFirebaseAuth?: boolean;
  uid?: string | null;
  // Sprint 1 additions
  status?: "active" | "inactive" | null;
  rollNumber?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  photoUrl?: string | null;
  cloudinaryPublicId?: string | null;
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const photoFileRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState({
    name: "", phone: "", address: "", className: "", section: "", batch: "",
    guardianName: "", guardianPhone: "", guardianEmail: "", enrolledAt: "",
    rollNumber: "", emergencyContact: "", emergencyPhone: "",
    photoUrl: "", cloudinaryPublicId: "", status: "active" as "active" | "inactive",
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

  async function handlePhotoFileSelected(file: File) {
    if (!orgId) return;
    setUploadingPhoto(true);
    setUploadProgress(0);
    try {
      const { url, publicId } = await uploadStudentPhoto(file, orgId, {
        onProgress: setUploadProgress,
        maxMB: MAX_FILE_MB,
      });
      // Delete any previously pending upload that was never saved
      setEditForm((prev) => {
        const prevPendingId = prev.cloudinaryPublicId;
        if (prevPendingId && prevPendingId !== student?.cloudinaryPublicId) {
          deleteCloudinaryImage(prevPendingId);
        }
        return { ...prev, photoUrl: url, cloudinaryPublicId: publicId };
      });
      toast({ title: "Photo uploaded successfully!" });
    } catch (err) {
      toast({ title: uploadErrorMessage(err), variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
      setUploadProgress(0);
      if (photoFileRef.current) photoFileRef.current.value = "";
    }
  }

  function openEdit() {
    if (!student) return;
    setEditForm({
      name: student.name ?? "",
      phone: student.phone ?? "",
      address: student.address ?? "",
      className: student.className ?? "",
      section: student.section ?? "",
      batch: student.batch ?? "",
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone ?? "",
      guardianEmail: student.guardianEmail ?? "",
      enrolledAt: student.enrolledAt ?? "",
      rollNumber: student.rollNumber ?? "",
      emergencyContact: student.emergencyContact ?? "",
      emergencyPhone: student.emergencyPhone ?? "",
      photoUrl: student.photoUrl ?? "",
      cloudinaryPublicId: student.cloudinaryPublicId ?? "",
      status: (student.status ?? "active") as "active" | "inactive",
    });
    setEditOpen(true);
  }

  async function handleSave() {
    if (!studentId || !orgId) return;
    setSaving(true);
    try {
      const finalPhotoUrl = editForm.photoUrl || null;
      const finalCloudinaryPublicId = editForm.cloudinaryPublicId || null;

      // Delete the old Cloudinary image when the photo has been replaced
      if (student?.cloudinaryPublicId && finalPhotoUrl !== (student.photoUrl ?? null)) {
        await deleteCloudinaryImage(student.cloudinaryPublicId);
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
        guardianEmail: editForm.guardianEmail.trim().toLowerCase() || null,
        enrolledAt: editForm.enrolledAt || null,
        rollNumber: editForm.rollNumber || null,
        emergencyContact: editForm.emergencyContact || null,
        emergencyPhone: editForm.emergencyPhone || null,
        photoUrl: finalPhotoUrl,
        cloudinaryPublicId: finalCloudinaryPublicId,
        status: editForm.status,
      };
      await updateDoc(doc(db, "organizations", orgId, "students", studentId), data);

      if (editForm.guardianEmail.trim()) {
        const guardianUsers = await getDocs(query(
          collection(db, "users"),
          where("orgId", "==", orgId),
          where("email", "==", editForm.guardianEmail.trim().toLowerCase()),
        ));
        await Promise.all(guardianUsers.docs.map(async (guardianUser) => {
          const guardianData = guardianUser.data() as any;
          const linkedStudentIds = [...new Set([
            ...(Array.isArray(guardianData.linkedStudentIds) ? guardianData.linkedStudentIds : []),
            ...(Array.isArray(guardianData.studentIds) ? guardianData.studentIds : []),
            ...(Array.isArray(guardianData.childrenIds) ? guardianData.childrenIds : []),
            ...(typeof guardianData.studentId === "string" ? [guardianData.studentId] : []),
            studentId,
          ])];
          await setDoc(guardianUser.ref, { linkedStudentIds }, { merge: true });
        }));
      }

      // Sync photoUrl to the student's auth user doc so the portal sidebar picks it up
      if (student?.uid && finalPhotoUrl !== undefined) {
        try {
          await setDoc(doc(db, "users", student.uid), { photoUrl: finalPhotoUrl, cloudinaryPublicId: finalCloudinaryPublicId }, { merge: true });
        } catch {
          // Non-fatal
        }
      }

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
      <div className="space-y-6 max-w-3xl mx-auto" role="status" aria-live="polite" aria-label="Loading student profile">
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
      <div className="flex flex-wrap items-center justify-between gap-4">
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
                  <Badge aria-label="Student status: active" className="bg-green-100 text-green-700 border-green-200 text-xs gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" /> Active
                  </Badge>
                ) : (
                  <Badge aria-label="Student status: inactive" variant="outline" className="text-xs gap-1 text-muted-foreground">
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
            <Field
              icon={<Mail className="h-4 w-4 text-blue-500" />}
              label="Guardian Account Email"
              value={student.guardianEmail}
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
                {editForm.photoUrl ? (
                  <img
                    src={editForm.photoUrl}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover border shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center shrink-0 border">
                    {uploadingPhoto
                      ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                      : <UserCircle className="h-7 w-7 text-muted-foreground" />}
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <Button
                    type="button" variant="outline" size="sm"
                    disabled={uploadingPhoto}
                    onClick={() => photoFileRef.current?.click()}
                    className="gap-2 w-full"
                  >
                    {uploadingPhoto
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {uploadProgress > 0 ? `Uploading ${uploadProgress}%…` : "Uploading…"}</>
                      : <><ImagePlus className="h-3.5 w-3.5" /> {editForm.photoUrl ? "Change Photo" : "Upload Photo"}</>}
                  </Button>
                  <input
                    ref={photoFileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handlePhotoFileSelected(f);
                    }}
                  />
                  {uploadingPhoto && uploadProgress > 0 && (
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <Input
                    value={editForm.photoUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, photoUrl: e.target.value }))}
                    placeholder="or paste photo URL"
                     className="text-xs h-11"
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
            <div className="space-y-1">
              <Label>Guardian Account Email</Label>
              <Input type="email" value={editForm.guardianEmail} onChange={(e) => setEditForm((f) => ({ ...f, guardianEmail: e.target.value }))} placeholder="guardian@example.com" />
              <p className="text-xs text-muted-foreground">If the guardian account already exists, saving links this child to it.</p>
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
                  aria-pressed={editForm.status === "active"}
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
                  aria-pressed={editForm.status === "inactive"}
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
