---
title: EduTrack Typography System
purpose: Define readable, scalable, localizable, and semantically meaningful type roles.
scope: Type roles, hierarchy, sizing, line length, zoom, fallback, localization, and domain examples.
audience: Product Design, Design Systems, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./COLOR_SYSTEM.md
  - ./COPYWRITING_GUIDELINES.md
review_frequency: Quarterly and after font, localization, or accessibility changes
owner: Product Design, Design Systems, and Content Design
version: 1.0.0
status: Binding design standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: type role, heading, body, label, caption, display, Dashboard, Students, Teachers, Reports, Analytics
---

# EduTrack Typography System

Typography must make operational information readable, scannable, and resilient to localization, zoom, dynamic type, and long names. Typography is a functional system, not decoration.

## Type roles

Use semantic roles rather than page-specific sizes:

- **Display:** rare product or organization context; never for critical data alone.
- **Page title:** names the Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, or Profile destination.
- **Section heading:** identifies a meaningful group.
- **Body:** explains records, instructions, policies, and AI context.
- **Label:** identifies an input, metric, status, unit, or scope.
- **Data value:** presents a number with its unit, period, and meaning.
- **Helper and error:** provides constraint, uncertainty, recovery, or limitation; never use low contrast to make it disappear.

## Rules

- Use a readable, widely supported font stack with tested fallback metrics.
- Establish a consistent scale and line-height; never choose type per component without a semantic reason.
- Do not communicate hierarchy through font size alone; combine heading structure, spacing, labels, and semantic markup.
- Avoid all caps for long content, narrow measure for dense Reports, and ambiguous abbreviations in Fees, Exams, or Analytics.
- Use tabular numerals when comparing Attendance, Fee, Exam, or Analytics values.
- Wrap or truncate only when the full value remains available and the truncation is understandable. Student and Teacher names, organization names, and Report titles must not be irreversibly clipped.
- Support 200% zoom and user text resizing without loss of task or action.

## Domain examples

Dashboard metrics show value, unit, period, and comparison in a readable relationship. Student and Teacher Profile headers keep identity distinct from secondary metadata. Attendance statuses, Fee balances, Exam results, Report scopes, Notification counts, Authentication errors, Organization permissions, Search results, Filters, and AI labels use persistent text, not color or icon alone.

## Measures

- Body text remains readable at supported zoom and dynamic type settings.
- Heading hierarchy is semantic and sequential.
- Long localized labels do not overlap or hide actions.
- Numeric comparisons align and include units.
- Error, privacy, permission, and AI uncertainty text meets accessibility contrast.

See [COLOR_SYSTEM.md](./COLOR_SYSTEM.md), [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).