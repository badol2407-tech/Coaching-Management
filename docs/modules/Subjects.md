---
title: EduTrack Subjects Module
purpose: Define authorized Subject catalog, offering, scope, ownership, lifecycle, and relationships to instructional work.
scope: Subject definitions and offerings, Organization and Workspace scope, Classes, Teachers, Academic Sessions, Routine, Attendance, Exams, Reports, Notifications, Search, Filters, and lifecycle administration.
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
review_frequency: Quarterly and after a Subject, curriculum, Class, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Subjects, Subject, Organization, Workspace, Academic Session, Classes, Teachers, Students, Routine, Attendance, Exams, Reports, Role, Permission, Search, Filters, Notifications, AI Assistant
---

# Subjects

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Subjects is the governed catalog and offering workspace for instructional subjects used by Classes, Teachers, Routine, Attendance, Exams, and Reports. It keeps the reusable Subject definition distinct from its Organization or Workspace offering, effective Academic Session, Class relationship, and operational status.

The module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md).

## Scope

### Included

- Subject identity, name, supporting code, description, status, owner, and approved metadata.
- Organization and Workspace Subject offerings, Academic Session validity, Class relationships, Teacher assignment, and effective dates.
- Subject Search, Filters, detail, lifecycle, import, export, archive, restore, and impact review.
- Authorized links to Classes, Students, Teachers, Routine, Attendance, Exams, Reports, Notifications, Dashboard, and Academic Sessions.

### Excluded

- Student or Teacher identity, Class membership, Routine occurrence, Attendance, Exam, Report, or Academic Session records as a source of truth.
- Inferring Student ability, Teacher quality, curriculum completion, or outcome from Subject membership or marks.
- Silent renaming, deletion, reassignment, or archival that changes historical records without a governed migration or review.
- Revealing protected Subject offerings, Class relationships, or Teacher assignments to an unauthorized user.

## Users & Roles

| Role | Subject responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate Subject or Organization operations. | Explicitly authorized Organization scope; minimize individual relationships. |
| Organization administrator | Create, configure, offer, assign, archive, restore, import, export, and review Subjects. | Active Organization and authorized Workspace, Academic Session, Class, and program scope. |
| Teacher | Review and use assigned Subjects for Classes, Routine, Attendance, Exams, and Reports. | Assigned Subject, Class, Academic Session, and Student scope. |
| Student | View Subjects associated with own Class and authorized learning context. | Own and explicitly shared Subject context. |
| Future authorized Role | Use only approved Subject actions and scope. | Explicit scope and deny-by-default. |

## Business Rules

1. Subject is the canonical singular term and Subjects is the canonical destination; do not use a Subject name as a substitute for a Class, offering, or Exam.
2. A Subject definition is separate from a Subject offering. An offering identifies Organization, Workspace, Academic Session, Class, status, effective dates, and permitted Teacher relationship.
3. Every Subject view identifies Organization or Workspace, current Academic Session where relevant, status, source, and freshness.
4. Subject names and codes use duplicate signals and governed merge or alias review; silent collisions are not permitted.
5. A Subject can be archived or inactive without rewriting historical Routine, Attendance, Exam, Report, or Notification records.
6. Subject offerings must be compatible with the active Class, Academic Session, Routine, Teacher assignment, and applicable grading or reporting context.
7. Removing or changing an offering reviews affected Classes, Students, Teachers, Routine, Attendance, Exams, Reports, Notifications, and Permissions before commit.
8. Imports validate each row, preserve original and partial results where policy allows, and cannot broaden Organization, Workspace, or Academic Session scope.
9. Subject summaries state scope, period, source, freshness, and limitations; they do not imply educational outcomes.
10. AI Assistant content may summarize authorized Subject usage or draft descriptive text but cannot rename, assign, archive, schedule, grade, or mutate Subject data without explicit review.

## User Journeys

### Organization administrator: create a Subject

1. Open Subjects and confirm Organization, Workspace, and intended catalog scope.
2. Enter Subject identity, code, description, status, and optional metadata with ownership and visibility clear.
3. Review duplicate signals and decide whether to create a definition or use an existing Subject.
4. Save and confirm the Subject identity, status, and next offering action.

