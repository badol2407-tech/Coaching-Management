---
title: EduTrack Tabs Handbook
purpose: Define navigation among closely related views of the same object, workflow, or scope.
scope: Related views such as Fee collection, Due List, Payment History, Income Summary, and record subviews.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
review_frequency: Quarterly and before view, route, or accessibility changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Tabs, tablist, tab, tab panel, selected, related view
---

# Tabs

## Purpose

Use Tabs to switch among a small set of closely related views that share an object, task, or scope while keeping the user oriented.

## Non-goals

Do not use Tabs for unrelated destinations, permission boundaries, arbitrary page sections, filters that change a result set, or a substitute for primary navigation.

## Anatomy and variants

Provide a labeled tab list, tabs with stable names, one selected tab, and an associated tab panel or route. Support contained tabs for local content and route-backed tabs when browser history and deep linking matter.

## States and behavior

Support unselected, selected, focused, hover, disabled only when the reason is clear, loading, empty, error, and unauthorized panel states. Selecting a tab must preserve object identity and safe input. Route-backed tabs preserve browser back, refresh, and deep-link behavior.

## Accessibility and responsive behavior

Use native links for route-backed tabs; use correct tab semantics only for a true tab interface. Implement the appropriate keyboard model, selected state, panel relationship, visible focus, and responsive overflow without hiding the current view. Follow [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), and [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md).

## Content and examples

Use parallel labels such as “Collection,” “Due List,” “Payment History,” and “Income Summary.” Keep labels short but meaningful; expose counts only when they clarify scope or work.

## Review evidence

Verify same-object scope, keyboard navigation, browser history, deep links, selected state, panel announcement, long labels, narrow viewport behavior, unauthorized panels, loading/error recovery, and screen-reader output.