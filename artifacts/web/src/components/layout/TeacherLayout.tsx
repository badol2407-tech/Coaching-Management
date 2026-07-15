import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, CalendarCheck, Users, ClipboardList, Bell,
  GraduationCap, LogOut, CalendarDays, Settings, NotebookPen,
  Menu, X, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileDrawer } from "@/hooks/use-mobile-drawer";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { getOrgAccessStatus } from "@/lib/subscription";
import { getEffectiveTier } from "@/lib/plan-config";
import { SubscriptionExpiredScreen } from "@/pages/SubscriptionExpired";

const navItems = [
  { title: "Dashboard",  href: "/",           icon: LayoutDashboard },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Students",   href: "/students",   icon: Users },
  { title: "Exams",      href: "/exams",      icon: ClipboardList },
  { title: "Routine",    href: "/routine",    icon: CalendarDays },
  { title: "Notices",    href: "/notices",    icon: Bell },
  { title: "Homework",   href: "/homework",   icon: NotebookPen },
];

function initExpanded() {
  try { return localStorage.getItem("sidebar-teacher-expanded") === "true"; }
  catch { return false; }
}

export function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { isOpen: mobileOpen, open: openDrawer, close: closeDrawer } = useMobileDrawer();
  const { impersonation } = useImpersonation();
  const [expanded, setExpanded] = useState(initExpanded);

  if (!impersonation && userProfile && userProfile.role !== "super_admin" && userProfile.orgSubscription) {
    const accessStatus = getOrgAccessStatus(userProfile.orgSubscription);
    if (accessStatus !== "active") {
      return (
        <SubscriptionExpiredScreen
          status={accessStatus}
          tier={getEffectiveTier(userProfile.orgSubscription)}
          subscriptionExpiryDate={userProfile.orgSubscription.subscriptionExpiryDate}
        />
      );
    }
  }

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    try { localStorage.setItem("sidebar-teacher-expanded", String(next)); } catch {}
  }

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(href + "/");
  }

  const isSettings = location === "/settings";
  const sidebarGradient = "linear-gradient(180deg, #0f172a 0%, #0c1a30 55%, #0f172a 100%)";

  const labelCls = `truncate whitespace-nowrap overflow-hidden transition-all duration-200 max-w-[160px] opacity-100 ${
    expanded ? "md:max-w-[160px] md:opacity-100" : "md:max-w-0 md:opacity-0"
  }`;

  const rowCls = (active: boolean) =>
    `relative flex items-center py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer select-none px-3 gap-2.5 ${
      expanded ? "md:px-3 md:gap-2.5 md:justify-start" : "md:px-0 md:gap-0 md:justify-center"
    } ${active ? "text-[#67e8f9]" : "text-[rgba(148,163,184,0.85)] hover:text-[#e2e8f0]"}`;

  const activeStyle = {
    background: "linear-gradient(135deg, rgba(6,182,212,0.22) 0%, rgba(59,130,246,0.14) 100%)",
    border: "1px solid rgba(6,182,212,0.35)",
    boxShadow: "0 0 12px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
  };
  const inactiveStyle = { border: "1px solid transparent" };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">

      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 shrink-0 flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out
          w-64 ${expanded ? "md:w-56" : "md:w-14"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ background: sidebarGradient, boxShadow: "4px 0 24px rgba(0,0,0,0.35)" }}
        aria-label="Teacher navigation"
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-white/10 shrink-0 overflow-hidden transition-all duration-300 px-4 gap-2 ${expanded ? "md:px-4 md:gap-2" : "md:px-0 md:justify-center"}`}>
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/40 shrink-0">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div className={`min-w-0 overflow-hidden transition-all duration-200 max-w-[140px] opacity-100 ${expanded ? "md:max-w-[140px] md:opacity-100" : "md:max-w-0 md:opacity-0"}`}>
            <p className="text-white font-bold text-sm leading-none">EduTrack</p>
            {userProfile?.orgName && (
              <p className="text-cyan-300/70 text-[10px] leading-none mt-0.5 truncate">{userProfile.orgName}</p>
            )}
          </div>
          <button className="ml-auto md:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors" onClick={closeDrawer} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto py-3 space-y-0.5 min-h-0 transition-all duration-300 px-2 ${expanded ? "md:px-2" : "md:px-1"}`}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  title={!expanded ? item.title : undefined}
                  className={rowCls(active)}
                  style={active ? activeStyle : inactiveStyle}
                  onClick={closeDrawer}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className={labelCls}>{item.title}</span>
                  {active && <span className={`rounded-full bg-cyan-400 h-1.5 w-1.5 shadow-[0_0_6px_rgba(6,182,212,0.8)] shrink-0 ml-auto ${expanded ? "md:block" : "md:hidden"}`} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-white/10 shrink-0">
          <div className={`py-2 transition-all duration-300 px-2 ${expanded ? "md:px-2" : "md:px-1"}`}>
            <Link href="/settings" onClick={closeDrawer}>
              <div
                title={!expanded ? "Settings" : undefined}
                className={`flex items-center py-2 rounded-lg text-[13px] transition-colors cursor-pointer px-3 gap-2.5 ${
                  expanded ? "md:px-3 md:gap-2.5 md:justify-start" : "md:px-0 md:gap-0 md:justify-center"
                } ${isSettings ? "text-cyan-300 bg-cyan-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                <Settings className="h-4 w-4 shrink-0" />
                <span className={labelCls}>Settings</span>
              </div>
            </Link>
          </div>

          {/* Profile + logout */}
          <div className={`border-t border-white/10 flex items-center gap-2.5 px-3 py-3 transition-all duration-300 ${
            expanded ? "md:flex-row md:px-3 md:gap-2.5" : "md:flex-col md:px-0 md:gap-1.5 md:py-2 md:items-center"
          }`}>
            <div
              title={!expanded ? (userProfile?.name || user?.email || "") : undefined}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0"
            >
              {(userProfile?.name || user?.email || "T")[0].toUpperCase()}
            </div>
            <div className={`min-w-0 flex-1 overflow-hidden transition-all duration-200 max-w-[120px] opacity-100 ${expanded ? "md:max-w-[120px] md:opacity-100" : "md:max-w-0 md:opacity-0 md:flex-none"}`}>
              <p className="text-white text-xs font-semibold truncate leading-tight">{userProfile?.name || user?.displayName}</p>
              <p className="text-slate-400 text-[10px] truncate leading-tight">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-red-400 hover:text-red-300 p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop expand/collapse toggle */}
          <button
            onClick={toggleExpanded}
            className="hidden md:flex w-full items-center justify-center py-2 border-t border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border/60 bg-background">
          <button onClick={openDrawer} className="text-foreground p-1.5 rounded-md hover:bg-accent transition-colors" aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">EduTrack</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
