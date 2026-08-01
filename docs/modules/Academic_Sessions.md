---
title: EduTrack Academic Sessions Module
purpose: Define governed Academic Session periods, boundaries, status, transition, and relationships to instructional and reporting workflows.
scope: Academic Session identity, date boundaries, Organization and Workspace scope, status, transitions, active context, Class, Subject, Routine, Attendance, Exams, Fees, Reports, Notifications, retention, and authorized administration.
audience: Product, Design, Engineering, Security, Privacy, Data, Governance, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../PRODUCT_GOVERNANCE.md
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
review_frequency: Quarterly and after an Academic Session, policy, Role, privacy, retention, or workflow change
owner: Product, Product Governance, Product Design, Engineering, Security, Privacy, Data, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Academic Sessions, Academic Session, Organization, Workspace, Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, Role, Permission, Search, Filters, AI Assistant
---

# Academic Sessions

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Academic Sessions is the governed period boundary for instructional organization, schedules, Attendance, Exams, Fees, Reports, and related operational work. It helps authorized administrators establish a clear period, switch context safely, preserve historical meaning, and handle transition without silently moving records across periods.

The module applies the ownership and precedence rules in [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md), [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). It defines Academic Session behavior without creating a second Organization, authorization, retention, or security standard.

## Scope

### Included

- Academic Session identity, label, Organization, Workspace, start and end dates, timezone or locale context, status, owner, and transition state.
- Active-session selection, setup completeness, permitted configuration, archival, restoration, extension or closure review, and history.
- Relationships to Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, Dashboard, Students, Teachers, Organization, and Profile.
- Impact review for date-boundary changes, transition, export, retention, reporting, and authorized recovery.

### Excluded

- Organization identity, membership, Role, Permission, Authentication, Student, Teacher, Class, Subject, Routine, Attendance, Exam, Fee, or Report records as a source of truth.
- Silent reassignment of records or users between Academic Sessions.
- Treating an active-session switch as permission to view another Organization or Workspace.
- AI decisions about academic progression, closure, retention, financial, employment, or safety outcomes.

## Users & Roles

| Role | Academic Session responsibility | Default scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate session or support operations. | Explicitly authorized Organization scope; minimize individual data. |
| Organization administrator | Create, configure, activate, transition, close, archive, restore, export, and govern Academic Sessions. | Active Organization and authorized Workspaces. |
| Teacher | Work within the selected Academic Session for assigned Classes, Subjects, Routine, Attendance, Exams, and Students. | Assigned operational scope in the active session. |
| Student | Review own records in the active or explicitly shared Academic Session context. | Own records and shared context only. |
| Future authorized Role | Use only approved session actions and scope. | Explicit scope and deny-by-default. |

## Business Rules

1. Academic Session is the canonical period boundary; every session-aware workflow identifies the session or explicitly states that it is not session-scoped.
2. Each Academic Session belongs to an Organization or authorized Workspace and has a clear label, start date, end date, timezone or locale context, owner, and status.
3. Active, upcoming, closed, archived, draft, pending, and cancelled states are distinct; status does not silently change when a date passes without the governed transition.
4. Overlapping sessions, date gaps, boundary changes, and multiple active sessions require an explicit Organization policy and visible review; the module does not invent a universal calendar rule.
5. Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, and Dashboard queries preserve the selected Academic Session and cannot broaden scope through a client-provided value.
6. Switching the active Academic Session is explicit, reversible, and preserved through navigation, Search, Filters, browser history, refresh, and related-module links.
7. Closing, archiving, restoring, extending, or changing boundaries reviews affected Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, exports, retention, and recovery.
8. Historical records retain their original Academic Session identity. A migration or correction is explicit, authorized, audited, and never a hidden rewrite.
9. Session summaries identify source, period, freshness, completeness, and limitations. They do not imply Student, Teacher, or Organization outcomes.
10. AI Assistant content about Academic Sessions is generated and reviewable; it cannot activate, close, migrate, extend, or mutate a session without explicit authorized action.

## User Journeys

### Organization administrator: create an Academic Session

1. Open Academic Sessions and confirm Organization, Workspace, timezone or locale, and intended period.
2. Enter label, start and end dates, status, owner, and required policy or transition information.
3. Review overlap, affected Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, and retention.
4. Save as draft or commit through the approved governance path.
5. Confirm the session identity, status, boundaries, audit, and next setup action.

