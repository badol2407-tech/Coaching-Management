---
title: EduTrack Progress Handbook
purpose: Define measurable completion feedback for work with known scope, stages, or total.
scope: Attendance imports, Report exports, uploads, batch actions, and other measurable operations.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../LOADING_STATES.md
  - ../FEEDBACK_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before progress, operation, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Progress, completion, scope, percent, stage, pending
---

# Progress

## Purpose

Use Progress when the system can describe measurable completion, scope, stages, or remaining work.

## Non-goals

Do not use it to imply precision the system cannot support, to decorate a static metric, or to replace a meaningful status message when work is indeterminate.

## Anatomy and variants

Provide an accessible label, current value or stage, maximum or total when known, unit, affected object or scope, and optional remaining-time estimate only when trustworthy. Support determinate, staged, and segmented variants.

## States and behavior

Support initial, pending, active, paused, partial, complete, canceled, stale, and error states. Progress must not jump to success before durable acceptance, and a failed or interrupted operation explains what completed and what can be retried safely.

## Accessibility and responsive behavior

Expose value, range, unit, and status programmatically; do not rely on motion or color. Keep updates appropriately paced, readable at zoom, compatible with reduced motion, and visible on mobile without horizontal overflow. Follow [LOADING_STATES.md](../LOADING_STATES.md), [STATE_SYSTEM.md](../STATE_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Uploading attendance file — 60% complete” or “Exporting monthly report — 2 of 4 steps complete.” Name scope and avoid unsupported countdown claims.

## Review evidence

Verify value accuracy, scope, stage transitions, pause/cancel/retry, partial completion, error recovery, screen-reader updates, reduced motion, mobile layout, zoom, and localization of units.