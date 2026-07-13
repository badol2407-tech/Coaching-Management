import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, GraduationCap, CalendarCheck,
  Wallet, ClipboardList, Bell, Receipt, LogOut, Copy,
  BookOpen, Settings, CalendarRange, CreditCard, HelpCircle,
  UserPlus, NotebookPen, Menu, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useMobileDrawer } from "@/hooks/use-mobile-drawer";

// Main nav — core daily-use pages only
const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Students", href: "/students", icon: Users },
  { title: "Add Student", href: "/students/add", icon: UserPlus },
  { title: "Teachers", href: "/teachers", icon: GraduationCap },
  { title: "Classes", href: "/classes", icon: BookOpen },
  { title: "Routine", href: "/routine", icon: CalendarRange },
  { title: "Attendance", href: "/attendance", icon: CalendarCheck },
  { title: "Fees", href: "/fees", icon: Wallet },
  { title: "Exams", href: "/exams", icon: ClipboardList },
  { title: "Notices", href: "/notices", icon: Bell },
  { title: "Homework", href: "/homework", icon: NotebookPen },
  { title: "Expenses", href: "/expenses", icon: Receipt },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const { isOpen: mobileOpen, open: openDrawer, close: closeDrawer } = useMobileDrawer();

  function copyOrgId() {
    if (userProfile?.orgId) {
      navigator.clipboard.writeText(userProfile.orgId);
      toast({ title: "Org Code Copied!", description: "Teachers ও Students এই code দিয়ে join করতে পারবে।" });
    }
  }

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(href + "/");
  }

  const isSettings = location === "/settings";
  const isSubscription = location === "/subscription";
  const isHelp = location === "/help";

  const sidebarGradient = "linear-gradient(180deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)";

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">

      {/* ── Backdrop (mobile only) ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 w-64 shrink-0 flex flex-col border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: sidebarGradient, boxShadow: "4px 0 24px rgba(0,0,0,0.35)" }}
        aria-label="Sidebar navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 h-14 px-4 border-b border-white/10 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/40 shrink-0">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">EduTrack</p>
            {userProfile?.orgName && (
              <p className="text-indigo-300/70 text-[10px] leading-none mt-0.5 truncate">{userProfile.orgName}</p>
            )}
          </div>
          {/* Close button — mobile only */}
          <button
            className="ml-auto md:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            onClick={closeDrawer}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Org code */}
        {userProfile?.orgId && (
          <button
            onClick={copyOrgId}
            className="flex items-center gap-1.5 text-[10px] text-indigo-300/70 hover:text-indigo-300 transition-colors mx-3 mt-3 px-2 py-1.5 rounded-md hover:bg-white/5 font-mono border border-white/10 shrink-0"
            title="Org Code copy করুন"
          >
            <Copy className="h-3 w-3 shrink-0" />
            <span className="truncate">{userProfile.orgId}</span>
          </button>
        )}

        {/* Nav — scrollable */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 min-h-0">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer select-none"
                  style={active ? {
                    background: "linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(59,130,246,0.15) 100%)",
                    color: "#a5b4fc",
                    border: "1px solid rgba(99,102,241,0.35)",
                    boxShadow: "0 0 12px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
                  } : { color: "rgba(148,163,184,0.85)", border: "1px solid transparent" }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "";
                      (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,0.85)";
                    }
                  }}
                  onClick={closeDrawer}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)] shrink-0" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Settings / Subscription / Help + profile + logout */}
        <div className="border-t border-white/10 shrink-0">
          <div className="px-2 py-2 space-y-0.5">
            <Link href="/settings" onClick={closeDrawer}>
              <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${isSettings ? "text-indigo-300 bg-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <Settings className="h-4 w-4 shrink-0" />
                Settings
              </div>
            </Link>
            <Link href="/subscription" onClick={closeDrawer}>
              <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${isSubscription ? "text-indigo-300 bg-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <CreditCard className="h-4 w-4 shrink-0" />
                Subscription
              </div>
            </Link>
            <Link href="/help" onClick={closeDrawer}>
              <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${isHelp ? "text-indigo-300 bg-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                <HelpCircle className="h-4 w-4 shrink-0" />
                Help
              </div>
            </Link>
          </div>

          <div className="border-t border-white/10 flex items-center gap-2.5 px-3 py-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
              {(userProfile?.name || user?.email || "A")[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate leading-tight">{userProfile?.name || user?.displayName}</p>
              <p className="text-slate-400 text-[10px] truncate leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-red-400 hover:text-red-300 p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 border-b border-border/60 bg-background">
          <button
            onClick={openDrawer}
            className="text-foreground p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
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
