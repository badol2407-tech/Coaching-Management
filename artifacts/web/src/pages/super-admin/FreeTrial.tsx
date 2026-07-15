import { useListOrganizations, useUpdateOrganization, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_TIERS, PLAN_CONFIG, PlanTier, getEffectiveTier, computeExpiryDate } from "@/lib/plan-config";
import { getOrgAccessStatus, getRemainingDays, formatExpiryDate } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gift, ArrowUpRight, Clock, AlertTriangle } from "lucide-react";

export default function FreeTrial() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const updateOrg = useUpdateOrganization();
  const { user } = useAuth();
  const { toast } = useToast();

  const trialOrgs = (orgs as any[]).filter((o) => getEffectiveTier(o) === "free_trial");
  const expiredTrials = trialOrgs.filter((o) => getOrgAccessStatus(o) === "expired");
  const activeTrials = trialOrgs.filter((o) => getOrgAccessStatus(o) === "active");

  const handleUpgrade = async (o: any, newTier: PlanTier) => {
    const startDate = new Date();
    const expiryDate = computeExpiryDate(newTier, startDate);
    await updateOrg.mutateAsync({
      id: o.id,
      data: {
        tier: newTier,
        plan: PLAN_CONFIG[newTier].id === "founder_launch" ? "basic" : "pro", // backward compat
        subscriptionStartDate: startDate.toISOString(),
        subscriptionExpiryDate: expiryDate.toISOString(),
        paymentStatus: "unpaid", // admin should separately mark as paid
      },
    });
    await logSuperAdminAction({
      action: `Upgraded org "${o.name}" from free_trial to ${newTier}`,
      actorEmail: user?.email ?? "", targetId: o.id, orgName: o.name,
      details: { from: "free_trial", to: newTier },
    });
    toast({ title: `${o.name} upgraded to ${PLAN_CONFIG[newTier].name}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Free Trials</h1>
        <p className="text-muted-foreground text-sm mt-1">Organizations on the 7-day Free Trial plan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total on Free Trial</p>
              <p className="text-2xl font-bold mt-0.5">{trialOrgs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired Trials</p>
              <p className="text-2xl font-bold mt-0.5 text-rose-400">{expiredTrials.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">Conversion Opportunity</p>
            <p className="text-2xl font-bold mt-0.5 text-emerald-400">
              ৳{(trialOrgs.length * 749).toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo potential</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Gift className="h-4 w-4" /> Free Trial Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
          ) : trialOrgs.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No free trial organizations</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Organization</th>
                    <th className="text-left py-2 pr-4 font-medium">Expiry</th>
                    <th className="text-left py-2 pr-4 font-medium">Remaining</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Upgrade</th>
                  </tr>
                </thead>
                <tbody>
                  {trialOrgs.map((o: any) => {
                    const remaining = getRemainingDays(o.subscriptionExpiryDate);
                    const status = getOrgAccessStatus(o);
                    return (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground text-xs">
                          {o.subscriptionExpiryDate ? formatExpiryDate(o.subscriptionExpiryDate) : "—"}
                        </td>
                        <td className="py-2.5 pr-4">
                          {remaining !== null ? (
                            <span className={`font-semibold ${remaining <= 0 ? "text-rose-400" : remaining <= 2 ? "text-amber-400" : "text-emerald-400"}`}>
                              {remaining > 0 ? `${remaining}d` : "Expired"}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={status === "active" ? "default" : "secondary"} className="text-xs capitalize">
                            {status === "expired" ? "Expired" : status === "paused" ? "Paused" : "Active"}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleUpgrade(o, "founder_launch")}>
                              <ArrowUpRight className="h-3 w-3" /> Founder
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleUpgrade(o, "annual_premium")}>
                              <ArrowUpRight className="h-3 w-3" /> Annual
                            </Button>
                          </div>
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
