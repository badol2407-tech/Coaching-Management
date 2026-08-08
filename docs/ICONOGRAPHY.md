---
title: EduTrack Iconography
purpose: Define the meaning, construction, labeling, and use of icons across EduTrack.
scope: Icon semantics, source, sizing, alignment, status communication, accessibility, localization, and contribution.
audience: Product Design, Design Systems, Engineering, Content, QA, Accessibility, and AI implementation contributors.
related_documents:
  - ./DESIGN_TOKENS.md
  - ./COLOR_SYSTEM.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./COPYWRITING_GUIDELINES.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./NOTIFICATION_SYSTEM.md
review_frequency: Quarterly and before adding or replacing a shared icon
owner: Product Design and Design Systems
version: 1.0.0
status: Active foundation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Settings, AI Assistant, Permission
---

# EduTrack Iconography

## Purpose

Icons support recognition, scanning, and status comprehension. They do not replace canonical labels or create a separate vocabulary for Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, or Settings.

## Scope and ownership

This handbook owns icon meaning, selection, alignment, and accessibility behavior. [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) owns semantic color and non-color status pairing; [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md) owns labels; [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) owns component placement and interaction.

## Implementation principles

1. Use an icon only when it reinforces a known action, object, or status.
2. Pair every meaningful icon with visible text or an accessible name unless the icon is a universally understood control with an explicit accessible label.
3. Use one icon for one meaning within the product. Do not reuse a delete icon for archive, remove, or dismiss.
4. Keep icon geometry, stroke or fill behavior, optical alignment, and state treatment consistent within a component family.
5. Prefer an existing approved icon before adding a new asset; document why an existing icon cannot express the intended meaning.

## Design standards

- Icon-only buttons must expose an accessible name, a visible focus indicator, a tooltip or equivalent contextual label where appropriate, and the action’s consequence.
- Status icons must be paired with text for Attendance, Fees, Exams, Reports, Analytics, Notifications, and AI Assistant states.
- Decorative icons must be hidden from the accessibility tree and must not receive focus.
- Icons must remain legible at the component’s supported size, high contrast, text enlargement, and mobile conditions.
- Do not use a warning icon to create urgency, a lock icon to imply security without evidence, or a sparkle icon to imply verified AI authority.
- Icons in Authentication, Permission, Security, and Fee flows must not obscure scope, consequence, or recovery copy.

## Engineering standards

- Use a single registry and typed names; reject unregistered icon references in shared components.
- Optimize assets without removing semantic detail or introducing layout shift.
- Ensure SVGs have safe defaults, no unexpected external references, and no embedded user data.
- Test icon-only actions with keyboard, screen reader, touch, RTL, and localization scenarios.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md). Icons never carry the only status signal. Provide text alternatives for meaningful images, correct names and roles, visible focus, sufficient target size, and reduced-motion-safe behavior.

## AI implementation notes

The AI Assistant may select only registry icons and must explain uncertain mappings for human review. It must not infer a permission, security, payment, or publication state from an icon alone, and it must never generate an icon that uses a culturally ambiguous symbol without review.

## Review checklist

- [ ] Meaning and non-meanings are documented.
- [ ] Existing registry icons were considered.
- [ ] Visible label or accessible name is present.
- [ ] Status is also communicated textually.
- [ ] Mobile, high contrast, localization, and RTL behavior are reviewed.

## Validation checklist

- [ ] Registry and type checks pass.
- [ ] No unlabeled icon-only controls remain.
- [ ] Decorative icons are excluded from the accessibility tree.
- [ ] Representative Dashboard, Attendance, Fees, Notifications, Authentication, and Settings checks pass.
- [ ] Evidence is linked in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)