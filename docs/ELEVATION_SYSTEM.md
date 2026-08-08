---
title: EduTrack Elevation System
purpose: Define how surfaces, layering, and depth communicate hierarchy, relationship, and interaction without obscuring content.
scope: Surface levels, overlays, dialogs, shadows, borders, focus, stacking, and high-contrast behavior.
audience: Product Design, Design Systems, Engineering, QA, Accessibility, and AI implementation contributors.
related_documents:
  - ./DESIGN_TOKENS.md
  - ./COLOR_SYSTEM.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./INTERACTION_DESIGN.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./STATE_SYSTEM.md
review_frequency: Quarterly and before changing shared surface or overlay behavior
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Active foundation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Sidebar, Notifications, Search, Filters, Settings, Authentication, Permission, Organization, Workspace, AI Assistant
---

# EduTrack Elevation System

## Purpose

Elevation establishes relationships between surfaces and makes active layers understandable. It must clarify a dialog over Fees or a Notification over Dashboard without hiding scope, status, or recovery.

## Scope and ownership

This handbook owns semantic elevation levels, overlay ordering, and depth expression. [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) owns surface and border meaning; [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) owns component behavior; [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) owns consequences and recovery.

## Implementation principles

1. Use the lowest elevation that clearly separates related surfaces.
2. Reserve overlays for interruption, transient feedback, or focused work; do not use elevation to hide primary navigation or required context.
3. Every overlay has a named owner, dismissal rule, focus behavior, scroll behavior, and escape path.
4. Depth is supplementary. Borders, headings, spacing, and semantics must still communicate grouping when shadows are unavailable.
5. Do not stack competing overlays. A Permission confirmation, Fee confirmation, or Authentication recovery action must have one clear active layer.

## Design standards

- Define semantic levels for canvas, raised surface, sticky region, popover, dialog, and system-level interruption in the token registry.
- Keep overlay order deterministic across Dashboard, Search, Filters, Notifications, Settings, Authentication, and AI Assistant.
- Dialogs must retain enough background context to identify the affected Student, Fee, Exam, Report, Permission, Organization, or Workspace.
- Shadows must not be the only boundary in high contrast or forced-colors environments.
- Sticky headers and toolbars must not obscure focused content or live status.
- A destructive, financial, publication, security, or permission dialog must expose consequence, scope, primary action, and safe exit.

## Engineering standards

- Maintain one stacking-context contract; do not repair layering with arbitrary z-index values.
- Prevent background interaction while a modal dialog is active and restore focus to the invoking control on close.
- Avoid clipping menus, tooltips, and validation messages at scroll or container boundaries.
- Test overlay behavior with long content, zoom, keyboard navigation, mobile viewport, slow loading, and failure states.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) for focus visibility, modal focus management, contrast, keyboard escape, and non-color boundaries. Reduced motion must not remove the information that a new layer opened.

## AI implementation notes

The AI Assistant may propose an overlay level from the approved registry but must not turn an informational suggestion into a blocking dialog. Generated Permission, Fee, Exam, Report, or Authentication flows require human review of scope and dismissal behavior.

## Review checklist

- [ ] Elevation expresses a documented relationship and not decoration.
- [ ] The active layer, scope, consequence, and exit are clear.
- [ ] Background context and focus behavior are preserved.
- [ ] High contrast, zoom, keyboard, mobile, and reduced-motion behavior are checked.
- [ ] No arbitrary stacking value or hidden interaction remains.

## Validation checklist

- [ ] All elevation references resolve to registered tokens.
- [ ] Modal, popover, sticky, and Notification layering tests pass.
- [ ] Keyboard and screen-reader focus returns correctly.
- [ ] Dashboard, Fees, Permissions, Notifications, Settings, and AI Assistant examples pass.
- [ ] Evidence is linked in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)