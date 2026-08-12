---
title: EduTrack Accordion Handbook
purpose: Define progressive disclosure for secondary detail that users may inspect without leaving the current context.
scope: Optional explanations, supporting details, grouped settings, and low-priority record information.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
review_frequency: Quarterly and before disclosure, content, or accessibility changes
owner: Product Design, Design Systems, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Accordion, disclosure, expanded, collapsed, section, summary
---

# Accordion

## Purpose

Use an Accordion to reveal or hide secondary detail while keeping the primary task and surrounding context visible.

## Non-goals

Do not hide essential instructions, permission consequences, error recovery, primary navigation, or information users must compare at the same time. Do not use it to conceal material cost, privacy, or uncertainty.

## Anatomy and variants

Provide a group label when needed, a button-like summary for each section, an expanded or collapsed state, and an associated content region. Support single-expand and multi-expand behavior only when the choice is meaningful and clearly communicated.

## States and behavior

Support collapsed, expanded, focused, hover, loading, empty, error, disabled, and unauthorized content states. Expansion must not unexpectedly submit, mutate, or discard data. Preserve expanded state through safe validation or loading transitions when possible.

## Accessibility and responsive behavior

Use a native button for each disclosure trigger with an accessible name and expanded state, and associate it with the revealed region. Keep keyboard focus visible, ensure content remains available at zoom and dynamic type, and do not rely on animation. Follow [INTERACTION_DESIGN.md](../INTERACTION_DESIGN.md), [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), and [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md).

## Content and examples

Use summaries such as “Payment history,” “Grading rules,” “Notification preferences,” or “Why this result changed.” A summary should let users predict the content before expanding it.

## Review evidence

Verify trigger semantics, expanded-state announcement, keyboard operation, focus order, content persistence, reduced motion, long content, localization, mobile scrolling, unauthorized content, and error recovery.