### Organization administrator: offer a Subject to a Class

1. Open the Subject and select an authorized Workspace, Academic Session, and Class.
2. Review effective dates, Teacher assignment, Routine compatibility, Attendance, Exam, Report, and Notification implications.
3. Confirm the offering and any required approvals.
4. Verify the pending, success, conflict, partial, or error state and audit result.

### Teacher: review assigned Subjects

1. Open Subjects or Dashboard and confirm own Teacher, Organization, Workspace, Class, and Academic Session.
2. Review assigned Subjects, Routine, Attendance, Exams, and related Students.
3. Open a source workflow with Subject context preserved.
4. Complete only permitted actions and verify the durable outcome.

### Organization administrator: archive or restore a Subject

1. Review Subject history, current offerings, Classes, Teachers, Routine, Attendance, Exams, Reports, and retention implications.
2. Confirm scope, reason, actor, effective date, affected users, and recovery.
3. Commit the authorized lifecycle action.
4. Verify visibility, historical integrity, Notifications, and audit.

## Information Architecture

### Subjects collection

Page identity and Organization/Workspace scope → Search and Filters → result count and freshness → Subject identity and status → offering summary and effective Academic Session → permitted actions.

### Subject detail

Subject definition and status → Organization/Workspace and Academic Session offering context → Classes and Teachers → Routine, Attendance, Exams, Reports, Notifications → history, audit, and advanced actions.

### Subject offering

Subject identity → Class, Organization, Workspace, Academic Session, Teacher, effective dates, and status → operational links → change consequence and recovery.

Do not mix catalog metadata, private Teacher or Student Profile data, or Exam results into the Subject definition merely because they are related.

## Navigation Flow

`Sidebar > Organization > Subjects` opens the authorized Subject collection. From Subjects:

- Subject row or Search result → Subject detail;
- Subject detail → Class offerings, Teachers, Routine, Attendance, Exams, Reports, Notifications, or Academic Sessions when authorized;
- create, update, offer, assign, import, export, archive, or restore → review → confirmation → Subject detail or preserved list scope;
- Dashboard or related workflow → Subjects with originating Organization, Workspace, Academic Session, Class, Teacher, date, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected Subject, offering, Class, or Teacher existence. Mobile preserves Subject identity, offering scope, status, primary action, and recovery.

## Screen Specifications

### Subjects collection

- Named Search and Filters identify the Subject dataset and active Organization, Workspace, Academic Session, Class, Teacher, and status.
- Result count, freshness, offering count, no-result distinction, and clear/reset behavior are visible.
- Each row identifies Subject, code where approved, status, offering summary, Academic Session, and permitted action.

### Subject detail

- Subject definition, status, scope, owner, and freshness lead the page.
- Offerings, Classes, Teachers, and effective dates are separate from catalog metadata.
- Related Routine, Attendance, Exams, Reports, and Notifications preserve Subject and Academic Session context.
- History and audit are separated from editable identity fields.

### Subject offering and lifecycle

