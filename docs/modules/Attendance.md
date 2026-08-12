---
title: EduTrack Attendance Module
purpose: Define scoped Attendance session creation, marking, review, correction, import, and reporting for authorized Users.
scope: Attendance sessions and records, Student rosters, marking states, corrections, imports, summaries, exceptions, and authorized relationships to Students, Teachers, Classes, Subjects, Routine, Academic Sessions, Exams, Reports, Notifications, and Dashboard.
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
review_frequency: Quarterly and after an Attendance, roster, Role, privacy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, Data, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Attendance, Attendance record, Attendance session, Student, Teacher, Class, Subject, Routine, Academic Session, Organization, Workspace, Role, Permission, Search, Filters, Notifications, AI Assistant
---

# Attendance

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Attendance is the scoped source-of-truth workspace for recording whether a Student was present, absent, late, excused, or otherwise in a defined instructional session. It helps authorized Teachers and administrators mark the correct roster, review exceptions, correct mistakes, and understand freshness without turning an attendance value into an unsupported judgment about a Student, Teacher, or Organization.

The module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), and [STATE_SYSTEM.md](../STATE_SYSTEM.md).

## Scope

### Included

- Attendance session identity, date, time, Organization, Workspace, Academic Session, Class, Subject, Routine context, and roster.
- Marking, saving, reviewing, correcting, importing, and authorized exporting of Attendance records.
- Present, absent, late, excused, pending, unmarked, and approved domain states.
- Student-level history, scoped summaries, exceptions, freshness, and links to source records.
- Authorized relationships to Students, Teachers, Classes, Subjects, Routine, Academic Sessions, Exams, Reports, Notifications, and Dashboard.

### Excluded

- Student identity, enrollment, Class membership, Teacher assignment, Subject catalog, Routine, or Academic Session as a source of truth.
- Inferring Attendance from device presence, login activity, Routine alone, or an AI Assistant.
- Automatic disciplinary, financial, academic, employment, or safety decisions from an Attendance value.
- Silent deletion, retroactive rewriting, or cross-Organization disclosure of Attendance history.

## Users & Roles

| Role | Attendance responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate operational signals and support cases. | Explicitly authorized Organization scope; minimize individual records. |
| Organization administrator | Configure, review, correct, import, export, and govern Attendance for the Organization. | Active Organization and authorized Workspace, Academic Session, Class, and Subject scope. |
| Teacher | Mark and review Attendance for assigned Classes, Subjects, and Students. | Assigned teaching scope and permitted historical records. |
| Student | Review own Attendance and submit an approved correction or explanation request. | Own records and explicitly shared context. |
| Future authorized Role | Use only the Attendance actions declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Attendance is the canonical destination; use “mark Attendance” for the action and “Attendance record” for the stored item.
2. Every session identifies Organization, Workspace, Academic Session, Class, Subject where applicable, date, time, Teacher or responsible Role, roster source, and status before marking begins.
3. A Routine may propose a session, but it does not itself create a final Attendance record or prove participation.
4. The roster is resolved from the authorized Class and enrollment context. A user must not add an out-of-scope Student through a client-side edit.
5. Each Student/session result has one current value and a reviewable history of corrections; corrections do not silently erase the prior value or actor.
6. Unmarked is distinct from absent. A session cannot be presented as complete while required roster rows remain unmarked unless an approved exception is recorded.
7. Late, excused, and other approved states require the reason, source, or approval information required by policy; the module does not invent a universal threshold.
8. Concurrent edits, stale roster data, duplicate submissions, and partial saves are visible and recoverable. The last client write must not silently win.
9. Imports validate every row, preserve accepted and rejected results, and do not broaden Organization, Workspace, Class, Subject, or Academic Session scope.
10. Summaries identify denominator, exclusions, date scope, freshness, and missing data. They do not rank people or imply causation.
11. AI Assistant output is generated and reviewable; it cannot mark, correct, approve, notify, or export Attendance without explicit authorized human action.

## User Journeys

### Teacher: mark a session

1. Open Attendance and confirm Organization, Workspace, Academic Session, Class, Subject, Routine context, date, and time.
2. Review the resolved Student roster and any prior or conflicting marks.
3. Mark each Student using the approved values and add required reasons or notes only where authorized.
4. Review selected count, unmarked rows, scope, effect, and unresolved warnings.
5. Save, observe pending or partial status, and confirm the named session result or recovery path.

