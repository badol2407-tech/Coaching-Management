---
title: EduTrack Teachers Module
purpose: Define authorized Teacher discovery, review, assignment, workload context, and profile administration.
scope: Teachers collection, Teacher record detail, Search, Filters, assignments, related Students and operational workflows, Profile and Permission boundaries.
audience: Product, Design, Engineering, Security, Privacy, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../FORM_DESIGN_GUIDE.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../STATE_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Teacher, assignment, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Teachers, Teacher, Organization, Workspace, Students, Attendance, Exams, Reports, Notifications, Profile, Permission, Role, Search, Filters, AI Assistant
---

# Teachers

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Teachers is the authorized collection and record workspace for people delivering coaching or instruction. It helps administrators coordinate assignment and access while helping Teachers understand their permitted Students, batches, subjects, Attendance, Exams, tasks, and Notifications.

This module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [SECURITY_UX.md](../SECURITY_UX.md).

## Scope

### Included

- Teachers collection and scoped Search.
- Teacher identity, status, assignment, workload context, and authorized Profile data.
- Teacher detail and related links to Students, Attendance, Exams, Reports, Notifications, Dashboard, Organization, and Profile.
- Authorized create, update, assign, reassign, archive, restore, import, and review workflows.
- Audit and privacy-aware visibility for assignment and Permission changes.

### Excluded

- Students, Attendance, Exams, Reports, Notifications, Authentication, Profile, or Permission records as a source of truth.
- Employment or performance decisions inferred from workload or activity metrics.
- Silent changes to Teacher assignments, access, or Organization membership.
- Revealing protected Teacher data or record existence to an unauthorized user.

## Users & Roles

| Role | Teacher responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate Teacher or Organization operations. | Explicitly granted Organization scope with minimized personal data. |
| Organization administrator | Create, update, assign, reassign, archive, restore, and review Teachers. | Active Organization and authorized Workspace/program/batch scope. |
| Teacher | Review own Profile, assignments, assigned Students, Attendance, Exams, tasks, and Notifications. | Own record and assigned teaching scope. |
| Student | See only the Teacher identity and contact information explicitly shared for the Student’s authorized context. | Related, shared Teacher context only. |
| Future authorized Role | Use only actions defined by its approved Role and Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Teacher is the canonical singular term and Teachers is the canonical destination; use coach only when describing a distinct business Role.
2. Every Teacher view identifies Organization or Workspace, Teacher identity, record status, and assignment scope.
3. Teacher identity, assignments, Students, Profile, and Permissions are separate concepts with separate visibility.
4. Assignment and reassignment are consequential changes: show affected Teacher, Students, batch, subject, period, actor, effect, and recovery before save.
5. A Teacher may access only the Students, Attendance, Exams, Reports, and Notifications within the assigned and authorized scope.
6. Workload or activity summaries describe context and must not imply Teacher quality, employment outcome, or Student success without approved evidence and interpretation.
7. Archived or inactive Teachers retain only the history permitted by retention policy; they are not silently deleted from historical records.
8. Imports validate row-level identity, assignment, and duplicate conditions and report partial results.
9. AI Assistant content about Teachers is optional, generated, permission-scoped, and reviewable; it cannot make employment, access, assignment, or performance decisions.

## User Journeys

### Organization administrator: create and assign a Teacher

1. Open Teachers and confirm Organization, Workspace, and assignment period.
2. Enter identity and required Profile information, marking optional and sensitive fields clearly.
3. Select permitted program, batch, subject, and Student scope.
4. Review access, affected Students, Notifications, and Permission consequences.
5. Save and confirm the Teacher identity, assignment state, and next action.

### Organization administrator: reassign a Teacher

1. Open the Teacher detail and review current assignments and active period.
2. Choose reassign and select a valid target scope.
3. Review what Students, Attendance, Exams, Reports, and Notifications are affected.
4. Confirm with explicit actor, effective date, and recovery behavior.
5. Verify the resulting pending, success, partial, or error state and audit entry.

### Teacher: review assigned work

1. Open Teachers or Dashboard and confirm own identity and active Workspace.
2. Review assigned batches, Students, Attendance, Exams, tasks, and Notifications.
3. Open a Student or source workflow while preserving the assignment scope.
4. Complete only permitted actions and confirm durable result or recovery state.

### Student: view shared Teacher context

1. Open an authorized Student or Profile view.
2. Confirm the Teacher is associated with the current program, batch, or subject.
3. View only the contact or identity fields explicitly shared by policy.

## Information Architecture

### Teachers collection

Page identity and Organization or Workspace scope → Search and Filters → result count and freshness → Teacher identity and status → assignment summary → permitted actions.

### Teacher detail

Teacher identity and status → Organization, Workspace, and assignment context → authorized Profile information → assigned Students and operational context → history, audit, and advanced actions.

Do not mix Permission controls, private Profile fields, or inferred performance judgments into a collection row. Show them only in the task and scope where they are authorized and meaningful.

## Navigation Flow

`Sidebar > Teachers` opens the scoped collection. From Teachers:

- Teacher row or Search result → Teacher detail;
- Teacher detail → assigned Students, Attendance, Exams, Reports, Notifications, Profile, or Organization settings when authorized;
- create/update/assign/reassign/import → review → confirmation → Teacher detail or preserved collection scope;
- Dashboard workload or assignment item → Teachers with originating Organization, Workspace, period, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected Teacher existence. Mobile preserves identity, assignment scope, status, and primary action when transforming the collection.

## Screen Specifications

### Teachers collection

