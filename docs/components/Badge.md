---
title: EduTrack Badge Handbook
purpose: Define compact counts or short status labels that supplement nearby content.
scope: Actionable notification counts, concise status indicators, and compact metadata.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../COLOR_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before status, count, color, or notification changes
owner: Product Design, Design Systems, Content, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Badge, count, status, unread, actionable, semantic color
---

# Badge

## Purpose

Use a Badge for a concise count or short status label that supplements a nearby destination, record, or action.

## Non-goals

Do not use it as decoration, the only explanation of an exception, a substitute for durable notification history, or a color-only permission or status signal.

## Anatomy and variants

Provide a meaningful text value or count, clear association with its subject, and semantic treatment that supports non-color interpretation. Support actionable notification count, status, and compact metadata variants.

## States and behavior

Support hidden, zero or omitted count according to product meaning, visible, updated, stale, loading, unauthorized, and resolved states. Counts must have a defined scope and freshness; status changes must reflect the source state rather than visual emphasis.

## Accessibility and responsive behavior

Expose the count or status in the accessible name or adjacent text, avoid redundant announcements, and retain meaning at zoom, dynamic type, high contrast, and mobile widths. Follow [COLOR_SYSTEM.md](../COLOR_SYSTEM.md), [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “3 unread notifications,” “Overdue,” or “Draft.” Do not show a bare “3” without naming what is counted and within which scope.

## Review evidence

Verify subject association, count scope, freshness, non-color cue, screen-reader output, long labels, overflow, mobile layout, permission behavior, and whether the information needs a Banner or Alert instead.