---
title: EduTrack Select Handbook
purpose: Define single-choice selection from a known, bounded set of options.
scope: Single-value forms, filters, and workflow choices.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../FILTER_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../STATE_SYSTEM.md
review_frequency: Quarterly and before option, validation, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Select, option, placeholder, selected, open, listbox
---

# Select

## Purpose

Use a Select when a user must choose exactly one value from a known, bounded set and seeing all or most options supports the decision.

## Non-goals

Do not use it for free text, multiple independent values, or a long searchable dataset. Use [Text Field](./Text%20Field.md), [Multi Select](./Multi%20Select.md), or [Autocomplete](./Autocomplete.md).

## Anatomy and variants

Provide a persistent label, selected value, option list, optional instruction, constraint, and error. A placeholder is not a value. Group options only when grouping improves comprehension and labels are meaningful.

## States and behavior

Support empty, selected, focused, open, keyboard-highlighted, disabled, read-only, invalid, loading, and error states. Opening does not commit a value; selection is clear and reversible. Preserve the value if options fail to load and explain the recovery path.

## Accessibility and responsive behavior

Prefer a native select when it meets the need. If a custom listbox is required, implement the appropriate name, expanded, selected, active, and relationship semantics with complete keyboard behavior. Follow [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Label the decision: “Attendance session,” “Exam period,” or “Payment status.” Use concise, mutually exclusive options and avoid unexplained abbreviations.

## Review evidence

Verify keyboard navigation, type-ahead, selection commit, escape/cancel, outside-click behavior, loading/error recovery, long options, mobile presentation, zoom, and screen-reader state.