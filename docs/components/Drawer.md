---
title: EduTrack Drawer Handbook
purpose: Define focused side or bottom overlays that preserve page context while presenting related detail or a bounded task.
scope: Record detail, filters, supporting information, focused forms, and mobile bottom-sheet conversions.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../RESPONSIVE_SYSTEM.md
  - ../MOBILE_UX_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../ELEVATION_SYSTEM.md
review_frequency: Quarterly and before overlay, focus, responsive, or consequence changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Drawer, overlay, sheet, focus, dismiss, scope, consequence
---

# Drawer

## Purpose

Use a Drawer to present related detail or a focused task while preserving enough of the underlying page to maintain object, scope, and workflow context.

## Non-goals

Do not use it to hide essential navigation, replace a page for complex multi-step work, avoid a required confirmation, or create a second confusing page behind an overlay.

## Anatomy and variants

Provide a descriptive title, close or cancel control, focused content, clear primary action when needed, consequence summary for consequential work, and a visible relationship to the originating object or scope. Support side and bottom-sheet variants according to viewport and task.

## States and behavior

Support closed, opening, ready, loading, empty, partial, stale, error, unauthorized, pending, success, and closing states as applicable. Opening captures focus; Escape, close, cancel, and platform back provide safe exits; closing returns focus to the trigger. Do not dismiss after an error or unsaved change without an explicit recovery choice.

## Accessibility and responsive behavior

Use an appropriate dialog or complementary semantic based on whether the drawer interrupts the task, with a programmatic title, focus management, visible focus, and appropriate modality. Keep essential content within the viewport, support keyboard and touch, preserve safe-area padding, and convert to a bottom sheet or page when needed. Follow [INTERACTION_DESIGN.md](../INTERACTION_DESIGN.md), [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md), [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Title the object or task: “Student details,” “Attendance filters,” “Review fee reversal,” or “Report scope.” State what will happen, what is saved, and what remains on the underlying page.

## Review evidence

Verify title and scope, focus containment and return, Escape/cancel/back behavior, unsaved-change recovery, loading/error states, consequence review, viewport fit, mobile conversion, zoom, reduced motion, and screen-reader announcements.