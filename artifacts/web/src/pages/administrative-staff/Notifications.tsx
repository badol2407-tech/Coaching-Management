import { useMemo, useState } from "react";
import { Bell, CheckCheck, CircleAlert, Clock3, Loader2, Mail, MessageSquareText, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMarkNotificationRead, useStaffNotifications } from "@/lib/hooks";

type Notification = {
  id: string;
  title?: string;
  body?: string;
  kind?: string;
  read?: boolean;
  createdAt?: string;
  recipientUid?: string;
  studentId?: string;
};

function formatDate(value?: string) {
  if (!value) return "Just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function iconFor(kind?: string) {
  if (kind === "message") return MessageSquareText;
  if (kind === "leave") return Clock3;
  return CircleAlert;
}

export default function AdministrativeStaffNotifications() {
  const { data: notifications = [], isLoading } = useStaffNotifications();
  const markRead = useMarkNotificationRead();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (notifications as Notification[]).filter((item) => {
      const filterMatch = filter === "all" || (filter === "unread" ? !item.read : item.kind === filter);
      return filterMatch && (!query || [item.title, item.body, item.kind].some((value) => value?.toLowerCase().includes(query)));
    });
  }, [filter, notifications, search]);
  const unread = (notifications as Notification[]).filter((item) => !item.read).length;

  return (
    <div className="app-command-surface mx-auto max-w-5xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Administrative workspace</div>
          <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live updates from admissions, guardian messages, leave requests, and school operations.</p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 px-3 py-1 text-primary">{unread} unread</Badge>
      </header>
      <Card className="border-border/70 bg-card/70">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg"><Bell className="h-5 w-5 text-primary" />Inbox</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative sm:w-56"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search notifications" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search updates..." /></div>
            <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All updates</SelectItem><SelectItem value="unread">Unread</SelectItem><SelectItem value="message">Messages</SelectItem><SelectItem value="leave">Leave requests</SelectItem></SelectContent></Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Connecting to live notifications...</div> : rows.length === 0 ? <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center text-muted-foreground"><Mail className="mb-3 h-10 w-10 opacity-25" /><p className="font-medium text-foreground">{search || filter !== "all" ? "No matching notifications" : "You’re all caught up"}</p><p className="mt-1 text-sm">New organization updates will appear here automatically.</p></div> : <div className="divide-y divide-border/70">{rows.map((notification) => { const Icon = iconFor(notification.kind); return <div key={notification.id} className={`flex gap-3 px-4 py-4 transition-colors sm:px-6 ${notification.read ? "bg-background/20" : "bg-primary/[0.035]"}`}><div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${notification.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-foreground">{notification.title ?? "Organization update"}</h2>{!notification.read && <Badge className="bg-primary/10 text-primary hover:bg-primary/10">New</Badge>}</div><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{notification.body ?? "No additional details."}</p></div>{!notification.read && <Button size="sm" variant="outline" className="w-fit shrink-0" onClick={() => markRead.mutate({ notificationId: notification.id })} disabled={markRead.isPending}><CheckCheck className="mr-1.5 h-3.5 w-3.5" />Mark read</Button>}</div><p className="mt-2 text-xs text-muted-foreground">{notification.kind ? `${notification.kind} · ` : ""}{formatDate(notification.createdAt)}</p></div></div>; })}</div>}
        </CardContent>
      </Card>
    </div>
  );
}