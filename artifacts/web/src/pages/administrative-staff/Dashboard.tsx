import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FilePlus2,
  GraduationCap,
  Inbox,
  MoreHorizontal,
  ReceiptText,
  Sparkles,
  UserPlus,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: typeof UserPlus;
  tone: string;
};

type Task = {
  id: string;
  title: string;
  meta: string;
  priority: "High" | "Medium" | "Low";
};

const admissions = [
  { id: "admission-1", initials: "AR", name: "Aarav Rahman", course: "Grade 8 · Morning", time: "08:42 AM", tone: "bg-[#e9e5ff] text-[#6252ba]" },
  { id: "admission-2", initials: "NS", name: "Nusrat Sultana", course: "IELTS Intensive", time: "09:18 AM", tone: "bg-[#e1f3ed] text-[#277765]" },
  { id: "admission-3", initials: "MH", name: "Mahin Hasan", course: "Grade 10 · Science", time: "10:06 AM", tone: "bg-[#fff0d8] text-[#a66522]" },
  { id: "admission-4", initials: "SF", name: "Safa Farin", course: "A-Level Mathematics", time: "11:24 AM", tone: "bg-[#f4e2eb] text-[#9b4f75]" },
];

const initialActivities: Activity[] = [
  { id: "activity-1", title: "New admission recorded", detail: "Aarav Rahman · Grade 8", time: "12 min ago", icon: UserPlus, tone: "bg-[#e9e5ff] text-[#6252ba]" },
  { id: "activity-2", title: "Fee payment received", detail: "Nusrat Sultana · ৳8,500", time: "38 min ago", icon: CreditCard, tone: "bg-[#e1f3ed] text-[#277765]" },
  { id: "activity-3", title: "Document uploaded", detail: "Birth certificate · Mahin Hasan", time: "1 hr ago", icon: FilePlus2, tone: "bg-[#fff0d8] text-[#a66522]" },
  { id: "activity-4", title: "Class schedule updated", detail: "IELTS Intensive · Room 204", time: "2 hrs ago", icon: CalendarDays, tone: "bg-[#f4e2eb] text-[#9b4f75]" },
];

const initialTasks: Task[] = [
  { id: "task-1", title: "Verify 3 pending admission documents", meta: "Due today · Admissions", priority: "High" },
  { id: "task-2", title: "Send fee reminders for June cycle", meta: "Due today · Finance", priority: "Medium" },
  { id: "task-3", title: "Prepare orientation welcome packs", meta: "Due tomorrow · Front desk", priority: "Low" },
  { id: "task-4", title: "Confirm room 204 projector booking", meta: "Due tomorrow · Facilities", priority: "Medium" },
];

const initialNotifications = [
  { id: "notification-1", title: "Fee collection is 8.4% ahead", detail: "You are tracking above this month's target.", time: "Today, 9:04 AM", tone: "bg-[#e1f3ed] text-[#277765]" },
  { id: "notification-2", title: "3 documents need review", detail: "Admission files are waiting in your queue.", time: "Today, 8:36 AM", tone: "bg-[#fff0d8] text-[#a66522]" },
  { id: "notification-3", title: "Staff briefing starts at 3:30 PM", detail: "Conference room A · 20 minutes", time: "Yesterday", tone: "bg-[#e9e5ff] text-[#6252ba]" },
];

