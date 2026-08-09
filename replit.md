# EduTrack

EduTrack is a Firebase-connected school management platform for school teams, teachers, students, and guardians.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The web app uses the existing Firebase configuration and environment-injected Firebase API key.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/web/src/App.tsx` — primary web routes and role-based portal routing
- `artifacts/web/src/pages/guardian/GuardianPortal.tsx` — Guardian Portal dashboard and sections
- `artifacts/web/src/components/layout/GuardianLayout.tsx` — responsive guardian navigation shell
- `artifacts/web/src/contexts/AuthContext.tsx` — Firebase authentication and user roles
- `artifacts/web/src/lib/hooks.ts` — Firestore-backed school data hooks
- `firestore.rules` — organization-scoped Firebase access rules
- `artifacts/web/src/index.css` — shared EduTrack and Guardian Portal styling

## Architecture decisions

- The imported `artifacts/web` app remains the single source of truth for the product; its `/guardian` route preserves the existing admin, teacher, and student portals.
- Guardian access is a first-class Firebase role scoped to the guardian's organization and linked student record.
- The Guardian Portal reuses existing Firestore data hooks for attendance, fees, results, exams, routine, notices, and homework.
- Teacher messaging and leave requests use clearly labeled graceful states until matching backend collections and mutations are introduced.
- Vite builds the SPA to `artifacts/web/dist/public`; the root `vercel.json` uses the same package and output directory.

## Product

EduTrack includes school operations dashboards, student and teacher management, attendance, exams, fees, notices, homework, routine, subscriptions, Firebase authentication, and role-based portals. The Guardian Portal adds a premium mobile-first family view for a linked child, including attendance summaries, academic results, fee status, notices, homework, routine, profile/settings, notifications, and navigation for teacher messages and leave requests.

## User preferences

- Keep the product premium, responsive, and mobile-first with a polished Flowora-inspired glassmorphism direction.
- Preserve the existing Firebase and Vercel configuration when extending the imported app.
- Prefer functional Firebase-backed behavior and explicit graceful states over silent mock fallbacks.

## Gotchas

- Run `pnpm --filter @workspace/web run typecheck` and `pnpm --filter @workspace/web run build` after web changes.
- The primary registered app is `artifacts/web` at `/`; the secondary scaffold artifact is intentionally routed under `/edutrack/` to avoid competing for the root preview path.
- Guardian accounts must have `role: "guardian"` and a matching `studentId` in their Firebase user profile to see linked student records.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
