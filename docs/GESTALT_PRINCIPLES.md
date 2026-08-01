---
title: EduTrack Gestalt Principles
purpose: Provide explanatory principles for grouping, hierarchy, and visual comprehension.
scope: Proximity, similarity, common region, continuity, closure, figure and ground, common fate, and hierarchy.
audience: Product Design, Design Systems, Content, Engineering, QA, and reviewers.
related_documents:
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./COLOR_SYSTEM.md
  - ./TYPOGRAPHY_SYSTEM.md
  - ./COMPONENT_SPECIFICATIONS.md
review_frequency: Annually and when visual language or information hierarchy changes
owner: Product Design and Design Systems
version: 1.0.0
status: Explanatory guidance
last_updated: 2026-08-01
normative_level: Advisory rationale
canonical_terms: hierarchy, grouping, proximity, similarity, common region, figure and ground
---

# EduTrack Gestalt Principles

Gestalt principles describe how people perceive relationships, grouping, continuation, and hierarchy. Use them to clarify work, never to conceal cost, risk, permission, uncertainty, or system status. The dedicated [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) and [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) define tokens; this file defines the reasoning behind their use.

## Proximity

**Rule:** Place information that must be compared or acted on together close together, and separate unrelated information.

**Examples:** Keep Fee amount, balance, payment action, and receipt status together; keep Attendance status beside Student identity; keep Report scope beside interpretation; keep AI confidence and source context beside generated output.

**Measure:** A task test shows users can identify the relevant value and action without scanning unrelated regions.

## Similarity

**Rule:** Make elements with the same meaning look and behave alike; make different meanings distinguishable without relying on color alone.

**Examples:** Active and inactive Students use the same status pattern across lists; Teacher and Student search fields share behavior; Present, Absent, Late, and Excused Attendance states use text plus semantic cues; Fee statuses remain consistent in Dashboard and Reports.

**Measure:** Equivalent states and actions have one documented component or token pattern.

## Common region

**Rule:** Use a shared region to communicate a real relationship, not to decorate or imply a false relationship.

**Examples:** A Student Profile region may contain enrollment and coaching information allowed to that role; an Analytics region may group a chart with its scope and freshness; an Organization region may group Role controls with their impact.

**Measure:** Every grouping boundary has a content, task, or permission rationale.

## Continuity

**Rule:** Use alignment, sequence, and consistent flow to show how users move through a task or how data relates over time.

**Examples:** Dashboard-to-Student navigation preserves identity; Attendance dates form a clear timeline; Exam results align subjects with outcomes; Report filters lead to results and export; Authentication steps make progress and recovery clear.

**Measure:** Users can describe the next step and the relationship between adjacent stages.

## Closure

**Rule:** Allow users to understand a complete object or workflow without requiring them to infer missing system state. Never use visual closure to hide incomplete or pending work.

**Examples:** An Attendance session is not visually “complete” until its completion rule is met; Fee reconciliation distinguishes pending from paid; Report cards identify unavailable data; AI drafts remain open until human review.

**Measure:** Complete, partial, pending, blocked, and failed states are explicitly labeled.

## Figure and ground

**Rule:** Establish a clear subject and background while preserving contrast and focus visibility. Do not make secondary content visually disappear when it carries a consequence.

**Examples:** A Dashboard exception can be prominent, but Report scope and Fee terms remain readable; a modal must not obscure the Student identity or destructive consequence; mobile navigation must not hide Authentication errors.

**Measure:** Critical content remains perceivable at zoom, high contrast, grayscale, and with assistive technology.

## Common fate

**Rule:** Motion or synchronized change may indicate a shared process only when it is necessary, brief, and available without motion.

**Examples:** A group of Attendance rows may show a bulk-save state; Analytics may refresh related measures together; Notifications may update as one feed; AI generation may show one process state. Never animate a Fee balance or permission change in a way that implies success before acceptance.

**Measure:** The same meaning is available in text and state, and `prefers-reduced-motion` removes nonessential movement.

## Prägnanz and hierarchy

**Rule:** Prefer the simplest structure that preserves required meaning, context, and control. Simplicity must not remove labels, scope, auditability, or recovery.

**Examples:** Search exposes common filters first; a Dashboard avoids decorative cards; Exam results show the needed context; Profile forms separate required and optional disclosure; future enterprise modules reuse stable patterns.

**Measure:** A reviewer can explain every visual hierarchy decision in terms of a user goal, risk, or information relationship.

See [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md), [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md), and [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md).