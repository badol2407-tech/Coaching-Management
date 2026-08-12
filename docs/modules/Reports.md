---
title: EduTrack Reports Module
purpose: Define scoped Report generation, review, saving, sharing, export, and source-data disclosure for authorized Users.
scope: Report definitions, parameter scope, data sources, generation, saved Reports, schedules where approved, previews, tables, charts, exports, access, freshness, limitations, and authorized relationships to Fees, Attendance, Exams, Analytics, Students, Classes, and Dashboard.
audience: Product, Design, Engineering, Security, Privacy, Data, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../DASHBOARD_DESIGN_GUIDE.md
  - ../DATA_VISUALIZATION_GUIDE.md
  - ../FORM_DESIGN_GUIDE.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../STATE_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../INTERNATIONALIZATION.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Report, source-data, Role, privacy, export, or workflow change
owner: Product, Product Design, Data, Engineering, Security, Privacy, Operations, and Governance
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Reports, Report, source data, scope, period, measure, unit, denominator, aggregation, freshness, limitation, export, Student, Organization, Workspace, Role, Permission, Search, Filters, Analytics, Notifications, AI Assistant
---

# Reports

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate data-visualization, authorization, security, accessibility, or export standards.

## Purpose

Reports is the governed workspace for generating, reviewing, saving, sharing, and exporting a presentation of defined source data for a stated scope, period, and purpose. It helps authorized Users answer a documented question while preserving the meaning, freshness, limitations, and authorization context of the source records.

The module applies the shared rules in [DASHBOARD_DESIGN_GUIDE.md](../DASHBOARD_DESIGN_GUIDE.md), [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md), [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). Those documents own general presentation, visualization, table, authorization, and locale behavior.

## Scope

### Included

- Report definition, purpose, source datasets, Organization, Workspace, Role, period, Filters, and generation status.
- Report preview, saved versions, tables, charts, summaries, limitations, freshness, and source links.
- Authorized export, sharing, download, retention, and access review.
- Attendance, Fees, Exams, Students, Teachers, Classes, Subjects, Routine, Academic Sessions, Dashboard, and Analytics reporting context.
- Partial, stale, unavailable, generated, saved, failed, and superseded Report states.

### Excluded

- Replacing Attendance, Fees, Exams, Students, or other source modules as the source of truth.
- Presenting an interpretation as a recorded source fact or a chart without a text or table equivalent.
- Silent broadening of Organization, Workspace, Student, date, or Role scope.
- Unsupported ranking, causal claim, prediction, or financial/educational decision from a Report.
- AI-generated Report content being treated as verified without human review and source disclosure.

## Users & Roles

| Role | Reports responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate platform or Organization Reports for health and governance. | Explicitly authorized aggregate scope; minimize individual records. |
| Organization administrator | Define, generate, save, review, share, export, and govern Organization Reports. | Active Organization and authorized Workspace, Academic Session, Class, Student, and source scope. |
| Teacher | Generate or review permitted Reports for assigned Classes, Subjects, Students, Attendance, and Exams. | Assigned teaching scope and authorized historical periods. |
| Student | View own authorized Reports and approved shared summaries. | Own records and explicitly shared Organization content. |
| Future authorized Role | Use only Report actions declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Reports is the canonical destination; use “generate Report” for creation and “export Report” for an output action.
2. Every Report states its purpose, source data, Organization or Workspace, Role scope, period, Filters, measure, unit, denominator, aggregation, freshness, limitations, and generation status.
3. A Report is a read model and does not change source records. Source corrections appear only after the owning module accepts them and the Report is regenerated or clearly marked stale.
4. Saved Reports preserve the parameter set, source version or freshness, owner, audience, created time, and access scope. A saved Report is not automatically current.
5. Zero, missing, partial, stale, unauthorized, and failed source data remain distinct. A missing source region must not become a zero or an empty chart without explanation.
6. Tables and charts expose exact values, units, labels, denominator, period, exclusions, source, and an accessible text or table equivalent without requiring hover.
7. Exports preserve scope, units, date/locale meaning, limitations, generation state, and sensitivity classification. Export authorization is checked separately from view authorization.
8. Report links, shared copies, caches, and scheduled delivery where approved never broaden access or reveal protected-record existence.
9. Notifications identify Report generation, failure, availability, or required review without exposing sensitive values to an unauthorized context.
10. AI Assistant content is generated, labeled, reviewable, and non-authoritative; it cannot silently change a source, share a Report, or export sensitive data.

## User Journeys

