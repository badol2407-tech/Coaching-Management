import { useState } from "react";
import { Link, useSearch } from "wouter";
import {
  LayoutDashboard, Wallet, CalendarCheck, ClipboardList,
  CalendarDays, NotebookPen, Bell, GraduationCap, LogOut,
  Menu, X, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileDrawer } from "@/hooks/use-mobile-drawer";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { getOrgAccessStatus } from "@/lib/subscription";
import { getEffectiveTier } from "@/lib/plan-config";
import { SubscriptionExpiredScreen } from "@/pages/SubscriptionExpired";

const navItems = [
  { tab: "dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { tab: "fees",       label: "Fees",       icon: Wallet },
  { tab: "attendance", label: "Attendance", icon: CalendarCheck },
  { tab: "results",    label: "Results",    icon: ClipboardList },
  { tab: "routine",    label: "Routine",    icon: CalendarDays },
  { tab: "homework",   label: "Homework",   icon: NotebookPen },
  { tab: "notices",    label: "Notices",    icon: Bell },
];

const sidebarGradient = "linear-gradient(180deg, #0f172a 0%, #1a0533 55%, #0f172a 100%)";

function initExpanded() {
  try { return localStorage.getItem("sidebar-student-expanded") === "true"; }
  catch { return false; }
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, logout } = useAuth();
  const { impersonation } = useImpersonation();
  const { isOpen: mobileOpen, open: openDrawer, close: closeDrawer } = useMobileDrawer();
  const search = useSearch();
  const activeTab = new URLSearchParams(search).get("tab") ?? "dashboard";
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
    try { localStorage.setItem("sidebar-student-expanded", String(next)); } catch {}
  }

  const labelCls = `truncate whitespace-nowrap overflow-hidden transition-all duration-200 max-w-[160px] opacity-100 ${
    expanded ? "md:max-w-[160px] md:opacity-100" : "md:max-w-0 md:opacity-0"
  }`;

  const rowCls = (active: boolean) =>
    `relative flex items-center py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer select-none px-3 gap-2.5 ${
      expanded ? "md:px-3 md:gap-2.5 md:justify-start" : "md:px-0 md:gap-0 md:justify-center"
    } ${active ? "text-[#d8b4fe]" : "text-[rgba(148,163,184,0.85)] hover:text-[#e2e8f0]"}`;

  const activeStyle = {
    background: "linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(139,92,246,0.14) 100%)",
    border: "1px solid rgba(168,85,247,0.35)",
    boxShadow: "0 0 12px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
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
        aria-label="Student navigation"
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-white/10 shrink-0 overflow-hidden transition-all duration-300 px-4 gap-2 ${expanded ? "md:px-4 md:gap-2" : "md:px-0 md:justify-center"}`}>
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center shadow-md shadow-purple-500/40 shrink-0">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div className={`min-w-0 overflow-hidden transition-all duration-200 max-w-[140px] opacity-100 ${expanded ? "md:max-w-[140px] md:opacity-100" : "md:max-w-0 md:opacity-0"}`}>
            <p className="text-white font-bold text-sm leading-none">EduTrack</p>
            {userProfile?.orgName && (
              <p className="text-purple-300/70 text-[10px] leading-none mt-0.5 truncate">{userProfile.orgName}</p>
            )}
          </div>
          <button className="ml-auto md:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors" onClick={closeDrawer} aria-label="Close sidebar">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student badge — only when expanded */}
        <div className={`overflow-hidden transition-all duration-200 max-h-12 opacity-100 ${expanded ? "md:max-h-12 md:opacity-100" : "md:max-h-0 md:opacity-0"}`}>
          <div className="px-4 py-2.5 border-b border-white/[0.07]">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.1))",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c4b5fd",
              }}
            >
              Student Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto py-3 space-y-0.5 min-h-0 transition-all duration-300 px-2 ${expanded ? "md:px-2" : "md:px-1"}`}>
          {navItems.map(({ tab, label, icon: Icon }) => {
            const active = activeTab === tab;
            return (
              <Link key={tab} href={tab === "dashboard" ? "/" : `/?tab=${tab}`}>
                <div
                  title={!expanded ? label : undefined}
                  className={rowCls(active)}
                  style={active ? activeStyle : inactiveStyle}
                  onClick={closeDrawer}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={labelCls}>{label}</span>
                  {active && <span className={`rounded-full bg-purple-400 h-1.5 w-1.5 shadow-[0_0_6px_rgba(168,85,247,0.8)] shrink-0 ml-auto ${expanded ? "md:block" : "md:hidden"}`} />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: profile + logout */}
        <div className="border-t border-white/10 shrink-0">
          <div className={`flex items-center gap-2.5 px-3 py-3 transition-all duration-300 ${
            expanded ? "md:flex-row md:px-3 md:gap-2.5" : "md:flex-col md:px-0 md:gap-1.5 md:py-2 md:items-center"
          }`}>
            <div
              title={!expanded ? (userProfile?.name || user?.email || "") : undefined}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0"
            >
              {(userProfile?.name || user?.email || "S")[0].toUpperCase()}
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
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">EduTrack</span>
          </div>
          <div className="ml-auto">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c4b5fd" }}
            >
              Student
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
