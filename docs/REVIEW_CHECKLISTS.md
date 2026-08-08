---
title: EduTrack Review Checklists
purpose: Provide evidence-based release and design gates for product changes.
scope: Product scope, accessibility, interaction, data, security, content, performance, reliability, AI, and final decisions.
audience: Product, Design, Engineering, Security, Privacy, AI Governance, QA, Accessibility, and approvers.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./ENGINEERING_STANDARDS.md
  - ./AI_UX_GUIDELINES.md
review_frequency: Quarterly and after checklist, policy, or release-process changes
owner: Product Governance, Design, Engineering, QA, Security, and Accessibility
version: 1.0.0
status: Release and design review gates
last_updated: 2026-08-01
normative_level: Binding release evidence
canonical_terms: Pass, Fail, Not applicable, Exception, evidence, owner, expiry, Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Search, Filters, AI Assistant, Mobile
---

# EduTrack Review Checklists

Use these checklists as evidence gates, not paperwork. Mark an item **Pass**, **Fail**, **Not applicable with reason**, or **Exception with owner and expiry**. A failed higher-priority item blocks release.

## Product and scope

- [ ] The user goal and affected roles are explicit.
- [ ] Students, Teachers, administrators, and future role implications are documented.
- [ ] Object, organization scope, date scope, and permissions are explicit.
- [ ] Dashboard, Search, Filters, mobile, Notifications, Reports, and Analytics implications are covered.
- [ ] Success, failure, partial, pending, empty, unauthorized, and stale states are defined.

## Accessibility

- [ ] Keyboard operation is complete and focus is visible and logical.
- [ ] Labels, names, roles, values, headings, landmarks, and live updates are accessible.
- [ ] Contrast, zoom, reflow, dynamic text, reduced motion, and high contrast pass.
- [ ] Color, motion, sound, and position are not the only status signals.
- [ ] Charts and Analytics have exact text or table alternatives.
- [ ] Mobile touch targets and essential flows pass.

## Interaction and recovery

- [ ] Primary action and consequence are clear before activation.
- [ ] Save, pending, success, partial, failed, retry, cancel, undo, and recovery behavior are tested.
- [ ] Safe input is preserved through validation, navigation, timeout, offline, and service failure.
- [ ] Destructive, financial, permission, publication, export, Authentication, and AI actions have deliberate review.
- [ ] Duplicate submission and stale data are handled.

## Data and security

- [ ] Authorization is enforced at the data boundary.
- [ ] Organization and role isolation is tested with direct requests or deep links.
- [ ] Sensitive Student, Teacher, Profile, Fee, Report, Authentication, and AI data is minimized.
- [ ] Consequential changes have actor, time, scope, before/after, and audit behavior.
- [ ] Exports, Notifications, logs, and AI context do not leak protected data.

## Content

- [ ] Labels describe outcomes and use canonical terms.
- [ ] Errors explain what happened, what was saved, and what to do next.
- [ ] Fees, Exams, Reports, Analytics, Attendance, and AI uncertainty use precise status language.
- [ ] Copy supports localization, screen readers, long names, and mobile widths.
- [ ] No fake urgency, shame, hidden cost, deceptive default, or manipulative counter is present.

## Performance and reliability

- [ ] Dashboard, Search, Filters, detail, save, export, Notification, Authentication, and AI timings are measured.
- [ ] Users receive immediate acknowledgment and progress for slow work.
- [ ] Independent content does not block the primary task.
- [ ] Monitoring distinguishes validation, authorization, network, service, and data errors.
- [ ] Rollback, retry, migration, and incident ownership are documented.

## AI-specific gate

- [ ] AI use, input scope, generated status, limitations, and human review are visible.
- [ ] AI cannot silently mutate records, Fees, Exams, Reports, permissions, Notifications, or Profiles.
- [ ] Sources, uncertainty, correction, rejection, and reporting paths are available.
- [ ] Evaluation covers accuracy, privacy, fairness, accessibility, harmful outputs, and drift.

## Final decision

- **Decision:** Pass / Block / Exception
- **Affected modules:** Dashboard / Students / Teachers / Attendance / Fees / Exams / Reports / Analytics / Notifications / Authentication / Organization / Profile / Search / Filters / Mobile / AI Assistant / future module
- **Evidence links:** tests, audits, measurements, user research, screenshots, or decision records
- **Known gaps:** owner, mitigation, due date, expiry
- **Approver:** name and role

See [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), and [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md).