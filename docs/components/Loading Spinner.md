---
title: EduTrack Loading Spinner Handbook
purpose: Define brief indeterminate loading feedback when duration or resulting structure is not yet known.
scope: Short waits, action buttons, compact controls, and unknown-duration operations.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../LOADING_STATES.md
  - ../FEEDBACK_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../MOTION_GUIDELINES.md
review_frequency: Quarterly and before loading, motion, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Loading Spinner, indeterminate, pending, loading, retry
---

# Loading Spinner

## Purpose

Use a Loading Spinner for brief indeterminate work when the system cannot yet provide meaningful completion progress or a known structure.

## Non-goals

Do not use it as the only feedback for a long operation, as a decorative animation, or to hide a failed, empty, or unauthorized result. Use [Progress](./Progress.md) or [Skeleton](./Skeleton.md) when their contracts fit.

## Anatomy and variants

Provide a semantic loading status, affected object or action, and stable surrounding context. Support inline, button, overlay, and page-level variants without obscuring the user’s scope or removing safe controls.

## States and behavior

Support initial, loading, pending, delayed, complete, canceled, timeout, error, and unauthorized outcomes. Prevent duplicate actions, preserve focus and input, and provide retry or recovery when the operation fails. Never claim success because the Spinner stopped.

## Accessibility and responsive behavior

Expose loading text or status semantics, avoid rapid or distracting motion, honor reduced motion, and keep the indicator visible at zoom and high contrast. Use appropriate live-region politeness and do not move focus for routine waits. Follow [LOADING_STATES.md](../LOADING_STATES.md), [MOTION_GUIDELINES.md](../MOTION_GUIDELINES.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Loading student details” or “Saving attendance” rather than a bare visual indicator. For actions, keep the action’s object and pending state clear.

## Review evidence

Verify semantic status, timeout/error recovery, duplicate prevention, focus stability, reduced motion, screen-reader output, mobile visibility, high contrast, and truthful completion handling.