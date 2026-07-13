import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Building2, GraduationCap, LogOut, Shield,
  Users, Activity, CreditCard, ChevronDown,
  TrendingUp, DollarSign, BarChart3, Tag,
  Share2, Megaphone, FileText, Gift, UserCheck,
  School, BookOpen, Target, Globe, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

const modules = [
  {
    id: "operations",
    label: "Operations",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    icon: Shield,
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
      { title: "Organizations", href: "/operations/organizations", icon: Building2 },
      { title: "Org Admins", href: "/operations/org-admins", icon: UserCheck },
      { title: "Teachers", href: "/operations/teachers", icon: School },
      { title: "Students", href: "/operations/students", icon: BookOpen },
      { title: "All Users", href: "/operations/users", icon: Users },
      { title: "Activity Logs", href: "/operations/activity", icon: Activity },
    ],
  },
  {
    id: "billing",
    label: "Sales & Billing",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    icon: DollarSign,
    items: [
      { title: "Pricing Plans", href: "/billing/pricing", icon: Tag },
      { title: "Subscriptions", href: "/billing/subscriptions", icon: Zap },
      { title: "Paid / Unpaid", href: "/billing/paid-unpaid", icon: CreditCard },
      { title: "Free Trials", href: "/billing/free-trial", icon: Gift },
      { title: "Revenue", href: "/billing/revenue", icon: TrendingUp },
      { title: "Payment History", href: "/billing/payments", icon: DollarSign },
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Growth",
    color: "text-violet-400",
    dotColor: "bg-violet-400",
    icon: Megaphone,
    items: [
      { title: "Landing Page", href: "/marketing/landing", icon: Globe },
      { title: "Popup Offers", href: "/marketing/popups", icon: Target },
      { title: "Testimonials", href: "/marketing/testimonials", icon: FileText },
      { title: "Coupon Codes", href: "/marketing/coupons", icon: Tag },
      { title: "Referral Program", href: "/marketing/referrals", icon: Share2 },
      { title: "Analytics", href: "/marketing/analytics", icon: BarChart3 },
      { title: "Campaigns", href: "/marketing/campaigns", icon: Megaphone },
    ],
  },
];

// flat route → title map for breadcrumb
const routeTitleMap: Record<string, string> = {};
modules.forEach((m) => m.items.forEach((item) => { routeTitleMap[item.href] = item.title; }));

function isItemActive(href: string, location: string) {
  if (href === "/") return location === "/";
  return location === href || location.startsWith(href + "/");
}

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    operations: true,
    billing: true,
    marketing: true,
  });

  const toggleModule = (id: string) =>
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));

  const pageTitle =
    Object.entries(routeTitleMap).find(([href]) => isItemActive(href, location))?.[1] ??
    "Overview";
  const activeModule = modules.find((m) => m.items.some((i) => isItemActive(i.href, location)));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* ── Sidebar ── */}
        <Sidebar className="border-r border-border/60">
          <SidebarHeader className="h-14 flex items-center px-4 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="leading-none">
                <p className="font-semibold text-sm text-foreground">EduTrack</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Super Admin Console</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="py-2 overflow-y-auto">
            {modules.map((mod) => (
              <Collapsible
                key={mod.id}
                open={openModules[mod.id]}
                onOpenChange={() => toggleModule(mod.id)}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between px-4 py-2 mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
                    <div className="flex items-center gap-1.5">
                      <mod.icon className={cn("h-3 w-3", mod.color)} />
                      <span>{mod.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        !openModules[mod.id] && "-rotate-90"
                      )}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroup className="py-0 px-2 pb-1">
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {mod.items.map((item) => {
                          const active = isItemActive(item.href, location);
                          return (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                                <Link
                                  href={item.href}
                                  className={cn(
                                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all",
                                    active
                                      ? "bg-primary/10 text-primary font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                                  )}
                                >
                                  <item.icon
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0",
                                      active ? mod.color : ""
                                    )}
                                  />
                                  <span className="flex-1 text-[13px]">{item.title}</span>
                                  {active && (
                                    <span
                                      className={cn(
                                        "h-1.5 w-1.5 rounded-full shrink-0",
                                        mod.dotColor
                                      )}
                                    />
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </SidebarContent>

          <SidebarFooter className="border-t border-border/60 p-3 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
                  <p className="text-[10px] text-muted-foreground">Super Admin</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center px-4 gap-3 border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger />
            <div className="h-4 w-px bg-border" />
            {activeModule && (
              <>
                <span className={cn("text-xs font-medium", activeModule.color)}>
                  {activeModule.label}
                </span>
                <span className="text-muted-foreground text-xs">/</span>
              </>
            )}
            <span className="font-semibold text-sm text-foreground">{pageTitle}</span>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
