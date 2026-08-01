---
title: EduTrack Autocomplete Handbook
purpose: Define assisted text entry for choosing or resolving a value from a potentially large dataset.
scope: Related-record selection, known identifiers, names, and other searchable option sets.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../SEARCH_EXPERIENCE.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../PERMISSION_DESIGN.md
review_frequency: Quarterly and before data-source, matching, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Autocomplete, query, suggestion, active option, selected, match
---

# Autocomplete

## Purpose

Use an Autocomplete when users need to find and select a value from a large or remote dataset, such as a Student or Teacher record.

## Non-goals

Do not use it for a small fixed set, unstructured free text, or a suggestion list that silently changes the submitted value. Use [Select](./Select.md) or [Text Field](./Text%20Field.md) instead.

## Anatomy and variants

Provide a labeled input, query, suggestion list, active option, selected value, loading/status region, and clear or remove action. Define whether free text is allowed; default to requiring an explicit option selection when a record relationship is intended.

## States and behavior

Support empty, focused, querying, loading, suggestions, no match, selected, invalid, error, and disabled states. Preserve the query during failures, prevent stale responses from replacing newer results, and never commit a suggestion merely because it was displayed.

## Accessibility and responsive behavior

Implement the combobox/listbox relationship, expanded and active-option states, keyboard navigation, escape behavior, and announcement of loading/no-match status. Respect permissions and scope in suggestions. Follow [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Label the dataset and match rule: “Find a student by name or ID.” Explain when a choice is required and distinguish no match from unavailable data.

## Review evidence

Verify keyboard selection, focus retention, stale-result prevention, permission filtering, no-match recovery, duplicate names, long labels, mobile keyboard behavior, zoom, and screen-reader output.