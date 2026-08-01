---
title: EduTrack Slider Handbook
purpose: Define ordered numeric or continuous adjustment with an accessible precise-value alternative.
scope: Meaningful ranges such as thresholds, volume-like preferences, or bounded scoring controls.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../DESIGN_TOKENS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../MOBILE_UX_GUIDE.md
review_frequency: Quarterly and before range, input, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Slider, range, minimum, maximum, step, value
---

# Slider

## Purpose

Use a Slider only when a value has an ordered range and adjustment by relative movement is useful. The exact value must remain available without precision pointer input.

## Non-goals

Do not use it for arbitrary text, mutually exclusive choices, or values where exact entry is primary. Pair it with a [Text Field](./Text%20Field.md) or use a field/select when precision matters.

## Anatomy and variants

Provide a persistent label, current value and unit, minimum, maximum, step, and a clear alternative input. Multiple thumbs require distinct labels and a defined relationship.

## States and behavior

Support minimum, maximum, intermediate, focused, disabled, pending, invalid, and error-recovery states. Arrow keys adjust by step; Home/End reach bounds. Do not commit consequential changes silently, and never hide the exact value in a tooltip.

## Accessibility and responsive behavior

Expose value, range, and unit programmatically. Provide a keyboard-complete and touch-usable control, sufficient contrast, and a non-drag alternative. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Label the decision and unit: “Attendance threshold, percent” or “Report refresh interval, minutes.” Show the current exact value and explain bounds when they affect the task.

## Review evidence

Verify keyboard step/bounds, exact-value entry, min/max and invalid values, touch behavior, screen-reader value changes, mobile conversion, localization of units, and pending/error recovery.