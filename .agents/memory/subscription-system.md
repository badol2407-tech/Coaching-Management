---
name: Subscription System
description: Tier-based subscription enforcement for the Coaching Management app
---

## New plan IDs (canonical)
- `free_trial` → 7 days, ৳0
- `founder_launch` → monthly, ৳749/mo
- `annual_premium` → yearly, ৳9,999/yr

## Legacy mapping
Old IDs (`free`, `basic`, `pro`) are mapped via `mapLegacyPlanToTier()` in `plan-config.ts`. Both old and new IDs are written on org create/update (`tier` = new, `plan` = legacy).

## Key files
- `artifacts/web/src/lib/plan-config.ts` — single source of truth for all tier data
- `artifacts/web/src/lib/subscription.ts` — `getOrgAccessStatus()`, `getRemainingDays()`, `formatExpiryDate()`
- `artifacts/web/src/pages/SubscriptionExpired.tsx` — professional block screen (3 variants: expired / paused / unpaid_blocked)
- `artifacts/web/src/contexts/AuthContext.tsx` — loads `orgSubscription` into `UserProfile` on login

## Subscription gate
`AppLayout`, `TeacherLayout`, `StudentLayout` all check `getOrgAccessStatus(userProfile.orgSubscription)` before rendering. Super admins and impersonating super admins (`impersonation !== null`) always bypass.

## Firestore org fields
New: `tier`, `accountStatus`, `subscriptionStartDate`, `subscriptionExpiryDate`
Legacy kept: `plan`, `status` (written in sync for backward compat)
Existing orgs without `subscriptionExpiryDate` are treated as active (safe migration).

## Super Admin pages updated
- ManageOrganizations: tier selector + full EditOrgSheet (tier, expiry date, payment status, account status, renew/extend buttons)
- PricingPlans, FreeTrial, ActiveSubscriptions, PaidUnpaid, SuperAdminDashboard: all use new tier IDs
- FreeTrial page has one-click upgrade to Founder/Annual

## Web artifact
- Already had `.replit-artifact/artifact.toml` (id="artifacts/web", port=22333, BASE_PATH="/")
- Workflow registered via configureWorkflow: "artifacts/web: web"
- Firebase env vars (VITE_FIREBASE_*) already set in shared environment
- TypeScript: clean (0 errors after fix)

**Why:** All decisions documented above preserve existing org data without a migration script, while enabling new subscription enforcement for all new orgs.
