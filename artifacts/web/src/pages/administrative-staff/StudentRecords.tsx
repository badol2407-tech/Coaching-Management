import { useMemo, useState } from "react";
import { Eye, Loader2, RefreshCw, Search, UserRound, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListStudents } from "@/lib/hooks";

type Student = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  className?: string | null;
  section?: string | null;
  batch?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  enrolledAt?: string | null;
  createdAt?: string | null;
  rollNumber?: string | null;
  status?: "active" | "inactive" | null;
  uid?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function display(value?: string | null) {
  return value?.trim() || "Not provided";
}

function statusBadge(status?: Student["status"]) {
  return status === "inactive" ? (
    <Badge variant="outline" className="border-amber-500/25 bg-amber-500/10 text-amber-600">Inactive</Badge>
  ) : (
    <Badge variant="outline" className="border-emerald-500/25 bg-emerald-500/10 text-emerald-600">Active</Badge>
  );
}

function StudentDetails({ student, open, onOpenChange }: { student: Student | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {student && (
          <>
            <SheetHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="h-6 w-6" />
              </div>
              <SheetTitle className="text-2xl">{display(student.name)}</SheetTitle>
              <SheetDescription>
                {display(student.className)}{student.section ? ` · Section ${student.section}` : ""}
                {student.batch ? ` · ${student.batch}` : ""}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-7 space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Enrollment status</span>
                {statusBadge(student.status)}
              </div>
              <DetailGroup title="Contact information">
                <Detail label="Email" value={display(student.email)} />
                <Detail label="Phone" value={display(student.phone)} />
                <Detail label="Address" value={display(student.address)} />
              </DetailGroup>
              <DetailGroup title="Academic record">
                <Detail label="Roll number" value={display(student.rollNumber)} />
                <Detail label="Class" value={display(student.className)} />
                <Detail label="Section" value={display(student.section)} />
                <Detail label="Batch" value={display(student.batch)} />
                <Detail label="Enrolled" value={formatDate(student.enrolledAt || student.createdAt)} />
              </DetailGroup>
              <DetailGroup title="Guardian">
                <Detail label="Name" value={display(student.guardianName)} />
                <Detail label="Phone" value={display(student.guardianPhone)} />
              </DetailGroup>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="rounded-xl border border-border/70 bg-card/60 px-4">
        {children}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-border/60 py-3 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-words text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function StudentRecords() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const studentsQuery = useListStudents({ search, statusFilter: status });
  const students = (studentsQuery.data ?? []) as Student[];
  const activeCount = useMemo(() => students.filter((student) => (student.status ?? "active") === "active").length, [students]);

  return (
    <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Administrative workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">Student Records</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find student information quickly and open a complete record when you need it.</p>
        </div>
        <Button variant="outline" onClick={() => studentsQuery.refetch()} disabled={studentsQuery.isFetching} className="w-fit gap-2">
          <RefreshCw className={`h-4 w-4 ${studentsQuery.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total students" value={students.length} icon={UsersRound} />
        <SummaryCard label="Active students" value={activeCount} icon={UserRound} tone="emerald" />
        <SummaryCard label="Inactive students" value={students.length - activeCount} icon={UserRound} tone="amber" />
      </div>

      <Card className="overflow-hidden border-border/70 bg-card/70 shadow-[0_20px_60px_rgba(35,31,76,0.08)] backdrop-blur-xl">
        <CardHeader className="gap-4 border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">All students</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." className="pl-9" aria-label="Search students" />
              </div>
              <Select value={status} onValueChange={(value: "all" | "active" | "inactive") => setStatus(value)}>
                <SelectTrigger className="w-full sm:w-32" aria-label="Filter students by status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {studentsQuery.isLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading student records...</div>
          ) : studentsQuery.isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center"><p className="text-sm text-destructive">Could not load student records.</p><Button variant="outline" onClick={() => studentsQuery.refetch()}>Try again</Button></div>
          ) : students.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 text-center"><UsersRound className="h-8 w-8 text-muted-foreground/50" /><p className="font-medium">No students found</p><p className="text-sm text-muted-foreground">{search ? "Try a different search term." : "Approved admissions will appear here."}</p></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead>Student</TableHead><TableHead>Class / batch</TableHead><TableHead>Contact</TableHead><TableHead>Enrolled</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Details</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="group">
                      <TableCell className="min-w-52">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">{display(student.name).slice(0, 1).toUpperCase()}</div>
                          <div className="min-w-0"><p className="truncate font-medium">{display(student.name)}</p><p className="truncate text-xs text-muted-foreground">{student.rollNumber ? `Roll ${student.rollNumber}` : "No roll number"}</p></div>
                        </div>
                      </TableCell>
                      <TableCell><p>{display(student.className)}</p><p className="text-xs text-muted-foreground">{student.batch || student.section || "No section or batch"}</p></TableCell>
                      <TableCell><p>{display(student.phone)}</p><p className="max-w-48 truncate text-xs text-muted-foreground">{display(student.email)}</p></TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{formatDate(student.enrolledAt || student.createdAt)}</TableCell>
                      <TableCell>{statusBadge(student.status)}</TableCell>
                      <TableCell className="text-right"><Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedStudent(student)}><Eye className="h-4 w-4" />View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <StudentDetails student={selectedStudent} open={Boolean(selectedStudent)} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }} />
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, tone = "violet" }: { label: string; value: number; icon: typeof UsersRound; tone?: "violet" | "emerald" | "amber" }) {
  const toneClass = { violet: "bg-primary/10 text-primary", emerald: "bg-emerald-500/10 text-emerald-600", amber: "bg-amber-500/10 text-amber-600" }[tone];
  return <Card className="border-border/70 bg-card/70"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}><Icon className="h-5 w-5" /></div></CardContent></Card>;
}