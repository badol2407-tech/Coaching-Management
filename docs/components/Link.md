---
title: EduTrack Link Handbook
purpose: Define navigation and resource-reference links that preserve user location and browser behavior.
scope: Internal routes, external resources, related records, and inline references.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../COPYWRITING_GUIDELINES.md
review_frequency: Quarterly and before route, content, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Link, navigation, route, external link, visited, current
---

# Link

## Purpose

Use a Link to navigate to another location, open a related record, or reference a resource. The destination must be predictable from its text and context.

## Non-goals

Do not use a Link to mutate data, submit a form, or trigger an in-place action. Use [Button](./Button.md) for those operations.

## Anatomy and variants

Provide meaningful link text, a destination, visible focus, and current-location indication where relevant. Inline, standalone, navigation, and external-link presentations may vary visually while retaining link semantics.

## States and behavior

Support default, hover, focus-visible, visited where useful, current, unavailable, and error-recovery states. Preserve browser open-in-new-tab and copy-link behavior. External or new-window destinations must be identified in text or the accessible name.

## Accessibility and responsive behavior

Use a native anchor for navigation. Do not rely on color alone; maintain a non-color distinction from surrounding text. Preserve keyboard focus, zoom, wrapping, and touch separation per [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md).

## Content and examples

Prefer “View student record,” “Open attendance report,” “Read accessibility standards,” and “Download receipt.” Avoid “here,” duplicated ambiguous “More” links, and raw URLs unless the URL itself is the content.

## Review evidence

Verify destination, browser behavior, current route, external disclosure, keyboard focus, long-text wrapping, mobile tap separation, permissions, and a recoverable not-found or unauthorized state.