import { useMemo, useState } from "react";
import {
  useListFees,
  useCreateFee,
  useUpdateFee,
  useListStudents,
  useFeeSeen,
  useAddInstallment,
  useBulkCreateFees,
  useGetIncomeSummary,
  getListFeesQueryKey,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackFeeAdded, trackFeeMarkedPaid } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  CheckCircle,
  Eye,
  Loader2,
  Users,
  Receipt,
  TrendingUp,
  AlertCircle,
  Banknote,
  ListChecks,
  History,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";
import {
  FeeReceiptDialog,
  type FeeReceiptData,
} from "@/components/FeeReceiptDialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── helpers ────────────────────────────────────────────────────────────────────

function fmtMonth(m: string) {
  if (!m) return "—";
  const [y, mo] = m.split("-");
  const d = new Date(Number(y), Number(mo) - 1, 1);
  return d.toLocaleDateString("en-BD", { month: "short", year: "numeric" });
}

function getEffectivePaid(f: any): number {
  return Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0));
}

function statusBadge(status: string) {
  if (status === "paid")
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Paid
      </Badge>
    );
  if (status === "partial")
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Partial
      </Badge>
    );
  return (
    <Badge className="bg-red-100 text-red-800 border-red-200">Unpaid</Badge>
  );
}

function isOverdue(month: string) {
  const now = new Date();
  const [y, m] = month.split("-");
  const feeMonth = new Date(Number(y), Number(m) - 1, 1);
  return feeMonth < new Date(now.getFullYear(), now.getMonth(), 1);
}

// ── SeenCell ──────────────────────────────────────────────────────────────────

