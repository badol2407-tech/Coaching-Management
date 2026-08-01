---
title: EduTrack Color System
purpose: Define semantic color roles that communicate hierarchy, state, and risk without relying on color alone.
scope: Tokens, status communication, contrast, surfaces, charts, notifications, and visual emphasis.
audience: Product Design, Engineering, Content, QA, and reviewers.
related_documents:
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./DATA_VISUALIZATION_GUIDE.md
review_frequency: Quarterly and when brand, contrast, or status semantics change
owner: Product Design and Design Systems
version: 1.0.0
status: Binding design standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: semantic token, status, warning, error, success, Attendance, Fees, Exams, Notifications
---

# EduTrack Color System

Color communicates meaning, hierarchy, and state. It must never be used to create false urgency or become the only way to understand Attendance, Fees, Exams, Reports, Notifications, permissions, or AI output.

## Semantic roles

Define tokens by meaning, not by hue:

- **Canvas and surface:** background and grouped content.
- **Content:** primary, secondary, muted, inverse.
- **Action:** primary, secondary, link, focus.
- **Status:** success, informative, neutral, warning, danger, pending.
- **Selection:** selected, hover, pressed, disabled.
- **Data series:** distinguishable, ordered, and accessible in charts.

Components consume semantic tokens. Product code must not scatter raw color values for one-off states.

## Rules

- Meet WCAG 2.2 AA contrast for text and meaningful controls; use stronger contrast for critical status where practical.
- Pair every status color with text, iconography, pattern, shape, or programmatic label.
- Reserve danger and high-salience treatments for real risk or destructive action. Do not use red for ordinary overdue data without defining its consequence.
- Do not use color to imply that an AI suggestion is a verified record.
- Ensure selected, focused, hovered, disabled, and error states remain distinct in grayscale and high contrast.
- Theme changes must preserve meaning, contrast, focus, and chart interpretation.

## EduTrack examples

Attendance Present, Absent, Late, and Excused states use labels and semantic tokens. Fees distinguish paid, partial, pending, overdue, and reversed without a rainbow. Exam warnings explain publish or grading consequences. Reports and Analytics show data series with labels or direct annotations. Notifications use badges only for actionable counts. Organization and Profile permission changes use clear text. Authentication errors are not conveyed through color alone. Search and Filters show active state textually.

## Measures

- Contrast checks cover text, controls, focus, charts, disabled states, and dark/high-contrast themes.
- Every semantic token has a non-color fallback.
- Color-blind and grayscale review identifies all critical states.
- Token changes include affected components and screenshot or automated evidence.

See [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md), [GESTALT_PRINCIPLES.md](./GESTALT_PRINCIPLES.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).