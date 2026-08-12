import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';

export type Role = 'owner' | 'teacher' | 'student' | 'guardian' | 'staff';
export type Plan = 'free' | 'monthly' | 'yearly';
export type OrganizationStatus = 'owner' | 'member' | 'pending';

export interface UserRecord {
  role: Role;
  organizationCode?: string;
  organizationId?: string;
  studentCount?: number;
  organizationStatus: OrganizationStatus;
  selectedPlan: Plan;
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
    return new Error('Firestore denied this write. Deploy the included firestore.rules file, then retry.');
  }
  return error instanceof Error ? error : new Error('Unable to connect to Firebase.');
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
  const normalizedCode = code.trim().toUpperCase();
  const organizationId = demoOrganizations[normalizedCode];
  if (organizationId) {
    await setDoc(doc(db, 'users', uid), {
      role,
      organizationCode: normalizedCode,
      organizationId,
      organizationStatus: 'member',
      selectedPlan: plan,
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
    completedOnboarding: false,
  }, { merge: true });
  return { status: 'pending' as const, code: normalizedCode };
}

export async function completeUser(uid: string) {
  const { db } = getFirebase();
  await updateDoc(doc(db, 'users', uid), {
    completedOnboarding: true,
    completedAt: serverTimestamp(),
  });
}

export async function updatePlan(uid: string, selectedPlan: Plan) {
  const { db } = getFirebase();
  await updateDoc(doc(db, 'users', uid), { selectedPlan });
}

export async function resetUser(uid: string) {
  const { db } = getFirebase();
  await updateDoc(doc(db, 'users', uid), { completedOnboarding: false });
}