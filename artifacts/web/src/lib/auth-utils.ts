/**
 * Firebase Auth utilities for admin-created teachers, students, and
 * administrative staff.
 *
 * Key trick for user creation: we spin up a *secondary* Firebase app instance
 * so that `createUserWithEmailAndPassword` doesn't replace the admin's current
 * auth session.
 */

import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

// ── Password generation ──────────────────────────────────────────────────────

/**
 * Generate a secure temporary password: 10 chars with uppercase, lowercase,
 * digits, and symbols — but easy to type and share.
 */
function secureRandomIndex(max: number): number {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random number generation is unavailable");
  }
  const values = new Uint32Array(1);
  const limit = 0x100000000 - (0x100000000 % max);
  do {
    globalThis.crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return values[0] % max;
}

export function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "@#$!%";
  const all = upper + lower + digits + symbols;

  const pick = (chars: string) => chars[secureRandomIndex(chars.length)];

  // Guarantee at least one from each character class
  const guaranteed = [pick(upper), pick(lower), pick(digits), pick(symbols)];
  const rest = Array.from({ length: 6 }, () => pick(all));
  const combined = [...guaranteed, ...rest];

  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
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
  role: "Teacher" | "Student" | "Administrative Staff";
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
