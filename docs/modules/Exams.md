---
title: EduTrack Exams Module
purpose: Define authorized Exam setup, scheduling, participation, mark entry, review, publication, correction, and result access.
scope: Exam definitions, Academic Session and Subject context, schedules, participant rosters, mark entry, grading rules, review, publication, corrections, result views, imports, exports, and related Students, Teachers, Classes, Reports, Notifications, and Dashboard workflows.
audience: Product, Design, Engineering, Security, Privacy, Data, QA, Accessibility, Operations, and reviewers.
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
review_frequency: Quarterly and after an Exam, grading, publication, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, Data, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Exams, Exam, Student, Teacher, Class, Subject, Academic Session, Organization, Workspace, Results, Role, Permission, Search, Filters, Notifications, AI Assistant
---

# Exams

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Exams is the authorized workspace for defining assessments, scheduling participation, entering and reviewing marks, publishing results, and providing Students and Teachers with trustworthy result context. It separates draft work from published outcomes and makes high-impact publication and correction actions deliberate, auditable, and recoverable.

The module applies the shared rules in [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [STATE_SYSTEM.md](../STATE_SYSTEM.md).

## Scope

### Included

- Exam identity, purpose, type, Academic Session, Class, Subject, schedule, duration or slot, grading rule, and status.
- Authorized participant roster, attendance or participation context, mark entry, moderation, review, publication, correction, import, export, and result access.
- Draft, scheduled, in-progress, submitted, under review, published, corrected, cancelled, and archived behavior where approved.
- Student result detail, scoped summaries, comparisons, freshness, source, limitations, and links to Reports, Dashboard, Notifications, Students, Teachers, Classes, Subjects, Attendance, and Academic Sessions.

### Excluded

- Student identity, Class membership, Subject catalog, Attendance, Routine, Academic Session, or Teacher assignment as a source of truth.
- Automatic ranking, progression, discipline, financial, employment, or safety decisions from marks.
- Publishing results from an AI Assistant, silently changing a published result, or revealing unpublished results to an unauthorized Role.
- Treating a draft, imported value, or generated analysis as a published result.

## Users & Roles

| Role | Exam responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Support authorized aggregate or incident review. | Explicitly authorized Organization scope; minimize individual results. |
| Organization administrator | Configure Exams, assign review or publication responsibility, import, export, and govern result access. | Active Organization and authorized Workspace, Academic Session, Class, and Subject scope. |
| Teacher | Prepare permitted Exam work, enter or review marks, and view assigned results. | Assigned Class, Subject, Exam, and Student scope. |
| Student | View own published results and permitted feedback or correction path. | Own published results and shared context only. |
| Future authorized Role | Use only approved Exam actions and scope. | Explicit scope and deny-by-default. |

## Business Rules

1. Exams is the canonical destination; use “publish results” for the consequential action and keep draft results distinct from published results.
2. Every Exam identifies Organization, Workspace, Academic Session, Class, Subject, participant scope, schedule or slot, grading rule, owner, status, and freshness.
3. An Exam may reference Students, Teachers, Classes, Subjects, Attendance, Routine, Reports, and Notifications but does not replace their source records.
4. Participant eligibility is resolved from authorized Class, Subject, Academic Session, and enrollment context. A client cannot add an out-of-scope Student.
5. Mark entry validates field-level values and cross-field totals against the approved grading rule before review or publication.
6. Absent, excused, not submitted, pending, withheld, and zero are distinct states when the approved grading policy supports them; the module must not collapse them into a numeric value.
7. Publication is a consequential, reviewable transition. It identifies Exam, scope, result count, unresolved warnings, actor, effective time, Notifications, audit, and recovery before commit.
8. Published results are not silently overwritten. Corrections use an explicit correction or republish workflow with history, reason, approval, and affected audience.
9. Imports and bulk edits provide row-level validation, staged review, partial results, idempotency, and recovery; they do not imply publication.
10. Analytics and AI explanations identify source, cohort, period, denominator, missing data, and generated status. They do not rank Students or Teachers without approved purpose.

## User Journeys

### Organization administrator: set up an Exam

1. Open Exams and confirm Organization, Workspace, Academic Session, Class, Subject, participants, and proposed schedule.
2. Define assessment metadata and grading rule with required, optional, and sensitive fields clear.
3. Review participant eligibility, conflicts with Routine or other Exams, access, and downstream effects.
4. Save as draft or submit for the approved review path.
5. Confirm the Exam status, owner, effective scope, and next action.

### Teacher: enter and submit marks

1. Open the assigned Exam and confirm Class, Subject, Academic Session, participant roster, and grading rule.
2. Enter marks using the approved Data Grid or record form, preserving safe staged values.
3. Resolve invalid totals, missing values, participation states, and conflicts.
4. Review change count, unresolved rows, result status, and submission effect.
5. Submit for review and verify pending, partial, success, or recovery state.

### Authorized reviewer: publish results

1. Open the Exam review surface and confirm the exact scope, version, participant count, grading rule, and freshness.
2. Inspect unresolved warnings, missing or exceptional statuses, audit history, and Notifications.
3. Review the publication consequence, actor, audience, effective time, and recovery path.
4. Confirm publication deliberately.
5. Verify published status, affected result views, and named follow-up action.

### Student: review a published result

1. Open Exams and confirm own Student, Organization, Workspace, Academic Session, Class, and Subject context.
2. Review only published results, grading meaning, source, date, and freshness.
3. Open approved feedback or correction information without exposing another Student’s result.
4. Return to the source Exam or Dashboard with context preserved.

## Information Architecture

### Exam collection

Page identity and Organization/Workspace scope → Academic Session, Class, Subject, date, status, and freshness → Exam identity and owner → participant/result status → permitted action.

### Exam detail

Exam identity and status → Academic Session, Class, Subject, schedule, grading rule, and participant scope → setup or mark-entry work → review/publication state → history, Notifications, and related records.

### Result detail

Student and Exam identity → published status and grading context → exact values and interpretation → feedback, source, freshness, correction path, and authorized history.

Do not place unpublished marks, private moderation notes, or Permission controls in a Student-facing result view.

## Navigation Flow

`Sidebar > Exams` opens the scoped Exam collection. From Exams:

- Exam row or Search result → Exam detail;
- Exam detail → participant roster, mark entry, review, publication, or result view;
- Exam → Students, Teachers, Classes, Subjects, Attendance, Routine, Academic Sessions, Reports, Notifications, or Dashboard with scope preserved;
- setup, mark entry, import, correction, or publication → review → confirmation → status result or preserved list scope;
- Dashboard or Report drill-down → Exams with originating Organization, Workspace, Academic Session, Class, Subject, date, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Unauthorized deep links fail closed without confirming a protected Exam, Student, or unpublished result. Mobile preserves Exam identity, status, primary action, and recovery.

## Screen Specifications

### Exams collection

- Named Search and Filters identify the Exam dataset and active Organization, Workspace, Academic Session, Class, Subject, Teacher, date, and status.
- Result count, freshness, publication state, participant/result completeness, and clear/reset behavior are visible.
- Each row names Exam, Class, Subject, Academic Session, schedule, status, owner, and permitted action.

### Exam setup and schedule

- Persistent labels state purpose, affected object, required/optional data, grading rule, visibility, and validation timing.
- Date and time controls are constrained to the Academic Session and valid slot; conflicts are shown before save.
- Draft, review, cancel, conflict, pending, and recovery behavior is explicit.

### Mark entry and review

- Data Grid or form identifies participant row, mark unit, grading rule, participation state, source, and unsaved status.
- Keyboard entry, cross-row validation, staged commit, partial result, row-level recovery, and review count are supported.
- Review distinguishes draft, submitted, under review, published, corrected, and cancelled states.

### Results and publication

- Student result view shows only the authorized publication version and explains grading context.
- Publication review repeats Exam, scope, values, participant count, warnings, actor, audience, effective time, Notifications, audit, and recovery.
- Published and unpublished results are not visually or semantically interchangeable.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Date Picker](../components/Date%20Picker.md), [Time Picker](../components/Time%20Picker.md), [Text Field](../components/Text%20Field.md), [Textarea](../components/Textarea.md), and [File Upload](../components/File%20Upload.md).
- [Data Grid](../components/Data%20Grid.md) for approved mark entry, [Table](../components/Table.md), [List](../components/List.md), [Calendar](../components/Calendar.md), [Timeline](../components/Timeline.md), and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Exams search/list, structured data, bulk operation, temporal input, consequential confirmation, draft, reviewable AI, empty, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Exam, create, edit, schedule, enter marks, submit, review, publish, correct, import, export, view unpublished results, and administer are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Academic Session, Class, Subject, Exam, Student, Teacher, and Role.
- Mark entry and publication use separation of duties where policy requires it; a user must not gain publication authority merely by entering marks.
- Student access is limited to own published results and approved feedback or correction routes.
- Authorization is rechecked for collection queries, participant resolution, direct links, caches, imports, exports, publication, Notifications, and AI context.
- Permission denial does not reveal an Exam, unpublished result, participant, or mark.

