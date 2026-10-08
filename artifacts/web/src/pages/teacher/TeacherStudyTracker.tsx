import { useMemo, useState } from "react";
import {
  BookOpenCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  ClipboardList,
  Plus,
  Search,
  Target,
} from "lucide-react";

import { useListStudents } from "@/lib/hooks";
import {
  useAcademicAssessments,
  useAcademicRoutines,
  useAcademicSyllabus,
  useAddAcademicAssessment,
  useAddAcademicRoutine,
  useAddAcademicSyllabus,
  useToggleAcademicRoutine,
  useUpdateAcademicAssessmentMarks,
  useUpdateAcademicSyllabus,
  type SyllabusStatus,
} from "@/lib/academic-hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STATUS_LABEL: Record<SyllabusStatus, string> = {
  not_started: "Not started",
  learning: "Learning",
  completed: "Completed",
  revision: "Revision",
};

const STATUS_ORDER: SyllabusStatus[] = [
  "not_started",
  "learning",
  "completed",
  "revision",
];

function nextStatus(status: SyllabusStatus): SyllabusStatus {
  const index = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

export default function TeacherStudyTracker() {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [newSubject, setNewSubject] = useState("");
  const [newChapter, setNewChapter] = useState("");
  const [newTopic, setNewTopic] = useState("");

  const [routineTask, setRoutineTask] = useState("");
  const [routineSubject, setRoutineSubject] = useState("");

  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const [examSubject, setExamSubject] = useState("");
  const [examTotal, setExamTotal] = useState("");
const [marksDraft, setMarksDraft] = useState<Record<string, string>>({});

  const studentsQuery = useListStudents({ search });
  const students = studentsQuery.data ?? [];

  const selectedStudent =
    students.find((student: any) => student.id === selectedStudentId) ??
    students[0];

  const studentId = selectedStudent?.id;
  const className = selectedStudent?.className;

  const syllabusQuery = useAcademicSyllabus(className);
  const routinesQuery = useAcademicRoutines(studentId);
  const assessmentsQuery = useAcademicAssessments();

  const addSyllabus = useAddAcademicSyllabus();
  const updateSyllabus = useUpdateAcademicSyllabus();
  const addRoutine = useAddAcademicRoutine();
  const toggleRoutine = useToggleAcademicRoutine();
  const addAssessment = useAddAcademicAssessment();
  const updateAssessmentMarks = useUpdateAcademicAssessmentMarks();

  const syllabus = syllabusQuery.data ?? [];
  const routines = routinesQuery.data ?? [];
  const assessments = assessmentsQuery.data ?? [];

  const completedSyllabus = syllabus.filter(
    (item) => item.status === "completed",
  ).length;

  const syllabusPercent = syllabus.length
    ? Math.round((completedSyllabus / syllabus.length) * 100)
    : 0;

  const today = new Date().toISOString().slice(0, 10);
  const todayRoutines = routines.filter((item) => item.date === today);

  const completedRoutine = todayRoutines.filter((item) => item.completed).length;

  const routinePercent = todayRoutines.length
    ? Math.round((completedRoutine / todayRoutines.length) * 100)
    : 0;

  const studentAssessments = useMemo(
    () =>
      assessments.filter(
        (assessment) => studentId && assessment.studentMarks?.[studentId] != null,
      ),
    [assessments, studentId],
  );

  const examAverage = studentAssessments.length
    ? Math.round(
        studentAssessments.reduce((sum, assessment) => {
          const mark = assessment.studentMarks?.[studentId!] ?? 0;
          return (
            sum +
            (assessment.totalMarks
              ? (mark / assessment.totalMarks) * 100
              : 0)
          );
        }, 0) / studentAssessments.length,
      )
    : 0;

  const progressSignals = [
    syllabus.length > 0 ? syllabusPercent : null,
    routines.length > 0 ? routinePercent : null,
    studentAssessments.length > 0 ? examAverage : null,
  ].filter((value): value is number => value != null);

  const overallProgress = progressSignals.length
    ? Math.round(
        progressSignals.reduce((sum, value) => sum + value, 0) /
          progressSignals.length,
      )
    : 0;

  const performanceLabel =
    progressSignals.length === 0
      ? "No Data"
      : overallProgress >= 80
        ? "Excellent"
        : overallProgress >= 60
          ? "On Track"
          : overallProgress >= 40
            ? "Needs Attention"
            : "Needs Support";

  const weakTopics = syllabus.filter(
    (item) => item.status === "revision",
  );

  const recentAssessments = [...studentAssessments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const addTopic = async () => {
    if (!className || !newSubject.trim() || !newChapter.trim() || !newTopic.trim()) {
      return;
    }

    await addSyllabus.mutateAsync({
      className,
      subject: newSubject.trim(),
      chapter: newChapter.trim(),
      topic: newTopic.trim(),
      order: syllabus.length + 1,
    });

    setNewTopic("");
  };

  const addTodayRoutine = async () => {
    if (!studentId || !routineTask.trim() || !routineSubject.trim()) return;

    await addRoutine.mutateAsync({
      studentId,
      date: new Date().toISOString().slice(0, 10),
      subject: routineSubject.trim(),
      task: routineTask.trim(),
      targetMinutes: 30,
    });

    setRoutineTask("");
  };

  const saveMarks = async (
  assessmentId: string,
  totalMarks: number,
) => {
  if (!studentId) return;

  const raw = marksDraft[assessmentId];
  if (raw == null || raw.trim() === "") return;

  const marks = Number(raw);

  if (!Number.isFinite(marks) || marks < 0 || marks > totalMarks) {
    return;
  }

  await updateAssessmentMarks.mutateAsync({
    assessmentId,
    studentId,
    marks,
  });

  setMarksDraft((current) => {
    const next = { ...current };
    delete next[assessmentId];
    return next;
  });
};

const addExam = async () => {
    if (!examName.trim() || !examType.trim() || !examSubject.trim() || !examTotal) {
      return;
    }

    await addAssessment.mutateAsync({
      name: examName.trim(),
      type: examType.trim(),
      subject: examSubject.trim(),
      date: new Date().toISOString().slice(0, 10),
      totalMarks: Number(examTotal),
    });

    setExamName("");
    setExamType("");
    setExamSubject("");
    setExamTotal("");
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Study Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Track syllabus, routine and assessments for each student.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search student..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {students.slice(0, 8).map((student: any) => (
              <Button
                key={student.id}
                variant={student.id === studentId ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStudentId(student.id)}
              >
                {student.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {!selectedStudent ? (
        <Card className="p-8 text-center text-muted-foreground">
          Select a student to begin tracking.
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Syllabus
              </div>
              <div className="mt-2 text-3xl font-semibold">{syllabusPercent}%</div>
              <p className="text-xs text-muted-foreground">
                {completedSyllabus}/{syllabus.length} completed
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarCheck className="h-4 w-4" />
                Routine
              </div>
              <div className="mt-2 text-3xl font-semibold">{routinePercent}%</div>
              <p className="text-xs text-muted-foreground">
                {completedRoutine}/{routines.length} completed
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4" />
                Exams
              </div>
              <div className="mt-2 text-3xl font-semibold">{examAverage}%</div>
              <p className="text-xs text-muted-foreground">
                {studentAssessments.length} recorded
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpenCheck className="h-4 w-4" />
                Class
              </div>
              <div className="mt-2 text-xl font-semibold">
                {selectedStudent.className || "—"}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedStudent.batch || "Academic group"}
              </p>
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Student 360</h2>
                <p className="text-xs text-muted-foreground">
                  Overall academic snapshot for {selectedStudent.name}.
                </p>
              </div>
              <Badge
                variant={
                  overallProgress >= 60 ? "default" : "outline"
                }
              >
                {performanceLabel}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">
                  Overall Progress
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {progressSignals.length ? `${overallProgress}%` : "—"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on available tracking data
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">
                  Exams Recorded
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {studentAssessments.length}/{assessments.length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average: {studentAssessments.length ? `${examAverage}%` : "—"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">
                  Weak Topics
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {weakTopics.length}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Marked for revision
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-medium">Weak Topics</div>
                  <Badge variant="outline">{weakTopics.length}</Badge>
                </div>

                {weakTopics.length ? (
                  <div className="space-y-2">
                    {weakTopics.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md bg-muted/40 px-3 py-2"
                      >
                        <div className="text-sm font-medium">
                          {item.topic}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.subject} · {item.chapter}
                        </div>
                      </div>
                    ))}

                    {weakTopics.length > 6 && (
                      <div className="text-xs text-muted-foreground">
                        +{weakTopics.length - 6} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No topics marked for revision.
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 font-medium">Recent Exams</div>

                {recentAssessments.length ? (
                  <div className="space-y-2">
                    {recentAssessments.map((assessment) => {
                      const mark = assessment.studentMarks?.[studentId!];
                      const percentage = assessment.totalMarks
                        ? Math.round(
                            ((mark ?? 0) / assessment.totalMarks) * 100,
                          )
                        : 0;

                      return (
                        <div
                          key={assessment.id}
                          className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2"
                        >
                          <ClipboardList className="h-4 w-4 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {assessment.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {assessment.subject} · {assessment.date}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {mark}/{assessment.totalMarks} · {percentage}%
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No exam results recorded yet.
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Shared Syllabus</h2>
                  <p className="text-xs text-muted-foreground">
                    Shared automatically by class.
                  </p>
                </div>
                <Badge variant="outline">{syllabus.length} topics</Badge>
              </div>

              <div className="mb-4 grid gap-2 md:grid-cols-3">
                <Input
                  placeholder="Subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <Input
                  placeholder="Chapter"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                  <Button size="icon" onClick={addTopic} disabled={addSyllabus.isPending}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {syllabus.map((item) => {
                  const status = item.status ?? "not_started";

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition hover:bg-muted/50"
                      onClick={() =>
                        updateSyllabus.mutate({
                          id: item.id,
                          status: nextStatus(status),
                        })
                      }
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                        {status === "completed" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{item.topic}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.subject} · {item.chapter}
                        </div>
                      </div>

                      <Badge variant="secondary">
                        {STATUS_LABEL[status]}
                      </Badge>
                    </button>
                  );
                })}

                {!syllabus.length && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    Add the first subject/chapter/topic above.
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4">
                <h2 className="font-semibold">Today&apos;s Routine</h2>
                <p className="text-xs text-muted-foreground">
                  Individual routine for {selectedStudent.name}.
                </p>
              </div>

              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="Subject"
                  value={routineSubject}
                  onChange={(e) => setRoutineSubject(e.target.value)}
                />
                <Input
                  placeholder="Today&apos;s task"
                  value={routineTask}
                  onChange={(e) => setRoutineTask(e.target.value)}
                />
                <Button size="icon" onClick={addTodayRoutine} disabled={addRoutine.isPending}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {routines
                  .filter(
                    (routine) =>
                      routine.date === new Date().toISOString().slice(0, 10),
                  )
                  .map((routine) => (
                    <button
                      key={routine.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg border p-3 text-left"
                      onClick={() =>
                        toggleRoutine.mutate({
                          id: routine.id,
                          completed: !routine.completed,
                        })
                      }
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
                        {routine.completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <CalendarCheck className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{routine.task}</div>
                        <div className="text-xs text-muted-foreground">
                          {routine.subject} · {routine.targetMinutes ?? 30} min
                        </div>
                      </div>
                      <Badge variant={routine.completed ? "default" : "outline"}>
                        {routine.completed ? "Done" : "Pending"}
                      </Badge>
                    </button>
                  ))}

                {!routines.length && (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No routine added for this student yet.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Custom Assessments</h2>
                <p className="text-xs text-muted-foreground">
                  Create any exam type: class test, model test, weekly test, CQ, MCQ, etc.
                </p>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-4">
              <Input
                placeholder="Exam name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
              <Input
                placeholder="Exam type"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              />
              <Input
                placeholder="Subject"
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Total marks"
                  value={examTotal}
                  onChange={(e) => setExamTotal(e.target.value)}
                />
                <Button onClick={addExam} disabled={addAssessment.isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">{assessment.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {assessment.type} · {assessment.subject} · {assessment.totalMarks} marks
                    </div>
                  </div>

                  {studentId ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={assessment.totalMarks}
                        className="w-24"
                        placeholder="Marks"
                        value={
                          marksDraft[assessment.id] ??
                          (assessment.studentMarks?.[studentId] != null
                            ? String(assessment.studentMarks[studentId])
                            : "")
                        }
                        onChange={(e) =>
                          setMarksDraft((current) => ({
                            ...current,
                            [assessment.id]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          updateAssessmentMarks.isPending ||
                          marksDraft[assessment.id] == null ||
                          marksDraft[assessment.id].trim() === ""
                        }
                        onClick={() =>
                          saveMarks(assessment.id, assessment.totalMarks)
                        }
                      >
                        Save
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}

              {!assessments.length && (
                <div className="col-span-full rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No assessments created yet.
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
