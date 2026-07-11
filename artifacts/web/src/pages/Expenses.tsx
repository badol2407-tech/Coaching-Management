import { useState } from "react";
import { useListExpenses, useCreateExpense, getListExpensesQueryKey } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackExpenseAdded } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = ["Salary", "Utilities", "Supplies", "Maintenance", "Marketing", "Other"];

export default function Expenses() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: expenses = [], isLoading } = useListExpenses();
  const createExpense = useCreateExpense();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListExpensesQueryKey() });

  const total = (expenses as any[]).reduce((sum: number, e: any) => sum + e.amount, 0);

  function handleAdd() {
    if (!form.title.trim() || !form.amount || !form.date) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    createExpense.mutate(
      { data: { title: form.title, amount: Number(form.amount), category: form.category || null, date: form.date } },
      { onSuccess: () => { trackExpenseAdded(Number(form.amount), form.category || "Other"); toast({ title: "Expense added" }); setSheetOpen(false); invalidate(); setForm({ title: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] }); }, onError: () => toast({ title: "Error", variant: "destructive" }) }
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Card className="flex-1 max-w-xs">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">৳{total.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Button onClick={() => setSheetOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Expense</Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4} className="h-12 animate-pulse bg-muted/30" /></TableRow>)
              : (expenses as any[]).length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No expenses yet</TableCell></TableRow>
              : [...(expenses as any[])].reverse().map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell><Badge variant="outline">{e.category ?? "Other"}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{e.date}</TableCell>
                  <TableCell className="text-right font-semibold">৳{e.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Add Expense</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1"><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Amount (৳) *</Label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
          </div>
          <SheetFooter><Button onClick={handleAdd} disabled={createExpense.isPending}>Add Expense</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
