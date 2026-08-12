---
title: EduTrack Classes Module
purpose: Define authorized Class creation, structure, membership, assignment, review, lifecycle, and operational scope.
scope: Class identity, Organization and Workspace scope, Academic Session, program, batch, Subject offerings, Student membership, Teacher assignment, Routine, Attendance, Exams, Reports, Notifications, and structural change review.
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
  - ../NOTIFICATION_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Class, membership, assignment, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Classes, Class, Organization, Workspace, Academic Session, program, batch, Subject, Students, Teachers, Routine, Attendance, Exams, Reports, Role, Permission, Search, Filters, Notifications, AI Assistant
---

# Classes

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Classes is the authorized workspace for defining an instructional grouping, its effective scope, its Student membership, its Subject offerings, and its Teacher assignments. It helps Organization administrators and Teachers coordinate a trustworthy roster while preserving the source boundaries between Class structure, Student identity, Teacher identity, Subjects, Routine, Attendance, and Exams.

The module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md).

## Scope

### Included

- Class identity, code or supporting identifier, Organization, Workspace, program, batch, Academic Session, status, owner, and effective dates.
- Authorized Student membership, Teacher assignment, Subject offering, Class capacity or policy context, and structural review.
- Class roster, member history, assignment history, and related links to Routine, Attendance, Exams, Reports, Notifications, Dashboard, Students, Teachers, Subjects, and Academic Sessions.
- Create, update, archive, restore, merge or split review, import, export, and lifecycle behavior when approved.

### Excluded

- Student or Teacher identity, Subject catalog, Routine, Attendance, Exam, or Academic Session records as a source of truth.
- Silent enrollment, removal, Teacher reassignment, or structural changes that alter historical Attendance or Exam context.
- Inferring Student ability, Teacher quality, capacity suitability, or progression from Class membership or activity.
- Revealing protected membership, assignment, or Class existence to an unauthorized user.

## Users & Roles

| Role | Class responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate Class or Organization operations. | Explicitly authorized Organization scope; minimize individual membership data. |
| Organization administrator | Create, configure, assign, enroll, review, archive, restore, import, and export Classes. | Active Organization and authorized Workspace, program, batch, Academic Session, and Subject scope. |
| Teacher | Review assigned Classes, permitted rosters, Subjects, Routine, Attendance, and Exams. | Assigned Class, Subject, Academic Session, and Student scope. |
| Student | View own Class and explicitly shared membership, Subject, Teacher, and schedule context. | Own membership and shared context only. |
| Future authorized Role | Use only the Class actions declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Class is the canonical singular term and Classes is the canonical destination; use batch or program only for the distinct higher-level scope they represent.
2. Every Class view identifies Organization, Workspace, program or batch where applicable, Academic Session, status, effective dates, and current scope.
3. A Class is a grouping and relationship source; it does not become the source of truth for Student identity, Teacher identity, Subject definition, Routine occurrence, Attendance, or Exam results.
4. Student membership and Teacher assignment have effective dates, actor, source, status, and history. Removal or reassignment does not silently rewrite historical records.
5. Subject offerings belong to an active Organization or Workspace and are valid for the selected Class and Academic Session.
6. Structural changes review affected Students, Teachers, Subjects, Routine, Attendance, Exams, Reports, Notifications, and Permissions before commit.
7. Duplicate Class identity, overlapping effective membership, conflicting assignment, and incompatible Academic Session require review rather than silent replacement.
8. Imports validate each row, preserve accepted and rejected results, and do not broaden Organization, Workspace, Academic Session, or Class scope.
9. Class summaries state roster scope, freshness, source, and limitations; they must not rank Students or Teachers or imply outcomes.
10. AI Assistant content about Classes is generated, permission-scoped, and reviewable; it cannot enroll, remove, assign, or mutate a Class without explicit authorized action.

## User Journeys

### Organization administrator: create a Class

1. Open Classes and confirm Organization, Workspace, program or batch, and Academic Session.
2. Enter Class identity, status, effective dates, and permitted configuration.
3. Add approved Subject offerings and review Teacher, Student, Routine, Attendance, and Exam implications.
4. Save as draft or commit after consequence review.
5. Confirm the Class, scope, status, audit entry, and next action.

