import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  doc, setDoc, query, where, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "@/contexts/AuthContext";

function ts(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  return String(val);
}

function mapDoc(d: any) {
  const data = d.data();
  return { id: d.id, ...data, createdAt: ts(data.createdAt) };
}

function orgCol(orgId: string, col: string) {
  return collection(db, "organizations", orgId, col);
}

function orgDocRef(orgId: string, col: string, id: string) {
  return doc(db, "organizations", orgId, col, id);
}

// ── Students ──────────────────────────────────────────────────────────────────

export const getListStudentsQueryKey = (orgId?: string | null, search?: string) => [orgId, "students", search ?? ""];

export function useListStudents(params?: { search?: string }) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "students", params?.search ?? ""],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "students"));
      let rows = snap.docs.map(mapDoc) as any[];
      if (params?.search) {
        const s = params.search.toLowerCase();
        rows = rows.filter((r) => r.name?.toLowerCase().includes(s));
      }
      return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    enabled: !!orgId,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "students"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "students"] }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await updateDoc(orgDocRef(orgId, "students", id), data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "students"] }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "students", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "students"] }),
  });
}

/**
 * Fetches the current student's own record from `organizations/{orgId}/students/{studentId}`
 * so we can read their `batch` and restrict what routine/homework/exam/notice items they see.
 */
export function useMyStudentRecord() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  const studentId = userProfile?.studentId;
  return useQuery({
    queryKey: [orgId, "my_student_record", studentId ?? ""],
    queryFn: async () => {
      if (!orgId || !studentId) return null;
      const snap = await getDoc(doc(db, "organizations", orgId, "students", studentId));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : null;
    },
    enabled: !!orgId && !!studentId,
  });
}

/**
 * Given a list of items that may carry optional `className`/`batch` fields, keep only items
 * whose class and batch (each, if set) match the student's own class/batch. An item with no
 * className/batch set on that field is treated as visible to everyone for that field.
 */
export function filterByMyClassAndBatch<T extends { className?: string | null; batch?: string | null }>(
  items: T[],
  myClassName?: string | null,
  myBatch?: string | null,
): T[] {
  return items.filter((item) => {
    const classOk = !item.className || item.className === myClassName;
    const batchOk = !item.batch || item.batch === myBatch;
    return classOk && batchOk;
  });
}

// ── Teachers ──────────────────────────────────────────────────────────────────

export const getListTeachersQueryKey = (orgId?: string | null) => [orgId, "teachers"];

export function useListTeachers() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "teachers"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "teachers"));
      return snap.docs.map(mapDoc).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "teachers"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "teachers"] }),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await updateDoc(orgDocRef(orgId, "teachers", id), data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "teachers"] }),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "teachers", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "teachers"] }),
  });
}

// ── Attendance ─────────────────────────────────────────────────────────────────

export const getListAttendanceQueryKey = (orgId?: string | null, date?: string) => [orgId, "attendance", date ?? ""];

export function useListAttendance(params?: { date?: string }) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "attendance", params?.date ?? ""],
    queryFn: async () => {
      if (!orgId) return [];
      const q = params?.date
        ? query(orgCol(orgId, "attendance"), where("date", "==", params.date))
        : orgCol(orgId, "attendance");
      const snap = await getDocs(q);
      return snap.docs.map(mapDoc) as any[];
    },
    enabled: !!orgId,
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await addDoc(orgCol(orgId, "attendance"), { ...data, createdAt: serverTimestamp() });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "attendance"] }),
  });
}

// ── Fees ───────────────────────────────────────────────────────────────────────

export const getListFeesQueryKey = (orgId?: string | null, status?: string) => [orgId, "fees", status ?? ""];

export function useListFees(params?: { status?: string }) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "fees", params?.status ?? ""],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "fees"));
      let rows = snap.docs.map(mapDoc).map((r: any) => ({
        ...r,
        amount: Number(r.amount),
        paidAt: r.paidAt ? ts(r.paidAt) : null,
      })) as any[];
      if (params?.status) rows = rows.filter((r) => r.status === params.status);
      return rows.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    enabled: !!orgId,
  });
}

export function useCreateFee() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "fees"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "fees"] }),
  });
}

export function useUpdateFee() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await updateDoc(orgDocRef(orgId, "fees", id), data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "fees"] }),
  });
}

/** Student calls this to mark a fee record as seen (idempotent). */
export function useMarkFeeSeen() {
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ feeId }: { feeId: string }) => {
      const orgId = userProfile?.orgId;
      const uid = userProfile?.uid;
      if (!orgId || !uid) return;
      await setDoc(
        doc(db, "organizations", orgId, "fees", feeId, "seen", uid),
        { name: userProfile?.name ?? userProfile?.email ?? "Student", seenAt: serverTimestamp() },
        { merge: true },
      );
    },
  });
}

