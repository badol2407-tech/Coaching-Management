---
title: EduTrack Command Palette Handbook
purpose: Define scoped keyboard-first search for destinations, records, and safe commands.
scope: Global or module-scoped navigation, record lookup, and non-consequential commands.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../SEARCH_EXPERIENCE.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../PERMISSION_DESIGN.md
review_frequency: Quarterly and before command, search, role, or accessibility changes
owner: Product, Product Design, Engineering, Security, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Command Palette, command, query, scope, result, shortcut, Permission
---

# Command Palette

## Purpose

Use a Command Palette to help experienced users find authorized destinations, records, or safe commands through a named, keyboard-first search surface.

## Non-goals

Do not use it as the only way to reach essential work, a hidden permission bypass, a replacement for visible navigation, or a shortcut for consequential actions that require review and scope confirmation.

## Anatomy and variants

Provide a clear invocation control or shortcut, named input, stated scope, result groups, keyboard hints only when accurate, and a dismissal path. Results must distinguish destinations, records, and commands; contextual palettes may inherit a visible object or module scope.

## States and behavior

Support closed, open, empty query, querying, results, no results, loading, stale, unauthorized, error, and executing states. Preserve the query and context through recoverable failures. Results are permission-filtered, and executing a command reports what happened without claiming success before durable acceptance.

## Accessibility and responsive behavior

Use a labeled search input and a correctly associated result list with active-result semantics. Support keyboard navigation, Escape, screen-reader status for result counts and loading, touch selection, zoom, and reduced motion. Ensure the surface fits smaller screens and does not make browser or platform back unpredictable. Follow [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use results such as “Go to Students,” “Open attendance report,” or “Find student by name or ID.” State the current scope and avoid exposing protected records, unsupported commands, or unexplained shortcut notation.

## Review evidence

Verify invocation discoverability, scope disclosure, permission filtering, keyboard complete operation, result status, no-result recovery, stale-result handling, command confirmation, mobile alternative, zoom, and screen-reader announcements.