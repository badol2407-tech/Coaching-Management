---
title: EduTrack Dashboard Module
purpose: Define the role-aware operational overview for current work, exceptions, scope, freshness, and safe next actions.
scope: Dashboard entry experience across Organization, Workspace, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, and AI Assistant summaries.
audience: Product, Design, Engineering, Data, QA, Security, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../DASHBOARD_DESIGN_GUIDE.md
  - ../DATA_VISUALIZATION_GUIDE.md
  - ../NAVIGATION_STANDARDS.md
  - ../PATTERN_LIBRARY.md
  - ../PERMISSION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../AI_UX_GUIDELINES.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Dashboard, metric, role, or source-data change
owner: Product, Product Design, Data, Engineering, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Dashboard, Organization, Workspace, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Role, Permission, AI Assistant
---

# Dashboard

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Dashboard is the role-aware operational starting point for EduTrack. It answers what is happening in the active Workspace, what requires attention, and what safe action the user can take next. It is not a decorative collection of metrics.

This module applies the shared rules in [DASHBOARD_DESIGN_GUIDE.md](../DASHBOARD_DESIGN_GUIDE.md), [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), and [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md); those documents own the general Dashboard, information, and visualization standards.

## Scope

### Included

- Role-aware overview of current work and exceptions.
- Active Organization, Workspace, program, batch, subject, and date scope.
- Operational summaries for Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, and Notifications.
- Drill-down links that preserve scope and context.
- Data freshness, completeness, source, and limitation communication.
- Optional, reviewable AI Assistant summaries or suggestions.

### Excluded

- Creating or editing the source records represented by a summary.
- Replacing Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, or Notifications as their source of truth.
- Granting Permissions or changing Organization configuration.
- Presenting a metric without scope, period, freshness, or interpretation.
- Ranking people or implying educational, financial, or coaching outcomes without documented context.

## Users & Roles

| Role | Dashboard responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Monitor authorized aggregate Organization health and platform attention signals. | Authorized aggregate scope; no unnecessary individual records. |
| Organization administrator | Coordinate Organization work and resolve operational exceptions. | Active Organization and authorized Workspace, programs, batches, and records. |
| Teacher | Act on assigned Students, batches, Attendance, Exams, tasks, and relevant Notifications. | Assigned teaching scope and authorized Student Profiles. |
| Student | Understand personal Attendance, Exams, Fees, Reports, Notifications, Profile, and optional assistance. | Own records and explicitly shared Organization content. |
| Future authorized Role | Use only the Dashboard areas declared by its approved Role and Permission contract. | Explicitly documented scope; deny by default until approved. |

The Dashboard must not reveal an inaccessible destination merely by rendering a disabled control. Role visibility is permission-aware and enforced at the data boundary; see [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md).

## Business Rules

1. Every view states the current Role, Organization or Workspace scope, time period, freshness, primary operational question, and available next actions.
2. Current work and actionable exceptions precede status, meaningful trends, and supporting detail.
3. Overdue Fees, Attendance exceptions, pending Exam work, failed Reports, and security-relevant Notifications cannot be visually subordinated to vanity metrics.
4. Each metric identifies its name, value, unit, period, comparison basis, freshness, and interpretation. Attendance, Fees, Exams, and Analytics must state relevant denominator, exclusions, or limitations.
5. Scope changes are explicit, reversible, and preserved through drill-down, refresh, and browser history. A high-impact view never broadens scope silently.
6. An exception, card, chart, or list links to a scoped destination and carries the context needed to understand the action.
7. Zero, missing, partial, stale, unauthorized, and failed data are distinct conditions; no non-success response becomes an empty metric.
8. Dashboard summaries are read models. Changes happen in the owning module and return with a confirmation that names the affected source record or scope.
9. Notifications communicate relevant state and action without artificial urgency. AI Assistant content is generated, optional, and reviewable.

## User Journeys

### Organization administrator: resolve an operational exception

1. Open Dashboard and confirm Organization, Workspace, date range, and freshness.
2. Identify the highest-priority exception and understand its count, scope, owner, and reason.
3. Open the linked Students, Teachers, Attendance, Fees, Exams, Reports, or Notifications destination.
4. Review or act in the source module, with permissions and consequence shown before commit.
5. Return to Dashboard and confirm the updated state or an explicit pending, partial, or failed outcome.

### Teacher: prepare today’s work

1. Open Dashboard and confirm assigned batch, date, and current Attendance context.
2. Review assigned Students, pending Exams, tasks, and relevant Notifications.
3. Open the next permitted task without losing Student, batch, subject, or date scope.
4. Complete the action in its source workflow and return through browser history or an explicit route.

