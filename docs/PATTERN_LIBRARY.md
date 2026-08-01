---
title: EduTrack Pattern Library
purpose: Define reusable, evidence-based workflow patterns for common product tasks.
scope: Dashboard exceptions, Search and list, detail, bulk actions, confirmation, drafts, empty states, AI Assistant, and mobile.
audience: Product, Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./INTERACTION_DESIGN.md
  - ./ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and after pattern, component, or workflow changes
owner: Product Design and Design Systems
version: 1.0.0
status: Binding reusable-pattern standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: pattern, Dashboard, Search, Filters, bulk action, confirmation, draft, empty state, AI Assistant, mobile
---

# EduTrack Pattern Library

Patterns are reusable solutions to recurring user problems. Use an existing pattern before inventing a new one; document an exception when the domain genuinely differs.

## Dashboard exception review

Use when operational work needs attention. Show scope, count, reason, owner, next action, freshness, and a route to the underlying records. Attendance exceptions, Fee defaulters, failed Reports, Exam warnings, and security Notifications must not be reduced to a decorative badge.

## Search and filtered list

Use when users need to locate Students, Teachers, Attendance, Fees, Exams, Reports, Notifications, or future records. Provide a labeled Search field, relevant Filters, result status, clear/reset, empty/no-result distinction, and preserved scope.

## Record detail

Use for Student, Teacher, Fee, Exam, Report, Profile, or organization records. Lead with identity and status, then relevant history and actions. Respect role permissions and do not mix unrelated data merely because it exists.

## Bulk operation

Use for Attendance marking, Fee assignment, Notifications, Student or Teacher updates, Exam actions, or Report exports. Show selected count, filter scope, permission, consequence, preview, progress, partial result, and recovery.

## Consequential confirmation

Use before Fee reversal, Exam publication, Report export, permission change, Authentication revocation, Profile privacy change, or AI application. Repeat object, scope, effect, actor, and recovery.

## Draft and interrupted work

Use for Student and Teacher forms, Attendance sessions, Report builders, Exam setup, Profile changes, and AI drafts. Label drafts, preserve safe work, expose owner and status, and provide Save, Discard, Stay, or Resume.

## Empty and first-use

Use different messages for no records, no Permission, no matching Search results, data still loading, and failed loading. Provide one safe next action. Do not hide setup requirements in Dashboard or Organization.

## Reviewable AI assistance

Show AI disclosure, source scope, generated state, uncertainty, human review, edit, reject, retry, and report paths. AI may assist with Student summaries, Attendance patterns, Exam analysis, Reports, Notifications, or Analytics, but cannot silently mutate records or permissions.

## Mobile conversion

Transform—not merely shrink—tables, sidebars, filters, dialogs, charts, and forms. Preserve identity, scope, primary action, status, and recovery. See [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md).

Every pattern implementation must cite the relevant component specifications and review checklist.