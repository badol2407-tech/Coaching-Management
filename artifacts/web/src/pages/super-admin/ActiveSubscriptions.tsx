import { useListOrganizations, useUpdateOrganization, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Zap, Building2, PauseCircle, PlayCircle, ArrowUpDown } from "lucide-react";

const PLAN_PRICE: Record<string, number> = { free: 0, basic: 749, pro: Math.round(9999 / 12) };

export default function ActiveSubscriptions() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const updateOrg = useUpdateOrganization();
  const { user } = useAuth();
  const { toast } = useToast();

  const paid = orgs.filter((o: any) => o.paymentStatus === "paid" && o.plan !== "free");
  const mrr = paid.reduce((s: number, o: any) => s + (PLAN_PRICE[o.plan] ?? 0), 0);

  const handleTogglePause = async (o: any) => {
    const next = o.status === "paused" ? "active" : "paused";
    await updateOrg.mutateAsync({ id: o.id, data: { status: next } });
    await logSuperAdminAction({ action: `${next}_org`, actorEmail: user?.email ?? "", targetId: o.id, orgName: o.name });
    toast({ title: `Organization ${next}` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Active Subscriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">Paying organizations with live subscriptions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><Zap className="h-4 w-4 text-emerald-400" /></div>
          <div><p className="text-sm text-muted-foreground">Active Paid Subs</p><p className="text-2xl font-bold mt-0.5">{paid.filter((o: any) => o.status !== "paused").length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"><Building2 className="h-4 w-4 text-blue-400" /></div>
          <div><p className="text-sm text-muted-foreground">Paused</p><p className="text-2xl font-bold mt-0.5">{paid.filter((o: any) => o.status === "paused").length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="pt-5 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0"><ArrowUpDown className="h-4 w-4 text-violet-400" /></div>
          <div><p className="text-sm text-muted-foreground">MRR</p><p className="text-2xl font-bold mt-0.5">৳{mrr.toLocaleString()}</p></div>
        </CardContent></Card>
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
                    <th className="text-left py-2 pr-4 font-medium">Monthly Value</th>
                    <th className="text-left py-2 pr-4 font-medium">Status</th>
                    <th className="text-right py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paid.map((o: any) => (
                    <tr key={o.id} className="border-b border-border/50 hover:bg-accent/30">
                      <td className="py-2.5 pr-4 font-medium">{o.name}</td>
                      <td className="py-2.5 pr-4"><Badge variant="outline" className="capitalize text-xs">{o.plan}</Badge></td>
                      <td className="py-2.5 pr-4 font-mono text-sm">৳{(PLAN_PRICE[o.plan] ?? 0).toLocaleString()}</td>
                      <td className="py-2.5 pr-4">
                        <Badge variant={o.status === "paused" ? "secondary" : "default"} className="text-xs capitalize">{o.status || "active"}</Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => handleTogglePause(o)}>
                          {o.status === "paused" ? <><PlayCircle className="h-3 w-3" /> Resume</> : <><PauseCircle className="h-3 w-3" /> Pause</>}
                        </Button>
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
