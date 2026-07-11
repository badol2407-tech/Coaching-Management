import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, GraduationCap, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Organizations", href: "/organizations", icon: Building2 },
];

export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border bg-sidebar">
            <div className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
              <GraduationCap className="h-6 w-6 text-sidebar-primary" />
              <div>
                <span>EduTrack</span>
                <p className="text-xs font-normal text-sidebar-foreground/60">Super Admin</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.email}</p>
                  <p className="text-xs text-sidebar-foreground/50">Super Admin</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="text-sidebar-foreground/60 hover:text-sidebar-foreground shrink-0" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center px-4 border-b border-border bg-card shadow-sm z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="font-semibold text-lg">
                {navItems.find((i) => location === i.href || (i.href !== "/" && location.startsWith(i.href)))?.title || "Overview"}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