- Offering form states Organization, Workspace, Academic Session, Class, Teacher, effective dates, visibility, required/optional fields, and validation.
- Archive, restore, rename, merge, assignment, import, export, and structural changes use consequence review.
- Pending, conflict, partial, success, and recovery behavior is visible.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Autocomplete](../components/Autocomplete.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Table](../components/Table.md), [List](../components/List.md), [Pagination](../components/Pagination.md), and [Timeline](../components/Timeline.md) for approved history or offering context.
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), [Menu](../components/Menu.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Subjects search/list, record detail, field composition, structured data, consequential confirmation, draft, empty, reviewable AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Subject, create, edit, offer, assign Teacher, import, export, archive, restore, merge, view history, and administer are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Academic Session, Class, Subject, Teacher, Student, and Role.
- Offering, assignment, archive, restore, merge, import, export, and sensitive metadata changes require deliberate review and audit.
- Teachers can act only within assigned Subject and Class scope; Students see only own and shared Subject context.
- Authorization is rechecked for collections, offerings, direct links, caches, imports, exports, related-module navigation, Notifications, and AI context.
- Permission denial does not reveal protected Subject, offering, Class, Teacher, or Student relationships.

## Validation Rules

- Subject identity, code, owner, Organization, Workspace, status, and effective dates use explicit formats, ownership, and duplicate signals.
- Offering targets must belong to the active Organization or Workspace and be compatible with Academic Session, Class, Teacher assignment, and effective dates.
- Rename, merge, archive, restore, import, export, and assignment changes validate historical, Routine, Attendance, Exam, Report, Notification, retention, and recovery implications.
- Search and Filters are valid for the Role and cannot broaden inaccessible catalog or offering data.
- Sensitive or optional metadata is not required solely for completeness or AI convenience.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish Organization, Workspace, and intended catalog or offering scope.
- `loading`: preserve Search, Filters, list structure, form input, and selected Academic Session or Class.
- `ready`: show Subject identity, status, scope, freshness, offerings, and permitted actions.
- `empty`: distinguish no Subjects, no offerings, no matching Filters, no assigned Subjects, no access, and unavailable service.
- `partial`: identify completed and failed offering, assignment, import, archive, restore, or migration work.
- `stale`: expose catalog or offering freshness and provide refresh or conflict review.
- `pending`: name the accepted Subject or offering action without implying final completion.
- `success`: name Subject, offering, Class, Teacher, effective date, status, and next action.
- `error`: preserve safe input and query context; distinguish validation, duplicate, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: explain available capability or request path without protected-data disclosure.

## Notifications

Subject Notifications may communicate offering, assignment, schedule, archive, restore, or required review changes. Delivery, preferences, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify Subject, Class, Academic Session, effective time, consequence, and action without exposing unrelated personal data.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Subject identity, code, status, offering, Class, Teacher, Academic Session, scope, and action consequence are available in text and semantics.
- Search, Filters, tables, forms, dialogs, history, and pagination are keyboard complete with visible focus and stable announcements.
- Long Subject names, localized scripts, translated labels, 200% zoom, mobile reflow, screen readers, text enlargement, and reduced motion are tested.
- Catalog and offering state never relies on color, hover, position, or icon alone.

## AI Behavior

The AI Assistant may summarize authorized Subject offerings or draft a non-authoritative description. It must identify source scope, Academic Session, Class, Teacher relationship, freshness, generated status, uncertainty, missing data, and human review. It must not infer Student or Teacher outcomes, change catalog identity, assign a Teacher, create an offering, alter a Routine, publish an Exam, change Permissions, or mutate Subject data without explicit authorized action.

## Security

Subject definitions, offerings, Class relationships, Teacher assignments, Routine, Attendance, Exams, Reports, Notifications, exports, caches, and AI context are Organization- and Workspace-scoped, with Academic Session, Class, Subject, Student, Teacher, and Role boundaries. Enforce authorization at service and data boundaries, protect exports, avoid enumeration and hidden relationship disclosure, and audit catalog, offering, assignment, import, export, archive, restore, and merge actions under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Subject identity and active scope before secondary offerings or history, paginate large collections, cancel obsolete Search and Filter requests, preserve stable list structure, and acknowledge bulk or slow imports. Measure collection, detail, offering, assignment, import, export, archive, restore, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can find and understand a Subject definition or offering within explicit Organization, Workspace, Academic Session, Class, Teacher, and Role scope.
- [ ] Subject definition is separate from offering, Class, Teacher, Routine, Attendance, Exam, Report, and Permission data.
- [ ] Offering, assignment, archive, restore, merge, import, and export paths state scope, consequence, actor, audit, and recovery.
- [ ] Historical Routine, Attendance, Exam, and Report context remains understandable after Subject lifecycle changes.
- [ ] Empty, partial, stale, pending, unauthorized, duplicate, conflict, validation, and service failure states are explicit and recoverable.
- [ ] Approved components, canonical vocabulary, accessibility, privacy, AI, Notification, retention, performance, and quality evidence are available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Subject definitions, offerings, Classes, Teachers, Students, Academic Sessions, Roles, Permissions, Organization, Workspace, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, tables, forms, offering review, import, export, lifecycle, history, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, duplicate prevention, effective dates, conflict, partial completion, retry, rollback, archive, restore, merge, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, export, Notification, AI, audit, retention, relationship disclosure, and historical-integrity evidence.
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