import { useListOrganizations, useUpdateOrganization, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { PLAN_CONFIG, getEffectiveTier, getMonthlyEquivalent } from "@/lib/plan-config";
import { getOrgAccessStatus, getRemainingDays, formatExpiryDate } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap, Building2, PauseCircle, PlayCircle, TrendingUp, CalendarClock } from "lucide-react";

export default function ActiveSubscriptions() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const updateOrg = useUpdateOrganization();
  const { user } = useAuth();
  const { toast } = useToast();

  // Paid orgs that are NOT on free trial
  const paid = (orgs as any[]).filter((o: any) => o.paymentStatus === "paid" && getEffectiveTier(o) !== "free_trial");
  const activePaid = paid.filter((o) => getOrgAccessStatus(o) === "active");
  const pausedPaid = paid.filter((o) => getOrgAccessStatus(o) === "paused");
  const expiredPaid = paid.filter((o) => getOrgAccessStatus(o) === "expired");
  const mrr = activePaid.reduce((s: number, o: any) => s + getMonthlyEquivalent(getEffectiveTier(o)), 0);

  const handleTogglePause = async (o: any) => {
    const isPaused = (o.accountStatus ?? o.status) === "paused";
    const next = isPaused ? "active" : "paused";
    await updateOrg.mutateAsync({ id: o.id, data: { accountStatus: next, status: next } });
    await logSuperAdminAction({ action: `${next}_org`, actorEmail: user?.email ?? "", targetId: o.id, orgName: o.name });
    toast({ title: `Organization ${next}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Active Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">Paying organizations with live subscriptions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Paid</p>
              <p className="text-2xl font-bold mt-0.5">{activePaid.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <PauseCircle className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paused</p>
              <p className="text-2xl font-bold mt-0.5">{pausedPaid.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <CalendarClock className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold mt-0.5 text-amber-400">{expiredPaid.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">MRR</p>
              <p className="text-2xl font-bold mt-0.5">৳{mrr.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Subscription List</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
          ) : paid.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No paid subscriptions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-medium">Organization</th>
                    <th className="text-left py-2 pr-4 font-medium">Plan</th>
                    <th className="text-left py-2 pr-4 font-medium">MRR</th>
                    <th className="text-left py-2 pr-4 font-medium">Expiry</th>
                    <th className="text-left py-2 pr-4 font-medium">Days Left</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paid.map((o: any) => {
                    const tier = getEffectiveTier(o);
                    const remaining = getRemainingDays(o.subscriptionExpiryDate);
                    const status = getOrgAccessStatus(o);
                    return (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant="outline" className="text-xs">{PLAN_CONFIG[tier].name}</Badge>
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-sm">৳{getMonthlyEquivalent(tier).toLocaleString()}</td>
                        <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                          {formatExpiryDate(o.subscriptionExpiryDate)}
                        </td>
                        <td className="py-2.5 pr-4">
                          {remaining !== null ? (
                            <span className={`font-semibold text-xs ${remaining <= 0 ? "text-rose-400" : remaining <= 7 ? "text-amber-400" : "text-emerald-400"}`}>
                              {remaining > 0 ? `${remaining}d` : "Expired"}
                            </span>
                          ) : <span className="text-muted-foreground text-xs">—</span>}
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={status === "active" ? "default" : "secondary"} className="text-xs capitalize">
                            {status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => handleTogglePause(o)}>
                            {(o.accountStatus ?? o.status) === "paused"
                              ? <><PlayCircle className="h-3 w-3" /> Resume</>
                              : <><PauseCircle className="h-3 w-3" /> Pause</>}
                          </Button>
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