const currency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {action && (
        <button type="button" className="group inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid={`button-view-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {action}<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default function AdministrativeStaffDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const visibleActivities = useMemo(() => (showAllActivity ? initialActivities : initialActivities.slice(0, 3)), [showAllActivity]);
  const completedTasks = initialTasks.length - tasks.length;

  function completeTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function dismissNotification(id: string) {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }

  return (
    <div className="app-command-surface mx-auto max-w-[1320px] space-y-7 pb-12" aria-label="Administrative staff dashboard">
      <header className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-br from-[#f1edff]/90 via-white/70 to-[#fff7ec]/80 px-5 py-6 shadow-[0_22px_60px_-40px_rgba(73,58,151,.45)] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full bg-[#d9d1ff]/40 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 rounded-full bg-[#52a78d] shadow-[0_0_0_4px_rgba(82,167,141,.14)]" aria-hidden="true" />
              Administrative workspace
            </div>
            <h1 className="mt-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl">Good morning, Ayesha</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">A clear start to a busy day. Here is what needs your attention across Greenfield Academy.</p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="hidden items-center gap-2 rounded-xl border border-white/80 bg-white/55 px-3 py-2 text-xs text-muted-foreground shadow-sm sm:flex">
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" /> Tuesday, 18 June 2024
            </div>
            <Button className="rounded-xl bg-primary shadow-[0_10px_20px_-12px_rgba(99,82,186,.9)]" data-testid="button-new-admission">
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" /> New admission
            </Button>
          </div>
        </div>
      </header>

      <section aria-labelledby="quick-stats-heading">
        <SectionHeading eyebrow="At a glance" title="Quick stats" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total students", value: "1,248", note: "+24 this month", icon: UsersRound, tone: "text-primary bg-[#ebe7ff]", trend: "up" },
            { label: "Today's admissions", value: "18", note: "+4 vs yesterday", icon: GraduationCap, tone: "text-[#277765] bg-[#e1f3ed]", trend: "up" },
            { label: "Fees collected", value: currency(184500), note: "72% of monthly goal", icon: WalletCards, tone: "text-[#a66522] bg-[#fff0d8]", trend: "up" },
            { label: "Pending tasks", value: String(tasks.length), note: `${completedTasks} completed today`, icon: CheckCircle2, tone: "text-[#9b4f75] bg-[#f4e2eb]", trend: "down" },
          ].map((stat) => (
            <Card key={stat.label} className="dashboard-metric border-white/75 bg-white/60 transition-transform duration-300 hover:-translate-y-1" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="flex items-center justify-between p-4 sm:p-5">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><ArrowUpRight className={`h-3 w-3 ${stat.trend === "down" ? "rotate-90 text-[#9b4f75]" : "text-[#277765]"}`} aria-hidden="true" />{stat.note}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}><stat.icon className="h-5 w-5" aria-hidden="true" /></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <section aria-labelledby="recent-activity-heading">
          <Card className="dashboard-panel overflow-hidden border-white/75">
            <CardHeader className="flex flex-row items-end justify-between border-b border-primary/5 pb-4">
              <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">Live pulse</p><CardTitle id="recent-activity-heading" className="mt-1 text-lg">Recent activities</CardTitle></div>
              <button type="button" onClick={() => setShowAllActivity((value) => !value)} className="flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid="button-toggle-activities">{showAllActivity ? "Show less" : "View all"}<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></button>
            </CardHeader>
            <CardContent className="p-0">
              <ul aria-label="Recent activities">{visibleActivities.map((activity) => <li key={activity.id} className="flex items-center gap-3 border-b border-primary/5 px-5 py-4 last:border-0 transition-colors hover:bg-primary/[.025]" data-testid={`row-${activity.id}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.tone}`}><activity.icon className="h-4 w-4" aria-hidden="true" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{activity.title}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{activity.detail}</p></div>
                <time className="shrink-0 text-[11px] text-muted-foreground">{activity.time}</time>
              </li>)}</ul>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="fee-summary-heading">
          <Card className="dashboard-panel overflow-hidden border-white/75">
            <CardHeader className="flex flex-row items-end justify-between pb-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">June 2024</p><CardTitle id="fee-summary-heading" className="mt-1 text-lg">Fee collection summary</CardTitle></div><ReceiptText className="h-5 w-5 text-primary/50" aria-hidden="true" /></CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-3"><div><p className="text-3xl font-semibold tracking-tight tabular-nums">{currency(184500)}</p><p className="mt-1 text-xs text-muted-foreground">of {currency(255000)} monthly target</p></div><span className="rounded-full bg-[#e1f3ed] px-2.5 py-1 text-xs font-bold text-[#277765]">72.4%</span></div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-label="Fee collection progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={72.4}><div className="h-full w-[72.4%] rounded-full bg-gradient-to-r from-primary to-[#a894e8]" /></div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-primary/5 pt-4"><div><p className="text-xs text-muted-foreground">Collected today</p><p className="mt-1 font-semibold tabular-nums">{currency(32500)}</p></div><div><p className="text-xs text-muted-foreground">Outstanding</p><p className="mt-1 font-semibold text-[#a66522] tabular-nums">{currency(70500)}</p></div></div>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <section aria-labelledby="admissions-heading">
          <Card className="dashboard-panel overflow-hidden border-white/75">
            <CardHeader className="flex flex-row items-end justify-between border-b border-primary/5 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">Today · 18 applications</p><CardTitle id="admissions-heading" className="mt-1 text-lg">Today's admissions</CardTitle></div><Link href="/students" className="flex min-h-11 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid="link-view-admissions">View register<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></CardHeader>
            <CardContent className="p-0"><ul aria-label="Today's admissions">{admissions.map((admission) => <li key={admission.id} className="flex items-center gap-3 border-b border-primary/5 px-5 py-3.5 last:border-0"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${admission.tone}`}>{admission.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{admission.name}</p><p className="truncate text-xs text-muted-foreground">{admission.course}</p></div><time className="text-[11px] text-muted-foreground">{admission.time}</time><button type="button" aria-label={`More options for ${admission.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid={`button-admission-options-${admission.id}`}><MoreHorizontal className="h-4 w-4" /></button></li>)}</ul></CardContent>
          </Card>
        </section>

        <section aria-labelledby="tasks-heading">
          <Card className="dashboard-panel overflow-hidden border-white/75">
            <CardHeader className="flex flex-row items-end justify-between border-b border-primary/5 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">Your queue</p><CardTitle id="tasks-heading" className="mt-1 text-lg">Pending tasks</CardTitle></div><Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">{tasks.length} open</Badge></CardHeader>
            <CardContent className="p-0">{tasks.length === 0 ? <div className="flex flex-col items-center px-6 py-10 text-center"><CheckCircle2 className="h-8 w-8 text-[#52a78d]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold">Queue is clear</p><p className="mt-1 text-xs text-muted-foreground">You handled everything for now.</p></div> : <ul aria-label="Pending tasks">{tasks.map((task) => <li key={task.id} className="flex items-start gap-3 border-b border-primary/5 px-5 py-3.5 last:border-0"><button type="button" onClick={() => completeTask(task.id)} aria-label={`Mark ${task.title} complete`} className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/25 text-transparent transition-colors hover:border-[#52a78d] hover:bg-[#e1f3ed] hover:text-[#277765] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid={`button-complete-${task.id}`}><Check className="h-3 w-3" /></button><div className="min-w-0 flex-1"><p className="text-sm font-medium leading-5">{task.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{task.meta}</p></div><span className={`text-[10px] font-bold ${task.priority === "High" ? "text-[#c75e5e]" : task.priority === "Medium" ? "text-[#a66522]" : "text-muted-foreground"}`}>{task.priority}</span></li>)}</ul>}</CardContent>
          </Card>
        </section>
      </div>

      <section aria-labelledby="notifications-heading">
        <Card className="dashboard-panel border-white/75">
          <CardHeader className="flex flex-row items-end justify-between pb-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ebe7ff] text-primary"><Bell className="h-4 w-4" aria-hidden="true" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/70">Stay in the loop</p><CardTitle id="notifications-heading" className="mt-1 text-lg">Notifications</CardTitle></div></div><span className="text-xs text-muted-foreground">{notifications.length} updates</span></CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-3">{notifications.length === 0 ? <div className="col-span-full flex items-center justify-center gap-2 py-5 text-sm text-muted-foreground"><Inbox className="h-4 w-4" /> You are all caught up.</div> : notifications.map((notification) => <div key={notification.id} className="group relative rounded-xl border border-primary/5 bg-white/35 p-3.5 transition-colors hover:bg-white/70" data-testid={`notification-${notification.id}`}><div className={`mb-3 flex h-7 w-7 items-center justify-center rounded-lg ${notification.tone}`}><Sparkles className="h-3.5 w-3.5" aria-hidden="true" /></div><p className="pr-5 text-sm font-semibold">{notification.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{notification.detail}</p><time className="mt-3 block text-[10px] text-muted-foreground">{notification.time}</time><button type="button" onClick={() => dismissNotification(notification.id)} aria-label={`Dismiss ${notification.title}`} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-60 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" data-testid={`button-dismiss-${notification.id}`}><X className="h-3.5 w-3.5" /></button></div>)}</CardContent>
        </Card>
      </section>

      <footer className="flex items-center gap-2 px-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5 text-primary/60" aria-hidden="true" />Last refreshed just now <span className="ml-auto hidden sm:inline">All figures are from your local workspace view</span></footer>
    </div>
  );
}