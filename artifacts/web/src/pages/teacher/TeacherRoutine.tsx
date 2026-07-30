import { useListRoutine } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock } from "lucide-react";

const DAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"] as const;
const DAY_KEYS = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"] as const;

const dayColors: Record<string, string> = {
  saturday: "bg-violet-100 text-violet-700 border-violet-200",
  sunday: "bg-blue-100 text-blue-700 border-blue-200",
  monday: "bg-green-100 text-green-700 border-green-200",
  tuesday: "bg-amber-100 text-amber-700 border-amber-200",
  wednesday: "bg-rose-100 text-rose-700 border-rose-200",
  thursday: "bg-indigo-100 text-indigo-700 border-indigo-200",
  friday: "bg-teal-100 text-teal-700 border-teal-200",
};

export default function TeacherRoutine() {
  const { data: slots = [], isLoading } = useListRoutine();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Class Routine</h1>
        <p className="text-muted-foreground">Weekly class schedule</p>
      </div>

      <Tabs defaultValue={today in DAY_KEYS ? today : "sunday"}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-lg">
          {DAY_KEYS.map((day, i) => (
            <TabsTrigger key={day} value={day} className="text-xs">
              {DAYS[i]}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAY_KEYS.map((day, i) => {
          const daySlots = (slots as any[]).filter((s) => s.day?.toLowerCase() === day);
          return (
            <TabsContent key={day} value={day} className="mt-4">
              {isLoading ? (
                <div className="grid gap-3">
                  {[1, 2].map((k) => <div key={k} className="h-20 rounded-lg bg-muted animate-pulse" />)}
                </div>
              ) : daySlots.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-sm">{DAYS[i]}-এ কোনো class নেই</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {daySlots.map((slot: any) => (
                    <Card key={slot.id} className={`border ${dayColors[day] ?? ""}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{slot.subject ?? slot.className ?? "—"}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        {slot.teacher && (
                          <p className="text-sm text-muted-foreground">{slot.teacher}</p>
                        )}
                        {slot.room && (
                          <Badge variant="outline" className="text-xs">{slot.room}</Badge>
                        )}
                        {(slot.startTime || slot.endTime) && (
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Clock className="h-3.5 w-3.5" />
                            {slot.startTime}{slot.endTime ? ` – ${slot.endTime}` : ""}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
