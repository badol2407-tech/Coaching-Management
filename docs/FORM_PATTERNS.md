---
title: EduTrack Form Patterns
purpose: Define canonical form structures for safe, understandable, and recoverable enterprise data entry.
scope: Form composition, field grouping, validation flow, review, save, reset, search, filters, drafts, and recovery.
out_of_scope: Design-token definitions, individual component behavior, API contracts, validation business rules, and backend persistence.
owner: Product Design, Forms Design System, Frontend Engineering, and QA
status: Canonical source of truth for form patterns
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./FORM_DESIGN_GUIDE.md
  - ./STATE_SYSTEM.md
  - ./INTERACTION_DESIGN.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
---

# EduTrack Form Patterns

This is the single source of truth for reusable form structures. [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) remains the detailed form authority; this handbook organizes its approved patterns without duplicating field or token standards.

## Purpose

Help users enter, review, save, correct, and recover information without losing context or safe input.

## Scope

This handbook owns form-level composition and workflow patterns. [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) owns field and control behavior; business rules remain in the owning workflow.

## Principles

| Principle | Practical rule |
| --- | --- |
| One question per field | Ask for one understandable value and group only related questions. |
| Context before entry | State object, Organization, scope, consequence, required status, and visibility before users commit data. |
| Validate helpfully | Validate when a problem becomes knowable; identify the field, correction, and next step. |
| Preserve safe input | Never clear recoverable values because of validation, network, authorization, or server failure. |
| Review before consequence | Require scope and effect review before consequential, financial, privacy, permission, publish, or bulk actions. |

## Best Practices

| Pattern | Use when | Required behavior |
| --- | --- | --- |
| Create or edit form | A user records or changes one object. | Purpose, scope, grouped fields, validation, save state, reset distinction, and recovery are visible. |
| Search and filter form | A user narrows records or report scope. | Active filters, searched dataset, clear/reset, no-results, loading, and error states remain visible. |
| Multi-step workflow | The task has meaningful stages or review points. | Preserve progress, scope, back navigation, safe drafts, and a final review before commit. |
| Review and commit | The action has material consequence. | Show affected records, values, permission, privacy, financial, or publishing consequence before commit. |
| Inline edit | A small change is safer in place than in a separate form. | Keep identity, current value, cancel, validation, save state, and recovery adjacent. |
| Bulk action form | One operation affects a selected set. | Show selection scope, count, exclusions, consequence, pending state, partial result, and retry path. |

## Enterprise SaaS Guidelines

- Never make fields required solely for completeness or AI convenience.
- Separate identity, enrollment, attendance, fee, exam, report, profile, organization, and permission groups when their consequences differ.
- Preserve safe drafts when interruption or long entry is likely.
- Distinguish Save, Apply, Reset, Cancel, Publish, Delete, and Close; do not use generic labels when consequence differs.
- Keep permission, privacy, financial, and educational consequences explicit and reviewable.
- Use [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) as the source for detailed field, validation, search, save, and reset rules.

## Mobile-first & Responsive Rules

- Forms must be completable at narrow widths without essential horizontal scrolling.
- Stack related fields and actions in task order; preserve labels, instructions, errors, and scope.
- Keep primary commit and recovery actions reachable without hover or precision gestures.
- Preserve draft, filter, and search values through reflow, orientation, zoom, loading, and recoverable failure.
- Use existing responsive field and action patterns; do not create a form-specific breakpoint or density rule.

## Accessibility (WCAG 2.2 AA)

- Every field has a persistent programmatic label, understandable instruction, constraint, and associated error.
- Keyboard order follows the task order; focus remains visible and returns predictably after transitions.
- Required, optional, invalid, pending, saved, partial, and failed states are not conveyed by color alone.
- Error messages preserve safe input and identify the correction and next step.
- Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and the control contracts in [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).

## AI Rules

- Reuse existing form patterns, fields, controls, validation language, and workflow behavior.
- Never invent a field, variant, size, token, validation rule, or commit consequence.
- Never redesign product identity or change a form’s business meaning to make it visually simpler.
- Improve only grouping, order, hierarchy, spacing relationships, responsive behavior, accessibility, and usability.
- Never include implementation code or silently remove a field, state, permission check, or recovery path.

## Validation Checklist

- [ ] The form pattern matches an approved create, edit, search, filter, review, inline, multi-step, or bulk workflow.
- [ ] Object, scope, required/optional status, consequence, primary action, reset behavior, and recovery are clear.
- [ ] Existing form and component standards are referenced rather than duplicated.
- [ ] Safe input, drafts, filters, loading, empty, error, partial, and unknown-outcome behavior is defined where relevant.
- [ ] Mobile-first reflow, keyboard order, labels, errors, focus, zoom, localization, and reduced motion are preserved.
- [ ] No tokens, hardcoded values, duplicate field patterns, or implementation code were added.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Forms Design System, Frontend Engineering, and QA |
| Status | Canonical source of truth for form patterns |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Scope | Reusable enterprise form structures and recovery flows |
| Out of Scope | Tokens, field implementation, API contracts, business validation rules, and persistence |