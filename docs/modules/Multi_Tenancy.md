---
title: EduTrack Multi-Tenancy Module
purpose: Define Organization and Workspace isolation, context selection, scoped data behavior, lifecycle, and cross-Organization safety for the enterprise product.
scope: Organization tenancy boundaries, Workspace context, membership, routing, data access, caches, Search, Filters, Notifications, Reports, AI, Integrations, exports, lifecycle, migration, support access, and cross-Organization controls.
audience: Product, Design, Engineering, Security, Privacy, Governance, Data, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../PRODUCT_GOVERNANCE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../ENGINEERING_STANDARDS.md
  - ../NAVIGATION_STANDARDS.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../AI_UX_GUIDELINES.md
  - ../STATE_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../ACCESSIBILITY_TESTING.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after an Organization, Workspace, routing, data, Role, privacy, security, migration, or support-access change
owner: Product Governance, Security, Privacy, Engineering, Data, Product, Design, Operations, and reviewers
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Organization, Workspace, tenancy boundary, context, membership, Role, Permission, scope, isolation, cross-Organization, support access, migration
---

# Multi-Tenancy

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate authorization, security, routing, Organization, or data-isolation standards. Organization is the canonical user-facing term; multi-tenancy describes the platform boundary.

## Purpose

Multi-Tenancy defines how EduTrack keeps Organizations and Workspaces isolated while allowing approved Users, support processes, and enterprise capabilities to operate across explicitly authorized context. It makes the active context, boundary, membership, Permission, lifecycle, and cross-Organization behavior visible rather than relying on hidden client state.

The module applies [Organization](./Organization.md), [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), [SECURITY_UX.md](../SECURITY_UX.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md). Those documents own Organization concepts, hierarchy, authorization, security communication, and data-boundary enforcement.

## Scope

### Included

- Organization and Workspace identity, active context, membership, routing, scope, lifecycle, and context switching.
- Isolation of records, Search, Filters, Reports, Analytics, Notifications, AI context, caches, exports, Integrations, imports, backups, and support access.
- Multi-Organization User behavior where approved, cross-Organization workflows, migration, transfer, deactivation, archival, and recovery.
- Context-aware navigation, deep links, error handling, audit, privacy, and tenant-boundary validation.

### Excluded

- Creating a second Organization, Workspace, Role, Permission, Authentication, or source-record model.
- Treating a client-selected context, URL, cached response, Search query, or AI prompt as authorization.
- Cross-Organization data sharing, aggregation, migration, support access, or export without explicit policy and approval.
- Silent Organization deletion, merge, transfer, or membership change.
- AI inferring a User's Organization, broadening context, or making a tenancy decision.

## Users & Roles

| Role | Multi-Tenancy responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Support explicitly authorized platform tenancy operations and aggregate health. | Explicitly authorized Organization scope; minimize individual data. |
| Organization administrator | Govern Organization identity, Workspace structure, membership, lifecycle, and approved cross-context operations. | Active Organization and authorized Workspaces. |
| Teacher | Work within assigned Organization and Workspace context and request approved context changes. | Assigned Organization/Workspace scope. |
| Student | Use own records and explicitly shared Organization content. | Own record and shared Organization scope. |
| Future authorized Role | Use only declared Organization/Workspace capabilities. | Explicit scope and deny-by-default. |

## Business Rules

1. Organization is the canonical tenancy boundary and user-facing term; Workspace is the active operating context inside or associated with that Organization.
2. Active Organization and Workspace are visible whenever they affect data, action, Search, Filters, Reports, Notifications, exports, or AI context.
3. Every request, record, cache, job, Notification, export, Integration, backup, and AI context carries an authorized Organization or Workspace boundary.
4. A User may access multiple Organizations only when membership and policy explicitly allow it; switching context does not transfer or broaden Permission.
5. Cross-Organization aggregation, migration, support, or transfer requires explicit scope, purpose, approval, audit, data minimization, and recovery.
6. Permission denial, missing membership, invalid context, and nonexistent Organization remain privacy-preserving and must not enable enumeration.
7. Deactivation, archival, retention, transfer, merge, deletion, and recovery are separate lifecycle actions with impact review.
8. Organization isolation applies to client and service boundaries, direct requests, deep links, Search, Filters, caches, Reports, Analytics, Notifications, Integrations, imports, exports, backups, and AI.
9. Support or super administrator access is temporary, scoped, reasoned, audited, and no broader than approved.
10. AI may explain the current authorized context but cannot select, infer, merge, transfer, or expand Organization access.

