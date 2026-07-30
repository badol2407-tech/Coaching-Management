import { useMemo, useState } from "react";
import {
  useListStudents,
  useListAttendanceFiltered,
  useBulkMarkAttendance,
  useGetMonthlyAttendanceSummary,
  useUpdateAttendanceRecord,
  useDeleteAttendanceRecord,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackAttendanceMarked } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";
import {
  CheckCircle2, XCircle, Clock, Users, Download, Save, Loader2,
  CalendarDays, BarChart3, Trash2, RefreshCw,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

type Status = "present" | "absent" | "late";

const STATUS_COLORS: Record<Status, string> = {
  present: "bg-green-100 text-green-800 border-green-200",
  absent: "bg-red-100 text-red-800 border-red-200",
  late: "bg-amber-100 text-amber-800 border-amber-200",
};

const STATUS_BUTTON_ACTIVE: Record<Status, string> = {
  present: "bg-green-500 text-white border-green-500 shadow-sm",
  absent: "bg-red-500 text-white border-red-500 shadow-sm",
  late: "bg-amber-500 text-white border-amber-500 shadow-sm",
};

const STATUS_BUTTON_INACTIVE = "bg-white border-gray-200 text-gray-500 hover:bg-gray-50";

function exportToCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const csv = [
    cols.join(","),
    ...rows.map((r) =>
      cols.map((c) => JSON.stringify(r[c] ?? "")).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── sub-components ─────────────────────────────────────────────────────────────

function StatusButton({
  status,
  active,
  onClick,
}: {
  status: Status;
  active: boolean;
  onClick: () => void;
}) {
  const icons: Record<Status, React.ReactNode> = {
    present: <CheckCircle2 className="h-3.5 w-3.5" />,
    absent: <XCircle className="h-3.5 w-3.5" />,
    late: <Clock className="h-3.5 w-3.5" />,
  };
  const labels: Record<Status, string> = { present: "Present", absent: "Absent", late: "Late" };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all ${
        active ? STATUS_BUTTON_ACTIVE[status] : STATUS_BUTTON_INACTIVE
      }`}
    >
      {icons[status]}
      {labels[status]}
    </button>
  );
}

// ── Daily Attendance Tab ───────────────────────────────────────────────────────

function DailyAttendanceTab() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState("");
  const [marks, setMarks] = useState<Record<string, Status>>({});

  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: students = [] } = useListStudents();
  const { data: classes = [] } = useListClasses();
  const bulkMark = useBulkMarkAttendance();

  const selectedClass = (classes as any[]).find((c: any) => c.name === className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const eligibleStudents = useMemo(
    () =>
      (students as any[]).filter(
        (s: any) =>
          (!className || s.className === className) &&
          (!section || s.section === section) &&
          (!batch || s.batch === batch) &&
          (s.status ?? "active") === "active"
      ),
    [students, className, section, batch]
  );

  // Load existing attendance for today's date + filters
  const { data: existingRecords = [] } = useListAttendanceFiltered({
    date,
    className: className || undefined,
    batch: batch || undefined,
  });

  // Sync marks from existing records when filters change
  useMemo(() => {
    const initialMarks: Record<string, Status> = {};
    for (const r of existingRecords as any[]) {
      if (r.status === "present" || r.status === "absent" || r.status === "late") {
        initialMarks[r.studentId] = r.status as Status;
      }
    }
    // Merge with current marks (don't reset what user already typed)
    setMarks((prev) => {
      const next = { ...initialMarks };
      for (const [k, v] of Object.entries(prev)) {
        next[k] = v;
      }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecords.length, date, className, section, batch]);

  function handleMarkAll(status: Status) {
    const next: Record<string, Status> = {};
    for (const s of eligibleStudents) next[s.id] = status;
    setMarks(next);
  }

  function handleToggle(studentId: string, status: Status) {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSave() {
    if (!date) {
      toast({ title: "Please select a date", variant: "destructive" });
      return;
    }
    const records = eligibleStudents
      .filter((s: any) => marks[s.id])
      .map((s: any) => ({
        studentId: s.id,
        studentName: s.name ?? "",
        status: marks[s.id],
        className: s.className ?? className,
        section: s.section ?? section,
        batch: s.batch ?? batch,
      }));
    if (!records.length) {
      toast({ title: "Mark at least one student before saving", variant: "destructive" });
      return;
    }
    bulkMark.mutate(
      { date, records },
      {
        onSuccess: () => {
          trackAttendanceMarked(date, records.length);
          qc.invalidateQueries({ queryKey: [undefined, "attendance"] });
          toast({ title: `Attendance saved for ${records.length} student(s)` });
        },
        onError: () => toast({ title: "Failed to save attendance", variant: "destructive" }),
      }
    );
  }

  const stats = useMemo(() => {
    const vals = Object.values(marks);
    return {
      present: vals.filter((v) => v === "present").length,
      absent: vals.filter((v) => v === "absent").length,
      late: vals.filter((v) => v === "late").length,
      unmarked: eligibleStudents.filter((s: any) => !marks[s.id]).length,
    };
  }, [marks, eligibleStudents]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Class</Label>
              <Select value={className} onValueChange={(v) => { setClassName(v); setBatch(""); }}>
                <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All classes</SelectItem>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Section</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger><SelectValue placeholder="All sections" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sections</SelectItem>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Batch</Label>
              <Select value={batch} onValueChange={setBatch} disabled={!className}>
                <SelectTrigger><SelectValue placeholder="All batches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All batches</SelectItem>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {eligibleStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No active students found. Select a class or batch to load students.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary bar + bulk actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-700 font-medium">
                <CheckCircle2 className="h-4 w-4" /> {stats.present} Present
              </span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <Clock className="h-4 w-4" /> {stats.late} Late
              </span>
              <span className="flex items-center gap-1 text-red-700 font-medium">
                <XCircle className="h-4 w-4" /> {stats.absent} Absent
              </span>
              {stats.unmarked > 0 && (
                <span className="text-muted-foreground">{stats.unmarked} unmarked</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleMarkAll("present")}>
                All Present
              </Button>
              <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-50" onClick={() => handleMarkAll("late")}>
                All Late
              </Button>
              <Button size="sm" variant="outline" className="text-red-700 border-red-300 hover:bg-red-50" onClick={() => handleMarkAll("absent")}>
                All Absent
              </Button>
            </div>
          </div>

          {/* Student list */}
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eligibleStudents.map((s: any) => {
              const current = marks[s.id] ?? null;
              return (
                <Card key={s.id} className={`transition-all ${current === "present" ? "ring-1 ring-green-300" : current === "absent" ? "ring-1 ring-red-300" : current === "late" ? "ring-1 ring-amber-300" : ""}`}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.className} {s.section ? `• ${s.section}` : ""} {s.batch ? `• ${s.batch}` : ""}</p>
                      </div>
                      {current && (
                        <Badge className={`text-xs shrink-0 ${STATUS_COLORS[current]}`}>{current}</Badge>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {(["present", "absent", "late"] as Status[]).map((st) => (
                        <StatusButton
                          key={st}
                          status={st}
                          active={current === st}
                          onClick={() => handleToggle(s.id, st)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={bulkMark.isPending} className="px-8">
              {bulkMark.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Attendance ({Object.values(marks).filter(Boolean).length} / {eligibleStudents.length})
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ── History Tab ─────────────────────────────────────────────────────────────────

function HistoryTab() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { toast } = useToast();
  const { data: classes = [] } = useListClasses();
  const updateRecord = useUpdateAttendanceRecord();
  const deleteRecord = useDeleteAttendanceRecord();
  const qc = useQueryClient();

  const { data: records = [], isLoading, refetch } = useListAttendanceFiltered({
    startDate,
    endDate,
    className: filterClass || undefined,
    batch: filterBatch || undefined,
    status: filterStatus || undefined,
  });

  const selectedClass = (classes as any[]).find((c: any) => c.name === filterClass);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  function handleStatusChange(id: string, newStatus: Status) {
    updateRecord.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [undefined, "attendance"] });
          toast({ title: "Record updated" });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this attendance record?")) return;
    deleteRecord.mutate(
      { id },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [undefined, "attendance"] });
          toast({ title: "Record deleted" });
        },
        onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
      }
    );
  }

  function handleExport() {
    const rows = (records as any[]).map((r) => ({
      Date: r.date ?? "",
      Student: r.studentName ?? "",
      Class: r.className ?? "",
      Batch: r.batch ?? "",
      Status: r.status ?? "",
    }));
    if (!rows.length) {
      toast({ title: "No records to export", variant: "destructive" });
      return;
    }
    exportToCsv(`attendance_history_${startDate}_to_${endDate}.csv`, rows);
  }

  const statusCounts = useMemo(() => {
    const all = records as any[];
    return {
      present: all.filter((r) => r.status === "present").length,
      absent: all.filter((r) => r.status === "absent").length,
      late: all.filter((r) => r.status === "late").length,
    };
  }, [records]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Class</Label>
              <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterBatch(""); }}>
                <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All classes</SelectItem>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Batch</Label>
              <Select value={filterBatch} onValueChange={setFilterBatch} disabled={!filterClass}>
                <SelectTrigger><SelectValue placeholder="All batches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All batches</SelectItem>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats + actions bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-4 text-sm">
          <span className="text-green-700 font-medium">{statusCounts.present} Present</span>
          <span className="text-amber-700 font-medium">{statusCounts.late} Late</span>
          <span className="text-red-700 font-medium">{statusCounts.absent} Absent</span>
          <span className="text-muted-foreground">{(records as any[]).length} total records</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="h-10 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : (records as any[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No attendance records found for these filters.
                </TableCell>
              </TableRow>
            ) : (
              (records as any[]).map((r: any) => (
                <TableRow key={r.id} className="group">
                  <TableCell className="font-medium">{r.studentName || "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.date}</TableCell>
                  <TableCell className="text-sm">{r.className || "—"}</TableCell>
                  <TableCell className="text-sm">{r.batch || "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(val) => handleStatusChange(r.id, val as Status)}
                      disabled={updateRecord.isPending}
                    >
                      <SelectTrigger className={`h-7 w-24 text-xs font-semibold border ${STATUS_COLORS[r.status as Status] ?? ""}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleteRecord.isPending}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                      title="Delete record"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Monthly Report Tab ─────────────────────────────────────────────────────────

function MonthlyReportTab() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [month, setMonth] = useState(currentMonth);
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");

  const { toast } = useToast();
  const { data: classes = [] } = useListClasses();
  const { data: summary = [], isLoading } = useGetMonthlyAttendanceSummary({
    month,
    className: filterClass || undefined,
    batch: filterBatch || undefined,
  });

  const selectedClass = (classes as any[]).find((c: any) => c.name === filterClass);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const classAvg = useMemo(() => {
    if (!(summary as any[]).length) return 0;
    const total = (summary as any[]).reduce((s, r: any) => s + r.percentage, 0);
    return Math.round(total / (summary as any[]).length);
  }, [summary]);

  function handleExport() {
    const rows = (summary as any[]).map((r: any) => ({
      Month: month,
      Student: r.studentName,
      Class: r.className,
      Batch: r.batch,
      Present: r.present,
      Late: r.late,
      Absent: r.absent,
      "Total Days": r.total,
      "Attendance %": `${r.percentage}%`,
    }));
    if (!rows.length) {
      toast({ title: "No data to export", variant: "destructive" });
      return;
    }
    exportToCsv(`monthly_attendance_${month}.csv`, rows);
  }

  function percentColor(pct: number) {
    if (pct >= 75) return "text-green-700";
    if (pct >= 50) return "text-amber-700";
    return "text-red-700";
  }

  function progressColor(pct: number) {
    if (pct >= 75) return "bg-green-500";
    if (pct >= 50) return "bg-amber-500";
    return "bg-red-500";
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Month</Label>
              <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Class</Label>
              <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterBatch(""); }}>
                <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All classes</SelectItem>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Batch</Label>
              <Select value={filterBatch} onValueChange={setFilterBatch} disabled={!filterClass}>
                <SelectTrigger><SelectValue placeholder="All batches" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All batches</SelectItem>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats + export */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">{(summary as any[]).length} students</span>
          {(summary as any[]).length > 0 && (
            <span className={`font-semibold ${percentColor(classAvg)}`}>
              Class avg: {classAvg}%
            </span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead className="text-center">Present</TableHead>
              <TableHead className="text-center">Late</TableHead>
              <TableHead className="text-center">Absent</TableHead>
              <TableHead className="text-center">Total Days</TableHead>
              <TableHead>Attendance %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8} className="h-10 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : (summary as any[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No attendance data for {month}. Mark daily attendance first.
                </TableCell>
              </TableRow>
            ) : (
              (summary as any[]).map((row: any) => (
                <TableRow key={row.studentId}>
                  <TableCell className="font-medium">{row.studentName || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.className || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.batch || "—"}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-700 font-medium">{row.present}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-amber-700 font-medium">{row.late}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-red-700 font-medium">{row.absent}</span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{row.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${progressColor(row.percentage)}`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${percentColor(row.percentage)}`}>
                        {row.percentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function Attendance() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Mark daily attendance, view history, and track monthly performance.
        </p>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="daily" className="gap-1.5">
            <CalendarDays className="h-4 w-4" /> Daily Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Users className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Monthly Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <DailyAttendanceTab />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyReportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
