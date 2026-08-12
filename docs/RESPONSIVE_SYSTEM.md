---
title: EduTrack Responsive System
purpose: Define how EduTrack preserves hierarchy, task access, and data meaning across viewport sizes, input methods, zoom, and device conditions.
scope: Breakpoint behavior, reflow, responsive navigation, density, touch, orientation, zoom, offline constraints, and platform adaptation.
audience: Product Design, Design Systems, Engineering, QA, Accessibility, Mobile, and AI implementation contributors.
related_documents:
  - ./LAYOUT_GRID.md
  - ./SPACING_SYSTEM.md
  - ./MOBILE_UX_GUIDE.md
  - ./NAVIGATION_STANDARDS.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./LOADING_STATES.md
review_frequency: Quarterly and before a responsive shell, breakpoint, or mobile platform change
owner: Product Design, Design Systems, Frontend Engineering, Mobile Engineering, and QA
version: 1.0.0
status: Binding foundation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Sidebar, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, Authentication, AI Assistant, Workspace
---

# EduTrack Responsive System

## Purpose

Responsive behavior preserves the same product meaning while the available space, input method, network, and orientation change. A Teacher marking Attendance on mobile and an administrator reviewing Reports on desktop must retain scope, status, and control.

## Scope and ownership

This handbook owns cross-viewport adaptation. [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md) owns mobile-specific task and platform behavior; [LAYOUT_GRID.md](./LAYOUT_GRID.md) owns geometry; [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) owns reflow and operation requirements.

## Implementation principles

1. Design from content and task thresholds, not device-name assumptions.
2. Preserve hierarchy, labels, status, scope, and primary actions when regions reflow or collapse.
3. Adapt controls to the available input method without changing the underlying meaning or Permission.
4. Prefer stacking, wrapping, progressive disclosure, and resilient tables over inaccessible clipping.
5. Treat network variability, orientation, zoom, dynamic text, and reduced motion as supported conditions.

## Design standards

- Define responsive modes by behavior: page frame, Sidebar, tables, forms, Search, Filters, Notifications, charts, and dialogs.
- Keep Workspace, Organization, page heading, primary action, and current scope visible or reachable in every mode.
- Touch targets follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md); controls must not depend on hover or precision gestures.
- Tables reflow, prioritize, or provide a deliberate review surface; do not silently omit Fee amounts, Exam status, Attendance state, Report scope, or Student/Teacher identity.
- Dialogs and menus fit the viewport, preserve focus, and offer platform back and close behavior.
- Mobile Authentication, Fee, Exam, Permission, Report, and AI actions show consequence and recovery before commitment.

## Engineering standards

- Use content-driven CSS and responsive tokens; do not hardcode device-specific assumptions in business logic.
- Test supported viewport ranges, orientation, zoom, text enlargement, keyboard, touch, screen reader, offline, slow network, and browser zoom.
- Preserve route, Search, Filter, form, and operation state across responsive transitions.
- Avoid layout shift, horizontal scroll for essential tasks, fixed overlays that obscure focus, and hover-only affordances.
- Measure mobile performance and interaction latency for Dashboard, Search, Attendance, Fees, Reports, Authentication, and AI Assistant.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md): reflow without loss of content or action, usable at 200% zoom, visible focus, accessible touch targets, no essential hover or gesture dependency, and reduced-motion support.

## AI implementation notes

AI-generated responsive changes must be checked across all supported modes and must not hide scope, Permission, Notifications, uncertainty, or consequential actions to fit a viewport.

## Review checklist

- [ ] Responsive modes are defined by behavior and task, not device labels alone.
- [ ] Scope, hierarchy, primary action, status, Search, Filters, and recovery persist.
- [ ] Tables, charts, dialogs, Sidebar, Authentication, and AI Assistant behavior are specified.
- [ ] Zoom, text enlargement, orientation, offline, and localization are reviewed.
- [ ] Performance and accessibility evidence is complete.

## Validation checklist

- [ ] Essential workflows pass at supported viewport and zoom conditions.
- [ ] No clipped, obscured, hover-only, gesture-only, or horizontal-scroll blocker remains.
- [ ] Dashboard, Students, Attendance, Fees, Exams, Reports, Settings, mobile, and AI Assistant examples pass.
- [ ] Back, close, focus restoration, loading, and error behavior pass.
- [ ] Evidence is recorded in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md)
- [LAYOUT_GRID.md](./LAYOUT_GRID.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)