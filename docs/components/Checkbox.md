---
title: EduTrack Checkbox Handbook
purpose: Define independent boolean or multi-choice selection where each option can be selected separately.
scope: Forms, filters, consent, bulk selection, and independent settings.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../FILTER_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../PERMISSION_DESIGN.md
review_frequency: Quarterly and before selection, permission, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Checkbox, checked, unchecked, mixed, consent, selection
---

# Checkbox

## Purpose

Use a Checkbox for an independent yes/no choice, consent, or a set of options where more than one may be selected.

## Non-goals

Do not use it for mutually exclusive choices or an immediate setting whose effect is expected at the moment of change. Use [Radio](./Radio.md) or [Switch](./Switch.md).

## Anatomy and variants

Provide the checkbox, a persistent label, and supporting instruction or consequence text when needed. A group has a clear legend and may expose a mixed state for parent selection.

## States and behavior

Support unchecked, checked, mixed, focused, disabled, invalid, and pending states. The mixed state is a selection summary, not a third user choice. For bulk actions, show selected scope and count; for consent, do not preselect a consequential agreement.

## Accessibility and responsive behavior

Use a native checkbox where possible, keep the label clickable without shrinking the target, and expose checked/mixed state programmatically. Meet touch, keyboard, contrast, zoom, and error requirements in [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use affirmative labels such as “Include archived students,” “Send receipt,” or “I agree to the organization policy.” State consequences before the choice when material.

## Review evidence

Verify keyboard toggling, mixed-state behavior, group labeling, validation, bulk scope, no color-only state, mobile target size, localization, and screen-reader announcements.