## Validation Rules

- Exam identity, Organization, Workspace, Academic Session, Class, Subject, participant scope, schedule, grading rule, and owner are valid before setup advances.
- Schedule must be compatible with Academic Session, Routine, valid time constraints, and conflict policy.
- Marks validate type, unit, range, total, grading rule, participant state, duplicate row, and version.
- Publication requires complete review of unresolved warnings, participant count, values, audience, actor, effective time, and recovery.
- Correction and republish validate reason, approval, affected audience, history, and Notification behavior.
- Import rows validate identity, scope, Exam version, grading rule, duplicate, and authorization server-side.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish Organization, Workspace, Academic Session, Class, Subject, and Role scope.
- `loading`: preserve Search, Filters, Exam structure, staged marks, and safe input.
- `ready`: show Exam status, version, freshness, participant count, grading rule, and permitted actions.
- `empty`: distinguish no Exams, no participants, no marks, no matching Filters, no published results, no access, and unavailable service.
- `partial`: identify completed and missing setup, mark, import, review, or publication regions.
- `stale`: expose version, source freshness, and conflict review before mark or publication commit.
- `pending`: name the submitted or publication action without implying final results.
- `success`: name Exam, version, affected scope, result state, and next action.
- `error`: preserve safe marks and form input; distinguish validation, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: state the permitted support or request path without protected-data disclosure.

