import { useMemo, useState } from "react";
import { useListAttendance, useMarkAttendance, useListStudents, getListAttendanceQueryKey } from "@/lib/hooks";
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
import { useToast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = { present: "default", absent: "destructive", late: "secondary" };
const SECTION_OPTIONS = ["Science", "Commerce", "Arts", "General"];

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [filterDate, setFilterDate] = useState(today);
  const [markDate, setMarkDate] = useState(today);
  const [markClassName, setMarkClassName] = useState("");
  const [markSection, setMarkSection] = useState("");
  const [markBatch, setMarkBatch] = useState("");
  const [markStudentId, setMarkStudentId] = useState("");
  const [markStatus, setMarkStatus] = useState("present");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: records = [], isLoading } = useListAttendance({ date: filterDate });
  const { data: students = [] } = useListStudents();
  const { data: classes = [] } = useListClasses();
  const markAttendance = useMarkAttendance();

  const selectedClass = (classes as any[]).find((c: any) => c.name === markClassName);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  const eligibleStudents = useMemo(
    () =>
      (students as any[]).filter(
        (s: any) => s.className === markClassName && s.section === markSection && s.batch === markBatch
      ),
    [students, markClassName, markSection, markBatch]
  );

  function handleClassChange(val: string) {
    setMarkClassName(val);
    setMarkBatch("");
    setMarkStudentId("");
  }

  function handleSectionChange(val: string) {
    setMarkSection(val);
    setMarkStudentId("");
  }

  function handleBatchChange(val: string) {
    setMarkBatch(val);
    setMarkStudentId("");
  }

  function handleMark() {
    if (!markDate || !markClassName || !markSection || !markBatch || !markStudentId || !markStatus) {
      toast({ title: "সব ঘর পূরণ করুন (All fields are required)", variant: "destructive" });
      return;
    }
    const student = (students as any[]).find((s: any) => s.id === markStudentId);
    markAttendance.mutate(
      { data: { studentId: markStudentId, studentName: student?.name ?? "", date: markDate, status: markStatus } },
      {
        onSuccess: () => {
          trackAttendanceMarked(markDate, 1);
          toast({ title: "Attendance marked" });
          qc.invalidateQueries({ queryKey: getListAttendanceQueryKey() });
          setMarkStudentId("");
        },
        onError: () => toast({ title: "Error marking attendance", variant: "destructive" }),
      }
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Mark Attendance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <Label>Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={markDate} onChange={e => setMarkDate(e.target.value)} />
            </div>
            {/* Class */}
            <div className="space-y-1">
              <Label>Class <span className="text-destructive">*</span></Label>
              <Select value={markClassName} onValueChange={handleClassChange}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Section */}
            <div className="space-y-1">
              <Label>Section <span className="text-destructive">*</span></Label>
              <Select value={markSection} onValueChange={handleSectionChange}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Batch */}
            <div className="space-y-1">
              <Label>Batch <span className="text-destructive">*</span></Label>
              <Select value={markBatch} onValueChange={handleBatchChange} disabled={!markClassName}>
                <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Student <span className="text-destructive">*</span></Label>
              <Select value={markStudentId} onValueChange={setMarkStudentId} disabled={!markBatch}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {eligibleStudents.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status <span className="text-destructive">*</span></Label>
              <Select value={markStatus} onValueChange={setMarkStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={handleMark} disabled={markAttendance.isPending}>Mark</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="whitespace-nowrap">Filter by Date:</Label>
          <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-auto" />
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => <TableRow key={i}><TableCell colSpan={3} className="h-12 animate-pulse bg-muted/30" /></TableRow>)
                : (records as any[]).length === 0
                  ? <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No attendance records for this date</TableCell></TableRow>
                  : (records as any[]).map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell><Badge variant={statusColor[r.status] as any}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
