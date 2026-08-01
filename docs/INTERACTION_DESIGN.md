# EduTrack Interaction Design

**Status:** Normative product standard  
**Owner:** Product Design and Engineering  

This guide defines how EduTrack behaves when people navigate, select, edit, submit, wait, recover, and collaborate. It complements [UX_LAWS.md](./UX_LAWS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), and [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md).

## Interaction contract

Every interactive surface must answer four questions:

1. **What can I do here?**
2. **What will happen if I do it?**
3. **What happened after I did it?**
4. **How do I recover if the result is wrong or incomplete?**

Before implementation, write the state model for idle, hover, focus, pressed, loading, success, partial success, empty, error, disabled, unauthorized, offline, and stale data where applicable.

## Core standards

### Make state visible

**Rule:** A control must visibly and semantically reflect its current state. Never use a disabled-looking style for a control that is still active, and never show success before durable acceptance.

**Examples:** Attendance status reflects saved state; a Fee action distinguishes pending from paid; Exam publishing reflects draft, scheduled, or published; Notifications distinguish unread from merely recent; AI output distinguishes generated, edited, approved, and rejected.

**Measure:** State changes are perceivable by keyboard, screen reader, touch, and color-blind users.

### Preserve context

**Rule:** An interaction must preserve the object, scope, role, and workflow stage that give the action meaning.

**Examples:** Student identity remains visible while editing Attendance or Fees; Teacher scope remains visible in a Dashboard task; Report filters persist through export; Organization Management names affected roles; Profile editing retains the current account.

**Measure:** No primary task requires copying an ID, date, or filter into another view.

### Separate safe and consequential actions

**Rule:** Safe, reversible actions may be direct; destructive, financial, permission, publication, authentication, and privacy actions require an explicit review step.

**Examples:** Editing a Student is direct; deleting a Student, reversing a Fee, publishing Exam results, changing Organization permissions, exporting sensitive Reports, or revoking Authentication sessions requires scope and consequence confirmation.

**Measure:** Confirmation names the action, target, scope, actor, and recovery or support route.

### Use progressive disclosure responsibly

**Rule:** Reveal complexity when it becomes relevant, but do not hide material cost, privacy, permission, uncertainty, or data-scope information behind an “advanced” control.

**Examples:** Show common Search filters first while keeping applied scope visible; expose advanced Report grouping after report type; reveal Fee adjustment controls only to authorized roles but disclose the effect; show AI details without making source or uncertainty optional.

**Measure:** A user can complete the common path without irrelevant choices and can inspect consequential details before committing.

### Design interruptions and recovery

**Rule:** Navigation, session expiry, network failure, validation failure, and mobile interruption must preserve safe work or explain exactly what was not saved.

**Examples:** An Authentication timeout returns a user to the intended page after re-authentication; an Attendance interruption restores safe progress; a Fee network error prevents duplicate payment; a Report failure retains filters; an AI failure retains the prompt and draft.

**Measure:** Recovery testing loses zero confirmed records and does not require re-entering safe input.

### Keep feedback proportional

**Rule:** Feedback must be timely, calm, and proportional to impact. Use inline feedback for local issues, durable activity for consequential changes, and interruptive dialogs only when interruption is necessary.

**Examples:** Field validation is inline; a Fee receipt confirmation is durable; a permission change creates an audit entry; a Notification count changes only for actionable items; an AI warning appears beside the affected output.

**Measure:** No important result exists only in a transient toast.

## Interaction patterns

### Selection and bulk action

Show selection count, scope, permission, and consequence before a bulk action. Attendance bulk marking must allow review before save. Student, Teacher, Fee, Exam, Report, and Notification bulk actions must distinguish visible rows from all filtered rows.

### Inline edit

Use inline edit only when the changed value is understandable in place, validation is immediate, and recovery is safe. Fee amount, Exam result publication, permissions, and sensitive Profile fields should use a reviewable form instead.

### Dialog

Dialogs must have a descriptive title, a clear primary action, a safe escape path, focus management, and no hidden side effects. Do not use a dialog for information that can be placed in the page flow.

### Empty, loading, and error states

Every state must identify the object and next action. A Student empty state may add a Student or adjust Search; an Attendance empty state may select a date or batch; a Report empty state explains whether no data exists or filters exclude it; an AI empty state does not imply a failed recommendation.

See [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md) and [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md).