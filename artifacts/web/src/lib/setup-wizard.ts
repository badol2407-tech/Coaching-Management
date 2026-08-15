import {
  deleteField,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SetupWizardStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "skipped";

export type InstituteType =
  | "school"
  | "coaching_centre"
  | "college"
  | "university"
  | "training_institute";

export type EducationType =
  | "school"
  | "college"
  | "university"
  | "coaching_centre"
  | "academy"
  | "other";

export type ClassRange = "play_5" | "6_10" | "11_12" | "custom";

export type ProgramType =
  | "academic"
  | "admission"
  | "job"
  | "skill_development"
  | "mixed";

export type WeeklyHoliday = "friday" | "saturday" | "sunday" | "none";

export type WorkingDays = 5 | 6 | 7;

export type DefaultShift = "morning" | "day" | "evening" | "mixed";
export type FirstClassShift = "morning" | "day" | "evening";
export type TeacherCount = "self" | "2_10" | "10_plus";

export type SetupWizardLanguage = "bn" | "en";

export interface FirstClassDraft {
  className?: string;
  section?: string;
  shift?: FirstClassShift;
}

export interface FirstTeacherDraft {
  name?: string;
  phone?: string;
  email?: string;
  classId?: string;
}

export interface SetupWizardState {
  status: SetupWizardStatus;
  currentStep?: number;
  firstClassCreated?: boolean;
  firstClassDraft?: FirstClassDraft;
  firstTeacherCreated?: boolean;
  firstTeacherDraft?: FirstTeacherDraft;
  teacherCount?: TeacherCount;
  teacherSetupSkipped?: boolean;
  completedSteps?: number[];
  startedAt?: unknown;
  completedAt?: unknown;
  instituteName?: string;
  instituteType?: InstituteType;
  educationType?: EducationType;
  classRange?: ClassRange;
  programType?: ProgramType;
  weeklyHolidays?: WeeklyHoliday[];
  workingDays?: WorkingDays;
  defaultShift?: DefaultShift;
  academicYear?: string;
  campusName?: string;
  language?: SetupWizardLanguage;
  timeZone?: string;
}

type SetupWizardWriteState = {
  status?: SetupWizardStatus;
  currentStep?: number;
  firstClassCreated?: boolean;
  firstClassDraft?: FirstClassDraft;
  firstTeacherCreated?: boolean;
  firstTeacherDraft?: FirstTeacherDraft;
  teacherCount?: TeacherCount;
  teacherSetupSkipped?: boolean;
  completedSteps?: number[];
  startedAt?: ReturnType<typeof serverTimestamp>;
  completedAt?: ReturnType<typeof serverTimestamp>;
  instituteName?: string;
  instituteType?: InstituteType;
  educationType?: EducationType;
  classRange?: ClassRange | ReturnType<typeof deleteField>;
  programType?: ProgramType | ReturnType<typeof deleteField>;
  weeklyHolidays?: WeeklyHoliday[];
  workingDays?: WorkingDays;
  defaultShift?: DefaultShift;
  academicYear?: string;
  campusName?: string;
  language?: SetupWizardLanguage;
  timeZone?: string;
};

export async function saveSetupWizardState(
  uid: string,
  setupWizard: SetupWizardWriteState,
) {
  const updates: Record<string, unknown> = {};

  if (setupWizard.status !== undefined) {
    updates["setupWizard.status"] = setupWizard.status;
  }
  if (setupWizard.currentStep !== undefined) {
    updates["setupWizard.currentStep"] = setupWizard.currentStep;
  }
  if (setupWizard.firstClassCreated !== undefined) {
    updates["setupWizard.firstClassCreated"] = setupWizard.firstClassCreated;
  }
  if (setupWizard.firstClassDraft !== undefined) {
    updates["setupWizard.firstClassDraft"] = setupWizard.firstClassDraft;
  }
  if (setupWizard.firstTeacherCreated !== undefined) {
    updates["setupWizard.firstTeacherCreated"] = setupWizard.firstTeacherCreated;
  }
  if (setupWizard.firstTeacherDraft !== undefined) {
    updates["setupWizard.firstTeacherDraft"] = setupWizard.firstTeacherDraft;
  }
  if (setupWizard.teacherCount !== undefined) {
    updates["setupWizard.teacherCount"] = setupWizard.teacherCount;
  }
  if (setupWizard.teacherSetupSkipped !== undefined) {
    updates["setupWizard.teacherSetupSkipped"] =
      setupWizard.teacherSetupSkipped;
  }
  if (setupWizard.completedSteps !== undefined) {
    updates["setupWizard.completedSteps"] = setupWizard.completedSteps;
  }
  if (setupWizard.startedAt !== undefined) {
    updates["setupWizard.startedAt"] = setupWizard.startedAt;
  }
  if (setupWizard.completedAt !== undefined) {
    updates["setupWizard.completedAt"] = setupWizard.completedAt;
  }
  if (setupWizard.instituteName !== undefined) {
    updates["setupWizard.instituteName"] = setupWizard.instituteName;
  }
  if (setupWizard.instituteType !== undefined) {
    updates["setupWizard.instituteType"] = setupWizard.instituteType;
  }
  if (setupWizard.educationType !== undefined) {
    updates["setupWizard.educationType"] = setupWizard.educationType;
  }
  if (setupWizard.classRange !== undefined) {
    updates["setupWizard.classRange"] = setupWizard.classRange;
  }
  if (setupWizard.programType !== undefined) {
    updates["setupWizard.programType"] = setupWizard.programType;
  }
  if (setupWizard.weeklyHolidays !== undefined) {
    updates["setupWizard.weeklyHolidays"] = setupWizard.weeklyHolidays;
  }
  if (setupWizard.workingDays !== undefined) {
    updates["setupWizard.workingDays"] = setupWizard.workingDays;
  }
  if (setupWizard.defaultShift !== undefined) {
    updates["setupWizard.defaultShift"] = setupWizard.defaultShift;
  }
  if (setupWizard.academicYear !== undefined) {
    updates["setupWizard.academicYear"] = setupWizard.academicYear;
  }
  if (setupWizard.campusName !== undefined) {
    updates["setupWizard.campusName"] = setupWizard.campusName;
  }
  if (setupWizard.language !== undefined) {
    updates["setupWizard.language"] = setupWizard.language;
  }
  if (setupWizard.timeZone !== undefined) {
    updates["setupWizard.timeZone"] = setupWizard.timeZone;
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, "users", uid), updates);
  }
}