### Organization administrator: correct a record

1. Search within the authorized Organization, Academic Session, Class, Subject, date, and Student scope.
2. Open the Attendance record and review current value, prior history, actor, timestamp, and source.
3. Enter the correction and reason, then review affected summaries, Notifications, and audit behavior.
4. Confirm the consequence and submit the authorized correction.
5. Verify success, pending approval, conflict, or failure without losing the original context.

### Student: review Attendance

1. Open Attendance and confirm own Student, Organization, Workspace, Academic Session, and date scope.
2. Review session identity, value, freshness, and any approved reason or correction path.
3. Submit a correction or explanation request only when the Role and policy allow it.
4. Return to the source session or preserve the request status.

### Organization administrator: import Attendance

1. Confirm the file purpose, accepted format, Organization, Workspace, Academic Session, and target session scope.
2. Review detected headers, row mapping, duplicate signals, and validation rules.
3. Resolve invalid, out-of-scope, and conflicting rows before commit.
4. Review accepted, skipped, and failed counts and confirm the import.
5. Access the recoverable result, retry path, and audit entry.

## Information Architecture

### Attendance session

Page identity and active scope → session date/time and status → Class, Subject, Routine, Academic Session, and Teacher context → roster completeness → marking action → freshness, exceptions, and history.

### Attendance history and summary

Student or Class identity → Academic Session and date scope → exact records and values → denominator, exclusions, freshness, and source → authorized correction or related workflow.

Do not place private Student data, unrelated Fees, or inferred performance judgments into a marking grid merely because the records are related in storage.

## Navigation Flow

`Sidebar > Attendance` opens the scoped session list or the next permitted session. From Attendance:

- session row or Search result → Attendance session;
- session → Student detail or Attendance history when authorized;
- session → Class, Subject, Routine, Academic Session, Teacher, Dashboard, Exams, or Reports with scope preserved;
- mark, correct, or import → review → confirmation → session result or preserved list scope;
- Dashboard exception → Attendance with originating Organization, Workspace, Class, Subject, Academic Session, date, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected Student or session existence. Mobile preserves session identity, scope, roster status, primary action, and recovery.

## Screen Specifications

### Attendance session list

- Named Search and Filters identify the Attendance dataset and active Organization, Workspace, Academic Session, Class, Subject, Teacher, date, and status scope.
- Result count, freshness, no-result distinction, unmarked count, and clear/reset path are visible.
- Each row identifies session date/time, Class, Subject, Teacher, roster count, completion state, and permitted action.

### Attendance marking workspace

- Visible caption and scope label identify the session and roster source.
- Data Grid supports approved multi-row marking, keyboard movement, row identity, inline validation, staged changes, save, discard, and partial-success handling.
- Unmarked, saved, changed, conflict, and unauthorized states are distinguishable without color alone.
- Review shows selected rows, change count, effect, actor, scope, and unresolved warnings before commit.

### Attendance detail and correction

- Student identity, session identity, current value, source, actor, timestamp, freshness, and history are separated.
- Correction reason, visibility, approval requirement, and affected summaries are shown before save.
- Sensitive notes are minimized and masked or omitted by default.

### Attendance import and summary

- File purpose, accepted type, size, mapping, scope, progress, row errors, partial result, and recovery are explicit.
- Summaries state denominator, period, source, freshness, exclusions, and a nonvisual equivalent.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Date Picker](../components/Date%20Picker.md), [Time Picker](../components/Time%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Data Grid](../components/Data%20Grid.md) for approved multi-row marking, [Table](../components/Table.md), [List](../components/List.md), [Calendar](../components/Calendar.md), and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Attendance search/list, structured data, bulk operation, temporal input, draft/interrupted work, consequential confirmation, empty, reviewable AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read session, mark, edit, approve correction, import, export, view history, view sensitive reason, and administer Attendance are separate capabilities.
- All capabilities are scoped by Organization, Workspace, Academic Session, Class, Subject, Teacher assignment, Student, and Role.
- Teacher marking is limited to assigned and active scope; Student access is limited to own records and approved requests.
- Bulk marking, correction, import, export, and sensitive reason access require explicit capability and consequence review.
- Authorization is rechecked for session creation, roster resolution, collection queries, direct links, cached records, imports, exports, summaries, Notifications, and AI context.
- Permission denial does not reveal a protected Student, session, or Attendance value.

## Validation Rules

