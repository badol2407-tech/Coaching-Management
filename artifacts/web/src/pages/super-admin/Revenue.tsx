import { useSuperAdminDetailedStats, useListPaymentHistory } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Building2, BarChart3 } from "lucide-react";

export default function Revenue() {
  const { data: stats, isLoading: statsLoading } = useSuperAdminDetailedStats();
  const { data: payments = [], isLoading: pmtLoading } = useListPaymentHistory();

  const planLabels: Record<string, string> = { free: "Free", basic: "Founder Launch", pro: "Annual Premium" };
  const planColors: Record<string, string> = { free: "bg-slate-400", basic: "bg-amber-400", pro: "bg-violet-400" };

  const totalFromPayments = payments.reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);

  // Group payments by month
  const byMonth: Record<string, number> = {};
  payments.forEach((p: any) => {
    const month = p.month || p.createdAt?.slice(0, 7) || "unknown";
    byMonth[month] = (byMonth[month] || 0) + (Number(p.amount) || 0);
  });
  const monthEntries = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a)).slice(0, 6);
  const maxVal = Math.max(...monthEntries.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Revenue</h1>
        <p className="text-muted-foreground text-sm mt-1">Monthly recurring revenue and total platform earnings</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: `৳${(stats?.mrr ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Revenue", value: `৳${(totalFromPayments || stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Paid Orgs", value: String(stats?.paidOrgs ?? 0), icon: Building2, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Unpaid Orgs", value: String(stats?.unpaidOrgs ?? 0), icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-5 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold mt-0.5">{statsLoading ? "…" : m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Plan breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Plan</CardTitle></CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
            ) : (
              <div className="space-y-4">
                {stats && Object.entries(stats.planBreakdown).map(([plan, count]) => {
                  const prices: Record<string, number> = { free: 0, basic: 749, pro: Math.round(9999 / 12) };
                  const rev = (count as number) * (prices[plan] ?? 0);
                  const pct = stats.totalOrgs ? Math.round(((count as number) / stats.totalOrgs) * 100) : 0;
                  return (
                    <div key={plan} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${planColors[plan] ?? "bg-slate-400"}`} />
                          <span className="font-medium">{planLabels[plan] ?? plan}</span>
                          <Badge variant="outline" className="text-xs">{count as number} orgs</Badge>
                        </div>
                        <span className="text-muted-foreground">৳{rev.toLocaleString()}/mo</span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${planColors[plan] ?? "bg-slate-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly revenue chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            {pmtLoading ? (
              <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
            ) : monthEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-sm">No payment records yet</p>
            ) : (
              <div className="space-y-3">
                {monthEntries.map(([month, amount]) => (
                  <div key={month} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{month}</span>
                      <span className="font-semibold">৳{amount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round((amount / maxVal) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent payments */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Payments</CardTitle></CardHeader>
        <CardContent>
          {pmtLoading ? (
            <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
          ) : payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No payments recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Organization</th>
                    <th className="text-left py-2 pr-4 font-medium">Plan</th>
                    <th className="text-left py-2 pr-4 font-medium">Month</th>
                    <th className="text-right py-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 10).map((p: any) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-accent/30">
                      <td className="py-2.5 pr-4 font-medium">{p.orgName || p.orgId}</td>
                      <td className="py-2.5 pr-4"><Badge variant="outline" className="text-xs capitalize">{p.plan}</Badge></td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{p.month}</td>
                      <td className="py-2.5 text-right font-semibold">৳{Number(p.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
