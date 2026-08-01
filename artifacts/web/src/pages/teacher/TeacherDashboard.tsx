import { Link } from "wouter";
import {
  CalendarCheck, Users, ClipboardList, Bell,
  BookOpen, NotebookPen, Clock, ArrowRight,
  CheckCircle2, Zap, TrendingUp, Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useListStudents,
  useListAttendance,
  useListExams,
  useListNotices,
  useListHomework,
  useListRoutine,
} from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";

// Map JS getDay() → Bangladesh routine day key
const JS_DAY_TO_KEY: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

const DAY_LABELS: Record<string, string> = {
  saturday: "শনিবার",
  sunday: "রবিবার",
  monday: "সোমবার",
  tuesday: "মঙ্গলবার",
  wednesday: "বুধবার",
  thursday: "বৃহস্পতিবার",
  friday: "শুক্রবার",
};

export default function TeacherDashboard() {
  const today = new Date().toISOString().split("T")[0];
  const todayKey = JS_DAY_TO_KEY[new Date().getDay()];
  const { userProfile } = useAuth();

  const { data: students = [] } = useListStudents();
  const { data: todayAttendance = [] } = useListAttendance({ date: today });
  const { data: exams = [] } = useListExams();
  const { data: notices = [] } = useListNotices();
  const { data: homework = [] } = useListHomework();
  const { data: routine = [] } = useListRoutine();

  const presentToday = (todayAttendance as any[]).filter((a) => a.status === "present").length;
  const absentToday = (todayAttendance as any[]).filter((a) => a.status === "absent").length;
  const attendanceMarked = (todayAttendance as any[]).length;
  const attendancePct =
    (students as any[]).length > 0
      ? Math.round((presentToday / (students as any[]).length) * 100)
      : 0;

  const upcomingExams = (exams as any[])
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  const recentNotices = (notices as any[]).slice(0, 4);

  // Today's classes from routine
  const todayClasses = (routine as any[])
    .filter((r) => r.day === todayKey)
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));

  // Recent homework (last 4)
  const recentHomework = (homework as any[]).slice(0, 4);

  // Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "শুভ সকাল" : hour < 17 ? "শুভ অপরাহ্ন" : "শুভ সন্ধ্যা";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {userProfile?.name?.split(" ")[0] ?? "শিক্ষক"}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("bn-BD", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {DAY_LABELS[todayKey]}
          </p>
        </div>
        {/* Quick action row — primary CTA */}
        <div className="flex gap-2 flex-wrap">
          <Button asChild size="sm" className="gap-1.5 shadow-sm">
            <Link href="/attendance">
              <CalendarCheck className="h-4 w-4" />
              Attendance নিন
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/students">
              <Users className="h-4 w-4" />
              Students
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Students */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              মোট Students
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(students as any[]).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/students" className="hover:underline inline-flex items-center gap-0.5">
                সব দেখুন <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600" />
        </Card>

        {/* Today's Attendance */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              আজকের Attendance
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CalendarCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentToday}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {attendanceMarked > 0 ? `${attendancePct}% উপস্থিত` : "এখনো নেওয়া হয়নি"}
              </p>
              {attendanceMarked < (students as any[]).length && (students as any[]).length > 0 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-amber-300 text-amber-600">
                  অসম্পূর্ণ
                </Badge>
              )}
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-600" />
        </Card>

        {/* Upcoming Exams */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              আসন্ন Exams
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {upcomingExams[0] ? `পরবর্তী: ${upcomingExams[0].date}` : "কোনো exam নেই"}
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-violet-600" />
        </Card>

        {/* Homework */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Homework
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <NotebookPen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(homework as any[]).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/homework" className="hover:underline inline-flex items-center gap-0.5">
                পরিচালনা করুন <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
        </Card>
      </div>

      {/* Main Grid: Today's Classes + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">

        {/* Today's Classes */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-500" />
                আজকের ক্লাস
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {DAY_LABELS[todayKey]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-25" />
                <p className="text-sm">আজ কোনো ক্লাস নেই</p>
                <Button asChild variant="outline" size="sm" className="mt-3 gap-1">
                  <Link href="/routine">
                    Routine দেখুন <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayClasses.map((cls: any) => {
                  const now = new Date();
                  const [sh, sm] = (cls.startTime ?? "00:00").split(":").map(Number);
                  const [eh, em] = (cls.endTime ?? "23:59").split(":").map(Number);
                  const startMins = sh * 60 + sm;
                  const endMins = eh * 60 + em;
                  const nowMins = now.getHours() * 60 + now.getMinutes();
                  const isOngoing = nowMins >= startMins && nowMins <= endMins;
                  const isDone = nowMins > endMins;

                  return (
                    <div
                      key={cls.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                        isOngoing
                          ? "border-cyan-300 bg-cyan-50 dark:bg-cyan-900/20 dark:border-cyan-700"
                          : isDone
                          ? "border-border opacity-60"
                          : "border-border"
                      }`}
                    >
                      <div className="min-w-[54px] text-center">
                        <p className="text-xs font-semibold text-foreground">
                          {cls.startTime ?? "—"}
                        </p>
                        {cls.endTime && (
                          <p className="text-[10px] text-muted-foreground">{cls.endTime}</p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {cls.subject || cls.className || cls.name || "Class"}
                        </p>
                        {cls.teacher && (
                          <p className="text-xs text-muted-foreground truncate">{cls.teacher}</p>
                        )}
                        {cls.batch && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5 mt-1">
                            {cls.batch}
                          </Badge>
                        )}
                      </div>
                      {isOngoing && (
                        <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] shrink-0">
                          চলছে
                        </Badge>
                      )}
                      {isDone && (
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                      )}
                    </div>
                  );
                })}
                <Button asChild variant="ghost" size="sm" className="w-full mt-1 gap-1 text-muted-foreground">
                  <Link href="/routine">
                    সম্পূর্ণ Routine <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column: Attendance Progress + Quick Actions */}
        <div className="space-y-4">

          {/* Attendance Progress Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                আজকের Attendance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(students as any[]).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  কোনো student নেই
                </p>
              ) : (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>{attendanceMarked} / {(students as any[]).length} marked</span>
                      <span className="font-medium text-foreground">{attendancePct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{ width: `${attendancePct}%` }}
                      />
                    </div>
                  </div>
                  {/* Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-2">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">{presentToday}</p>
                      <p className="text-[10px] text-green-700 dark:text-green-500">উপস্থিত</p>
                    </div>
                    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2">
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{absentToday}</p>
                      <p className="text-[10px] text-red-700 dark:text-red-500">অনুপস্থিত</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
                      <p className="text-lg font-bold text-muted-foreground">
                        {(students as any[]).length - attendanceMarked}
                      </p>
                      <p className="text-[10px] text-muted-foreground">বাকি</p>
                    </div>
                  </div>
                  <Button asChild className="w-full gap-2" size="sm">
                    <Link href="/attendance">
                      <CalendarCheck className="h-4 w-4" />
                      Attendance নিন
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/attendance", icon: CalendarCheck, label: "Attendance", color: "text-green-500" },
                  { href: "/students", icon: Users, label: "Students", color: "text-blue-500" },
                  { href: "/exams", icon: ClipboardList, label: "Exams", color: "text-purple-500" },
                  { href: "/homework", icon: NotebookPen, label: "Homework", color: "text-amber-500" },
                  { href: "/routine", icon: Clock, label: "Routine", color: "text-cyan-500" },
                  { href: "/notices", icon: Bell, label: "Notices", color: "text-rose-500" },
                ].map(({ href, icon: Icon, label, color }) => (
                  <Button
                    key={href}
                    asChild
                    variant="outline"
                    className="h-auto py-3 flex-col gap-1.5 hover:border-primary/30 hover:bg-accent/50 transition-all"
                  >
                    <Link href={href}>
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-xs font-medium">{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Grid: Homework + Upcoming Exams + Notices */}
      <div className="grid gap-4 md:grid-cols-3">

        {/* Recent Homework */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-amber-500" />
                সাম্প্রতিক Homework
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                <Link href="/homework">
                  সব <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentHomework.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">কোনো homework নেই</p>
            ) : (
              <div className="space-y-2">
                {recentHomework.map((hw: any) => (
                  <div key={hw.id} className="p-2 rounded-lg border hover:bg-accent/30 transition-colors">
                    <p className="font-medium text-sm truncate">{hw.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {hw.subject && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {hw.subject}
                        </Badge>
                      )}
                      {hw.dueDate && (
                        <span className="text-[10px] text-muted-foreground">{hw.dueDate}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-purple-500" />
                আসন্ন Exams
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                <Link href="/exams">
                  সব <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingExams.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">কোনো আসন্ন exam নেই</p>
            ) : (
              <div className="space-y-2">
                {upcomingExams.map((e: any) => {
                  const daysLeft = Math.ceil(
                    (new Date(e.date).getTime() - new Date(today).getTime()) / 86400000
                  );
                  return (
                    <div key={e.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{e.title}</p>
                        {e.subject && (
                          <p className="text-xs text-muted-foreground">{e.subject}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="text-xs font-medium">{e.date}</p>
                        <p className={`text-[10px] ${daysLeft <= 3 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                          {daysLeft === 0 ? "আজ!" : `${daysLeft} দিন`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-rose-500" />
                সাম্প্রতিক Notices
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                <Link href="/notices">
                  সব <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentNotices.length === 0 ? (
              <div className="py-4 text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-1.5 opacity-25" />
                <p className="text-sm text-muted-foreground">কোনো notice নেই</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotices.map((n: any) => (
                  <div key={n.id} className="p-2 rounded-lg border hover:bg-accent/30 transition-colors">
                    <p className="font-medium text-sm truncate">{n.title}</p>
                    {n.content && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.content}</p>
                    )}
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
