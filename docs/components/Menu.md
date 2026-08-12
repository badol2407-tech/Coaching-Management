---
title: EduTrack Menu Handbook
purpose: Define bounded collections of related actions or destinations opened from a clear context.
scope: Contextual actions, navigation groups, account actions, and bounded command collections.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../PERMISSION_DESIGN.md
review_frequency: Quarterly and before action, permission, or keyboard behavior changes
owner: Product, Product Design, Design Systems, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Menu, menuitem, context, action, destination, permission
---

# Menu

## Purpose

Use a Menu for a bounded set of related actions or destinations that share a visible trigger and current context.

## Non-goals

Do not use a Menu as a hidden information architecture, a replacement for primary navigation, a place to bury consequential details, or a long unscannable list. Use [Command Palette](./Command%20Palette.md) for broad keyboard-first search and commands.

## Anatomy and variants

Provide a labeled trigger, menu surface, grouped or separated items when meaningful, and menu items with clear names. Actions and navigation items must be distinguishable in behavior. Submenus require a justified hierarchy and an accessible route back.

## States and behavior

Support closed, open, focused, highlighted item, disabled with a clear reason, loading, unauthorized, and error-recovery states. Opening moves focus predictably; Escape closes and returns focus to the trigger. Consequential actions close only when the result and recovery path are clear, and never bypass required confirmation.

## Accessibility and responsive behavior

Use native links and buttons where possible. If menu semantics are required, implement the correct menu, menuitem, expanded, active, and relationship states with complete keyboard operation. Keep the surface within the viewport, support platform back/close, and preserve focus. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md).

## Content and examples

Use contextual labels such as “Student actions,” “Report actions,” or “Account options.” Prefer “Edit student,” “Export report,” and “Sign out” over vague “Manage” or “More.”

## Review evidence

Verify trigger name, focus entry and return, arrow-key behavior, Escape and outside-close, permission filtering, destructive confirmation, viewport fit, mobile conversion, long labels, and screen-reader announcements.