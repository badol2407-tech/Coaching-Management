---
title: EduTrack Toast Handbook
purpose: Define brief point-of-action feedback for non-critical outcomes that do not require interruption.
scope: Save confirmation, copy success, background completion, and recoverable local feedback.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FEEDBACK_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before feedback, persistence, or notification changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Toast, feedback, success, warning, dismiss, retry
---

# Toast

## Purpose

Use a Toast for brief, non-critical point-of-action feedback when the user can continue safely without an interruption.

## Non-goals

Do not use it as the only record of a Fee, Exam, Permission, privacy, security, or other consequential result. Do not use it for required instructions, persistent scope, or an error the user must act on.

## Anatomy and variants

Provide a concise semantic message, status type, optional safe action such as Retry or Undo, and a dismiss control when appropriate. Success, neutral, warning, and recoverable-error variants must not rely on color alone.

## States and behavior

Support entering, visible, action-pending, action-success, action-error, and dismissed states. Set duration according to reading and consequence; pause for interaction; avoid stacking noise; and preserve important outcomes in durable page or activity feedback.

## Accessibility and responsive behavior

Use a live region with an appropriate politeness level, keep focus from moving unexpectedly for non-critical feedback, and ensure actions are keyboard and touch accessible. Respect reduced motion, zoom, safe areas, and mobile reach. Follow [FEEDBACK_SYSTEM.md](../FEEDBACK_SYSTEM.md), [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Profile saved,” “Report copied,” or “Could not load attendance. Retry.” Name the object and next action when needed; do not claim durable success from a request that is still pending.

## Review evidence

Verify message semantics, live announcement, duration, pause/dismiss, retry behavior, non-color cues, duplicate suppression, mobile placement, screen-reader interruption, and durable handling of consequential outcomes.