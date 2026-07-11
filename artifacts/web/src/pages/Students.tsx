import { useState } from "react";
import { useListStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, getListStudentsQueryKey } from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackStudentAdded, trackStudentUpdated, trackStudentDeleted } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Student = { id: string; name: string; phone?: string | null; email?: string | null; className?: string | null; batch?: string | null; guardianName?: string | null; guardianPhone?: string | null; enrolledAt: string };

const emptyForm = { name: "", phone: "", email: "", address: "", className: "", batch: "", guardianName: "", guardianPhone: "", enrolledAt: new Date().toISOString().split("T")[0] };

export default function Students() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: students = [], isLoading } = useListStudents({ search: search || undefined });
  const { data: classes = [] } = useListClasses();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const invalidate = () => qc.invalidateQueries({ queryKey: getListStudentsQueryKey() });

  function openAdd() { setEditing(null); setForm(emptyForm); setSheetOpen(true); }
  function openEdit(s: Student) {
    setEditing(s);
    setForm({ name: s.name, phone: s.phone ?? "", email: s.email ?? "", address: "", className: s.className ?? "", batch: s.batch ?? "", guardianName: s.guardianName ?? "", guardianPhone: s.guardianPhone ?? "", enrolledAt: s.enrolledAt });
    setSheetOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const data = { name: form.name, phone: form.phone || null, email: form.email || null, address: form.address || null, className: form.className || null, batch: form.batch || null, guardianName: form.guardianName || null, guardianPhone: form.guardianPhone || null, enrolledAt: form.enrolledAt };
    if (editing) {
      updateStudent.mutate({ id: editing.id, data }, { onSuccess: () => { trackStudentUpdated(); toast({ title: "Student updated" }); setSheetOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createStudent.mutate({ data }, { onSuccess: () => { trackStudentAdded(); toast({ title: "Student added" }); setSheetOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteStudent.mutate({ id: deleteId }, { onSuccess: () => { trackStudentDeleted(); toast({ title: "Student deleted" }); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Student</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={7} className="h-12 animate-pulse bg-muted/30" /></TableRow>)
            ) : students.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No students found</TableCell></TableRow>
            ) : (students as Student[]).map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell><Badge variant="outline">{s.className ?? "—"}</Badge></TableCell>
                <TableCell>{s.batch ? <Badge variant="secondary">{s.batch}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="text-muted-foreground">{s.phone ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{s.guardianName ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{s.enrolledAt}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? "Edit Student" : "Add Student"}</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Student name" />
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="01XXXXXXXXX" />
            </div>
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            {/* Class dropdown */}
            <div className="space-y-1">
              <Label>Class</Label>
              {(classes as any[]).length > 0 ? (
                <Select
                  value={form.className}
                  onValueChange={val => setForm(f => ({ ...f, className: val, batch: "" }))}
                >
                  <SelectTrigger><SelectValue placeholder="Class বেছে নিন" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— কোনো class নেই —</SelectItem>
                    {(classes as any[]).map((c: any) => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={form.className} onChange={e => setForm(f => ({ ...f, className: e.target.value }))} placeholder="যেমন: Class 10" />
              )}
            </div>
            {/* Batch dropdown — shows batches of selected class */}
            <div className="space-y-1">
              <Label>Batch</Label>
              {(() => {
                const selectedClass = (classes as any[]).find((c: any) => c.name === form.className);
                const batches: string[] = selectedClass?.batches ?? [];
                return batches.length > 0 ? (
                  <Select
                    value={form.batch}
                    onValueChange={val => setForm(f => ({ ...f, batch: val }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Batch বেছে নিন" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">— কোনো batch নেই —</SelectItem>
                      {batches.map((b: string) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={form.batch} onChange={e => setForm(f => ({ ...f, batch: e.target.value }))} placeholder="যেমন: Morning Batch" />
                );
              })()}
            </div>
            {/* Guardian */}
            <div className="space-y-1">
              <Label>Guardian Name</Label>
              <Input value={form.guardianName} onChange={e => setForm(f => ({ ...f, guardianName: e.target.value }))} placeholder="অভিভাবকের নাম" />
            </div>
            <div className="space-y-1">
              <Label>Guardian Phone</Label>
              <Input value={form.guardianPhone} onChange={e => setForm(f => ({ ...f, guardianPhone: e.target.value }))} placeholder="01XXXXXXXXX" />
            </div>
            <div className="space-y-1">
              <Label>Enrolled Date</Label>
              <Input type="date" value={form.enrolledAt} onChange={e => setForm(f => ({ ...f, enrolledAt: e.target.value }))} />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave} disabled={createStudent.isPending || updateStudent.isPending}>
              {editing ? "Save Changes" : "Add Student"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the student and all related records.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
