import { useState } from "react";
import { useSearch } from "wouter";
import {
  LayoutDashboard, Wallet, CalendarCheck, ClipboardList,
  CalendarDays, NotebookPen, Bell, GraduationCap, LogOut,
  BookOpen, ClipboardCheck, UserRound, Settings,
  Menu, X, ChevronRight, ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileDrawer } from "@/hooks/use-mobile-drawer";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { getOrgAccessStatus } from "@/lib/subscription";
import { getEffectiveTier } from "@/lib/plan-config";
import { SubscriptionExpiredScreen } from "@/pages/SubscriptionExpired";
import { PortalNavLink } from "@/components/layout/PortalNavLink";

const navItems = [
  { tab: "dashboard",  label: "Overview",       icon: LayoutDashboard },
  { tab: "attendance", label: "Attendance", icon: CalendarCheck },
  { tab: "courses",    label: "Courses",    icon: BookOpen },
  { tab: "assignments",label: "Assignments",icon: ClipboardCheck },
  { tab: "exams",      label: "Exams",      icon: CalendarDays },
  { tab: "results",    label: "Results",    icon: ClipboardList },
  { tab: "fees",       label: "Fees",       icon: Wallet },
  { tab: "notifications", label: "Notifications", icon: Bell },
  { tab: "profile",    label: "Profile",    icon: UserRound },
  { tab: "settings",   label: "Settings",   icon: Settings },
];

function initExpanded() {
  try { return localStorage.getItem("sidebar-student-expanded") === "true"; }
  catch { return false; }
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, logout } = useAuth();
  const { impersonation } = useImpersonation();
  const {
    isOpen: mobileOpen,
    isMobile,
    drawerRef,
    triggerRef,
    open: openDrawer,
    close: closeDrawer,
  } = useMobileDrawer();
  const search = useSearch();
  const requestedTab = new URLSearchParams(search).get("tab") ?? "dashboard";
  const activeTab = requestedTab === "notices" ? "notifications" : requestedTab === "routine" ? "courses" : requestedTab === "homework" ? "assignments" : requestedTab;
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

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">

      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        ref={drawerRef}
        tabIndex={isMobile && mobileOpen ? -1 : undefined}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile ? true : undefined}
        aria-hidden={isMobile ? !mobileOpen : undefined}
        inert={isMobile && !mobileOpen ? true : undefined}
        className={`fixed md:sticky top-0 h-screen z-50 shrink-0 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out
          w-64 ${expanded ? "md:w-56" : "md:w-14"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        aria-label="Student navigation"
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-sidebar-border shrink-0 overflow-hidden transition-all duration-300 px-4 gap-2 ${expanded ? "md:px-4 md:gap-2" : "md:px-0 md:justify-center"}`}>
          <div className="h-7 w-7 rounded-lg bg-sidebar-primary flex items-center justify-center shadow-md shrink-0">
            <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className={`min-w-0 overflow-hidden transition-all duration-200 max-w-36 opacity-100 ${expanded ? "md:max-w-36 md:opacity-100" : "md:max-w-0 md:opacity-0"}`}>
            <p className="text-sidebar-foreground font-bold text-sm leading-none">EduTrack</p>
            {userProfile?.orgName && (
              <p className="text-sidebar-accent-foreground text-xs leading-none mt-0.5 truncate">{userProfile.orgName}</p>
            )}
          </div>
          <button className="ml-auto md:hidden flex min-h-11 min-w-11 items-center justify-center text-sidebar-foreground hover:text-sidebar-accent-foreground rounded-md hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={closeDrawer} aria-label="Close navigation" data-testid="button-close-navigation">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student badge — only when expanded */}
        <div className={`overflow-hidden transition-all duration-200 max-h-12 opacity-100 ${expanded ? "md:max-h-12 md:opacity-100" : "md:max-h-0 md:opacity-0"}`}>
          <div className="px-4 py-2.5 border-b border-sidebar-border">
            <span
              className="inline-flex items-center rounded-full border border-sidebar-accent px-2 py-1 text-xs font-semibold text-sidebar-accent-foreground"
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
              <PortalNavLink
                key={tab}
                href={tab === "dashboard" ? "/" : `/?tab=${tab}`}
                label={label}
                icon={Icon}
                active={active}
                collapsed={!expanded}
                onClick={closeDrawer}
                 activeClassName="text-sidebar-accent-foreground border border-sidebar-primary bg-sidebar-accent"
                 inactiveClassName="border border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                 indicatorClassName="bg-sidebar-primary"
                testId={`link-${tab}`}
              />
            );
          })}
        </nav>

        {/* Bottom: profile + logout */}
          <div className="border-t border-sidebar-border shrink-0">
          <div className={`flex items-center gap-2.5 px-3 py-3 transition-all duration-300 ${
            expanded ? "md:flex-row md:px-3 md:gap-2.5" : "md:flex-col md:px-0 md:gap-1.5 md:py-2 md:items-center"
          }`}>
            {userProfile?.photoUrl ? (
              <img
                src={userProfile.photoUrl}
                alt={userProfile.name || "Student"}
                title={!expanded ? (userProfile?.name || user?.email || "") : undefined}
                className="h-8 w-8 rounded-full object-cover shadow-md shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div
                title={!expanded ? (userProfile?.name || user?.email || "") : undefined}
                className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold shadow-md shrink-0"
              >
                {(userProfile?.name || user?.email || "S")[0].toUpperCase()}
              </div>
            )}
            <div className={`min-w-0 flex-1 overflow-hidden transition-all duration-200 max-w-32 opacity-100 ${expanded ? "md:max-w-32 md:opacity-100" : "md:max-w-0 md:opacity-0 md:flex-none"}`}>
              <p className="text-sidebar-foreground text-xs font-semibold truncate leading-tight">{userProfile?.name || user?.displayName}</p>
              <p className="text-sidebar-accent-foreground text-xs truncate leading-tight">{user?.email}</p>
            </div>
            <button onClick={logout} className="flex min-h-11 min-w-11 items-center justify-center text-destructive hover:text-destructive rounded-md hover:bg-sidebar-accent transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" title="Logout" aria-label="Log out" data-testid="button-logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Desktop expand/collapse toggle */}
          <button
            onClick={toggleExpanded}
            className="hidden md:flex min-h-11 w-full items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            data-testid="button-toggle-sidebar"
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border/60 bg-background">
          <button ref={triggerRef} onClick={openDrawer} className="flex min-h-11 min-w-11 items-center justify-center text-foreground rounded-md hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Open navigation" aria-expanded={mobileOpen} data-testid="button-open-navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-sm">EduTrack</span>
          </div>
          <div className="ml-auto">
            <span
              className="rounded-full border border-sidebar-accent px-2 py-1 text-xs font-semibold text-sidebar-accent-foreground"
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
