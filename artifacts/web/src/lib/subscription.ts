/**
 * Subscription enforcement utilities.
 *
 * These functions derive org access status from Firestore data without
 * making any network requests — all checks are pure, synchronous, and
 * testable. The layouts and route guards consume these to decide whether
 * to show the portal or the SubscriptionExpired screen.
 */

import { getEffectiveTier, PlanTier } from "./plan-config";

// ── Status type ───────────────────────────────────────────────────────────────

export type OrgAccessStatus =
  | "active"
  | "expired"        // subscription period has ended
  | "paused"         // manually paused by super admin
  | "unpaid_blocked"; // paid plan with no payment recorded

// ── Input shape ───────────────────────────────────────────────────────────────

/** Minimal org fields needed to compute access status. */
export interface OrgSubData {
  tier?: string | null;
  plan?: string | null;                       // legacy
  subscriptionStartDate?: string | null;
  subscriptionExpiryDate?: string | null;
  paymentStatus?: string | null;
  accountStatus?: string | null;
  status?: string | null;                     // legacy
}

// ── Core status function ──────────────────────────────────────────────────────

/**
 * Returns the current access status for an organization.
 *
 * Priority order:
 *  1. Paused  — accountStatus / status === "paused"
 *  2. Expired — subscriptionExpiryDate is in the past
 *  3. Unpaid  — paid tier without paymentStatus === "paid"
 *  4. Active  — everything OK
 *
 * Orgs without a subscriptionExpiryDate are NOT expired (safe migration default).
 * This avoids locking out existing organizations during data migration.
 */
export function getOrgAccessStatus(org: OrgSubData): OrgAccessStatus {
  // 1. Paused
  const acctStatus = org.accountStatus ?? org.status ?? "active";
  if (acctStatus === "paused") return "paused";

  const tier: PlanTier = getEffectiveTier(org);

  // 2. Expiry — only checked if expiry date is present
  if (org.subscriptionExpiryDate) {
    if (new Date(org.subscriptionExpiryDate) < new Date()) return "expired";
  }

  // 3. Unpaid — only for paid plans without paymentStatus === "paid"
  // Free trial doesn't require payment
  if (tier !== "free_trial" && org.paymentStatus !== "paid") {
    return "unpaid_blocked";
  }

  return "active";
}

/** True only when the org has full portal access. */
export function isOrgActive(org: OrgSubData): boolean {
  return getOrgAccessStatus(org) === "active";
}

/** Number of days remaining until expiry. Null if no expiry date is set. */
export function getRemainingDays(expiryDate?: string | null): number | null {
  if (!expiryDate) return null;
  const diff = new Date(expiryDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Format expiry date for display. */
export function formatExpiryDate(expiryDate?: string | null): string {
  if (!expiryDate) return "—";
  return new Date(expiryDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
