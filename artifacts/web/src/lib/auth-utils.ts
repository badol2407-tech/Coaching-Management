/**
 * Firebase Auth utilities for admin-created teachers & students.
 *
 * Key trick for user creation: we spin up a *secondary* Firebase app instance
 * so that `createUserWithEmailAndPassword` doesn't replace the admin's current
 * auth session.
 */

import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ── Password generation ──────────────────────────────────────────────────────

/**
 * Generate a secure temporary password: 10 chars with uppercase, lowercase,
 * digits, and symbols — but easy to type and share.
 */
export function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@#$!%";
  const all = upper + lower + digits + symbols;

  const pick = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Guarantee at least one from each character class
  const guaranteed = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const rest = Array.from({ length: 6 }, () => pick(all));
  const combined = [...guaranteed, ...rest];

  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

// ── Firebase Auth user creation ──────────────────────────────────────────────

/**
 * Create a Firebase Auth user WITHOUT signing out the current admin.
 * Uses a secondary (isolated) Firebase app instance.
 * Returns the new user's UID.
 */
export async function createFirebaseAuthUser(
  email: string,
  password: string
): Promise<string> {
  const appName = `secondary-${Date.now()}-${Math.random()}`;
  const secondaryApp = initializeApp(firebaseConfig, appName);
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );
    return cred.user.uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}

// ── Credential message builder ────────────────────────────────────────────────

export interface CredentialMessageParams {
  orgName: string;
  name: string;
  role: "Teacher" | "Student";
  email: string;
  password: string;
  loginUrl: string;
}

export function buildCredentialMessage(p: CredentialMessageParams): string {
  return `Welcome to ${p.orgName}

Your EduTrack account has been created successfully.

Role: ${p.role}
Name: ${p.name}
Email: ${p.email}
Temporary Password: ${p.password}

Login: ${p.loginUrl}

For security reasons, please change your password after your first login.`;
}

export function getLoginUrl(): string {
  return window.location.origin;
}
