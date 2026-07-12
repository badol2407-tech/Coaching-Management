import { useState } from "react";
import { useListClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/lib/class-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, BookOpen, Loader2, X, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SECTION_OPTIONS } from "@/lib/constants";

type ClassForm = {
  name: string;
  section: string;
  teacher: string;
  room: string;
  schedule: string;
  studentCount: string;
  batches: string[];
};
const empty: ClassForm = { name: "", section: "", teacher: "", room: "", schedule: "", studentCount: "", batches: [] };

const WEEK_DAYS = [
  { value: "Sat", label: "শনি" },
  { value: "Sun", label: "রবি" },
  { value: "Mon", label: "সোম" },
  { value: "Tue", label: "মঙ্গল" },
  { value: "Wed", label: "বুধ" },
  { value: "Thu", label: "বৃহস্পতি" },
  { value: "Fri", label: "শুক্র" },
];

function to12h(t: string): string {
  if (!t) return "";
  const [hStr, m] = t.split(":");
  let h = Number(hStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
}

// ── Schedule picker: calendar-like day + time selector, with a manual fallback ──
function ScheduleField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"picker" | "manual">("manual");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [manualText, setManualText] = useState("");

  function openDialog() {
    setManualText(value);
    setMode("manual");
    setDays([]);
    setStartTime("09:00");
    setEndTime("11:00");
    setOpen(true);
  }

  function toggleDay(d: string) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function confirm() {
    if (mode === "manual") {
      if (!manualText.trim()) return;
      onChange(manualText.trim());
    } else {
      if (days.length === 0) return;
      const dayLabel = WEEK_DAYS.filter((d) => days.includes(d.value)).map((d) => d.value).join("-");
      onChange(`${dayLabel}, ${to12h(startTime)}-${to12h(endTime)}`);
    }
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {value || "Schedule সেট করুন"}
        </span>
        <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Schedule সেট করুন</DialogTitle></DialogHeader>

          <div className="flex gap-2 rounded-md bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode("picker")}
              className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors ${mode === "picker" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Day ও Time বাছুন
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors ${mode === "manual" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              নিজে লিখুন
            </button>
          </div>

          {mode === "picker" ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>সপ্তাহের কোন দিনগুলো?</Label>
                <div className="grid grid-cols-4 gap-2">
                  {WEEK_DAYS.map((d) => (
                    <button
                      type="button"
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      className={`rounded-md border py-2 text-xs font-medium transition-colors ${
                        days.includes(d.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-input hover:bg-muted/50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>শুরুর সময়</Label>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>শেষের সময়</Label>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              <Label>Schedule (নিজে লিখুন)</Label>
              <Input
                placeholder="যেমন: Sat-Thu, 9am-11am"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={confirm}>সেট করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Classes() {
  const { data: classes = [], isLoading } = useListClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<ClassForm>(empty);
  const [batchInput, setBatchInput] = useState("");

  function openCreate() { setEditing(null); setForm(empty); setBatchInput(""); setSheetOpen(true); }
  function openEdit(c: any) {
    setEditing(c);
    setForm({
      name: c.name ?? "",
      section: c.section ?? "",
      teacher: c.teacher ?? "",
      room: c.room ?? "",
      schedule: c.schedule ?? "",
      studentCount: String(c.studentCount ?? ""),
      batches: Array.isArray(c.batches) ? c.batches : [],
    });
    setBatchInput("");
    setSheetOpen(true);
  }

  function addBatch() {
    const b = batchInput.trim();
    if (!b) return;
    if (form.batches.includes(b)) { toast({ title: "এই batch আগে থেকেই আছে", variant: "destructive" }); return; }
    setForm((f) => ({ ...f, batches: [...f.batches, b] }));
    setBatchInput("");
  }

  function removeBatch(b: string) {
    setForm((f) => ({ ...f, batches: f.batches.filter((x) => x !== b) }));
  }

  function handleSave() {
    if (!form.name.trim()) { toast({ title: "Class-এর নাম দিন", variant: "destructive" }); return; }
    if (!form.section) { toast({ title: "Section বাছাই করুন", variant: "destructive" }); return; }
    if (form.batches.length === 0) { toast({ title: "অন্তত একটি Batch যোগ করুন", variant: "destructive" }); return; }
    if (!form.teacher.trim()) { toast({ title: "Class Teacher-এর নাম দিন", variant: "destructive" }); return; }
    if (!form.room.trim()) { toast({ title: "Room নম্বর দিন", variant: "destructive" }); return; }
    if (!form.schedule.trim()) { toast({ title: "Schedule সেট করুন", variant: "destructive" }); return; }
    if (!form.studentCount.trim()) { toast({ title: "মোট Students সংখ্যা দিন", variant: "destructive" }); return; }
    const data = {
      name: form.name.trim(),
      section: form.section,
      teacher: form.teacher.trim(),
      room: form.room.trim(),
      schedule: form.schedule.trim(),
      studentCount: Number(form.studentCount),
      batches: form.batches,
    };
    if (editing) {
      updateClass.mutate({ id: editing.id, data }, {
        onSuccess: () => { toast({ title: "Class updated" }); setSheetOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    } else {
      createClass.mutate({ data }, {
        onSuccess: () => { toast({ title: "Class তৈরি হয়েছে" }); setSheetOpen(false); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      });
    }
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" delete করবেন?`)) return;
    deleteClass.mutate({ id }, {
      onSuccess: () => toast({ title: "Class deleted" }),
      onError: () => toast({ title: "Error", variant: "destructive" }),
    });
  }

  const isPending = createClass.isPending || updateClass.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Classes</h1>
          <p className="text-muted-foreground">সব class ও batch manage করুন</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />নতুন Class</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Batches</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10"><div className="animate-pulse text-muted-foreground">লোড হচ্ছে...</div></TableCell></TableRow>
                ) : (classes as any[]).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      কোনো class নেই। উপরের বোতাম দিয়ে তৈরি করুন।
                    </TableCell>
                  </TableRow>
                ) : (
                  (classes as any[]).map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-semibold">{c.name}</TableCell>
                      <TableCell>{c.section ? <Badge variant="outline" className="text-xs">{c.section}</Badge> : "—"}</TableCell>
                      <TableCell>
                        {Array.isArray(c.batches) && c.batches.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.batches.map((b: string) => (
                              <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>{c.teacher || "—"}</TableCell>
                      <TableCell>{c.room || "—"}</TableCell>
                      <TableCell>{c.schedule || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(c.id, c.name)} disabled={deleteClass.isPending}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>{editing ? "Class Edit করুন" : "নতুন Class তৈরি করুন"}</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>Class নাম *</Label>
              <Input placeholder="যেমন: Class 10, HSC" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label>Section *</Label>
              <Select value={form.section} onValueChange={(val) => setForm((f) => ({ ...f, section: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Section বাছাই করুন" />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Batches *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="যেমন: Batch A, Morning Batch"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBatch(); } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addBatch}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.batches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {form.batches.map((b) => (
                    <Badge key={b} variant="secondary" className="text-xs gap-1 pr-1">
                      {b}
                      <button onClick={() => removeBatch(b)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Enter চাপুন বা + বাটন দিয়ে batch যোগ করুন</p>
            </div>

            <div className="space-y-1">
              <Label>Class Teacher *</Label>
              <Input placeholder="Teacher-এর নাম" value={form.teacher} onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Room নম্বর *</Label>
              <Input placeholder="যেমন: 101, Ground Floor" value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <Label>Schedule / সময়সূচী *</Label>
              <ScheduleField value={form.schedule} onChange={(v) => setForm((f) => ({ ...f, schedule: v }))} />
            </div>
            <div className="space-y-1">
              <Label>মোট Students *</Label>
              <Input type="number" placeholder="0" value={form.studentCount} onChange={(e) => setForm((f) => ({ ...f, studentCount: e.target.value }))} />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save করুন" : "তৈরি করুন"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
