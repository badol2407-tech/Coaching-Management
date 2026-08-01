---
title: EduTrack Usability Heuristics
purpose: Provide a structured review lens for identifying usability risks and recovery gaps.
scope: Ten usability heuristics, review findings, severity, evidence, and relationship to release gates.
audience: Product, Design, Engineering, QA, Accessibility, Content, and reviewers.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./REVIEW_CHECKLISTS.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./INTERACTION_DESIGN.md
review_frequency: Quarterly and after usability research or review-process changes
owner: Product Design and Product Governance
version: 1.0.0
status: Review guidance
last_updated: 2026-08-01
normative_level: Advisory review framework
canonical_terms: heuristic, finding, severity, evidence, recovery, user control, system status
---

# EduTrack Usability Heuristics

These heuristics adapt established usability review practice to EduTrack. They are not a substitute for accessibility acceptance criteria or security review. When a heuristic conflicts with safety, accessibility, user control, or trust, the higher-priority concern wins.

## 1. Visibility of system status

**Rule:** The interface must communicate loading, saved, pending, failed, offline, permission, and synchronization state near the affected content.

**Examples:** Attendance shows whether a mark is saving or saved; Fees show whether a receipt is ready; Reports show data freshness and generation status; Notifications distinguish unread from merely recent; Authentication explains session expiry; AI identifies generation and review state.

**Review:** No primary action leaves the user guessing for more than 400 ms; no success message appears before durable acceptance.

## 2. Match with the user's world

**Rule:** Use the terms, sequences, units, roles, and responsibilities used by coaching organizations. Avoid database vocabulary and unexplained internal statuses.

**Examples:** Students, Teachers, batches, Attendance, Fees, Exams, Reports, and Organization use stable domain terms; Profile labels say what information is needed and why; Search and Filters describe results in user language.

**Review:** A Teacher and an organization administrator can explain the screen without knowing implementation details.

## 3. User control and freedom

**Rule:** Users must be able to cancel, go back, edit, undo, discard, or recover when safe. Destructive and consequential operations require deliberate confirmation.

**Examples:** Undo an Attendance correction where policy allows; cancel Report generation; edit a Fee before receipt issuance; discard a Profile draft; revoke a Notification preference; stop an AI suggestion before it changes a record.

**Review:** Every irreversible action names its effect, scope, actor, and recovery or support path.

## 4. Consistency and standards

**Rule:** Equivalent controls must share language, visual treatment, keyboard behavior, permissions, and feedback across Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, and Settings.

**Review:** Reviewers compare at least two existing modules before approving a new pattern.

## 5. Error prevention

**Rule:** Prevent invalid or dangerous states before submission, while preserving user input and explaining the constraint.

**Examples:** Prevent duplicate Attendance records; validate Fee amount and currency; warn before publishing Exam results; check Report scope; confirm Organization Permission impact; prevent AI Assistant text from silently overwriting Profile data.

**Review:** Test missing, malformed, duplicate, stale, unauthorized, and conflicting data.

## 6. Recognition rather than recall

**Rule:** Keep context, labels, selected filters, identity, and consequences visible. Do not require memory across screens.

**Examples:** Student name and ID remain visible in Attendance and Fees; Teacher assignment appears in the relevant Dashboard; Report filters remain visible; Search preserves query and result scope; mobile screens identify the current record.

**Review:** Complete a realistic task without external notes or copied identifiers.

## 7. Flexibility and efficiency

**Rule:** Support both new and expert users with clear defaults, keyboard access, saved views, bulk actions, and efficient repeat workflows without bypassing safety.

**Examples:** Bulk Attendance marking requires review; Reports can save filters; Dashboard supports role-based quick actions; Search supports keyboard focus; Fees support repeated collection while preventing duplicate submission.

**Review:** Measure novice completion and expert throughput separately; do not optimize one by harming the other.

## 8. Aesthetic and minimalist design

**Rule:** Remove irrelevant content, not necessary context. Visual hierarchy must reflect operational importance.

**Examples:** Dashboard vanity metrics cannot outrank Attendance exceptions or overdue Fees; Analytics shows interpretation context; Notifications suppress redundant alerts; AI output avoids decorative authority cues.

**Review:** Every prominent element has a user goal, status, or decision rationale.

## 9. Help users recognize and recover from errors

**Rule:** Errors state what happened, what was affected, how to fix it, and whether the system retained the user's work.

**Examples:** A failed Fee save identifies the Student and amount and does not imply payment; an Exam import reports row-level issues; an Authentication failure explains the next safe step; a Report failure preserves scope; an AI failure offers a retry without fabricating output.

**Review:** Test errors at field, workflow, network, permission, and service levels.

## 10. Help and documentation

**Rule:** Help is contextual, searchable, accessible, and honest about policy and capability. It must not replace good interface design.

**Examples:** Explain Attendance statuses beside the control; define Fee adjustments; describe Report Filters; explain Organization Permissions; disclose AI Assistant limitations; provide Profile and Authentication recovery guidance.

**Review:** Help answers the immediate question without sending a user away from unsaved work.

## Heuristic severity

- **Blocker:** prevents safe access, causes misleading data, exposes protected information, or creates an unrecoverable consequence.
- **Critical:** likely to cause incorrect Attendance, Fee, Exam, Report, permission, or authentication action.
- **Major:** materially slows or confuses a common workflow.
- **Minor:** local inconsistency or polish issue with a safe workaround.

Review findings must include evidence, affected roles, affected data, severity, owner, and acceptance criteria.

See [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md), and [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md).