### Organization administrator: generate a Report

1. Open Reports and state the question, Organization, Workspace, source modules, Academic Session, period, and audience.
2. Select approved measures and Filters; review denominator, exclusions, freshness, limitations, and estimated result scope.
3. Generate the Report and observe loading, partial, stale, or failure feedback.
4. Review the preview, exact values, chart/table equivalence, source links, and permitted actions.
5. Save, export, share, or discard with consequence and access review where required.

### Teacher: review an assigned Report

1. Open Reports with assigned Class, Subject, Student, Academic Session, and date scope preserved.
2. Verify source, measure, denominator, freshness, limitations, and generated or saved status.
3. Inspect exact records or source-module links before acting on the result.
4. Export or share only when the Role and Permission allow it.

### Student: view a shared Report

1. Open the shared Report and confirm own Student, Organization, Workspace, period, freshness, and audience.
2. Review the summary, exact values, limitations, and accessible table or text equivalent.
3. Follow a permitted source link or support path without gaining access to unrelated records.

### Organization administrator: export or revoke access

1. Open the saved Report and review current audience, source scope, freshness, exports, and access history.
2. Confirm the object, scope, format, recipients, sensitivity, consequence, and recovery path.
3. Export or revoke access and verify the named result, Notification, and audit entry.

## Information Architecture

### Reports collection

Page identity and active scope → Search and Filters → saved/draft/generated/failed Report states → Report rows → owner, freshness, audience, and permitted actions.

### Report builder

Purpose and source → Organization, Workspace, Role, period, and Filters → measures, units, denominator, aggregation, and exclusions → preview and validation → generate/save/export.

### Report detail

Title and purpose → scope and freshness → exact summary and accessible table → charts and interpretation → limitations and source links → audience, export, history, and permitted actions.

Do not combine private Profile data, unrelated source scopes, or AI-generated interpretation into a Report without an explicit source, audience, and limitation declaration.

## Navigation Flow

`Sidebar > Reports` opens the authorized Report collection. From Reports:

- Report row or Search result → Report detail;
- Report detail → source Fees, Attendance, Exams, Students, Classes, Analytics, Dashboard, or Notifications with scope preserved;
- configure, generate, save, export, share, or revoke → review → confirmation where consequential → result or preserved list scope;
- Dashboard exception → Reports with originating Organization, Workspace, period, source, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected source or Report existence. Mobile preserves Report identity, scope, freshness, primary action, and recovery.

## Screen Specifications

### Reports collection

- Named Search and Filters identify the Report dataset and active Organization, Workspace, owner, source, Academic Session, period, status, and audience scope.
- Each row identifies purpose, source, owner, period, freshness, generated/saved status, audience, and permitted action.
- No-result, no-access, stale, failed, and empty states are distinguishable.

### Report builder and preview

- Purpose, source, scope, period, Filters, measure, unit, denominator, aggregation, exclusions, and limitations are visible before generation.
- Preview exposes exact values, loading or partial state, source freshness, data table, chart equivalence, and source links.
- Safe parameters persist across validation or generation failure; changed scope is explicit and reversible.

### Report detail and export review

