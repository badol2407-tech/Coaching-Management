import { useListOrganizations } from "@/lib/super-admin-hooks";
import { ALL_TIERS, PLAN_CONFIG, PlanTier, getEffectiveTier, getMonthlyEquivalent } from "@/lib/plan-config";
import { getOrgAccessStatus } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Building2, TrendingUp, CheckCircle } from "lucide-react";

const TIER_STYLES: Record<PlanTier, { color: string; bg: string; bar: string }> = {
  free_trial:     { color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20",  bar: "bg-slate-400" },
  founder_launch: { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20",  bar: "bg-amber-400" },
  annual_premium: { color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", bar: "bg-violet-400" },
};

export default function PricingPlans() {
  const { data: orgs = [], isLoading } = useListOrganizations();

  const counts = ALL_TIERS.reduce((acc, t) => {
    acc[t] = (orgs as any[]).filter((o) => getEffectiveTier(o) === t).length;
    return acc;
  }, {} as Record<PlanTier, number>);

  const mrr = (orgs as any[])
    .filter((o: any) => o.paymentStatus === "paid" && getOrgAccessStatus(o) !== "paused")
    .reduce((sum, o: any) => sum + getMonthlyEquivalent(getEffectiveTier(o)), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing Plans</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform plan overview and organization distribution</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. MRR</p>
              <p className="text-2xl font-bold mt-0.5">৳{mrr.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Organizations</p>
              <p className="text-2xl font-bold mt-0.5">{orgs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Orgs</p>
              <p className="text-2xl font-bold mt-0.5">
                {(orgs as any[]).filter((o: any) => o.paymentStatus === "paid").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {ALL_TIERS.map((tier) => {
          const cfg = PLAN_CONFIG[tier];
          const count = counts[tier];
          const pct = orgs.length ? Math.round((count / orgs.length) * 100) : 0;
          const styles = TIER_STYLES[tier];
          const priceLabel = tier === "free_trial" ? "৳0 / 7 days" : tier === "founder_launch" ? "৳749/mo" : "৳9,999/yr";

          return (
            <Card key={tier} className={`border ${styles.bg}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${styles.color}`} />
                    <CardTitle className="text-base">{cfg.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-xs ${styles.color}`}>{priceLabel}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{cfg.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{isLoading ? "…" : count}</p>
                    <p className="text-xs text-muted-foreground">organizations</p>
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">{pct}%</p>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${styles.bar}`} style={{ width: `${pct}%` }} />
                </div>
                {cfg.price > 0 && (
                  <p className="text-xs text-muted-foreground">
                    MRR contribution: ৳{(count * getMonthlyEquivalent(tier)).toLocaleString()}/mo
                  </p>
                )}

                {/* Feature highlights */}
                <div className="pt-1 space-y-1">
                  {cfg.displayHighlights.slice(0, 3).map((h) => (
                    <div key={h} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CheckCircle className={`h-3 w-3 shrink-0 ${styles.color}`} />
                      {h}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Distribution table */}
      <Card>
        <CardHeader><CardTitle className="text-base">Organization Plan Details</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Organization</th>
                    <th className="text-left py-2 pr-4 font-medium">Tier</th>
                    <th className="text-left py-2 pr-4 font-medium">Access Status</th>
                    <th className="text-left py-2 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {(orgs as any[]).map((o: any) => {
                    const tier = getEffectiveTier(o);
                    const status = getOrgAccessStatus(o);
                    const statusLabel = { active: "Active", expired: "Expired", paused: "Paused", unpaid_blocked: "Unpaid" }[status];
                    return (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline" className="text-xs capitalize">{PLAN_CONFIG[tier].name}</Badge>
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={status === "active" ? "default" : "secondary"} className="text-xs">{statusLabel}</Badge>
                        </td>
                        <td className="py-2.5">
                          <Badge variant={o.paymentStatus === "paid" ? "default" : "destructive"} className="text-xs capitalize">
                            {o.paymentStatus || "unpaid"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
