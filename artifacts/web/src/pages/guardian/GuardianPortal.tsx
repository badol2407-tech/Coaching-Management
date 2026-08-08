import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  ArrowUpRight, Bell, BookOpen, CalendarCheck, CalendarClock, CheckCircle2,
  ChevronRight, Clock3, FileText, GraduationCap, MessageCircle, Moon, Send, ShieldCheck,
  Sparkles, WalletCards,
} from "lucide-react";
import {
  filterByMyClassAndBatch, useListExams, useListHomework, useListNotices,
  useListRoutine, useMyAttendance, useMyFees, useMyResults, useMyStudentRecord,
} from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const money = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const dateLabel = (v?: string) => v ? new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Date pending";

function Empty({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return <div className="guardian-empty"><Icon /><b>{title}</b><span>{text}</span></div>;
}

export default function GuardianPortal() {
  const { userProfile } = useAuth();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const tab = new URLSearchParams(search).get("tab") || "dashboard";
  const [leaveSent, setLeaveSent] = useState(false);
  const { data: child } = useMyStudentRecord();
  const { data: attendance = [], isLoading: attendanceLoading } = useMyAttendance();
  const { data: fees = [], isLoading: feesLoading } = useMyFees();
  const { data: results = [] } = useMyResults();
  const { data: allExams = [] } = useListExams();
  const { data: allRoutine = [] } = useListRoutine();
  const { data: allNotices = [], isLoading: noticesLoading } = useListNotices();
  const { data: allHomework = [] } = useListHomework();
  const exams = filterByMyClassAndBatch(allExams as any[], child?.className, child?.batch);
  const routine = filterByMyClassAndBatch(allRoutine as any[], child?.className, child?.batch);
  const notices = filterByMyClassAndBatch(allNotices as any[], child?.className, child?.batch);
  const homework = filterByMyClassAndBatch(allHomework as any[], child?.className, child?.batch);
  const present = (attendance as any[]).filter(r => r.status === "present" || r.status === "late").length;
  const attendancePct = attendance.length ? Math.round(present / attendance.length * 100) : 0;
  const pending = (fees as any[]).filter(f => f.status !== "paid");
  const outstanding = pending.reduce((s, f) => s + Number(f.amount || 0) - Number(f.totalPaid || 0), 0);
  const studentName = child?.name || userProfile?.name || "Your child";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const title = ({ dashboard: "Today’s family brief", attendance: "Attendance", results: "Exam results", routine: "Weekly routine", notices: "School notices", fees: "Fees & payments", homework: "Homework", messages: "Teacher messages", leave: "Leave requests", profile: "Family profile", settings: "Portal settings" } as Record<string, string>)[tab] || "Today’s family brief";

  const recent = useMemo(() => [
    ...notices.slice(0, 2).map((n: any) => ({ kind: "Notice", title: n.title, date: n.createdAt, icon: Bell })),
    ...homework.slice(0, 2).map((n: any) => ({ kind: "Homework", title: n.title, date: n.dueDate, icon: BookOpen })),
  ].slice(0, 4), [notices, homework]);

  const header = <header className="guardian-page-head"><div><span className="guardian-eyebrow">Private family brief · {today}</span><h1>{title}</h1><p>{child?.className ? `${studentName} · ${child.className}${child.batch ? ` · ${child.batch}` : ""}` : `A calm view of ${studentName}'s school day.`}</p></div><div className="guardian-trust"><ShieldCheck /><span><b>Connected</b><small>School records are up to date</small></span></div></header>;

  let body: React.ReactNode;
  if (tab === "dashboard") body = <div className="guardian-content">
    <section className="guardian-welcome glass-panel"><div><span className="guardian-eyebrow"><Sparkles /> Good morning</span><h2>Everything important,<br /><em>in one gentle glance.</em></h2><p>Here’s what’s happening around {studentName} today.</p></div><div className="guardian-orbit"><div><b>{attendancePct || "—"}%</b><span>attendance</span></div></div></section>
    <div className="guardian-stat-grid">
    <button className="guardian-stat glass-panel" onClick={() => setLocation("/guardian?tab=attendance")}><span className="guardian-stat-icon teal"><CalendarCheck /></span><small>Attendance</small><strong>{attendance.length ? `${attendancePct}%` : "—"}</strong><span className="guardian-stat-foot">{present} attended days <ArrowUpRight /></span></button>
      <button className="guardian-stat glass-panel" onClick={() => setLocation("/guardian?tab=fees")}><span className="guardian-stat-icon amber"><WalletCards /></span><small>Outstanding fees</small><strong>{money(outstanding)}</strong><span className="guardian-stat-foot">{pending.length ? `${pending.length} payment${pending.length > 1 ? "s" : ""} due` : "All clear"} <ArrowUpRight /></span></button>
      <button className="guardian-stat glass-panel" onClick={() => setLocation("/guardian?tab=homework")}><span className="guardian-stat-icon coral"><BookOpen /></span><small>Homework</small><strong>{homework.length}</strong><span className="guardian-stat-foot">items this week <ArrowUpRight /></span></button>
    </div>
     <div className="guardian-columns"><Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">At a glance</span><h3>Coming up</h3></div><Button variant="ghost" size="sm" onClick={() => setLocation("/guardian?tab=routine")}>View routine <ChevronRight /></Button></div>{routine.length ? routine.slice(0, 3).map((r: any) => <div className="guardian-list-row" key={r.id}><span className="guardian-time">{r.startTime || "—"}</span><span><b>{r.subject || r.className || "Class"}</b><small>{r.teacher || "School day"}{r.room ? ` · ${r.room}` : ""}</small></span><Badge variant="outline">{r.day || "Today"}</Badge></div>) : <Empty icon={CalendarClock} title="Routine not published" text="The school routine will appear here when it is shared." />}</CardContent></Card>
      <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">School pulse</span><h3>Recent updates</h3></div><Button variant="ghost" size="sm" onClick={() => setLocation("/guardian?tab=notices")}>See all <ChevronRight /></Button></div>{recent.length ? recent.map((item, i) => { const Icon = item.icon; return <div className="guardian-list-row" key={`${item.kind}-${i}`}><span className="guardian-mini-icon"><Icon /></span><span><b>{item.title}</b><small>{item.kind} · {dateLabel(item.date)}</small></span><ArrowUpRight /></div>; }) : <Empty icon={Bell} title="A quiet inbox" text="New notices and homework updates will appear here." />}</CardContent></Card></div>
  </div>;
  else if (tab === "attendance") body = <Card className="guardian-panel"><CardContent><div className="guardian-large-metric"><div><span className="guardian-eyebrow">This term</span><strong>{attendanceLoading ? "…" : attendance.length ? `${attendancePct}%` : "—"}</strong><p>{attendance.length ? `${present} attended of ${attendance.length} recorded days` : "Attendance records are not available yet."}</p></div><Progress value={attendancePct} /></div>{attendance.length ? (attendance as any[]).slice(0, 12).map(r => <div className="guardian-list-row" key={r.id}><span className="guardian-date-box">{new Date(r.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</span><span><b>{r.status === "present" ? "Present" : r.status === "late" ? "Late arrival" : "Absent"}</b><small>Daily attendance record</small></span><Badge variant={r.status === "present" ? "secondary" : r.status === "late" ? "outline" : "destructive"}>{r.status}</Badge></div>) : <Empty icon={CalendarCheck} title="No records yet" text="Attendance will be shown once the school records the day." />}</CardContent></Card>;
  else if (tab === "results") body = <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">Learning progress</span><h3>Published results</h3></div><GraduationCap /></div>{(results as any[]).length ? (results as any[]).map(r => { const exam = exams.find((e: any) => e.id === r.examId); return <div className="guardian-list-row" key={r.id}><span className="guardian-score">{r.grade || "—"}</span><span><b>{exam?.title || "Exam result"}</b><small>{r.marksObtained}{exam ? ` / ${exam.totalMarks}` : ""} marks</small></span><span className="guardian-percent">{exam ? `${Math.round(r.marksObtained / exam.totalMarks * 100)}%` : "—"}</span></div>; }) : <Empty icon={GraduationCap} title="Results are on their way" text="Published exam results will appear here." />}</CardContent></Card>;
  else if (tab === "fees") body = <Card className="guardian-panel"><CardContent><div className="guardian-large-metric"><div><span className="guardian-eyebrow">Account balance</span><strong>{feesLoading ? "…" : money(outstanding)}</strong><p>{pending.length ? "Please review the outstanding records below." : "There are no outstanding payments."}</p></div><WalletCards /></div>{(fees as any[]).length ? (fees as any[]).map(f => <div className="guardian-list-row" key={f.id}><span className="guardian-mini-icon amber"><WalletCards /></span><span><b>{f.month || "School fee"}</b><small>{f.paidAt ? `Paid ${dateLabel(f.paidAt)}` : "Payment pending"}</small></span><b>{money(Number(f.amount || 0))}</b><Badge variant={f.status === "paid" ? "secondary" : "destructive"}>{f.status}</Badge></div>) : <Empty icon={WalletCards} title="No fee records" text="Payment history will appear when the school posts a fee." />}</CardContent></Card>;
  else if (tab === "routine") body = <Card className="guardian-panel"><CardContent>{routine.length ? routine.map((r: any) => <div className="guardian-list-row" key={r.id}><span className="guardian-time">{r.startTime || "—"}</span><span><b>{r.subject || r.className || "Class"}</b><small>{r.day || "Day"} · {r.teacher || "Teacher"}{r.room ? ` · ${r.room}` : ""}</small></span><Clock3 /></div>) : <Empty icon={CalendarClock} title="Routine not published" text="The weekly routine will appear once shared by the school." />}</CardContent></Card>;
  else if (tab === "notices" || tab === "homework") { const list = tab === "notices" ? notices : homework; body = <div className="guardian-card-grid">{list.length ? list.map((x: any) => <Card className="guardian-panel" key={x.id}><CardContent><span className="guardian-eyebrow">{tab === "notices" ? "School notice" : "Homework"}</span><h3>{x.title}</h3><p className="guardian-muted">{x.content || x.description || "No further details provided."}</p><small className="guardian-muted">{dateLabel(x.createdAt || x.dueDate)}{x.dueDate ? ` · Due ${x.dueDate}` : ""}</small></CardContent></Card>) : <Empty icon={tab === "notices" ? Bell : BookOpen} title={tab === "notices" ? "No new notices" : "No homework listed"} text="You are all caught up for now." />}</div>; }
  else if (tab === "leave") body = <Card className="guardian-panel"><CardContent><div className="guardian-form-state"><FileText /><h3>Leave requests</h3><p>Leave request submission is not connected to the school records yet. This space is ready for that workflow.</p><Button onClick={() => setLeaveSent(true)} disabled={leaveSent}>{leaveSent ? "Request saved locally" : "Draft a leave request"}</Button></div></CardContent></Card>;
   else if (tab === "messages") body = <Card className="guardian-panel"><CardContent><div className="guardian-form-state"><MessageCircle /><h3>Teacher messages</h3><p>Direct messaging will appear here when your school enables it. For now, important school-wide updates remain in Notices.</p><Button variant="outline" onClick={() => setLocation("/guardian?tab=notices")}><Send /> Open notices</Button></div></CardContent></Card>;
  else body = <Card className="guardian-panel"><CardContent><div className="guardian-profile"><span className="guardian-profile-avatar">{studentName.slice(0, 1)}</span><div><h3>{studentName}</h3><p>{child?.className || "Student record"}{child?.batch ? ` · ${child.batch}` : ""}</p></div></div><div className="guardian-detail-grid"><div><small>Guardian account</small><b>{userProfile?.email || "—"}</b></div><div><small>School</small><b>{userProfile?.orgName || "EduTrack school"}</b></div><div><small>Student ID</small><b>{userProfile?.studentId || child?.id || "—"}</b></div><div><small>Portal status</small><b className="guardian-success"><CheckCircle2 /> Connected</b></div></div>{tab === "settings" && <div className="guardian-setting"><Moon /><span><b>Quiet, focused notifications</b><small>Notification preferences are managed by your school administrator.</small></span></div>}</CardContent></Card>;

  return <div className="guardian-page">{header}<section aria-live="polite">{body}</section><footer className="guardian-footer"><ShieldCheck /> Private school record · Last checked just now</footer></div>;
}