### Student: understand personal status

1. Open Dashboard and confirm personal Workspace and reporting period.
2. Review own Attendance, Exam, Fee, Report, and Notification summaries.
3. Open a record to inspect exact values, source context, or next action.
4. Optionally request an AI Assistant explanation, review the generated content, and keep the source record unchanged unless explicitly applying an authorized action.

### Super administrator: review aggregate health

1. Open authorized aggregate Dashboard scope.
2. Inspect freshness, incomplete data, Organization health, and operational attention signals.
3. Drill into an Organization only when the Role and Permission permit that scope.
4. Record or route the issue without exposing unnecessary individual data.

## Information Architecture

The page hierarchy is:

1. Page identity, current Role, active Organization or Workspace, date period, and freshness.
2. Primary operational question and the next safe action.
3. Current tasks and actionable exceptions.
4. Status summaries for the selected scope.
5. Meaningful trends with units, comparisons, source, and limitations.
6. Supporting activity, explanatory detail, and optional AI Assistant content.

The active scope remains visible when users Search, apply Filters, open a drill-down, change a date, or return from a source module. Dashboard does not mix identity, financial, educational, and Permission data merely because they are available in the same database.

## Navigation Flow

`Sidebar > Dashboard` is the primary entry point. From Dashboard:

- exception or metric → scoped Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, or Notifications destination;
- Organization or Workspace context → authorized Organization Settings;
- Profile or user identity → Profile;
- AI Assistant suggestion → reviewable AI context with a return path to Dashboard;
- refresh or date/filter change → Dashboard with scope and safe state preserved.

Deep links validate authorization, identify the destination, preserve browser history, and do not discard safe work. Mobile navigation uses the approved responsive navigation pattern rather than a hidden gesture; see [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md).

## Screen Specifications

### Dashboard shell

- Unique page title and active Sidebar destination.
- Visible Organization, Workspace, Role, period, freshness, and scope controls.
- One primary next action appropriate to the current Role.
- Clear separation between recorded data, pending work, and generated content.

### Attention and current-work region

- Each item states object, reason, count or identity, owner, scope, freshness, and next action.
- High-impact items identify consequence and route to the source workflow.
- No attention signal relies on color, position, or a badge alone.

### Summary and trend region

- Metrics and charts answer a stated decision question.
- Exact values, units, period, source, exclusions, missing-data behavior, and accessible text/table alternatives are available without hover.
- Trends preserve selected Organization, batch, subject, Student, Teacher, and date scope during drill-down.

### Supporting activity and AI region

- Recent activity is scoped, permission-filtered, and distinguishable from source-of-truth records.
- AI Assistant content identifies generated status, source scope, uncertainty, and required human review.
- No AI suggestion silently sends a Notification, changes a record, or changes a Permission.

## Component Composition

Use the approved contracts; do not create Dashboard-specific replacements:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Bottom Navigation](../components/Bottom%20Navigation.md), and [Breadcrumb](../components/Breadcrumb.md) for location.
- [Card](../components/Card.md), [List](../components/List.md), [Table](../components/Table.md), [Charts](../components/Charts.md), and [Pagination](../components/Pagination.md) for operational content.
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), and [Chip](../components/Chip.md) for scope and Filters.
- [Button](../components/Button.md), [Link](../components/Link.md), [Icon Button](../components/Icon%20Button.md), [Tabs](../components/Tabs.md), and [Menu](../components/Menu.md) for actions and related views.
- [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Avatar](../components/Avatar.md), [Banner](../components/Banner.md), and [Alert](../components/Alert.md) for status and identity.
- [Skeleton](../components/Skeleton.md), [Loading Spinner](../components/Loading%20Spinner.md), [Progress](../components/Progress.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md) for lifecycle states.

Apply [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md) for Dashboard exceptions, Search and filtered lists, structured data, feedback, loading, AI assistance, and mobile conversion.

## Permissions

- Read access is scoped by Role, Organization, Workspace, object, program, batch, subject, and individual record.
- A metric is computed only from records the user is authorized to see; inaccessible records cannot affect visible counts in a misleading way.
- Drill-down, export, refresh, and AI context re-check authorization at the destination and data boundary.
- Dashboard cannot grant, remove, or infer Permission.
- Denied views state that the action or scope is unavailable without confirming protected data.
- Super administrator access to aggregate data is explicitly scoped and must not become unrestricted individual access.

## Validation Rules

