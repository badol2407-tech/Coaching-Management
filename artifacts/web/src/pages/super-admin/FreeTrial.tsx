import { useListOrganizations, useUpdateOrganization, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gift, ArrowUpRight } from "lucide-react";

export default function FreeTrial() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const updateOrg = useUpdateOrganization();
  const { user } = useAuth();
  const { toast } = useToast();

  const trialOrgs = orgs.filter((o: any) => !o.plan || o.plan === "free");

  const handleUpgrade = async (o: any, plan: string) => {
    await updateOrg.mutateAsync({ id: o.id, data: { plan } });
    await logSuperAdminAction({ action: "upgrade_plan", actorEmail: user?.email ?? "", targetId: o.id, orgName: o.name, details: { from: "free", to: plan } });
    toast({ title: `${o.name} upgraded to ${plan}` });
  };

  const daysSince = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Free Trials</h1>
        <p className="text-muted-foreground text-sm mt-1">Organizations currently on the free plan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0"><Gift className="h-4 w-4 text-amber-400" /></div>
          <div><p className="text-sm text-muted-foreground">On Free Plan</p><p className="text-2xl font-bold mt-0.5">{trialOrgs.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Conversion Opportunity</p>
          <p className="text-2xl font-bold mt-0.5 text-emerald-400">৳{(trialOrgs.length * 749).toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo potential</span></p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">Active (not paused)</p>
          <p className="text-2xl font-bold mt-0.5">{trialOrgs.filter((o: any) => o.status !== "paused").length}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Gift className="h-4 w-4" /> Free Trial Organizations</CardTitle></CardHeader>
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
                    <th className="text-left py-2 pr-4 font-medium">Days Since Join</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Upgrade</th>
                  </tr>
                </thead>
                <tbody>
                  {trialOrgs.map((o: any) => {
                    const days = daysSince(o.createdAt);
                    return (
                      <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                        <td className="py-2.5 pr-4">
                          <span className={days > 7 ? "text-red-400 font-semibold" : "text-muted-foreground"}>
                            {days}d {days > 7 && <span className="text-xs">(expired)</span>}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={o.status === "paused" ? "secondary" : "default"} className="text-xs capitalize">{o.status || "active"}</Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleUpgrade(o, "basic")}>
                              <ArrowUpRight className="h-3 w-3" /> Founder
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleUpgrade(o, "pro")}>
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
