---
title: EduTrack Layout Grid
purpose: Define page geometry, alignment, content width, and responsive composition rules for every EduTrack surface.
scope: Page regions, containers, columns, gutters, alignment, nesting, data density, and layout exceptions.
audience: Product Design, Design Systems, Engineering, QA, Accessibility, and AI implementation contributors.
related_documents:
  - ./DESIGN_TOKENS.md
  - ./SPACING_SYSTEM.md
  - ./RESPONSIVE_SYSTEM.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./NAVIGATION_STANDARDS.md
  - ./MOBILE_UX_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
review_frequency: Quarterly and before a shared shell or grid change
owner: Product Design, Design Systems, and Frontend Engineering
version: 1.0.0
status: Active foundation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Sidebar, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, Workspace
---

# EduTrack Layout Grid

## Purpose

The layout grid makes scope, hierarchy, and action location predictable. Users should recognize the active Workspace and the relationship between a Dashboard summary, a Students list, and a Student detail view without relearning the page geometry.

## Scope and ownership

This handbook owns page-level geometry and alignment. [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) owns Sidebar and route behavior; [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) owns hierarchy and scope; [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) owns adaptation. Component internals remain in [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md).

## Implementation principles

1. Establish a predictable page frame: navigation context, Workspace context, page heading, primary task area, supporting content, and system feedback.
2. Align related content to shared columns. Do not create a visually aligned title with an unaligned table, chart, or primary action.
3. Let content define height. Avoid fixed-height regions for forms, Notifications, errors, Reports, Analytics, or AI Assistant responses.
4. Keep the primary task visible at the current scope. A Fee record, Attendance session, or Exam publishing action must not be separated from the scope it changes.
5. Prefer reflow, stacking, and progressive disclosure over horizontal scrolling for essential tasks.

## Design standards

- Define a small set of container widths, column relationships, and gutter tokens in [DESIGN_TOKENS.md](./DESIGN_TOKENS.md); do not create page-specific grids without an exception.
- Use a consistent content start line across Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Organization, and Settings.
- A page must expose one primary heading and a clear landmark structure; secondary regions must have a meaningful heading or accessible label.
- Keep primary actions in a stable location relative to the page heading and task content; do not move them solely to improve decorative balance.
- Use a table, list, or chart width that supports its content and accessible alternative; never crop values or hide units to fit a grid.
- When a page has Search and Filters, keep the query scope and applied criteria adjacent to the result context.
- Layout exceptions must state the affected roles, device range, task risk, and recovery path.

## Engineering standards

- Use layout primitives and semantic tokens rather than page-level magic numbers.
- Test at supported viewport widths, 200% zoom, dynamic text, long names, no data, service failure, and permission denial.
- Avoid layout shifts when Dashboard metrics, Notifications, Search results, Reports, or AI Assistant content resolve.
- Ensure deep links open at the correct Workspace, Organization, and object scope.
- Measure overflow, content clipping, and primary action reachability in automated and manual checks.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) for landmarks, heading order, keyboard access, focus visibility, zoom, reflow, and touch operation. Essential content and actions must remain available without horizontal scrolling at reflow conditions.

## AI implementation notes

Generated layouts must preserve the approved page frame and scope signals. The AI Assistant may propose composition changes, but it must not hide Permissions, freshness, uncertainty, Notifications, or destructive consequences to create a cleaner layout.

## Review checklist

- [ ] Page frame, Workspace, Organization, Role, and scope are visible.
- [ ] Heading, content, action, and feedback regions align and remain readable.
- [ ] Search, Filters, tables, charts, and exports preserve context.
- [ ] Mobile, zoom, long text, error, empty, and permission states are reviewed.
- [ ] Any exception has an owner, rationale, evidence, and expiry.

## Validation checklist

- [ ] No unexpected horizontal scroll blocks an essential task.
- [ ] Primary actions are keyboard reachable and not obscured.
- [ ] Dashboard, Students, Attendance, Fees, Reports, Settings, and AI Assistant layouts pass representative viewport checks.
- [ ] Layout-shift and overflow checks pass.
- [ ] Evidence is recorded under [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)
- [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md)
- [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)