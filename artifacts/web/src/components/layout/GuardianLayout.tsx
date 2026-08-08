import { useState } from "react";
import { Link, useSearch } from "wouter";
import {
  Bell, CalendarCheck, CalendarDays, ClipboardList, FileText, GraduationCap,
  LayoutDashboard, LogOut, Menu, MessageCircle, Settings, UserRound, Wallet, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  ["dashboard", "Today", LayoutDashboard],
  ["attendance", "Attendance", CalendarCheck],
  ["results", "Results", GraduationCap],
  ["routine", "Routine", CalendarDays],
  ["notices", "Notices", Bell],
  ["fees", "Fees", Wallet],
  ["homework", "Homework", ClipboardList],
  ["messages", "Teacher messages", MessageCircle],
  ["leave", "Leave requests", FileText],
  ["profile", "Profile", UserRound],
  ["settings", "Settings", Settings],
] as const;

export function GuardianLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, logout } = useAuth();
  const search = useSearch();
  const active = new URLSearchParams(search).get("tab") || "dashboard";
  const [open, setOpen] = useState(false);
  const name = userProfile?.name || user?.displayName || "Guardian";

  return (
    <div className="guardian-shell min-h-[100dvh]">
      <div className={`guardian-backdrop ${open ? "is-open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`guardian-sidebar ${open ? "is-open" : ""}`}>
        <div className="guardian-brand">
          <span className="guardian-mark"><GraduationCap /></span>
          <span><strong>EduTrack</strong><small>Guardian brief</small></span>
          <button className="guardian-close md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button>
        </div>
        <div className="guardian-child-chip">
          <span className="guardian-avatar">{name.slice(0, 1).toUpperCase()}</span>
          <span><b>{name}</b><small>Family account</small></span>
        </div>
        <nav className="guardian-nav" aria-label="Guardian navigation">
          {items.map(([tab, label, Icon]) => (
            <Link
              key={tab}
              href={tab === "dashboard" ? "/guardian" : `/guardian?tab=${tab}`}
              onClick={() => setOpen(false)}
              className={`guardian-nav-link ${active === tab ? "active" : ""}`}
              data-testid={`link-guardian-${tab}`}
            >
              <Icon /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <button className="guardian-logout" onClick={logout} data-testid="button-guardian-logout"><LogOut /><span>Sign out</span></button>
      </aside>
      <div className="guardian-main">
        <header className="guardian-mobile-bar">
          <button onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="button-guardian-menu"><Menu /></button>
          <span className="guardian-mobile-title">EduTrack <em>Guardian</em></span>
          <span className="guardian-mobile-dot" />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}