---
title: EduTrack Tag Handbook
purpose: Define descriptive classification labels that help users scan and group content without implying interaction.
scope: Categories, subject labels, record classifications, and descriptive metadata.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../COLOR_SYSTEM.md
  - ../COPYWRITING_GUIDELINES.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../STATE_SYSTEM.md
review_frequency: Quarterly and before taxonomy, label, color, or accessibility changes
owner: Product Design, Design Systems, Content, and Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Tag, classification, category, metadata, label
---

# Tag

## Purpose

Use a Tag for descriptive classification or metadata that helps users scan an object without requiring an action.

## Non-goals

Do not use it as a disguised button, filter control, notification count, or the only signal for status, permission, severity, or consequence.

## Anatomy and variants

Provide concise descriptive text and a clear association with the record or content it describes. Support taxonomy, category, and metadata variants; interactive filtering belongs to [Chip](./Chip.md) or an explicit filter control.

## States and behavior

Support visible, updated, stale, loading, unauthorized, and hidden states as applicable. A Tag does not imply selection, completion, approval, or freshness unless the text explicitly says so and the owning standard permits it.

## Accessibility and responsive behavior

Expose the text in the reading order, use semantic color only as a supplement, and preserve meaning at zoom, high contrast, localization, and narrow widths. Avoid truncation that removes the classification’s meaning. Follow [COLOR_SYSTEM.md](../COLOR_SYSTEM.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Mathematics,” “Grade 8,” “Optional,” or “AI-generated draft.” Keep labels canonical and parallel; do not use vague tags such as “Other” without context.

## Review evidence

Verify object association, taxonomy meaning, non-interactive semantics, non-color cues, long-label wrapping, localization, mobile layout, screen-reader order, and whether the label should be a Chip or Badge.