## User Journeys

### User: switch Organization or Workspace

1. Open the context switcher and review available Organizations and Workspaces without exposing inaccessible entries.
2. Select a context and confirm name, status, scope, and pending-work behavior.
3. Verify Dashboard, Students, Teachers, Attendance, Exams, Fees, Reports, Analytics, Notifications, Search, Filters, and AI reflect the new context.
4. Return to the prior context without silently submitting or losing safe work.

### Organization administrator: establish a Workspace

1. Open Organization and review identity, approved structure, membership, Role, Permission, and effective scope.
2. Create or update an approved Workspace with ownership, purpose, dates, and affected modules.
3. Review impact, migration, Notifications, audit, and recovery.
4. Confirm and verify lifecycle and context availability.

### Authorized operator: migrate or transfer data

1. Define source and destination Organizations/Workspaces, objects, fields, Users, purpose, approval, and retention.
2. Preview conflicts, relationships, Permissions, Integrations, Notifications, Audit Logs, and rollback.
3. Execute through the approved Import/Export or recovery workflow and monitor partial state.
4. Validate destination records and source retention without broadening access.

### Support reviewer: use scoped support access

1. Review reason, Organization, Workspace, objects, duration, affected data, and approval.
2. Enter the minimum authorized context with visible support state.
3. Exit, revoke, and review audit evidence; no support access remains implicit.

## Information Architecture

### Organization and Workspace context

Organization identity and status → active Workspace → membership and Role → Permissions and policy → source modules and operational scope.

### Context switcher

Available authorized contexts → selected context → pending-work warning → scope confirmation → destination refresh and recovery.

### Cross-Organization operation

Source and destination → object and field scope → purpose and approval → preview and conflict → execution → validation, audit, retention, and rollback.

Do not expose inaccessible Organization names, membership details, or source data through context controls, Search, Filters, Notifications, or errors.

## Navigation Flow

`Sidebar > Organization` opens the authorized Organization context. From the context:

- Organization identity → Workspace and membership;
- Workspace → Dashboard, Students, Teachers, Attendance, Exams, Fees, Reports, Analytics, Notifications, Search, Filters, Settings, Integrations, Import/Export, Audit Logs, and Backup/Recovery;
- context switcher → authorized Organization or Workspace → destination with scope reset and confirmation;
- source module, Notification, Report, AI Assistant, or deep link → context validation → authorized destination or privacy-preserving denial;
- browser back → does not reveal protected content after context removal, revocation, or sign-out.

Mobile keeps active Organization, Workspace, status, and scope visible and avoids hidden context changes.

## Screen Specifications

### Organization and Workspace context

- Organization name, Workspace name, status, owner, scope, membership, Role, and active state are visible.
- Context changes identify affected data, pending work, and the next action.

### Context switcher

- Only authorized contexts appear; inaccessible or invalid contexts are not enumerated.
- Search, Filters, status, and context selection preserve privacy and do not broaden scope.

### Cross-context operation review