### Organization administrator: activate or transition a Session

1. Review current and target Academic Session, date boundaries, setup completeness, active users, and pending work.
2. Inspect affected operational modules, exports, Notifications, reports, retention, and recovery.
3. Confirm the exact Organization or Workspace scope, actor, effective time, and transition effect.
4. Commit and verify pending, success, partial, conflict, or failure state.
5. Confirm that downstream navigation and queries use the intended session without losing safe work.

### Teacher: switch Academic Session

1. Open the approved Organization or Workspace context switcher.
2. Review available Academic Sessions, status, date boundaries, and scope before selecting one.
3. Switch and verify Dashboard, Classes, Subjects, Routine, Attendance, Exams, Reports, Notifications, and Profile context.
4. Return to the prior session without silently moving drafts or submissions.

### Student: review a historical Session

1. Open a permitted Academic Session selector from Dashboard or a source module.
2. Confirm own Student, Organization, Workspace, session label, date range, and status.
3. Review authorized historical Classes, Subjects, Attendance, Exams, Fees, Reports, and Notifications.
4. Return to the active session without losing the safe source context.

## Information Architecture

### Academic Sessions collection

Page identity and Organization/Workspace scope → Search and Filters → result count and freshness → session label, date boundaries, timezone, status, and setup completeness → permitted actions.

### Academic Session detail

Session identity and status → date boundaries and timezone or locale → Organization/Workspace and transition context → affected Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, and Notifications → history, audit, retention, exports, and recovery.

### Session switcher

Current Organization/Workspace and active session → available sessions with status and dates → consequence of switching → explicit selection → preserved return path and draft safety.

Do not collapse Academic Session configuration with Organization identity, Authentication, Profile, or Permission administration.

## Navigation Flow

`Sidebar > Organization > Academic Sessions` opens the authorized session collection. From Academic Sessions:

- session row or Search result → Academic Session detail;
- detail → Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, Dashboard, Organization, or Profile with scope preserved;
- create, edit, activate, close, extend, archive, restore, import, export, or migrate → review → confirmation → session result or preserved collection scope;
- Organization or Workspace context switcher → Academic Sessions with current and target context visible;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck Organization, Workspace, and session authorization and do not reveal protected cross-session data. Mobile keeps current Organization, Workspace, session, date boundary, primary action, and recovery visible.

## Screen Specifications

### Academic Sessions collection

- Named Search and Filters identify the session dataset and active Organization, Workspace, status, and date scope.
- Result count, freshness, current-session marker, setup completeness, date boundaries, and clear/reset behavior are visible.
- Each row identifies session label, Organization/Workspace, start and end dates, timezone or locale, status, and permitted action.

### Academic Session detail

- Session identity, status, boundaries, timezone or locale, Organization/Workspace, owner, and freshness lead the page.
- Setup and transition impact is grouped by Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, exports, and retention.
- History, audit, and recovery are separated from editable session fields.

### Session switch and transition review