- Organization or Workspace scope is required before scoped data is shown.
- Date periods must be valid, visible, and compatible with the selected source data.
- Metrics require a value definition, unit, period, source, freshness, and interpretation before display.
- Filters must identify their dataset, preserve valid scope, support clear/reset, and distinguish no records from no matching results.
- Drill-down parameters must preserve object identity and scope; invalid or unauthorized parameters fail closed.
- Chart and export requests must retain units, labels, limitations, and generation status.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [LOADING_STATES.md](../LOADING_STATES.md), [EMPTY_STATES.md](../EMPTY_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: explain how the Dashboard scope will be selected; do not imply missing data.
- `loading`: keep page identity and scope visible; load independent regions independently.
- `ready`: state data freshness and completeness.
- `empty`: distinguish a new Organization, no records, no matching Filters, and not-applicable metric.
- `partial`: identify completed and unavailable regions; never present the partial view as complete.
- `stale`: expose last-known freshness and provide refresh or review.
- `pending`: name the source action and avoid final-success language.
- `error`: identify failed source, scope, saved state, and safe retry or source-module path.
- `unauthorized`: do not reveal protected records or counts; offer the permitted support/request route.
- `disabled`: explain why an action is unavailable when the reason is not obvious.

## Notifications

Dashboard may surface Notifications from the shared Notification System, but it does not redefine Notification taxonomy or delivery. A surfaced Notification identifies source, Organization or Workspace scope, time, consequence, and action. Read, unread, dismiss, delivery failure, and preference behavior follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md).

## Accessibility

Use the release requirements in [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and evidence process in [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md). Dashboard-specific expectations are:

- Role, scope, period, freshness, metric meaning, and status are available to keyboard and assistive-technology users.
- Charts have exact text summaries and accessible table or equivalent views.
- Updated metrics and exceptions have useful semantic announcements without interrupting unrelated work.
- Tables, Filters, drill-downs, and mobile navigation remain usable at zoom and with reflow.
- Color, motion, chart position, and badges are never the only status or urgency signal.

## AI Behavior

The AI Assistant may summarize authorized Dashboard data, explain a metric, or suggest a review path. It must show its source scope, freshness, generated status, uncertainty, limitations, and human review path. It must not invent a metric, conceal missing data, rank people without approved context, send a Notification, mutate source records, or change Permissions. Apply [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md).

## Security

Dashboard queries, caches, exports, Notifications, deep links, and AI prompts are Organization- and Role-scoped. Enforce authorization at the data boundary, minimize sensitive Student, Teacher, Fee, Report, Profile, and Authentication data, and avoid protected-record existence disclosure. Log consequential access and export events according to [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load page identity, scope, and the most important operational work before secondary charts or activity. Keep independent regions interactive, preserve stable layout, cancel obsolete Search or Filter requests, and provide acknowledgment and progress for slower work. Measure Dashboard navigation, first useful content, metric refresh, drill-down, export, and AI latency using the performance owner in [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md); this module does not create a competing threshold.

## Acceptance Criteria

- [ ] A representative user can identify Role, Organization or Workspace scope, period, freshness, and primary action immediately.
- [ ] Each Role sees only authorized and relevant Dashboard content.
- [ ] Exceptions and high-salience items link to scoped source workflows.
- [ ] Every metric and visualization exposes meaning, scope, freshness, limitations, and a nonvisual equivalent.
- [ ] Dashboard states distinguish empty, partial, stale, pending, unauthorized, and error conditions.
- [ ] Source-module changes do not appear as Dashboard success before durable acceptance.
- [ ] AI Assistant content is disclosed, permission-scoped, reviewable, and non-mutating by default.
- [ ] Mobile, keyboard, zoom, localization, and reduced-motion behavior are documented and evidenced.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: product scope, Role, Organization, Workspace, objects, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Dashboard data, metric definitions, freshness, missing-data, and visualization evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: permissions, deep links, caches, exports, Notifications, audit, and privacy.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: initial, loading, ready, empty, partial, stale, pending, success, error, unauthorized, disabled, retry, and recovery states.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, zoom, reflow, mobile, reduced-motion, and text/table alternatives.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, independent loading, cancellation, duplicate prevention, monitoring, and rollback.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: AI source scope, uncertainty, human review, correction, rejection, privacy, fairness, and harmful-failure evidence.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md) and [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md).

## References

- [DASHBOARD_DESIGN_GUIDE.md](../DASHBOARD_DESIGN_GUIDE.md)
- [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md)
- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)
- [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md)