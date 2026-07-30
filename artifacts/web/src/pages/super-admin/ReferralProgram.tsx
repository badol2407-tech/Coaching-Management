import { useListOrganizations } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Gift, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferralProgram() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const { toast } = useToast();

  // Simulate referral data from org metadata
  const orgsWithReferral = orgs.filter((o: any) => o.referredBy);
  const totalReferrals = orgsWithReferral.length;

  const copyLink = (orgId: string) => {
    const link = `${window.location.origin}?ref=${orgId}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Referral link copied" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground text-sm mt-1">Track referrals and word-of-mouth growth</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0"><Share2 className="h-4 w-4 text-violet-400" /></div>
            <div><p className="text-sm text-muted-foreground">Total Referrals</p><p className="text-2xl font-bold mt-0.5">{totalReferrals}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0"><Gift className="h-4 w-4 text-emerald-400" /></div>
            <div><p className="text-sm text-muted-foreground">Converted</p><p className="text-2xl font-bold mt-0.5">{orgsWithReferral.filter((o: any) => o.paymentStatus === "paid").length}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0"><TrendingUp className="h-4 w-4 text-blue-400" /></div>
            <div><p className="text-sm text-muted-foreground">Conversion Rate</p><p className="text-2xl font-bold mt-0.5">{totalReferrals ? Math.round((orgsWithReferral.filter((o: any) => o.paymentStatus === "paid").length / totalReferrals) * 100) : 0}%</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Referral links for each org */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-400" /> Organization Referral Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
          ) : orgs.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-sm">No organizations found</p>
          ) : (
            <div className="space-y-2">
              {orgs.slice(0, 20).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0 text-xs font-bold text-violet-400">
                      {(o.name || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{o.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{`?ref=${o.id}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {o.referredBy && <Badge variant="outline" className="text-xs text-violet-400">Referred</Badge>}
                    <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={() => copyLink(o.id)}>
                      <Copy className="h-3 w-3" /> Copy Link
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
        <CardHeader><CardTitle className="text-base">How the Referral Program Works</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { step: "1", title: "Share Link", desc: "Each org gets a unique referral link with their org ID" },
              { step: "2", title: "New Sign-up", desc: "When someone signs up via the link, referredBy is stored in Firestore" },
              { step: "3", title: "Track & Reward", desc: "Monitor conversions here and manually apply rewards or credits" },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="h-7 w-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">{s.step}</div>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
