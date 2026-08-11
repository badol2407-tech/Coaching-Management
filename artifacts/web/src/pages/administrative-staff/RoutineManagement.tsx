import { useMemo, useState } from "react";
import { CalendarRange, Clock3, Eye, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useCreateRoutineSlot,
  useDeleteRoutineSlot,
  useListRoutine,
  useUpdateRoutineSlot,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

type RoutineSlot = {
  id: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  teacherName?: string;
  room?: string;
  className?: string;
  batch?: string;
  createdAt?: string;
};

type RoutineForm = {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
  room: string;
  className: string;
  batch: string;
};

const EMPTY_FORM: RoutineForm = {
  day: "Saturday",
  startTime: "08:00",
  endTime: "09:00",
  subject: "",
  teacherName: "",
  room: "",
  className: "",
  batch: "",
};

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

function RoutineFormFields({
  form,
  setForm,
  classes,
}: {
  form: RoutineForm;
  setForm: React.Dispatch<React.SetStateAction<RoutineForm>>;
  classes: any[];
}) {
  const selectedClass = classes.find((item) => item.name === form.className);
  const batches: string[] = selectedClass?.batches ?? [];

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="routine-day">Day</Label>
          <Select value={form.day} onValueChange={(day) => setForm((current) => ({ ...current, day }))}>
            <SelectTrigger id="routine-day"><SelectValue /></SelectTrigger>
            <SelectContent>{DAYS.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="routine-subject">Subject <span className="text-destructive">*</span></Label>
          <Input id="routine-subject" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} placeholder="Mathematics" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="routine-start">Start time</Label>
          <Input id="routine-start" type="time" value={form.startTime} onChange={(event) => setForm((current) => ({ ...current, startTime: event.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="routine-end">End time</Label>
          <Input id="routine-end" type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="routine-teacher">Teacher</Label>
        <Input id="routine-teacher" value={form.teacherName} onChange={(event) => setForm((current) => ({ ...current, teacherName: event.target.value }))} placeholder="Teacher name" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="routine-room">Room</Label>
          <Input id="routine-room" value={form.room} onChange={(event) => setForm((current) => ({ ...current, room: event.target.value }))} placeholder="Room 204" />
        </div>
        <div className="space-y-1.5">
          <Label>Class</Label>
          <Select
            value={form.className || undefined}
            onValueChange={(className) => setForm((current) => ({ ...current, className, batch: "" }))}
          >
            <SelectTrigger><SelectValue placeholder="All classes" /></SelectTrigger>
            <SelectContent>{classes.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Batch</Label>
        <Select
          value={form.batch || undefined}
          onValueChange={(batch) => setForm((current) => ({ ...current, batch }))}
          disabled={batches.length === 0}
        >
          <SelectTrigger><SelectValue placeholder={batches.length ? "Select batch" : "Select a class first"} /></SelectTrigger>
          <SelectContent>{batches.map((batch) => <SelectItem key={batch} value={batch}>{batch}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default function RoutineManagement() {
  const { toast } = useToast();
  const { data: routine = [], isLoading } = useListRoutine();
  const { data: classes = [] } = useListClasses();
  const createRoutine = useCreateRoutineSlot();
  const updateRoutine = useUpdateRoutineSlot();
  const deleteRoutine = useDeleteRoutineSlot();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineSlot | null>(null);
  const [form, setForm] = useState<RoutineForm>(EMPTY_FORM);
  const [viewing, setViewing] = useState<RoutineSlot | null>(null);
  const [deleting, setDeleting] = useState<RoutineSlot | null>(null);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (routine as RoutineSlot[])
      .filter((item) => !query || [item.subject, item.teacherName, item.className, item.batch, item.room, item.day].some((value) => value?.toLowerCase().includes(query)))
      .sort((a, b) => `${a.day}-${a.startTime}`.localeCompare(`${b.day}-${b.startTime}`));
  }, [routine, search]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(item: RoutineSlot) {
    setEditing(item);
    setForm({
      day: item.day ?? "Saturday",
      startTime: item.startTime ?? "08:00",
      endTime: item.endTime ?? "09:00",
      subject: item.subject ?? "",
      teacherName: item.teacherName ?? "",
      room: item.room ?? "",
      className: item.className ?? "",
      batch: item.batch ?? "",
    });
    setFormOpen(true);
  }

  function save() {
    if (!form.subject.trim()) {
      toast({ title: "Subject is required", variant: "destructive" });
      return;
    }
    if (form.startTime >= form.endTime) {
      toast({ title: "End time must be after start time", variant: "destructive" });
      return;
    }
    const data = {
      ...form,
      subject: form.subject.trim(),
      teacherName: form.teacherName.trim() || undefined,
      room: form.room.trim() || undefined,
      className: form.className || undefined,
      batch: form.batch || undefined,
    };
    const options = {
      onSuccess: () => {
        toast({ title: editing ? "Routine updated" : "Routine created" });
        setFormOpen(false);
      },
      onError: () => toast({ title: "Could not save routine", variant: "destructive" }),
    };
    if (editing) updateRoutine.mutate({ id: editing.id, data }, options);
    else createRoutine.mutate({ data }, options);
  }

  function remove() {
    if (!deleting) return;
    deleteRoutine.mutate(
      { id: deleting.id },
      {
        onSuccess: () => toast({ title: "Routine deleted" }),
        onError: () => toast({ title: "Could not delete routine", variant: "destructive" }),
      },
    );
    setDeleting(null);
  }

  const saving = createRoutine.isPending || updateRoutine.isPending;

  return (
    <div className="app-command-surface mx-auto max-w-7xl space-y-6 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> Administrative workspace
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-foreground sm:text-4xl">Routine Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create and maintain the organization’s weekly class schedule.</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New routine</Button>
      </header>

      <Card className="border-border/70 bg-card/70">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Weekly routines <span className="ml-2 text-sm font-normal text-muted-foreground">{rows.length} records</span></CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search routines" className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, teacher, class..." />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading routines...</div>
          ) : rows.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <CalendarRange className="mb-3 h-10 w-10 opacity-30" />
              <p className="font-medium text-foreground">{search ? "No routines match your search" : "No routines yet"}</p>
              <p className="mt-1 text-sm">{search ? "Try a different search term." : "Create the first weekly class routine."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/50 p-4 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Clock3 className="h-5 w-5" /></div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{valueOrDash(item.subject)}</p>
                        <Badge variant="outline">{valueOrDash(item.day)}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {valueOrDash(item.startTime)} – {valueOrDash(item.endTime)}
                        {item.teacherName ? ` · ${item.teacherName}` : ""}
                        {item.room ? ` · ${item.room}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.className || "All classes"}{item.batch ? ` · ${item.batch}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-end md:self-center">
                    <Button variant="outline" size="sm" onClick={() => setViewing(item)}><Eye className="mr-1.5 h-3.5 w-3.5" /> View</Button>
                    <Button variant="ghost" size="icon" aria-label={`Edit ${item.subject}`} onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${item.subject}`} onClick={() => setDeleting(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <SheetTitle>{editing ? "Edit routine" : "Create routine"}</SheetTitle>
            <SheetDescription>Keep the scheduled class, local time, and audience accurate for every portal.</SheetDescription>
          </SheetHeader>
          <RoutineFormFields form={form} setForm={setForm} classes={classes as any[]} />
          <SheetFooter><Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create routine"}</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><CalendarRange className="h-6 w-6" /></div>
            <SheetTitle>{valueOrDash(viewing?.subject)}</SheetTitle>
            <SheetDescription>{valueOrDash(viewing?.day)} · {valueOrDash(viewing?.startTime)} – {valueOrDash(viewing?.endTime)}</SheetDescription>
          </SheetHeader>
          {viewing && (
            <div className="mt-7 space-y-3">
              {[
                ["Teacher", valueOrDash(viewing.teacherName)],
                ["Room", valueOrDash(viewing.room)],
                ["Class", viewing.className || "All classes"],
                ["Batch", valueOrDash(viewing.batch)],
                ["Created", formatDate(viewing.createdAt)],
              ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-border/60 py-3 text-sm"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium text-foreground">{value}</span></div>)}
            </div>
          )}
          <SheetFooter><Button variant="outline" onClick={() => { setViewing(null); openEdit(viewing!); }} disabled={!viewing}><Pencil className="mr-2 h-4 w-4" /> Edit routine</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this routine?</AlertDialogTitle><AlertDialogDescription>This will remove the routine from the organization’s schedule for every authorized portal. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete routine</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}