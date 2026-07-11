import { useState } from "react";
import { useListTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher, getListTeachersQueryKey } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackTeacherAdded, trackTeacherUpdated, trackTeacherDeleted } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Teacher = { id: string; name: string; phone?: string | null; email?: string | null; subject?: string | null; salary?: number | null; joinedAt: string };
const emptyForm = { name: "", phone: "", email: "", subject: "", salary: "", joinedAt: new Date().toISOString().split("T")[0] };

export default function Teachers() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: teachers = [], isLoading } = useListTeachers();
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListTeachersQueryKey() });

  function openAdd() { setEditing(null); setForm(emptyForm); setSheetOpen(true); }
  function openEdit(t: Teacher) {
    setEditing(t);
    setForm({ name: t.name, phone: t.phone ?? "", email: t.email ?? "", subject: t.subject ?? "", salary: t.salary != null ? String(t.salary) : "", joinedAt: t.joinedAt });
    setSheetOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const data = { name: form.name, phone: form.phone || null, email: form.email || null, subject: form.subject || null, salary: form.salary ? Number(form.salary) : null, joinedAt: form.joinedAt };
    if (editing) {
      updateTeacher.mutate({ id: editing.id, data }, { onSuccess: () => { trackTeacherUpdated(); toast({ title: "Teacher updated" }); setSheetOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    } else {
      createTeacher.mutate({ data }, { onSuccess: () => { trackTeacherAdded(); toast({ title: "Teacher added" }); setSheetOpen(false); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    }
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteTeacher.mutate({ id: deleteId }, { onSuccess: () => { trackTeacherDeleted(); toast({ title: "Teacher deleted" }); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) });
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Teacher</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6} className="h-12 animate-pulse bg-muted/30" /></TableRow>)
            ) : teachers.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No teachers found</TableCell></TableRow>
            ) : (teachers as Teacher[]).map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.subject ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{t.phone ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{t.salary != null ? `৳${Number(t.salary).toLocaleString()}` : "—"}</TableCell>
                <TableCell className="text-muted-foreground">{t.joinedAt}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? "Edit Teacher" : "Add Teacher"}</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            {[["name", "Name *"], ["phone", "Phone"], ["email", "Email"], ["subject", "Subject"]].map(([field, label]) => (
              <div key={field} className="space-y-1">
                <Label>{label}</Label>
                <Input value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
              </div>
            ))}
            <div className="space-y-1">
              <Label>Salary (৳)</Label>
              <Input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Joined Date</Label>
              <Input type="date" value={form.joinedAt} onChange={e => setForm(f => ({ ...f, joinedAt: e.target.value }))} />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave} disabled={createTeacher.isPending || updateTeacher.isPending}>
              {editing ? "Save Changes" : "Add Teacher"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the teacher from the system.</AlertDialogDescription>
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
