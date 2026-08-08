---
title: EduTrack Loading States
purpose: Define honest, stable, and accessible loading behavior for synchronous and asynchronous work.
scope: Initial load, progressive content, skeletons, spinners, progress, optimistic updates, cancellation, timeout, and slow networks.
audience: Product, Design, Engineering, QA, Accessibility, Reliability, Content, and AI implementation contributors.
related_documents:
  - ./STATE_SYSTEM.md
  - ./FEEDBACK_SYSTEM.md
  - ./ERROR_HANDLING.md
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./SEARCH_EXPERIENCE.md
  - ./MOBILE_UX_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./ENGINEERING_STANDARDS.md
review_frequency: Quarterly and after a material performance or loading-pattern change
owner: Product Design, Engineering, QA, and Reliability
version: 1.0.0
status: Binding interaction and performance standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Authentication, Organization, Settings, AI Assistant
---

# EduTrack Loading States

## Purpose

Loading states make waiting understandable without creating false progress or layout instability. They help users distinguish Dashboard refresh, Search, Report generation, Fee confirmation, Exam publication, Authentication, and AI Assistant work from an unresponsive interface.

## Scope and ownership

This handbook owns loading presentation and user control. [STATE_SYSTEM.md](./STATE_SYSTEM.md) owns lifecycle terms; [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns performance measurement; [ERROR_HANDLING.md](./ERROR_HANDLING.md) owns timeout and failure recovery.

## Implementation principles

1. A loading state begins only when work has begun and ends only when the result is known or the operation is canceled or failed.
2. Preserve stable context, scope, labels, and safe content while new data loads.
3. Use skeletons when the structure is known and an indicator when the duration or structure is unknown; never use a skeleton as a false representation of data.
4. Give users immediate acknowledgment, meaningful progress, cancellation, or a safe way to continue when work is slow.
5. Do not block independent content or actions while one region loads.

## Design standards

- Loading indicators identify what is loading: Dashboard metrics, Students, Search results, Filters, Reports, Notifications, or AI Assistant output.
- Skeletons match the approximate content structure but do not imply values, status, or completeness.
- Progress percentages or phases appear only when measured; indeterminate progress is labeled honestly.
- Optimistic updates are reserved for reversible, low-risk actions and must expose pending and rollback behavior.
- Fee, Exam, Permission, Authentication, Report export, and AI actions must never imply final success while pending.
- Repeated or long-running work provides timeout, cancel, retry, or support guidance as appropriate.

## Engineering standards

- Track request identity and cancel obsolete Search, Filter, Dashboard, and AI requests.
- Reserve expected space to reduce layout shift and preserve focus.
- Define p50 and p95 performance measures for primary workflows under [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md).
- Test slow, offline, duplicate, stale, partial, canceled, and timed-out operations.
- Never replace current data with empty or fabricated content while loading.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md). Expose loading semantics and useful status text, keep focus stable, support reduced motion, and ensure loading does not prevent keyboard or assistive-technology access to independent content.

## AI implementation notes

The AI Assistant must label generated content as in progress until complete and must expose cancellation and failure. It must not stream partial content into a consequential Student, Fee, Exam, Report, Permission, or Notification record without explicit human review.

## Review checklist

- [ ] Loading scope, start, completion, cancellation, timeout, and failure are defined.
- [ ] Stable content, focus, labels, and user input are preserved.
- [ ] Progress is truthful and does not imply finality.
- [ ] Slow network, mobile, reduced motion, localization, and screen-reader behavior are reviewed.
- [ ] Performance evidence is linked to the affected workflow.

## Validation checklist

- [ ] Initial, progressive, skeleton, determinate, indeterminate, canceled, and timed-out states render correctly.
- [ ] No layout shift, false success, empty fallback, or blocked independent action occurs.
- [ ] Dashboard, Search, Filters, Reports, Fees, Exams, Authentication, and AI Assistant examples pass.
- [ ] Keyboard, screen-reader, zoom, mobile, and reduced-motion checks pass.
- [ ] Evidence is recorded in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [STATE_SYSTEM.md](./STATE_SYSTEM.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md)