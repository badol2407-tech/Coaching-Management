import { useState } from "react";
import { useListPopupOffers, useCreatePopupOffer, useUpdatePopupOffer, useDeletePopupOffer } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";

const EMPTY = { title: "", description: "", cta: "", active: true, startDate: "", endDate: "" };

export default function PopupOffers() {
  const { data: offers = [], isLoading } = useListPopupOffers();
  const create = useCreatePopupOffer();
  const update = useUpdatePopupOffer();
  const remove = useDeletePopupOffer();
  const { toast } = useToast();

  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; data: typeof EMPTY; id?: string } | null>(null);

  const openCreate = () => setDialog({ mode: "create", data: { ...EMPTY } });
  const openEdit = (o: any) => setDialog({ mode: "edit", data: { title: o.title, description: o.description, cta: o.cta, active: o.active, startDate: o.startDate || "", endDate: o.endDate || "" }, id: o.id });

  const handleSave = async () => {
    if (!dialog) return;
    if (!dialog.data.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    if (dialog.mode === "create") {
      await create.mutateAsync(dialog.data);
      toast({ title: "Popup offer created" });
    } else {
      await update.mutateAsync({ id: dialog.id!, data: dialog.data });
      toast({ title: "Popup offer updated" });
    }
    setDialog(null);
  };

  const handleToggle = async (o: any) => {
    await update.mutateAsync({ id: o.id, data: { active: !o.active } });
    toast({ title: o.active ? "Offer hidden" : "Offer activated" });
  };

  const handleDelete = async (o: any) => {
    if (!confirm(`Delete "${o.title}"?`)) return;
    await remove.mutateAsync({ id: o.id });
    toast({ title: "Offer deleted" });
  };

  const set = (key: string, val: any) => setDialog((d) => d ? { ...d, data: { ...d.data, [key]: val } } : d);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Popup Offers & Banners</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage promotional popups shown on the landing page</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> New Offer</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total Offers</p><p className="text-3xl font-bold mt-1">{offers.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold mt-1 text-green-500">{offers.filter((o: any) => o.active).length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Inactive</p><p className="text-3xl font-bold mt-1 text-muted-foreground">{offers.filter((o: any) => !o.active).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-violet-400" /> All Popup Offers</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
            : offers.length === 0 ? <p className="text-center text-muted-foreground py-10 text-sm">No popup offers yet. Create your first one.</p>
            : <div className="space-y-3">
              {offers.map((o: any) => (
                <div key={o.id} className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{o.title}</p>
                      <Badge variant={o.active ? "default" : "secondary"} className="text-xs">{o.active ? "Active" : "Hidden"}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{o.description}</p>
                    {o.cta && <p className="text-xs text-primary">CTA: {o.cta}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <Button size="icon" variant="ghost" className="h-7 w-7" title={o.active ? "Hide" : "Show"} onClick={() => handleToggle(o)}>
                      {o.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(o)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(o)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          }
        </CardContent>
      </Card>

      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{dialog?.mode === "create" ? "New Popup Offer" : "Edit Popup Offer"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5"><Label>Title *</Label><Input value={dialog?.data.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 🎉 Limited Time Offer!" /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} className="resize-none" value={dialog?.data.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Offer details…" /></div>
            <div className="space-y-1.5"><Label>CTA Button Text</Label><Input value={dialog?.data.cta ?? ""} onChange={(e) => set("cta", e.target.value)} placeholder="e.g. Claim Offer" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={dialog?.data.startDate ?? ""} onChange={(e) => set("startDate", e.target.value)} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={dialog?.data.endDate ?? ""} onChange={(e) => set("endDate", e.target.value)} /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="offerActive" checked={!!dialog?.data.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 rounded" />
              <Label htmlFor="offerActive" className="cursor-pointer">Active (show on landing page)</Label>
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
