---
name: Coaching app architecture
description: Stack, key file locations, and route structure for the Coaching Management System
---

## Stack
Express 5 + PostgreSQL (Drizzle ORM) + React/Vite + TanStack Query. All API contracts in `lib/api-spec/openapi.yaml`.

## Key files
- Schema: `lib/db/src/schema/students.ts`, `lib/db/src/schema/attendance.ts`
- Routes: `artifacts/api-server/src/routes/{students,attendance,dashboard}.ts`
- Frontend entry: `artifacts/coaching-app/src/App.tsx`
- API hooks: `lib/api-client-react/src/generated/api.ts`
- Zod schemas: `lib/api-zod/src/generated/api.ts`

## DB design
- `students` table: unique `student_id` text column; `status` is `active`|`inactive`
- `attendance` table: unique constraint on `(student_id, date)` → upsert with `ON CONFLICT`

## Routes
- `GET/POST /students`, `GET/PATCH/DELETE /students/:id`
- `GET/POST /attendance`, `PATCH /attendance/:id`, `GET /attendance/student-summary`
- `GET /dashboard/stats`, `/dashboard/daily-attendance`, `/dashboard/monthly-attendance`, `/dashboard/batches`

**Why:** OpenAPI-first contract ensures frontend hooks and server validators stay in sync via codegen.
