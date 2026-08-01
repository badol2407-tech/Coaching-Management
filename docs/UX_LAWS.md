# EduTrack UX Laws

**Status:** Normative  
**Owner:** Product Design  
**Applies to:** Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Authentication, Organization Management, Profile, Search, Filters, Mobile, AI features, and future enterprise modules.

## Purpose and precedence

This handbook is the implementation companion to [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md). The constitution holds permanent beliefs; this file translates the UX laws into reviewable product decisions. It does not replace the dedicated handbooks for accessibility, interaction, content, or engineering.

When laws conflict, use this order:

1. Accessibility
2. User safety
3. User control
4. Trust
5. Clarity
6. Performance
7. Convenience

Every feature proposal must name the laws it relies on, the risk of violating them, and the evidence used to validate the decision.

## The laws

### 1. Fitts's Law — make important targets easy to acquire

**Rule:** Interactive targets must be large, separated, and close to the content they affect. Use 44×44 CSS pixels as the minimum target and prefer 48×48 for primary touch actions.

**EduTrack examples:** Attendance status controls must not be tiny adjacent icons; “Record payment” must sit beside the Fee balance; a Student row may open the profile while Edit and Delete remain separate targets; mobile Dashboard quick actions must preserve a safe focus order.

**Measure:** Test touch, keyboard, 200% zoom, and coarse pointers. Record zero accidental activations in representative Attendance and Fees tasks.

### 2. Hick's Law — reduce decisions without removing control

**Rule:** Present the smallest role- and context-relevant set of choices first. Group or search menus that exceed roughly 7–10 items, and disclose advanced options progressively.

**EduTrack examples:** A Teacher sees teaching, Students, Attendance, Exams, and relevant Notifications before organization administration. A Report asks for report family before exposing specialized filters. Fee reversal is available to authorized users but is not mixed into the ordinary collection path.

**Measure:** A first-time user completes the primary Dashboard, Student, Attendance, and Fee task without choosing among irrelevant controls.

### 3. Miller's Law — externalize memory

**Rule:** Keep identity, scope, date, selected filters, and consequences visible at the point of decision. Never require users to remember IDs or copy values between screens.

**EduTrack examples:** Attendance keeps Student, batch, date, and session visible; Fees repeats amount, payment history, and balance during confirmation; Reports retain organization, date range, and filters; AI summaries retain their source scope.

**Measure:** A user can complete the workflow without a second application, handwritten notes, or memorized Student ID.

### 4. Jakob's Law — use familiar interaction patterns

**Rule:** Use established web and platform conventions for navigation, forms, search, dialogs, tables, browser history, keyboard behavior, and feedback. Innovate in domain value, not basic mechanics.

**EduTrack examples:** Student and Teacher search behaves consistently; Reports use familiar date ranges; Authentication supports expected password and session behavior; mobile back navigation works like the platform.

**Measure:** Equivalent actions have the same name, placement, semantics, and outcome across Dashboard, Students, Teachers, Attendance, Fees, Exams, and Reports.

### 5. Tesler's Law — absorb avoidable complexity

**Rule:** Automate deterministic work and expose human judgment where policy, fairness, privacy, or consequence matters. Defaults must be visible, explainable, and correctable.

**EduTrack examples:** Calculate Fee balances and Attendance percentages; carry Organization context into Student and Teacher workflows; default the active Attendance date; show the effect of a permission change; keep a human review step for an AI risk suggestion.

**Measure:** Users do not manually calculate values the system owns, and consequential automation has an explanation, audit record, and correction path.

### 6. Doherty Threshold — acknowledge work immediately

**Rule:** Acknowledge direct input within approximately 100 ms, provide meaningful feedback by approximately 400 ms, and show progress, scope, or recovery for work lasting more than 1 second.

**EduTrack examples:** Attendance marking shows pending and saved state; Student Search remains responsive while results load; Dashboard panels load independently; Fee submission prevents duplicates; Report and AI generation show status and cancellation or recovery.

**Measure:** Track p50 and p95 interaction, search, save, report, and AI latency on representative desktop and mobile networks.

### 7. Peak-End Rule — design the ending

**Rule:** Consequential workflows end with an accurate, accessible summary of what changed, what remains, and what the user can do next. Distinguish complete, partial, pending, and failed outcomes.

