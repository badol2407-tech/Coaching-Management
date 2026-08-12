import { useState } from "react";
import { useListExams, useListResults } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ChevronRight, ClipboardList, Loader2, SearchX } from "lucide-react";

type Exam = { id: string; title: string; subject?: string | null; date: string; totalMarks: number };

function ResultView({ exam, onBack }: { exam: Exam; onBack: () => void }) {
  const { data: results = [], isLoading } = useListResults(exam.id);
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-11 w-11 shrink-0" aria-label="Back to exams">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0">
          <h2 className="font-semibold truncate">{exam.title}</h2>
          <p className="text-sm text-muted-foreground">
            {exam.subject && `${exam.subject} · `}Total: {exam.totalMarks} · {exam.date}
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
          </div>
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
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Exams</h1>
        <p className="text-muted-foreground">সব exams ও results দেখুন (read-only)</p>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (exams as Exam[]).length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <SearchX className="mx-auto mb-2 h-8 w-8 opacity-40" />
            কোনো exam নেই
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(exams as Exam[]).map((e) => (
            <Card
              key={e.id}
              className="cursor-pointer transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              onClick={() => setSelected(e)}
              role="button"
              tabIndex={0}
              aria-pressed="false"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  {e.title}<ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
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
