import { useState, useRef } from "react";
import {
  useListStudents,
  useGetMonthlyAttendanceSummary,
  useListFees,
  useGetIncomeSummary,
  useListExpenses,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  CalendarCheck,
  Wallet,
  BarChart3,
  Printer,
  Download,
  Loader2,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SECTION_OPTIONS } from "@/lib/constants";

// ── helpers ──────────────────────────────────────────────────────────────────

function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const csv = [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => JSON.stringify(r[c] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function fmtCurrency(n: number) {
  return "৳" + n.toLocaleString("en-BD");
}

function fmtMonth(m: string) {
  if (!m) return "—";
  const [y, mo] = m.split("-");
  const d = new Date(Number(y), Number(mo) - 1, 1);
  return d.toLocaleDateString("en-BD", { month: "long", year: "numeric" });
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ── Student Report ────────────────────────────────────────────────────────────

function StudentReport() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [classFilter, setClassFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const { data: students = [], isLoading } = useListStudents({ search, statusFilter });
  const { data: classes = [] } = useListClasses();
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = students.filter((s: any) => {
    const cls = classFilter === "all" || s.className === classFilter;
    const bat = batchFilter === "all" || s.batch === batchFilter;
    return cls && bat;
  });

  const totalActive = filtered.filter((s: any) => (s.status ?? "active") === "active").length;
  const totalInactive = filtered.length - totalActive;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Student Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
        h2 { margin-bottom: 4px; } p.subtitle { color: #555; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        tr:nth-child(even) { background: #f9fafb; }
        .badge-active { color: #16a34a; } .badge-inactive { color: #dc2626; }
        .summary { display: flex; gap: 24px; margin-bottom: 16px; }
        .sum-box { background: #f3f4f6; border-radius: 6px; padding: 10px 18px; }
        .sum-box strong { display: block; font-size: 20px; }
        @media print { button { display: none; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const csvRows = filtered.map((s: any) => ({
    Name: s.name ?? "",
    "Roll No": s.rollNumber ?? "",
    Class: s.className ?? "",
    Batch: s.batch ?? "",
    Phone: s.phone ?? "",
    Email: s.email ?? "",
    Status: s.status ?? "active",
    "Joined On": s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
  }));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Search</Label>
           <Input placeholder="Name / roll / phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Status</Label>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
           <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Class</Label>
          <Select value={classFilter} onValueChange={setClassFilter}>
           <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Batch</Label>
          <Select value={batchFilter} onValueChange={setBatchFilter}>
           <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {SECTION_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => exportToCsv("student-report.csv", csvRows)} disabled={!filtered.length}>
          <Download className="h-4 w-4 mr-1.5" />Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={handlePrint} disabled={!filtered.length}>
          <Printer className="h-4 w-4 mr-1.5" />Print
        </Button>
      </div>

      {/* Printable content */}
      <div ref={printRef}>
        <h2 className="text-lg font-bold hidden print:block">Student Report</h2>
        <p className="text-sm text-muted-foreground hidden print:block mb-2">
          Generated: {new Date().toLocaleString()}
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Total Students", value: filtered.length, icon: Users, color: "text-blue-600" },
            { label: "Active", value: totalActive, icon: CheckCircle2, color: "text-green-600" },
            { label: "Inactive", value: totalInactive, icon: XCircle, color: "text-red-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="py-3">
              <CardContent className="pt-0 flex items-center gap-3">
                <Icon className={`h-7 w-7 ${color} shrink-0`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No students found.</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s: any, i: number) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.name || "—"}</TableCell>
                    <TableCell>{s.rollNumber || "—"}</TableCell>
                    <TableCell>{s.className || "—"}</TableCell>
                    <TableCell>{s.batch || "—"}</TableCell>
                    <TableCell>{s.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={(s.status ?? "active") === "active" ? "default" : "secondary"}
                        className={(s.status ?? "active") === "active" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"}>
                        {(s.status ?? "active") === "active" ? "Active" : "Inactive"}
                      </Badge>
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

// ── Attendance Report ─────────────────────────────────────────────────────────

function AttendanceReport() {
  const [month, setMonth] = useState(currentMonth());
  const [classFilter, setClassFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const { data: classes = [] } = useListClasses();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: summary = [], isLoading } = useGetMonthlyAttendanceSummary({
    month,
    className: classFilter === "all" ? undefined : classFilter,
    batch: batchFilter === "all" ? undefined : batchFilter,
  });

  const rows = summary as any[];
  const avgPct = rows.length
    ? Math.round(rows.reduce((s: number, r: any) => s + (r.percentage ?? 0), 0) / rows.length)
    : 0;
  const fullPresent = rows.filter((r: any) => r.percentage === 100).length;
  const lowAttendance = rows.filter((r: any) => r.percentage < 75).length;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Attendance Report — ${fmtMonth(month)}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
        h2 { margin-bottom: 4px; } p.subtitle { color:#555; margin-bottom:16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
        th { background: #f3f4f6; font-weight:600; }
        tr:nth-child(even) { background:#f9fafb; }
        .low { color: #dc2626; font-weight:600; }
        @media print { button { display:none; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const csvRows = rows.map((r: any) => ({
    Name: r.studentName,
    Class: r.className,
    Batch: r.batch,
    Present: r.present,
    Absent: r.absent,
    Late: r.late,
    Total: r.total,
    "Attendance %": r.percentage + "%",
  }));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Month</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9" />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Class</Label>
          <Select value={classFilter} onValueChange={setClassFilter}>
           <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Batch</Label>
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {SECTION_OPTIONS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => exportToCsv(`attendance-${month}.csv`, csvRows)} disabled={!rows.length}>
          <Download className="h-4 w-4 mr-1.5" />Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={handlePrint} disabled={!rows.length}>
          <Printer className="h-4 w-4 mr-1.5" />Print
        </Button>
      </div>

      <div ref={printRef}>
        <h2 className="text-lg font-bold hidden print:block">Attendance Report — {fmtMonth(month)}</h2>
        <p className="text-sm text-muted-foreground hidden print:block mb-2">Generated: {new Date().toLocaleString()}</p>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Avg Attendance", value: `${avgPct}%`, icon: CalendarCheck, color: "text-blue-600" },
            { label: "100% Present", value: fullPresent, icon: CheckCircle2, color: "text-green-600" },
            { label: "Below 75%", value: lowAttendance, icon: AlertCircle, color: "text-red-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="py-3">
              <CardContent className="pt-0 flex items-center gap-3">
                <Icon className={`h-7 w-7 ${color} shrink-0`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No attendance data for {fmtMonth(month)}.</div>
        ) : (
           <div className="rounded-md border overflow-x-auto">
             <Table className="min-w-[720px]" aria-label="Student report">
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-center">Late</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r: any, i: number) => (
                  <TableRow key={r.studentId}>
                    <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell>{r.className || "—"}</TableCell>
                    <TableCell>{r.batch || "—"}</TableCell>
                    <TableCell className="text-center text-green-700 font-semibold">{r.present}</TableCell>
                    <TableCell className="text-center text-red-700 font-semibold">{r.absent}</TableCell>
                    <TableCell className="text-center text-amber-700 font-semibold">{r.late}</TableCell>
                    <TableCell className="text-center">{r.total}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={
                          r.percentage >= 90
                            ? "border-green-300 bg-green-50 text-green-800"
                            : r.percentage >= 75
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-red-300 bg-red-50 text-red-800"
                        }
                      >
                        {r.percentage}%
                      </Badge>
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

// ── Fee Report ────────────────────────────────────────────────────────────────

function FeeReport() {
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: allFees = [], isLoading } = useListFees();
  const { data: classes = [] } = useListClasses();
  const printRef = useRef<HTMLDivElement>(null);

  const fees = (allFees as any[]).filter((f: any) => {
    const cls = classFilter === "all" || f.className === classFilter;
    const st = statusFilter === "all" || f.status === statusFilter;
    return cls && st;
  });

  const totalAmount = fees.reduce((s: number, f: any) => s + (Number(f.amount) || 0), 0);
  const totalPaid = fees.reduce((s: number, f: any) => s + (Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0), 0);
  const totalDue = totalAmount - totalPaid;
  const paidCount = fees.filter((f: any) => f.status === "paid").length;
  const pendingCount = fees.filter((f: any) => f.status === "pending").length;
  const partialCount = fees.filter((f: any) => f.status === "partial").length;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Fee Report</title>
      <style>
        body { font-family:Arial,sans-serif; padding:24px; font-size:13px; }
        h2 { margin-bottom:4px; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #ddd; padding:8px 10px; text-align:left; }
        th { background:#f3f4f6; font-weight:600; }
        tr:nth-child(even) { background:#f9fafb; }
        @media print { button { display:none; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  const csvRows = fees.map((f: any) => ({
    "Student Name": f.studentName ?? "",
    Class: f.className ?? "",
    Month: f.month ?? "",
    Amount: f.amount ?? 0,
    Paid: f.totalPaid ?? (f.status === "paid" ? f.amount : 0),
    Due: (Number(f.amount) || 0) - (Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0),
    Status: f.status ?? "",
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1 block">Class</Label>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => exportToCsv("fee-report.csv", csvRows)} disabled={!fees.length}>
          <Download className="h-4 w-4 mr-1.5" />Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={handlePrint} disabled={!fees.length}>
          <Printer className="h-4 w-4 mr-1.5" />Print
        </Button>
      </div>

      <div ref={printRef}>
        <h2 className="text-lg font-bold hidden print:block">Fee Report</h2>
        <p className="text-sm text-muted-foreground hidden print:block mb-2">Generated: {new Date().toLocaleString()}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {[
            { label: "Total Invoiced", value: fmtCurrency(totalAmount), icon: Wallet, color: "text-blue-600" },
            { label: "Total Collected", value: fmtCurrency(totalPaid), icon: TrendingUp, color: "text-green-600" },
            { label: "Total Due", value: fmtCurrency(totalDue), icon: TrendingDown, color: "text-red-600" },
            { label: "Paid", value: paidCount, icon: CheckCircle2, color: "text-green-700" },
            { label: "Partial", value: partialCount, icon: Clock, color: "text-amber-600" },
            { label: "Pending", value: pendingCount, icon: XCircle, color: "text-red-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="py-3">
              <CardContent className="pt-0 flex items-center gap-3">
                <Icon className={`h-6 w-6 ${color} shrink-0`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : fees.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">No fee records found.</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((f: any, i: number) => {
                  const paid = Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0;
                  const due = (Number(f.amount) || 0) - paid;
                  return (
                    <TableRow key={f.id}>
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell className="font-medium">{f.studentName || "—"}</TableCell>
                      <TableCell>{f.className || "—"}</TableCell>
                      <TableCell>{f.month || "—"}</TableCell>
                      <TableCell className="text-right">{fmtCurrency(Number(f.amount) || 0)}</TableCell>
                      <TableCell className="text-right text-green-700 font-semibold">{fmtCurrency(paid)}</TableCell>
                      <TableCell className="text-right text-red-700 font-semibold">{fmtCurrency(due)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            f.status === "paid"
                              ? "border-green-300 bg-green-50 text-green-800"
                              : f.status === "partial"
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : "border-red-300 bg-red-50 text-red-800"
                          }
                        >
                          {f.status === "paid" ? "Paid" : f.status === "partial" ? "Partial" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Monthly Summary ───────────────────────────────────────────────────────────

function MonthlySummary() {
  const [month, setMonth] = useState(currentMonth());
  const { data: incomeSummary, isLoading: incomeLoading } = useGetIncomeSummary();
  const { data: expenses = [], isLoading: expLoading } = useListExpenses();
  const { data: allFees = [], isLoading: feesLoading } = useListFees();
  const { data: students = [] } = useListStudents();
  const { data: attendanceSummary = [] } = useGetMonthlyAttendanceSummary({ month });
  const printRef = useRef<HTMLDivElement>(null);

  const isLoading = incomeLoading || expLoading || feesLoading;

  const monthFees = (allFees as any[]).filter((f: any) => (f.month ?? "").startsWith(month));
  const monthExpenses = (expenses as any[]).filter((e: any) => (e.date ?? e.createdAt ?? "").startsWith(month));
  const feeCollected = monthFees.reduce((s: number, f: any) => s + (Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0), 0);
  const feeInvoiced = monthFees.reduce((s: number, f: any) => s + (Number(f.amount) || 0), 0);
  const feePending = feeInvoiced - feeCollected;
  const totalExpenses = monthExpenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
  const netBalance = feeCollected - totalExpenses;

  const attRows = attendanceSummary as any[];
  const avgAtt = attRows.length
    ? Math.round(attRows.reduce((s: number, r: any) => s + (r.percentage ?? 0), 0) / attRows.length)
    : 0;

  const paidCount = monthFees.filter((f: any) => f.status === "paid").length;
  const pendingCount = monthFees.filter((f: any) => f.status === "pending" || f.status === "partial").length;

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Monthly Summary — ${fmtMonth(month)}</title>
      <style>
        body { font-family:Arial,sans-serif; padding:24px; font-size:13px; }
        h2 { margin-bottom:4px; }
        .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px; }
        .box { border:1px solid #ddd; border-radius:8px; padding:14px 18px; }
        .box .lbl { font-size:11px; color:#777; }
        .box .val { font-size:22px; font-weight:700; margin-top:2px; }
        .box.green { border-color:#bbf7d0; background:#f0fdf4; }
        .box.red { border-color:#fecaca; background:#fef2f2; }
        .box.blue { border-color:#bfdbfe; background:#eff6ff; }
        .box.amber { border-color:#fde68a; background:#fffbeb; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #ddd; padding:8px 10px; text-align:left; }
        th { background:#f3f4f6; font-weight:600; }
        tr:nth-child(even) { background:#f9fafb; }
        @media print { button { display:none; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 flex-wrap">
        <div>
          <Label className="text-xs mb-1 block">Month</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9 w-48" />
        </div>
        <Button size="sm" variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1.5" />Print Summary
        </Button>
      </div>

      <div ref={printRef}>
        <h2 className="hidden print:block text-lg font-bold mb-1">Monthly Summary — {fmtMonth(month)}</h2>
        <p className="hidden print:block text-sm text-muted-foreground mb-4">Generated: {new Date().toLocaleString()}</p>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {/* Finance summary */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Finance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Fee Collected", value: fmtCurrency(feeCollected), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50 border-green-200" },
                { label: "Fee Pending", value: fmtCurrency(feePending), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                { label: "Total Expenses", value: fmtCurrency(totalExpenses), icon: TrendingDown, color: "text-red-600", bg: "bg-red-50 border-red-200" },
                { label: "Net Balance", value: fmtCurrency(netBalance), icon: Wallet, color: netBalance >= 0 ? "text-green-600" : "text-red-600", bg: netBalance >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <Card key={label} className={`py-3 border ${bg}`}>
                  <CardContent className="pt-0 flex items-center gap-3">
                    <Icon className={`h-7 w-7 ${color} shrink-0`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-lg font-bold">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Students & Attendance */}
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Students & Attendance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total Students", value: (students as any[]).length, icon: Users, color: "text-blue-600" },
                { label: "Avg Attendance", value: `${avgAtt}%`, icon: CalendarCheck, color: "text-indigo-600" },
                { label: "Fee Paid (count)", value: paidCount, icon: CheckCircle2, color: "text-green-600" },
                { label: "Fee Pending (count)", value: pendingCount, icon: AlertCircle, color: "text-red-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label} className="py-3">
                  <CardContent className="pt-0 flex items-center gap-3">
                    <Icon className={`h-7 w-7 ${color} shrink-0`} />
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xl font-bold">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Expense breakdown */}
            {monthExpenses.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Expense Breakdown</h3>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthExpenses.map((e: any, i: number) => (
                        <TableRow key={e.id}>
                          <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                          <TableCell className="font-medium">{e.description || e.title || "—"}</TableCell>
                          <TableCell>{e.category || "—"}</TableCell>
                          <TableCell>{e.date ? new Date(e.date).toLocaleDateString() : "—"}</TableCell>
                          <TableCell className="text-right font-semibold">{fmtCurrency(Number(e.amount) || 0)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={4} className="text-right">Total Expenses</TableCell>
                        <TableCell className="text-right text-red-700">{fmtCurrency(totalExpenses)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Printable Reports ────────────────────────────────────────────────────────

function PrintableReports() {
  const [reportType, setReportType] = useState("student");
  const [month, setMonth] = useState(currentMonth());
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: students = [], isLoading: studLoading } = useListStudents();
  const { data: fees = [], isLoading: feesLoading } = useListFees();
  const { data: attendanceSummary = [], isLoading: attLoading } = useGetMonthlyAttendanceSummary({ month });
  const { data: expenses = [] } = useListExpenses();
  const { data: classes = [] } = useListClasses();
  const { userProfile } = useAuth();

  const orgName = (userProfile as any)?.orgName ?? "EduTrack";

  const isLoading = studLoading || feesLoading || attLoading;

  function handleFullPrint() {
    const win = window.open("", "_blank");
    if (!win) return;

    let tableHtml = "";
    let title = "";
    let subtitle = `${orgName} | Generated: ${new Date().toLocaleString()}`;

    if (reportType === "student") {
      title = "Student Report";
      const filtered = (students as any[]).filter((s: any) => {
        const cls = classFilter === "all" || s.className === classFilter;
        const st = statusFilter === "all" || (s.status ?? "active") === statusFilter;
        return cls && st;
      });
      tableHtml = `
        <table>
          <thead><tr>
            <th>#</th><th>Name</th><th>Roll No</th><th>Class</th><th>Batch</th><th>Phone</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${filtered.map((s: any, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td>${s.name || "—"}</td>
                <td>${s.rollNumber || "—"}</td>
                <td>${s.className || "—"}</td>
                <td>${s.batch || "—"}</td>
                <td>${s.phone || "—"}</td>
                <td>${s.status ?? "active"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <p style="margin-top:12px;font-size:12px;color:#555;">Total: ${filtered.length} students</p>`;
    } else if (reportType === "attendance") {
      title = `Attendance Report — ${fmtMonth(month)}`;
      const rows = attendanceSummary as any[];
      tableHtml = `
        <table>
          <thead><tr>
            <th>#</th><th>Name</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Total</th><th>%</th>
          </tr></thead>
          <tbody>
            ${rows.map((r: any, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.studentName}</td>
                <td>${r.className || "—"}</td>
                <td style="color:#16a34a;font-weight:600">${r.present}</td>
                <td style="color:#dc2626;font-weight:600">${r.absent}</td>
                <td style="color:#d97706;font-weight:600">${r.late}</td>
                <td>${r.total}</td>
                <td style="${r.percentage < 75 ? "color:#dc2626;font-weight:700" : ""}">${r.percentage}%</td>
              </tr>`).join("")}
          </tbody>
        </table>`;
    } else if (reportType === "fee") {
      title = "Fee Report";
      const filtered = (fees as any[]).filter((f: any) => {
        const cls = classFilter === "all" || f.className === classFilter;
        const st = statusFilter === "all" || f.status === statusFilter;
        return cls && st;
      });
      const totalPaid = filtered.reduce((s: number, f: any) => s + (Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0), 0);
      tableHtml = `
        <table>
          <thead><tr>
            <th>#</th><th>Student</th><th>Class</th><th>Month</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${filtered.map((f: any, i: number) => {
              const paid = Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0;
              const due = (Number(f.amount) || 0) - paid;
              return `<tr>
                <td>${i + 1}</td>
                <td>${f.studentName || "—"}</td>
                <td>${f.className || "—"}</td>
                <td>${f.month || "—"}</td>
                <td>৳${Number(f.amount || 0).toLocaleString()}</td>
                <td style="color:#16a34a;font-weight:600">৳${paid.toLocaleString()}</td>
                <td style="color:#dc2626;font-weight:600">৳${due.toLocaleString()}</td>
                <td>${f.status || "—"}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
        <p style="margin-top:12px;font-size:12px;color:#555;">Total Collected: ৳${totalPaid.toLocaleString()}</p>`;
    } else if (reportType === "monthly") {
      title = `Monthly Summary — ${fmtMonth(month)}`;
      const monthFees = (fees as any[]).filter((f: any) => (f.month ?? "").startsWith(month));
      const monthExpenses = (expenses as any[]).filter((e: any) => (e.date ?? e.createdAt ?? "").startsWith(month));
      const feeCollected = monthFees.reduce((s: number, f: any) => s + (Number(f.totalPaid ?? (f.status === "paid" ? f.amount : 0)) || 0), 0);
      const totalExp = monthExpenses.reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
      tableHtml = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px">
          <div class="box green"><div class="lbl">Fee Collected</div><div class="val">৳${feeCollected.toLocaleString()}</div></div>
          <div class="box red"><div class="lbl">Total Expenses</div><div class="val">৳${totalExp.toLocaleString()}</div></div>
          <div class="box blue"><div class="lbl">Net Balance</div><div class="val">৳${(feeCollected - totalExp).toLocaleString()}</div></div>
        </div>
        <h3 style="margin:16px 0 8px;font-size:14px">Expense Details</h3>
        <table>
          <thead><tr><th>#</th><th>Description</th><th>Category</th><th>Date</th><th>Amount</th></tr></thead>
          <tbody>
            ${monthExpenses.map((e: any, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td>${e.description || e.title || "—"}</td>
                <td>${e.category || "—"}</td>
                <td>${e.date ? new Date(e.date).toLocaleDateString() : "—"}</td>
                <td>৳${Number(e.amount || 0).toLocaleString()}</td>
              </tr>`).join("")}
          </tbody>
        </table>`;
    }

    win.document.write(`
      <html><head><title>${title}</title>
      <style>
        body { font-family:Arial,sans-serif; padding:24px; font-size:13px; }
        .header { border-bottom: 2px solid #1e1b4b; padding-bottom:12px; margin-bottom:20px; }
        .header h1 { margin:0; font-size:20px; color:#1e1b4b; }
        .header p { margin:4px 0 0; color:#555; font-size:12px; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #ddd; padding:8px 10px; text-align:left; }
        th { background:#f3f4f6; font-weight:600; }
        tr:nth-child(even) { background:#f9fafb; }
        .box { border:1px solid #ddd; border-radius:8px; padding:14px 18px; }
        .box .lbl { font-size:11px; color:#777; }
        .box .val { font-size:22px; font-weight:700; }
        .box.green { border-color:#bbf7d0; background:#f0fdf4; }
        .box.red { border-color:#fecaca; background:#fef2f2; }
        .box.blue { border-color:#bfdbfe; background:#eff6ff; }
      </style></head><body>
      <div class="header">
        <h1>${orgName}</h1>
        <p>${title}</p>
        <p>${subtitle}</p>
      </div>
      ${tableHtml}
      </body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Configure your report below and click <strong>Generate &amp; Print</strong> to open a print-ready version in a new window.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <Label className="text-xs mb-1 block">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student Report</SelectItem>
              <SelectItem value="attendance">Attendance Report</SelectItem>
              <SelectItem value="fee">Fee Report</SelectItem>
              <SelectItem value="monthly">Monthly Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(reportType === "attendance" || reportType === "monthly") && (
          <div>
            <Label className="text-xs mb-1 block">Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9" />
          </div>
        )}

        {(reportType === "student" || reportType === "fee") && (
          <div>
            <Label className="text-xs mb-1 block">Class</Label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {(classes as any[]).map((c: any) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {(reportType === "student" || reportType === "fee") && (
          <div>
            <Label className="text-xs mb-1 block">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {reportType === "student" ? (
                  <>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button onClick={handleFullPrint} disabled={isLoading} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
        Generate &amp; Print
      </Button>

      {/* Preview cards for each report type */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { type: "student", label: "Student Report", desc: "Full list of students with class, batch, and status", icon: Users },
          { type: "attendance", label: "Attendance Report", desc: "Monthly attendance summary with percentages", icon: CalendarCheck },
          { type: "fee", label: "Fee Report", desc: "Fee collection status and due amounts", icon: Wallet },
          { type: "monthly", label: "Monthly Summary", desc: "Income, expenses, and net balance overview", icon: BarChart3 },
        ].map(({ type, label, desc, icon: Icon }) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
              reportType === type
                ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-400"
                : "border-border hover:border-indigo-300 hover:bg-muted/40"
            }`}
          >
            <div className={`mt-0.5 rounded-md p-2 ${reportType === type ? "bg-indigo-100" : "bg-muted"}`}>
              <Icon className={`h-5 w-5 ${reportType === type ? "text-indigo-600" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Reports page ─────────────────────────────────────────────────────────

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Generate, filter, export, and print reports for students, attendance, fees, and monthly summaries.
        </p>
      </div>

      <Tabs defaultValue="student" className="space-y-4">
        <TabsList className="flex w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="student" className="gap-1.5">
            <Users className="h-4 w-4" />Student Report
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-1.5">
            <CalendarCheck className="h-4 w-4" />Attendance Report
          </TabsTrigger>
          <TabsTrigger value="fee" className="gap-1.5">
            <Wallet className="h-4 w-4" />Fee Report
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5">
            <BarChart3 className="h-4 w-4" />Monthly Summary
          </TabsTrigger>
          <TabsTrigger value="printable" className="gap-1.5">
            <Printer className="h-4 w-4" />Printable Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />Student Report
              </CardTitle>
            </CardHeader>
            <CardContent><StudentReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-indigo-600" />Attendance Report
              </CardTitle>
            </CardHeader>
            <CardContent><AttendanceReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fee">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-5 w-5 text-green-600" />Fee Report
              </CardTitle>
            </CardHeader>
            <CardContent><FeeReport /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />Monthly Summary
              </CardTitle>
            </CardHeader>
            <CardContent><MonthlySummary /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printable">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Printer className="h-5 w-5 text-slate-600" />Printable Reports
              </CardTitle>
            </CardHeader>
            <CardContent><PrintableReports /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