/** Admin/teacher calls this to fetch who has seen a specific fee record. */
export function useFeeSeen(feeId: string | null) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "fees", feeId, "seen"],
    queryFn: async () => {
      if (!orgId || !feeId) return [];
      const snap = await getDocs(collection(db, "organizations", orgId, "fees", feeId, "seen"));
      return snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any), seenAt: ts((d.data() as any).seenAt) }))
        .sort((a: any, b: any) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime());
    },
    enabled: !!orgId && !!feeId,
  });
}

// ── Exams ──────────────────────────────────────────────────────────────────────

export const getListExamsQueryKey = (orgId?: string | null) => [orgId, "exams"];

export function useListExams() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "exams"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "exams"));
      return snap.docs.map(mapDoc).map((r: any) => ({ ...r, totalMarks: Number(r.totalMarks) })) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateExam() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "exams"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "exams"] }),
  });
}

/** Student calls this to mark an exam as seen (idempotent). */
export function useMarkExamSeen() {
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ examId }: { examId: string }) => {
      const orgId = userProfile?.orgId;
      const uid = userProfile?.uid;
      if (!orgId || !uid) return;
      await setDoc(
        doc(db, "organizations", orgId, "exams", examId, "seen", uid),
        { name: userProfile?.name ?? userProfile?.email ?? "Student", seenAt: serverTimestamp() },
        { merge: true },
      );
    },
  });
}

/** Admin/teacher calls this to fetch who has seen a specific exam. */
export function useExamSeen(examId: string | null) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "exams", examId, "seen"],
    queryFn: async () => {
      if (!orgId || !examId) return [];
      const snap = await getDocs(collection(db, "organizations", orgId, "exams", examId, "seen"));
      return snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any), seenAt: ts((d.data() as any).seenAt) }))
        .sort((a: any, b: any) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime());
    },
    enabled: !!orgId && !!examId,
  });
}

// ── Results ────────────────────────────────────────────────────────────────────

export const getListResultsQueryKey = (orgId: string | null | undefined, examId: string) => [orgId, "results", examId];

export function useListResults(examId: string, options?: { query?: { enabled?: boolean } }) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "results", examId],
    queryFn: async () => {
      if (!orgId || !examId) return [];
      const q = query(orgCol(orgId, "results"), where("examId", "==", examId));
      const snap = await getDocs(q);
      return snap.docs.map(mapDoc).map((r: any) => ({ ...r, marksObtained: Number(r.marksObtained) })) as any[];
    },
    enabled: options?.query?.enabled !== false && !!orgId && !!examId,
  });
}

export function useCreateResult() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "results"), { ...data, examId: id, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "results", vars.id] }),
  });
}

// ── Notices ────────────────────────────────────────────────────────────────────

export const getListNoticesQueryKey = (orgId?: string | null) => [orgId, "notices"];

export function useListNotices() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "notices"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "notices"));
      return snap.docs.map(mapDoc).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateNotice() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await addDoc(orgCol(orgId, "notices"), { ...data, createdAt: serverTimestamp() });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "notices"] }),
  });
}

export function useDeleteNotice() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "notices", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "notices"] }),
  });
}

/** Student calls this to mark a notice as seen (idempotent — uses uid as doc id). */
export function useMarkNoticeSeen() {
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ noticeId }: { noticeId: string }) => {
      const orgId = userProfile?.orgId;
      const uid = userProfile?.uid;
      if (!orgId || !uid) return;
      await setDoc(
        doc(db, "organizations", orgId, "notices", noticeId, "seen", uid),
        { name: userProfile?.name ?? userProfile?.email ?? "Student", seenAt: serverTimestamp() },
        { merge: true },
      );
    },
  });
}

/** Admin/teacher calls this to fetch who has seen a specific notice. */
export function useNoticeSeen(noticeId: string | null) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "notices", noticeId, "seen"],
    queryFn: async () => {
      if (!orgId || !noticeId) return [];
      const snap = await getDocs(collection(db, "organizations", orgId, "notices", noticeId, "seen"));
      return snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any), seenAt: ts((d.data() as any).seenAt) }))
        .sort((a: any, b: any) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime());
    },
    enabled: !!orgId && !!noticeId,
  });
}

// ── Homework ───────────────────────────────────────────────────────────────────

export const getListHomeworkQueryKey = (orgId?: string | null) => [orgId, "homework"];

export function useListHomework() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "homework"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "homework"));
      return snap.docs.map(mapDoc).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateHomework() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await addDoc(orgCol(orgId, "homework"), { ...data, createdAt: serverTimestamp() });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "homework"] }),
  });
}

export function useDeleteHomework() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "homework", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "homework"] }),
  });
}

