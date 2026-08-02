import { useMemo, useState } from "react";
import {
  useListStudents,
  useListAttendanceFiltered,
  useBulkMarkAttendance,
  useGetMonthlyAttendanceSummary,
  useUpdateAttendanceRecord,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";
import {
  CheckCircle2, XCircle, Clock, Save, Loader2,
  CalendarDays, BarChart3, Download, Users, RefreshCw,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function StatusBtn({
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
  const labels: Record<Status, string> = {
    present: "উপস্থিত",
    absent: "অনুপস্থিত",
    late: "দেরিতে",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-11 min-w-11 items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-md border transition-all ${
        active
          ? STATUS_BUTTON_ACTIVE[status]
          : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      {icons[status]}
      {labels[status]}
    </button>
  );
}

// ── Mark Attendance Tab ────────────────────────────────────────────────────────

function MarkAttendanceTab() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [marks, setMarks] = useState<Record<string, Status>>({});

  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: students = [] } = useListStudents();
  const { data: classes = [] } = useListClasses();
  const bulkMark = useBulkMarkAttendance();

  const selectedClass = (classes as any[]).find((c: any) => c.name === filterClass);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const eligibleStudents = useMemo(
    () =>
      (students as any[]).filter(
        (s: any) =>
          (!filterClass || s.className === filterClass) &&
          (!filterSection || s.section === filterSection) &&
          (!filterBatch || s.batch === filterBatch) &&
          (s.status ?? "active") === "active"
      ),
    [students, filterClass, filterSection, filterBatch]
  );

  // Pre-fill marks from existing records for the selected date
  const { data: existingRecords = [] } = useListAttendanceFiltered({
    date,
    className: filterClass || undefined,
    batch: filterBatch || undefined,
  });

  useMemo(() => {
    const pre: Record<string, Status> = {};
    for (const r of existingRecords as any[]) {
      if (r.status === "present" || r.status === "absent" || r.status === "late") {
        pre[r.studentId] = r.status as Status;
      }
    }
    setMarks((prev) => {
      const next = { ...pre };
      for (const [k, v] of Object.entries(prev)) next[k] = v;
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRecords.length, date, filterClass, filterSection, filterBatch]);

  function markAll(status: Status) {
    const next: Record<string, Status> = {};
    for (const s of eligibleStudents) next[s.id] = status;
    setMarks(next);
  }

  function toggle(studentId: string, status: Status) {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSave() {
    if (!date) {
      toast({ title: "তারিখ নির্বাচন করুন", variant: "destructive" });
      return;
    }
    const records = eligibleStudents
      .filter((s: any) => marks[s.id])
      .map((s: any) => ({
        studentId: s.id,
        studentName: s.name ?? "",
        status: marks[s.id],
        className: s.className ?? filterClass,
        section: s.section ?? filterSection,
        batch: s.batch ?? filterBatch,
      }));
    if (!records.length) {
      toast({ title: "কমপক্ষে একজন student-এর উপস্থিতি চিহ্নিত করুন", variant: "destructive" });
      return;
    }
    bulkMark.mutate(
      { date, records },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: [undefined, "attendance"] });
          toast({ title: `${records.length} জন student-এর উপস্থিতি সংরক্ষিত হয়েছে` });
        },
        onError: () => toast({ title: "সংরক্ষণ ব্যর্থ হয়েছে", variant: "destructive" }),
      }
    );
  }

  const stats = useMemo(() => ({
    present: Object.values(marks).filter((v) => v === "present").length,
    absent: Object.values(marks).filter((v) => v === "absent").length,
    late: Object.values(marks).filter((v) => v === "late").length,
    unmarked: eligibleStudents.filter((s: any) => !marks[s.id]).length,
  }), [marks, eligibleStudents]);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">তারিখ</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full sm:w-40" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">ক্লাস</Label>
          <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterBatch(""); }}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="সব ক্লাস" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব ক্লাস</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">সেকশন</Label>
          <Select value={filterSection} onValueChange={setFilterSection}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              {SECTION_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">ব্যাচ</Label>
          <Select value={filterBatch} onValueChange={setFilterBatch} disabled={!filterClass}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              {availableBatches.map((b: string) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {eligibleStudents.length === 0 ? (
        <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>কোনো active student নেই। ক্লাস বা ব্যাচ বেছে নিন।</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats + bulk actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-green-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {stats.present} উপস্থিত
              </span>
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" /> {stats.late} দেরিতে
              </span>
              <span className="text-red-700 font-medium flex items-center gap-1">
                <XCircle className="h-4 w-4" /> {stats.absent} অনুপস্থিত
              </span>
              {stats.unmarked > 0 && (
                <span className="text-muted-foreground">{stats.unmarked} বাকি</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="min-h-11 text-green-700 border-green-300" onClick={() => markAll("present")}>
                সবাই উপস্থিত
              </Button>
              <Button size="sm" variant="outline" className="min-h-11 text-amber-700 border-amber-300" onClick={() => markAll("late")}>
                সবাই দেরিতে
              </Button>
              <Button size="sm" variant="outline" className="min-h-11 text-red-700 border-red-300" onClick={() => markAll("absent")}>
                সবাই অনুপস্থিত
              </Button>
            </div>
          </div>

          {/* Student cards */}
          <div className="space-y-2">
            {eligibleStudents.map((s: any) => {
              const current = marks[s.id] ?? null;
              return (
                <Card
                  key={s.id}
                  className={`transition-all ${
                    current === "present"
                      ? "ring-1 ring-green-300 bg-green-50/30"
                      : current === "absent"
                      ? "ring-1 ring-red-300 bg-red-50/30"
                      : current === "late"
                      ? "ring-1 ring-amber-300 bg-amber-50/30"
                      : ""
                  }`}
                >
                  <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[s.className, s.section, s.batch].filter(Boolean).join(" • ") || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {current && (
                        <Badge className={`text-xs ${STATUS_COLORS[current]}`}>{
                          current === "present" ? "উপস্থিত" : current === "late" ? "দেরিতে" : "অনুপস্থিত"
                        }</Badge>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        {(["present", "absent", "late"] as Status[]).map((st) => (
                          <StatusBtn
                            key={st}
                            status={st}
                            active={current === st}
                            onClick={() => toggle(s.id, st)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary card + save */}
          <Card className="bg-muted/20">
            <CardContent className="py-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex gap-4 text-sm">
                <span className="text-muted-foreground">মোট {eligibleStudents.length} জন</span>
                <span className="text-green-700">উপস্থিত: {stats.present}</span>
                <span className="text-amber-700">দেরিতে: {stats.late}</span>
                <span className="text-red-700">অনুপস্থিত: {stats.absent}</span>
              </div>
              <Button onClick={handleSave} disabled={bulkMark.isPending}>
                {bulkMark.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  : <Save className="h-4 w-4 mr-2" />}
                সংরক্ষণ করুন ({Object.values(marks).filter(Boolean).length}/{eligibleStudents.length})
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// ── History Tab ────────────────────────────────────────────────────────────────

function HistoryTab() {
  const today = new Date().toISOString().split("T")[0];
  const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(thirtyAgo);
  const [endDate, setEndDate] = useState(today);
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { toast } = useToast();
  const { data: classes = [] } = useListClasses();
  const updateRecord = useUpdateAttendanceRecord();
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
          toast({ title: "আপডেট হয়েছে" });
        },
        onError: () => toast({ title: "আপডেট ব্যর্থ হয়েছে", variant: "destructive" }),
      }
    );
  }

  function handleExport() {
    const rows = (records as any[]).map((r: any) => ({
      Date: r.date ?? "",
      Student: r.studentName ?? "",
      Class: r.className ?? "",
      Batch: r.batch ?? "",
      Status: r.status ?? "",
    }));
    if (!rows.length) {
      toast({ title: "কোনো ডেটা নেই", variant: "destructive" });
      return;
    }
    exportToCsv(`teacher_attendance_${startDate}_to_${endDate}.csv`, rows);
  }

  const counts = useMemo(() => {
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
          <Label className="text-xs text-muted-foreground">ক্লাস</Label>
          <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterBatch(""); }}>
            <SelectTrigger><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">ব্যাচ</Label>
          <Select value={filterBatch} onValueChange={setFilterBatch} disabled={!filterClass}>
            <SelectTrigger><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              {availableBatches.map((b: string) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              <SelectItem value="present">উপস্থিত</SelectItem>
              <SelectItem value="absent">অনুপস্থিত</SelectItem>
              <SelectItem value="late">দেরিতে</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-green-700">উপস্থিত: {counts.present}</span>
          <span className="text-amber-700">দেরিতে: {counts.late}</span>
          <span className="text-red-700">অনুপস্থিত: {counts.absent}</span>
          <span className="text-muted-foreground">মোট: {(records as any[]).length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="min-h-11" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
          <Button size="sm" variant="outline" className="min-h-11" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <div className="min-w-[760px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Student</TableHead>
              <TableHead>তারিখ</TableHead>
              <TableHead>ক্লাস</TableHead>
              <TableHead>ব্যাচ</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="h-10 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : (records as any[]).length === 0 ? (
              <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  এই filter-এ কোনো রেকর্ড নেই
                </TableCell>
              </TableRow>
            ) : (
              (records as any[]).map((r: any) => (
                <TableRow key={r.id}>
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
                      <SelectTrigger className={`h-7 w-28 text-xs font-semibold border ${
                        r.status === "present" ? "bg-green-100 text-green-800 border-green-200"
                        : r.status === "absent" ? "bg-red-100 text-red-800 border-red-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">উপস্থিত</SelectItem>
                        <SelectItem value="absent">অনুপস্থিত</SelectItem>
                        <SelectItem value="late">দেরিতে</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}

// ── Monthly Report Tab ─────────────────────────────────────────────────────────

function MonthlyTab() {
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
    return Math.round((summary as any[]).reduce((s, r: any) => s + r.percentage, 0) / (summary as any[]).length);
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
      toast({ title: "কোনো ডেটা নেই", variant: "destructive" });
      return;
    }
    exportToCsv(`monthly_report_${month}.csv`, rows);
  }

  function pctColor(p: number) {
    return p >= 75 ? "text-green-700" : p >= 50 ? "text-amber-700" : "text-red-700";
  }

  function barColor(p: number) {
    return p >= 75 ? "bg-green-500" : p >= 50 ? "bg-amber-500" : "bg-red-500";
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">মাস</Label>
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">ক্লাস</Label>
          <Select value={filterClass} onValueChange={(v) => { setFilterClass(v); setFilterBatch(""); }}>
            <SelectTrigger><SelectValue placeholder="সব ক্লাস" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব ক্লাস</SelectItem>
              {(classes as any[]).map((c: any) => (
                <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">ব্যাচ</Label>
          <Select value={filterBatch} onValueChange={setFilterBatch} disabled={!filterClass}>
            <SelectTrigger><SelectValue placeholder="সব" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">সব</SelectItem>
              {availableBatches.map((b: string) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats + export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="text-muted-foreground">{(summary as any[]).length} জন student</span>
          {(summary as any[]).length > 0 && (
            <span className={`font-semibold ${pctColor(classAvg)}`}>
              গড় উপস্থিতি: {classAvg}%
            </span>
          )}
        </div>
        <Button size="sm" variant="outline" className="min-h-11" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <div className="min-w-[900px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Student</TableHead>
              <TableHead>ক্লাস / ব্যাচ</TableHead>
              <TableHead className="text-center">উপস্থিত</TableHead>
              <TableHead className="text-center">দেরিতে</TableHead>
              <TableHead className="text-center">অনুপস্থিত</TableHead>
              <TableHead className="text-center">মোট</TableHead>
              <TableHead>উপস্থিতি %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7} className="h-10 animate-pulse bg-muted/20" />
                </TableRow>
              ))
            ) : (summary as any[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  {month} মাসের কোনো ডেটা নেই। প্রথমে Daily Attendance চিহ্নিত করুন।
                </TableCell>
              </TableRow>
            ) : (
              (summary as any[]).map((row: any) => (
                <TableRow key={row.studentId}>
                  <TableCell className="font-medium">{row.studentName || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {[row.className, row.batch].filter(Boolean).join(" / ") || "—"}
                  </TableCell>
                  <TableCell className="text-center text-green-700 font-medium">{row.present}</TableCell>
                  <TableCell className="text-center text-amber-700 font-medium">{row.late}</TableCell>
                  <TableCell className="text-center text-red-700 font-medium">{row.absent}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{row.total}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[100px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor(row.percentage)}`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${pctColor(row.percentage)}`}>
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
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function TeacherAttendance() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          উপস্থিতি চিহ্নিত করুন, ইতিহাস দেখুন এবং মাসিক রিপোর্ট ডাউনলোড করুন।
        </p>
      </div>

      <Tabs defaultValue="mark" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="mark" className="gap-1.5">
            <CalendarDays className="h-4 w-4" /> Mark করুন
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Users className="h-4 w-4" /> ইতিহাস
          </TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> মাসিক রিপোর্ট
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark">
          <MarkAttendanceTab />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