### Organization administrator: manage membership

1. Open the Class roster and confirm current Class, Academic Session, and effective date.
2. Search or select authorized Students and review possible duplicates, current membership, and affected records.
3. Review additions, removals, effective dates, visibility, and downstream impact.
4. Confirm the change and verify pending, success, partial, conflict, or recovery state.
5. Return to the roster with Search, Filters, and safe context preserved.

### Teacher: review an assigned Class

1. Open Classes or Dashboard and confirm own Teacher, Organization, Workspace, Academic Session, and assigned scope.
2. Review Class identity, Subjects, Students, Routine, Attendance, and Exams.
3. Open a related workflow without losing the Class and date context.
4. Complete only permitted actions and verify the durable result or recovery path.

### Organization administrator: archive or restore a Class

1. Review Class history, current membership, assignments, future Routine, Attendance, Exams, Reports, and retention implications.
2. Confirm the exact Class, Organization, Academic Session, actor, reason, and recovery path.
3. Commit the authorized lifecycle change.
4. Verify status, related access, Notifications, and audit result.

## Information Architecture

### Classes collection

Page identity and Organization/Workspace scope → Academic Session, program, batch, status, and freshness → Class identity and Subject summary → roster and Teacher summary → permitted actions.

### Class detail

Class identity and status → Organization, Workspace, program, batch, and Academic Session → Subject offerings and Teacher assignments → Student roster → Routine, Attendance, Exams, Reports, Notifications, history, and audit.

### Class roster

Roster scope and effective date → Student identity and membership status → enrollment or assignment context → related operational status → permitted membership action.

Do not place private Student Profile data, unrelated Fee values, or Permission administration into the Class roster merely because they are stored in related records.

## Navigation Flow

`Sidebar > Organization > Classes` opens the authorized Class collection. From Classes:

- Class row or Search result → Class detail;
- Class detail → roster, Subjects, Teachers, Routine, Attendance, Exams, Reports, Notifications, or Academic Sessions when authorized;
- create, update, enroll, remove, assign, import, archive, restore, merge, or split → review → confirmation → Class detail or preserved collection scope;
- Dashboard or related module → Classes with originating Organization, Workspace, Academic Session, program, batch, Subject, date, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected Class or membership existence. Mobile preserves Class identity, scope, roster status, primary action, and recovery.

## Screen Specifications

### Classes collection

- Named Search and Filters identify the Class dataset and active Organization, Workspace, program, batch, Academic Session, Subject, Teacher, and status scope.
- Result count, freshness, membership status, and clear/reset behavior are visible.
- Each row identifies Class, Academic Session, Subject summary, Teacher summary, roster count, status, and permitted action.

### Class detail

- Class identity, status, Organization/Workspace, program or batch, Academic Session, and effective dates lead the page.
- Subject offerings, Teacher assignments, and Student membership are separate views with visible scope.
- Related Routine, Attendance, Exams, Reports, and Notifications preserve Class context.
- History and audit are separate from editable identity and membership fields.

### Roster and assignment review

