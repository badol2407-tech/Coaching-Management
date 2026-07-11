import { useState } from "react";
import { useListExams, useCreateExam, useListResults, useCreateResult, useListStudents } from "@/lib/hooks";
import { trackExamCreated, trackResultEntered } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Exam = { id: string; title: string; subject?: string | null; date: string; totalMarks: number };

export default function Exams() {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examSheetOpen, setExamSheetOpen] = useState(false);
  const [resultSheetOpen, setResultSheetOpen] = useState(false);
  const [examForm, setExamForm] = useState({ title: "", subject: "", date: new Date().toISOString().split("T")[0], totalMarks: "100" });
  const [resultForm, setResultForm] = useState({ studentId: "", marksObtained: "", grade: "" });
  const { toast } = useToast();

  const { data: exams = [], isLoading } = useListExams();
  const { data: results = [] } = useListResults(selectedExam?.id ?? "", { query: { enabled: !!selectedExam } });
  const { data: students = [] } = useListStudents();
  const createExam = useCreateExam();
  const createResult = useCreateResult();

  function handleAddExam() {
    if (!examForm.title || !examForm.date) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    createExam.mutate(
      { data: { title: examForm.title, subject: examForm.subject || null, date: examForm.date, totalMarks: Number(examForm.totalMarks) } },
      {
        onSuccess: () => { trackExamCreated(examForm.subject || examForm.title); toast({ title: "Exam created" }); setExamSheetOpen(false); setExamForm({ title: "", subject: "", date: new Date().toISOString().split("T")[0], totalMarks: "100" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  }

  function handleAddResult() {
    if (!selectedExam || !resultForm.studentId || !resultForm.marksObtained) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    const student = (students as any[]).find((s: any) => s.id === resultForm.studentId);
    createResult.mutate(
      { id: selectedExam.id, data: { studentId: resultForm.studentId, studentName: student?.name ?? "", marksObtained: Number(resultForm.marksObtained), grade: resultForm.grade || null } },
      {
        onSuccess: () => { trackResultEntered(); toast({ title: "Result added" }); setResultSheetOpen(false); setResultForm({ studentId: "", marksObtained: "", grade: "" }); },
        onError: () => toast({ title: "Error", variant: "destructive" }),
      }
    );
  }

  if (selectedExam) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedExam(null)}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <h2 className="font-semibold">{selectedExam.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedExam.subject && `${selectedExam.subject} · `}Total Marks: {selectedExam.totalMarks} · {selectedExam.date}</p>
            </div>
          </div>
          <Button onClick={() => setResultSheetOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Result</Button>
        </div>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Percentage</TableHead></TableRow></TableHeader>
            <TableBody>
              {(results as any[]).length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No results yet</TableCell></TableRow>
                : (results as any[]).map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell>{r.marksObtained} / {selectedExam.totalMarks}</TableCell>
                    <TableCell><Badge variant="outline">{r.grade ?? "—"}</Badge></TableCell>
                    <TableCell>{Math.round((r.marksObtained / selectedExam.totalMarks) * 100)}%</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <Sheet open={resultSheetOpen} onOpenChange={setResultSheetOpen}>
          <SheetContent>
            <SheetHeader><SheetTitle>Add Result</SheetTitle></SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1"><Label>Student</Label>
                <Select value={resultForm.studentId} onValueChange={v => setResultForm(f => ({ ...f, studentId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                  <SelectContent>{(students as any[]).map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Marks Obtained</Label><Input type="number" value={resultForm.marksObtained} onChange={e => setResultForm(f => ({ ...f, marksObtained: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Grade</Label><Input value={resultForm.grade} onChange={e => setResultForm(f => ({ ...f, grade: e.target.value }))} placeholder="A+, A, B+..." /></div>
            </div>
            <SheetFooter><Button onClick={handleAddResult} disabled={createResult.isPending}>Add Result</Button></SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setExamSheetOpen(true)}><Plus className="h-4 w-4 mr-2" />Create Exam</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Card key={i}><CardContent className="h-28 animate-pulse bg-muted/30" /></Card>)
          : (exams as Exam[]).length === 0 ? <div className="col-span-3 text-center py-16 text-muted-foreground">No exams yet</div>
          : (exams as Exam[]).map(e => (
            <Card key={e.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedExam(e)}>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center justify-between">{e.title}<ChevronRight className="h-4 w-4 text-muted-foreground" /></CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                {e.subject && <p>Subject: {e.subject}</p>}
                <p>Date: {e.date}</p>
                <p>Total Marks: {e.totalMarks}</p>
              </CardContent>
            </Card>
          ))}
      </div>
      <Sheet open={examSheetOpen} onOpenChange={setExamSheetOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Create Exam</SheetTitle></SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1"><Label>Title *</Label><Input value={examForm.title} onChange={e => setExamForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Subject</Label><Input value={examForm.subject} onChange={e => setExamForm(f => ({ ...f, subject: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Date *</Label><Input type="date" value={examForm.date} onChange={e => setExamForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1"><Label>Total Marks</Label><Input type="number" value={examForm.totalMarks} onChange={e => setExamForm(f => ({ ...f, totalMarks: e.target.value }))} /></div>
          </div>
          <SheetFooter><Button onClick={handleAddExam} disabled={createExam.isPending}>Create Exam</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
