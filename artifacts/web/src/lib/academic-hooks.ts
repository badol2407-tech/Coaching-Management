import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const academicCollection = (orgId: string, name: string) =>
  collection(db, "organizations", orgId, name);

export type SyllabusStatus =
  | "not_started"
  | "learning"
  | "completed"
  | "revision";

export type AcademicSyllabusItem = {
  id: string;
  school?: string;
  className: string;
  academicYear?: string;
  subject: string;
  chapter: string;
  topic: string;
  order?: number;
  status?: SyllabusStatus;
};

export type AcademicRoutine = {
  id: string;
  studentId: string;
  date: string;
  subject: string;
  task: string;
  targetMinutes?: number;
  completed?: boolean;
};

export type AcademicAssessment = {
  id: string;
  name: string;
  type: string;
  subject: string;
  date: string;
  totalMarks: number;
  passingMarks?: number;
  studentMarks?: Record<string, number>;
};

function useOrgId() {
  const { userProfile } = useAuth();
  return userProfile?.orgId ?? null;
}

export function useAcademicSyllabus(className?: string) {
  const orgId = useOrgId();

  return useQuery({
    queryKey: ["academic-syllabus", orgId, className],
    enabled: Boolean(orgId && className),
    queryFn: async () => {
      if (!orgId || !className) return [];

      const q = query(
        academicCollection(orgId, "academicSyllabus"),
        where("className", "==", className),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as AcademicSyllabusItem[];
    },
  });
}

export function useAddAcademicSyllabus() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      item: Omit<AcademicSyllabusItem, "id">,
    ) => {
      if (!orgId) throw new Error("Organization not found.");

      await addDoc(
        academicCollection(orgId, "academicSyllabus"),
        {
          ...item,
          status: item.status ?? "not_started",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-syllabus"],
      }),
  });
}

export function useUpdateAcademicSyllabus() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: SyllabusStatus;
    }) => {
      if (!orgId) throw new Error("Organization not found.");

      await updateDoc(
        doc(db, "organizations", orgId, "academicSyllabus", id),
        {
          status,
          updatedAt: serverTimestamp(),
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-syllabus"],
      }),
  });
}

export function useAcademicRoutines(studentId?: string) {
  const orgId = useOrgId();

  return useQuery({
    queryKey: ["academic-routines", orgId, studentId],
    enabled: Boolean(orgId && studentId),
    queryFn: async () => {
      if (!orgId || !studentId) return [];

      const q = query(
        academicCollection(orgId, "academicRoutines"),
        where("studentId", "==", studentId),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as AcademicRoutine[];
    },
  });
}

export function useAddAcademicRoutine() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      routine: Omit<AcademicRoutine, "id">,
    ) => {
      if (!orgId) throw new Error("Organization not found.");

      await addDoc(
        academicCollection(orgId, "academicRoutines"),
        {
          ...routine,
          completed: routine.completed ?? false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-routines"],
      }),
  });
}

export function useToggleAcademicRoutine() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      if (!orgId) throw new Error("Organization not found.");

      await updateDoc(
        doc(db, "organizations", orgId, "academicRoutines", id),
        {
          completed,
          updatedAt: serverTimestamp(),
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-routines"],
      }),
  });
}

export function useUpdateAcademicAssessmentMarks() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      assessmentId,
      studentId,
      marks,
    }: {
      assessmentId: string;
      studentId: string;
      marks: number;
    }) => {
      if (!orgId) throw new Error("Organization not found.");

      const assessmentRef = doc(
        db,
        "organizations",
        orgId,
        "academicAssessments",
        assessmentId,
      );

      const snapshot = await getDocs(
        query(
          academicCollection(orgId, "academicAssessments"),
          where("__name__", "==", assessmentId),
        ),
      );

      if (snapshot.empty) {
        throw new Error("Assessment not found.");
      }

      const current = snapshot.docs[0].data() as AcademicAssessment;
      const studentMarks = {
        ...(current.studentMarks ?? {}),
        [studentId]: marks,
      };

      await updateDoc(assessmentRef, {
        studentMarks,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-assessments"],
      }),
  });
}

export function useAcademicAssessments() {
  const orgId = useOrgId();

  return useQuery({
    queryKey: ["academic-assessments", orgId],
    enabled: Boolean(orgId),
    queryFn: async () => {
      if (!orgId) return [];

      const snapshot = await getDocs(
        academicCollection(orgId, "academicAssessments"),
      );

      return snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as AcademicAssessment[];
    },
  });
}

export function useAddAcademicAssessment() {
  const orgId = useOrgId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      assessment: Omit<AcademicAssessment, "id">,
    ) => {
      if (!orgId) throw new Error("Organization not found.");

      await addDoc(
        academicCollection(orgId, "academicAssessments"),
        {
          ...assessment,
          studentMarks: assessment.studentMarks ?? {},
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["academic-assessments"],
      }),
  });
}