**EduTrack examples:** Fee confirmation names the Student, amount, balance, and receipt; bulk Attendance reports skipped records; Exam publishing names scope and status; a permission update identifies affected roles; Authentication explains session state.

**Measure:** Every consequential flow has designed complete, partial, pending, and failed states where applicable.

### 8. Von Restorff Effect — reserve emphasis for meaning

**Rule:** Use visual difference for real priority, risk, state, or action. Never rely on color, sound, motion, or position alone.

**EduTrack examples:** Dashboard emphasis is reserved for actionable Attendance exceptions or defined overdue Fees; a Notification badge represents work requiring attention; Exams warnings explain scope; AI suggestions are not styled as verified records.

**Measure:** Every high-salience treatment has a semantic token and a nonvisual equivalent.

### 9. Zeigarnik Effect — make unfinished work safe to finish

**Rule:** Represent incomplete work with truthful status, owner, scope, and next action. Preserve safe drafts, allow postponement, and never use shame or fake urgency.

**EduTrack examples:** An Attendance session can be “In progress” or “Needs review”; a Student form can be a labeled draft; a pending Fee is not shown as paid; a Report job exposes retry; an AI draft remains visibly unapproved.

**Measure:** Users can leave, return, resolve, dismiss, or review unfinished work without losing safe input.

### 10. Goal Gradient Effect — show real progress

**Rule:** Progress requires a defined goal, denominator, milestone, and completion rule. It must not imply learning, coaching, financial, or personal success that the data cannot establish.

**EduTrack examples:** Show 32 of 35 Attendance records marked; distinguish required from optional Profile fields; show Report generation stages; show Fees reconciled and unresolved amounts; show organization setup requirements.

**Measure:** Every progress indicator explains what remains and remains accurate when work is paused, undone, blocked, or pending review.

### 11. Aesthetic-Usability Effect — polish supports, never replaces, usability

**Rule:** Use a coherent visual language to clarify hierarchy and build confidence, but accessibility, correctness, performance, and understandable content are acceptance gates before polish.

**EduTrack examples:** Dashboard, Student, Teacher, Attendance, Fees, Exams, Report, Settings, and Authentication screens share semantic tokens; printable receipts retain hierarchy; mobile screens do not hide actions behind hover.

**Measure:** Visual review includes contrast, focus, zoom, reduced motion, text resizing, and performance—not only screenshots.

### 12. Choice Overload — make the common path obvious

**Rule:** Provide a recommended, reversible path first. Summarize advanced selections and their consequences before execution.

**EduTrack examples:** Student and Teacher filters expose common fields first; Attendance bulk actions are grouped; Fee adjustments are role-gated; Reports offer templates; Organization Management permissions are searchable; AI recommendations explain differences.

**Measure:** Users can identify the safest common action and review scope before a bulk, financial, permission, or AI action.

### 13. Chunking — group by meaning

**Rule:** Group information by task, object, time, responsibility, or decision—not by decorative container count.

**EduTrack examples:** Student Profile groups identity, enrollment, coaching context, Attendance, and Fees; Teacher views group assignments and access scope; Exam results align with their assessment; Reports group scope, time, segmentation, and output.

**Measure:** Long names, missing values, localization, mobile layouts, and assistive technology do not obscure group relationships.

### 14. Selective Attention — make exceptions discoverable

**Rule:** Make goal-relevant information prominent and proximate to the action it informs. Provide explicit exception summaries rather than relying on visual scanning.

**EduTrack examples:** Attendance has a “Needs review” view; Dashboard prioritizes operational exceptions over vanity metrics; Fee balance and adjustment explanation sit beside the action; Report scope and freshness stay near interpretation; AI uncertainty is adjacent to output.

**Measure:** Critical status, scope, financial, permission, and uncertainty information is understandable with keyboard navigation, screen readers, zoom, mobile layouts, and grayscale.

## Applying the laws in reviews

For every new or changed surface, reviewers must record:

- **User goal:** the job the role is trying to complete.
- **Risk:** what could go wrong for a Student, Teacher, administrator, organization, or data subject.
- **Law mapping:** the laws that shape the design and any justified exception.
- **Evidence:** task test, accessibility test, latency measure, content review, or other evidence.
- **Recovery:** how a user notices, corrects, undoes, or reports a bad result.

See [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), and [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md).