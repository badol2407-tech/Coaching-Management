---
title: EduTrack Banner Handbook
purpose: Define persistent page- or scope-level information, warnings, and recovery guidance.
scope: Organization notices, stale data, service availability, policy communication, and workflow-level warnings.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Security, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FEEDBACK_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../ERROR_HANDLING.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before message, severity, or recovery changes
owner: Product, Product Design, Content, Engineering, and Security
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Banner, page notice, scope, warning, recovery, dismiss
---

# Banner

## Purpose

Use a Banner for persistent or page-level information that affects the current scope, task, service availability, or recovery path.

## Non-goals

Do not use it for every status message, transient success, decorative promotion, or a substitute for inline field errors or durable audit/activity history.

## Anatomy and variants

Provide a semantic status region, concise heading or message, affected scope, severity when useful, and an explicit action or dismissal behavior. Informational, warning, success, and error variants must communicate meaning beyond color.

## States and behavior

Support visible, loading, actionable, dismissed, resolved, stale, and error-recovery states. Dismissal must not erase required information; persist or repeat material notices according to importance. Actions state their consequence and preserve safe work.

## Accessibility and responsive behavior

Use an appropriate alert or status semantic without over-announcing routine content. Keep the banner readable at zoom and dynamic type, keyboard reachable, and free of horizontal overflow. Follow [FEEDBACK_SYSTEM.md](../FEEDBACK_SYSTEM.md), [ERROR_HANDLING.md](../ERROR_HANDLING.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Attendance data is stale. Refresh before marking attendance” or “Organization setup is incomplete. Add a batch.” Name scope and next action; do not use “Something went wrong.”

## Review evidence

Verify scope, severity, persistence, action and dismissal, live announcement, non-color cues, mobile reflow, zoom, permission/privacy disclosure, and error recovery.