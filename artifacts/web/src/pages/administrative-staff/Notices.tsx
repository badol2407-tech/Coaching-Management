import { useMemo, useState } from "react";
import { Bell, Eye, FileText, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useCreateNotice, useDeleteNotice, useListNotices, useUpdateNotice } from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";
import { SECTION_OPTIONS } from "@/lib/constants";

type Notice = {
  id: string;
  title?: string;
  content?: string;
  className?: string;
  section?: string;
  batch?: string;
  createdAt?: string;
};

type NoticeForm = {
  title: string;
  content: string;
  className: string;
  section: string;
  batch: string;
};

const EMPTY_FORM: NoticeForm = { title: "", content: "", className: "", section: "", batch: "" };

function valueOrDash(value?: string | null) {
  return value?.trim() || "Not provided";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function NoticeFormFields({
  form,
  setForm,
  classes,
}: {
  form: NoticeForm;
  setForm: React.Dispatch<React.SetStateAction<NoticeForm>>;
  classes: any[];
}) {
  const selectedClass = classes.find((item) => item.name === form.className);
  const batches: string[] = selectedClass?.batches ?? [];

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-1.5">
        <Label htmlFor="notice-title">Title <span className="text-destructive">*</span></Label>
        <Input id="notice-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Notice title" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notice-content">Content <span className="text-destructive">*</span></Label>
        <Textarea id="notice-content" rows={6} value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} placeholder="Write the notice details..." />
      </div>
      <div className="space-y-1.5">
        <Label>Class <span className="text-destructive">*</span></Label>
        <Select value={form.className || undefined} onValueChange={(className) => setForm((current) => ({ ...current, className, batch: "" }))}>
          <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
          <SelectContent>{classes.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Section <span className="text-destructive">*</span></Label>
          <Select value={form.section || undefined} onValueChange={(section) => setForm((current) => ({ ...current, section }))}>
            <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
            <SelectContent>{SECTION_OPTIONS.map((section) => <SelectItem key={section} value={section}>{section}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Batch <span className="text-destructive">*</span></Label>
          <Select value={form.batch || undefined} onValueChange={(batch) => setForm((current) => ({ ...current, batch }))} disabled={batches.length === 0}>
            <SelectTrigger><SelectValue placeholder={batches.length ? "Select batch" : "Select class first"} /></SelectTrigger>
            <SelectContent>{batches.map((batch) => <SelectItem key={batch} value={batch}>{batch}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default function AdministrativeStaffNotices() {
  const { toast } = useToast();
  const { data: notices = [], isLoading } = useListNotices();
  const { data: classes = [] } = useListClasses();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState<NoticeForm>(EMPTY_FORM);
  const [viewing, setViewing] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState<Notice | null>(null);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (notices as Notice[])
      .filter((item) => !query || [item.title, item.content, item.className, item.section, item.batch].some((value) => value?.toLowerCase().includes(query)))
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  }, [notices, search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(item: Notice) {
    setEditing(item);
    setForm({
      title: item.title ?? "",
      content: item.content ?? "",
      className: item.className ?? "",
      section: item.section ?? "",
      batch: item.batch ?? "",
    });
    setFormOpen(true);
  }

  function save() {
    if (!form.title.trim() || !form.content.trim() || !form.className || !form.section || !form.batch) {
      toast({ title: "Complete all required fields", variant: "destructive" });
      return;
    }
    const data = { ...form, title: form.title.trim(), content: form.content.trim() };
    const options = {
      onSuccess: () => {
        toast({ title: editing ? "Notice updated" : "Notice published" });
        setFormOpen(false);
      },
      onError: () => toast({ title: "Could not save notice", variant: "destructive" }),
    };
    if (editing) updateNotice.mutate({ id: editing.id, data }, options);
    else createNotice.mutate({ data }, options);
  }

  function remove() {
    if (!deleting) return;
    deleteNotice.mutate(
      { id: deleting.id },
      {
        onSuccess: () => toast({ title: "Notice deleted" }),
        onError: () => toast({ title: "Could not delete notice", variant: "destructive" }),
      },
    );
    setDeleting(null);
  }

  const saving = createNotice.isPending || updateNotice.isPending;

  return (
    <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> Administrative workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">Notice Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Publish timely, audience-specific updates to the organization.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New notice</Button>
      </header>

      <Card className="border-border/70 bg-card/70">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Published notices <span className="ml-2 text-sm font-normal text-muted-foreground">{rows.length} records</span></CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search notices" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notices..." />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading notices...</div>
          ) : rows.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <Bell className="mb-3 h-10 w-10 opacity-30" />
              <p className="font-medium text-foreground">{search ? "No notices match your search" : "No notices yet"}</p>
              <p className="mt-1 text-sm">{search ? "Try a different search term." : "Publish the first notice for your organization."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/50 p-4 md:flex-row md:items-start">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{valueOrDash(item.title)}</p>
                        <Badge variant="outline">{valueOrDash(item.className)}</Badge>
                        <Badge variant="outline">{valueOrDash(item.section)}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{valueOrDash(item.content)}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{valueOrDash(item.batch)} · Published {formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end md:self-start">
                    <Button variant="outline" size="sm" onClick={() => setViewing(item)}><Eye className="mr-1.5 h-3.5 w-3.5" /> View</Button>
                    <Button variant="ghost" size="icon" aria-label={`Edit ${item.title}`} onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${item.title}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit notice" : "Create notice"}</SheetTitle>
            <SheetDescription>Notices are synchronized to every authorized portal in realtime.</SheetDescription>
          </SheetHeader>
          <NoticeFormFields form={form} setForm={setForm} classes={classes as any[]} />
          <SheetFooter><Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Publish notice"}</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Bell className="h-6 w-6" /></div>
            <SheetTitle>{valueOrDash(viewing?.title)}</SheetTitle>
            <SheetDescription>{valueOrDash(viewing?.className)} · {valueOrDash(viewing?.section)} · {valueOrDash(viewing?.batch)}</SheetDescription>
          </SheetHeader>
          {viewing && (
            <div className="mt-7 space-y-5">
              <div className="whitespace-pre-wrap rounded-xl border border-border/70 bg-muted/20 p-4 text-sm leading-6 text-foreground">{valueOrDash(viewing.content)}</div>
              <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Published</span><span className="font-medium">{formatDate(viewing.createdAt)}</span></div>
            </div>
          )}
          <SheetFooter><Button variant="outline" onClick={() => { setViewing(null); openEdit(viewing!); }} disabled={!viewing}><Pencil className="mr-2 h-4 w-4" /> Edit notice</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this notice?</AlertDialogTitle><AlertDialogDescription>This will remove the notice from all authorized portals. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete notice</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}