/** Student calls this to mark a homework as seen (idempotent). */
export function useMarkHomeworkSeen() {
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ homeworkId }: { homeworkId: string }) => {
      const orgId = userProfile?.orgId;
      const uid = userProfile?.uid;
      if (!orgId || !uid) return;
      await setDoc(
        doc(db, "organizations", orgId, "homework", homeworkId, "seen", uid),
        { name: userProfile?.name ?? userProfile?.email ?? "Student", seenAt: serverTimestamp() },
        { merge: true },
      );
    },
  });
}

/** Admin/teacher calls this to fetch who has seen a specific homework. */
export function useHomeworkSeen(homeworkId: string | null) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "homework", homeworkId, "seen"],
    queryFn: async () => {
      if (!orgId || !homeworkId) return [];
      const snap = await getDocs(collection(db, "organizations", orgId, "homework", homeworkId, "seen"));
      return snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any), seenAt: ts((d.data() as any).seenAt) }))
        .sort((a: any, b: any) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime());
    },
    enabled: !!orgId && !!homeworkId,
  });
}

// ── Routine ────────────────────────────────────────────────────────────────────

export const getListRoutineQueryKey = (orgId?: string | null) => [orgId, "routine"];

export function useListRoutine() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "routine"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "routine"));
      return snap.docs.map(mapDoc).sort((a: any, b: any) => a.startTime?.localeCompare(b.startTime ?? "") ?? 0) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateRoutineSlot() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "routine"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "routine"] }),
  });
}

export function useDeleteRoutineSlot() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      await deleteDoc(orgDocRef(orgId, "routine", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "routine"] }),
  });
}

/** Student calls this to mark a routine slot as seen (idempotent). */
export function useMarkRoutineSeen() {
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ slotId }: { slotId: string }) => {
      const orgId = userProfile?.orgId;
      const uid = userProfile?.uid;
      if (!orgId || !uid) return;
      await setDoc(
        doc(db, "organizations", orgId, "routine", slotId, "seen", uid),
        { name: userProfile?.name ?? userProfile?.email ?? "Student", seenAt: serverTimestamp() },
        { merge: true },
      );
    },
  });
}

/** Admin/teacher calls this to fetch who has seen a specific routine slot. */
export function useRoutineSeen(slotId: string | null) {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "routine", slotId, "seen"],
    queryFn: async () => {
      if (!orgId || !slotId) return [];
      const snap = await getDocs(collection(db, "organizations", orgId, "routine", slotId, "seen"));
      return snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any), seenAt: ts((d.data() as any).seenAt) }))
        .sort((a: any, b: any) => new Date(a.seenAt).getTime() - new Date(b.seenAt).getTime());
    },
    enabled: !!orgId && !!slotId,
  });
}

// ── Expenses ───────────────────────────────────────────────────────────────────

export const getListExpensesQueryKey = (orgId?: string | null) => [orgId, "expenses"];

export function useListExpenses() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "expenses"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "expenses"));
      return snap.docs.map(mapDoc).map((r: any) => ({ ...r, amount: Number(r.amount) })) as any[];
    },
    enabled: !!orgId,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  const { userProfile } = useAuth();
  return useMutation({
    mutationFn: async ({ data }: { data: Record<string, unknown> }) => {
      const orgId = userProfile?.orgId;
      if (!orgId) throw new Error("No org");
      const ref = await addDoc(orgCol(orgId, "expenses"), { ...data, createdAt: serverTimestamp() });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [userProfile?.orgId, "expenses"] }),
  });
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

export function useGetDashboardStats() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "dashboard", "stats"],
    queryFn: async () => {
      if (!orgId) return null;
      const today = new Date().toISOString().split("T")[0];
      const [sSnap, tSnap, fSnap, eSnap, exSnap, atSnap] = await Promise.all([
        getDocs(orgCol(orgId, "students")),
        getDocs(orgCol(orgId, "teachers")),
        getDocs(orgCol(orgId, "fees")),
        getDocs(orgCol(orgId, "expenses")),
        getDocs(orgCol(orgId, "exams")),
        getDocs(query(orgCol(orgId, "attendance"), where("date", "==", today))),
      ]);
      const fees = fSnap.docs.map((d) => d.data());
      const expenses = eSnap.docs.map((d) => d.data());
      return {
        totalStudents: sSnap.size,
        totalTeachers: tSnap.size,
        totalFeeCollected: fees.filter((f) => f.status === "paid").reduce((s, f) => s + Number(f.amount), 0),
        pendingFees: fees.filter((f) => f.status === "pending").reduce((s, f) => s + Number(f.amount), 0),
        totalExpenses: expenses.reduce((s, e) => s + Number(e.amount), 0),
        todayAttendance: atSnap.docs.filter((d) => d.data().status === "present").length,
        totalExams: exSnap.size,
      };
    },
    enabled: !!orgId,
  });
}

