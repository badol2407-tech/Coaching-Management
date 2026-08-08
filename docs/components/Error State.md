---
title: EduTrack Error State Handbook
purpose: Define truthful failure presentation and recovery for content, actions, and service availability.
scope: Failed loads, failed saves, timeouts, conflicts, unavailable services, unknown outcomes, and permission-safe failures.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ERROR_HANDLING.md
  - ../STATE_SYSTEM.md
  - ../FEEDBACK_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and after error, recovery, security, or service changes
owner: Product, Product Design, Engineering, Security, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Error State, failure, timeout, conflict, unknown outcome, recovery
---

# Error State

## Purpose

Use an Error State when content or an operation did not complete as intended and the user needs a truthful explanation and safe next action.

## Non-goals

Do not use it to replace an Empty State, reveal sensitive implementation details, imply a failed action definitely did not happen when the outcome is unknown, or clear safe user input.

## Anatomy and variants

Provide a specific heading or message, affected object and scope, completion status, safe recovery action, and support or escalation path when needed. Support load failure, save failure, timeout, conflict, unavailable service, unauthorized, and unknown-outcome variants.

## States and behavior

Support visible, retrying, pending, partial, resolved, stale, unauthorized, and unknown-outcome states. Preserve input and filters, prevent duplicate retries, explain partial completion, and require verification before repeating a potentially completed consequential action.

## Accessibility and responsive behavior

Associate the error with the affected field, object, or region; make recovery keyboard reachable; expose status semantically; and avoid color, motion, or position as the only cue. Support zoom, mobile reflow, reduced motion, and privacy-safe messaging. Follow [ERROR_HANDLING.md](../ERROR_HANDLING.md), [STATE_SYSTEM.md](../STATE_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Report export failed. Your filters are preserved. Retry or change the date range” or “We could not confirm this fee payment. Check payment history before trying again.” Avoid stack traces and vague blame.

## Review evidence

Verify category, object, scope, completion status, recovery, input preservation, unknown-outcome handling, duplicate prevention, privacy, keyboard access, mobile layout, and screen-reader announcement.