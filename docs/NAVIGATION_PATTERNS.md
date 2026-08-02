---
title: EduTrack Navigation Patterns
purpose: Define canonical navigation structures for orientation, scope, discovery, and safe movement through enterprise SaaS.
scope: Primary, secondary, contextual, local, mobile, search, command, breadcrumb, deep-link, and exit patterns.
out_of_scope: Design-token definitions, navigation component implementation, authorization policy, route contracts, and product information architecture ownership.
owner: Product Design, Information Architecture, Frontend Engineering, Accessibility, and QA
status: Canonical source of truth for navigation patterns
version: 1.0.0
last_updated: 2026-08-02
related_documents:
  - ./UI_MASTER_RULES.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_STANDARDS.md
  - ./NAVIGATION_STANDARDS.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./INTERACTION_PATTERNS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
---

# EduTrack Navigation Patterns

This is the single source of truth for reusable navigation structures. [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) owns detailed navigation acceptance; this handbook organizes the approved patterns without redefining routes or component behavior.

## Purpose

Help authorized users understand where they are, where they can go, what scope they are in, and how to return safely.

## Scope

This handbook owns navigation pattern selection, hierarchy, orientation, scope visibility, discovery, responsive transformation, and exit behavior. [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) owns product classification and naming.

## Principles

| Principle | Practical rule |
| --- | --- |
| Orientation | Expose current product area, object, scope, and location. |
| Predictability | Keep primary destinations, labels, ordering, and interaction behavior consistent. |
| Permission clarity | Do not imply access, availability, or authorization through styling alone. |
| Context preservation | Keep filters, scope, search, and return path when navigating to detail or related work. |
| Safe exits | Warn before losing unsaved or consequential work; preserve a reliable return path. |

## Best Practices

| Pattern | Use when | Required behavior |
| --- | --- | --- |
| Primary navigation | Moving among core product areas. | Show current location, role-relevant destinations, scope, and keyboard-accessible landmarks. |
| Secondary or local navigation | Moving among related views of one area or object. | Keep relationship and current selection clear without competing with primary navigation. |
| Breadcrumb | Showing hierarchy and a safe return path. | Use meaningful labels, current-location state, and responsive truncation that preserves orientation. |
| Tabs | Switching between peer views of the same object or scope. | Keep selection and controlled content clear; do not hide critical status only in an unselected tab. |
| Contextual navigation | Moving to related records, actions, or evidence. | Preserve originating object, scope, filters, and permission context. |
| Search or command navigation | Finding known destinations or actions. | Name the dataset or command scope and distinguish results, no results, loading, and error. |
| Deep link or external exit | Opening a specific record, report, or external destination. | Preserve destination identity, permission handling, return path, and external boundary. |

## Enterprise SaaS Guidelines

- Navigation reflects role, Organization, workspace, permission, and current scope without exposing unauthorized data.
- Use business language from [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md), not database terms or unexplained IDs.
- Keep high-consequence destinations and actions discoverable without relying on hidden menus.
- Preserve search, filters, date range, and scope when moving between list, detail, report, and related records.
- Use [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) for primary, secondary, search, deep-link, and exit evidence.

## Mobile-first & Responsive Rules

- Begin with the smallest navigation needed to orient and complete essential tasks.
- Transform Sidebar, Navbar, tabs, breadcrumbs, menus, and local navigation through existing approved patterns.
- Preserve current location, scope, identity, primary destinations, back behavior, and safe exit at narrow widths.
- Do not require hover, hidden precision gestures, or inaccessible horizontal navigation.
- Resolve navigation visuals and responsive values through [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md).

## Accessibility (WCAG 2.2 AA)

- Use semantic navigation landmarks, accessible names, current-location state, logical headings, and keyboard operation.
- Provide visible focus and a predictable focus route through expanded, collapsed, and transformed navigation.
- Do not use color, position, icon, or expansion alone to identify the current destination.
- Keep all essential destinations and equivalent paths available at mobile widths and zoom.
- Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and navigation contracts in [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).

## AI Rules

- Reuse existing navigation hierarchy, labels, components, and product information architecture.
- Never invent destinations, navigation levels, permission behavior, route semantics, or a new navigation language.
- Never redesign branding or replace stable navigation merely to make a screen look different.
- Improve only orientation, grouping, placement, responsive behavior, accessibility, and usability.
- Never hardcode values, define tokens, or include implementation code.

## Validation Checklist

- [ ] Current location, scope, role, Organization, permission, and return path are understandable.
- [ ] The chosen pattern matches primary, secondary, contextual, search, breadcrumb, tab, or exit intent.
- [ ] Existing navigation standards and component contracts are reused.
- [ ] Mobile, keyboard, screen-reader, focus, zoom, localization, and reduced-motion behavior are preserved.
- [ ] No unauthorized destination, hidden essential action, duplicate hierarchy, token, or implementation code was added.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Information Architecture, Frontend Engineering, Accessibility, and QA |
| Status | Canonical source of truth for navigation patterns |
| Version | 1.0.0 |
| Last Updated | 2026-08-02 |
| Related Documents | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md), [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md), [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md), [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Scope | Reusable enterprise navigation structures and orientation |
| Out of Scope | Tokens, component implementation, routes, authorization policy, and product classification |