- Student and Teacher identity, role, membership or assignment state, effective date, source, and consequence are explicit.
- Bulk changes show selected count, scope, affected records, review, progress, partial result, and recovery.
- Conflicts, duplicate signals, pending changes, and unauthorized rows are distinguishable.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Autocomplete](../components/Autocomplete.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Table](../components/Table.md), [List](../components/List.md), [Data Grid](../components/Data%20Grid.md) only for approved multi-row membership editing, and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), [Menu](../components/Menu.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Classes search/list, record detail, roster, bulk operation, consequential confirmation, draft, empty, reviewable AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Class, create, edit, manage membership, assign Teacher, manage Subjects, import, export, archive, restore, merge, split, view history, and administer are separate capabilities.
- Capabilities are scoped by Organization, Workspace, program, batch, Class, Academic Session, Subject, Student, Teacher, and Role.
- Membership and assignment changes require explicit capability, consequence review, and audit.
- Teachers can act only within assigned Class and Subject scope; Students see only own and shared Class context.
- Authorization is rechecked for collection queries, rosters, direct links, cached records, imports, exports, related-module navigation, Notifications, and AI context.
- Permission denial does not reveal a protected Class, Student, Teacher, or membership.

## Validation Rules

- Class identity, Organization, Workspace, program or batch, Academic Session, status, effective dates, and owner are valid before save.
- Subject offerings and Teacher assignments must belong to the active Organization or Workspace and be compatible with Class and Academic Session.
- Student membership validates identity, duplicate signals, eligibility, effective dates, overlapping membership, and downstream impact.
- Structural changes validate affected Routine, Attendance, Exams, Reports, Notifications, Permissions, retention, and recovery before commit.
- Archive, restore, merge, split, import, and export require review of object, scope, effect, actor, audit, and recovery.
- Search and Filters are valid for the Role and cannot broaden inaccessible Class or membership data.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish Organization, Workspace, Academic Session, and authorized Class scope before querying.
- `loading`: preserve Search, Filters, roster structure, effective date, and safe staged changes.
- `ready`: show Class identity, status, scope, freshness, membership, assignments, and permitted actions.
- `empty`: distinguish no Classes, no roster, no Subjects, no Teachers, no matching Filters, no access, and unavailable service.
- `partial`: identify completed and failed membership, assignment, import, or structural changes.
- `stale`: expose roster or configuration freshness and require conflict review before consequential changes.
- `pending`: name the Class action accepted but not final.
- `success`: name Class, affected members or assignments, effective date, status, and next action.
- `error`: preserve safe input and query context; distinguish validation, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: communicate capability boundaries without protected-data disclosure.

## Notifications

Class Notifications may communicate membership, assignment, schedule, Attendance, Exam, or structural changes. Delivery, preferences, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify Class, scope, effective time, consequence, and action without exposing unrelated Student or Teacher data.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Class identity, Academic Session, membership, assignment, effective date, scope, action consequence, and status are available in text and semantics.
- Search, Filters, tables, roster selection, bulk review, dialogs, and pagination are keyboard complete with visible focus and stable announcements.
- Long Class names, long Student and Teacher names, dense rosters, translated labels, 200% zoom, mobile reflow, screen readers, and reduced motion are tested.
- Membership and assignment states never rely on color, position, hover, or icon alone.

## AI Behavior

The AI Assistant may summarize authorized Class membership or operational context and draft a reviewable explanation. It must identify source scope, Academic Session, date, freshness, generated status, uncertainty, missing data, and human review. It must not infer Student ability or Teacher quality, enroll or remove Students, assign Teachers, change Subjects, alter Permissions, send consequential Notifications, or mutate Class records without explicit authorized action.

## Security

Class identity, membership, assignments, Subjects, Routine, Attendance, Exams, Reports, Notifications, exports, caches, and AI context are Organization- and Workspace-scoped, with Academic Session, program, batch, Class, Subject, Student, Teacher, and Role boundaries. Enforce isolation at every request and data boundary, protect exports and files, avoid enumeration, and audit membership, assignment, structural, import, export, archive, restore, merge, and split actions under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Class identity, active scope, and roster status before secondary history, paginate large rosters, cancel obsolete Search and Filter requests, preserve stable list structure, and acknowledge bulk or slow structural work. Measure Class collection, detail, roster, assignment, membership change, import, export, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can find and understand a Class within explicit Organization, Workspace, program, batch, Academic Session, Subject, and Role scope.
- [ ] Class detail separates identity, Subjects, Teachers, Student membership, Routine, Attendance, Exams, Reports, and Permissions.
- [ ] Membership, assignment, structural, archive, restore, import, export, merge, and split paths state scope, consequence, actor, audit, and recovery.
- [ ] Historical Attendance and Exam context is preserved when membership or assignment changes.
- [ ] Empty, partial, stale, pending, unauthorized, conflict, validation, and service failure states are explicit and recoverable.
- [ ] Approved components, canonical vocabulary, accessibility, privacy, AI, Notification, retention, performance, and quality evidence are available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Class, membership, assignment, Subject, Academic Session, program, batch, Students, Teachers, Roles, Permissions, Organization, Workspace, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, tables, roster, bulk action, forms, review, import, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, duplicate prevention, effective dates, conflict, partial completion, retry, rollback, archive, restore, merge, split, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, file, Notification, AI, audit, retention, export, and historical-integrity evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, and reduced-motion evidence.
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
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)