- Session date/time, Organization, Workspace, Academic Session, Class, Subject, Routine, roster, and responsible Role must be valid before marking.
- Student rows must belong to the authorized session roster and active scope; invalid parameters must not broaden results.
- Attendance values, reason fields, correction requirements, and review status are validated at field and cross-row boundaries.
- Duplicate session identity, duplicate Student/session rows, stale roster versions, and concurrent edits require conflict handling.
- A session cannot be finalized while required rows are unmarked unless the approved exception is visible and recorded.
- Import rows validate identity, scope, date/session compatibility, value, reason, duplicate, and authorization conditions server-side.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: request Organization, Workspace, Academic Session, and session scope before querying.
- `loading`: preserve scope, roster structure, Search, Filters, and safe staged marks.
- `ready`: show session identity, roster count, freshness, completion, and permitted actions.
- `empty`: distinguish no sessions, no roster, no matching Filters, no Attendance records, no access, and unavailable service.
- `partial`: identify saved and unsaved rows, accepted and failed import rows, or available and missing summary regions.
- `stale`: expose roster or record freshness and require refresh or conflict review before commit.
- `pending`: name the session and action accepted but not final.
- `success`: name the session, affected Students or rows, changed values, and next action.
- `error`: preserve safe marks, Search, Filters, and file review; distinguish validation, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: explain the available capability or request path without protected-data disclosure.

## Notifications

Attendance Notifications may communicate missing marking, approved corrections, relevant exceptions, or required review. Delivery, preference, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify source session, scope, time, consequence, and action without exposing unrelated Student data or creating artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Session identity, scope, roster row identity, value, validation, save state, conflict, and completion state are available through text and semantics.
- Data Grid keyboard navigation, cell labels, row announcements, staged changes, errors, and focus recovery are tested.
- Tables, Search, Filters, Calendar, date/time inputs, import progress, dialogs, and pagination have programmatic names and logical focus.
- 200% zoom, 320 CSS pixel reflow, long names, translated labels, text enlargement, screen readers, touch, and reduced motion are tested.
- Present, absent, late, excused, pending, unmarked, and error states never rely on color, icon, position, or sound alone.

## AI Behavior

The AI Assistant may summarize authorized Attendance patterns or draft a non-authoritative explanation. It must label generated content, identify source sessions, Student or Class scope, date and Academic Session, freshness, uncertainty, missing data, and review controls. It must not infer sensitive traits, predict discipline or outcomes, mark or correct Attendance, resolve conflicts, notify a Student or Teacher, or export data without explicit authorized human review and action.

## Security

Attendance is Organization-, Workspace-, Academic Session-, Class-, Subject-, Student-, and Role-scoped. Enforce authorization at session creation, roster resolution, record reads and writes, caches, imports, exports, summaries, Notifications, deep links, audit, and AI boundaries. Minimize notes, protect files and exports, avoid identifiers in URLs or logs where not required, and audit marking, corrections, approvals, imports, and exports under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Keep the Attendance marking surface responsive, load session identity and roster scope before secondary history, paginate large histories, cancel obsolete Search and Filter requests, preserve stable grid structure, and acknowledge staged or slow saves. Measure session open, roster load, marking, bulk commit, correction, import, summary, export, and recovery with the shared engineering performance process; this module does not create a competing numeric threshold.

## Acceptance Criteria

- [ ] Authorized users can open the correct Attendance session within explicit Organization, Workspace, Academic Session, Class, Subject, date, and Role scope.
- [ ] Marking shows roster identity, current value, unmarked status, staged changes, conflict, partial result, and recovery.
- [ ] Corrections, imports, exports, and approvals state permission, scope, consequence, actor, audit, and recovery.
- [ ] Attendance values remain distinct from Student identity, Class membership, Routine, Exam results, and inferred outcomes.
- [ ] Empty, stale, pending, unauthorized, validation, conflict, and service failure paths preserve safe intent.
- [ ] Approved components, canonical vocabulary, Notifications, AI behavior, privacy, retention, and audit rules are used without duplicate standards.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, reduced-motion, performance, and evidence requirements are documented.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Attendance sessions, records, rosters, Roles, Permissions, Organization, Workspace, Academic Session, Class, Subject, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, Data Grid, tables, Calendar, marking, correction, import, export, summary, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, duplicate prevention, stale roster, concurrent edit, partial save, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, file, Notification, AI, audit, retention, and export evidence.
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