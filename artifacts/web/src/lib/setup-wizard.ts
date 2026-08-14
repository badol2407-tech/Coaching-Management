import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SetupWizardStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "skipped";

export interface SetupWizardState {
  status: SetupWizardStatus;
  currentStep?: number;
  completedSteps?: number[];
  startedAt?: unknown;
  completedAt?: unknown;
}

type SetupWizardWriteState = {
  status: SetupWizardStatus;
  currentStep?: number;
  completedSteps?: number[];
  startedAt?: ReturnType<typeof serverTimestamp>;
  completedAt?: ReturnType<typeof serverTimestamp>;
};

export async function saveSetupWizardState(
  uid: string,
  setupWizard: SetupWizardWriteState,
) {
  await updateDoc(doc(db, "users", uid), { setupWizard });
}