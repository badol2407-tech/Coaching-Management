---
title: EduTrack Pattern Library
purpose: Define reusable, evidence-based workflow patterns for common product tasks.
scope: Dashboard exceptions, Search and list, detail, rosters, bulk actions, confirmation, drafts, empty states, data tables, calendaring, schedules, period context, file uploads, floating actions, temporal display, AI Assistant, and mobile.
audience: Product, Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./INTERACTION_DESIGN.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./TABLE_DESIGN_GUIDE.md
  - ./DATA_VISUALIZATION_GUIDE.md
  - ./FORM_DESIGN_GUIDE.md
  - ./components/
review_frequency: Quarterly and after pattern, component, or workflow changes
owner: Product Design and Design Systems
version: 1.2.0
status: Binding reusable-pattern standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: pattern, Dashboard, Search, Filters, bulk action, confirmation, draft, empty state, AI Assistant, mobile, Table, Data Grid, Pagination, Charts, Calendar, Timeline, Date Picker, Time Picker, File Upload, FAB, Classes, Subjects, Routine, Academic Sessions
---

# EduTrack Pattern Library

Patterns are reusable solutions to recurring user problems. Use an existing pattern before inventing a new one; document an exception when the domain genuinely differs.

Core module specifications in [modules/](./modules/) compose these patterns for Dashboard, Students, Teachers, Organization, Authentication, Profile, Attendance, Exams, Classes, Subjects, Routine, and Academic Sessions. The module specifications do not create competing pattern standards.

## Dashboard exception review

Use when operational work needs attention. Show scope, count, reason, owner, next action, freshness, and a route to the underlying records. Attendance exceptions, Fee defaulters, failed Reports, Exam warnings, and security Notifications must not be reduced to a decorative badge.

## Search and filtered list

Use when users need to locate Students, Teachers, Attendance, Fees, Exams, Reports, Notifications, or future records. Provide a labeled Search field, relevant Filters, result status, clear/reset, empty/no-result distinction, and preserved scope.

Compose [Search Field](./components/Search%20Field.md), [Autocomplete](./components/Autocomplete.md), [Select](./components/Select.md), and [Multi Select](./components/Multi%20Select.md) according to [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md).

## Field composition

Use for data-entry and edit workflows. Pair a persistent label, concise instruction, control, validation message, and recovery action. Use [Text Field](./components/Text%20Field.md), [Textarea](./components/Textarea.md), [Password Field](./components/Password%20Field.md), or [Select](./components/Select.md) based on the data type; preserve safe input when validation or network errors occur.

## Temporal input

Use [Date Picker](./components/Date%20Picker.md) when a specific calendar date is required as structured input — Attendance session date, Exam date, Routine occurrence, Academic Session boundary, Fee due date, or Report filter range. Use [Time Picker](./components/Time%20Picker.md) when a clock time is required — Routine start and end time, Attendance session, or Exam slot. Pair both when a date-time is needed. Always state the constraint (Academic Session bounds, valid hours, timezone, or approved schedule rule) before the user selects. Support direct keyboard entry as the primary interaction; the picker UI is an enhancement.

## Structured data display

Use [Table](./components/Table.md) when data is two-dimensional and users need to scan, sort, compare, or act on multiple records simultaneously. Use [Data Grid](./components/Data%20Grid.md) when users must edit multiple cells across multiple records inline — Attendance marking, Exam mark entry, Class roster changes, or bulk Fee updates. Use [Pagination](./components/Pagination.md) to navigate large record sets; persist page and page-size in the URL. Apply [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) for caption, column labels, row identity, and responsive transformation.

## Temporal and event display

Use [Calendar](./components/Calendar.md) when users need to browse time-distributed records across a date grid — Attendance session overview, Exam schedule, Routine occurrences, Academic Session boundaries, or Fee due-date calendar. Use [Timeline](./components/Timeline.md) for a chronological event sequence on a record — payment history, Exam lifecycle, Routine exception history, Academic Session transitions, audit trail, or AI-action log. Combine with [Date Picker](./components/Date%20Picker.md) when users must filter the temporal view to a custom range. Ensure today is always distinguishable by non-color means and role-filtered Timeline entries are omitted, not redacted.

## Data visualization

Use [Charts](./components/Charts.md) when a visual encoding supports a decision that a table alone would not support as well — Attendance trends, Fee Analytics, Exam results, cohort comparisons. Always provide a data table or text summary as an accessible equivalent. Use bar for comparable categories, line for time trends, and donut sparingly. Never use color as the only series distinction. Label AI-generated Analytics with source scope and generation state. Follow [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md).

