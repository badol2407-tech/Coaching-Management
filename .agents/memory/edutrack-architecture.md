---
name: EduTrack architecture
description: Core technical architecture — Firebase-first, multi-tenant, role system
---

EduTrack is a Firebase-first SaaS. The frontend (React + Vite) talks **directly to Firestore**; there is no Express middleware in the data path. The `artifacts/api-server` Express service exists but is currently a health-check stub only — not used by the web app.

**Why:** Speed of development; Firestore's real-time and security-rules model suits multi-tenant SaaS well.

**How to apply:** Any new feature should add hooks to `artifacts/web/src/lib/hooks.ts` (TanStack Query + Firestore SDK), not build Express routes, unless the feature genuinely requires server-side logic (webhooks, payment callbacks, etc.).

## Multi-tenancy

All org data lives under `organizations/{orgId}/{collection}`. The `orgId` comes exclusively from the authenticated user's Firestore profile (`users/{uid}.orgId`) — never from client-supplied input.

## Auth & Roles

Roles: `super_admin`, `org_admin`, `teacher`, `student`.

Super admin requires **both**: email in hardcoded whitelist (`AuthContext.tsx`) AND Firestore `role === "super_admin"`. Email alone is insufficient.

## Subscription gating

Each layout (`TeacherLayout`, `AppLayout`, `StudentLayout`) calls `getOrgAccessStatus(userProfile.orgSubscription)`. If not `"active"`, renders `SubscriptionExpiredScreen` instead of the app. Teachers and students cannot bypass this.

## Key files

- `artifacts/web/src/lib/hooks.ts` — all Firestore TanStack Query hooks
- `artifacts/web/src/contexts/AuthContext.tsx` — auth + role resolution
- `artifacts/web/src/lib/subscription.ts` — `getOrgAccessStatus`, tier helpers
- `artifacts/web/src/lib/plan-config.ts` — `mapLegacyPlanToTier`, `getEffectiveTier`
