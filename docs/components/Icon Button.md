---
title: EduTrack Icon Button Handbook
purpose: Define compact icon-only actions with an accessible name and predictable consequence.
scope: Toolbar, table-row, navigation, and contextual icon actions.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ICONOGRAPHY.md
  - ../DESIGN_SYSTEM_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
review_frequency: Quarterly and before icon, action, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Icon Button, icon, tooltip, accessible name, destructive
---

# Icon Button

## Purpose

Use an Icon Button when a familiar icon can represent a frequent, compact action without competing with surrounding content.

## Non-goals

Do not use it for a primary action, an unfamiliar concept, or any action whose consequence is not clear from its accessible name and context. Use a labeled [Button](./Button.md) when recognition is uncertain.

## Anatomy and variants

Provide one meaningful icon, an accessible name, a visible focus ring, and an optional tooltip that supplements rather than replaces the name. Support quiet, standard, and destructive treatments without changing the action contract.

## States and behavior

Support default, hover, focus-visible, pressed, pending, disabled, and error states. Pending must prevent duplicate activation. Destructive actions retain a text confirmation path. If the icon opens a menu or panel, expose expanded state and the controlled relationship.

## Accessibility and responsive behavior

Use a native button and a programmatic accessible name. Meet 44×44 CSS pixel touch targets, keyboard operation, contrast, and reduced-motion requirements in [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md). Never make a tooltip the only way to understand the action.

## Content and examples

Names should state the result: “Delete fee,” “Edit student,” “Clear search,” “Open notifications,” or “Copy report link.” The icon must follow [ICONOGRAPHY.md](../ICONOGRAPHY.md).

## Review evidence

Verify name, tooltip timing, keyboard and touch target, focus visibility, state announcement, narrow viewport behavior, destructive recovery, and whether a labeled Button is more appropriate.