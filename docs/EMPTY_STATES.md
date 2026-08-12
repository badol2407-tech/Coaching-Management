---
title: EduTrack Empty States
purpose: Define honest, useful, and recoverable empty states for completed queries, new workspaces, unavailable scope, and missing data.
scope: Zero records, no Search results, no applied data, first-use setup, filtered empties, permission-limited views, and recovery actions.
audience: Product, Design, Engineering, Content, QA, Accessibility, Security, Operations, and AI implementation contributors.
related_documents:
  - ./STATE_SYSTEM.md
  - ./SEARCH_EXPERIENCE.md
  - ./FILTER_SYSTEM.md
  - ./ERROR_HANDLING.md
  - ./LOADING_STATES.md
  - ./COPYWRITING_GUIDELINES.md
  - ./ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and after an empty-state usability or data incident
owner: Product Design, Content Design, Product, Engineering, and QA
version: 1.0.0
status: Binding interaction standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Organization, Workspace, Permission, Role, AI Assistant
---

# EduTrack Empty States

## Purpose

An empty state tells users what the absence of content means and what safe action is available. It must distinguish a new Students area from a filtered Attendance result, a no-result Search, a permission-limited Report, and an unavailable Organization scope.

## Scope and ownership

This handbook owns empty-state meaning, content, and recovery. [STATE_SYSTEM.md](./STATE_SYSTEM.md) owns the `empty` lifecycle; [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md) own query-specific states; [ERROR_HANDLING.md](./ERROR_HANDLING.md) owns service and permission failure.

## Implementation principles

1. Explain why the state is empty using known facts, not speculation.
2. State the active Organization, Workspace, Search, Filters, time range, and freshness when they affect interpretation.
3. Offer one primary next action and a safe alternative; do not create content without user intent.
4. Never use an empty state to conceal authorization failure, service failure, stale data, or an unsupported query.
5. Keep empty states useful at first use and after data has been removed, archived, or filtered out.

## Design standards

- Use distinct language for `no records yet`, `no matching results`, `no access`, `not configured`, and `temporarily unavailable`.
- A first-use Students or Teachers state may offer Add or import guidance only when the user has the required Permission.
- An Attendance, Fees, Exams, or Reports empty state states the relevant date range and scope before suggesting an action.
- Dashboard and Analytics empties identify missing data, freshness, and whether a metric is not applicable.
- AI Assistant empty states explain that no generated content exists and offer a prompt or source-selection path without implying a failure.
- Empty-state illustrations are optional and never replace the heading, explanation, or action.

## Engineering standards

- Map backend result, authorization, and failure codes to distinct UI states; never map all non-success responses to empty.
- Preserve Search, Filters, form input, and route scope when a recovery action fails.
- Test empty states after deletion, revocation, timeout, stale data, partial import, and permission changes.
- Ensure analytics distinguish first-use, no-match, no-access, and service-unavailable states.

## Accessibility requirements

Use a meaningful heading, readable explanation, semantic action, and accessible status. Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md); do not use a decorative image or color as the only explanation.

## AI implementation notes

The AI Assistant may draft empty-state copy from approved canonical terms but must not invent records, causes, or data availability. It must preserve uncertainty when the system cannot determine why content is absent.

## Review checklist

- [ ] Empty type and cause are explicit and truthful.
- [ ] Scope, Search, Filters, time range, and freshness are visible where relevant.
- [ ] Primary action is authorized, safe, and recoverable.
- [ ] No-access and service-failure states are not disguised as empty.
- [ ] Content, accessibility, localization, and mobile behavior are reviewed.

## Validation checklist

- [ ] Backend codes render the correct state.
- [ ] Keyboard and screen-reader operation pass.
- [ ] Dashboard, Students, Attendance, Fees, Exams, Reports, Search, Filters, Organization, and AI Assistant examples pass.
- [ ] Recovery preserves safe user input and scope.
- [ ] Evidence is linked in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [STATE_SYSTEM.md](./STATE_SYSTEM.md)
- [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md)
- [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md)