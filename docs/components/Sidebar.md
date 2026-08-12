---
title: EduTrack Sidebar Handbook
purpose: Define stable primary navigation for role-aware desktop and wide-screen workspaces.
scope: Persistent or collapsible primary navigation for Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, and Settings.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INFORMATION_ARCHITECTURE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../RESPONSIVE_SYSTEM.md
  - ../MOBILE_UX_GUIDE.md
review_frequency: Quarterly and before route, role, permission, or responsive navigation changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Sidebar, primary navigation, active route, Role, Permission, Workspace, Organization
---

# Sidebar

## Purpose

Use a Sidebar to provide stable, role-aware primary destinations in a desktop or wide-screen workspace where users move among modules.

## Non-goals

Do not use it as a substitute for page hierarchy, object context, permission enforcement, or a mobile-only navigation pattern. Do not expose irrelevant disabled destinations merely to advertise inaccessible features.

## Anatomy and variants

Provide a navigation landmark, product or Workspace identity, labeled destination groups where grouping helps, active destination, and a clear collapse or expand control when supported. A compact variant must preserve accessible names and active context. Role and Organization scope must remain understandable.

## States and behavior

Support expanded, collapsed, active, hover, focus-visible, pending route, unauthorized destination, and responsive-collapsed states. Route changes preserve browser history and safe work. If a destination is valid but unauthorized, show a clear permission outcome without revealing protected data.

## Accessibility and responsive behavior

Use semantic `nav`, links, headings or group labels, and `aria-current` for the active destination. Keyboard users must reach every destination; focus must remain visible and unobscured. Collapse to an appropriate small-screen pattern without hiding primary actions or relying on hover or gestures. Follow [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Use canonical destination names such as “Students,” “Attendance,” “Fees,” “Reports,” “Organization,” and “Profile.” Keep labels stable across Roles; prioritize them by Role without changing their meaning.

## Review evidence

Verify role and permission visibility, active-route persistence, keyboard traversal, collapse/expand, browser back, route errors, unsaved-form preservation, zoom, 320 CSS pixel conversion, screen-reader landmarks, and touch/keyboard alternatives.