---
title: EduTrack Dashboard Design Guide
purpose: Define how the Dashboard prioritizes operational work, exceptions, scope, freshness, and role-relevant action.
scope: Dashboard information hierarchy, role-aware views, metrics, states, loading, freshness, and interaction.
audience: Product, Design, Engineering, Data, QA, and reviewers.
related_documents:
  - ./INFORMATION_ARCHITECTURE.md
  - ./NAVIGATION_STANDARDS.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./DATA_VISUALIZATION_GUIDE.md
review_frequency: Quarterly and after Dashboard, Analytics, or metric changes
owner: Product, Product Design, Data, and Engineering
version: 1.0.0
status: Binding product and design standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Role, Organization
---

# EduTrack Dashboard Design Guide

The Dashboard is an operational starting point, not a gallery of metrics. It must help each authorized role understand what is happening, what requires attention, and what action is safe next.

## Dashboard contract

Every Dashboard view must state:

- user role and organization scope;
- data freshness and time period;
- primary operational question;
- actionable exceptions;
- clear next actions;
- accessible alternatives for visual summaries.

## Information priorities

Prioritize current operational risk and required work over vanity measures. A recommended order is current tasks, exceptions, status, meaningful trend, and supporting detail. Do not let a promotional panel outrank overdue Fees, Attendance exceptions, pending Exam work, failed Reports, or security-relevant Notifications.

## Role-aware views

- **Organization administrator:** Students, Teachers, Attendance health, Fee collection and defaulters, Exam activity, Reports, Analytics, Notifications, and Organization settings.
- **Teacher:** assigned Students and batches, today’s Attendance, Exams, homework or tasks, relevant Notifications, and quick access to Student Profiles.
- **Student:** own Attendance, Exams, Fees, Reports, Notifications, Profile, and AI assistance that is clearly optional and reviewable.
- **Super administrator:** Organization health, subscription or platform status, authorized aggregate Analytics, and operational attention signals without exposing unnecessary individual data.

Role visibility must be permission-aware, not merely visually hidden.

## Metric standards

Every metric has a name, value, unit, period, denominator where relevant, comparison basis, freshness, and action or interpretation. Attendance percentage must define included records; Fee totals must distinguish billed, collected, outstanding, and unresolved; Exam performance must not imply coaching success; Analytics must disclose incomplete or excluded data.

## States

Design loading, empty, stale, partial, unauthorized, and error states. A Dashboard with no Students is different from one whose Student query failed. A Fee chart with no payments is different from a chart that has not loaded. An AI Assistant suggestion with insufficient data must say so.

## Interactions

Cards, charts, attention signals, and lists must lead to a scoped destination. Clicking an Attendance exception must open the relevant records; a Fee defaulter count must preserve Filter scope; an Exam trend must preserve period and subject; a Notification must identify why it matters; an AI Assistant suggestion must show evidence or context.

## Dashboard measures

- A representative role identifies the primary operational issue within 5 seconds.
- Every high-salience item has an action or an explicit informational purpose.
- Scope and freshness remain visible at 200% zoom and on mobile.
- Charts have accessible text or tabular alternatives.
- Dashboard load does not block independent modules or hide saved state.

See [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md), [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md), and [UX_LAWS.md](./UX_LAWS.md).