## Notifications

Exam Notifications may communicate schedule changes, mark review, publication, correction, or required action. Delivery, preferences, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Publication Notifications identify Exam, scope, version, effective time, and action without exposing unrelated results or creating artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Exam identity, participant row, mark unit, grading rule, publication status, warning, validation, and result meaning are available textually and semantically.
- Data Grid keyboard navigation, cell announcements, cross-row validation, staged changes, focus recovery, and partial failures are tested.
- Date/time inputs, Search, Filters, tables, dialogs, charts, result alternatives, and publication review are keyboard complete.
- 200% zoom, 320 CSS pixel reflow, long names, translated numbers and dates, screen readers, touch, and reduced motion are tested.
- Result status, warnings, and publication state never rely on color, position, animation, or hover alone.

## AI Behavior

The AI Assistant may summarize authorized Exam results or draft a non-authoritative explanation. It must identify source Exam, Academic Session, Class, Subject, Student or cohort scope, period, freshness, missing data, uncertainty, generated status, and human review controls. It must not assign marks, change grading rules, rank people without approved purpose, publish or correct results, send consequential Notifications, change Permissions, or present generated analysis as an official result.

## Security

Exam setup, marks, moderation, unpublished results, publication versions, exports, caches, Notifications, deep links, and AI context are Organization-, Workspace-, Academic Session-, Class-, Subject-, Student-, and Role-scoped. Enforce authorization and integrity at the service/data boundary, protect result files, minimize private moderation data, avoid result leakage through URLs or logs, and audit setup, mark entry, review, publication, correction, import, and export under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Exam identity, status, scope, and participant context before secondary analytics; keep mark entry responsive; paginate large result views; cancel obsolete Search and Filter requests; preserve stable grid layout; and acknowledge staged, import, and publication work. Measure collection, setup, participant load, mark entry, review, publication, correction, import, export, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can find and understand an Exam within explicit Organization, Workspace, Academic Session, Class, Subject, participant, and Role scope.
- [ ] Mark entry validates values and totals, preserves staged work, and exposes partial, conflict, pending, and recovery states.
- [ ] Publication is a deliberate, permission-checked, auditable, reviewable transition that separates draft and published results.
- [ ] Students see only authorized published results and cannot infer other Students’ results through Search, totals, exports, Notifications, or AI.
- [ ] Corrections, imports, exports, Analytics, and AI behavior identify source, scope, version, actor, consequence, and recovery.
- [ ] Approved components, canonical vocabulary, accessibility, privacy, security, mobile, performance, and quality evidence are available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Exam, result, participant, grading rule, publication version, Roles, Permissions, Organization, Workspace, Academic Session, Class, Subject, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, Data Grid, tables, Calendar, Timeline, mark entry, review, publication, import, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, totals, duplicate prevention, version conflict, partial completion, retry, rollback, correction, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, unpublished-result isolation, direct access, cache, file, Notification, AI, audit, retention, and export evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, and reduced-motion evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md)
- [DATA_VISUALIZATION_GUIDE.md](../DATA_VISUALIZATION_GUIDE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)