---
title: EduTrack Radio Handbook
purpose: Define mutually exclusive choices where exactly one value is selected from a visible set.
scope: Forms, filters, workflow decisions, and review choices with a bounded option set.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../FILTER_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
review_frequency: Quarterly and before option, validation, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Radio, group, option, selected, required, roving focus
---

# Radio

## Purpose

Use Radio when a user must choose one value from a small, known set and comparing options is important.

## Non-goals

Do not use it for independent choices, a large searchable set, or a setting that changes immediately without review. Use [Checkbox](./Checkbox.md), [Autocomplete](./Autocomplete.md), or [Switch](./Switch.md).

## Anatomy and variants

Provide a group label or legend, one radio per mutually exclusive option, and supporting explanation for consequences or constraints. A group may have an explicit “None” option when no selection is valid.

## States and behavior

Support unselected, selected, focused, disabled, invalid, and pending states. Arrow keys move within the group; selection is not ambiguous and required groups explain what remains to be chosen. Do not silently change a consequential value without the owning workflow’s commit behavior.

## Accessibility and responsive behavior

Use native radio semantics or a correctly implemented radiogroup. Expose group and selected state, keep a visible focus indicator, and support keyboard and touch operation per [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use options such as “Present,” “Absent,” and “Excused” only when those values are mutually exclusive and defined in [GLOSSARY.md](../GLOSSARY.md). Keep each option parallel and distinguishable.

## Review evidence

Verify group label, arrow-key movement, tab behavior, required validation, disabled options, long labels, mobile layout, localization, and screen-reader selected state.