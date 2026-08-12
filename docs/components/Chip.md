---
title: EduTrack Chip Handbook
purpose: Define compact selectable, removable, or filter-summary values with clear state and scope.
scope: Applied filters, selected values, categories, and reversible compact selections.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FILTER_SYSTEM.md
  - ../FORM_DESIGN_GUIDE.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before filter, selection, or accessibility changes
owner: Product Design, Design Systems, Content, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Chip, filter, selected, removable, applied scope, clear
---

# Chip

## Purpose

Use a Chip to summarize a selected value, applied filter, or reversible compact choice while keeping its meaning and scope visible.

## Non-goals

Do not use it as a decorative pill, the only representation of a record status, or an implicit action without a clear label and state. Use [Badge](./Badge.md) for compact non-interactive counts/status and [Tag](./Tag.md) for descriptive classification.

## Anatomy and variants

Provide a readable label, visible relationship to the owning field or result set, and a remove or selection control when interactive. Support filter-summary, selected-value, and compact action variants with distinct semantics.

## States and behavior

Support draft, applied, selected, unselected, removable, focused, disabled, loading, and error-recovery states. Removing a Chip updates the owning filter or field predictably and preserves a clear/reset path. Distinguish draft selections from committed scope.

## Accessibility and responsive behavior

Expose the label, selected state, and remove action separately where needed; make the target keyboard and touch accessible; and never rely on color or shape alone. Allow wrapping or a summary at small widths without hiding applied scope. Follow [FILTER_SYSTEM.md](../FILTER_SYSTEM.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Status: overdue,” “Batch: Grade 8,” or “Teacher: Priya Shah.” Keep the value and filter dimension understandable without relying on position.

## Review evidence

Verify field association, applied/draft distinction, add/remove/clear behavior, keyboard and touch targets, long values, overflow, mobile summary, localization, and screen-reader naming.