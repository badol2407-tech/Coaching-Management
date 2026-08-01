---
title: EduTrack Multi Select Handbook
purpose: Define accessible selection of multiple values from a known set with visible scope and removal.
scope: Filters, tags, permissions, batches, statuses, and other multi-value choices.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FILTER_SYSTEM.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../PERMISSION_DESIGN.md
review_frequency: Quarterly and before selection, permission, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Multi Select, selected, option, clear, remove, applied scope
---

# Multi Select

## Purpose

Use a Multi Select when a user may choose more than one value from a known set and the selected scope must remain visible and editable.

## Non-goals

Do not use it for a single choice, an unbounded text collection, or hidden filter state. Use [Select](./Select.md), [Autocomplete](./Autocomplete.md), or a dedicated editor when those better match the task.

## Anatomy and variants

Provide a persistent label, selected-value summary, option list, selected state, clear-all action where useful, and removal affordance for each selected value. In filters, expose applied scope before results are interpreted.

## States and behavior

Support empty, focused, open, option-highlighted, selected, partially selected groups when applicable, loading, invalid, disabled, and error states. Selection must be reversible. Applying filters and editing saved data must distinguish draft selection from committed state.

## Accessibility and responsive behavior

Expose the control name, expanded state, selected options, active option, and removal actions to assistive technology. Provide complete keyboard operation and a mobile summary/apply path. Follow [FILTER_SYSTEM.md](../FILTER_SYSTEM.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Statuses,” “Batches,” or “Organization roles,” not “Choose options.” Summaries state count and scope, such as “3 statuses selected.”

## Review evidence

Verify add/remove/clear, keyboard navigation, applied versus draft state, selection persistence, long labels, many selections, mobile conversion, permission consequences, and screen-reader announcements.