- Report identity, purpose, scope, freshness, limitations, generated status, owner, audience, and source data lead the page.
- Export review states format, rows or scope, sensitive fields, recipients, units, locale, limitations, and recovery.
- Saved versions and access history distinguish current, stale, superseded, revoked, and failed outcomes.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Date Picker](../components/Date%20Picker.md), and [File Upload](../components/File%20Upload.md) for parameters and imports where approved.
- [Table](../components/Table.md) for exact Report values, [Charts](../components/Charts.md) for approved visual encodings, [Data Grid](../components/Data%20Grid.md) for approved snapshots, and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [List](../components/List.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Reports search/list, field composition, structured data, data visualization, bulk/export, consequential confirmation, draft, reviewable AI, empty, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Report, define, generate, save, edit, delete, view source, export, share, revoke access, view history, and administer Reports are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Role, source module, Academic Session, Class, Student, period, audience, and sensitivity.
- A Teacher or Student may view only assigned or explicitly shared Reports; export and sharing require separate authorization.
- Report generation, export, sharing, access revocation, and sensitive-source viewing require explicit capability and consequence review.
- Authorization is rechecked for parameter queries, source reads, saved copies, caches, deep links, exports, Notifications, and AI context.
- Permission denial does not reveal protected source or Report existence.

## Validation Rules

- Purpose, source, Organization, Workspace, Role, period, Filters, measure, unit, denominator, aggregation, and audience must be valid before generation.
- Source records and client-supplied query parameters are validated server-side; invalid parameters cannot broaden scope.
- Charts, tables, summaries, and exports validate labels, units, date/locale meaning, missing-data behavior, denominator, limitations, and generation state.
- Saved Report versions, shared links, exports, duplicate requests, stale sources, and concurrent edits require visible conflict or supersession handling.
- Export validates format, sensitivity, recipient scope, row scope, and authorization independently of Report viewing.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: explain how source, Organization, Workspace, and period scope will be selected.
- `loading`: preserve builder parameters, list scope, and safe draft work.
- `ready`: show Report identity, purpose, source, scope, freshness, and permitted actions.
- `empty`: distinguish no saved Reports, no source records, no matching Filters, no applicable measure, no access, and unavailable service.
- `partial`: identify completed and unavailable source regions, rows, charts, or export pages.
- `stale`: show last-known source freshness and provide refresh or regenerate.
- `pending`: name generation, save, export, or sharing accepted but not final.
- `success`: name the Report, source scope, saved/exported/shared result, and next action.
- `error`: preserve safe parameters and draft; distinguish validation, source, authorization, export, network, and service failure.
- `unauthorized` and `disabled`: explain the available capability or support path without protected-data disclosure.

## Notifications

Report Notifications may communicate generation completion, failure, stale source data, export availability, sharing, access revocation, or required review. Delivery, preference, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify the Report, scope, time, consequence, and action without exposing protected values.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Report purpose, source, scope, period, measure, unit, denominator, aggregation, freshness, limitation, and status are available through text and semantics.
- Every chart has an accessible text summary and table or equivalent view; hover is never the only access path.
- Tables have captions, headers, row identity, keyboard operation, responsive transformation, and export-equivalent labels.
- Builder controls, Filters, date inputs, dialogs, progress, errors, and focus recovery have programmatic names and logical focus.
- 200% zoom, 320 CSS pixel reflow, long titles, translated labels, number/currency formats, screen readers, touch, and reduced motion are tested.

## AI Behavior

The AI Assistant may summarize an authorized Report, explain a measure, propose a plain-language description, or identify questions for human review. It must label generated content, identify source scope, period, freshness, denominator, limitations, uncertainty, missing data, and review controls. It must not invent values, conceal limitations, mutate source data, publish a Report, share an export, or change Permissions without explicit authorized human review and action.

## Security

Reports are Organization-, Workspace-, source-, period-, audience-, sensitivity-, and Role-scoped. Enforce authorization at source reads, parameter validation, caches, saved copies, exports, shared links, Notifications, deep links, audit, and AI boundaries. Minimize Student, Teacher, Fee, Profile, and Authentication data, protect generated files, avoid sensitive identifiers in URLs or logs where not required, and audit generation, export, sharing, and revocation under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Report identity, scope, and parameter state before secondary charts; stream or paginate large results; cancel obsolete generation, Search, and Filter requests; preserve stable table structure; and acknowledge slow generation or export. Measure builder open, preview, generation, source refresh, save, export, share, revoke, and recovery with the shared engineering performance process; this module does not create a competing numeric threshold.

## Acceptance Criteria

- [ ] Authorized Users can define and open the correct Report within explicit Organization, Workspace, source, period, Filter, audience, and Role scope.
- [ ] Every Report states purpose, source, scope, measure, unit, denominator, aggregation, freshness, limitations, and generation status.
- [ ] Charts and summaries have exact table or text equivalents and preserve source, units, scope, and limitations in exports.
- [ ] Generate, save, export, share, and revoke workflows state permission, scope, consequence, actor, audit, and recovery.
- [ ] Empty, partial, stale, pending, unauthorized, validation, source, export, and service-failure paths preserve safe intent.
- [ ] Approved components, canonical vocabulary, Notifications, AI behavior, privacy, retention, and audit rules are used without duplicate standards.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, reduced-motion, performance, and evidence requirements are documented.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Report purpose, sources, measures, units, denominators, aggregation, periods, Roles, Permissions, Organization, Workspace, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, tables, Charts, Data Grid, preview, generation, save, export, share, revoke, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: missing data, freshness, stale source, partial result, duplicate request, concurrent edit, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, file, Notification, AI, audit, retention, audience, and export evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, reduced-motion, and text/table alternative evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [DASHBOARD_DESIGN_GUIDE.md](../DASHBOARD_DESIGN_GUIDE.md)
- [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)
- [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md)