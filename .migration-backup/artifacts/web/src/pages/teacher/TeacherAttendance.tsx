import { useState } from "react";
import { useListStudents, useListAttendance, useMarkAttendance } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Status = "present" | "absent" | "late";

export default function TeacherAttendance() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const { data: students = [] } = useListStudents();
  const { data: existing = [] } = useListAttendance({ date });
  const markAttendance = useMarkAttendance();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState<string | null>(null);

  async function mark(studentId: string, studentName: string, status: Status) {
    setSubmitting(`${studentId}-${status}`);
    markAttendance.mutate(
      { data: { studentId, studentName, date, status } },
      {
        onSuccess: () => toast({ title: `${studentName} — ${status}` }),
        onError: () => toast({ title: "Error", variant: "destructive" }),
        onSettled: () => setSubmitting(null),
      }
    );
  }

  function getStudentStatus(studentId: string): Status | null {
    const rec = (existing as any[]).find((a) => a.studentId === studentId);
    return rec?.status ?? null;
  }

  const statusBadge = {
    present: <Badge className="bg-green-100 text-green-700 border-green-200">উপস্থিত</Badge>,
    absent: <Badge className="bg-red-100 text-red-700 border-red-200">অনুপস্থিত</Badge>,
    late: <Badge className="bg-amber-100 text-amber-700 border-amber-200">দেরিতে</Badge>,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Attendance Mark করুন</h1>
          <p className="text-muted-foreground">প্রতিদিনের উপস্থিতি রেকর্ড করুন</p>
        </div>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
        />
      </div>

      {(students as any[]).length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            কোনো student নেই। Admin প্রথমে student যোগ করুন।
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {(students as any[]).map((s: any) => {
            const status = getStudentStatus(s.id);
            return (
              <Card key={s.id}>
                <CardContent className="py-3 px-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.class || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {status ? statusBadge[status] : (
                      <>
                        <Button
                          size="sm" variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50 gap-1"
                          disabled={!!submitting}
                          onClick={() => mark(s.id, s.name, "present")}
                        >
                          {submitting === `${s.id}-present` ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          উপস্থিত
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-1"
                          disabled={!!submitting}
                          onClick={() => mark(s.id, s.name, "late")}
                        >
                          {submitting === `${s.id}-late` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                          দেরিতে
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50 gap-1"
                          disabled={!!submitting}
                          onClick={() => mark(s.id, s.name, "absent")}
                        >
                          {submitting === `${s.id}-absent` ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                          অনুপস্থিত
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">সারসংক্ষেপ — {date}</CardTitle></CardHeader>
        <CardContent className="flex gap-4 text-sm">
          <span className="text-green-600">উপস্থিত: {(existing as any[]).filter((a) => a.status === "present").length}</span>
          <span className="text-amber-600">দেরিতে: {(existing as any[]).filter((a) => a.status === "late").length}</span>
          <span className="text-red-600">অনুপস্থিত: {(existing as any[]).filter((a) => a.status === "absent").length}</span>
        </CardContent>
      </Card>
    </div>
  );
}
