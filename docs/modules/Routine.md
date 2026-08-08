---
title: EduTrack Routine Module
purpose: Define authorized recurring instructional schedules, session proposals, exceptions, conflicts, and calendar views.
scope: Routine entries, recurring patterns, date and time constraints, Organization and Workspace scope, Academic Sessions, Classes, Subjects, Teachers, schedule exceptions, conflicts, and relationships to Attendance, Exams, Notifications, and Dashboard.
audience: Product, Design, Engineering, Security, Privacy, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../FORM_DESIGN_GUIDE.md
  - ../NAVIGATION_STANDARDS.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../STATE_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../INTERNATIONALIZATION.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Routine, timezone, Academic Session, Class, Subject, Role, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, Operations, and QA
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Routine, Organization, Workspace, Academic Session, Class, Subject, Teacher, Students, Attendance, Exams, Notifications, Role, Permission, Search, Filters, AI Assistant
---

# Routine

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Routine is the governed schedule workspace for recurring instructional sessions and approved one-time exceptions. It helps authorized users understand what is planned for a Class, Subject, Teacher, and Academic Session, resolve conflicts, and communicate changes without treating a planned schedule as proof that teaching occurred or that Attendance should be marked automatically.

The module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md), and [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md).

## Scope

### Included

- Routine identity, recurring rule, date range, day, time, timezone, Organization, Workspace, Academic Session, Class, Subject, Teacher, location or approved delivery context, and status.
- Schedule exceptions, cancellations, substitutions, conflicts, effective dates, review, publication or communication, and history.
- Calendar, list, and detail views with links to Classes, Subjects, Teachers, Students, Attendance, Exams, Academic Sessions, Notifications, Reports, and Dashboard.
- Authorized create, update, copy, pause, cancel, import, export, and recovery workflows.

### Excluded

- Attendance records, Exam schedules, Class membership, Subject offerings, Teacher identity, or Academic Session records as a source of truth.
- Marking Attendance automatically because a Routine entry exists.
- Silent timezone conversion, schedule overwrite, conflict resolution, Teacher reassignment, or Class membership changes.
- Ranking Teachers, predicting Student outcomes, or making safety or employment decisions from schedule density.

## Users & Roles

| Role | Routine responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate schedule or support signals. | Explicitly authorized Organization scope; minimize personal detail. |
| Organization administrator | Configure, review, publish, change, cancel, import, export, and govern Routines. | Active Organization and authorized Workspace, Academic Session, Class, Subject, and Teacher scope. |
| Teacher | Review assigned Routine, report an exception, and use permitted operational links. | Assigned Class, Subject, Academic Session, and Student scope. |
| Student | View own Class and Subject schedule and approved changes. | Own and explicitly shared schedule context. |
| Future authorized Role | Use only approved Routine actions and scope. | Explicit scope and deny-by-default. |

## Business Rules

1. Routine is the canonical destination for planned recurring instructional schedule; use “session” for a specific scheduled occurrence or Attendance context.
2. Every Routine view identifies Organization, Workspace, Academic Session, Class, Subject, Teacher, local date/time, timezone, recurrence or occurrence, status, and freshness.
3. A Routine entry proposes or records planned work; it does not create Attendance, Exam, Class membership, or Teacher assignment source records.
4. Recurrence is bounded by explicit start and end dates, Academic Session, timezone, and applicable Class, Subject, and Teacher scope.
5. Exceptions such as cancellation, substitution, moved session, or one-time addition identify reason, actor, effective time, affected scope, Notifications, and recovery.
6. Conflicts are shown before commit and are not silently resolved. A conflict may be accepted only through the approved review and Permission path.
7. A Routine change reviews effects on Attendance, Exams, Classes, Subjects, Teachers, Students, Reports, Notifications, and downstream links without rewriting historical events.
8. Imported schedules provide row-level validation, duplicate detection, timezone clarity, partial results, and recovery.
9. “Today,” date ranges, weekdays, durations, and time zones follow [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md); the module does not create local date or time thresholds.
10. AI Assistant suggestions are generated and reviewable; they cannot publish, cancel, assign, or mutate a Routine without explicit authorized human action.

## User Journeys

### Organization administrator: create a Routine

1. Open Routine and confirm Organization, Workspace, Academic Session, Class, Subject, Teacher, timezone, and effective date range.
2. Define recurrence, local time, duration or slot, and approved delivery context.
3. Review conflicts, affected Students, Attendance, Exams, Notifications, and Permissions.
4. Save as draft or commit through the approved review path.
5. Confirm the Routine status, effective scope, next occurrence, and audit result.

