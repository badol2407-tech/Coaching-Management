---
title: EduTrack Dropdown Handbook
purpose: Define contextual disclosure of a bounded action set, value set, or supporting information.
scope: Action overflow, contextual controls, compact value selection, and anchored supporting content.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
  - ../ELEVATION_SYSTEM.md
review_frequency: Quarterly and before overlay, action, or accessibility changes
owner: Product Design, Design Systems, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dropdown, trigger, anchored surface, open, dismiss, context
---

# Dropdown

## Purpose

Use a Dropdown for a compact, anchored surface that discloses contextual actions, bounded values, or supporting information without losing the originating context.

## Non-goals

Do not use it for essential content, long-form workflows, primary navigation, or a consequence that requires a full review surface. Choose a native [Select](./Select.md) for straightforward single-value selection.

## Anatomy and variants

Provide a named trigger, anchored surface, content appropriate to the trigger, and a clear dismissal path. The surface may contain actions, links, or a small selection control, but its semantics must match the content rather than the visual treatment.

## States and behavior

Support closed, open, focused, highlighted, selected, loading, disabled, unauthorized, and error-recovery states. Preserve the trigger’s context, keep the active value visible, and close only after a clear selection or dismissal. Consequential actions require the owning confirmation pattern.

## Accessibility and responsive behavior

Expose expanded and controlled relationships where applicable, use correct semantics for the contents, and preserve focus on open, dismissal, and selection. Fit the viewport, avoid obscuring essential content, support Escape and platform back, and respect reduced motion. Follow [ELEVATION_SYSTEM.md](../ELEVATION_SYSTEM.md), [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), and [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md).

## Content and examples

Use “Sort by,” “Student actions,” “Report options,” or a named current value. Do not make a bare chevron or unlabeled icon carry the entire meaning.

## Review evidence

Verify trigger and content semantics, anchoring, focus return, keyboard and touch operation, viewport collision, outside/Escape close, permissions, destructive recovery, zoom, and screen-reader state.