- Source/destination Organization and Workspace, object/field scope, purpose, affected Users, approval, conflict, retention, audit, and rollback are explicit.
- Transfer, merge, migration, archive, deactivate, delete, and recover remain separate actions.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Bottom Navigation](../components/Bottom%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), [Tabs](../components/Tabs.md), and [Menu](../components/Menu.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Table](../components/Table.md), [List](../components/List.md), [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the context-switching, Search and filtered-list, record detail, consequential confirmation, bulk operation, reviewable AI, empty, loading/recovery, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- View Organization, view Workspace, switch context, manage membership, manage lifecycle, cross-Organization aggregate, migrate, transfer, support access, export, restore, and administer tenancy are separate capabilities.
- Capabilities are scoped by source/destination Organization, Workspace, object, User, Role, time, purpose, and sensitivity.
- Organization membership does not automatically grant every Workspace or object capability; source and destination authorization are independently checked.
- Authorization is rechecked for context switching, routing, direct requests, Search, Filters, caches, Reports, Notifications, exports, Integrations, backups, and AI context.
- Permission denial does not reveal protected Organization, Workspace, User, or record existence.

## Validation Rules

- Organization, Workspace, membership, Role, Permission, route, object, source/destination, and effective context are valid before request or display.
- Context changes validate pending work, safe return destination, cache invalidation, Notification audience, and AI/source scope.
- Cross-Organization operations validate purpose, approval, field scope, relationships, duplicate/conflict handling, retention, audit, and rollback.
- Client-supplied Organization or Workspace identifiers, URLs, filters, cache keys, and job parameters cannot broaden authorization.
- Deactivation, archival, transfer, migration, deletion, merge, and recovery preserve actor, scope, before/after, approval, result, and audit references.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [FILTER_SYSTEM.md](../FILTER_SYSTEM.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish authenticated Organization and Workspace context before loading scoped content.
- `loading`: preserve selected context, pending safe work, Search, Filters, and destination.
- `ready`: show active Organization, Workspace, status, scope, freshness, and permitted actions.
- `empty`: distinguish no Organizations, no Workspaces, no membership, no matching contexts, no access, and unavailable service.
- `partial`: identify loaded context, unavailable modules, incomplete migration, or mixed source/destination result.
- `stale`: expose context or membership freshness and require refresh before consequential action.
- `pending`: name context switch, migration, transfer, lifecycle, support, or recovery accepted but not final.
- `success`: name active context, affected Organizations/Workspaces, result, and next action.
- `error`: preserve safe work; distinguish invalid context, authorization, conflict, migration, network, and service failure.
- `unauthorized` and `disabled`: provide a non-enumerating support or request path.

## Notifications

Multi-Tenancy Notifications may communicate context change, membership, lifecycle, migration, transfer, support access, security, or required review. Delivery, preference, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Messages state Organization and Workspace scope without leaking inaccessible context.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Active Organization, Workspace, status, scope, membership, Role, Permission, pending work, and recovery are available through text and semantics.
- Context switchers, menus, Search, Filters, dialogs, navigation, and focus recovery are keyboard and screen-reader operable.
- Active, unavailable, pending, denied, stale, archived, deactivated, and changed contexts never rely on color, icon, position, or sound alone.
- 200% zoom, 320 CSS pixel reflow, long Organization names, translated labels, screen readers, touch, and reduced motion are tested.

## AI Behavior

The AI Assistant may explain the current authorized Organization or Workspace context and summarize approved cross-context results. It must identify source scope, destination scope, generated status, freshness, uncertainty, and human reviewer. It must not infer membership, enumerate Organizations, broaden context, transfer records, select a destination, or make tenancy decisions.

## Security

Organization is the primary tenancy boundary. Enforce Organization and Workspace isolation at identity, membership, routing, data, Search, Filters, caches, Reports, Analytics, Notifications, Integrations, imports, exports, backups, Audit Logs, and AI boundaries. Protect context identifiers, prevent enumeration, invalidate stale access, constrain support access, and audit actor, time, source/destination, scope, approval, and result under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Organization and Workspace identity before secondary panels, keep context switching responsive, cancel obsolete scoped queries, invalidate stale caches safely, and avoid blocking navigation on unrelated modules. Measure context switch, route validation, scoped Search, Filter, Report, Notification, export, migration, and recovery with the shared engineering performance process; this module does not create a competing numeric threshold.

## Acceptance Criteria

- [ ] Users can identify active Organization, Workspace, membership, Role, Permission, scope, status, and pending-work behavior.
- [ ] Organization and Workspace isolation is enforced for records, direct requests, deep links, Search, Filters, caches, Reports, Notifications, Integrations, imports, exports, backups, and AI.
- [ ] Multi-Organization, support, migration, transfer, lifecycle, and recovery actions state source/destination, purpose, approval, consequence, audit, and rollback.
- [ ] Permission denial and invalid context do not enumerate protected Organizations, Workspaces, Users, or records.
- [ ] Empty, partial, stale, pending, unauthorized, conflict, migration, and service-failure paths preserve safe intent.
- [ ] Approved components, canonical Organization vocabulary, accessibility, privacy, security, AI, audit, retention, and governance standards are reused without duplicate rules.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, reduced-motion, performance, and evidence requirements are documented.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Organizations, Workspaces, memberships, Roles, Permissions, objects, source/destination, support, retention, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: context shell, switcher, Search, Filters, navigation, migration, transfer, lifecycle, recovery, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: routing, direct access, cache invalidation, stale membership, conflict, partial operation, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: enumeration, privacy, Notification, Report, Integration, import/export, backup, AI, audit, retention, and support evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, reduced-motion, and context-switch evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, incident, and support ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [Organization module](./Organization.md)
- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md)
- [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md)
- [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md)