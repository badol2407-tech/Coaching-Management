---
title: EduTrack List Handbook
purpose: Define sequential collections of records or options with identity, status, scope, and accessible actions.
scope: Students, Teachers, Notifications, activity, search results, mobile table alternatives, and ordered options.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before collection, sorting, filtering, or responsive changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: List, item, row, identity, scope, status, empty, no results
---

# List

## Purpose

Use a List when records are primarily sequential and users need to scan identity, status, supporting fields, and actions without a two-dimensional table relationship.

## Non-goals

Do not use it to hide sortable relationships that are clearer in a table, to replace search or filters, or to make item position and color carry identity or status.

## Anatomy and variants

Provide a list title or caption, ordered or unordered semantics appropriate to the content, identifiable items, labeled fields, status, and accessible actions. Support compact, detailed, activity, result, and mobile-converted variants only when hierarchy remains clear.

## States and behavior

Support initial, loading, ready, empty, no results, partial, stale, error, unauthorized, selected, and disabled states as applicable. Preserve search/filter scope, selected items, and safe work through loading and recoverable errors. Bulk actions state the selected count and scope.

## Accessibility and responsive behavior

Use semantic lists or appropriate structured-data semantics, headings and labels, visible focus, and text alternatives for status. Do not require hover to discover actions. Reflow to compact screens without losing identity, scope, primary action, or recovery. Follow [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Lead with identity: “Aisha Khan,” “Grade 8 attendance,” or “Unread security notification.” Include status and the next useful action; distinguish no records from filters excluding records.

## Review evidence

Verify item identity, field labels, scope persistence, sort/filter status, loading/empty/no-result/error states, keyboard actions, bulk selection, long names, mobile conversion, zoom, and screen-reader reading order.