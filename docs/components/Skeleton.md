---
title: EduTrack Skeleton Handbook
purpose: Define stable structural placeholders while known content is loading.
scope: Student lists, Dashboard summaries, Report layouts, record details, and other predictable content structures.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../LOADING_STATES.md
  - ../STATE_SYSTEM.md
  - ../MOTION_GUIDELINES.md
  - ../ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before loading, layout, or motion changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Skeleton, placeholder, loading, structure, stable layout
---

# Skeleton

## Purpose

Use a Skeleton when the structure and approximate shape of expected content are known and a stable layout helps users maintain context while it loads.

## Non-goals

Do not use it to invent values, imply completeness, mask slow or failed work, replace an error or empty state, or animate indefinitely when no content is expected.

## Anatomy and variants

Provide structural placeholders that correspond to real content regions, preserve meaningful headings or scope where possible, and avoid fake text that could be mistaken for data. Support list, card, detail, table, and metric structures only when their resulting layout is known.

## States and behavior

Support initial, loading, delayed, stale-refresh, resolved, empty, partial, error, and unauthorized transitions. Replace the placeholder with truthful content or the appropriate Empty or Error State; do not silently convert a failed request to an empty layout.

## Accessibility and responsive behavior

Expose a concise loading status without making every decorative shape a separate announcement. Preserve focus and layout stability, honor reduced motion, support high contrast, and reflow the known structure at 320 CSS pixels. Follow [LOADING_STATES.md](../LOADING_STATES.md), [STATE_SYSTEM.md](../STATE_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use Skeleton for a Student list or Dashboard metric layout when the fields are known. Do not show placeholder names, amounts, grades, or statuses that resemble real records.

## Review evidence

Verify structural correspondence, loading status, focus stability, transition to ready/empty/error, reduced motion, high contrast, mobile reflow, long-content resilience, and absence of false values.