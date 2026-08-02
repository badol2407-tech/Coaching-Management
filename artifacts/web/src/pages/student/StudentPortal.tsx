import { useEffect } from "react";
import { useSearch } from "wouter";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  NotebookPen,
  Settings,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  useListExams,
  useListHomework,
  useListNotices,
  useListRoutine,
  useMarkExamSeen,
  useMarkFeeSeen,
  useMarkHomeworkSeen,
  useMarkNoticeSeen,
  useMarkRoutineSeen,
  useMyAttendance,
  useMyFees,
  useMyResults,
  useMyStudentRecord,
  filterByMyClassAndBatch,
} from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DAYS: Record<string, string> = {
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

function statusBadge(status: string) {
  const label = status === "present" ? "Present" : status === "late" ? "Late" : "Absent";
  return <Badge variant={status === "present" ? "secondary" : status === "late" ? "outline" : "destructive"}>{label}</Badge>;
}

export default function StudentPortal() {
  const { userProfile } = useAuth();
  const search = useSearch();
  const requestedTab = new URLSearchParams(search).get("tab") ?? "dashboard";
  const activeTab = requestedTab === "notices"
    ? "notifications"
    : requestedTab === "routine"
      ? "courses"
      : requestedTab === "homework"
        ? "assignments"
        : requestedTab;

  const { data: fees = [], isLoading: feesLoading } = useMyFees();
  const { data: attendance = [], isLoading: attendanceLoading } = useMyAttendance();
  const { data: results = [], isLoading: resultsLoading } = useMyResults();
  const { data: myStudent } = useMyStudentRecord();
  const { data: allExams = [], isLoading: examsLoading } = useListExams();
  const { data: allRoutine = [], isLoading: routineLoading } = useListRoutine();
  const { data: allNotices = [], isLoading: noticesLoading } = useListNotices();
  const { data: allHomework = [], isLoading: homeworkLoading } = useListHomework();

  const exams = filterByMyClassAndBatch(allExams as any[], myStudent?.className ?? null, myStudent?.batch ?? null);
  const routine = filterByMyClassAndBatch(allRoutine as any[], myStudent?.className ?? null, myStudent?.batch ?? null);
  const notices = filterByMyClassAndBatch(allNotices as any[], myStudent?.className ?? null, myStudent?.batch ?? null);
  const homework = filterByMyClassAndBatch(allHomework as any[], myStudent?.className ?? null, myStudent?.batch ?? null);

  const markNoticeSeen = useMarkNoticeSeen();
  const markHomeworkSeen = useMarkHomeworkSeen();
  const markRoutineSeen = useMarkRoutineSeen();
  const markExamSeen = useMarkExamSeen();
  const markFeeSeen = useMarkFeeSeen();

  useEffect(() => {
    if (activeTab === "notifications") notices.forEach((notice: any) => markNoticeSeen.mutate({ noticeId: notice.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, notices.length]);

  useEffect(() => {
    if (activeTab === "assignments") homework.forEach((assignment: any) => markHomeworkSeen.mutate({ homeworkId: assignment.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, homework.length]);

  useEffect(() => {
    if (activeTab === "courses") routine.forEach((slot: any) => markRoutineSeen.mutate({ slotId: slot.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, routine.length]);

  useEffect(() => {
    if (activeTab === "exams") exams.forEach((exam: any) => markExamSeen.mutate({ examId: exam.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, exams.length]);

  useEffect(() => {
    if (activeTab === "fees") fees.forEach((fee: any) => markFeeSeen.mutate({ feeId: fee.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, fees.length]);

  const pendingFees = (fees as any[]).filter((fee) => fee.status === "pending");
  const presentDays = (attendance as any[]).filter((record) => record.status === "present").length;
  const totalDays = (attendance as any[]).length;
  const go = (tab: string) => {
    window.history.pushState({}, "", tab === "dashboard" ? "/" : `/?tab=${tab}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  const examTitle = (examId: string) => (exams as any[]).find((exam) => exam.id === examId)?.title ?? examId;
  const titles: Record<string, string> = {
    dashboard: "Overview",
    attendance: "Attendance",
    courses: "Courses",
    assignments: "Assignments",
    exams: "Exams",
    results: "Results",
    fees: "Fees",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
  };

  let content: React.ReactNode;

  if (activeTab === "dashboard") {
    content = (
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex items-start justify-between gap-4 p-6">
              <div>
                <p className="text-sm opacity-80">Your academic command center</p>
                <h2 className="mt-2 text-2xl font-semibold">Good to see you, {userProfile?.name || "Student"}.</h2>
                <p className="mt-2 max-w-lg text-sm opacity-80">Review what needs your attention, then continue where you left off.</p>
              </div>
              <BookOpen className="h-8 w-8 shrink-0 opacity-80" aria-hidden="true" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Needs attention</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <button
                type="button"
                onClick={() => go("fees")}
                className="flex min-h-11 w-full items-center justify-between rounded-md p-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />Pending fees</span>
                <span className="font-semibold">{pendingFees.length}</span>
              </button>
              <button
                type="button"
                onClick={() => go("assignments")}
                className="flex min-h-11 w-full items-center justify-between rounded-md p-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" />Assignments</span>
                <span className="font-semibold">{homework.length}</span>
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Attendance", value: totalDays ? `${Math.round((presentDays / totalDays) * 100)}%` : "—", detail: `${presentDays} of ${totalDays} days`, icon: CalendarCheck, tab: "attendance" },
            { label: "Pending fees", value: `৳${pendingFees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}`, detail: `${pendingFees.length} records`, icon: Wallet, tab: "fees" },
            { label: "Results", value: String((results as any[]).length), detail: "Published results", icon: ClipboardList, tab: "results" },
            { label: "Notifications", value: String(notices.length), detail: "Class updates", icon: Bell, tab: "notifications" },
          ].map(({ label, value, detail, icon: Icon, tab }) => (
            <button
              key={label}
              type="button"
              onClick={() => go(tab)}
              className="rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-colors hover:bg-accent">
                <CardContent className="flex items-start justify-between p-5">
                  <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Upcoming work</CardTitle></CardHeader>
            <CardContent>
              {homework.length ? homework.slice(0, 3).map((assignment: any) => (
                <div key={assignment.id} className="flex items-center justify-between gap-3 border-b py-3 last:border-0">
                  <div className="min-w-0"><p className="truncate font-medium">{assignment.title}</p><p className="text-sm text-muted-foreground">{assignment.subject || "Course work"}</p></div>
                  <Badge variant="outline">{assignment.dueDate || "Open"}</Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">No assignments are currently listed.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Latest notices</CardTitle></CardHeader>
            <CardContent>
              {notices.length ? notices.slice(0, 3).map((notice: any) => (
                <div key={notice.id} className="border-b py-3 last:border-0"><p className="font-medium">{notice.title}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{notice.content}</p></div>
              )) : <p className="text-sm text-muted-foreground">No new notices are available.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } else if (activeTab === "fees") {
    content = feesLoading ? (
      <div className="grid gap-3" aria-label="Loading fees" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : (
      <Card>
        <CardHeader><CardTitle>Fees</CardTitle></CardHeader>
        <CardContent>
          {fees.length ? (
            <>
              <div className="hidden md:block">
                <Table><TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Paid at</TableHead></TableRow></TableHeader><TableBody>
                  {(fees as any[]).map((fee) => <TableRow key={fee.id}><TableCell>{fee.month || "—"}</TableCell><TableCell>৳{fee.amount.toLocaleString()}</TableCell><TableCell><Badge variant={fee.status === "paid" ? "secondary" : "destructive"}>{fee.status === "paid" ? "Paid" : "Pending"}</Badge></TableCell><TableCell>{fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : "—"}</TableCell></TableRow>)}
                </TableBody></Table>
              </div>
              <div className="grid gap-3 md:hidden">
                {(fees as any[]).map((fee) => <Card key={fee.id}><CardContent className="grid gap-2 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium">{fee.month || "Fee record"}</p><Badge variant={fee.status === "paid" ? "secondary" : "destructive"}>{fee.status === "paid" ? "Paid" : "Pending"}</Badge></div><p className="text-lg font-semibold">৳{fee.amount.toLocaleString()}</p><p className="text-sm text-muted-foreground">{fee.paidAt ? `Paid ${new Date(fee.paidAt).toLocaleDateString()}` : "Payment pending"}</p></CardContent></Card>)}
              </div>
            </>
          ) : <p className="py-8 text-center text-sm text-muted-foreground">No fee records available.</p>}
        </CardContent>
      </Card>
    );
  } else if (activeTab === "attendance") {
    content = attendanceLoading ? (
      <div className="grid gap-3" aria-label="Loading attendance" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : (
      <Card>
        <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
        <CardContent>
          {attendance.length ? (
            <>
              <div className="hidden md:block">
                <Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
                  {(attendance as any[]).map((record) => <TableRow key={record.id}><TableCell>{record.date}</TableCell><TableCell>{statusBadge(record.status)}</TableCell></TableRow>)}
                </TableBody></Table>
              </div>
              <div className="grid gap-3 md:hidden">
                {(attendance as any[]).map((record) => <Card key={record.id}><CardContent className="flex items-center justify-between gap-3 p-4"><p className="font-medium">{record.date}</p>{statusBadge(record.status)}</CardContent></Card>)}
              </div>
            </>
          ) : <p className="py-8 text-center text-sm text-muted-foreground">No attendance records available.</p>}
        </CardContent>
      </Card>
    );
  } else if (activeTab === "results") {
    content = resultsLoading ? (
      <div className="grid gap-3" aria-label="Loading results" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : (
      <Card>
        <CardHeader><CardTitle>Results</CardTitle></CardHeader>
        <CardContent>
          {results.length ? (
            <>
              <div className="hidden md:block">
                <Table><TableHeader><TableRow><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Percentage</TableHead></TableRow></TableHeader><TableBody>
                  {(results as any[]).map((result) => { const exam = exams.find((item: any) => item.id === result.examId); const percentage = exam ? Math.round((result.marksObtained / exam.totalMarks) * 100) : null; return <TableRow key={result.id}><TableCell>{examTitle(result.examId)}</TableCell><TableCell>{result.marksObtained}{exam ? ` / ${exam.totalMarks}` : ""}</TableCell><TableCell><Badge variant="outline">{result.grade ?? "—"}</Badge></TableCell><TableCell>{percentage === null ? "—" : `${percentage}%`}</TableCell></TableRow>; })}
                </TableBody></Table>
              </div>
              <div className="grid gap-3 md:hidden">
                {(results as any[]).map((result) => { const exam = exams.find((item: any) => item.id === result.examId); const percentage = exam ? Math.round((result.marksObtained / exam.totalMarks) * 100) : null; return <Card key={result.id}><CardContent className="grid gap-2 p-4"><div className="flex items-center justify-between gap-3"><p className="font-medium">{examTitle(result.examId)}</p><Badge variant="outline">{result.grade ?? "—"}</Badge></div><p className="text-lg font-semibold">{result.marksObtained}{exam ? ` / ${exam.totalMarks}` : ""}</p><p className="text-sm text-muted-foreground">{percentage === null ? "Percentage unavailable" : `${percentage}%`}</p></CardContent></Card>; })}
              </div>
            </>
          ) : <p className="py-8 text-center text-sm text-muted-foreground">No results available.</p>}
        </CardContent>
      </Card>
    );
  } else if (activeTab === "courses") {
    content = routineLoading ? (
      <div className="grid gap-3" aria-label="Loading courses" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : routine.length ? (
      <div className="space-y-6">
        {Object.entries((routine as any[]).reduce((grouped: Record<string, any[]>, slot) => { const day = slot.day?.toLowerCase() || "other"; (grouped[day] ||= []).push(slot); return grouped; }, {})).map(([day, slots]) => (
          <section key={day} aria-labelledby={`course-day-${day}`}><h2 id={`course-day-${day}`} className="mb-3 text-lg font-semibold">{DAYS[day] || day}</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(slots as any[]).map((slot) => <Card key={slot.id}><CardContent className="space-y-2 p-4"><p className="font-medium">{slot.subject || slot.className || "Course"}</p>{slot.teacher && <p className="text-sm text-muted-foreground">{slot.teacher}</p>}<p className="flex items-center gap-2 text-sm text-primary"><Clock className="h-4 w-4" aria-hidden="true" />{slot.startTime || "Schedule"}{slot.endTime && ` – ${slot.endTime}`}</p>{slot.room && <Badge variant="outline">{slot.room}</Badge>}</CardContent></Card>)}
          </div></section>
        ))}
      </div>
    ) : <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center"><BookOpen className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">No courses scheduled</p><p className="max-w-md text-sm text-muted-foreground">Your class routine will appear here when it is available.</p></CardContent></Card>;
  } else if (activeTab === "assignments") {
    content = homeworkLoading ? (
      <div className="grid gap-3" aria-label="Loading assignments" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : homework.length ? (
      <div className="grid gap-3">{(homework as any[]).map((assignment) => <Card key={assignment.id}><CardContent className="space-y-2 p-5"><div className="flex flex-wrap items-start justify-between gap-2"><h2 className="font-semibold">{assignment.title}</h2>{assignment.subject && <Badge variant="secondary">{assignment.subject}</Badge>}</div><p className="text-sm text-muted-foreground">{assignment.description}</p>{assignment.dueDate && <p className="flex items-center gap-2 text-sm text-primary"><CalendarClock className="h-4 w-4" aria-hidden="true" />Due {assignment.dueDate}</p>}</CardContent></Card>)}</div>
    ) : <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center"><NotebookPen className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">No assignments listed</p><p className="max-w-md text-sm text-muted-foreground">New homework and coursework will appear here.</p></CardContent></Card>;
  } else if (activeTab === "exams") {
    content = examsLoading ? (
      <div className="grid gap-3" aria-label="Loading exams" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : exams.length ? (
      <div className="grid gap-3 sm:grid-cols-2">{(exams as any[]).map((exam) => <Card key={exam.id}><CardContent className="space-y-2 p-5"><h2 className="font-semibold">{exam.title}</h2><p className="text-sm text-muted-foreground">{exam.date || "Date to be announced"}</p><Badge variant="outline">{exam.totalMarks} marks</Badge></CardContent></Card>)}</div>
    ) : <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center"><CalendarDays className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">No exams scheduled</p><p className="max-w-md text-sm text-muted-foreground">Exam dates will appear here when they are published.</p></CardContent></Card>;
  } else if (activeTab === "notifications") {
    content = noticesLoading ? (
      <div className="grid gap-3" aria-label="Loading notifications" aria-busy="true">{[1, 2, 3].map((key) => <div key={key} className="h-16 rounded-lg bg-muted animate-pulse" />)}</div>
    ) : notices.length ? (
      <div className="grid gap-3">{(notices as any[]).map((notice) => <Card key={notice.id}><CardContent className="space-y-2 p-5"><h2 className="font-semibold">{notice.title}</h2><p className="text-sm text-muted-foreground">{notice.content}</p><p className="text-xs text-muted-foreground">{new Date(notice.createdAt).toLocaleDateString()}</p></CardContent></Card>)}</div>
    ) : <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center"><Bell className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">You are all caught up</p><p className="max-w-md text-sm text-muted-foreground">Class notices and important updates will appear here.</p></CardContent></Card>;
  } else if (activeTab === "profile") {
    content = <Card><CardHeader><CardTitle>Profile</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><div><p className="text-sm text-muted-foreground">Name</p><p className="mt-1 font-medium">{userProfile?.name || "—"}</p></div><div><p className="text-sm text-muted-foreground">Email</p><p className="mt-1 font-medium break-words">{userProfile?.email || "—"}</p></div><div><p className="text-sm text-muted-foreground">Student ID</p><p className="mt-1 font-medium">{userProfile?.studentId || "—"}</p></div><div><p className="text-sm text-muted-foreground">Organization</p><p className="mt-1 font-medium">{userProfile?.orgName || "—"}</p></div><div><p className="text-sm text-muted-foreground">Class</p><p className="mt-1 font-medium">{myStudent?.className || "—"}</p></div><div><p className="text-sm text-muted-foreground">Batch</p><p className="mt-1 font-medium">{myStudent?.batch || "—"}</p></div></CardContent></Card>;
  } else if (activeTab === "settings") {
    content = <Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent className="space-y-4"><div><p className="font-medium">Account access</p><p className="mt-1 text-sm text-muted-foreground">Your student account is managed by your organization. Contact an administrator when account details need to change.</p></div><div className="rounded-lg border bg-muted/30 p-4"><div className="flex items-start gap-3"><Settings className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" /><div><p className="font-medium">Student account</p><p className="mt-1 text-sm text-muted-foreground">Signed in as {userProfile?.email || "your account"}.</p></div></div></div></CardContent></Card>;
  } else {
    content = <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center"><CheckCircle2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" /><p className="font-medium">Page not found</p><p className="max-w-md text-sm text-muted-foreground">Choose a destination from the student navigation.</p></CardContent></Card>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Student portal</p>
          <h1 id="student-page-title" className="mt-1 text-2xl font-semibold tracking-tight">{titles[activeTab] || "Overview"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{myStudent?.className ? `${myStudent.className}${myStudent.batch ? ` · ${myStudent.batch}` : ""}` : userProfile?.email}</p>
        </div>
        {activeTab === "dashboard" && <Button variant="outline" onClick={() => go("notifications")}><Bell aria-hidden="true" />View notifications<ArrowUpRight aria-hidden="true" /></Button>}
      </header>
      <section aria-labelledby="student-page-title" aria-live="polite">{content}</section>
    </div>
  );
}