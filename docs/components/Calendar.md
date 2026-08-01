---
title: EduTrack Calendar Handbook
purpose: Define accessible, scoped, and context-aware calendar display for scheduling, Attendance, and event browsing.
scope: Attendance session calendars, Exam schedules, Fee due-date views, academic term calendars, and event timelines.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../FORM_DESIGN_GUIDE.md
  - ../INTERNATIONALIZATION.md
  - ../RESPONSIVE_SYSTEM.md
  - ./Date Picker.md
  - ./Timeline.md
review_frequency: Quarterly and before calendar layout, locale, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Calendar, month, week, day, event, session, date range, navigation, locale
---

# Calendar

## Purpose

Use a Calendar when users need to browse, understand, or act on time-distributed records — such as Attendance sessions, Exam dates, Fee due dates, or academic events — in a visual date grid. A Calendar communicates density, gaps, and pattern across time. It is distinct from a [Date Picker](./Date%20Picker.md), which is a form control for selecting a date value.

## Non-goals

Do not use a Calendar for selecting a date value inside a form — use a [Date Picker](./Date%20Picker.md). Do not use it for precise time scheduling at sub-hour granularity — use a [Timeline](./Timeline.md) or dedicated scheduling surface. Do not present a Calendar as the sole access point to records; records must also be accessible through list and filter surfaces.

## Anatomy and variants

Provide a month/week/day view toggle where multiple granularities are supported, a title showing the current period and scope, navigation to the previous and next period, a "today" control, day cells with event or status indicators, and a detail mechanism (popover or inline expansion) for day-level record access.

Support these variants:

- **Month view** — grid of days in the selected month; used for Attendance session overview, Exam calendar, and Fee due-date view.
- **Week view** — days of the selected week as columns with event slots; used for detailed Attendance or scheduling contexts.
- **Day view** — single day with time slots; used when per-session detail is the primary task.
- **Range calendar** — two linked month grids for selecting a date range; used in Report and Analytics date-range inputs. This variant functions as a form control — see [Date Picker](./Date%20Picker.md) for the picker wrapper.

## States and behavior

- **Navigation:** Previous/next period and year jump are keyboard-operable. Navigation does not lose the current scope (organization, batch, subject).
- **Event indicators:** Show status through color combined with a label or icon — never color alone. Attendance exceptions, Exam days, and Fee due dates use distinct and consistently labeled indicators.
- **Day activation:** Activating a day with records opens a detail summary — inline or in a [Popover](./Popover.md) — that lists records with actions. A day with no records shows a clear empty message, not a blank cell.
- **Loading:** Placeholder cells of stable dimension replace day content while data loads.
- **Out-of-scope days:** Days outside the academic term or selected scope are visually muted and marked as unavailable, not removed.
- **Today:** The current date is always distinguishable by non-color means (border, label, or marker).

## Accessibility and responsive behavior

Implement the calendar grid with a `role="grid"` table or native `<table>` with appropriate header associations. Each day cell is a `gridcell`. Month and week headings are `columnheader`. The focused day is navigable with arrow keys; Home/End navigate within the week; Page Up/Down navigate periods; Ctrl+Home/End reach the first and last navigable dates. The current date, selected date, and dates with events are announced to screen readers.

Apply locale-aware first-day-of-week, date formatting, and calendar system from [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). At narrow viewports, the month view stacks to a condensed format; events are accessible via a list view below the grid. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md).

## Content and examples

Period title: "July 2026 — Batch A, Mathematics." Day tooltip: "Thursday 14 July 2026 — 2 Attendance sessions: Morning (marked), Afternoon (pending)." Empty day: "No sessions scheduled." Out-of-scope: "Outside academic term."

## Review evidence

Verify keyboard navigation through days, weeks, months, and periods; today is distinguishable by non-color means; event indicators combine color with a label or icon; day detail is reachable by keyboard; loading state preserves grid structure; out-of-scope days are identified not removed; locale formats date and first-day-of-week correctly; narrow viewport provides a list alternative; zoom to 200% preserves day labels and indicators; screen reader announces focused date, events, and navigation.

See [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).
