---
title: EduTrack Responsive Patterns
purpose: Define canonical responsive transformations for enterprise SaaS layouts, workflows, data, and navigation.
scope: Mobile-first composition, reflow, transformation, priority, density, overlays, forms, data, navigation, and interaction continuity.
out_of_scope: Design-token definitions, breakpoint values, component implementation, business logic, and device-specific exceptions.
owner: Product Design, Design Systems, Frontend Engineering, Accessibility, and QA
status: Canonical source of truth for responsive patterns
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./LAYOUT_PATTERNS.md
  - ./PAGE_TEMPLATES.md
  - ./FORM_PATTERNS.md
  - ./DATA_DISPLAY.md
  - ./NAVIGATION_PATTERNS.md
  - ./ACCESSIBILITY_STANDARDS.md
---

# EduTrack Responsive Patterns

This is the single source of truth for responsive transformation patterns. [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) owns responsive foundations and evidence; this handbook owns pattern selection and task-preserving transformation.

## Purpose

Ensure enterprise work remains understandable, operable, and complete across available viewport sizes, input methods, zoom, localization, and orientation.

## Scope

This handbook owns mobile-first priority, region transformation, stacking, collapse, overflow, density changes, and continuity across responsive modes. It does not define breakpoint values or tokens.

## Principles

| Principle | Practical rule |
| --- | --- |
| Mobile-first | Design the essential task and content order before enhancing for larger space. |
| Preserve meaning | Transform placement or structure without losing labels, scope, status, evidence, or action meaning. |
| Priority over symmetry | Promote primary work and critical exceptions; defer secondary content. |
| Reflow before shrink | Stack or transform content before making it unreadable. |
| Continuity | Preserve focus, selection, filters, drafts, scroll context, and recovery through transformation. |

## Best Practices

| Pattern | Use when | Required behavior |
| --- | --- | --- |
| Stack | Regions are related but cannot remain side by side. | Preserve task order, grouping, labels, and actions. |
| Collapse | Secondary navigation or detail can be safely hidden. | Keep summary, state, trigger, and accessible expanded content. |
| Transform | Desktop structure becomes unreadable on narrow screens. | Use the approved mobile representation, not a clipped desktop copy. |
| Prioritize | The full dataset or action set cannot fit. | Keep critical scope, status, identity, decision evidence, and recovery. |
| Overflow or continuation | Content remains useful but cannot fit in one view. | Make continuation discoverable, labeled, keyboard-accessible, and non-essential where possible. |
| Preserve overlay context | Dialogs, Drawers, menus, or Toasts adapt to available space. | Keep focus, dismissal, scope, and affected content clear. |

## Enterprise SaaS Guidelines

- Essential Student, Teacher, Attendance, Fee, Exam, Report, Profile, Organization, and permission tasks must remain complete on mobile.
- Preserve financial, privacy, educational, authorization, and AI uncertainty context while transforming layouts.
- Do not hide exceptions, stale states, partial completion, errors, or recovery to fit a viewport.
- Use the existing transformations in [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [FORM_PATTERNS.md](./FORM_PATTERNS.md), [DATA_DISPLAY.md](./DATA_DISPLAY.md), and [NAVIGATION_PATTERNS.md](./NAVIGATION_PATTERNS.md).

## Mobile-first & Responsive Rules

- Establish content priority, focus order, action order, and reading order before visual placement.
- Reflow layout regions and form groups; transform tables, charts, navigation, and overlays through approved patterns.
- Preserve active filters, selected records, drafts, current location, scope, and status.
- Do not use fixed dimensions, clipped text, hover-only affordances, or essential horizontal scrolling.
- Use only verified responsive and visual definitions from [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

## Accessibility (WCAG 2.2 AA)

- Responsive changes preserve equivalent content, controls, landmarks, labels, focus, status, and recovery.
- Keyboard and assistive-technology order follows the transformed task order.
- Touch and pointer access remain available without precision-only interaction.
- Zoom, localization, reduced motion, and high-contrast conditions do not remove essential meaning or action.
- Apply the normative requirements in [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).

## AI Rules

- Never redesign the product or invent a separate mobile product language.
- Preserve branding, typography, palette, component style, tokens, and existing responsive conventions.
- Improve only layout transformation, priority, grouping, positioning, hierarchy, spacing relationships, accessibility, and usability.
- Never invent breakpoint values, component variants, responsive states, or hardcoded visual values.
- Prefer a lightweight transformation that preserves task completion and performance.

## Validation Checklist

- [ ] Essential tasks complete at narrow widths without loss of scope, evidence, action, or recovery.
- [ ] Layout, page, form, data, navigation, and interaction patterns use existing responsive transformations.
- [ ] Focus, keyboard order, screen-reader order, touch access, zoom, localization, and reduced motion are preserved.
- [ ] Loading, empty, error, partial, stale, unauthorized, and unknown states remain understandable.
- [ ] No tokens, hardcoded values, clipped critical content, duplicate responsive patterns, or implementation code were added.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Design Systems, Frontend Engineering, Accessibility, and QA |
| Status | Canonical source of truth for responsive patterns |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [LAYOUT_PATTERNS.md](./LAYOUT_PATTERNS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Scope | Responsive transformation, priority, continuity, and task preservation |
| Out of Scope | Tokens, breakpoint values, component implementation, business logic, and device-specific exceptions |