---
title: EduTrack Data Display Patterns
purpose: Define canonical patterns for presenting operational data accurately, comparably, and accessibly.
scope: Tables, lists, metrics, charts, status, detail views, freshness, uncertainty, empty data, and drill-down.
out_of_scope: Design-token definitions, component implementation, data models, query logic, business calculations, and API contracts.
owner: Product Design, Data Design, Frontend Engineering, Analytics, and QA
status: Canonical source of truth for data display patterns
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./DATA_VISUALIZATION_GUIDE.md
  - ./TABLE_DESIGN_GUIDE.md
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./STATE_SYSTEM.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
---

# EduTrack Data Display Patterns

This is the single source of truth for pattern selection and composition when displaying operational data. [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md) and [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) remain detailed evidence authorities.

## Purpose

Make data understandable, comparable, scoped, fresh, and actionable without misleading users or hiding uncertainty.

## Scope

This handbook owns display-pattern selection, information context, comparison, status, freshness, empty data, drill-down, and responsive transformation. It does not define calculations or token values.

## Principles

| Principle | Practical rule |
| --- | --- |
| Truth before decoration | Show the recorded value, unit, scope, period, denominator, and freshness needed to interpret it. |
| Context before comparison | Identify Organization, batch, subject, date range, role, and filter scope before comparison. |
| Right encoding | Select a table, metric, chart, list, or detail view based on the decision the user needs to make. |
| No hidden critical data | Critical values, status, and interpretation must not require hover, color, or motion. |
| Recoverable uncertainty | Distinguish loading, no records, no matches, stale data, partial data, failed data, and unauthorized data. |

## Best Practices

| Pattern | Use when | Required behavior |
| --- | --- | --- |
| Table | Users compare records, fields, values, or row actions. | Caption or title, scope, headers, units, row identity, status, actions, and continuation are clear. |
| List | Users scan records where full column comparison is unnecessary. | Identity, primary status, relevant metadata, scope, and next action remain visible. |
| Metric display | One value supports a decision. | Name, value, unit, period, comparison basis, denominator where relevant, freshness, and interpretation are present. |
| Chart | A trend, comparison, composition, or distribution improves understanding. | Title, scope, units, accessible text summary, exact-data alternative, and honest scale are present. |
| Detail display | One object needs inspection or action. | Identity, scope, status, key fields, related records, actions, and recovery are grouped. |
| Status display | Users need to know state or outcome. | Use text and semantic meaning; do not rely on color, icon, or position alone. |

## Enterprise SaaS Guidelines

- Never present Fee, Attendance, Exam, Report, or permission data without the scope needed to interpret it.
- Preserve exact values and units when a rounded summary could cause an operational error.
- Label AI-generated estimates, source scope, uncertainty, and review status; do not present estimates as recorded facts.
- Use drill-down to preserve filters, scope, date range, and interpretation context.
- Exported or shared data retains title, scope, period, units, freshness, and relevant status.
- Follow [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md) for metric priorities and role-aware dashboard content.

## Mobile-first & Responsive Rules

- Start with the smallest decision-support view and preserve the most important evidence.
- Transform tables, charts, metrics, and detail views through approved patterns; do not simply clip or shrink critical data.
- Provide a readable detail or full-data alternative when comparison cannot fit the viewport.
- Preserve scope, filters, units, status, freshness, and recovery at narrow widths and zoom.
- Use responsive values and visual treatment only from [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md).

## Accessibility (WCAG 2.2 AA)

- Tables expose headers and relationships; charts provide an accessible summary and data alternative.
- Status uses text or equivalent non-color meaning; critical values are available without hover.
- Updates from filters, dates, loading, errors, and freshness are communicated to assistive technology appropriately.
- Reading order, focus, labels, units, and scope remain coherent after responsive transformation.
- Apply the detailed acceptance rules in [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).

## AI Rules

- Never invent data, metrics, calculations, scope, freshness, status, chart types, or certainty.
- Reuse existing display patterns and [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).
- Never redesign product identity or replace enterprise data clarity with decorative visualization.
- Improve only hierarchy, grouping, comparison, placement, responsiveness, accessibility, and usability.
- Never define tokens, hardcode visual values, or include implementation code.

## Validation Checklist

- [ ] Display pattern matches the user decision and data relationship.
- [ ] Title, scope, period, units, denominator, freshness, status, and uncertainty are present where relevant.
- [ ] Loading, empty, no-match, stale, partial, error, and unauthorized states are distinguishable.
- [ ] Critical values and actions are not hover-only or color-only.
- [ ] Tables, charts, metrics, and details use their canonical guides and component standards.
- [ ] Mobile-first transformation preserves evidence, scope, status, and accessible alternatives.
- [ ] No tokens, hardcoded values, invented data, duplicate patterns, or implementation code were added.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Data Design, Frontend Engineering, Analytics, and QA |
| Status | Canonical source of truth for data display patterns |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md), [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Scope | Operational data display selection, context, states, and transformation |
| Out of Scope | Tokens, components, calculations, data models, query logic, and API contracts |