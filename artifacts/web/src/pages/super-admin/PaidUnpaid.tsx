import { useListOrganizations, useUpdateOrganization, useAddPaymentRecord, logSuperAdminAction } from "@/lib/super-admin-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, CreditCard } from "lucide-react";

export default function PaidUnpaid() {
  const { data: orgs = [], isLoading } = useListOrganizations();
  const updateOrg = useUpdateOrganization();
  const addPayment = useAddPaymentRecord();
  const { user } = useAuth();
  const { toast } = useToast();

  const [payDialog, setPayDialog] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");

  const paid = orgs.filter((o: any) => o.paymentStatus === "paid");
  const unpaid = orgs.filter((o: any) => o.paymentStatus !== "paid");

  const handleMarkPaid = async (o: any) => {
    setPayDialog(o);
    setPayAmount("");
    setPayNote("");
  };

  const confirmPayment = async () => {
    if (!payDialog) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return; }
    await updateOrg.mutateAsync({ id: payDialog.id, data: { paymentStatus: "paid" } });
    await addPayment.mutateAsync({ orgId: payDialog.id, orgName: payDialog.name, amount, plan: payDialog.plan || "free", month: new Date().toISOString().slice(0, 7), note: payNote });
    await logSuperAdminAction({ action: "mark_paid", actorEmail: user?.email ?? "", targetId: payDialog.id, orgName: payDialog.name, details: { amount } });
    toast({ title: `${payDialog.name} marked as paid` });
    setPayDialog(null);
  };

  const handleMarkUnpaid = async (o: any) => {
    await updateOrg.mutateAsync({ id: o.id, data: { paymentStatus: "unpaid" } });
    await logSuperAdminAction({ action: "mark_unpaid", actorEmail: user?.email ?? "", targetId: o.id, orgName: o.name });
    toast({ title: `${o.name} marked as unpaid` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paid / Unpaid Organizations</h1>
        <p className="text-muted-foreground text-sm mt-1">Track payment status across all organizations</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="pt-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
            <div><p className="text-sm text-muted-foreground">Paid</p><p className="text-3xl font-bold text-emerald-400">{paid.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-5 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
            <div><p className="text-sm text-muted-foreground">Unpaid</p><p className="text-3xl font-bold text-red-400">{unpaid.length}</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Paid */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Paid Organizations</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
              : paid.length === 0 ? <p className="text-center text-muted-foreground py-8 text-sm">No paid orgs</p>
              : <div className="space-y-2">
                {paid.map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{o.name}</p>
                      <Badge variant="outline" className="text-xs mt-0.5 capitalize">{o.plan || "free"}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground hover:text-destructive" onClick={() => handleMarkUnpaid(o)}>Mark Unpaid</Button>
                  </div>
                ))}
              </div>
            }
          </CardContent>
        </Card>

        {/* Unpaid */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><XCircle className="h-4 w-4 text-red-400" /> Unpaid Organizations</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><div className="animate-spin h-5 w-5 border-b-2 border-primary rounded-full" /></div>
              : unpaid.length === 0 ? <p className="text-center text-muted-foreground py-8 text-sm">All orgs are paid! 🎉</p>
              : <div className="space-y-2">
                {unpaid.map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{o.name}</p>
                      <Badge variant="outline" className="text-xs mt-0.5 capitalize">{o.plan || "free"}</Badge>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={() => handleMarkPaid(o)}>
                      <CreditCard className="h-3 w-3" /> Mark Paid
                    </Button>
                  </div>
                ))}
              </div>
            }
          </CardContent>
        </Card>
      </div>

      {/* Payment dialog */}
      <Dialog open={!!payDialog} onOpenChange={() => setPayDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Record Payment — {payDialog?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Amount (৳)</Label>
              <Input type="number" placeholder="e.g. 749" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Note (optional)</Label>
              <Input placeholder="e.g. bKash payment" value={payNote} onChange={(e) => setPayNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(null)}>Cancel</Button>
            <Button onClick={confirmPayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
