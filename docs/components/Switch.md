---
title: EduTrack Switch Handbook
purpose: Define an immediate binary setting whose on/off state and consequence are easy to understand.
scope: Preferences and reversible settings, not multi-step workflow decisions.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../SECURITY_UX.md
review_frequency: Quarterly and before setting, feedback, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Switch, on, off, setting, immediate, pending
---

# Switch

## Purpose

Use a Switch for a clearly named, reversible setting where changing the state takes effect immediately or is clearly queued.

## Non-goals

Do not use it for form values that require a later Save, mutually exclusive choices, or consequential permission/security changes without review. Use [Checkbox](./Checkbox.md), [Radio](./Radio.md), or the owning confirmation pattern.

## Anatomy and variants

Provide a persistent label, current on/off state, and consequence or status text when the effect is not obvious. The visual track and thumb supplement the text; they do not carry meaning alone.

## States and behavior

Support on, off, focused, disabled, pending, success, and error-recovery states. Pending prevents conflicting toggles, reports the actual system state, and lets the user retry. Never claim a change succeeded before it is persisted.

## Accessibility and responsive behavior

Expose a switch role and checked state only when a custom control is necessary; native semantics are preferred. Provide keyboard operation, visible focus, touch separation, contrast, and non-color state cues per [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Use “Email attendance summaries” or “Show archived students,” not bare “On” or “Off.” Explain privacy, permission, or notification consequences before the toggle when material.

## Review evidence

Verify immediate feedback, pending/error recovery, actual persisted state, keyboard operation, label association, screen-reader state, mobile target, permissions, and reduced motion.