---
title: EduTrack Mobile UX Guide
purpose: Define accessible, resilient, and task-complete experiences on small screens and variable networks.
scope: Mobile priorities, layout, density, interruptions, network behavior, Notifications, and accessibility.
audience: Product, Design, Engineering, QA, Accessibility, Content, and reviewers.
related_documents:
  - ./ACCESSIBILITY_STANDARDS.md
  - ./INTERACTION_DESIGN.md
  - ./NAVIGATION_STANDARDS.md
  - ./MOTION_GUIDELINES.md
review_frequency: Quarterly and after mobile platform, network, or responsive-layout changes
owner: Product Design, Engineering, and QA
version: 1.0.0
status: Binding responsive and mobile standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: mobile, responsive, touch target, Dashboard, Students, Teachers, Attendance, Fees, Notifications
---

# EduTrack Mobile UX Guide

Mobile is a primary operating context for Teachers, administrators, Students, and field staff—not a smaller desktop. Design for touch, interruption, variable bandwidth, small screens, device accessibility settings, and one-handed use.

## Mobile priorities

On every mobile screen, preserve this order:

1. identity and current scope;
2. primary task;
3. status and consequence;
4. recovery and secondary detail.

**Examples:** Attendance keeps batch, date, and Student identity visible; Fees keep amount and balance beside the collection action; Exams keep subject and result scope visible; Reports keep date range and freshness; Authentication keeps recovery available; AI keeps generated status and review action adjacent.

## Layout and interaction

- Reflow essential content without horizontal scrolling.
- Use 44×44 CSS pixel targets and prefer 48×48 for high-frequency or high-consequence actions.
- Keep primary actions reachable with one hand where feasible.
- Do not hide essential actions behind hover, precision drag, or undocumented gestures.
- Preserve browser or platform back behavior.
- Use bottom sheets or menus only when focus, escape, scope, and action hierarchy remain clear.

## Mobile data density

Do not shrink a desktop table until labels and relationships become unreadable. Convert dense Student, Teacher, Attendance, Fee, Exam, and Report tables to a meaningful list or detail pattern. Keep the most important status and action in the first view; expose secondary fields progressively.

## Interruption and network behavior

Assume the user may lock the device, switch apps, lose connectivity, or submit twice. Preserve safe Student, Teacher, Fee, Exam, Report, and Profile input. Show offline, pending, stale, retry, and conflict states honestly. Do not claim an Attendance mark or Fee payment is saved until the system accepts it.

## Mobile notifications

Notifications must be actionable, respectful, and deep-link safely. A notification about Attendance, Fees, Exams, Reports, or AI output must state the object and allow the user to verify scope after opening. Do not use vibration, sound, or badges as the only signal.

## Mobile accessibility

Test screen readers, dynamic type, zoom, high contrast, reduced motion, portrait and landscape, touch exploration, and keyboard or switch input where applicable. Authentication and Profile recovery must work without an exact pointer.

## Mobile acceptance measures

- Essential flows complete at 320 CSS pixels wide without loss of action or meaning.
- No essential task requires horizontal scrolling.
- Recovery from interruption preserves safe work or clearly reports loss.
- p95 save and search feedback is visible on representative mobile networks.
- Attendance, Fees, Exams, Reports, Authentication, and AI actions have explicit pending and failure states.

See [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), and [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md).