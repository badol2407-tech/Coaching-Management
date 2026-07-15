import { useState } from "react";
import { useListNotices, useCreateNotice, useDeleteNotice, useNoticeSeen, getListNoticesQueryKey } from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { trackNoticeCreated } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Eye, ChevronDown, ChevronUp, Loader2, Users, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";

// ── Seen Panel (per-notice) ───────────────────────────────────────────────────

function SeenPanel({ noticeId }: { noticeId: string }) {
  const { data: seen = [], isLoading } = useNoticeSeen(noticeId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        লোড হচ্ছে…
      </div>
    );
  }

  if ((seen as any[]).length === 0) {
    return (
      <div className="py-3 px-4 text-sm text-muted-foreground flex items-center gap-2">
        <Users className="h-4 w-4" />
        এখনো কেউ দেখেনি
      </div>
    );
  }

  return (
    <div className="border-t divide-y">
      {(seen as any[]).map((s: any) => (
        <div key={s.uid} className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {(s.name ?? "?").charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{s.name ?? "—"}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(s.seenAt).toLocaleString("en-BD", { dateStyle: "short", timeStyle: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Notices() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", className: "", section: "", batch: "" });
  const [openSeenId, setOpenSeenId] = useState<string | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: notices = [], isLoading } = useListNotices();
  const { data: classes = [] } = useListClasses();
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListNoticesQueryKey() });

  const selectedClass = (classes as any[]).find((c: any) => c.name === form.className);
  const availableBatches: string[] = selectedClass?.batches ?? [];

  function handleClassChange(val: string) {
    setForm((f) => ({ ...f, className: val, batch: "" }));
  }

  function handleAdd() {
    if (!form.title.trim() || !form.content.trim() || !form.className || !form.section || !form.batch) {
      toast({ title: "সব ঘর পূরণ করুন (All fields are required)", variant: "destructive" });
      return;
    }
    createNotice.mutate(
      { data: { title: form.title, content: form.content, className: form.className, section: form.section, batch: form.batch } },
      {
        onSuccess: () => {
          trackNoticeCreated();
          toast({ title: "Notice post হয়েছে" });
          setSheetOpen(false);
          invalidate();
          setForm({ title: "", content: "", className: "", section: "", batch: "" });
        },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      },
    );
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteNotice.mutate(
      { id: deleteId },
      { onSuccess: () => { toast({ title: "Notice deleted" }); invalidate(); } },
    );
    setDeleteId(null);
  }

  function toggleSeen(id: string) {
    setOpenSeenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Post Notice
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardContent className="h-24 animate-pulse bg-muted/30" /></Card>
          ))
        ) : (notices as any[]).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">এখনো কোনো notice নেই</div>
        ) : (
          [...(notices as any[])].map((n: any) => (
            <Card key={n.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                <div className="space-y-1.5 min-w-0">
                  <CardTitle className="text-base leading-snug">{n.title}</CardTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {n.className && (
                      <Badge variant="outline" className="text-xs gap-1">
                        <GraduationCap className="h-3 w-3" />{n.className}
                      </Badge>
                    )}
                    {n.section && (
                      <Badge variant="outline" className="text-xs">{n.section}</Badge>
                    )}
                    {n.batch && (
                      <Badge variant="outline" className="text-xs">{n.batch}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Seen button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => toggleSeen(n.id)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    কে দেখেছে?
                    {openSeenId === n.id
                      ? <ChevronUp className="h-3 w-3" />
                      : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setDeleteId(n.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1 pb-3">
                <p className="whitespace-pre-wrap">{n.content}</p>
                <p className="text-xs">
                  {new Date(n.createdAt).toLocaleDateString("en-BD", { dateStyle: "medium" })}
                </p>
              </CardContent>

              {/* Seen list — lazy loads only when open */}
              {openSeenId === n.id && <SeenPanel noticeId={n.id} />}
            </Card>
          ))
        )}
      </div>

      {/* Post sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Notice Post করুন</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Notice-এর বিষয়" required />
            </div>
            <div className="space-y-1">
              <Label>Content <span className="text-destructive">*</span></Label>
              <Textarea rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="বিস্তারিত লিখুন…" required />
            </div>
            <div className="space-y-1">
              <Label>Class <span className="text-destructive">*</span></Label>
              <Select
                value={form.className}
                onValueChange={handleClassChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Class বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {(classes as any[]).map((c: any) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Section <span className="text-destructive">*</span></Label>
              <Select
                value={form.section}
                onValueChange={val => setForm(f => ({ ...f, section: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Section বেছে নিন" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Batch <span className="text-destructive">*</span></Label>
              <Select
                value={form.batch}
                onValueChange={val => setForm(f => ({ ...f, batch: val }))}
                disabled={availableBatches.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={availableBatches.length === 0 ? "আগে Class বেছে নিন" : "Batch বেছে নিন"} />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((b: string) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleAdd} disabled={createNotice.isPending}>
              {createNotice.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Post Notice
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Notice delete করবেন?</AlertDialogTitle>
            <AlertDialogDescription>এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