### Organization administrator: change a scheduled occurrence

1. Open the Routine and choose the occurrence or recurrence scope.
2. Review current and proposed local date/time, timezone, Class, Subject, Teacher, reason, and affected users.
3. Resolve or explicitly review conflicts and downstream Attendance or Exam consequences.
4. Confirm the change and verify pending, success, partial, conflict, or recovery state.

### Teacher: report a schedule exception

1. Open the assigned Routine and confirm Class, Subject, Academic Session, local time, and current status.
2. Select the permitted exception type and provide the required reason or note.
3. Review who and what is affected, including Notifications and Attendance implications.
4. Submit and verify the status and authorized follow-up path.

### Student: review today’s Routine

1. Open Routine and confirm own Student, Organization, Workspace, Class, Subject, Academic Session, date, and timezone.
2. Review planned session identity, local time, status, and approved exception or change.
3. Open related Attendance or Exam context without treating the schedule as a completed event.

## Information Architecture

### Routine calendar

Page identity and local timezone → Organization/Workspace and Academic Session scope → date range and Filters → Class, Subject, Teacher, occurrence, and status → conflict or exception indication → permitted action.

### Routine detail

Routine identity and status → recurrence and effective dates → Class, Subject, Teacher, Academic Session, timezone, and delivery context → exceptions and history → related Attendance, Exams, Notifications, and audit.

### Schedule exception

Affected occurrence or recurrence → current and proposed values → reason, actor, scope, conflict, effect, Notifications, and recovery → confirmation and resulting state.

Do not present a planned Routine entry as Attendance, Exam completion, Teacher performance, or Student presence.

## Navigation Flow

`Sidebar > Organization > Routine` opens the authorized schedule workspace. From Routine:

- calendar or list entry → Routine detail;
- Routine detail → Class, Subject, Teacher, Students, Attendance, Exams, Academic Sessions, Reports, Notifications, or Dashboard with scope preserved;
- create, edit, copy, pause, cancel, substitute, import, export, or exception → review → confirmation → Routine result or preserved calendar scope;
- Dashboard or related module → Routine with originating Organization, Workspace, Academic Session, Class, Subject, Teacher, date, and timezone context;
- browser back or breadcrumb → previous safe list or calendar range.

Deep links recheck authorization and do not confirm protected Class, Teacher, Student, or schedule existence. Mobile preserves date, timezone, session identity, status, primary action, and recovery.

## Screen Specifications

### Routine calendar and list

- Named calendar or list identifies dataset, Organization, Workspace, Academic Session, local timezone, date range, and active Filters.
- Occurrences expose Class, Subject, Teacher, local date/time, status, exception, and permitted action without relying on color alone.
- Calendar has an accessible list alternative and preserves date range and scope through navigation.

### Routine detail

- Recurrence, effective date range, timezone, Class, Subject, Teacher, Academic Session, and status are visible before secondary metadata.
- Related Attendance and Exams links state that Routine is planned context, not proof of occurrence or completion.
- History, exceptions, and audit are separated from editable schedule fields.

### Routine edit and exception review

