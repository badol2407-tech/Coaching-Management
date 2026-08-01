---
title: EduTrack Dialog Handbook
purpose: Define intentional modal interruption for review, confirmation, focused input, and consequential decisions.
scope: Fee reversal, Exam publication, Organization permission changes, Authentication actions, Report export review, and AI apply decisions.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
  - ../ELEVATION_SYSTEM.md
review_frequency: Quarterly and before modal, consequence, focus, or accessibility changes
owner: Product, Product Design, Engineering, Security, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dialog, modal, title, consequence, confirmation, focus, cancel
---

# Dialog

## Purpose

Use a Dialog when the user must attend to a focused decision, review, confirmation, or input before safely continuing the current workflow.

## Non-goals

Do not use a Dialog for information that belongs in the page flow, routine navigation, hidden authorization, or a complex multi-step task that needs durable page context.

## Anatomy and variants

Provide a descriptive title, concise context, content, clear primary action, safe cancel or close path, and consequence summary when relevant. Support confirmation, form, alert, and review variants without changing focus or recovery expectations.

## States and behavior

Support closed, opening, ready, loading, pending, success, partial, error, unauthorized, and unsaved-change states as applicable. Prevent duplicate submission, preserve safe input, and do not close after a recoverable error without user control. Consequential actions name object, scope, effect, actor, and recovery.

## Accessibility and responsive behavior

Use dialog semantics only for an intentional modal interruption. Move focus into the Dialog, contain it appropriately, support Escape and cancel, and return focus to the trigger on close. Fit 320 CSS pixels and support zoom, dynamic type, reduced motion, keyboard, touch, and platform back. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md), and [ELEVATION_SYSTEM.md](../ELEVATION_SYSTEM.md).

## Content and examples

Use titles such as “Review fee reversal,” “Publish exam results,” or “Change organization permission.” State what will happen and what remains unchanged; never use “Are you sure?” alone.

## Review evidence

Verify focus containment and restoration, keyboard cancellation, consequence disclosure, duplicate prevention, input preservation, error recovery, viewport fit, permission behavior, screen-reader announcement, and reduced motion.