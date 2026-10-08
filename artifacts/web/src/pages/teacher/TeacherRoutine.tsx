import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useCreateRoutineSlot,
  useDeleteRoutineSlot,
  useListRoutine,
  useUpdateRoutineSlot,
} from "@/lib/hooks";
import { useListClasses } from "@/lib/class-hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const DAY_LABELS: Record<string, string> = {
  Saturday: "শনিবার",
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
};

const dayColors: Record<string, string> = {
  Saturday: "bg-violet-100 text-violet-700 border-violet-200",
  Sunday: "bg-blue-100 text-blue-700 border-blue-200",
  Monday: "bg-green-100 text-green-700 border-green-200",
  Tuesday: "bg-amber-100 text-amber-700 border-amber-200",
  Wednesday: "bg-rose-100 text-rose-700 border-rose-200",
  Thursday: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Friday: "bg-teal-100 text-teal-700 border-teal-200",
};

type RoutineSlot = {
  id: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  subject?: string;
  teacherName?: string;
  teacher?: string;
  room?: string;
  className?: string;
  batch?: string;
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

export default function TeacherRoutine() {
  const { data: slots = [], isLoading } = useListRoutine();
  const { data: classes = [] } = useListClasses();

  const createRoutine = useCreateRoutineSlot();
  const updateRoutine = useUpdateRoutineSlot();
  const deleteRoutine = useDeleteRoutineSlot();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoutineSlot | null>(null);
  const [form, setForm] = useState<RoutineForm>(EMPTY_FORM);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const selectedClass = classes.find(
    (item: any) => item.name === form.className,
  );

  const batches: string[] = selectedClass?.batches ?? [];

  const rows = useMemo(
    () =>
      [...(slots as RoutineSlot[])].sort((a, b) =>
        `${a.day}-${a.startTime}`.localeCompare(`${b.day}-${b.startTime}`),
      ),
    [slots],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (slot: RoutineSlot) => {
    setEditing(slot);
    setError("");
    setForm({
      day: slot.day ?? "Saturday",
      startTime: slot.startTime ?? "08:00",
      endTime: slot.endTime ?? "09:00",
      subject: slot.subject ?? "",
      teacherName: slot.teacherName ?? slot.teacher ?? "",
      room: slot.room ?? "",
      className: slot.className ?? "",
      batch: slot.batch ?? "",
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    setError("");

    if (!form.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    const data = {
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
      subject: form.subject.trim(),
      teacherName: form.teacherName.trim() || undefined,
      room: form.room.trim() || undefined,
      className: form.className || undefined,
      batch: form.batch || undefined,
    };

    const options = {
      onSuccess: () => {
        setFormOpen(false);
        setEditing(null);
        setForm(EMPTY_FORM);
      },
      onError: (err: Error) => {
        setError(err.message || "Could not save routine.");
      },
    };

    if (editing) {
      updateRoutine.mutate(
        { id: editing.id, data },
        options,
      );
    } else {
      createRoutine.mutate({ data }, options);
    }
  };

  const handleDelete = (slot: RoutineSlot) => {
    const label = `${slot.subject ?? "this class"}${slot.className ? ` — ${slot.className}` : ""}`;

    if (!window.confirm(`Delete routine "${label}"?`)) return;

    deleteRoutine.mutate(
      { id: slot.id },
      {
        onError: (err: Error) => {
          setError(err.message || "Could not delete routine.");
        },
      },
    );
  };

  const saving = createRoutine.isPending || updateRoutine.isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Class Routine</h1>
          <p className="text-muted-foreground">
            Weekly class schedule
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Routine
        </Button>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editing ? "Edit Routine" : "Add Routine"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Day</Label>
                <Select
                  value={form.day}
                  onValueChange={(day) =>
                    setForm((current) => ({ ...current, day }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {DAY_LABELS[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={form.subject}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subject: event.target.value,
                    }))
                  }
                  placeholder="Mathematics"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Teacher</Label>
                <Input
                  value={form.teacherName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      teacherName: event.target.value,
                    }))
                  }
                  placeholder="Teacher name"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      startTime: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      endTime: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Room</Label>
                <Input
                  value={form.room}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      room: event.target.value,
                    }))
                  }
                  placeholder="Room 204"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Class</Label>
                <Select
                  value={form.className || undefined}
                  onValueChange={(className) =>
                    setForm((current) => ({
                      ...current,
                      className,
                      batch: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((item: any) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Batch</Label>
                <Select
                  value={form.batch || undefined}
                  onValueChange={(batch) =>
                    setForm((current) => ({ ...current, batch }))
                  }
                  disabled={batches.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        batches.length
                          ? "Select batch"
                          : "Select a class first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFormOpen(false);
                  setEditing(null);
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button onClick={handleSubmit} disabled={saving}>
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editing ? "Save Changes" : "Create Routine"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex min-h-32 items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              কোনো routine নেই
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add Routine দিয়ে প্রথম schedule তৈরি করুন।
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {DAYS.map((day) => {
            const daySlots = rows.filter(
              (slot) => slot.day?.toLowerCase() === day.toLowerCase(),
            );

            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="space-y-2">
                <h2 className="text-lg font-semibold">
                  {DAY_LABELS[day]}
                </h2>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {daySlots.map((slot) => (
                    <Card
                      key={slot.id}
                      className={`border ${dayColors[day] ?? ""}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base">
                            {slot.subject ?? "—"}
                          </CardTitle>

                          <div className="flex shrink-0 gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(slot)}
                              aria-label="Edit routine"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(slot)}
                              disabled={deleteRoutine.isPending}
                              aria-label="Delete routine"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-1">
                        {(slot.teacherName || slot.teacher) && (
                          <p className="text-sm text-muted-foreground">
                            {slot.teacherName || slot.teacher}
                          </p>
                        )}

                        {(slot.className || slot.batch) && (
                          <div className="flex flex-wrap gap-1">
                            {slot.className && (
                              <Badge variant="outline" className="text-xs">
                                {slot.className}
                              </Badge>
                            )}
                            {slot.batch && (
                              <Badge variant="outline" className="text-xs">
                                {slot.batch}
                              </Badge>
                            )}
                          </div>
                        )}

                        {slot.room && (
                          <Badge variant="outline" className="text-xs">
                            {slot.room}
                          </Badge>
                        )}

                        {(slot.startTime || slot.endTime) && (
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {slot.startTime}
                            {slot.endTime ? ` – ${slot.endTime}` : ""}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