- Date, time, timezone, recurrence, scope, reason, and affected records use persistent labels and explicit validation.
- Review repeats occurrence or recurrence scope, current and proposed values, actor, effect, conflicts, Notifications, and recovery.
- Draft, save, cancel, conflict, pending, partial, and failure behavior is visible.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), [Tabs](../components/Tabs.md), and [Bottom Navigation](../components/Bottom%20Navigation.md).
- [Calendar](../components/Calendar.md), [Date Picker](../components/Date%20Picker.md), [Time Picker](../components/Time%20Picker.md), [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Table](../components/Table.md), [List](../components/List.md), [Timeline](../components/Timeline.md), and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), [Menu](../components/Menu.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Routine schedule, temporal input, search/filter, record detail, consequential confirmation, draft, empty, reviewable AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Routine, create, edit, copy, pause, cancel, substitute, publish, import, export, resolve conflict, view history, and administer are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Academic Session, Class, Subject, Teacher, Student, occurrence or recurrence, and Role.
- Schedule changes, exceptions, conflict acceptance, cancellation, substitution, import, and export require explicit capability and consequence review.
- Teacher access is limited to assigned scope; Student access is limited to own and shared schedule context.
- Authorization is rechecked for calendar queries, list views, direct links, caches, imports, exports, Notifications, related-module navigation, and AI context.
- Permission denial does not reveal protected schedule, Class, Teacher, or Student existence.

## Validation Rules

- Organization, Workspace, Academic Session, Class, Subject, Teacher, date range, local time, timezone, recurrence, and status must be valid before save.
- Recurrence and occurrence values must be compatible with Academic Session boundaries, valid local date/time, and approved schedule rules.
- Changes validate overlap, duplicate occurrence, conflict, effective scope, exception reason, Notification impact, and downstream Attendance or Exam implications.
- Copy, pause, cancel, substitute, import, export, and delete or archive actions require review of exact recurrence or occurrence scope and recovery.
- Search and Filters are valid for the Role and cannot broaden inaccessible schedule data.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish Organization, Workspace, Academic Session, date range, and timezone before loading schedule.
- `loading`: preserve calendar range, Filters, timezone, list alternative, and safe staged changes.
- `ready`: show Routine identity, local time, scope, status, freshness, conflicts, and permitted actions.
- `empty`: distinguish no schedule, no sessions in range, no matching Filters, no assigned schedule, no access, and unavailable service.
- `partial`: identify loaded date ranges, saved and failed occurrences, accepted and rejected imports, or incomplete Notifications.
- `stale`: expose schedule freshness, timezone context, and refresh or conflict review.
- `pending`: name the schedule or exception action accepted but not final.
- `success`: name occurrence or recurrence, scope, local time, status, affected audience, and next action.
- `error`: preserve safe input and calendar context; distinguish validation, conflict, authorization, network, timezone, and service failure.
- `unauthorized` and `disabled`: communicate capability boundaries without protected-data disclosure.

## Notifications

Routine Notifications may communicate schedule creation, change, cancellation, substitution, conflict, or required review. Delivery, preferences, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify local time, timezone, Class, Subject, effective occurrence, consequence, and action without exposing unrelated personal data or creating artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md):

- Routine identity, local date/time, timezone, recurrence, Class, Subject, Teacher, status, conflict, and exception are available in text and semantics.
- Calendar has keyboard navigation, programmatic date labels, today distinction without color alone, list alternative, focus recovery, and screen-reader announcements.
- Date/time fields support direct keyboard entry, localized formatting, clear constraints, validation, and nonvisual error recovery.
- Long names, timezones, translated dates, 200% zoom, 320 CSS pixel reflow, mobile, touch, and reduced motion are tested.

## AI Behavior

The AI Assistant may summarize authorized schedule load or draft a proposed schedule explanation. It must identify source scope, date range, timezone, Academic Session, generated status, uncertainty, missing data, and human review. It must not infer Teacher quality or Student outcomes, silently resolve conflicts, schedule or cancel sessions, change Teacher assignments, mark Attendance, publish Exams, send consequential Notifications, or mutate Routine data without explicit authorized action.

## Security

Routine entries, exceptions, conflicts, Class and Subject relationships, Teacher assignments, Attendance links, Exam links, Notifications, exports, caches, and AI context are Organization-, Workspace-, Academic Session-, Class-, Subject-, Teacher-, Student-, and Role-scoped. Enforce authorization and timezone-safe handling at the service/data boundary, protect exports, avoid enumeration, and audit create, change, cancel, substitute, conflict, import, export, and publication actions under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load page identity, timezone, scope, and the requested date range before secondary history; keep calendar navigation responsive; paginate or window large occurrence lists; cancel obsolete range and Filter requests; preserve stable calendar and list structure; and acknowledge recurrence expansion or import work. Measure calendar open, range navigation, detail, edit, conflict review, import, export, Notifications, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can understand Routine entries within explicit Organization, Workspace, Academic Session, Class, Subject, Teacher, date, timezone, and Role scope.
- [ ] Recurring schedule, one-time occurrence, exception, cancellation, substitution, conflict, and history are distinct and recoverable.
- [ ] Routine is clearly separated from Attendance, Exams, Class membership, Subject offering, and Teacher assignment source records.
- [ ] Consequential schedule changes state scope, local time, timezone, actor, effect, Notifications, audit, and recovery before commit.
- [ ] Calendar, list, form, empty, partial, stale, pending, unauthorized, conflict, and service failure behavior is explicit.
- [ ] Accessibility, localization, privacy, AI, security, mobile, performance, and quality evidence is available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Routine, occurrences, recurrence, exceptions, conflicts, Classes, Subjects, Teachers, Students, Academic Sessions, Roles, Permissions, Organization, Workspace, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Calendar, list, Search, Filters, date/time inputs, timezone, forms, review, import, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, overlap, duplicate prevention, recurrence bounds, conflict, partial completion, retry, rollback, cancellation, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, Notification, AI, audit, retention, export, timezone, and historical-integrity evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, and reduced-motion evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)