## File import and upload

Use [File Upload](./components/File%20Upload.md) for Attendance CSV imports, Class roster imports, Subject catalog imports, Academic Session data imports, profile photos, certificate uploads, Exam result imports, and Report attachments. State accepted file types and size limits before the file dialog opens. Validate type and size immediately after selection. Show upload progress with cancel, and provide a named success confirmation and a recoverable error with retry. For sensitive files, explain visibility and removal before confirming. Follow [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) for server-side validation.

## Primary mobile action

Use [FAB](./components/FAB.md) for the single most important action on a mobile page — "Mark attendance," "Record payment," or "Add student." Show the FAB only when the current role has permission. Prefer the extended FAB (icon + label) over icon-only. Replace with a page-level [Button](./components/Button.md) at desktop viewport widths. Do not use the FAB for consequential actions without a [Dialog](./components/Dialog.md) confirmation step.

## Selection and preference

Use [Checkbox](./components/Checkbox.md) for independent choices, [Radio](./components/Radio.md) for mutually exclusive choices, and [Switch](./components/Switch.md) for a clearly understood setting that can change immediately. Use [Slider](./components/Slider.md) only when the value is inherently ordered and a precise alternative is available.

## Action and navigation

Use [Button](./components/Button.md) for in-place actions and [Link](./components/Link.md) for navigation or resource references. Use [Icon Button](./components/Icon%20Button.md) only when its accessible name and consequence are unambiguous.

## Primary and secondary navigation

Use [Sidebar](./components/Sidebar.md), [Top Navigation](./components/Top%20Navigation.md), or [Bottom Navigation](./components/Bottom%20Navigation.md) to establish stable role-aware destinations. Use [Breadcrumb](./components/Breadcrumb.md) for hierarchical location and [Tabs](./components/Tabs.md) for closely related views of the same object or task. Follow [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md); do not make mobile users depend on a breadcrumb or hidden gesture.

## Disclosure and command

Use [Accordion](./components/Accordion.md) for optional detail, [Menu](./components/Menu.md) for a bounded set of related actions or destinations, [Dropdown](./components/Dropdown.md) for contextual action or value disclosure, and [Command Palette](./components/Command%20Palette.md) for scoped search and keyboard-first commands. Keep permission, scope, consequence, and recovery visible according to [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md).

## Content collection

Use [Card](./components/Card.md) for meaningful grouped content and [List](./components/List.md) when records are primarily sequential rather than two-dimensional. Preserve identity, status, scope, loading, empty, error, and accessible actions; use [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) when a table relationship is the better representation.

## Focused overlay

Use [Drawer](./components/Drawer.md) for related detail or a focused task that benefits from preserving the underlying page context. Do not use it to hide essential navigation or to avoid a required confirmation. Apply the focus, escape, back, consequence, and recovery rules in [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), and [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md).

## Dialog and anchored disclosure

Use [Dialog](./components/Dialog.md) for intentional interruption and consequential review; use [Popover](./components/Popover.md) for contextual supporting detail; use [Tooltip](./components/Tooltip.md) only to supplement a visible or programmatic name. Apply [ELEVATION_SYSTEM.md](./ELEVATION_SYSTEM.md), [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).

## Feedback and status

Use [Toast](./components/Toast.md) for brief, non-critical point-of-action feedback; [Banner](./components/Banner.md) for persistent page or scope information; [Alert](./components/Alert.md) for important inline status or recovery; and [Badge](./components/Badge.md), [Chip](./components/Chip.md), or [Tag](./components/Tag.md) for compact labeled metadata. Important status must survive transient feedback and never rely on color alone.

## Loading and recovery

Use [Progress](./components/Progress.md) when completion or scope can be measured, [Skeleton](./components/Skeleton.md) when the resulting structure is known, and [Loading Spinner](./components/Loading%20Spinner.md) for brief indeterminate work. Use [Empty State](./components/Empty%20State.md) for completed requests with no available content and [Error State](./components/Error%20State.md) for failed or unavailable work. Follow [LOADING_STATES.md](./LOADING_STATES.md), [EMPTY_STATES.md](./EMPTY_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), and [STATE_SYSTEM.md](./STATE_SYSTEM.md).

## Identity

Use [Avatar](./components/Avatar.md) to support recognition of a Student, Teacher, Profile, or Organization member while keeping the canonical name and privacy-aware fallback available.

## Record detail

Use for Student, Teacher, Class, Subject, Attendance, Fee, Exam, Routine, Academic Session, Report, Profile, or Organization records. Lead with identity and status, then relevant history and actions. Respect role permissions and do not mix unrelated data merely because it exists.

