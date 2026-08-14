import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
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

export type SetupWizardLanguage = "bn" | "en";

export interface SetupWizardState {
  status: SetupWizardStatus;
  currentStep?: number;
  completedSteps?: number[];
  startedAt?: unknown;
  completedAt?: unknown;
  instituteName?: string;
  instituteType?: InstituteType;
  academicYear?: string;
  campusName?: string;
  language?: SetupWizardLanguage;
  timeZone?: string;
}

type SetupWizardWriteState = {
  status?: SetupWizardStatus;
  currentStep?: number;
  completedSteps?: number[];
  startedAt?: ReturnType<typeof serverTimestamp>;
  completedAt?: ReturnType<typeof serverTimestamp>;
  instituteName?: string;
  instituteType?: InstituteType;
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