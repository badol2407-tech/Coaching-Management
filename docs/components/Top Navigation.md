---
title: EduTrack Top Navigation Handbook
purpose: Define top-level orientation, scope, and high-priority actions across the workspace.
scope: Header navigation, Workspace or Organization context, global Search, Notifications, Profile, and page-level orientation.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INFORMATION_ARCHITECTURE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
review_frequency: Quarterly and before route, scope, role, or header changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Top Navigation, header, Workspace, Organization, Search, Notifications, Profile
---

# Top Navigation

## Purpose

Use Top Navigation to orient users at the workspace level, expose current Organization or Workspace scope, and provide consistent access to global utilities and account destinations.

## Non-goals

Do not overload it with every module destination, replace page headings, hide permission context, or turn a notification badge into the only explanation of important information.

## Anatomy and variants

Provide a semantic header, product or Workspace identity, current scope, global Search where applicable, Notifications, Profile or account access, and only the highest-priority global actions. Variants may support a Sidebar or a small-screen navigation pattern but must retain the same destination meaning.

## States and behavior

Support default, scrolled or sticky, focus-visible, current scope, pending scope change, notification update, unauthorized action, and error-recovery states. Scope changes must be explicit and must not silently replace the user’s Organization or discard safe work. External destinations disclose their behavior.

## Accessibility and responsive behavior

Use semantic header and navigation landmarks, persistent labels, visible focus, 44×44 targets, and accessible status for Notifications and scope. On smaller screens, reflow or collapse without hiding recovery, Profile, Organization, or the current destination. Follow [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Show the current “Organization” or “Workspace” name and use actions such as “Open notifications” and “Open profile.” Avoid unexplained icons, ambiguous “More,” and scope changes hidden behind decorative controls.

## Review evidence

Verify scope clarity, keyboard order, landmark names, sticky behavior, notification announcement, role visibility, route preservation, mobile conversion, zoom, high contrast, and session-expiry recovery.