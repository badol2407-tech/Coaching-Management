import { useMemo, useState } from "react";
import { CreditCard, Loader2, RefreshCw, Search, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAddInstallment, useListFees } from "@/lib/hooks";

type Fee = { id: string; studentName?: string; amount: number; totalPaid?: number; status?: string; month?: string; className?: string; installments?: { amount: number; paidAt: string }[] };
const paid = (fee: Fee) => Number(fee.totalPaid ?? (fee.status === "paid" ? fee.amount : 0));
const money = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function FeeCollection() {
  const { toast } = useToast();
  const feesQuery = useListFees();
  const addInstallment = useAddInstallment();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Fee | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const fees = (feesQuery.data ?? []) as Fee[];
  const dueFees = useMemo(() => fees.filter((fee) => (fee.status ?? "pending") !== "paid").filter((fee) => !search || fee.studentName?.toLowerCase().includes(search.toLowerCase())), [fees, search]);
  const outstanding = dueFees.reduce((total, fee) => total + Math.max(0, fee.amount - paid(fee)), 0);

  async function collectPayment() {
    if (!selected) return;
    const value = Number(amount);
    const remaining = selected.amount - paid(selected);
    if (!value || value <= 0 || value > remaining) {
      toast({ title: "Enter an amount within the remaining balance.", variant: "destructive" });
      return;
    }
    try {
      await addInstallment.mutateAsync({ feeId: selected.id, amount: value, note });
      toast({ title: "Payment recorded", description: `${selected.studentName} now has ${money(remaining - value)} remaining.` });
      setSelected(null); setAmount(""); setNote("");
    } catch {
      toast({ title: "Could not record payment", variant: "destructive" });
    }
  }

  return <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Administrative workspace</p><h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Fee Collection</h1><p className="mt-1 text-sm text-muted-foreground">Collect outstanding fees and keep every installment attached to the student record.</p></div><Button variant="outline" className="w-fit gap-2" onClick={() => feesQuery.refetch()} disabled={feesQuery.isFetching}><RefreshCw className={feesQuery.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Refresh</Button></header>
    <div className="grid gap-4 sm:grid-cols-3"><Metric label="Due records" value={dueFees.length} icon={WalletCards} /><Metric label="Outstanding balance" value={money(outstanding)} icon={CreditCard} tone="amber" /><Metric label="Collected records" value={fees.filter((fee) => fee.status === "paid").length} icon={WalletCards} tone="emerald" /></div>
    <Card className="overflow-hidden border-border/70 bg-card/70 backdrop-blur-xl"><CardHeader className="border-b border-border/60"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><CardTitle className="text-lg">Outstanding fees</CardTitle><div className="relative sm:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student..." className="pl-9" aria-label="Search fees by student" /></div></div></CardHeader><CardContent className="p-0">{feesQuery.isLoading ? <Loading /> : dueFees.length === 0 ? <Empty text="No outstanding fees found." /> : <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Month</TableHead><TableHead>Total</TableHead><TableHead>Paid</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader><TableBody>{dueFees.map((fee) => <TableRow key={fee.id}><TableCell className="font-medium">{fee.studentName || "Unnamed student"}<span className="block text-xs text-muted-foreground">{fee.className || "Class not set"}</span></TableCell><TableCell>{fee.month || "—"}</TableCell><TableCell>{money(fee.amount)}</TableCell><TableCell className="text-emerald-600">{money(paid(fee))}</TableCell><TableCell className="font-semibold text-amber-600">{money(Math.max(0, fee.amount - paid(fee)))}</TableCell><TableCell><Badge variant="outline" className="capitalize">{fee.status || "pending"}</Badge></TableCell><TableCell className="text-right"><Button size="sm" onClick={() => setSelected(fee)}>Collect</Button></TableCell></TableRow>)}</TableBody></Table></div>}</CardContent></Card>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Collect payment</DialogTitle><DialogDescription>{selected?.studentName} · {selected?.month || "Fee record"}</DialogDescription></DialogHeader><div className="space-y-4"><div className="rounded-xl bg-muted/40 p-4 text-sm"><div className="flex justify-between"><span>Remaining balance</span><strong>{selected ? money(selected.amount - paid(selected)) : "—"}</strong></div></div><div className="space-y-2"><Label htmlFor="collection-amount">Amount (৳)</Label><Input id="collection-amount" type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" /></div><div className="space-y-2"><Label htmlFor="collection-note">Note</Label><Textarea id="collection-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional payment note" /></div><Button className="w-full" onClick={collectPayment} disabled={addInstallment.isPending}>{addInstallment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save payment</Button></div></DialogContent></Dialog>
  </div>;
}

function Metric({ label, value, icon: Icon, tone = "violet" }: { label: string; value: string | number; icon: typeof CreditCard; tone?: "violet" | "amber" | "emerald" }) { const colors = { violet: "bg-primary/10 text-primary", amber: "bg-amber-500/10 text-amber-600", emerald: "bg-emerald-500/10 text-emerald-600" }; return <Card className="border-border/70 bg-card/70"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}><Icon className="h-5 w-5" /></div></CardContent></Card>; }
function Loading() { return <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading fees...</div>; }
function Empty({ text }: { text: string }) { return <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">{text}</div>; }