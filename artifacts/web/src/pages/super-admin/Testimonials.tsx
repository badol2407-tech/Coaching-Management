import { useState } from "react";
import { useListTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/lib/super-admin-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2, Eye, EyeOff, Pencil, Star } from "lucide-react";

const EMPTY = { name: "", role: "", text: "", rating: 5, avatar: "", active: true };

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useListTestimonials();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();
  const { toast } = useToast();

  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; data: typeof EMPTY; id?: string } | null>(null);

  const openCreate = () => setDialog({ mode: "create", data: { ...EMPTY } });
  const openEdit = (t: any) => setDialog({ mode: "edit", data: { name: t.name, role: t.role, text: t.text, rating: t.rating ?? 5, avatar: t.avatar || "", active: t.active }, id: t.id });

  const handleSave = async () => {
    if (!dialog) return;
    if (!dialog.data.name.trim() || !dialog.data.text.trim()) { toast({ title: "Name and text are required", variant: "destructive" }); return; }
    if (dialog.mode === "create") {
      await create.mutateAsync(dialog.data);
      toast({ title: "Testimonial added" });
    } else {
      await update.mutateAsync({ id: dialog.id!, data: dialog.data });
      toast({ title: "Testimonial updated" });
    }
    setDialog(null);
  };

  const handleToggle = async (t: any) => {
    await update.mutateAsync({ id: t.id, data: { active: !t.active } });
    toast({ title: t.active ? "Testimonial hidden" : "Testimonial shown" });
  };

  const handleDelete = async (t: any) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    await remove.mutateAsync({ id: t.id });
    toast({ title: "Testimonial deleted" });
  };

  const set = (key: string, val: any) => setDialog((d) => d ? { ...d, data: { ...d.data, [key]: val } } : d);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage customer reviews shown on the landing page</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add Testimonial</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Total</p><p className="text-3xl font-bold mt-1">{testimonials.length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold mt-1 text-green-500">{testimonials.filter((t: any) => t.active).length}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-sm text-muted-foreground">Avg Rating</p><p className="text-3xl font-bold mt-1 text-amber-400">{testimonials.length ? (testimonials.reduce((s: number, t: any) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1) : "—"}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-violet-400" /> All Testimonials</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" /></div>
            : testimonials.length === 0 ? <p className="text-center text-muted-foreground py-10 text-sm">No testimonials yet. Add your first one.</p>
            : <div className="space-y-3">
              {testimonials.map((t: any) => (
                <div key={t.id} className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                      <Badge variant={t.active ? "default" : "secondary"} className="text-xs">{t.active ? "Active" : "Hidden"}</Badge>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < (t.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.text}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleToggle(t)}>
                      {t.active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(t)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          }
        </CardContent>
      </Card>

      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{dialog?.mode === "create" ? "Add Testimonial" : "Edit Testimonial"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Name *</Label><Input value={dialog?.data.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="John Doe" /></div>
              <div className="space-y-1.5"><Label>Role / Center</Label><Input value={dialog?.data.role ?? ""} onChange={(e) => set("role", e.target.value)} placeholder="Principal, ABC Coaching" /></div>
            </div>
            <div className="space-y-1.5"><Label>Review Text *</Label><Textarea rows={3} className="resize-none" value={dialog?.data.text ?? ""} onChange={(e) => set("text", e.target.value)} placeholder="Their experience with EduTrack…" /></div>
            <div className="space-y-1.5">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => set("rating", r)}>
                    <Star className={`h-5 w-5 transition-colors ${r <= (dialog?.data.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-border"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5"><Label>Avatar URL (optional)</Label><Input value={dialog?.data.avatar ?? ""} onChange={(e) => set("avatar", e.target.value)} placeholder="https://…" /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="testimonialActive" checked={!!dialog?.data.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 rounded" />
              <Label htmlFor="testimonialActive" className="cursor-pointer">Show on landing page</Label>
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