- Current and target session, date boundaries, active scope, pending work, affected records, effective time, actor, consequence, and recovery are explicit.
- Switch is reversible where policy allows and does not silently submit, discard, or migrate drafts.
- Close, archive, restore, extend, or migration actions require deliberate confirmation and named outcome.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), [Tabs](../components/Tabs.md), and [Bottom Navigation](../components/Bottom%20Navigation.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Date Picker](../components/Date%20Picker.md), [Autocomplete](../components/Autocomplete.md), [Text Field](../components/Text%20Field.md), [Textarea](../components/Textarea.md), and [File Upload](../components/File%20Upload.md).
- [Table](../components/Table.md), [List](../components/List.md), [Calendar](../components/Calendar.md), [Timeline](../components/Timeline.md), and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), [Menu](../components/Menu.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Academic Session context switch, temporal input, search/list, record detail, consequential confirmation, draft, empty, reviewable AI, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Academic Session, create, edit, activate, close, extend, archive, restore, migrate, import, export, view history, and administer are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Academic Session, affected module, object, date range, and Role.
- Activation, closure, boundary change, migration, archive, restore, import, export, and retention changes require explicit capability, consequence review, and audit.
- Teachers and Students can switch or view only sessions permitted by Organization policy and their operational scope.
- Authorization is rechecked for session collections, switchers, direct links, caches, exports, migrations, related-module navigation, Notifications, and AI context.
- Permission denial does not reveal protected Organization, Workspace, Academic Session, or related records.

## Validation Rules

- Academic Session label, Organization, Workspace, dates, timezone or locale, status, owner, and policy fields use explicit formats and ownership.
- Start and end dates are valid and compatible with Organization policy, relevant Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, and retention.
- Overlap, gap, active-session, transition, boundary-change, migration, and duplicate-label conditions require visible review.
- Closing, archiving, restoring, extending, exporting, or migrating validates affected records, pending work, Notifications, audit, retention, and recovery.
- Session selection, Search, Filters, and deep-link parameters are valid for the Role and cannot broaden cross-session access.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish Organization, Workspace, timezone or locale, and intended session scope before querying.
- `loading`: preserve current session, target selection, Search, Filters, date fields, and safe draft input.
- `ready`: show session identity, boundaries, status, freshness, setup completeness, and permitted actions.
- `empty`: distinguish no sessions, no active session, no matching Filters, no authorized session, and unavailable service.
- `partial`: identify completed and unavailable setup, transition, migration, import, export, or related-module regions.
- `stale`: expose configuration freshness and require review before activation, closure, boundary change, or migration.
- `pending`: name the accepted session action without implying final transition or record migration.
- `success`: name session, scope, status, effective time, affected modules, and next action.
- `error`: preserve safe input and context; distinguish validation, overlap, conflict, authorization, network, migration, and service failure.
- `unauthorized` and `disabled`: explain the available support or request path without protected-data disclosure.

## Notifications

Academic Session Notifications may communicate activation, transition, closure, boundary change, required setup, export, migration, or retention action. Delivery, preferences, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify session, Organization/Workspace scope, effective time, consequence, and action without exposing unrelated records or creating artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md):

- Session identity, Organization, Workspace, date boundaries, timezone or locale, status, active marker, consequence, and transition state are available in text and semantics.
- Session switchers, tables, date inputs, dialogs, Search, Filters, timelines, and pagination are keyboard complete with visible focus and stable announcements.
- Localized dates, long labels, translated status, 200% zoom, 320 CSS pixel reflow, mobile, screen readers, touch, text enlargement, and reduced motion are tested.
- Active, upcoming, closed, archived, pending, denied, and error states never rely on color, position, or icon alone.

## AI Behavior

The AI Assistant may summarize authorized session setup, transition readiness, or historical context and draft a reviewable explanation. It must identify source scope, session, date boundaries, freshness, missing data, uncertainty, generated status, and human review. It must not decide progression, activate or close a session, migrate records, change retention or Permissions, send mandatory Notifications, or mutate Academic Session data without explicit authorized action.

## Security

Academic Sessions are Organization- and Workspace-scoped boundaries for Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, exports, caches, and AI context. Enforce isolation and session authorization at the data boundary, protect migration and export operations, prevent cross-session and cross-Organization enumeration, and audit activation, closure, boundary change, migration, archive, restore, import, export, and retention actions under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load current Organization, Workspace, session identity, status, and boundaries before secondary impact panels; keep switching responsive; paginate session history and related collections; cancel obsolete Search and Filter requests; preserve stable context; and acknowledge transition or migration work. Measure collection, detail, switch, activation, closure, boundary review, migration, import, export, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Authorized users can identify the current Organization, Workspace, Academic Session, boundaries, timezone or locale, status, and permitted actions.
- [ ] Session switching is explicit, scoped, reversible where permitted, and does not silently submit, discard, or migrate work.
- [ ] Activation, closure, boundary change, migration, archive, restore, import, export, and retention paths state scope, consequence, actor, effective time, audit, and recovery.
- [ ] Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, Dashboard, and related records preserve their historical session context.
- [ ] Empty, partial, stale, pending, unauthorized, overlap, conflict, validation, migration, and service failure states are explicit and recoverable.
- [ ] Approved components, canonical vocabulary, accessibility, localization, privacy, AI, security, performance, and quality evidence are available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Academic Sessions, Organizations, Workspaces, Classes, Subjects, Routine, Attendance, Exams, Fees, Reports, Notifications, Roles, Permissions, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, date inputs, switcher, tables, Calendar, Timeline, transition review, import, export, migration, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, overlap, duplicate prevention, boundary changes, transition, partial completion, retry, rollback, migration, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: tenancy isolation, cross-session access, direct access, caches, exports, Notifications, AI, audit, retention, and historical-integrity evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, and reduced-motion evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)