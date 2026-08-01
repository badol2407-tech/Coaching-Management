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
  - ./components/
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

Compose [Search Field](./components/Search%20Field.md), [Autocomplete](./components/Autocomplete.md), [Select](./components/Select.md), and [Multi Select](./components/Multi%20Select.md) according to [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md).

## Field composition

Use for data-entry and edit workflows. Pair a persistent label, concise instruction, control, validation message, and recovery action. Use [Text Field](./components/Text%20Field.md), [Textarea](./components/Textarea.md), [Password Field](./components/Password%20Field.md), or [Select](./components/Select.md) based on the data type; preserve safe input when validation or network errors occur.

## Selection and preference

Use [Checkbox](./components/Checkbox.md) for independent choices, [Radio](./components/Radio.md) for mutually exclusive choices, and [Switch](./components/Switch.md) for a clearly understood setting that can change immediately. Use [Slider](./components/Slider.md) only when the value is inherently ordered and a precise alternative is available.

## Action and navigation

Use [Button](./components/Button.md) for in-place actions and [Link](./components/Link.md) for navigation or resource references. Use [Icon Button](./components/Icon%20Button.md) only when its accessible name and consequence are unambiguous.

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

Every pattern implementation must cite the relevant component specification, component handbook, and review checklist.