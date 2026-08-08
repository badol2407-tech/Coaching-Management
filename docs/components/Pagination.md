---
title: EduTrack Pagination Handbook
purpose: Define accessible, scoped, and predictable navigation through multi-page record sets.
scope: Student lists, Teacher rosters, Fee ledgers, Attendance logs, Exam result sets, Notification history, and Report exports.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../RESPONSIVE_SYSTEM.md
  - ../TABLE_DESIGN_GUIDE.md
  - ./Table.md
  - ./Data Grid.md
review_frequency: Quarterly and before pagination, loading, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Pagination, page, page size, total, current page, next, previous, offset
---

# Pagination

## Purpose

Use Pagination to let users navigate through a record set that is too large to present on a single page. Pagination exposes position, total scope, and directional control without requiring the user to hold page state in memory.

## Non-goals

Do not use Pagination when the entire result set is small enough to present on one page without performance or comprehension cost. Do not use it as the only mechanism to reveal critical records — apply Filters and Search first so users can narrow scope before paginating. Do not implement infinite scroll as a substitute for Pagination in contexts where position, total, and record identity must be preserved (such as Exam results or Fee ledgers).

## Anatomy and variants

Provide a current page indicator, total record count and page count when known, page-size selector when the user's density preference matters, previous and next controls, and optional direct-page jump for large sets. Support these variants:

- **Numbered pagination** — explicit page numbers with a defined range around the current page; used for lists where position identity is useful (e.g., "page 3 of 12 — records 41–60").
- **Previous/next only** — directional navigation without explicit page numbers; used when total count is unavailable or when the sequential flow is the expected traversal.
- **Cursor-based** — next and previous tokens replacing numeric offsets; used when the backend uses cursor pagination and page-number calculation is impractical.

## States and behavior

- **First page:** Previous control is disabled, not hidden. Its accessible name reflects the disabled reason: "Previous page, unavailable on first page."
- **Last page:** Next control is disabled, not hidden. Total count is confirmed when available.
- **Loading:** While a new page loads, disable page controls and show a loading indicator within the list region, not replacing the Pagination controls.
- **Error:** Retain the current page and show a recoverable error message. Do not navigate away from the user's last successful page.
- **Page size change:** Resets to page 1 and updates the total displayed. Announce the new result count to assistive technology.
- **Scope change:** Changing a Filter or Search query resets pagination to page 1. Preserve the page-size preference.
- **URL state:** Persist current page and page size in the URL so that links, shares, and browser navigation reproduce the same view.

## Accessibility and responsive behavior

Use `<nav aria-label="[List name] pagination">` as the landmark container. Label the current page with `aria-current="page"`. Disabled controls use `aria-disabled="true"` and remain focusable. Announce page transitions with a live region so screen-reader users know the list has updated.

At narrow viewports, reduce to previous/next controls and a concise position indicator ("Page 3 of 12"). Remove direct-page-jump input from the mobile layout if it introduces compression artifacts. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Position indicator: "Showing records 41–60 of 312 students" or "Page 3 of 12." Page-size selector label: "Rows per page." Navigation controls: "Previous page" and "Next page" — not symbols alone.

## Review evidence

Verify previous/next are disabled not hidden at boundaries; current page is announced on transition; total count is accurate and localized; page-size change resets to page 1; URL preserves page and size; Filter or Search resets to page 1; keyboard operates all controls; screen reader announces the updated list after navigation; narrow viewport reduces gracefully without losing position indicator; zoom to 200% does not truncate controls.

See [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [COMPONENT_SPECIFICATIONS.md](../COMPONENT_SPECIFICATIONS.md), and [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md).