- Named Search field, active Organization or Workspace scope, result count, and freshness.
- Filters for assignment, program, batch, subject, status, and other authorized criteria.
- Teacher identity, status, assignment summary, and action scope visible in each row.
- Table, List, or responsive detail representation chosen according to the decision and viewport.

### Teacher detail

- Canonical Teacher name, supporting identifier, status, Avatar where appropriate, and scope.
- Current and upcoming assignments with effective period and related Students count where authorized.
- Profile information separated from assignment and Permission controls.
- Links to operational workflows with visible scope and permission-aware behavior.
- History and audit context separated from editable fields.

### Create, update, assignment, and import

- Persistent labels and clear required/optional/sensitive distinction.
- Assignment selectors constrained to active Organization or Workspace.
- Review state for assignment, reassign, archive, restore, import, export, or Permission changes.
- Draft, save, cancel, conflict, partial result, and recovery behavior.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Autocomplete](../components/Autocomplete.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), [Textarea](../components/Textarea.md), and [Checkbox](../components/Checkbox.md).
- [Table](../components/Table.md), [List](../components/List.md), [Data Grid](../components/Data%20Grid.md) only for approved multi-record entry, and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Teacher search/list, record detail, bulk operation, draft, empty, AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read, create, edit, assign, reassign, archive, restore, import, export, sensitive-field, and Permission administration are distinct capabilities.
- All capabilities are scoped by Organization, Workspace, program, batch, subject, Teacher, and Role.
- Teacher access to Students and source workflows is limited to assigned and explicitly authorized scope.
- Student access to Teacher information is limited to approved shared fields.
- Assignment, reassign, archive, restore, import, export, and Permission changes require deliberate review and audit.
- Authorization is rechecked for collection queries, direct links, cached records, exports, imports, related-module navigation, and Notifications.

## Validation Rules

- Teacher identity fields, formats, Organization scope, and duplicate signals are declared before submission.
- Assignment targets must belong to the active Organization or Workspace and be compatible with the effective period.
- Reassignment must identify affected Students, Attendance, Exams, Reports, and Notifications before confirmation.
- Required Permission and approval conditions are known before a consequential action can be submitted.
- Search and Filter criteria are valid for the Role and cannot broaden scope when invalid or missing.
- Workload and activity values require source, period, unit, denominator where relevant, and interpretation before display.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: select Organization or Workspace scope before querying Teachers.
- `loading`: preserve Search, Filters, page, assignment context, and safe form input.
- `ready`: show count, freshness, scope, status, and permitted actions.
- `empty`: distinguish no Teachers yet, no matching results, no assigned Teachers, no access, and service unavailable.
- `partial`: identify accepted, skipped, and failed assignment or import changes.
- `stale`: expose last-known assignment freshness and provide refresh or conflict review.
- `pending`: distinguish accepted-but-not-final assignment, archive, restore, import, or Permission action.
- `success`: name Teacher, assignment scope, effective period, and next action.
- `error`: preserve input and query context; distinguish validation, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: communicate capability boundaries without protected-data disclosure.

## Notifications

Teacher Notifications may communicate assignment, Attendance, Exam, task, security, or Organization state. Delivery, preferences, read state, privacy, and idempotency follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Assignment changes identify affected scope and effective time without exposing unrelated Student data.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md). Teachers-specific requirements:

- Teacher identity, assignment, effective period, scope, action consequence, and permission state are textually and semantically available.
- Search, Filters, tables, assignment forms, dialogs, and reassignment review are keyboard complete with visible focus.
- Long names, multiple assignments, translated labels, 200% zoom, mobile reflow, text enlargement, and screen-reader announcements are tested.
- Workload and activity summaries provide text interpretation and do not rely on chart color, position, or hover.

## AI Behavior

The AI Assistant may summarize authorized assignment or activity data and draft explanations. It must disclose source scope, period, generated status, uncertainty, missing data, and review controls. It must not infer Teacher quality, rank Teachers, decide assignments, change access, send consequential Notifications, or mutate Teacher, Student, Attendance, Exam, Report, Profile, or Permission records without explicit authorized review.

## Security

Teacher data, assignments, Student relationships, Profile fields, Notifications, exports, caches, and AI context are Organization- and Role-scoped. Enforce boundaries at every request and direct link, minimize sensitive data, protect files and exports, avoid protected-record disclosure, and audit assignment and Permission changes under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Make collection Search and assignment review responsive, paginate large records, cancel obsolete queries, and avoid loading unrelated Student or Profile detail. Measure Teachers collection, Search, Filter, detail, assignment review, save, import, export, and related-module navigation with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can find and understand a Teacher within explicit Organization, Workspace, assignment, and Filter scope.
- [ ] Teacher detail separates identity, Profile, assignment, Students, and Permission context.
- [ ] Create, update, assign, reassign, archive, restore, import, and export paths state scope, consequence, actor, and recovery.
- [ ] Teacher access to Students and source workflows is permission-scoped and rechecked at the data boundary.
- [ ] Assignment conflicts, partial changes, stale data, unauthorized access, and service failure preserve safe intent.
- [ ] Teachers uses approved components and canonical terms without duplicating shared standards.
- [ ] Accessibility, privacy, AI, audit, retention, performance, and mobile evidence is available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Teacher scope, Roles, Permissions, assignments, objects, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, table/list, detail, forms, assignment review, import, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: state transitions, validation, duplicate prevention, conflict, partial work, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, file, Notification, AI, audit, and retention evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: accessibility, localization, responsive, mobile, and reduced-motion evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)