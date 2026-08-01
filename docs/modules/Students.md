---
title: EduTrack Students Module
purpose: Define authorized Student record discovery, review, creation, update, and related coaching context.
scope: Students collection, Student record detail, Search, Filters, lifecycle, authorized relationships to Attendance, Fees, Exams, Reports, Notifications, Profile, and Dashboard.
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
review_frequency: Quarterly and after a Student data, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Students, Student, Organization, Workspace, Teacher, Attendance, Fees, Exams, Reports, Notifications, Profile, Search, Filters, Role, Permission, AI Assistant
---

# Students

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Students is the authorized collection and record workspace for people receiving coaching or instruction. It helps authorized users find the correct Student, understand relevant status and relationships, and complete safe record work without mixing identity, financial, educational, and Permission data.

This module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), and [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md).

## Scope

### Included

- Students collection and scoped Search.
- Student identity, enrollment or assignment context, status, and authorized Profile data.
- Student record detail and related links to Attendance, Fees, Exams, Reports, Notifications, Dashboard, and Profile.
- Authorized create, update, archive, restore, import, and review workflows when the Role permits them.
- Record history, audit context, and privacy-aware visibility.

### Excluded

- Attendance, Fee, Exam, Report, Notification, Authentication, or Permission records as a source of truth.
- Automatic educational, financial, employment, or safety decisions about a Student.
- Requiring sensitive Profile data solely for completeness or AI Assistant convenience.
- Revealing a protected Student or confirming record existence to an unauthorized user.

## Users & Roles

| Role | Student responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Manage or review authorized aggregate or Organization-scoped Student operations. | Explicitly granted Organization scope; minimize individual data. |
| Organization administrator | Create, update, archive, restore, assign, and review Students for the Organization. | Active Organization and authorized Workspace/program/batch scope. |
| Teacher | Review and maintain assigned Student context where permitted; open related coaching workflows. | Assigned Students, batches, subjects, and authorized fields. |
| Student | View and update permitted own Profile fields; review own related records. | Own Student record and shared content only. |
| Future authorized Role | Use only the Student fields and actions declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Student is the canonical singular term and Students is the canonical destination; do not substitute learner.
2. Every Student view identifies Organization or Workspace, Student identity, record status, and current scope.
3. Student identity is separate from enrollment, assignment, Attendance, Fees, Exams, Reports, Notifications, Profile, and Permissions.
4. Search and Filters state the dataset, Organization or Workspace scope, result status, result count, active criteria, and clear/reset path.
5. A Student record may be archived or inactive without being silently deleted; history and related record retention follow approved policy.
6. Duplicate prevention and conflict review are required before creating or merging a Student identity.
7. A Student can be assigned to a Teacher, batch, program, subject, or Workspace only by an authorized Role and with a visible consequence.
8. Imports validate each row, preserve the original file and safe progress where policy allows, and provide a reviewable partial result.
9. AI Assistant summaries use only authorized Student data, identify source scope and generated status, and do not write to the Student record without explicit review and action.

## User Journeys

### Organization administrator: add a Student

1. Open Students and confirm Organization, Workspace, and intended scope.
2. Select the authorized create action and enter required identity and enrollment data.
3. Search or compare possible matches before creating a new identity.
4. Review visibility, assignment, and any consequential fields.
5. Save and receive named confirmation of the created Student and next safe action.

### Teacher: find and review an assigned Student

1. Open Students from Dashboard or Sidebar.
2. Search within the assigned Organization, batch, or class scope.
3. Open the Student detail and confirm identity, status, and current assignment.
4. Navigate to Attendance, Exams, Reports, or permitted Profile content without losing context.
5. Return to the filtered Students result with Search and Filters preserved.

### Student: review own record

1. Open the own Student or Profile view.
2. Confirm identity and Organization or Workspace context.
3. Review permitted information and related records.
4. Edit only allowed Profile fields, review visibility, and save with clear status.

### Organization administrator: import Students

1. Confirm Organization, Workspace, file purpose, accepted format, and visibility.
2. Select a file and review detected headers and proposed field mapping.
3. Resolve row-level validation and duplicate warnings before commit.
4. Review counts for accepted, skipped, and failed rows.
5. Confirm the import and access the recoverable result or retry path.

## Information Architecture

### Students collection

Page identity and scope → Search and Filters → result count and freshness → Student identity and status → relevant assignment or enrollment context → permitted row actions.

### Student detail

Student identity and status → Organization or Workspace and assignment context → authorized Profile and coaching information → related Attendance, Fees, Exams, Reports, and Notifications → history, audit, and advanced actions.

Do not place Fee amounts, sensitive Profile fields, or Permission controls into the collection merely because they are available in storage. Show each according to task and authorization.

## Navigation Flow

`Sidebar > Students` opens the scoped collection. From Students:

- Student row or Search result → Student detail;
- Student detail → Attendance, Fees, Exams, Reports, Notifications, or Profile when authorized;
- create/update/import → review → confirmation → Student detail or preserved collection scope;
- Dashboard exception → Students with the originating Organization, Workspace, batch, date, or Filter context;
- breadcrumb or browser back → previous safe list and query state.

Unauthorized deep links fail closed without confirming protected record existence. Mobile transforms rows and Filters without removing identity, scope, status, or recovery.

## Screen Specifications

### Students collection

