---
title: EduTrack Popover Handbook
purpose: Define contextual supporting content or lightweight interaction anchored to a visible control.
scope: Supporting explanations, compact filters, related metadata, and contextual detail that benefits from page context.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
  - ../ELEVATION_SYSTEM.md
review_frequency: Quarterly and before anchored-surface, focus, or responsive changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Popover, anchored surface, trigger, context, dismiss
---

# Popover

## Purpose

Use a Popover for contextual supporting content or a lightweight interaction that should remain associated with its visible trigger.

## Non-goals

Do not use it for essential content, primary navigation, long workflows, or material consequences that require a Dialog or page-level review. Do not make hover the only invocation.

## Anatomy and variants

Provide a named trigger, anchored surface, meaningful content, and clear dismissal behavior. Informational, form, and contextual-action variants must use semantics appropriate to their content and preserve the originating object and scope.

## States and behavior

Support closed, open, focused, loading, ready, empty, error, unauthorized, and pending states as applicable. Opening and closing preserve trigger context; Escape, outside dismissal, and platform back are predictable. A Popover must not silently mutate data.

## Accessibility and responsive behavior

Use a keyboard and touch-accessible trigger, expose the relationship to the surface, keep focus predictable, and avoid clipping or viewport overflow. Provide an alternate path for essential content and honor reduced motion. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md), and [ELEVATION_SYSTEM.md](../ELEVATION_SYSTEM.md).

## Content and examples

Use “View attendance details,” “Filter scope,” or “Why is this report stale?” The trigger and content should name the object, value, or question being explained.

## Review evidence

Verify keyboard/touch invocation, focus entry and return, Escape/outside/back dismissal, viewport collision, trigger relationship, long content, zoom, mobile conversion, unauthorized content, and screen-reader output.