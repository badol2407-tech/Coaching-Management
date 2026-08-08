---
title: EduTrack Table Design Guide
purpose: Define accessible, scannable, and resilient table behavior for Students, Teachers, Attendance, Fees, Exams, Reports, and Analytics.
scope: Table structure, columns, sorting, selection, pagination, density, responsive behavior, export, and data states.
audience: Product, Design, Engineering, QA, Accessibility, Security, Privacy, and AI implementation contributors.
related_documents:
  - ./COMPONENT_SPECIFICATIONS.md
  - ./DATA_VISUALIZATION_GUIDE.md
  - ./SEARCH_EXPERIENCE.md
  - ./FILTER_SYSTEM.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./ENGINEERING_STANDARDS.md
review_frequency: Quarterly and before changing a shared table component or data contract
owner: Product Design, Design Systems, Engineering, and Data Experience
version: 1.0.0
status: Binding component and data standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Search, Filters, Organization, Workspace, Permission, Role
---

# EduTrack Table Design Guide

## Purpose

Tables support comparison, review, correction, and bulk work. They must make relationships and scope clear when showing Students, Teachers, Attendance records, Fee balances, Exam results, Reports, or Analytics.

## Scope and ownership

This handbook owns table information architecture and behavior. [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) owns the reusable component contract; [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md) owns chart and data explanation; [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md) own query controls.

## Implementation principles

1. Design the table around the decision the user must make, not around every available field.
2. Keep row identity, scope, status, and primary action visible without requiring a hover.
3. Use stable columns and formatting so users can compare values across rows and pages.
4. Make sorting, selection, pagination, and bulk actions explicit and reversible where safe.
5. Use a table only when a two-dimensional relationship improves the task; use a list or cards when it does not.

## Design standards

- Every table has a caption or accessible name, column headers, row identity, scope, freshness, and result count.
- Headers define the data relationship; cells must not rely on position or color alone.
- Sort controls expose current direction and preserve Search, Filters, page, and scope where safe.
- Selection exposes selected count, selection scope, and consequence before bulk Attendance, Fee, Exam, Report, or Permission actions.
- Numeric values include units, currency, time zone, precision, and missing-data meaning where applicable.
- Use visual density modes only if row identity, focus, touch operation, and error content remain available.
- On mobile, reflow, prioritize columns, provide accessible row detail, or allow deliberate horizontal review; do not silently truncate required values.
- Export must state scope, filters, freshness, file type, and privacy implications before generation.

## Engineering standards

- Use stable row keys and deterministic sort ordering; handle ties explicitly.
- Enforce server-side Organization, Workspace, Role, and Permission scope for fetched and exported rows.
- Test empty, loading, partial, stale, error, unauthorized, long text, duplicate values, and large result sets.
- Preserve selection and user intent only when row identity and freshness are still valid.
- Instrument query latency, render cost, export duration, and failure recovery.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md). Use semantic table markup when relationships are tabular; provide keyboard-complete sorting, selection, pagination, focus, row actions, and a text/table alternative for Analytics.

## AI implementation notes

The AI Assistant may summarize a table only with stated scope, freshness, filters, and limitations. It must not infer missing values, expose protected rows, or apply bulk Attendance, Fee, Exam, Report, or Permission changes without authorized human confirmation.

## Review checklist

- [ ] The table supports a named decision and has no unnecessary columns.
- [ ] Identity, scope, freshness, units, status, and actions are explicit.
- [ ] Sorting, selection, bulk actions, export, and recovery are defined.
- [ ] Mobile, localization, zoom, screen reader, and large-data behavior are reviewed.
- [ ] Authorization and sensitive-data exposure are tested.

## Validation checklist

- [ ] Semantic structure, keyboard operation, focus, and announcements pass.
- [ ] Search, Filters, sort, pagination, selection, and export preserve state safely.
- [ ] Students, Teachers, Attendance, Fees, Exams, Reports, and Analytics examples pass.
- [ ] Performance and authorization tests pass for representative data.
- [ ] Evidence is recorded in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
- [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md)
- [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md)