## Bulk operation

Use for Attendance marking, Class membership, Subject offerings, Fee assignment, Notifications, Student or Teacher updates, Exam actions, Routine changes, Academic Session transitions, or Report exports. Show selected count, filter scope, permission, consequence, preview, progress, partial result, and recovery. Use [Data Grid](./components/Data%20Grid.md) when the bulk operation involves inline editing across rows; use [Table](./components/Table.md) with row selection when the operation is applied to selected records without inline editing.

## Consequential confirmation

Use before Fee reversal, Exam publication, Report export, permission change, Authentication revocation, Profile privacy change, Class membership or Teacher assignment change, Routine conflict acceptance or cancellation, Academic Session transition, File Upload of sensitive data, FAB-triggered bulk actions, or AI application. Repeat object, scope, effect, actor, and recovery.

## Draft and interrupted work

Use for Student and Teacher forms, Class and Subject setup, Attendance sessions, Routine edits, Academic Session transitions, Report builders, Exam setup, Profile changes, and AI drafts. Label drafts, preserve safe work, expose owner and status, and provide Save, Discard, Stay, or Resume.

## Empty and first-use

Use different messages for no records, no Permission, no matching Search results, data still loading, and failed loading. Provide one safe next action. Do not hide setup requirements in Dashboard or Organization.

## Reviewable AI assistance

Show AI disclosure, source scope, generated state, uncertainty, human review, edit, reject, retry, and report paths. AI may assist with Student summaries, Attendance patterns, Exam analysis, Reports, Notifications, or Analytics, but cannot silently mutate records or permissions. AI-generated [Charts](./components/Charts.md) and [Timeline](./components/Timeline.md) entries carry explicit disclosure labels.

## Mobile conversion

Transform—not merely shrink—tables, sidebars, filters, dialogs, charts, and forms. Preserve identity, scope, primary action, status, and recovery. Use [FAB](./components/FAB.md) for the primary mobile action. Replace [Calendar](./components/Calendar.md) month grids with list alternatives at narrow viewports. See [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md).

## Core module composition

Use the relevant module specification to apply the patterns to an end-to-end product area:

| Module | Primary pattern composition |
| --- | --- |
| [Dashboard](./modules/Dashboard.md) | Dashboard exception review, Search and filtered list, structured data, data visualization, feedback, loading/recovery, reviewable AI, and mobile conversion. |
| [Students](./modules/Students.md) | Search and filtered list, field composition, record detail, bulk operation, file import/upload, draft/interrupted work, empty/first-use, reviewable AI, and mobile conversion. |
| [Teachers](./modules/Teachers.md) | Search and filtered list, field composition, record detail, bulk operation, consequential confirmation, draft/interrupted work, empty/first-use, reviewable AI, and mobile conversion. |
| [Organization](./modules/Organization.md) | Primary/secondary navigation, field composition, structured data, record detail, bulk operation, consequential confirmation, draft/interrupted work, feedback/loading/recovery, and mobile conversion. |
| [Authentication](./modules/Authentication.md) | Field composition, focused overlay, consequential confirmation, feedback/status, loading/recovery, empty/first-use, and mobile conversion. |
| [Profile](./modules/Profile.md) | Field composition, record detail, file import/upload, focused overlay, consequential confirmation, draft/interrupted work, feedback/loading/recovery, reviewable AI, and mobile conversion. |
| [Attendance](./modules/Attendance.md) | Search and filtered list, temporal input/display, structured data, bulk operation, draft/interrupted work, consequential confirmation, reviewable AI, and mobile conversion. |
| [Exams](./modules/Exams.md) | Search and filtered list, temporal input/display, structured data, bulk operation, consequential confirmation, draft/interrupted work, reviewable AI, and mobile conversion. |
| [Classes](./modules/Classes.md) | Search and filtered list, record detail, roster and bulk operation, consequential confirmation, draft/interrupted work, empty/first-use, reviewable AI, and mobile conversion. |
| [Subjects](./modules/Subjects.md) | Search and filtered list, record detail, field composition, structured data, consequential confirmation, draft/interrupted work, reviewable AI, and mobile conversion. |
| [Routine](./modules/Routine.md) | Search and filtered list, temporal input/display, schedule review, consequential confirmation, draft/interrupted work, reviewable AI, and mobile conversion. |
| [Academic Sessions](./modules/Academic_Sessions.md) | Search and filtered list, temporal input/display, context switching, consequential confirmation, draft/interrupted work, reviewable AI, and mobile conversion. |

Every pattern implementation must cite the relevant component specification, component handbook, and review checklist.
