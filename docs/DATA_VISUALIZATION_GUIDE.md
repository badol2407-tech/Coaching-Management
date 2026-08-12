---
title: EduTrack Data Visualization Guide
purpose: Define honest, accessible, contextual, and reviewable visualization behavior.
scope: Charts, tables, metrics, Analytics, Reports, uncertainty, interaction, accessibility, and exports.
audience: Product, Design, Data, Engineering, QA, Content, and reviewers.
related_documents:
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./COLOR_SYSTEM.md
  - ./REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after data, charting, or reporting changes
owner: Product Design, Data, Engineering, and Accessibility
version: 1.0.0
status: Binding data and design standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Analytics, Reports, Dashboard, scope, date range, freshness, uncertainty, data table, metric
---

# EduTrack Data Visualization Guide

Charts and analytics support decisions; they do not create certainty. Every visualization must make its question, data scope, limitations, and next action understandable.

## Visualization contract

Before choosing a chart, document:

- the question and intended decision;
- measure, unit, denominator, and aggregation;
- organization, Student, Teacher, batch, subject, and date scope;
- freshness and missing-data behavior;
- comparison baseline;
- accessible text or table alternative;
- action or interpretation that follows.

## Choose honest encodings

Use tables for exact values, bars for comparable categories, lines for time trends, and distributions only when the audience can interpret them. Do not use 3D, decorative perspective, truncated axes, or dual axes when they could exaggerate differences.

**Examples:** Attendance trends show dates and included sessions; Fee Analytics separates billed, collected, outstanding, and pending; Exam results expose subject and cohort scope; Teacher workload avoids ranking without context; Student progress avoids implying a causal coaching outcome.

## Context and uncertainty

Labels must state units, date range, source, and exclusions. Show “not enough data” when necessary. Do not convert missing data to zero without explanation. AI-generated Analytics must be labeled as generated, retain source context, and never present a prediction as a recorded fact.

## Interaction

Filters show applied scope and can be cleared. Tooltips cannot be the only place for critical information. Drill-downs preserve the selected organization, batch, Student, Teacher, Attendance, Fee, Exam, or Report context. Exports include the scope and generation timestamp.

## Accessibility

Provide a text summary and an accessible table or equivalent. Use color plus labels, patterns, or direct annotations. Maintain contrast, keyboard access, focus visibility, zoom, reduced motion, and screen-reader announcements for updated results.

## Visualization review measures

- A reviewer can restate the question, unit, scope, and freshness from the rendered view.
- Exact values are available without hover.
- Missing, partial, stale, and zero data are distinguishable.
- Every chart has a nonvisual equivalent.
- Exported Reports preserve scope, labels, units, and limitations.

See [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), and [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md).