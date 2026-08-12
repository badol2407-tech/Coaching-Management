import { useSuperAdminDetailedStats } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Building2, TrendingUp, ExternalLink, Eye } from "lucide-react";

export default function GrowthAnalytics() {
  const { data: stats, isLoading } = useSuperAdminDetailedStats();

  const conversionRate = stats
    ? Math.round((stats.paidOrgs / Math.max(stats.totalOrgs, 1)) * 100)
    : 0;

  const metrics = [
    { label: "Total Organizations", value: stats?.totalOrgs ?? 0, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10", change: "Platform growth" },
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", change: "All roles" },
    { label: "Paid Conversion", value: `${conversionRate}%`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "Free → Paid" },
    { label: "MRR", value: `৳${(stats?.mrr ?? 0).toLocaleString()}`, icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10", change: "Monthly recurring" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visitor & Conversion Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform growth metrics and visitor analytics</p>
      </div>

      {/* Platform metrics from Firestore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-5 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold mt-0.5">{isLoading ? "…" : m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">User Role Breakdown</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
              : (
                <div className="space-y-3">
                  {[
                    { label: "Org Admins", count: stats?.totalOrgAdmins ?? 0, color: "bg-blue-400", total: stats?.totalUsers ?? 1 },
                    { label: "Teachers", count: stats?.totalTeachers ?? 0, color: "bg-emerald-400", total: stats?.totalUsers ?? 1 },
                    { label: "Students", count: stats?.totalStudents ?? 0, color: "bg-violet-400", total: stats?.totalUsers ?? 1 },
                  ].map((r) => {
                    const pct = Math.round((r.count / r.total) * 100);
                    return (
                      <div key={r.label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-muted-foreground">{r.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Org Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
              : (
                <div className="space-y-3">
                  {[
                    { label: "Active Orgs", count: stats?.activeOrgs ?? 0, color: "bg-emerald-400", total: stats?.totalOrgs ?? 1 },
                    { label: "Paused Orgs", count: stats?.pausedOrgs ?? 0, color: "bg-amber-400", total: stats?.totalOrgs ?? 1 },
                    { label: "Paid Orgs", count: stats?.paidOrgs ?? 0, color: "bg-blue-400", total: stats?.totalOrgs ?? 1 },
                    { label: "Unpaid Orgs", count: stats?.unpaidOrgs ?? 0, color: "bg-red-400", total: stats?.totalOrgs ?? 1 },
                  ].map((r) => {
                    const pct = r.total ? Math.round((r.count / r.total) * 100) : 0;
                    return (
                      <div key={r.label} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{r.label}</span>
                          <span className="text-muted-foreground">{r.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${r.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>

      {/* PostHog integration */}
      <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4 text-orange-400" /> Visitor Analytics (PostHog)
            </CardTitle>
            <Badge variant="outline" className="text-xs text-orange-400 border-orange-400/30">Connected</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            PostHog is integrated for visitor tracking, session recordings, funnel analysis, and conversion events.
            Open the PostHog dashboard to view detailed visitor analytics.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {["Page views & sessions", "Conversion funnels", "User recordings", "Event tracking"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <Button variant="outline" className="gap-2 border-orange-400/30 text-orange-400 hover:bg-orange-500/10" asChild>
            <a href="https://app.posthog.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Open PostHog Dashboard
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
