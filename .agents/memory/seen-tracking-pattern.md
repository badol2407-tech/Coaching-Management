---
name: EduTrack seen-tracking pattern
description: How "who has seen this" tracking and batch-based visibility is implemented across EduTrack modules
---

Notices and Homework originally had a "seen" subcollection pattern (`{collection}/{docId}/seen/{uid}` with `{name, seenAt}`), shown to staff as a "কে দেখেছে?" panel with student name + timestamp only (no email/UID/phone). This pattern was extended to Routine, Fees, and Exams to cover all 5 student-facing modules.

**Why:** Org admins need visibility into whether students actually viewed assignments/notices/schedules without exposing PII beyond name.

**How to apply:** For any new student-facing module needing this, add `useMark<X>Seen`/`use<X>Seen` hooks in `lib/hooks.ts` following the existing pair for any of Notices/Homework/Routine/Fees/Exams, add a `SeenPanel` component, and wire an auto-mark-seen `useEffect` in `StudentPortal.tsx` keyed on the relevant tab.

Batch-based visibility: items can carry an optional `batch` field; a `filterByMyBatch()` helper in `lib/hooks.ts` keeps items with no batch (visible org-wide) or matching the student's own batch (looked up via `useMyStudentRecord()`, which reads `organizations/{orgId}/students/{studentId}`, not the `users` profile doc). Applied client-side in `StudentPortal.tsx` for routine/homework/notices/exams; Fees is already stronger (filtered by studentId).

Org creation was already restricted to the `super_admin` role client-side (no public org-creation UI existed). A `firestore.rules` file at the repo root now also enforces this server-side: only `role == "super_admin"` (looked up from `users/{uid}`) can write to the `organizations` collection; per-org collections are scoped by `orgId` match. No Firebase deploy credentials exist in this environment, so rule changes must be deployed manually via `firebase deploy --only firestore:rules` or the Firebase Console — cannot be pushed from the agent.
