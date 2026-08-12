---
title: EduTrack Textarea Handbook
purpose: Define multi-line text entry for notes, explanations, descriptions, and other bounded long-form values.
scope: Multi-line fields in records, forms, drafts, and review workflows.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../COPYWRITING_GUIDELINES.md
  - ../STATE_SYSTEM.md
review_frequency: Quarterly and before content, validation, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Textarea, long-form, character count, draft, error
---

# Textarea

## Purpose

Use a Textarea for meaningful multi-line content such as a teacher note, student description, report explanation, or review comment.

## Non-goals

Do not use it for a single-line value, structured rich content, or a hidden draft store. Use [Text Field](./Text%20Field.md) for short values and the owning workflow’s draft pattern for interruption recovery.

## Anatomy and variants

Provide a persistent label, instruction when needed, visible resize affordance where supported, and a character or length constraint when one exists. A character count must explain whether it is a limit or recommendation.

## States and behavior

Support empty, filled, focused, pending, read-only, disabled, invalid, and server-error states. Preserve line breaks and safe input across validation and network failures. Do not unexpectedly reformat or truncate user text.

## Accessibility and responsive behavior

Associate the label, instruction, constraint, and error programmatically. Support keyboard editing, zoom, text enlargement, mobile scrolling, and reduced motion in line with [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use labels such as “Reason for absence” or “Teacher note.” Tell users what useful detail belongs in the field and who can see sensitive content.

## Review evidence

Verify multiline keyboard behavior, preservation of whitespace, limits, pasted content, long text, localization, mobile editing, draft recovery, validation, and screen-reader descriptions.