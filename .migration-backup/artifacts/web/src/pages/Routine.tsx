import { useState } from "react";
import { cn } from "@/lib/utils";
import { useListRoutine, useCreateRoutineSlot, useDeleteRoutineSlot, getListRoutineQueryKey } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const DAY_BN: Record<string, string> = {
  Saturday: "শনিবার", Sunday: "রবিবার", Monday: "সোমবার",
  Tuesday: "মঙ্গলবার", Wednesday: "বুধবার", Thursday: "বৃহস্পতিবার",
};
const DAY_SHORT: Record<string, string> = {
  Saturday: "শনি", Sunday: "রবি", Monday: "সোম",
  Tuesday: "মঙ্গল", Wednesday: "বুধ", Thursday: "বৃহ",
};

const COLORS = [
  "bg-blue-100 text-blue-800 border border-blue-200",
  "bg-green-100 text-green-800 border border-green-200",
  "bg-purple-100 text-purple-800 border border-purple-200",
  "bg-orange-100 text-orange-800 border border-orange-200",
  "bg-pink-100 text-pink-800 border border-pink-200",
  "bg-teal-100 text-teal-800 border border-teal-200",
  "bg-yellow-100 text-yellow-800 border border-yellow-200",
  "bg-red-100 text-red-800 border border-red-200",
];

function subjectColor(subject: string) {
  let h = 0;
  for (const c of subject) h = (h * 31 + c.charCodeAt(0)) % COLORS.length;
  return COLORS[h];
}

const EMPTY_FORM = {
  day: "Saturday", startTime: "08:00", endTime: "09:00",
  subject: "", teacherName: "", room: "", className: "",
};

export default function Routine() {
  const [activeDay, setActiveDay] = useState("Saturday");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: allSlots = [], isLoading } = useListRoutine();
  const createSlot = useCreateRoutineSlot();
  const deleteSlot = useDeleteRoutineSlot();
  const invalidate = () => qc.invalidateQueries({ queryKey: getListRoutineQueryKey() });

  const daySlots = (allSlots as any[])
    .filter(s => s.day === activeDay)
    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

  function handleAdd() {
    if (!form.subject.trim()) {
      toast({ title: "Subject দিন", variant: "destructive" });
      return;
    }
    createSlot.mutate(
      { data: { ...form, teacherName: form.teacherName || undefined, room: form.room || undefined, className: form.className || undefined } },
      {
        onSuccess: () => { toast({ title: "Period যোগ হয়েছে ✓" }); setSheetOpen(false); invalidate(); setForm(EMPTY_FORM); },
        onError: () => toast({ title: "Error হয়েছে", variant: "destructive" }),
      }
    );
  }

  function handleDelete() {
    if (!deleteId) return;
    deleteSlot.mutate(
      { id: String(deleteId) },
      { onSuccess: () => { toast({ title: "Period মুছে গেছে" }); invalidate(); } }
    );
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">সাপ্তাহিক ক্লাস রুটিন</p>
        <Button onClick={() => { setForm({ ...EMPTY_FORM, day: activeDay }); setSheetOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Period যোগ করুন
        </Button>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={cn(
              "flex-1 py-2 px-1 rounded-md text-xs font-medium transition-colors",
              activeDay === day
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {DAY_SHORT[day]}
          </button>
        ))}
      </div>

      {/* Day header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{DAY_BN[activeDay]}</h2>
        <span className="text-sm text-muted-foreground">{daySlots.length}টি Period</span>
      </div>

      {/* Slot list */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
          ))
        ) : daySlots.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">{DAY_BN[activeDay]}-এ কোনো Period নেই</p>
            <p className="text-xs mt-1 opacity-70">উপরের বাটনে ক্লিক করে Period যোগ করুন</p>
          </div>
        ) : (
          daySlots.map((slot: any) => (
            <div
              key={slot.id}
              className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
            >
              <div className="text-xs text-muted-foreground font-mono w-28 shrink-0">
                {slot.startTime} – {slot.endTime}
              </div>
              <Badge className={cn("shrink-0 text-xs", subjectColor(slot.subject))}>
                {slot.subject}
              </Badge>
              <div className="flex-1 min-w-0 text-sm text-muted-foreground truncate">
                {slot.teacherName && <span className="text-foreground font-medium">{slot.teacherName}</span>}
                {slot.room && <span> · Room {slot.room}</span>}
                {slot.className && <span> · {slot.className}</span>}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-8 w-8"
                onClick={() => setDeleteId(slot.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Period যোগ করুন</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label>দিন</Label>
              <Select value={form.day} onValueChange={v => setForm(f => ({ ...f, day: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAYS.map(d => <SelectItem key={d} value={d}>{DAY_BN[d]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>শুরুর সময়</Label>
                <Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>শেষের সময়</Label>
                <Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>বিষয় (Subject) *</Label>
              <Input
                placeholder="যেমন: Mathematics"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>শিক্ষকের নাম</Label>
              <Input
                placeholder="যেমন: Mr. Ahmed"
                value={form.teacherName}
                onChange={e => setForm(f => ({ ...f, teacherName: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>রুম নম্বর</Label>
                <Input
                  placeholder="যেমন: 101"
                  value={form.room}
                  onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>ক্লাস</Label>
                <Input
                  placeholder="যেমন: Class 9"
                  value={form.className}
                  onChange={e => setForm(f => ({ ...f, className: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleAdd} disabled={createSlot.isPending}>
              {createSlot.isPending ? "যোগ করা হচ্ছে..." : "Period যোগ করুন"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Period মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription>এই কাজটি উল্টানো যাবে না।</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              মুছুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
