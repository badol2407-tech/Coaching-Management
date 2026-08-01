---
title: EduTrack Motion Guidelines
purpose: Define purposeful, safe, interruptible, and accessible motion behavior.
scope: Transitions, feedback, loading, emphasis, reduced motion, interruption, focus, and motion exceptions.
audience: Product Design, Engineering, QA, Accessibility, and reviewers.
related_documents:
  - ./ACCESSIBILITY_STANDARDS.md
  - ./INTERACTION_DESIGN.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./MOBILE_UX_GUIDE.md
review_frequency: Quarterly and after motion, platform, or accessibility changes
owner: Product Design, Engineering, and Accessibility
version: 1.0.0
status: Binding motion standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: motion, transition, animation, reduced motion, focus, interruption, status
---

# EduTrack Motion Guidelines

Motion should orient, confirm, and explain change. It must not delay work, manufacture urgency, hide uncertainty, or create access barriers.

## Motion purposes

Allowed purposes are:

- **Orientation:** page transitions or shared-element continuity that preserves context.
- **Feedback:** a saved Attendance mark, pending Fee submission, or completed Report generation.
- **Relationship:** showing a filter change or Analytics update when the relationship remains understandable without motion.
- **Focus:** drawing attention to a real error or required review, briefly and respectfully.

Decorative motion needs a clear product rationale and must remain removable.

## Rules

- Respect `prefers-reduced-motion` and equivalent device settings.
- Never use motion as the only signal for success, failure, warning, selected state, or AI generation.
- Do not animate Dashboard or Analytics content before primary data is usable.
- Do not use looping motion for Notifications, Fee urgency, Attendance reminders, Exam deadlines, or AI prompts.
- Keep motion short, interruptible, and consistent with the consequence of the action.
- Avoid flashing, rapid scale, parallax that impairs reading, and motion that causes loss of focus.

## EduTrack examples

Attendance may use a brief saved acknowledgment with text; a Fee form may show a pending state but not celebratory confetti; Reports may show progress stages; Notifications may update without flashing; AI generation may show a textual “Generating” state and allow cancellation; mobile navigation may animate only if the destination and focus remain clear.

## Measures

- All essential meaning remains clear with motion disabled.
- Reduced-motion mode removes nonessential transitions and preserves focus.
- No motion blocks Dashboard, Student, Teacher, Attendance, Fee, Exam, Report, Authentication, or Profile tasks.
- Test at low frame rate and on mobile hardware.

See [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), and [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md).