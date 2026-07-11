import { useState } from "react";
import { useListExams, useListResults } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ChevronRight } from "lucide-react";

type Exam = { id: string; title: string; subject?: string | null; date: string; totalMarks: number };

function ResultView({ exam, onBack }: { exam: Exam; onBack: () => void }) {
  const { data: results = [], isLoading } = useListResults(exam.id);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h2 className="font-semibold">{exam.title}</h2>
          <p className="text-sm text-muted-foreground">
            {exam.subject && `${exam.subject} · `}Total: {exam.totalMarks} · {exam.date}
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</TableCell></TableRow>
              ) : (results as any[]).length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">কোনো result নেই</TableCell></TableRow>
              ) : (
                (results as any[]).map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.studentName}</TableCell>
                    <TableCell>{r.marksObtained} / {exam.totalMarks}</TableCell>
                    <TableCell><Badge variant="outline">{r.grade ?? "—"}</Badge></TableCell>
                    <TableCell>{Math.round((r.marksObtained / exam.totalMarks) * 100)}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TeacherExams() {
  const { data: exams = [], isLoading } = useListExams();
  const [selected, setSelected] = useState<Exam | null>(null);

  if (selected) return <ResultView exam={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="text-muted-foreground">সব exams ও results দেখুন (read-only)</p>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Card key={i}><CardContent className="h-28 animate-pulse bg-muted/30" /></Card>)}
        </div>
      ) : (exams as Exam[]).length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">কোনো exam নেই</CardContent></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(exams as Exam[]).map((e) => (
            <Card key={e.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(e)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {e.title}<ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                {e.subject && <p>Subject: {e.subject}</p>}
                <p>Date: {e.date}</p>
                <p>Total Marks: {e.totalMarks}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
