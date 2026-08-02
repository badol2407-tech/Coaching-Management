---
title: EduTrack Accessibility Guide
purpose: Define practical accessibility application patterns for enterprise SaaS interfaces.
scope: Semantic structure, keyboard access, focus, names and descriptions, forms, data, states, responsive transformations, motion, and review evidence.
out_of_scope: Replacing WCAG, defining token values, component implementation, app code, business logic, and automated tooling configuration.
owner: Accessibility, Product Design, Design Systems, Frontend Engineering, and QA
status: Canonical source of truth for practical accessibility patterns
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./ACCESSIBILITY_TESTING.md
  - ./RESPONSIVE_SYSTEM.md
  - ./RESPONSIVE_PATTERNS.md
  - ./FORM_PATTERNS.md
  - ./DATA_DISPLAY.md
  - ./NAVIGATION_PATTERNS.md
---

# EduTrack Accessibility Guide

This is the single source of truth for applying accessibility patterns in product work. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) remains the normative WCAG 2.2 AA acceptance authority; this guide does not create competing thresholds.

## Purpose

Make every enterprise workflow perceivable, operable, understandable, robust, and recoverable for people using different input methods, assistive technologies, viewport sizes, and preferences.

## Scope

This handbook owns practical accessibility pattern selection and review across layout, navigation, forms, data, states, interaction, responsive transformation, and motion.

## Principles

| Principle | Practical rule |
| --- | --- |
| Equivalent access | Every essential meaning, status, control, and recovery path has an accessible equivalent. |
| Semantics first | Use the native element and correct structure before adding ARIA. |
| Visible operation | Focus, current state, errors, status, and action consequences are perceivable without relying on color or motion. |
| Predictable flow | Reading order, keyboard order, focus movement, labels, and recovery follow the user’s task. |
| User preference | Respect reduced motion, zoom, text growth, input method, and assistive-technology needs. |
| Evidence over assumption | Combine automated checks with keyboard, screen-reader, zoom, mobile, and realistic task review. |

## Best Practices

| Pattern | Required behavior |
| --- | --- |
| Semantic structure | Use landmarks, headings, lists, tables, forms, buttons, links, and native controls according to meaning. |
| Names and descriptions | Give every interactive control an accessible name; associate instructions, constraints, status, and errors programmatically. |
| Focus management | Preserve logical focus order, visible focus, focus containment where required, and predictable focus restoration. |
| Keyboard interaction | Support every essential action without pointer, hover, drag, or precision-only interaction. |
| Forms and errors | Keep labels persistent, distinguish required and optional, preserve safe input, and explain correction and next step. |
| Data and status | Provide text meaning, units, scope, summaries, table alternatives, and non-color status cues. |
| Dynamic updates | Announce meaningful loading, completion, error, partial, and stale changes without excessive interruption. |
| Responsive access | Preserve equivalent content, controls, reading order, and recovery after transformation. |

## Enterprise SaaS Guidelines

- Apply stronger care to Fee, permission, privacy, security, attendance, exam, report, authentication, and AI-assisted workflows.
- Do not expose sensitive information through labels, status messages, focus announcements, or error detail.
- Keep scope, role, Organization, affected records, consequence, and recovery understandable to assistive technology.
- Treat accessibility as a release requirement, not a styling pass.
- Use [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) for evidence collection and [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) for component acceptance.

## Mobile-first & Responsive Rules

- Accessibility behavior must work at the smallest supported layout before desktop enhancement.
- Preserve labels, landmarks, focus, target access, status, and recovery when content stacks, collapses, scrolls, or transforms.
- Ensure touch, keyboard, screen-reader, zoom, localization, and reduced-motion users have equivalent access.
- Never hide critical content or actions solely to fit a viewport.
- Follow responsive transformations in [RESPONSIVE_PATTERNS.md](./RESPONSIVE_PATTERNS.md) and foundations in [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md).

## Accessibility (WCAG 2.2 AA)

- Conform to WCAG 2.2 AA through the requirements in [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).
- Preserve perceivable information, operable interaction, understandable behavior, robust semantics, visible focus, keyboard access, touch access, contrast, reflow, and reduced motion.
- Do not define local exceptions, local thresholds, or weaker component rules.
- When a pattern conflicts with accessibility, accessibility and equivalent access take priority under [UI_MASTER_RULES.md](./UI_MASTER_RULES.md).

## AI Rules

- Never treat accessibility as optional polish or infer conformance from visual appearance.
- Reuse existing accessibility patterns, semantic structures, component contracts, and testing evidence.
- Never invent ARIA roles, keyboard models, focus behavior, thresholds, exceptions, tokens, or implementation code.
- Improve only equivalent access, semantic clarity, focus, labels, status, responsive behavior, and usability.
- Stop and escalate when an existing pattern cannot meet an accessibility requirement.

## Validation Checklist

- [ ] Applicable WCAG 2.2 AA requirements and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) evidence are identified.
- [ ] Semantic structure, accessible names, labels, descriptions, keyboard access, visible focus, and programmatic state are present.
- [ ] Errors, loading, success, partial, stale, unauthorized, and unknown states have accessible equivalents.
- [ ] Tables, charts, forms, navigation, overlays, and responsive transformations preserve equivalent access.
- [ ] Keyboard, screen-reader, touch, zoom, localization, reduced-motion, and realistic task review are complete.
- [ ] No local thresholds, token definitions, hardcoded values, duplicate rules, or implementation code were added.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Accessibility, Product Design, Design Systems, Frontend Engineering, and QA |
| Status | Canonical source of truth for practical accessibility patterns |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) |
| Scope | Practical accessibility application and review patterns |
| Out of Scope | WCAG authority replacement, tokens, components, app code, business logic, and tooling configuration |