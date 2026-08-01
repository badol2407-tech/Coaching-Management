---
title: EduTrack Card Handbook
purpose: Define meaningful grouping of related content, status, and actions within a page composition.
scope: Dashboard summaries, Student and Teacher summaries, record previews, metrics, and grouped supporting content.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../DESIGN_SYSTEM_GUIDE.md
  - ../LAYOUT_GRID.md
  - ../ELEVATION_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before grouping, surface, token, or responsive changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Card, surface, group, identity, status, action, scope
---

# Card

## Purpose

Use a Card to group content that shares a meaningful identity, scope, status, or action and benefits from being understood as one unit.

## Non-goals

Do not use Cards as decorative containers, a substitute for information architecture, a way to make every item clickable, or a means to hide important context behind a visual surface. Use [List](./List.md) or a table when the relationship is primarily sequential or two-dimensional.

## Anatomy and variants

Provide a meaningful heading or accessible name, content with a coherent scope, status where relevant, and actions that are clearly associated with the card. Variants may support summary, metric, record preview, or interactive cards, but the semantic structure must match the content.

## States and behavior

Support ready, loading, empty, partial, stale, error, unauthorized, focused, and selected states as applicable. Card actions must identify their object and consequence. A card must not imply success, freshness, or permission from elevation or color alone.

## Accessibility and responsive behavior

Use semantic headings, lists, links, and buttons rather than making a container a large ambiguous interactive target. Preserve reading order, focus visibility, contrast, zoom, and responsive reflow. Follow [DESIGN_SYSTEM_GUIDE.md](../DESIGN_SYSTEM_GUIDE.md), [ELEVATION_SYSTEM.md](../ELEVATION_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use a specific identity and scope such as “Attendance this week,” “Aisha Khan,” “Fee balance,” or “Report freshness.” Show unit, period, owner, and next action when they are necessary to interpret the content.

## Review evidence

Verify meaningful grouping, heading structure, action association, non-color status, loading/empty/error states, long content, narrow viewport layout, zoom, screen-reader order, and whether a list or table is more appropriate.