---
title: EduTrack Tooltip Handbook
purpose: Define brief supplemental descriptions for controls or truncated content without replacing accessible names.
scope: Unfamiliar controls, icon buttons, concise explanations, and non-essential truncated labels.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ICONOGRAPHY.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../MOTION_GUIDELINES.md
review_frequency: Quarterly and before tooltip, icon, timing, or accessibility changes
owner: Product Design, Design Systems, Content, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Tooltip, supplemental description, accessible name, trigger, hover
---

# Tooltip

## Purpose

Use a Tooltip to provide a short supplemental explanation when a control or visible label may need clarification.

## Non-goals

Do not use it as the only accessible name, the only way to discover an action, a container for interactive content, or a replacement for visible instructions or error messages.

## Anatomy and variants

Provide a trigger with its own accessible name, concise supplemental text, and a positioned description. Support hover, focus, and touch-compatible invocation where useful; the Tooltip itself is not an interactive menu or form.

## States and behavior

Support hidden, showing, visible, delayed, and dismissed states. Show on keyboard focus as well as pointer hover, avoid flicker, and dismiss predictably. Do not obscure essential content or announce repetitive information excessively.

## Accessibility and responsive behavior

Never require hover or pointer precision. Associate the supplemental description programmatically when appropriate, keep it readable at zoom, and provide an alternate visible or semantic path for essential information. Respect reduced motion and touch exploration. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [ICONOGRAPHY.md](../ICONOGRAPHY.md), and [MOTION_GUIDELINES.md](../MOTION_GUIDELINES.md).

## Content and examples

Use “Clear search,” “Edit student,” or “Attendance recorded yesterday” as concise supplements. Do not repeat a visible label without adding useful context.

## Review evidence

Verify accessible name independence, keyboard focus behavior, timing, touch behavior, screen-reader output, long text, zoom, reduced motion, viewport collision, and whether the content belongs inline instead.