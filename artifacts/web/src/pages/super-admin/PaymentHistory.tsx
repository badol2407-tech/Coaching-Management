import { useListPaymentHistory, useListOrganizations } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp } from "lucide-react";

export default function PaymentHistory() {
  const { data: payments = [], isLoading } = useListPaymentHistory();
  const { data: orgs = [] } = useListOrganizations();

  const totalRevenue = (payments as any[]).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const paidOrgs = (orgs as any[]).filter((o) => o.paymentStatus === "paid");
  const unpaidOrgs = (orgs as any[]).filter((o) => o.paymentStatus !== "paid");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">All recorded subscription payments</p>
      </div>

      {/* Revenue summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{(payments as any[]).length} payment records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid This Cycle</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidOrgs.length}</div>
            <p className="text-xs text-muted-foreground">organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid This Cycle</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unpaidOrgs.length}</div>
            <p className="text-xs text-muted-foreground">organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Paid orgs status */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm text-green-700">✓ Paid Organizations</CardTitle></CardHeader>
          <CardContent>
            {paidOrgs.length === 0 ? (
              <p className="text-muted-foreground text-sm py-2">No paid organizations yet.</p>
            ) : (
              <div className="space-y-2">
                {paidOrgs.map((org: any) => (
                  <div key={org.id} className="flex justify-between items-center py-1.5 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.adminEmail}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{org.plan ?? "free"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-red-600">✗ Unpaid Organizations</CardTitle></CardHeader>
          <CardContent>
            {unpaidOrgs.length === 0 ? (
              <p className="text-muted-foreground text-sm py-2">All organizations are paid!</p>
            ) : (
              <div className="space-y-2">
                {unpaidOrgs.map((org: any) => (
                  <div key={org.id} className="flex justify-between items-center py-1.5 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.adminEmail}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize border-red-200 text-red-600">{org.plan ?? "free"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment records */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-muted/30 rounded-lg" />)}
            </div>
          ) : (payments as any[]).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No payment records yet. Use "Record Payment" in Organizations to log payments.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="pb-2 font-medium">Organization</th>
                    <th className="pb-2 font-medium">Plan</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Month</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(payments as any[]).map((p: any) => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="py-2.5 font-medium">{p.orgName}</td>
                      <td className="py-2.5 capitalize">{p.plan}</td>
                      <td className="py-2.5 font-mono text-emerald-700">৳{Number(p.amount).toLocaleString()}</td>
                      <td className="py-2.5">{p.month}</td>
                      <td className="py-2.5 text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="py-2.5 text-muted-foreground text-xs">{p.note ?? "—"}</td>
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
