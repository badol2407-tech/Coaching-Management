---
title: EduTrack Table Handbook
purpose: Define accessible, scoped, and recoverable data table behavior for structured record presentation.
scope: Student lists, Teacher rosters, Attendance records, Fee ledgers, Exam results, Notification logs, and Report summaries.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../FILTER_SYSTEM.md
  - ../SEARCH_EXPERIENCE.md
  - ../RESPONSIVE_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ./Pagination.md
  - ./Data Grid.md
review_frequency: Quarterly and before sort, filter, column, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Table, row, column, header, sort, caption, selection, empty, pagination
---

# Table

## Purpose

Use a Table when the primary relationship between data points is two-dimensional and users need to scan, compare, sort, or act on multiple records simultaneously. Tables are the canonical surface for structured domain records in EduTrack.

## Non-goals

Do not use a Table when data is primarily sequential with no meaningful column comparison. Use [List](./List.md) instead. Do not use a Table for a single entity's detail — use a record-detail layout. Do not embed tables inside tooltips, popovers, or notifications.

## Anatomy and variants

Provide a visible caption or heading that names the dataset and its current scope, a header row with meaningful column labels, a data body, and optional footer for totals or summaries. Support these variants:

- **Default table** — columns, sortable headers, row actions, row selection.
- **Compact table** — reduced row height for high-density views such as Attendance logs or Fee ledgers.
- **Expandable table** — rows that reveal secondary detail on activation, used for installment breakdowns or Exam sub-results.
- **Summary table** — read-only, no row actions; used inside Report exports and Dashboard widgets.

## States and behavior

Support loading, populated, empty, error, filtered-empty, and unauthorized states. Specific behavior requirements:

- **Loading:** Show a [Skeleton](./Skeleton.md) that preserves column count and approximate row count; do not show the header without data rows.
- **Empty:** Distinguish no records from filters excluding all records. See [Empty State](./Empty%20State.md).
- **Error:** Show a recoverable [Error State](./Error%20State.md) with retry; preserve previously visible scope labels.
- **Sorting:** A sorted column shows direction; default sort restores when direction is cycled a third time. Sort state is reflected in the URL or preserved during pagination.
- **Row selection:** Show selected count, affected scope, and the next available bulk action. Do not allow selection of rows the current role cannot act on.
- **Row actions:** Expose primary action inline; secondary actions in a [Dropdown](./Dropdown.md) or [Menu](./Menu.md). Destructive actions require the consequential-confirmation pattern.

## Accessibility and responsive behavior

Associate the caption using `<caption>` or `aria-label`. Use `<th scope="col">` for column headers and `<th scope="row">` for row headers when both axes are meaningful. Sort direction must be exposed programmatically via `aria-sort`. Row-level actions must be reachable by keyboard and have an accessible name that includes the row identity — not just "Edit" or "Delete."

At narrow viewports, transform the table into a card or detail list rather than allowing horizontal overflow or truncated columns. Preserve identity, status, and primary action in the transformed layout. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Caption the table to describe both type and scope: "Student roster — Batch A, Mathematics, 2025–2026" or "Fee ledger — Outstanding installments as of August 2026." Column labels name the data type and include units where needed: "Amount (₹)" not "Amount." Row actions use the object and consequence: "View profile," "Record payment," "Download certificate."

## Review evidence

Verify caption and scope are present and correct; sort direction is keyboard-operable and announced; row identity is included in all action labels; empty and filtered-empty states are distinguishable; loading preserves column structure; row selection reflects current role permissions; expanded rows return focus correctly; table transforms without horizontal overflow at 320 CSS pixels; zoom to 200% does not lose column labels or actions; screen reader reads headers in correct association with cells; localized numbers and dates render correctly.

See [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [COMPONENT_SPECIFICATIONS.md](../COMPONENT_SPECIFICATIONS.md), and [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md).
