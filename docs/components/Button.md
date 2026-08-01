---
title: EduTrack Button Handbook
purpose: Define the contract for actions that change state, submit work, or initiate an operation.
scope: Action buttons across all EduTrack modules and roles.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../DESIGN_SYSTEM_GUIDE.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../COPYWRITING_GUIDELINES.md
review_frequency: Quarterly and before action, token, or accessibility changes
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Button, action, primary, secondary, destructive, pending, disabled
---

# Button

## Purpose

Use a Button when activating it performs an operation in the current context: saving, creating, submitting, applying, exporting, or confirming.

## Non-goals

Do not use a Button for navigation, text that is not actionable, or an icon-only action whose meaning cannot be made unambiguous. Use [Link](./Link.md) for navigation.

## Anatomy and variants

Every Button has an accessible name and a visible label unless it is an [Icon Button](./Icon%20Button.md). Supported variants are primary, secondary, quiet, and destructive. Variants communicate hierarchy, not permission.

## States and behavior

Support default, hover, focus-visible, pressed, pending, success feedback, disabled, and error-recovery states. Pending prevents duplicate submission, preserves the label or adds a clear progress cue, and does not remove the user’s input. Disabled is reserved for an unavailable action; explain why when the reason is not obvious. Destructive actions require scope and consequence confirmation.

## Accessibility and responsive behavior

Use a native button with `type` set explicitly inside forms. Keyboard activation, visible focus, 44×44 CSS pixel touch targets, contrast, and reduced-motion behavior follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md). Labels remain understandable at 200% zoom and with localization.

## Content and examples

Use verb-plus-object labels such as “Save profile,” “Record payment,” “Publish results,” or “Review AI suggestion.” Do not use “Click here,” “Submit,” or an icon as the only name.

## Review evidence

Verify keyboard activation, focus return, pending/duplicate prevention, error recovery, permission behavior, destructive confirmation, long labels, zoom, mobile, and screen-reader name/state.