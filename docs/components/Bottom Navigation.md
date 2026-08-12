---
title: EduTrack Bottom Navigation Handbook
purpose: Define reachable primary navigation for small-screen and one-handed workflows.
scope: Mobile primary destinations and persistent bottom navigation on compact viewports.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../MOBILE_UX_GUIDE.md
  - ../RESPONSIVE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before mobile route, role, or responsive changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Bottom Navigation, mobile, primary navigation, active route, back
---

# Bottom Navigation

## Purpose

Use Bottom Navigation to keep a small set of the most frequent primary destinations reachable on compact screens and in one-handed workflows.

## Non-goals

Do not use it as a complete sitemap, a replacement for role-aware destination management, a horizontal overflow of every module, or a gesture-only control.

## Anatomy and variants

Provide a navigation landmark, a bounded set of labeled destinations, active destination, and access to the remaining primary destinations through an explicitly labeled route or menu when needed. Icons supplement labels; they do not replace them.

## States and behavior

Support default, active, focus-visible, pressed, pending route, hidden-on-scroll where it does not impair orientation, and unauthorized destination states. Preserve browser or platform back behavior and safe work. A destination change must communicate the new location and scope.

## Accessibility and responsive behavior

Meet 44×44 CSS pixel targets and prefer 48×48 for frequent actions. Keep labels and active state available to screen readers, support keyboard or switch input, and respect safe areas and dynamic type. Do not hide essential actions behind swipe, hover, or precision movement. Follow [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md), [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Choose stable destinations such as “Dashboard,” “Students,” “Attendance,” “Reports,” and “Profile” according to Role. Use the canonical names and keep the set small enough to scan without truncation.

## Review evidence

Verify one-handed reach, active-route clarity, keyboard/switch input, safe-area padding, dynamic type, 320 CSS pixel layout, browser back, role visibility, route errors, and screen-reader announcements.