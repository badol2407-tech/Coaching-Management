import { useListOrganizations } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Building2, Users, TrendingUp } from "lucide-react";

const PLANS = [
  { id: "free", label: "Free Trial", price: 0, color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20", badge: "default" as const, desc: "7-day full access, no credit card" },
  { id: "basic", label: "Founder Launch", price: 749, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", badge: "default" as const, desc: "Launch price for first 100 centers" },
  { id: "pro", label: "Annual Premium", price: 9999, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", badge: "default" as const, desc: "Best value — 2 months free", priceSuffix: "/year" },
];

export default function PricingPlans() {
  const { data: orgs = [], isLoading } = useListOrganizations();

  const counts = {
    free: orgs.filter((o: any) => !o.plan || o.plan === "free").length,
    basic: orgs.filter((o: any) => o.plan === "basic").length,
    pro: orgs.filter((o: any) => o.plan === "pro").length,
  };

  const mrr =
    counts.basic * 749 + counts.pro * Math.round(9999 / 12);

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
              <Users className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Orgs</p>
              <p className="text-2xl font-bold mt-0.5">{counts.basic + counts.pro}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const count = counts[plan.id as keyof typeof counts];
          const pct = orgs.length ? Math.round((count / orgs.length) * 100) : 0;
          return (
            <Card key={plan.id} className={`border ${plan.bg}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${plan.color}`} />
                    <CardTitle className="text-base">{plan.label}</CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-xs ${plan.color}`}>
                    {plan.price === 0 ? "Free" : `৳${plan.price.toLocaleString()}${plan.priceSuffix ?? "/mo"}`}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{isLoading ? "…" : count}</p>
                    <p className="text-xs text-muted-foreground">organizations</p>
                  </div>
                  <p className="text-lg font-semibold text-muted-foreground">{pct}%</p>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${plan.id === "free" ? "bg-slate-400" : plan.id === "basic" ? "bg-amber-400" : "bg-violet-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {plan.price > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Revenue: ৳{(count * (plan.id === "pro" ? Math.round(plan.price / 12) : plan.price)).toLocaleString()}/mo
                  </p>
                )}
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
                    <th className="text-left py-2 pr-4 font-medium">Plan</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-left py-2 font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((o: any) => (
                    <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                      <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant="outline" className="text-xs capitalize">{o.plan || "free"}</Badge>
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge variant={o.status === "paused" ? "secondary" : "default"} className="text-xs capitalize">{o.status || "active"}</Badge>
                      </td>
                      <td className="py-2.5">
                        <Badge variant={o.paymentStatus === "paid" ? "default" : "destructive"} className="text-xs capitalize">{o.paymentStatus || "unpaid"}</Badge>
                      </td>
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
