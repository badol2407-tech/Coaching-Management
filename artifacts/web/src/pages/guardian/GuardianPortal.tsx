import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  ArrowUpRight, Bell, BookOpen, CalendarCheck, CalendarClock, CheckCircle2,
  ChevronRight, Clock3, FileText, GraduationCap, Loader2, MessageCircle,
  Moon, Send, ShieldCheck, Sparkles, WalletCards,
} from "lucide-react";
import {
  filterByMyClassAndBatch,
  useGuardianConversationMessages,
  useGuardianConversations,
  useGuardianLeaveRequests,
  useGuardianNotifications,
  useListExams,
  useListHomework,
  useListNotices,
  useListRoutine,
  useMyAttendance,
  useMyFees,
  useMyResults,
  useMyStudentRecord,
  useSendGuardianMessage,
  useSubmitGuardianLeaveRequest,
} from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { useGuardianContext } from "@/contexts/GuardianContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const money = (n: number) => `৳${n.toLocaleString("en-BD")}`;
const dateLabel = (v?: string) => v ? new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Date pending";

function Empty({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return <div className="guardian-empty"><Icon /><b>{title}</b><span>{text}</span></div>;
}

function statusVariant(status: string) {
  if (status === "approved" || status === "paid") return "secondary" as const;
  if (status === "rejected") return "destructive" as const;
  return "outline" as const;
}

export default function GuardianPortal() {
  const { userProfile } = useAuth();
  const { selectedChild, selectedChildId, children: linkedChildren, loading: childrenLoading } = useGuardianContext();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const tab = new URLSearchParams(search).get("tab") || "dashboard";
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });

  const { data: child } = useMyStudentRecord(selectedChildId);
  const activeChild = child ?? selectedChild;
  const { data: attendance = [], isLoading: attendanceLoading } = useMyAttendance(selectedChildId);
  const { data: fees = [], isLoading: feesLoading } = useMyFees(selectedChildId);
  const { data: results = [] } = useMyResults(selectedChildId);
  const { data: allExams = [] } = useListExams({ studentId: selectedChildId });
  const { data: allRoutine = [] } = useListRoutine({ studentId: selectedChildId });
  const { data: allNotices = [], isLoading: noticesLoading } = useListNotices({ studentId: selectedChildId });
  const { data: allHomework = [] } = useListHomework({ studentId: selectedChildId });
  const { data: conversations = [], isLoading: conversationsLoading } = useGuardianConversations(selectedChildId);
  const activeConversation = (conversations as any[])[0] ?? null;
  const { data: messages = [] } = useGuardianConversationMessages(activeConversation?.id);
  const { data: leaveRequests = [], isLoading: leaveLoading } = useGuardianLeaveRequests(selectedChildId);
  const { data: notifications = [], isLoading: notificationsLoading } = useGuardianNotifications(selectedChildId);
  const sendMessage = useSendGuardianMessage();
  const submitLeave = useSubmitGuardianLeaveRequest();

  const exams = allExams as any[];
  const routine = allRoutine as any[];
  const notices = allNotices as any[];
  const homework = allHomework as any[];
  const present = (attendance as any[]).filter(r => r.status === "present" || r.status === "late").length;
  const attendancePct = attendance.length ? Math.round(present / attendance.length * 100) : 0;
  const pending = (fees as any[]).filter(f => f.status !== "paid");
  const outstanding = pending.reduce((s, f) => s + Number(f.amount || 0) - Number(f.totalPaid || 0), 0);
  const studentName = activeChild?.name || userProfile?.name || "Your child";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const title = ({
    dashboard: "Today’s family brief", attendance: "Attendance", results: "Exam results",
    routine: "Weekly routine", notices: "School notices", fees: "Fees & payments",
    homework: "Homework", messages: "Teacher messages", leave: "Leave requests",
    notifications: "Notifications", profile: "Family profile", settings: "Portal settings",
  } as Record<string, string>)[tab] || "Today’s family brief";

  const recent = useMemo(() => [
    ...notices.slice(0, 2).map((n: any) => ({ kind: "Notice", title: n.title, date: n.createdAt, icon: Bell })),
    ...homework.slice(0, 2).map((n: any) => ({ kind: "Homework", title: n.title, date: n.dueDate, icon: BookOpen })),
  ].slice(0, 4), [notices, homework]);

  function go(nextTab: string) {
    setLocation(nextTab === "dashboard" ? "/guardian" : `/guardian?tab=${nextTab}`);
  }

  async function handleSendMessage() {
    if (!selectedChildId || !messageText.trim()) return;
    await sendMessage.mutateAsync({
      studentId: selectedChildId,
      childName: studentName,
      body: messageText,
      conversationId: activeConversation?.id,
      subject: messageSubject,
    });
    setMessageText("");
    setMessageSubject("");
  }

  async function handleSubmitLeave() {
    if (!selectedChildId || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) return;
    await submitLeave.mutateAsync({ ...leaveForm, studentId: selectedChildId, childName: studentName });
    setLeaveForm({ startDate: "", endDate: "", reason: "" });
  }

  const header = (
    <header className="guardian-page-head">
      <div>
        <span className="guardian-eyebrow">Private family brief · {today}</span>
        <h1>{title}</h1>
        <p>{activeChild?.className ? `${studentName} · ${activeChild.className}${activeChild.batch ? ` · ${activeChild.batch}` : ""}` : `A calm view of ${studentName}'s school day.`}</p>
      </div>
      <div className="guardian-trust"><ShieldCheck /><span><b>Connected</b><small>School records are up to date</small></span></div>
    </header>
  );

  let body: React.ReactNode;
  if (childrenLoading || !selectedChildId) {
    body = <Card className="guardian-panel"><CardContent><Empty icon={GraduationCap} title="No linked child yet" text="Ask your school administrator to link a student to this guardian account." /></CardContent></Card>;
  } else if (tab === "dashboard") {
    body = <div className="guardian-content">
      <section className="guardian-welcome glass-panel"><div><span className="guardian-eyebrow"><Sparkles /> Good morning</span><h2>Everything important,<br /><em>in one gentle glance.</em></h2><p>Here’s what’s happening around {studentName} today.</p></div><div className="guardian-orbit"><div><b>{attendancePct || "—"}%</b><span>attendance</span></div></div></section>
      <div className="guardian-stat-grid">
        <button className="guardian-stat glass-panel" onClick={() => go("attendance")}><span className="guardian-stat-icon teal"><CalendarCheck /></span><small>Attendance</small><strong>{attendance.length ? `${attendancePct}%` : "—"}</strong><span className="guardian-stat-foot">{present} attended days <ArrowUpRight /></span></button>
        <button className="guardian-stat glass-panel" onClick={() => go("fees")}><span className="guardian-stat-icon amber"><WalletCards /></span><small>Outstanding fees</small><strong>{money(outstanding)}</strong><span className="guardian-stat-foot">{pending.length ? `${pending.length} payment${pending.length > 1 ? "s" : ""} due` : "All clear"} <ArrowUpRight /></span></button>
        <button className="guardian-stat glass-panel" onClick={() => go("homework")}><span className="guardian-stat-icon coral"><BookOpen /></span><small>Homework</small><strong>{homework.length}</strong><span className="guardian-stat-foot">items this week <ArrowUpRight /></span></button>
      </div>
      <div className="guardian-columns">
        <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">At a glance</span><h3>Coming up</h3></div><Button variant="ghost" size="sm" onClick={() => go("routine")}>View routine <ChevronRight /></Button></div>{routine.length ? routine.slice(0, 3).map((r: any) => <div className="guardian-list-row" key={r.id}><span className="guardian-time">{r.startTime || "—"}</span><span><b>{r.subject || r.className || "Class"}</b><small>{r.teacher || "School day"}{r.room ? ` · ${r.room}` : ""}</small></span><Badge variant="outline">{r.day || "Today"}</Badge></div>) : <Empty icon={CalendarClock} title="Routine not published" text="The school routine will appear here when it is shared." />}</CardContent></Card>
        <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">School pulse</span><h3>Recent updates</h3></div><Button variant="ghost" size="sm" onClick={() => go("notices")}>See all <ChevronRight /></Button></div>{recent.length ? recent.map((item, i) => { const Icon = item.icon; return <div className="guardian-list-row" key={`${item.kind}-${i}`}><span className="guardian-mini-icon"><Icon /></span><span><b>{item.title}</b><small>{item.kind} · {dateLabel(item.date)}</small></span><ArrowUpRight /></div>; }) : <Empty icon={Bell} title="A quiet inbox" text="New notices and homework updates will appear here." />}</CardContent></Card>
      </div>
    </div>;
  } else if (tab === "attendance") {
    body = <Card className="guardian-panel"><CardContent><div className="guardian-large-metric"><div><span className="guardian-eyebrow">This term</span><strong>{attendanceLoading ? "…" : attendance.length ? `${attendancePct}%` : "—"}</strong><p>{attendance.length ? `${present} attended of ${attendance.length} recorded days` : "Attendance records are not available yet."}</p></div><Progress value={attendancePct} /></div>{attendance.length ? (attendance as any[]).slice(0, 12).map(r => <div className="guardian-list-row" key={r.id}><span className="guardian-date-box">{new Date(r.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</span><span><b>{r.status === "present" ? "Present" : r.status === "late" ? "Late arrival" : "Absent"}</b><small>Daily attendance record</small></span><Badge variant={r.status === "present" ? "secondary" : r.status === "late" ? "outline" : "destructive"}>{r.status}</Badge></div>) : <Empty icon={CalendarCheck} title="No records yet" text="Attendance will be shown once the school records the day." />}</CardContent></Card>;
  } else if (tab === "results") {
    body = <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">Learning progress</span><h3>Published results</h3></div><GraduationCap /></div>{(results as any[]).length ? (results as any[]).map(r => { const exam = exams.find((e: any) => e.id === r.examId); return <div className="guardian-list-row" key={r.id}><span className="guardian-score">{r.grade || "—"}</span><span><b>{exam?.title || "Exam result"}</b><small>{r.marksObtained}{exam ? ` / ${exam.totalMarks}` : ""} marks</small></span><span className="guardian-percent">{exam ? `${Math.round(r.marksObtained / exam.totalMarks * 100)}%` : "—"}</span></div>; }) : <Empty icon={GraduationCap} title="Results are on their way" text="Published exam results will appear here." />}</CardContent></Card>;
  } else if (tab === "fees") {
    body = <Card className="guardian-panel"><CardContent><div className="guardian-large-metric"><div><span className="guardian-eyebrow">Account balance</span><strong>{feesLoading ? "…" : money(outstanding)}</strong><p>{pending.length ? "Please review the outstanding records below." : "There are no outstanding payments."}</p></div><WalletCards /></div>{(fees as any[]).length ? (fees as any[]).map(f => <div className="guardian-list-row" key={f.id}><span className="guardian-mini-icon amber"><WalletCards /></span><span><b>{f.month || "School fee"}</b><small>{f.paidAt ? `Paid ${dateLabel(f.paidAt)}` : "Payment pending"}</small></span><b>{money(Number(f.amount || 0))}</b><Badge variant={f.status === "paid" ? "secondary" : "destructive"}>{f.status}</Badge></div>) : <Empty icon={WalletCards} title="No fee records" text="Payment history will appear when the school posts a fee." />}</CardContent></Card>;
  } else if (tab === "routine") {
    body = <Card className="guardian-panel"><CardContent>{routine.length ? routine.map((r: any) => <div className="guardian-list-row" key={r.id}><span className="guardian-time">{r.startTime || "—"}</span><span><b>{r.subject || r.className || "Class"}</b><small>{r.day || "Day"} · {r.teacher || "Teacher"}{r.room ? ` · ${r.room}` : ""}</small></span><Clock3 /></div>) : <Empty icon={CalendarClock} title="Routine not published" text="The weekly routine will appear once shared by the school." />}</CardContent></Card>;
  } else if (tab === "notices" || tab === "homework") {
    const list = tab === "notices" ? notices : homework;
    body = <div className="guardian-card-grid">{list.length ? list.map((x: any) => <Card className="guardian-panel" key={x.id}><CardContent><span className="guardian-eyebrow">{tab === "notices" ? "School notice" : "Homework"}</span><h3>{x.title}</h3><p className="guardian-muted">{x.content || x.description || "No further details provided."}</p><small className="guardian-muted">{dateLabel(x.createdAt || x.dueDate)}{x.dueDate ? ` · Due ${x.dueDate}` : ""}</small></CardContent></Card>) : <Empty icon={tab === "notices" ? Bell : BookOpen} title={tab === "notices" ? "No new notices" : "No homework listed"} text="You are all caught up for now." />}</div>;
  } else if (tab === "messages") {
    body = <div className="guardian-columns">
      <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">Live conversation</span><h3>Teacher messages</h3></div><MessageCircle /></div>{conversationsLoading ? <Loader2 className="animate-spin" /> : messages.length ? (messages as any[]).map((message: any) => <div className={`guardian-message ${message.senderRole === "guardian" ? "guardian-message-own" : ""}`} key={message.id}><b>{message.senderName || (message.senderRole === "guardian" ? "You" : "School")}</b><p>{message.body}</p><small>{dateLabel(message.createdAt)}</small></div>) : <Empty icon={MessageCircle} title="Start a conversation" text="Send a message to your school team about this child." />}<div className="guardian-compose"><Label htmlFor="guardian-subject">Subject</Label><Input id="guardian-subject" value={messageSubject} onChange={(e) => setMessageSubject(e.target.value)} placeholder="What would you like to discuss?" /><Label htmlFor="guardian-message">Message</Label><Textarea id="guardian-message" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Write a message…" rows={4} /><Button onClick={() => void handleSendMessage()} disabled={sendMessage.isPending || !messageText.trim()}><Send />{sendMessage.isPending ? "Sending…" : "Send message"}</Button></div></CardContent></Card>
    </div>;
  } else if (tab === "leave") {
    body = <div className="guardian-columns"><Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">Request time away</span><h3>Submit leave request</h3></div><FileText /></div><div className="guardian-compose"><div className="guardian-form-grid"><div><Label htmlFor="leave-start">From</Label><Input id="leave-start" type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm(f => ({ ...f, startDate: e.target.value }))} /></div><div><Label htmlFor="leave-end">To</Label><Input id="leave-end" type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm(f => ({ ...f, endDate: e.target.value }))} /></div></div><Label htmlFor="leave-reason">Reason</Label><Textarea id="leave-reason" value={leaveForm.reason} onChange={(e) => setLeaveForm(f => ({ ...f, reason: e.target.value }))} placeholder="Tell the school team why your child will be away…" rows={4} /><Button onClick={() => void handleSubmitLeave()} disabled={submitLeave.isPending || !leaveForm.reason.trim()}><Send />{submitLeave.isPending ? "Submitting…" : "Submit request"}</Button></div></CardContent></Card><Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">Live status</span><h3>Request history</h3></div></div>{leaveLoading ? <Loader2 className="animate-spin" /> : (leaveRequests as any[]).length ? (leaveRequests as any[]).map((request: any) => <div className="guardian-list-row" key={request.id}><span className="guardian-mini-icon"><FileText /></span><span><b>{request.startDate} → {request.endDate}</b><small>{request.reason}</small>{request.response && <small className="guardian-success">{request.response}</small>}</span><Badge variant={statusVariant(request.status)}>{request.status}</Badge></div>) : <Empty icon={FileText} title="No leave requests" text="Your submitted requests will appear here with live status updates." />}</CardContent></Card></div>;
  } else if (tab === "notifications") {
    body = <Card className="guardian-panel"><CardContent><div className="guardian-panel-title"><div><span className="guardian-eyebrow">For {studentName}</span><h3>Notifications</h3></div><Bell /></div>{notificationsLoading ? <Loader2 className="animate-spin" /> : (notifications as any[]).length ? (notifications as any[]).map((notification: any) => <div className="guardian-list-row" key={notification.id}><span className="guardian-mini-icon"><Bell /></span><span><b>{notification.title}</b><small>{notification.body}</small><small>{dateLabel(notification.createdAt)}</small></span><Badge variant={notification.read ? "outline" : "secondary"}>{notification.read ? "Read" : "New"}</Badge></div>) : <Empty icon={Bell} title="You’re all caught up" text="New school messages and leave updates will appear here." />}</CardContent></Card>;
  } else {
    body = <Card className="guardian-panel"><CardContent><div className="guardian-profile"><span className="guardian-profile-avatar">{studentName.slice(0, 1)}</span><div><h3>{studentName}</h3><p>{activeChild?.className || "Student record"}{activeChild?.batch ? ` · ${activeChild.batch}` : ""}</p></div></div><div className="guardian-detail-grid"><div><small>Guardian account</small><b>{userProfile?.email || "—"}</b></div><div><small>School</small><b>{userProfile?.orgName || "EduTrack school"}</b></div><div><small>Student ID</small><b>{selectedChildId || "—"}</b></div><div><small>Linked children</small><b>{linkedChildren.length}</b></div><div><small>Portal status</small><b className="guardian-success"><CheckCircle2 /> Connected</b></div></div>{tab === "settings" && <div className="guardian-setting"><Moon /><span><b>Quiet, focused notifications</b><small>Notification preferences are managed by your school administrator.</small></span></div>}</CardContent></Card>;
  }

  return <div className="guardian-page">{header}<section aria-live="polite">{body}</section><footer className="guardian-footer"><ShieldCheck /> Private school record · Live updates enabled</footer></div>;
}