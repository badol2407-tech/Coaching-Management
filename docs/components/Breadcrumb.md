---
title: EduTrack Breadcrumb Handbook
purpose: Define hierarchical location and safe return paths within nested records and workflows.
scope: Student, Teacher, Fee, Exam, Report, Organization, Profile, and other hierarchical detail routes.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../NAVIGATION_STANDARDS.md
  - ../INFORMATION_ARCHITECTURE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../MOBILE_UX_GUIDE.md
review_frequency: Quarterly and before hierarchy, route, or content changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Breadcrumb, location, hierarchy, current page, ancestor
---

# Breadcrumb

## Purpose

Use Breadcrumb to express a meaningful hierarchy and provide safe links back to ancestor locations when a page is nested within an object or workflow.

## Non-goals

Do not use it as the only page title, a substitute for primary navigation, a history trail of every click, or the sole orientation aid on mobile.

## Anatomy and variants

Provide a labeled navigation landmark, ordered ancestor links, and a current-page item that is not presented as a link. The hierarchy should reflect canonical information architecture, not arbitrary UI nesting. Long labels may truncate visually only if their accessible name remains complete.

## States and behavior

Support loading, ready, current location, unauthorized ancestor, not-found ancestor, and responsive-condensed states. Links preserve browser behavior and safe work. If a hierarchy changes, show the new scope rather than silently retaining stale ancestors.

## Accessibility and responsive behavior

Use `nav` with an accessible label and an ordered list. Expose the current page semantically, preserve keyboard focus, and provide a mobile heading or equivalent location indicator because breadcrumbs alone are insufficient on small screens. Follow [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use meaningful ancestors such as “Students / Class 8 / Aisha Khan” or “Reports / Attendance / Monthly report.” Avoid “Home / More / Details” when the objects and scope can be named.

## Review evidence

Verify hierarchy accuracy, current-page semantics, link destinations, permission handling, long names, mobile alternative, browser back, focus order, zoom, localization, and not-found recovery.