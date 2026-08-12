---
title: EduTrack Page Templates
purpose: Define the canonical structural templates for recurring enterprise SaaS page types.
scope: Page archetypes, required regions, content priority, workflow placement, states, and responsive transformation.
out_of_scope: Design-token definitions, component behavior, route definitions, business logic, data contracts, and page-specific content.
owner: Product Design, Product Management, and Frontend Engineering
status: Canonical source of truth for page templates
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./LAYOUT_PATTERNS.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./FORM_DESIGN_GUIDE.md
  - ./TABLE_DESIGN_GUIDE.md
  - ./DATA_VISUALIZATION_GUIDE.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
---

# EduTrack Page Templates

This is the single source of truth for recurring page structures. Templates define regions and decision order, not tokens, components, or route-specific business behavior.

## Purpose

Prevent every module from inventing a new page structure while allowing domain content to remain specific and accurate.

## Scope

This handbook owns page archetypes, required regions, optional regions, state placement, content priority, and template-level responsive rules. Use [LAYOUT_PATTERNS.md](./LAYOUT_PATTERNS.md) for reusable composition rules.

## Principles

| Principle | Practical rule |
| --- | --- |
| Template before invention | Select the closest approved template before proposing a new page structure. |
| One job per page | A page may support related tasks, but its primary job must remain clear. |
| Scope before interpretation | Show Organization, role, filters, period, and data scope before users interpret results. |
| State continuity | Loading, empty, error, stale, unauthorized, and partial states occupy the same meaningful content region. |
| Evidence with action | Place the next safe action beside the information needed to make the decision. |

## Best Practices

| Template | Required structure | Typical use |
| --- | --- | --- |
| Dashboard | Page context, role-aware summary, priority signals, metrics or charts, exceptions, and next actions. | Organization, attendance, fees, reports, and operational overview. |
| List or table | Page context, scope, search or filters, result state, record region, row actions, and pagination or continuation. | Students, Teachers, Fees, Attendance, Notifications, and records. |
| Detail | Breadcrumb or location, identity, scope, summary, status, primary actions, related data, and recovery. | Student, Teacher, Fee, Exam, Report, Organization, and Profile detail. |
| Form workflow | Purpose, scope, grouped fields, validation, review, primary commit, secondary actions, and recovery. | Create, edit, configure, publish, and permission workflows. |
| Report or analytics | Scope controls, title, freshness, summary, visual or tabular evidence, interpretation, and export or drill-down. | Reports, Analytics, Exam results, and trends. |
| Settings or configuration | Section navigation, current context, grouped settings, safe defaults, save state, and recovery. | Organization, Profile, permissions, integrations, and preferences. |
| Authentication or access | Identity task, persistent labels, security guidance, status, recovery, and safe completion. | Sign in, recovery, session, and access-denied flows. |

## Enterprise SaaS Guidelines

- Every template must expose role, Organization, workspace, permission, and data scope where relevant.
- Do not place irreversible or financially consequential actions in a template without review and recovery.
- Preserve domain-specific evidence: exact values, units, status, freshness, and affected records.
- Use existing Dashboard, Table, Form, Data Visualization, and state authorities instead of adding template-specific rules.
- Keep page structure consistent across modules so users can transfer knowledge.

## Mobile-first & Responsive Rules

- Every template begins as a complete narrow-screen task flow.
- Reorder regions by task priority, not by desktop coordinates.
- Convert dense tables, chart groups, side panels, and action clusters only through approved responsive patterns.
- Preserve the page identity, scope, primary action, active filters, status, and recovery path.
- Keep templates usable without hover, precision gestures, or hidden horizontal content.
- Defer breakpoint behavior and responsive values to [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) and [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

## Accessibility (WCAG 2.2 AA)

- Each template has a clear landmark structure, heading order, page title, and focus entry point.
- State changes remain associated with the page region that changed.
- Forms, tables, charts, dialogs, navigation, and actions use their canonical accessibility contracts.
- Responsive transformations preserve equivalent content, controls, status, and recovery.
- Validate against [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md); do not create template-specific thresholds.

## AI Rules

- Never create a new page template when an existing archetype fits.
- Never redesign product identity, navigation language, typography, palette, or component style.
- Preserve existing page purpose and business workflow; improve only hierarchy, grouping, placement, spacing relationships, responsiveness, accessibility, and usability.
- Never invent tokens, component variants, page states, route behavior, or implementation code.
- If no template fits, document the gap for governance instead of silently creating a one-off page.

## Validation Checklist

- [ ] An existing page template was selected and its required regions are present.
- [ ] Page purpose, scope, role, status, evidence, primary action, and recovery are clear.
- [ ] The template reuses [LAYOUT_PATTERNS.md](./LAYOUT_PATTERNS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), and domain guides.
- [ ] No tokens, hardcoded values, duplicate components, or one-off template rules were defined.
- [ ] Mobile-first, keyboard, screen-reader, focus, zoom, localization, and reduced-motion behavior are preserved.
- [ ] Loading, empty, error, unauthorized, partial, and stale states are accounted for where relevant.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Product Management, and Frontend Engineering |
| Status | Canonical source of truth for page templates |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [LAYOUT_PATTERNS.md](./LAYOUT_PATTERNS.md), [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Scope | Recurring enterprise SaaS page structures and state placement |
| Out of Scope | Tokens, components, routes, business logic, data contracts, and page-specific content |