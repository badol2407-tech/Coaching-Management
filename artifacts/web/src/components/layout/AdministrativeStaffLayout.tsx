import { useState } from "react";
import { useLocation } from "wouter";
import {
  Award,
  Bell,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  FileBarChart2,
  GraduationCap,
  IdCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  Wallet,
  X,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobileDrawer } from "@/hooks/use-mobile-drawer";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { getOrgAccessStatus } from "@/lib/subscription";
import { getEffectiveTier } from "@/lib/plan-config";
import { SubscriptionExpiredScreen } from "@/pages/SubscriptionExpired";
import { PortalNavLink } from "@/components/layout/PortalNavLink";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Student Records", href: "/student-records", icon: Users },
  { title: "Admission Management", href: "/admissions", icon: ClipboardList },
  { title: "Fee Collection", href: "/fees", icon: Wallet },
  { title: "ID Card Management", href: "/id-cards", icon: IdCard },
  { title: "Certificate Management", href: "/certificates", icon: Award },
  { title: "Routine Management", href: "/routine", icon: CalendarRange },
  { title: "Notices", href: "/notices", icon: Bell },
  { title: "Reports", href: "/reports", icon: FileBarChart2 },
  { title: "Notifications", href: "/notifications", icon: Bell },
];

function initExpanded() {
  try {
    return localStorage.getItem("sidebar-administrative-staff-expanded") === "true";
  } catch {
    return false;
  }
}

export function AdministrativeStaffLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
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
  const [expanded, setExpanded] = useState(initExpanded);

  if (!impersonation && userProfile?.orgSubscription) {
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
    try {
      localStorage.setItem("sidebar-administrative-staff-expanded", String(next));
    } catch {}
  }

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        tabIndex={isMobile && mobileOpen ? -1 : undefined}
        role={isMobile ? "dialog" : undefined}
        aria-modal={isMobile ? true : undefined}
        aria-hidden={isMobile ? !mobileOpen : undefined}
        inert={isMobile && !mobileOpen ? true : undefined}
        className={`fixed md:sticky top-0 h-screen z-50 shrink-0 flex flex-col border-r border-white/10 transition-all duration-300 ease-in-out
          w-64 md:w-14 ${expanded ? "md:w-56" : "md:w-14"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          background: "linear-gradient(180deg, #25233f 0%, #19182d 58%, #131321 100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
        }}
        aria-label="Administrative staff navigation"
      >
        <div
          className={`flex items-center h-16 border-b border-white/10 shrink-0 overflow-hidden transition-all duration-300 px-4 gap-2 ${
            expanded ? "md:px-4 md:gap-2" : "md:px-0 md:justify-center"
          }`}
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-300 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/30 shrink-0">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div
            className={`min-w-0 overflow-hidden transition-all duration-200 max-w-[140px] opacity-100 ${
              expanded ? "md:max-w-[140px] md:opacity-100" : "md:max-w-0 md:opacity-0"
            }`}
          >
            <p className="text-white font-bold text-sm leading-none">EduTrack</p>
            {userProfile?.orgName && (
              <p className="text-indigo-300/70 text-[10px] leading-none mt-0.5 truncate">
                {userProfile.orgName}
              </p>
            )}
          </div>
          <button
            className="ml-auto md:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            onClick={closeDrawer}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-200 max-h-12 opacity-100 ${
            expanded ? "md:max-h-12 md:opacity-100" : "md:max-h-0 md:opacity-0"
          }`}
        >
          <div className="px-4 py-2.5 border-b border-white/10">
            <span className="inline-flex items-center rounded-full border border-indigo-300/30 px-2 py-1 text-[10px] font-semibold text-indigo-200">
              Administrative Staff
            </span>
          </div>
        </div>

        <nav
          className={`flex-1 overflow-y-auto py-3 space-y-0.5 min-h-0 transition-all duration-300 px-2 ${
            expanded ? "md:px-2" : "md:px-1"
          }`}
          aria-label="Administrative staff navigation"
        >
          {navItems.map((item) => (
            <PortalNavLink
              key={item.href}
              href={item.href}
              label={item.title}
              icon={item.icon}
              active={isActive(item.href)}
              collapsed={!expanded}
              onClick={closeDrawer}
              activeClassName="text-[#a5b4fc] border border-indigo-400/35 bg-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
              inactiveClassName="border border-transparent text-[rgba(148,163,184,0.85)] hover:bg-white/5 hover:text-[#e2e8f0]"
              indicatorClassName="bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]"
              testId={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 shrink-0">
          <div className={`py-2 transition-all duration-300 px-2 ${expanded ? "md:px-2" : "md:px-1"}`}>
            <PortalNavLink
              href="/settings"
              label="Profile & Settings"
              icon={Settings}
              active={location === "/settings"}
              collapsed={!expanded}
              onClick={closeDrawer}
              activeClassName="text-indigo-300 border border-indigo-400/20 bg-indigo-500/10"
              inactiveClassName="border border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
              indicatorClassName="bg-indigo-400"
              testId="link-profile-settings"
            />
          </div>

          <div
            className={`border-t border-white/10 flex items-center gap-2.5 px-3 py-3 transition-all duration-300 ${
              expanded
                ? "md:flex-row md:px-3 md:gap-2.5"
                : "md:flex-col md:px-0 md:gap-1.5 md:py-2 md:items-center"
            }`}
          >
            <div
              title={!expanded ? userProfile?.name || user?.email || "" : undefined}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0"
            >
              {(userProfile?.name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div
              className={`min-w-0 flex-1 overflow-hidden transition-all duration-200 max-w-[120px] opacity-100 ${
                expanded ? "md:max-w-[120px] md:opacity-100" : "md:max-w-0 md:opacity-0 md:flex-none"
              }`}
            >
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {userProfile?.name || user?.displayName}
              </p>
              <p className="text-slate-400 text-[10px] truncate leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex min-h-11 min-w-11 items-center justify-center text-red-400 hover:text-red-300 rounded-md hover:bg-white/5 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              title="Logout"
              aria-label="Log out"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={toggleExpanded}
            className="hidden md:flex min-h-11 w-full items-center justify-center border-t border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
            data-testid="button-toggle-sidebar"
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="md:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <button
            ref={triggerRef}
            onClick={openDrawer}
            className="flex min-h-11 min-w-11 items-center justify-center text-foreground rounded-md hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            data-testid="button-open-navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-300 to-fuchsia-500 flex items-center justify-center">
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