function SeenCell({ feeId }: { feeId: string }) {
  const [open, setOpen] = useState(false);
  const { data: seen = [], isLoading } = useFeeSeen(open ? feeId : null);

  return (
    <div className="relative inline-block text-left">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 gap-1 text-xs"
        onClick={() => setOpen((v) => !v)}
      >
        <Eye className="h-3.5 w-3.5" />
        {(seen as any[]).length > 0 ? "দেখেছে" : "কে দেখেছে?"}
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center gap-2 py-3 px-3 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              লোড হচ্ছে…
            </div>
          ) : (seen as any[]).length === 0 ? (
            <div className="py-3 px-3 text-xs text-muted-foreground flex items-center gap-2">
              <Users className="h-3.5 w-3.5" />
              এখনো দেখেনি
            </div>
          ) : (
            <div className="divide-y">
              {(seen as any[]).map((s: any) => (
                <div key={s.uid} className="px-3 py-2 text-xs">
                  <div className="font-medium">{s.name ?? "—"}</div>
                  <div className="text-muted-foreground">
                    {new Date(s.seenAt).toLocaleString("en-BD", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── InstallmentDialog ─────────────────────────────────────────────────────────

function InstallmentDialog({
  fee,
  open,
  onClose,
}: {
  fee: any | null;
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const addInst = useAddInstallment();
  const { toast } = useToast();

  if (!fee) return null;
  const remaining = fee.amount - getEffectivePaid(fee);
  const installments: any[] = fee.installments ?? [];

  function handleSubmit() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    if (amt > remaining) {
      toast({
        title: `Amount exceeds balance (৳${remaining.toLocaleString()})`,
        variant: "destructive",
      });
      return;
    }
    addInst.mutate(
      { feeId: fee.id, amount: amt, note },
      {
        onSuccess: () => {
          toast({ title: "Payment recorded" });
          setAmount("");
          setNote("");
          onClose();
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment — {fee.studentName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Month:</span>{" "}
              <span className="font-medium">{fmtMonth(fee.month)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Fee:</span>{" "}
              <span className="font-medium">৳{fee.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Paid So Far:</span>{" "}
              <span className="font-medium text-green-700">
                ৳{getEffectivePaid(fee).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Balance:</span>{" "}
              <span className="font-medium text-red-600">
                ৳{remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {installments.length > 0 && (
            <div className="rounded-md border bg-muted/30 divide-y text-xs">
              <div className="px-3 py-1.5 font-semibold text-muted-foreground">
                Previous Installments
              </div>
              {installments.map((inst: any, i: number) => (
                <div key={i} className="px-3 py-1.5 flex justify-between">
                  <span>
                    #{i + 1} — {inst.note || "Payment"} &nbsp;
                    <span className="text-muted-foreground">
                      (
                      {new Date(inst.paidAt).toLocaleDateString("en-BD", {
                        dateStyle: "short",
                      })}
                      )
                    </span>
                  </span>
                  <span className="font-semibold">
                    ৳{Number(inst.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <Label>
              Amount (৳) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              placeholder={`Max ৳${remaining.toLocaleString()}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Note (optional)</Label>
            <Input
              placeholder="e.g. Partial payment, cash"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={addInst.isPending}>
            {addInst.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── BulkAddDialog ─────────────────────────────────────────────────────────────

function BulkAddDialog({
  open,
  onClose,
  classes,
  students,
}: {
  open: boolean;
  onClose: () => void;
  classes: any[];
  students: any[];
}) {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [amount, setAmount] = useState("1500");
  const bulkCreate = useBulkCreateFees();
  const { toast } = useToast();

  const selectedClass = classes.find((c: any) => c.name === className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const eligible = useMemo(
    () =>
      students.filter(
        (s: any) =>
          s.className === className &&
          s.section === section &&
          s.batch === batch,
      ),
    [students, className, section, batch],
  );

  function handleBulkAdd() {
    if (!className || !section || !batch || !month || !amount) {
      toast({ title: "Fill all fields", variant: "destructive" });
      return;
    }
    if (eligible.length === 0) {
      toast({
        title: "No students found for this class/batch",
        variant: "destructive",
      });
      return;
    }
    bulkCreate.mutate(
      {
        students: eligible.map((s: any) => ({
          id: s.id,
          name: s.name,
          className: s.className,
          section: s.section,
          batch: s.batch,
        })),
        amount: Number(amount),
        month,
      },
      {
        onSuccess: () => {
          toast({
            title: `${eligible.length} fee records added`,
            description: `For ${fmtMonth(month)}`,
          });
          onClose();
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Add Monthly Fee</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Class</Label>
            <Select
              value={className}
              onValueChange={(v) => {
                setClassName(v);
                setBatch("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Section</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {SECTION_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Batch</Label>
            <Select
              value={batch}
              onValueChange={setBatch}
              disabled={!className}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {availableBatches.map((b: string) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Month</Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Amount per Student (৳)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {eligible.length > 0 && (
            <p className="text-sm text-muted-foreground bg-muted/40 rounded px-3 py-2">
              <span className="font-semibold text-foreground">
                {eligible.length} students
              </span>{" "}
              will receive a fee record of ৳
              {Number(amount).toLocaleString() || "0"} for{" "}
              {fmtMonth(month)}.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBulkAdd} disabled={bulkCreate.isPending}>
            {bulkCreate.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Add for All ({eligible.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Fees page ────────────────────────────────────────────────────────────

const emptyFeeForm = {
  className: "",
  section: "",
  batch: "",
  studentId: "",
  amount: "1500",
  month: new Date().toISOString().slice(0, 7),
  status: "pending",
};

export default function Fees() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: fees = [], isLoading } = useListFees();
  const { data: students = [] } = useListStudents();
  const { data: classes = [] } = useListClasses();
  const { data: summary = [] } = useGetIncomeSummary();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: getListFeesQueryKey() });

  // State
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState(emptyFeeForm);

  // Installment dialog
  const [instFee, setInstFee] = useState<any | null>(null);
  // Receipt dialog
  const [receiptFee, setReceiptFee] = useState<FeeReceiptData | null>(null);

  // Filters for tab 1
  const [filterSearch, setFilterSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // History search
  const [historySearch, setHistorySearch] = useState("");
  const [historyMonth, setHistoryMonth] = useState("");

  // Due list sort
  const [dueSort, setDueSort] = useState<"month-asc" | "name" | "amount">(
    "month-asc",
  );

  const selectedClass = (classes as any[]).find(
    (c: any) => c.name === form.className,
  );
  const availableBatches: string[] = selectedClass?.batches ?? [];
  const eligibleStudents = useMemo(
    () =>
      (students as any[]).filter(
        (s: any) =>
          s.className === form.className &&
          s.section === form.section &&
          s.batch === form.batch,
      ),
    [students, form.className, form.section, form.batch],
  );

  // Derived lists
  const allFees = fees as any[];

  const filteredAll = useMemo(() => {
    return allFees.filter((f) => {
      const matchSearch =
        !filterSearch ||
        f.studentName?.toLowerCase().includes(filterSearch.toLowerCase());
      const matchMonth = !filterMonth || f.month === filterMonth;
      const matchStatus = !filterStatus || f.status === filterStatus;
      return matchSearch && matchMonth && matchStatus;
    });
  }, [allFees, filterSearch, filterMonth, filterStatus]);

  const dueList = useMemo(() => {
    const list = allFees.filter(
      (f) => f.status === "pending" || f.status === "partial",
    );
    if (dueSort === "month-asc") {
      return [...list].sort((a, b) => a.month.localeCompare(b.month));
    }
    if (dueSort === "name") {
      return [...list].sort((a, b) =>
        (a.studentName ?? "").localeCompare(b.studentName ?? ""),
      );
    }
    if (dueSort === "amount") {
      return [...list].sort(
        (a, b) => b.amount - getEffectivePaid(b) - (a.amount - getEffectivePaid(a)),
      );
    }
    return list;
  }, [allFees, dueSort]);

  const paymentHistory = useMemo(() => {
    return allFees
      .filter((f) => f.status === "paid")
      .filter((f) => {
        const matchSearch =
          !historySearch ||
          f.studentName?.toLowerCase().includes(historySearch.toLowerCase());
        const matchMonth = !historyMonth || f.month === historyMonth;
        return matchSearch && matchMonth;
      })
      .sort(
        (a, b) =>
          new Date(b.paidAt ?? b.createdAt).getTime() -
          new Date(a.paidAt ?? a.createdAt).getTime(),
      );
  }, [allFees, historySearch, historyMonth]);

  // Summary stats
  const totalBilled = allFees.reduce((s, f) => s + f.amount, 0);
  const totalCollected = allFees.reduce((s, f) => s + getEffectivePaid(f), 0);
  const totalPending = allFees
    .filter((f) => f.status !== "paid")
    .reduce((s, f) => s + (f.amount - getEffectivePaid(f)), 0);

  function handleClassChange(val: string) {
    setForm((f) => ({ ...f, className: val, batch: "", studentId: "" }));
  }
  function handleSectionChange(val: string) {
    setForm((f) => ({ ...f, section: val, studentId: "" }));
  }
  function handleBatchChange(val: string) {
    setForm((f) => ({ ...f, batch: val, studentId: "" }));
  }

  function handleAdd() {
    if (
      !form.studentId ||
      !form.className ||
      !form.section ||
      !form.batch ||
      !form.month ||
      !form.amount
    ) {
      toast({ title: "Fill all required fields", variant: "destructive" });
      return;
    }
    const student = (students as any[]).find((s: any) => s.id === form.studentId);
    createFee.mutate(
      {
        data: {
          studentId: form.studentId,
          studentName: student?.name ?? "",
          className: form.className,
          section: form.section,
          batch: form.batch,
          amount: Number(form.amount),
          month: form.month,
          status: form.status,
          installments: [],
          totalPaid: form.status === "paid" ? Number(form.amount) : 0,
        },
      },
      {
        onSuccess: () => {
          trackFeeAdded(Number(form.amount), form.month);
          toast({ title: "Fee added" });
          setAddSheetOpen(false);
          invalidate();
          setForm(emptyFeeForm);
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      },
    );
  }

  function markPaid(id: string) {
    const f = allFees.find((x) => x.id === id);
    updateFee.mutate(
      {
        id,
        data: {
          status: "paid",
          paidAt: new Date().toISOString(),
          totalPaid: f?.amount ?? 0,
        },
      },
      {
        onSuccess: () => {
          trackFeeMarkedPaid(id);
          toast({ title: "Marked as paid" });
          invalidate();
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      },
    );
  }

  function openReceipt(f: any) {
    setReceiptFee({
      id: f.id,
      studentName: f.studentName,
      studentId: f.studentId,
      className: f.className,
      section: f.section,
      batch: f.batch,
      month: f.month,
      amount: f.amount,
      totalPaid: getEffectivePaid(f),
      status: f.status,
      paidAt: f.paidAt,
      createdAt: f.createdAt,
      installments: f.installments ?? [],
    });
  }

  const chartData = useMemo(
    () =>
      (summary as any[])
        .slice(0, 6)
        .reverse()
        .map((s: any) => ({
          month: fmtMonth(s.month),
          Collected: s.collected,
          Pending: s.billed - s.collected,
        })),
    [summary],
  );

  // Unique months for filter dropdowns
  const allMonths = useMemo(
    () => [...new Set(allFees.map((f) => f.month))].sort((a, b) => b.localeCompare(a)),
    [allFees],
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fee Management</h2>
          <p className="text-muted-foreground mt-0.5">
            Collect, track, and summarize student fees
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            <Layers className="h-4 w-4 mr-2" />
            Bulk Add
          </Button>
          <Button onClick={() => setAddSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fee
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Billed</p>
              <p className="text-xl font-bold">৳{totalBilled.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="p-2.5 rounded-lg bg-green-100 text-green-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Collected</p>
              <p className="text-xl font-bold text-green-700">
                ৳{totalCollected.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <div className="p-2.5 rounded-lg bg-red-100 text-red-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due / Balance</p>
              <p className="text-xl font-bold text-red-600">
                ৳{totalPending.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="collect">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="collect">
            <ListChecks className="h-4 w-4 mr-1.5" />
            Collect Fees
          </TabsTrigger>
          <TabsTrigger value="due">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            Due List
            {dueList.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {dueList.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-1.5" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="summary">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            Income Summary
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Collect ─────────────────────────────────────────────────── */}
        <TabsContent value="collect" className="mt-4 space-y-3">
          {/* Filters */}
      <div className="grid gap-2 sm:flex sm:flex-wrap">
            <Input
              placeholder="Search student…"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full sm:w-44"
            />
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All months</SelectItem>
                {allMonths.map((m) => (
                  <SelectItem key={m} value={m}>
                    {fmtMonth(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="pending">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table className="min-w-[820px]" aria-label="Fee records">
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell
                          colSpan={7}
                          className="h-12 animate-pulse bg-muted/30"
                        />
                      </TableRow>
                    ))
                  : filteredAll.length === 0
                  ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-10 text-muted-foreground"
                        >
                          No fee records
                        </TableCell>
                      </TableRow>
                    )
                  : filteredAll.map((f: any) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">
                          {f.studentName}
                          <span className="block text-xs text-muted-foreground">
                            {f.className} · {f.batch}
                          </span>
                        </TableCell>
                        <TableCell>{fmtMonth(f.month)}</TableCell>
                        <TableCell>৳{f.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          ৳{getEffectivePaid(f).toLocaleString()}
                        </TableCell>
                        <TableCell>{statusBadge(f.status)}</TableCell>
                        <TableCell>
                          <SeenCell feeId={f.id} />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1 flex-wrap">
                            {f.status !== "paid" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => markPaid(f.id)}
                                >
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Full Pay
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs"
                                  onClick={() => setInstFee(f)}
                                >
                                  Installment
                                </Button>
                              </>
                            )}
                            {(f.status === "paid" || f.status === "partial") && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => openReceipt(f)}
                              >
                                <Receipt className="h-3.5 w-3.5 mr-1" />
                                Receipt
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ── Tab 2: Due List ────────────────────────────────────────────────── */}
        <TabsContent value="due" className="mt-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {dueList.length} unpaid / partial fee records
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={dueSort === "month-asc" ? "secondary" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setDueSort("month-asc")}
              >
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Oldest First
              </Button>
              <Button
                size="sm"
                variant={dueSort === "name" ? "secondary" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setDueSort("name")}
              >
                Name
              </Button>
              <Button
                size="sm"
                variant={dueSort === "amount" ? "secondary" : "ghost"}
                className="h-7 text-xs"
                onClick={() => setDueSort("amount")}
              >
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Balance
              </Button>
            </div>
          </div>

          {dueList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <CheckCircle className="h-12 w-12 text-green-400" />
              <p className="font-medium">All fees are up to date!</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueList.map((f: any) => {
                    const balance = f.amount - getEffectivePaid(f);
                    const overdue = isOverdue(f.month);
                    return (
                      <TableRow
                        key={f.id}
                        className={overdue ? "bg-red-50/50" : ""}
                      >
                        <TableCell>
                          <span className="font-medium">{f.studentName}</span>
                          {overdue && (
                            <span className="ml-2 text-[10px] bg-red-100 text-red-700 rounded px-1.5 py-0.5 font-semibold">
                              OVERDUE
                            </span>
                          )}
                          <span className="block text-xs text-muted-foreground">
                            {f.className} · {f.batch}
                          </span>
                        </TableCell>
                        <TableCell>{fmtMonth(f.month)}</TableCell>
                        <TableCell>৳{f.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          ৳{getEffectivePaid(f).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold text-red-600">
                          ৳{balance.toLocaleString()}
                        </TableCell>
                        <TableCell>{statusBadge(f.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => markPaid(f.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Pay Full
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => setInstFee(f)}
                            >
                              Installment
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 3: Payment History ─────────────────────────────────────────── */}
        <TabsContent value="history" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search student…"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-44"
            />
            <Select value={historyMonth} onValueChange={setHistoryMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All months</SelectItem>
                {allMonths.map((m) => (
                  <SelectItem key={m} value={m}>
                    {fmtMonth(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paymentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <History className="h-12 w-12 opacity-30" />
              <p>No payment records yet</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid On</TableHead>
                    <TableHead>Installments</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((f: any) => {
                    const installments: any[] = f.installments ?? [];
                    return (
                      <TableRow key={f.id}>
                        <TableCell className="font-medium">
                          {f.studentName}
                          <span className="block text-xs text-muted-foreground">
                            {f.className} · {f.batch}
                          </span>
                        </TableCell>
                        <TableCell>{fmtMonth(f.month)}</TableCell>
                        <TableCell className="font-semibold text-green-700">
                          ৳{f.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {f.paidAt
                            ? new Date(f.paidAt).toLocaleDateString("en-BD", {
                                dateStyle: "medium",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {installments.length > 1 ? (
                            <Badge variant="secondary">
                              {installments.length} payments
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Single
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => openReceipt(f)}
                          >
                            <Receipt className="h-3.5 w-3.5 mr-1" />
                            Print
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* ── Tab 4: Income Summary ──────────────────────────────────────────── */}
        <TabsContent value="summary" className="mt-4 space-y-4">
          {chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly Income (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barGap={4}>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip
                      formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, undefined]}
                    />
                    <Bar dataKey="Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pending" fill="#fca5a5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground justify-center">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                    Collected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-300 inline-block" />
                    Pending
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Total Billed</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                  <TableHead className="text-right">Paid / Partial / Unpaid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(summary as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No data yet
                    </TableCell>
                  </TableRow>
                ) : (
                  (summary as any[]).map((s: any) => (
                    <TableRow key={s.month}>
                      <TableCell className="font-medium">
                        {fmtMonth(s.month)}
                      </TableCell>
                      <TableCell className="text-right">
                        ৳{s.billed.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-700">
                        ৳{s.collected.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        ৳{(s.billed - s.collected).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{s.count}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-700">{s.paid}</span>
                        {" / "}
                        <span className="text-yellow-600">{s.partial}</span>
                        {" / "}
                        <span className="text-red-600">{s.pending}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Add Fee Sheet ──────────────────────────────────────────────────── */}
      <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Fee Record</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>
                Class <span className="text-destructive">*</span>
              </Label>
              <Select value={form.className} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>
                Section <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.section}
                onValueChange={handleSectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>
                Batch <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.batch}
                onValueChange={handleBatchChange}
                disabled={!form.className}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>
                Student <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.studentId}
                onValueChange={(v) => setForm((f) => ({ ...f, studentId: v }))}
                disabled={!form.batch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleStudents.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>
                Month <span className="text-destructive">*</span>
              </Label>
              <Input
                type="month"
                value={form.month}
                onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>
                Amount (৳) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleAdd} disabled={createFee.isPending}>
              {createFee.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Add Fee
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <InstallmentDialog
        fee={instFee}
        open={!!instFee}
        onClose={() => setInstFee(null)}
      />
      <BulkAddDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        classes={classes as any[]}
        students={students as any[]}
      />
      <FeeReceiptDialog
        fee={receiptFee}
        open={!!receiptFee}
        onClose={() => setReceiptFee(null)}
      />
    </div>
  );
}
