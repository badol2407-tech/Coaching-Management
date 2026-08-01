---
title: EduTrack Alert Handbook
purpose: Define important inline status or decision guidance that requires attention in the current content flow.
scope: Validation summaries, important warnings, recovery instructions, and object-level status.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FEEDBACK_SYSTEM.md
  - ../ERROR_HANDLING.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before severity, error, or recovery changes
owner: Product, Product Design, Content, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Alert, inline status, warning, error, recovery, severity
---

# Alert

## Purpose

Use an Alert for important inline information, warnings, or recovery guidance that belongs beside the affected content or workflow.

## Non-goals

Do not use it for decorative status, routine success that needs no action, every validation message, or a modal interruption. Use field-level errors for local input and [Dialog](./Dialog.md) for intentional blocking review.

## Anatomy and variants

Provide a semantic status or alert region, meaningful message, affected object or scope, severity, and next safe action when applicable. Success, info, warning, and error presentations must retain text and semantic distinctions.

## States and behavior

Support visible, updated, dismissed where safe, resolved, pending, unauthorized, and error-recovery states. Preserve the alert while the underlying issue remains relevant and do not imply resolution before the source state changes.

## Accessibility and responsive behavior

Use the least disruptive semantic that communicates the importance; reserve assertive announcements for urgent information. Associate alerts with affected fields or objects, keep actions keyboard reachable, and support zoom, reflow, high contrast, and reduced motion. Follow [ERROR_HANDLING.md](../ERROR_HANDLING.md), [STATE_SYSTEM.md](../STATE_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Report export failed. Your filters are preserved. Retry or change the date range.” Identify object, scope, completion, and next step; avoid blame and sensitive disclosure.

## Review evidence

Verify semantic severity, object association, announcement level, input preservation, retry/recovery, permissions, non-color cues, mobile reflow, localization, and screen-reader behavior.