- Named Search field and explicit Organization or Workspace scope.
- Filters for authorized batch, program, Teacher, status, and other approved criteria.
- Result count, freshness, no-result distinction, and clear/reset action.
- Table or List representation chosen according to the decision and viewport.
- Row identity, status, scope, and permitted actions remain visible.

### Student detail

- Canonical Student name and supporting identifier, status, Avatar where appropriate, and scope.
- Assignment/enrollment context before secondary metadata.
- Related workflow links with permission-aware visibility.
- History and audit information separated from editable identity fields.
- Sensitive values masked or omitted by default.

### Create, update, and import

- Persistent labels, required/optional distinction, examples where ambiguity is likely, and field-level validation.
- Review state for assignment, visibility, import, archive, restore, merge, or sensitive changes.
- Save, cancel, draft, discard, conflict, and recovery behavior.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Autocomplete](../components/Autocomplete.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), [Textarea](../components/Textarea.md), and [Checkbox](../components/Checkbox.md).
- [Table](../components/Table.md), [List](../components/List.md), [Data Grid](../components/Data%20Grid.md) only for approved inline multi-record entry, and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Students search/list, record detail, bulk operation, draft, empty, AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read, create, edit, archive, restore, assign, import, export, and sensitive-field access are separate capabilities.
- All capabilities are scoped by Organization, Workspace, program, batch, subject, Student, and Role.
- Teacher access is limited to assigned scope; Student access is limited to own record and explicitly shared data.
- Bulk update, import, merge, archive, export, and sensitive Profile changes require explicit capability and consequence review.
- Permission-denied messaging does not reveal whether another Student or protected field exists.
- Authorization is rechecked for collection queries, direct links, cached records, exports, imports, and related-module navigation.

## Validation Rules

- Required identity fields, formats, uniqueness signals, and Organization scope are declared before submission.
- Names and identifiers support localization and do not rely on fixed length assumptions.
- Assignment and enrollment values must belong to the active Organization or Workspace and be compatible with the selected period.
- Duplicate or possible-match warnings require review; the system must not silently create or merge identities.
- Archive, restore, merge, import, export, and sensitive-field changes require review of object, scope, effect, actor, and recovery.
- Search and Filter parameters are valid for the Role and current scope; invalid parameters do not broaden results.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: request Organization or Workspace scope before querying Students.
- `loading`: preserve Search, Filters, page, and current safe result structure.
- `ready`: show result count, freshness, scope, and permitted actions.
- `empty`: distinguish no Students yet, no matching Search results, no access, archived-only scope, and unavailable service.
- `partial`: identify accepted, skipped, and failed import rows; do not imply all rows were saved.
- `stale`: expose last-known freshness and provide refresh or conflict review.
- `pending`: show whether create, update, import, archive, or restore is accepted but not final.
- `success`: name Student, changed fields or import scope, and next action.
- `error`: preserve safe form input, Search, Filters, and file review; distinguish validation, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: explain available capability without protected-data disclosure.

## Notifications

Students may receive or surface Notifications for relevant assignment, import, profile, or workflow state, but delivery and preferences follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications minimize Student and Teacher data, identify source and scope, and never replace the Student source record or create artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md). Students-specific requirements:

- Student identity, status, scope, row actions, validation, and result state are available without color, hover, or pointer-only interaction.
- Search, Filters, tables, row details, dialogs, file import, and pagination have logical keyboard focus and programmatic names.
- Long names, translated labels, 200% zoom, mobile reflow, text enlargement, and screen-reader announcements are tested.
- Sensitive values remain understandable when masked, and the reveal action has an accessible name and deliberate activation.

## AI Behavior

The AI Assistant may summarize an authorized Student record, explain trends, or draft non-authoritative content. It must label generated content, name source records and date scope, show uncertainty and missing data, and offer edit, reject, retry, report, and disable paths. It must not infer sensitive traits, rank Students without approved purpose, alter a Student, assign a Teacher, send a Notification, or change a Permission without explicit authorized human review.

## Security

Student data is Organization- and Role-scoped. Enforce authorization at collection, record, related-module, cache, import, export, Notification, and AI boundaries. Minimize personal and coaching data, mask sensitive values, protect files, avoid identifiers in URLs or logs where not required, and record access and consequential changes according to [SECURITY_UX.md](../SECURITY_UX.md) and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Keep Search input responsive, cancel obsolete queries, preserve result structure while loading, paginate large collections, and avoid fetching unrelated sensitive detail in the collection. Measure collection time-to-useful-result, Search, Filter, detail, save, import, export, and related-module navigation under the shared engineering performance owner.

## Acceptance Criteria

- [ ] Authorized users can find the correct Student within explicit Organization, Workspace, and Filter scope.
- [ ] Student detail leads with identity and status, then shows only authorized related context.
- [ ] Create, update, archive, restore, merge, import, and export actions have explicit permissions and review where consequential.
- [ ] Duplicate, validation, conflict, partial, unauthorized, stale, and service failure paths preserve safe input and intent.
- [ ] Students uses the approved component contracts and canonical vocabulary.
- [ ] Notifications, AI Assistant behavior, audit, retention, and privacy are defined without duplicating their owning standards.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, and reduced-motion evidence is available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Student scope, objects, Roles, Permissions, relationships, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, table/list, detail, forms, import, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: state transitions, validation, duplicate prevention, conflict, partial work, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, data minimization, direct access, cache, file, Notification, AI, audit, and retention evidence.
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