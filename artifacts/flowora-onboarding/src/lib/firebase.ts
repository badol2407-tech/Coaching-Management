import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

export type Role = 'owner' | 'teacher' | 'student' | 'guardian' | 'staff';
export type Plan = 'free' | 'monthly' | 'yearly';
export type BillingCycle = 'monthly' | 'yearly';
export type OrganizationStatus = 'owner' | 'member' | 'pending';

export interface OnboardingData {
  role: Role;
  studentCount?: number;
  organizationCode?: string;
}

export interface UserRecord {
  role: Role;
  organizationCode?: string;
  organizationId?: string;
  studentCount?: number;
  organizationStatus: OrganizationStatus;
  selectedPlan: Plan;
  billingCycle: BillingCycle;
  onboardingData?: OnboardingData;
  completedOnboarding: boolean;
  completedAt?: unknown;
}

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasConfig = Object.values(config).every(Boolean);
let firebaseError: Error | null = hasConfig ? null : new Error('Firebase is not configured for this demo. Add the VITE_FIREBASE_* values to continue.');

export function getFirebaseError() {
  return firebaseError;
}

function explainFirebaseError(error: unknown): Error {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : '';
  if (code.includes('ADMIN_ONLY_OPERATION')) {
    return new Error('Anonymous sign-in is disabled in Firebase. Enable Authentication → Sign-in method → Anonymous, then retry.');
  }
  if (code.includes('permission-denied')) {
    return new Error('Firestore denied this write. Check the deployed onboarding permissions, then retry.');
  }
  return error instanceof Error ? error : new Error('Firebase rejected the onboarding request.');
}

function reportFirebaseError(operation: string, uid: string, error: unknown): Error {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code?: unknown }).code)
    : undefined;
  const message = error instanceof Error ? error.message : String(error);

  if (import.meta.env.DEV) {
    console.error(`[Flowora Firebase] ${operation} failed`, {
      uid,
      authenticatedUid: getApps().length ? getAuth(getApps()[0]!).currentUser?.uid ?? null : null,
      code,
      message,
      error,
    });
  }

  return explainFirebaseError(error);
}

function assertAuthenticatedUid(uid: string) {
  const { auth } = getFirebase();
  if (!uid) throw new Error('No authenticated user UID was provided for onboarding.');
  if (!auth.currentUser) throw new Error('No authenticated user is available for onboarding.');
  if (auth.currentUser.uid !== uid) {
    throw new Error('The authenticated user changed before onboarding could be saved.');
  }
}

function billingCycleForPlan(plan: Plan): BillingCycle {
  return plan === 'yearly' ? 'yearly' : 'monthly';
}

function getFirebase() {
  if (!hasConfig) throw firebaseError;
  const app = getApps()[0] ?? initializeApp(config);
  return { auth: getAuth(app), db: getFirestore(app) };
}

export async function signInDemo(): Promise<User> {
  try {
    const { auth } = getFirebase();
    if (auth.currentUser) return auth.currentUser;
    return await new Promise<User>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) resolve(user);
        else {
          try { resolve((await signInAnonymously(auth)).user); }
          catch (error) { reject(error); }
        }
      }, reject);
    });
  } catch (error) {
    firebaseError = explainFirebaseError(error);
    throw firebaseError;
  }
}

export async function readUser(uid: string): Promise<UserRecord | null> {
  const { db } = getFirebase();
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? snapshot.data() as UserRecord : null;
}

export async function saveOwner(uid: string, studentCount: number, plan: Plan) {
  const { db } = getFirebase();
  assertAuthenticatedUid(uid);
  const organization = await addDoc(collection(db, 'organizations'), {
    name: 'My new Flowora workspace',
    studentCount,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', uid), {
    role: 'owner',
    organizationId: organization.id,
    studentCount,
    organizationStatus: 'owner',
    selectedPlan: plan,
    billingCycle: billingCycleForPlan(plan),
    completedOnboarding: false,
  }, { merge: true });
  return organization.id;
}

const demoOrganizations: Record<string, string> = {
  'FLOW-2026': 'flowora-demo',
  'COACH-101': 'coach-101',
};

export async function saveMembership(uid: string, role: Role, code: string, plan: Plan) {
  const { db } = getFirebase();
  assertAuthenticatedUid(uid);
  const normalizedCode = code.trim().toUpperCase();
  const organizationId = demoOrganizations[normalizedCode];
  if (organizationId) {
    await setDoc(doc(db, 'users', uid), {
      role,
      organizationCode: normalizedCode,
      organizationId,
      organizationStatus: 'member',
      selectedPlan: plan,
      billingCycle: billingCycleForPlan(plan),
      completedOnboarding: false,
    }, { merge: true });
    return { status: 'member' as const, organizationId, code: normalizedCode };
  }
  await setDoc(doc(db, 'joinRequests', `${uid}_${normalizedCode}`), {
    uid,
    organizationCode: normalizedCode,
    role,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', uid), {
    role,
    organizationCode: normalizedCode,
    organizationStatus: 'pending',
    selectedPlan: plan,
    billingCycle: billingCycleForPlan(plan),
    completedOnboarding: false,
  }, { merge: true });
  return { status: 'pending' as const, code: normalizedCode };
}

export async function completeOnboarding(
  uid: string,
  selectedPlan: Plan,
  onboardingData: OnboardingData,
) {
  const { db } = getFirebase();
  try {
    assertAuthenticatedUid(uid);
    const userRef = doc(db, 'users', uid);
    const billingCycle = billingCycleForPlan(selectedPlan);

    // Save the plan and the full onboarding context first. Completion is a
    // separate write so a failed plan/context write can never mark onboarding
    // as complete.
    await updateDoc(userRef, {
      selectedPlan,
      billingCycle,
      onboardingData,
    });

    await updateDoc(userRef, {
      completedOnboarding: true,
      completedAt: serverTimestamp(),
    });
  } catch (error) {
    throw reportFirebaseError('completeOnboarding', uid, error);
  }
}

export async function updatePlan(uid: string, selectedPlan: Plan) {
  const { db } = getFirebase();
  try {
    assertAuthenticatedUid(uid);
    await updateDoc(doc(db, 'users', uid), {
      selectedPlan,
      billingCycle: billingCycleForPlan(selectedPlan),
    });
  } catch (error) {
    throw reportFirebaseError('updatePlan', uid, error);
  }
}

export async function resetUser(uid: string) {
  const { db } = getFirebase();
  assertAuthenticatedUid(uid);
  await updateDoc(doc(db, 'users', uid), { completedOnboarding: false });
}