---
title: EduTrack FAB Handbook
purpose: Define accessible, contextual, and role-aware Floating Action Button behavior for the primary mobile and contextual action.
scope: Mobile Attendance marking, Fee recording, Student or Teacher record creation, and primary page-level actions on small-screen surfaces.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERACTION_DESIGN.md
  - ../MOBILE_UX_GUIDE.md
  - ../RESPONSIVE_SYSTEM.md
  - ../PERMISSION_DESIGN.md
  - ./Button.md
  - ./Icon Button.md
  - ./Menu.md
review_frequency: Quarterly and before action scope, mobile layout, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: FAB, Floating Action Button, primary action, mobile action, extended FAB, mini FAB
---

# FAB

## Purpose

Use a Floating Action Button (FAB) for the single most important action on a page when that action is frequently needed and benefits from persistent, thumb-reachable placement. In EduTrack the FAB is primarily a mobile pattern — it promotes Attendance marking, Fee recording, or Student creation to a consistently reachable position on small-screen surfaces.

## Non-goals

Do not use a FAB for every page. A FAB represents one promoted action; if a page has no clear primary action, do not add a FAB for completeness. Do not use a FAB as a shortcut menu container on desktop — use a [Menu](./Menu.md) or [Dropdown](./Dropdown.md) within the page layout. Do not use a FAB for destructive or irreversible actions without a consequence review step. Do not use a FAB to access navigation destinations — use [Bottom Navigation](./Bottom%20Navigation.md). Do not use an icon-only FAB when the action is not immediately unambiguous in context.

## Anatomy and variants

Provide a visible label combined with an icon (Extended FAB) or an icon with a mandatory accessible name (icon-only FAB). FABs sit in a fixed or sticky position at the bottom-right of the viewport on mobile, above the system navigation safe area and the [Bottom Navigation](./Bottom%20Navigation.md) bar if present.

Support these variants:

- **Extended FAB** — icon and label; strongly preferred because the label makes the action unambiguous. Use for "Mark attendance," "Record payment," and "Add student."
- **Icon-only FAB** — icon with accessible name; acceptable only when the icon is a universally understood symbol (such as a plus for "add") and the context makes the action unambiguous. Must always carry a visible tooltip or adjacent label on first use.
- **Mini FAB** — smaller variant for supplementary promoted actions when the primary FAB is also present; use sparingly.
- **Multi-action FAB (speed dial)** — a FAB that expands to reveal two to five related actions; each action has a label and icon. Animations respect `prefers-reduced-motion`. The expanded state is a menu and follows [Menu](./Menu.md) interaction and accessibility requirements.

## States and behavior

Support resting, focused, hovered, pressed, loading, disabled, and hidden states.

- **Action scope:** The FAB action operates on the current page or list scope — not a globally different context. "Mark attendance" in the Attendance view marks attendance for the currently visible session, not an arbitrary one.
- **Role awareness:** The FAB is only shown when the current role has permission to perform the action. Do not show a disabled FAB as a placeholder for a role that will never have permission — omit it entirely. Follow [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md).
- **Loading:** When the FAB action triggers an async operation, show a spinner within the FAB and disable repeated activation. Do not navigate away silently while the operation is pending.
- **Consequence:** FAB actions that are consequential (Exam publication, bulk Fee assignment) open a [Dialog](./Dialog.md) confirmation rather than executing immediately.
- **Overlap:** The FAB must not obscure critical page content such as record status, action buttons in the bottom row, or required form fields. Scroll-aware hiding (hide on scroll-down, show on scroll-up) is acceptable when the content below the fold is equally important.
- **Desktop:** At wide viewports, the FAB is replaced by a prominent [Button](./Button.md) in the page header or toolbar. The FAB is a mobile-first component and should not appear on desktop unless the layout genuinely benefits from it.

## Accessibility and responsive behavior

Icon-only FABs must have a non-empty `aria-label` that names the action and, where useful, its scope: "Mark attendance for Morning session." The FAB is reachable by keyboard; Tab places focus on the FAB in a logical position within the page focus order (typically after main content). The FAB is not removed from the focus order on scroll.

For speed-dial variants, the expanded menu follows `role="menu"` with `role="menuitem"` children. Arrow keys navigate items; Escape collapses the menu and returns focus to the FAB trigger. Each item has a visible label.

Touch targets are at minimum 56×56 CSS pixels for the standard FAB to meet [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md) guidance. Respect the bottom safe area on devices with system navigation bars.

## Content and examples

Extended FAB: icon (plus) + "Add student." Icon-only FAB: icon (checkmark) + `aria-label="Mark attendance for Morning session, Batch A."` Speed-dial labels: "Add student," "Import from CSV," "Send invitation." Consequential action dialog title: "Mark attendance for all 42 students in Morning session, Batch A?"

## Review evidence

Verify FAB is present only when the current role has permission for the action; icon-only FABs have a descriptive accessible name including scope; extended FAB label matches the action and its context; consequential actions open a confirmation before executing; loading state prevents duplicate activation; FAB does not obscure critical page content; desktop layout replaces FAB with a page-level button; speed-dial keyboard interaction opens, navigates, and closes correctly; touch target is at minimum 56×56 CSS pixels; zoom to 200% keeps the FAB visible and operable; screen reader announces the FAB label and loading state.

See [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md).
