import { CalendarCheck, Users, ClipboardList, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListStudents, useListAttendance, useListExams, useListNotices } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";

export default function TeacherDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const { data: students = [] } = useListStudents();
  const { data: todayAttendance = [] } = useListAttendance({ date: today });
  const { data: exams = [] } = useListExams();
  const { data: notices = [] } = useListNotices();

  const presentToday = (todayAttendance as any[]).filter((a) => a.status === "present").length;
  const upcomingExams = (exams as any[]).filter((e) => e.date >= today).slice(0, 3);
  const recentNotices = (notices as any[]).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">{new Date().toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">মোট Students</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{(students as any[]).length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">আজকের Attendance</CardTitle>
            <CalendarCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentToday}</div>
            <p className="text-xs text-muted-foreground">উপস্থিত / {(todayAttendance as any[]).length} marked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">আসন্ন Exams</CardTitle>
            <ClipboardList className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{upcomingExams.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notices</CardTitle>
            <Bell className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{(notices as any[]).length}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">আসন্ন Exams</CardTitle></CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">কোনো আসন্ন exam নেই</p>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      {e.subject && <p className="text-xs text-muted-foreground">{e.subject}</p>}
                    </div>
                    <Badge variant="outline">{e.date}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">সাম্প্রতিক Notices</CardTitle></CardHeader>
          <CardContent>
            {recentNotices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">কোনো notice নেই</p>
            ) : (
              <div className="space-y-2">
                {recentNotices.map((n: any) => (
                  <div key={n.id} className="p-2 rounded-lg border">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