export function useGetAttendanceSummary() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "dashboard", "attendance-summary"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "attendance"));
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      const rows = snap.docs
        .map((d) => d.data())
        .filter((r) => new Date(r.date) >= cutoff);
      const grouped: Record<string, { present: number; absent: number }> = {};
      for (const r of rows) {
        if (!grouped[r.date]) grouped[r.date] = { present: 0, absent: 0 };
        if (r.status === "present") grouped[r.date].present++;
        else if (r.status === "absent") grouped[r.date].absent++;
      }
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, ...v }));
    },
    enabled: !!orgId,
  });
}

export function useGetRecentFees() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  return useQuery({
    queryKey: [orgId, "dashboard", "recent-fees"],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "fees"));
      return snap.docs
        .map(mapDoc)
        .map((r: any) => ({ ...r, amount: Number(r.amount), paidAt: r.paidAt ? ts(r.paidAt) : null }))
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10) as any[];
    },
    enabled: !!orgId,
  });
}

// ── Super Admin: Organizations ─────────────────────────────────────────────────

export function useListOrganizations() {
  return useQuery({
    queryKey: ["super_admin", "organizations"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "organizations"));
      return snap.docs.map(mapDoc) as any[];
    },
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; adminEmail: string }) => {
      const ref = await addDoc(collection(db, "organizations"), {
        ...data,
        createdAt: serverTimestamp(),
        status: "active",
      });
      return { id: ref.id };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["super_admin", "organizations"] }),
  });
}

export function useDeleteOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteDoc(doc(db, "organizations", id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["super_admin", "organizations"] }),
  });
}

export function useSuperAdminStats() {
  return useQuery({
    queryKey: ["super_admin", "stats"],
    queryFn: async () => {
      const [orgsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "organizations")),
        getDocs(collection(db, "users")),
      ]);
      const users = usersSnap.docs.map((d) => d.data());
      return {
        totalOrgs: orgsSnap.size,
        totalOrgAdmins: users.filter((u) => u.role === "org_admin").length,
        totalTeachers: users.filter((u) => u.role === "teacher").length,
        totalStudents: users.filter((u) => u.role === "student").length,
      };
    },
  });
}

// ── Student-specific: My Data ──────────────────────────────────────────────────

export function useMyFees() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  const studentId = userProfile?.studentId;
  const email = userProfile?.email;
  return useQuery({
    queryKey: [orgId, "my_fees", studentId ?? email],
    queryFn: async () => {
      if (!orgId) return [];
      const snap = await getDocs(orgCol(orgId, "fees"));
      let rows = snap.docs.map(mapDoc).map((r: any) => ({
        ...r,
        amount: Number(r.amount),
        paidAt: r.paidAt ? ts(r.paidAt) : null,
      })) as any[];
      if (studentId) {
        rows = rows.filter((r) => r.studentId === studentId);
      } else if (email) {
        rows = rows.filter((r) => r.studentEmail === email);
      }
      return rows.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    enabled: !!orgId,
  });
}

export function useMyAttendance() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  const studentId = userProfile?.studentId;
  const email = userProfile?.email;
  return useQuery({
    queryKey: [orgId, "my_attendance", studentId ?? email],
    queryFn: async () => {
      if (!orgId) return [];
      let q: any;
      if (studentId) {
        q = query(orgCol(orgId, "attendance"), where("studentId", "==", studentId));
      } else {
        q = orgCol(orgId, "attendance");
      }
      const snap = await getDocs(q);
      let rows = snap.docs.map(mapDoc) as any[];
      if (!studentId && email) {
        rows = rows.filter((r) => r.studentEmail === email);
      }
      return rows.sort((a: any, b: any) => (b.date ?? "").localeCompare(a.date ?? ""));
    },
    enabled: !!orgId,
  });
}

export function useMyResults() {
  const { userProfile } = useAuth();
  const orgId = userProfile?.orgId;
  const studentId = userProfile?.studentId;
  const email = userProfile?.email;
  return useQuery({
    queryKey: [orgId, "my_results", studentId ?? email],
    queryFn: async () => {
      if (!orgId) return [];
      let q: any;
      if (studentId) {
        q = query(orgCol(orgId, "results"), where("studentId", "==", studentId));
      } else {
        q = orgCol(orgId, "results");
      }
      const snap = await getDocs(q);
      let rows = snap.docs.map(mapDoc).map((r: any) => ({ ...r, marksObtained: Number(r.marksObtained) })) as any[];
      if (!studentId && email) {
        rows = rows.filter((r) => r.studentEmail === email);
      }
      return rows;
    },
    enabled: !!orgId,
  });
}
