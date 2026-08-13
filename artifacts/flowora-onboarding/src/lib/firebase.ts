import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

export type Role = 'owner' | 'teacher' | 'student' | 'guardian' | 'staff';
export type Plan = 'free' | 'monthly' | 'yearly';
export type BillingCycle = 'monthly' | 'yearly';
export type OrganizationStatus = 'owner' | 'member' | 'pending';
export type OnboardingAnswerValue = string | number | boolean;

export interface OnboardingData {
  role: Role;
  studentCount?: number;
  organizationCode?: string;
  heardFrom?: string;
  profession?: string;
  portalChoice?: string;
  organizationSize?: string;
  answers?: Record<string, OnboardingAnswerValue>;
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
  onboardingAnswers?: Record<string, OnboardingAnswerValue>;
  heardFrom?: string;
  profession?: string;
  portalChoice?: string;
  organizationSize?: string;
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

class FirebaseOperationError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'FirebaseOperationError';
    this.code = code;
  }
}

function firebaseErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) return undefined;
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

function explainFirebaseError(error: unknown): FirebaseOperationError {
  const code = firebaseErrorCode(error) ?? '';
  const normalizedCode = code.toLowerCase();
  const originalMessage = error instanceof Error ? error.message : String(error);

  if (normalizedCode.includes('admin-restricted-operation') || normalizedCode.includes('admin_only_operation')) {
    return new FirebaseOperationError('A signed-in EduTrack account is required to continue.', 'auth/unauthenticated', error);
  }
  if (normalizedCode.includes('permission-denied')) {
    return new FirebaseOperationError('Firestore denied this onboarding save. Please check your account permissions and try again.', code, error);
  }
  if (normalizedCode.includes('unauthenticated') || normalizedCode === 'auth/user-token-expired') {
    return new FirebaseOperationError('Your sign-in session expired. Please sign in again to continue.', code, error);
  }
  if (normalizedCode.includes('network') || ['unavailable', 'deadline-exceeded'].includes(normalizedCode)) {
    return new FirebaseOperationError('The save service is temporarily unavailable. Please try again.', code, error);
  }
  return new FirebaseOperationError(originalMessage || 'Firebase rejected the onboarding request.', code, error);
}

function reportFirebaseError(operation: string, uid: string, error: unknown): FirebaseOperationError {
  const code = firebaseErrorCode(error);
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
  if (!uid) throw new FirebaseOperationError('Your sign-in session is missing. Please sign in again to continue.', 'auth/unauthenticated');
  if (!auth.currentUser) throw new FirebaseOperationError('Your sign-in session is missing. Please sign in again to continue.', 'auth/unauthenticated');
  if (auth.currentUser.uid !== uid) {
    throw new FirebaseOperationError('Your sign-in session changed. Please sign in again to continue.', 'auth/unauthenticated');
  }
}

function billingCycleForPlan(plan: Plan): BillingCycle {
  return plan === 'yearly' ? 'yearly' : 'monthly';
}

function portalChoiceForRole(role: Role) {
  return {
    owner: 'organization-admin',
    teacher: 'teacher',
    student: 'student',
    guardian: 'guardian',
    staff: 'administrative-staff',
  }[role];
}

function getFirebase() {
  if (!hasConfig) throw firebaseError;
  const app = getApps()[0] ?? initializeApp(config);
  return { auth: getAuth(app), db: getFirestore(app) };
}

export async function getAuthenticatedUser(): Promise<User> {
  try {
    const { auth } = getFirebase();
    if (auth.currentUser) return auth.currentUser;
    return await new Promise<User>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) resolve(user);
        else reject(new FirebaseOperationError('A signed-in EduTrack account is required to continue.', 'auth/unauthenticated'));
      }, reject);
    });
  } catch (error) {
    throw reportFirebaseError('getAuthenticatedUser', '', error);
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
  billingCycle: BillingCycle,
  onboardingData: OnboardingData,
) {
  try {
    if (!uid) throw new FirebaseOperationError('Your sign-in session is missing. Please sign in again to continue.', 'auth/unauthenticated');
    if (!selectedPlan) throw new Error('Please choose a pricing plan before continuing.');
    if (!billingCycle) throw new Error('Please choose a billing cycle before continuing.');
    if (!onboardingData || typeof onboardingData !== 'object') {
      throw new Error('Your onboarding answers are missing. Please go back and try again.');
    }

    const { db } = getFirebase();
    assertAuthenticatedUid(uid);
    const userRef = doc(db, 'users', uid);
    const profileUpdate: Record<string, unknown> = {
      selectedPlan,
      billingCycle,
      onboardingData,
      onboardingAnswers: onboardingData.answers ?? onboardingData,
      portalChoice: onboardingData.portalChoice ?? portalChoiceForRole(onboardingData.role),
    };

    if (onboardingData.heardFrom) profileUpdate.heardFrom = onboardingData.heardFrom;
    if (onboardingData.profession) profileUpdate.profession = onboardingData.profession;
    if (onboardingData.organizationSize) profileUpdate.organizationSize = onboardingData.organizationSize;

    // Save the plan and the full onboarding context first. Completion is a
    // separate write so a failed plan/context write can never mark onboarding
    // as complete.
    await updateDoc(userRef, profileUpdate);

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