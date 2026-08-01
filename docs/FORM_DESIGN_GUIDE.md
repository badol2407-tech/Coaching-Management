# EduTrack Form Design Guide

**Status:** Normative product standard  
**Owner:** Product Design, Engineering, and QA  

Forms are contracts for collecting, validating, reviewing, and recording information. They must minimize unnecessary disclosure while preventing incorrect Student, Teacher, Attendance, Fee, Exam, Report, Organization, Profile, Authentication, and AI data.

## Form structure

Every form must define:

- purpose and affected object;
- required versus optional fields;
- data owner and visibility;
- format, unit, and example where ambiguity is likely;
- validation timing and message;
- save, cancel, draft, and recovery behavior;
- confirmation of consequential effects.

Use one question per field, persistent labels, logical grouping, and a clear primary action. Group Student identity separately from enrollment; Teacher identity separately from assignment and permissions; Fee amount separately from payment method and receipt; Exam setup separately from publishing.

## Required and optional data

Mark optional fields explicitly. Do not make Profile, Student, Teacher, or Organization Management fields required solely for completeness or AI convenience. Explain why sensitive information is needed and who can see it.

## Validation

Validate format as early as useful, but do not block harmless exploration. Validate cross-field rules at the point they become knowable.

**Examples:** Attendance date and session must be compatible; Fee installment total must not exceed the defined balance without an authorized adjustment; Exam result totals must match the grading rule; Report date range must be valid; Organization permission changes must state affected roles; Authentication errors must not reveal whether an account exists.

Errors must identify the field or record, explain the problem, provide a correction, and preserve safe input.

## Search and filters

Search fields must name their data set and support clear, empty, loading, error, and no-result states. Filters must show active scope, allow clear or reset, and distinguish “no records exist” from “filters exclude records.”

**Examples:** Student and Teacher Search show the searched organization or batch; Attendance Filters show date and session; Fee Filters distinguish overdue from partial; Exam Filters show subject and period; Report and Analytics Filters remain visible during interpretation; Notification Filters distinguish unread from all; mobile Filters provide a summary before applying.

## Review before commit

Use a review state for financial, permission, publication, data export, privacy, and AI actions. The review must summarize object, scope, values, effect, actor, and unresolved warnings.

**Examples:** Review a Fee payment before recording; review Exam results before publishing; review Report scope before exporting; review Organization permissions before save; review AI-generated content before applying it to a Student or Teacher record.

## Save, draft, and reset

Save buttons must state the operation and become pending while saving. Preserve safe drafts where the workflow may be interrupted. Reset must be clearly distinct from Save and explain what it resets. Never clear a form after a recoverable server error.

## Form measures

- 100% of inputs have accessible labels and programmatic error association.
- No consequential form commits without scope and effect review.
- Validation errors preserve safe input.
- A mobile user can complete essential Student, Attendance, Fee, Exam, Report, Authentication, and Profile forms without horizontal scrolling.
- Test long names, localization, missing data, slow networks, duplicate submission, and unauthorized access.

See [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md), and [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md).