---
name: Teacher dashboard Sprint 1
description: What was built in Sprint 1 and the routine day-key mapping quirk
---

## What was built

Enhanced `artifacts/web/src/pages/teacher/TeacherDashboard.tsx` with:

- **4 stat cards** — Total Students, Today's Attendance (% present), Upcoming Exams, Homework count
- **Today's Classes panel** — pulled from `useListRoutine()`, filtered by `r.day === todayKey`; shows ongoing badge (cyan) and done checkmark
- **Attendance Progress card** — present / absent / unmarked breakdown with animated progress bar
- **6-button Quick Actions grid** — Attendance, Students, Exams, Homework, Routine, Notices
- **Homework overview** — recent 4 items with subject badge + due date
- **Upcoming Exams** — sorted by date, days-remaining countdown; red when ≤ 3 days
- **Recent Notices** feed

All data comes from existing hooks in `lib/hooks.ts` — no new Firestore collections or hooks were needed.

## Routine day-key mapping quirk

The `routine` collection stores a `day` field using lowercase English keys: `saturday`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`.

JavaScript `Date.getDay()` returns: 0 = Sunday, 1 = Monday, …, 6 = Saturday.

Mapping used:
```
{ 0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday", 4: "thursday", 5: "friday", 6: "saturday" }
```

**Why it matters:** Getting this wrong shows no classes every day, which looks broken but silently fails.
