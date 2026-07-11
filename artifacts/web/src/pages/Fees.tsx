import { useState } from "react";
import { useListFees, useCreateFee, useUpdateFee, useListStudents, getListFeesQueryKey } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackFeeAdded, trackFeeMarkedPaid } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Fees() {
  const [filterStatus, setFilterStatus] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", amount: "1500", month: new Date().toISOString().slice(0, 7), status: "pending" });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: fees = [], isLoading } = useListFees({ status: filterStatus || undefined });
  const { data: students = [] } = useListStudents();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListFeesQueryKey() });

  function handleAdd() {
    if (!form.studentId || !form.amount || !form.month) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    const student = (students as any[]).find((s: any) => s.id === form.studentId);
    createFee.mutate(
      { data: { studentId: form.studentId, studentName: student?.name ?? "", amount: Number(form.amount), month: form.month, status: form.status } },
      {
        onSuccess: () => { trackFeeAdded(Number(form.amount), form.month); toast({ title: "Fee added" }); setSheetOpen(false); invalidate(); setForm({ studentId: "", amount: "1500", month: new Date().toISOString().slice(0, 7), status: "pending" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  }

  function markPaid(id: string) {
    updateFee.mutate(
      { id, data: { status: "paid", paidAt: new Date().toISOString() } },
      { onSuccess: () => { trackFeeMarkedPaid(id); toast({ title: "Marked as paid" }); invalidate(); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setSheetOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Fee</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6} className="h-12 animate-pulse bg-muted/30" /></TableRow>)
              : (fees as any[]).length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No fee records</TableCell></TableRow>
              : (fees as any[]).map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.studentName}</TableCell>
                  <TableCell>{f.month}</TableCell>
                  <TableCell>৳{f.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={f.status === "paid" ? "default" : "secondary"}>{f.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{f.paidAt ? new Date(f.paidAt).toLocaleDateString("en-BD") : "—"}</TableCell>
                  <TableCell className="text-right">
                    {f.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => markPaid(f.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />Mark Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Add Fee Record</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Student</Label>
              <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{(students as any[]).map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Month (YYYY-MM)</Label>
              <Input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Amount (৳)</Label>
              <Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter><Button onClick={handleAdd} disabled={createFee.isPending}>Add Fee</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
