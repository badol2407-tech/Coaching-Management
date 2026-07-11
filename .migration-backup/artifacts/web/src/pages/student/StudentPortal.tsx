import { useState, useEffect } from "react";
import { useMyFees, useMyAttendance, useMyResults, useListExams, useListRoutine, useListNotices, useMarkNoticeSeen, useListHomework, useMarkHomeworkSeen } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, CalendarCheck, ClipboardList, Clock, CalendarDays, Bell, NotebookPen, CalendarClock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function statusBadge(status: string) {
  if (status === "present") return <Badge className="bg-green-100 text-green-700 border-green-200">উপস্থিত</Badge>;
  if (status === "late") return <Badge className="bg-amber-100 text-amber-700 border-amber-200">দেরিতে</Badge>;
  return <Badge className="bg-red-100 text-red-700 border-red-200">অনুপস্থিত</Badge>;
}

const DAYS_BN: Record<string, string> = {
  saturday: "শনিবার", sunday: "রবিবার", monday: "সোমবার",
  tuesday: "মঙ্গলবার", wednesday: "বুধবার", thursday: "বৃহস্পতিবার", friday: "শুক্রবার",
};

export default function StudentPortal() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("fees");

  const { data: fees = [], isLoading: feesLoading } = useMyFees();
  const { data: attendance = [], isLoading: attLoading } = useMyAttendance();
  const { data: results = [], isLoading: resLoading } = useMyResults();
  const { data: exams = [] } = useListExams();
  const { data: routine = [], isLoading: routineLoading } = useListRoutine();
  const { data: notices = [], isLoading: noticesLoading } = useListNotices();
  const { data: homework = [], isLoading: hwLoading } = useListHomework();
  const markNoticeSeen = useMarkNoticeSeen();
  const markHwSeen = useMarkHomeworkSeen();

  // Auto-mark all notices as seen when student opens the Notices tab
  useEffect(() => {
    if (activeTab === "notices" && (notices as any[]).length > 0) {
      (notices as any[]).forEach((n: any) => {
        markNoticeSeen.mutate({ noticeId: n.id });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, (notices as any[]).length]);

  // Auto-mark all homework as seen when student opens the Homework tab
  useEffect(() => {
    if (activeTab === "homework" && (homework as any[]).length > 0) {
      (homework as any[]).forEach((hw: any) => {
        markHwSeen.mutate({ homeworkId: hw.id });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, (homework as any[]).length]);

  const paidFees = (fees as any[]).filter((f) => f.status === "paid");
  const pendingFees = (fees as any[]).filter((f) => f.status === "pending");
  const presentDays = (attendance as any[]).filter((a) => a.status === "present").length;
  const totalDays = (attendance as any[]).length;

  function getExamTitle(examId: string) {
    return (exams as any[]).find((e) => e.id === examId)?.title ?? examId;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">আমার Dashboard</h1>
        <p className="text-muted-foreground">{userProfile?.name || userProfile?.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">বকেয়া Fees</CardTitle>
            <Wallet className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ৳{pendingFees.reduce((s, f) => s + f.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{pendingFees.length} টি বাকি</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">উপস্থিতি</CardTitle>
            <CalendarCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : "—"}
            </div>
            <p className="text-xs text-muted-foreground">{presentDays}/{totalDays} দিন</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Results</CardTitle>
            <ClipboardList className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(results as any[]).length}</div>
            <p className="text-xs text-muted-foreground">মোট exam result</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Premium Sticky Tab Bar ── */}
      <div
        className="sticky top-14 z-30 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-2"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1a0533 50%, #0f172a 100%)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(168,85,247,0.12)",
          borderBottom: "1px solid rgba(168,85,247,0.15)",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent pointer-events-none" />
        <nav className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "fees",       label: "Fees",       icon: Wallet,       badge: 0 },
            { id: "attendance", label: "Attendance", icon: CalendarCheck, badge: 0 },
            { id: "results",    label: "Results",    icon: ClipboardList, badge: 0 },
            { id: "routine",    label: "Routine",    icon: CalendarDays,  badge: 0 },
            { id: "homework",   label: "Homework",   icon: NotebookPen,   badge: (homework as any[]).length },
            { id: "notices",    label: "Notices",    icon: Bell,          badge: (notices as any[]).length },
          ].map(({ id, label, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0"
                style={active ? {
                  background: "linear-gradient(135deg, rgba(168,85,247,0.28) 0%, rgba(139,92,246,0.18) 100%)",
                  color: "#d8b4fe",
                  border: "1px solid rgba(168,85,247,0.4)",
                  boxShadow: "0 0 14px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                } : {
                  color: "rgba(148,163,184,0.8)",
                  border: "1px solid transparent",
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{label}</span>
                {badge > 0 && (
                  <span
                    className="ml-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={active
                      ? { background: "rgba(168,85,247,0.6)", color: "#f3e8ff" }
                      : { background: "rgba(99,102,241,0.5)", color: "#c7d2fe" }
                    }
                  >
                    {badge}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Tab content panels ── */}
      <div className="mt-4">

      {activeTab === "fees" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feesLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">লোড হচ্ছে...</TableCell></TableRow>
                  ) : (fees as any[]).length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">কোনো fee record নেই</TableCell></TableRow>
                  ) : (
                    (fees as any[]).map((f: any) => (
                      <TableRow key={f.id}>
                        <TableCell>{f.month || "—"}</TableCell>
                        <TableCell className="font-medium">৳{f.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={f.status === "paid" ? "default" : "destructive"}>
                            {f.status === "paid" ? "পরিশোধিত" : "বাকি"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {f.paidAt ? new Date(f.paidAt).toLocaleDateString("bn-BD") : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      )}

      {activeTab === "attendance" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>তারিখ</TableHead>
                    <TableHead>অবস্থা</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attLoading ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-8">লোড হচ্ছে...</TableCell></TableRow>
                  ) : (attendance as any[]).length === 0 ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">কোনো attendance record নেই</TableCell></TableRow>
                  ) : (
                    (attendance as any[]).map((a: any) => (
                      <TableRow key={a.id}>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{statusBadge(a.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      )}

      {activeTab === "results" && (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">লোড হচ্ছে...</TableCell></TableRow>
                  ) : (results as any[]).length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">কোনো result নেই</TableCell></TableRow>
                  ) : (
                    (results as any[]).map((r: any) => {
                      const exam = (exams as any[]).find((e) => e.id === r.examId);
                      const pct = exam ? Math.round((r.marksObtained / exam.totalMarks) * 100) : null;
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{getExamTitle(r.examId)}</TableCell>
                          <TableCell>{r.marksObtained}{exam ? ` / ${exam.totalMarks}` : ""}</TableCell>
                          <TableCell><Badge variant="outline">{r.grade ?? "—"}</Badge></TableCell>
                          <TableCell>{pct !== null ? `${pct}%` : "—"}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      )}

      {activeTab === "routine" && (
        routineLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((k) => <div key={k} className="h-20 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : (routine as any[]).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">এখনো কোনো routine তৈরি হয়নি</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(
              (routine as any[]).reduce((acc: Record<string, any[]>, slot: any) => {
                const day = slot.day?.toLowerCase() ?? "other";
                if (!acc[day]) acc[day] = [];
                acc[day].push(slot);
                return acc;
              }, {})
            ).map(([day, slots]) => (
              <div key={day}>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  {DAYS_BN[day] ?? day}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(slots as any[]).map((slot: any) => (
                    <Card key={slot.id} className="border-l-4 border-l-primary/60">
                      <CardContent className="py-3 px-4 space-y-1">
                        <p className="font-medium text-sm">{slot.subject ?? slot.className ?? "—"}</p>
                        {slot.teacher && <p className="text-xs text-muted-foreground">{slot.teacher}</p>}
                        {(slot.startTime || slot.endTime) && (
                          <div className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Clock className="h-3 w-3" />
                            {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                          </div>
                        )}
                        {slot.room && <Badge variant="outline" className="text-xs">{slot.room}</Badge>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "homework" && (
        hwLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((k) => <div key={k} className="h-20 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : (homework as any[]).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <NotebookPen className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">এখনো কোনো homework দেওয়া হয়নি</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {(homework as any[]).map((hw: any) => (
              <Card key={hw.id} className="border-l-4 border-l-primary/60">
                <CardHeader className="pb-1 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold leading-snug">{hw.title}</CardTitle>
                    {hw.subject && <Badge variant="secondary" className="text-xs shrink-0">{hw.subject}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-1.5">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{hw.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                    <span>{new Date(hw.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}</span>
                    {hw.dueDate && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Due: {hw.dueDate}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {activeTab === "notices" && (
        noticesLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((k) => <div key={k} className="h-20 rounded-lg bg-muted animate-pulse" />)}
          </div>
        ) : (notices as any[]).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">এখনো কোনো notice নেই</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {(notices as any[]).map((n: any) => (
              <Card key={n.id} className="border-l-4 border-l-primary/60">
                <CardHeader className="pb-1 pt-4">
                  <CardTitle className="text-sm font-semibold">{n.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 space-y-1">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.content}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {new Date(n.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      </div>
    </div>
  );
}
