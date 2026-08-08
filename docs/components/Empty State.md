---
title: EduTrack Empty State Handbook
purpose: Define truthful guidance when a completed request contains no usable content for the current scope.
scope: No records, no matching results, not configured, no access, unavailable data, and first-use states.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../EMPTY_STATES.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before empty, setup, permission, or content changes
owner: Product, Product Design, Content, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Empty State, no records, no results, not configured, no access, scope
---

# Empty State

## Purpose

Use an Empty State when a request completed and there is no content to show for the current object, scope, query, permission, or setup condition.

## Non-goals

Do not use it to disguise loading, service failure, authorization denial, stale data, or an error. Do not imply that an empty view means the system is healthy without naming the actual condition.

## Anatomy and variants

Provide a specific heading, object and scope, concise explanation, one primary safe action, and an optional alternative such as clear filters, refresh, or learn more. Support no records, no results, first-use, not configured, no access, and unavailable variants with distinct meaning.

## States and behavior

Support initial, ready-empty, filtered-empty, not configured, unauthorized, unavailable, and recovery states. Preserve search and filter input, distinguish no records from no matches, and do not offer an action the user cannot perform.

## Accessibility and responsive behavior

Use a semantic heading and explanatory text, ensure the primary action is keyboard reachable, expose status without color or illustration alone, and support zoom, dynamic type, mobile reflow, and reduced motion. Follow [EMPTY_STATES.md](../EMPTY_STATES.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “No students match these filters. Clear filters or add a student” or “No attendance has been recorded for this batch yet.” Name the object, scope, and next safe action.

## Review evidence

Verify condition distinction, scope/date/freshness, permission handling, safe action, filter preservation, semantic announcement, mobile layout, localization, and no false-success or hidden-error messaging.