import {
  Building2, Users, GraduationCap, UserCheck, TrendingUp,
  DollarSign, CheckCircle, XCircle, PauseCircle, Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSuperAdminDetailedStats, useListOrganizations, useRecentActivityLogs } from "@/lib/super-admin-hooks";

function StatCard({
  title, value, icon: Icon, color, sub,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = useSuperAdminDetailedStats();
  const { data: orgs = [] } = useListOrganizations();
  const { data: logs = [] } = useRecentActivityLogs(10);

  const statCards = [
    { title: "Total Organizations", value: stats?.totalOrgs ?? 0, icon: Building2, color: "text-blue-500" },
    { title: "Active Orgs", value: stats?.activeOrgs ?? 0, icon: CheckCircle, color: "text-green-500", sub: `${stats?.pausedOrgs ?? 0} paused` },
    { title: "Total Students", value: stats?.totalStudents ?? 0, icon: GraduationCap, color: "text-amber-500" },
    { title: "Total Teachers", value: stats?.totalTeachers ?? 0, icon: Users, color: "text-indigo-500" },
    { title: "Org Admins", value: stats?.totalOrgAdmins ?? 0, icon: UserCheck, color: "text-purple-500" },
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-sky-500" },
    {
      title: "MRR",
      value: stats ? `৳${stats.mrr.toLocaleString()}` : "—",
      icon: TrendingUp,
      color: "text-emerald-500",
      sub: `৳${(stats?.totalRevenue ?? 0).toLocaleString()} total`,
    },
    {
      title: "Paid Orgs",
      value: stats?.paidOrgs ?? 0,
      icon: DollarSign,
      color: "text-green-600",
      sub: `${stats?.unpaidOrgs ?? 0} unpaid`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide overview across all organizations</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => (
          isLoading ? (
            <Card key={c.title}>
              <CardContent className="h-24 animate-pulse bg-muted/30 rounded-lg mt-4" />
            </Card>
          ) : (
            <StatCard key={c.title} {...c} />
          )
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent organizations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            {(orgs as any[]).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No organizations yet.</div>
            ) : (
              <div className="space-y-3">
                {(orgs as any[]).slice(0, 8).map((org: any) => (
                  <div key={org.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{org.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{org.adminEmail}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {org.plan ?? "free"}
                        </Badge>
                        {org.paymentStatus === "paid" && (
                          <Badge variant="default" className="text-xs bg-green-600">Paid</Badge>
                        )}
                      </div>
                    </div>
                    <Badge variant={org.status === "active" ? "default" : "secondary"}>
                      {org.status === "paused" ? (
                        <><PauseCircle className="h-3 w-3 mr-1" />Paused</>
                      ) : org.status ?? "active"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(logs as any[]).length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No activity logs yet.</div>
            ) : (
              <div className="space-y-2">
                {(logs as any[]).map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{log.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.actorEmail} · {log.orgName ?? "Platform"}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Subscription Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-20 animate-pulse bg-muted/30 rounded-lg" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Free Plan</p>
                <p className="text-2xl font-bold">{stats?.planBreakdown?.free ?? 0}</p>
                <p className="text-xs text-muted-foreground">organizations</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Basic Plan</p>
                <p className="text-2xl font-bold">{stats?.planBreakdown?.basic ?? 0}</p>
                <p className="text-xs text-muted-foreground">৳{((stats?.planBreakdown?.basic ?? 0) * 499).toLocaleString()}/mo</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Pro Plan</p>
                <p className="text-2xl font-bold">{stats?.planBreakdown?.pro ?? 0}</p>
                <p className="text-xs text-muted-foreground">৳{((stats?.planBreakdown?.pro ?? 0) * 999).toLocaleString()}/mo</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paid vs Unpaid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" /> Paid Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats?.paidOrgs ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Revenue collected this cycle</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-600">
              <XCircle className="h-4 w-4" /> Unpaid Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats?.unpaidOrgs ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending payment this cycle</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
