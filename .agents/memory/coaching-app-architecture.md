---
name: Coaching app architecture
description: Stack, key file locations, and route structure for the Coaching Management System
---

## Stack
The main product is a React/Vite + Firebase Firestore application in `artifacts/web`. The separate Express/PostgreSQL API server is not used by the main app.

## Key files
- Frontend entry: `artifacts/web/src/App.tsx`
- Firestore client: `artifacts/web/src/lib/firebase.ts`
- Firestore hooks: `artifacts/web/src/lib/hooks.ts`
- Realtime synchronization: `artifacts/web/src/components/RealtimeSync.tsx`
- Rules: `firestore.rules`

## Data design
- Organization-scoped Firestore collections live under `organizations/{orgId}`.
- Shared product entities such as students, routine, notices, fees, and attendance are accessed directly through Firebase hooks.

## Routes
- App routes are defined in `artifacts/web/src/App.tsx` and rendered by role-specific layouts.
- Administrative staff routes use the `/staff/...` prefix.

**Why:** The repository evolved from the starter full-stack template to a Firebase-first product; keeping this architecture note current prevents future work from adding unused API-server or PostgreSQL dependencies.
