import { useMemo, useRef, useState } from "react";
import {
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileBarChart2,
  Loader2,
  Printer,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListStudents, useListFees } from "@/lib/hooks";
import { useStaffAdmissionRequests } from "@/lib/administrative-staff-hooks";
import { useListClasses } from "@/lib/class-hooks";

function formatCurrency(value: unknown) {
  return `৳${Number(value ?? 0).toLocaleString("en-BD")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => JSON.stringify(row[column] ?? "")).join(",")),
  ].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function printReport(title: string, content: HTMLDivElement | null) {
  if (!content) return;
  const windowRef = window.open("", "_blank");
  if (!windowRef) return;
  windowRef.document.write(`
    <html><head><title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #172033; }
      h1 { margin: 0 0 4px; } p { color: #566176; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #d9dee8; padding: 8px; text-align: left; }
      th { background: #f2f4f8; } .summary { display: flex; gap: 12px; flex-wrap: wrap; }
      .metric { border: 1px solid #d9dee8; padding: 10px 16px; border-radius: 8px; }
    </style></head><body><h1>${title}</h1><p>Generated ${new Date().toLocaleString()}</p>${content.innerHTML}</body></html>
  `);
  windowRef.document.close();
  windowRef.focus();
  setTimeout(() => { windowRef.print(); windowRef.close(); }, 250);
}

function Metric({ label, value, tone = "primary" }: { label: string; value: string | number; tone?: "primary" | "green" | "amber" | "red" }) {
  const color = { primary: "text-primary", green: "text-emerald-600", amber: "text-amber-600", red: "text-rose-600" }[tone];
  return (
    <Card className="border-border/70 bg-card/70">
      <CardContent className="p-4 sm:p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-semibold tracking-tight ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function ReportActions({ onExport, onPrint, disabled }: { onExport: () => void; onPrint: () => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={onExport} disabled={disabled}><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
      <Button size="sm" variant="outline" onClick={onPrint} disabled={disabled}><Printer className="mr-1.5 h-4 w-4" /> Print</Button>
    </div>
  );
}

function StudentReport() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [className, setClassName] = useState("all");
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: students = [], isLoading } = useListStudents({ search, statusFilter: status as "all" | "active" | "inactive" });
  const { data: classes = [] } = useListClasses();
  const rows = (students as any[]).filter((student) => className === "all" || student.className === className);
  const active = rows.filter((student) => (student.status ?? "active") === "active").length;
  const csvRows = rows.map((student) => ({
    Name: student.name ?? "",
    "Roll Number": student.rollNumber ?? "",
    Class: student.className ?? "",
    Batch: student.batch ?? "",
    Phone: student.phone ?? "",
    Status: student.status ?? "active",
    "Joined On": formatDate(student.createdAt),
  }));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Students in view" value={rows.length} />
        <Metric label="Active" value={active} tone="green" />
        <Metric label="Inactive" value={rows.length - active} tone="red" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5"><Label htmlFor="student-search">Search</Label><div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="student-search" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, roll, phone..." /></div></div>
        <div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label>Class</Label><Select value={className} onValueChange={setClassName}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All classes</SelectItem>{(classes as any[]).map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <ReportActions onExport={() => exportCsv("student-report.csv", csvRows)} onPrint={() => printReport("Student Report", reportRef.current)} disabled={rows.length === 0} />
      <div ref={reportRef}>
        {isLoading ? <Loading label="Loading student report..." /> : rows.length === 0 ? <Empty icon={UsersRound} label="No students match these filters." /> : (
          <ResponsiveTable headers={["Student", "Class", "Batch", "Contact", "Status"]}>
            {rows.map((student) => <TableRow key={student.id}><TableCell className="font-medium">{student.name ?? "Unnamed"}<span className="block text-xs text-muted-foreground">Roll {student.rollNumber ?? "—"}</span></TableCell><TableCell>{student.className ?? "—"}</TableCell><TableCell>{student.batch ?? "—"}</TableCell><TableCell className="max-w-[180px] truncate">{student.phone ?? student.email ?? "—"}</TableCell><TableCell><Badge variant="outline" className={student.status === "inactive" ? "text-rose-600" : "text-emerald-600"}>{student.status ?? "active"}</Badge></TableCell></TableRow>)}
          </ResponsiveTable>
        )}
      </div>
    </div>
  );
}

function AdmissionReport() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: admissions = [], isLoading } = useStaffAdmissionRequests();
  const rows = (admissions as any[]).filter((item) => {
    const query = search.trim().toLowerCase();
    return (status === "all" || item.status === status) && (!query || [item.name, item.email, item.phone, item.className, item.batch].some((value) => value?.toLowerCase().includes(query)));
  });
  const pending = rows.filter((item) => item.status === "pending").length;
  const approved = rows.filter((item) => item.status === "approved").length;
  const csvRows = rows.map((item) => ({ Applicant: item.name, Email: item.email ?? "", Class: item.className ?? "", Batch: item.batch ?? "", Status: item.status, "Submitted On": formatDate(item.createdAt) }));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3"><Metric label="Applications in view" value={rows.length} /><Metric label="Pending review" value={pending} tone="amber" /><Metric label="Approved" value={approved} tone="green" /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="admission-search">Search</Label><div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="admission-search" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Applicant, class, email..." /></div></div><div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div></div>
      <ReportActions onExport={() => exportCsv("admission-report.csv", csvRows)} onPrint={() => printReport("Admission Report", reportRef.current)} disabled={rows.length === 0} />
      <div ref={reportRef}>{isLoading ? <Loading label="Loading admission report..." /> : rows.length === 0 ? <Empty icon={ClipboardCheck} label="No admission applications match these filters." /> : <ResponsiveTable headers={["Applicant", "Class", "Contact", "Status", "Submitted"]}>{rows.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.name}<span className="block text-xs text-muted-foreground">{item.email ?? "No email"}</span></TableCell><TableCell>{item.className ?? "—"}<span className="block text-xs text-muted-foreground">{item.batch ?? "—"}</span></TableCell><TableCell>{item.phone ?? "—"}</TableCell><TableCell><Badge variant="outline" className={item.status === "approved" ? "text-emerald-600" : item.status === "rejected" ? "text-rose-600" : "text-amber-600"}>{item.status}</Badge></TableCell><TableCell>{formatDate(item.createdAt)}</TableCell></TableRow>)}</ResponsiveTable>}</div>
    </div>
  );
}

function FeeReport() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: fees = [], isLoading } = useListFees();
  const rows = (fees as any[]).filter((item) => {
    const query = search.trim().toLowerCase();
    return (status === "all" || (item.status ?? "pending") === status) && (!query || [item.studentName, item.name, item.feeType, item.className].some((value) => value?.toLowerCase().includes(query)));
  });
  const total = rows.reduce((sum, item) => sum + Number(item.amount ?? item.totalAmount ?? 0), 0);
  const paid = rows.filter((item) => item.status === "paid").reduce((sum, item) => sum + Number(item.amount ?? item.totalAmount ?? 0), 0);
  const csvRows = rows.map((item) => ({ Student: item.studentName ?? item.name ?? "", "Fee Type": item.feeType ?? item.type ?? "", Amount: Number(item.amount ?? item.totalAmount ?? 0), Status: item.status ?? "pending", "Created On": formatDate(item.createdAt) }));

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3"><Metric label="Records in view" value={rows.length} /><Metric label="Total billed" value={formatCurrency(total)} /><Metric label="Paid value" value={formatCurrency(paid)} tone="green" /></div>
      <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="fee-search">Search</Label><div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="fee-search" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Student or fee type..." /></div></div><div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent></Select></div></div>
      <ReportActions onExport={() => exportCsv("fee-report.csv", csvRows)} onPrint={() => printReport("Fee Report", reportRef.current)} disabled={rows.length === 0} />
      <div ref={reportRef}>{isLoading ? <Loading label="Loading fee report..." /> : rows.length === 0 ? <Empty icon={BadgeDollarSign} label="No fee records match these filters." /> : <ResponsiveTable headers={["Student", "Fee type", "Amount", "Status", "Created"]}>{rows.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.studentName ?? item.name ?? "Unnamed"}<span className="block text-xs text-muted-foreground">{item.className ?? "—"}</span></TableCell><TableCell>{item.feeType ?? item.type ?? "Fee"}</TableCell><TableCell className="font-semibold">{formatCurrency(item.amount ?? item.totalAmount)}</TableCell><TableCell><Badge variant="outline" className={item.status === "paid" ? "text-emerald-600" : item.status === "partial" ? "text-amber-600" : "text-rose-600"}>{item.status ?? "pending"}</Badge></TableCell><TableCell>{formatDate(item.createdAt)}</TableCell></TableRow>)}</ResponsiveTable>}</div>
    </div>
  );
}

function ResponsiveTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-border/70"><Table className="min-w-[680px]"><TableHeader><TableRow>{headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{children}</TableBody></Table></div>;
}

function Loading({ label }: { label: string }) {
  return <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{label}</div>;
}

function Empty({ icon: Icon, label }: { icon: typeof UsersRound; label: string }) {
  return <div className="flex min-h-48 flex-col items-center justify-center text-center text-sm text-muted-foreground"><Icon className="mb-3 h-9 w-9 opacity-30" /><p>{label}</p></div>;
}

export default function AdministrativeStaffReports() {
  return (
    <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
      <header>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Administrative workspace</div>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Reports</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Review live enrollment, admissions, and fee performance with focused exports for your organization.</p>
      </header>
      <Card className="border-border/70 bg-card/70">
        <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><FileBarChart2 className="h-5 w-5 text-primary" />Operational reports</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="fees" className="space-y-5">
            <TabsList className="grid h-auto w-full grid-cols-1 gap-1 sm:grid-cols-3"><TabsTrigger value="fees" className="gap-2 py-2.5"><BadgeDollarSign className="h-4 w-4" />Fee Report</TabsTrigger><TabsTrigger value="admissions" className="gap-2 py-2.5"><ClipboardCheck className="h-4 w-4" />Admission Report</TabsTrigger><TabsTrigger value="students" className="gap-2 py-2.5"><UsersRound className="h-4 w-4" />Student Report</TabsTrigger></TabsList>
            <TabsContent value="fees"><FeeReport /></TabsContent>
            <TabsContent value="admissions"><AdmissionReport /></TabsContent>
            <TabsContent value="students"><StudentReport /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}