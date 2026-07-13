import { useState } from "react";
import { useListCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Copy } from "lucide-react";

const EMPTY = { code: "", discount: 10, type: "percent", maxUses: 100, expiresAt: "", active: true };

export default function CouponCodes() {
  const { data: coupons = [], isLoading } = useListCoupons();
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
  const remove = useDeleteCoupon();
  const { toast } = useToast();

  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; data: typeof EMPTY; id?: string } | null>(null);

  const openCreate = () => setDialog({ mode: "create", data: { ...EMPTY } });
  const openEdit = (c: any) => setDialog({ mode: "edit", data: { code: c.code, discount: c.discount, type: c.type, maxUses: c.maxUses, expiresAt: c.expiresAt || "", active: c.active }, id: c.id });

  const handleSave = async () => {
    if (!dialog) return;
    const code = dialog.data.code.trim().toUpperCase();
    if (!code) { toast({ title: "Code is required", variant: "destructive" }); return; }
    if (!dialog.data.discount || dialog.data.discount <= 0) { toast({ title: "Enter a valid discount", variant: "destructive" }); return; }
    const payload = { ...dialog.data, code };
    if (dialog.mode === "create") {
      await create.mutateAsync(payload);
      toast({ title: "Coupon created" });
    } else {
      await update.mutateAsync({ id: dialog.id!, data: payload });
      toast({ title: "Coupon updated" });
    }
    setDialog(null);
  };

  const handleToggle = async (c: any) => {
    await update.mutateAsync({ id: c.id, data: { active: !c.active } });
    toast({ title: c.active ? "Coupon deactivated" : "Coupon activated" });
  };

  const handleDelete = async (c: any) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    await remove.mutateAsync({ id: c.id });
    toast({ title: "Coupon deleted" });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: `Copied: ${code}` });
  };

  const set = (key: string, val: any) => setDialog((d) => d ? { ...d, data: { ...d.data, [key]: val } } : d);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupon Codes</h1>
          <p className="text-muted-foreground text-sm mt-1">Create and manage discount coupons for subscriptions</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Coupon</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total Coupons</p><p className="text-3xl font-bold mt-1">{coupons.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold mt-1 text-green-500">{coupons.filter((c: any) => c.active).length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total Uses</p><p className="text-3xl font-bold mt-1">{coupons.reduce((s: number, c: any) => s + (c.uses || 0), 0)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4 text-violet-400" /> All Coupons</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
            : coupons.length === 0 ? <p className="text-center text-muted-foreground py-10 text-sm">No coupons yet. Create your first one.</p>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-2 pr-4 font-medium">Code</th>
                      <th className="text-left py-2 pr-4 font-medium">Discount</th>
                      <th className="text-left py-2 pr-4 font-medium">Uses</th>
                      <th className="text-left py-2 pr-4 font-medium">Expires</th>
                      <th className="text-left py-2 pr-4 font-medium">Status</th>
                      <th className="text-right py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c: any) => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-2.5 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-primary">{c.code}</span>
                            <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => copyCode(c.code)}><Copy className="h-3 w-3" /></Button>
                          </div>
                        </td>
                        <td className="py-2.5 pr-4 font-semibold">{c.type === "percent" ? `${c.discount}%` : `৳${c.discount}`}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{c.uses || 0}/{c.maxUses}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground text-xs">{c.expiresAt || "—"}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={c.active ? "default" : "secondary"} className="text-xs">{c.active ? "Active" : "Inactive"}</Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleToggle(c)}>
                              {c.active ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </CardContent>
      </Card>

      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{dialog?.mode === "create" ? "New Coupon Code" : "Edit Coupon"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Code *</Label><Input className="font-mono uppercase" value={dialog?.data.code ?? ""} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="e.g. LAUNCH50" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={dialog?.data.type ?? "percent"} onValueChange={(v) => set("type", v)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="percent">Percent (%)</SelectItem><SelectItem value="flat">Flat (৳)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Discount</Label><Input type="number" min={1} value={dialog?.data.discount ?? ""} onChange={(e) => set("discount", Number(e.target.value))} placeholder="e.g. 20" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Max Uses</Label><Input type="number" min={1} value={dialog?.data.maxUses ?? ""} onChange={(e) => set("maxUses", Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Expires At</Label><Input type="date" value={dialog?.data.expiresAt ?? ""} onChange={(e) => set("expiresAt", e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="couponActive" checked={!!dialog?.data.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 rounded" />
              <Label htmlFor="couponActive" className="cursor-pointer">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={create.isPending || update.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
