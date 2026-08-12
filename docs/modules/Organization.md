---
title: EduTrack Organization Module
purpose: Define Organization and Workspace identity, configuration, membership, access governance, and operational scope.
scope: Organization identity, Workspace context, programs, batches, membership, Roles, Permissions, settings, audit, retention, and authorized administration.
audience: Product, Design, Engineering, Security, Privacy, Governance, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../PRODUCT_GOVERNANCE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../NAVIGATION_STANDARDS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../NOTIFICATION_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after an Organization, Workspace, Permission, policy, privacy, or retention change
owner: Product, Product Governance, Security, Privacy, Design, Engineering, and Operations
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Organization, Workspace, Role, Permission, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Profile, Settings, Authentication, AI Assistant
---

# Organization

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate standards.

## Purpose

Organization is the governed coaching context whose people, programs, records, Roles, Permissions, and policies are managed together. Workspace is the active context in which a user performs work, such as an Organization, program, or authorized operating area.

This module applies the ownership and precedence rules in [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md), [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), and [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md). It defines Organization behavior without creating a second authorization or security standard.

## Scope

### Included

- Organization identity and active Workspace context.
- Programs, batches, classes, subjects, and other approved operating scopes.
- Membership, Role assignment, Permission visibility, and access review.
- Organization preferences, policies, notification settings, and approved integrations.
- Organization-level Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Profile, and Settings entry points.
- Audit, retention, export, recovery, and deactivation behavior.

### Excluded

- Authentication credentials or session enforcement as a source of truth.
- Student, Teacher, Attendance, Fee, Exam, Report, Notification, or Profile records as source data.
- Client-only authorization or hidden controls as enforcement.
- Silent Organization deletion, membership removal, or Permission changes.
- AI decisions about membership, access, education, finances, employment, or safety.

## Users & Roles

| Role | Organization responsibility | Default scope |
| --- | --- | --- |
| Super administrator | Support authorized platform-level Organization operations and aggregate health. | Explicitly authorized Organization scope; minimize individual data. |
| Organization administrator | Manage Organization identity, Workspace structure, membership, Roles, Permissions, policies, and operational settings. | The active Organization and authorized Workspaces. |
| Teacher | Use assigned Workspace and operational areas; request or review access where policy allows. | Assigned Workspace/program/batch/subject scope. |
| Student | Use the Organization content and records explicitly shared for the Student. | Own record and shared Organization scope. |
| Future authorized Role | Use only the approved Organization capabilities and scope for that Role. | Explicitly declared and deny-by-default. |

## Business Rules

1. Organization is the canonical user-facing term; do not substitute tenant.
2. A user may belong to one or more Organizations only when the product and policy permit it; the active Organization and Workspace must always be visible when they affect data or action.
3. Every Organization-scoped record and request carries an authorized Organization or Workspace boundary.
4. Organization administrators can manage only the Organization and Workspaces granted to them; super administrator access is not an excuse for unrestricted individual-data exposure.
5. Role assignment and Permission changes are separate, reviewable, auditable actions with explicit scope, actor, effective time, expiry, and recovery.
6. Programs, batches, classes, subjects, and dates must belong to the active Organization or Workspace and must not silently broaden an operational query.
7. Organization settings distinguish personal, Workspace, notification, security, policy, and system configuration.
8. Deactivation, archival, retention, export, and deletion behavior is explicit before commitment; a delivery or configuration failure must not erase source records.
9. Organization-level Notifications identify source, scope, audience, consequence, and action without artificial urgency or sensitive leakage.
10. AI Assistant may explain Organization configuration or draft a reviewable change but cannot grant access, change policy, or mutate Organization records without explicit authorized action.

## User Journeys

### Organization administrator: establish Organization context

1. Open Organization and confirm the current Organization and Workspace.
2. Review identity, operating structure, active period, and required setup.
3. Add or update an approved program, batch, class, or subject.
4. Review affected Students, Teachers, Attendance, Exams, Fees, Reports, Notifications, and Permissions.
5. Save and confirm the change, audit entry, and next action.

### Organization administrator: assign a Role

1. Open membership and select an authorized user.
2. Review current Role, direct and inherited Permissions, Organization, Workspace, object, and time scope.
3. Choose a Role or approved Permission change.
4. Review impact, affected people, effective time, expiry, audit, and recovery.
5. Confirm and verify the resulting pending, success, partial, or failed state.

### Teacher: change Workspace context

1. Open the Organization or Workspace switcher.
2. Review available Workspaces and their scope before selecting one.
3. Switch context and verify that Dashboard, Students, Teachers, Attendance, Exams, Reports, Notifications, and Profile reflect the new scope.
4. Return to the prior Workspace without losing safe form input or pending work.

### Organization administrator: deactivate or recover an Organization

1. Review the reason, affected users, records, exports, retention, and recovery plan.
2. Confirm required approval and the exact Organization or Workspace scope.
3. Commit only after a deliberate review of consequence and audit behavior.
4. Show pending versus completed state and provide authorized recovery or support path.

## Information Architecture

Organization hierarchy:

1. Organization identity, status, and current Workspace.
2. Workspace structure: program, batch, class, subject, and period.
3. Membership and Role responsibilities.
4. Permissions and policy configuration.
5. Operational entry points: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Profile, and Settings.
6. Audit history, exports, retention, integrations, and advanced administration.

Organization identity, personal Profile, and Authentication are related but distinct. Do not combine them into one undifferentiated settings surface.

## Navigation Flow

`Sidebar > Organization` opens the authorized Organization context. From Organization:

- Organization overview → Workspace structure;
- Workspace → programs, batches, classes, subjects, and operational modules;
- membership → Role and Permission review;
- settings → notification, security, policy, integration, retention, and export controls;
- Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, and Notifications → scoped source destinations with Organization and Workspace preserved;
- Profile and Authentication → personal identity and security surfaces, not Organization administration.

The Organization context switcher is available through the approved [Top Navigation](../components/Top%20Navigation.md) or [Sidebar](../components/Sidebar.md) pattern. Mobile keeps current scope and browser back behavior visible.

## Screen Specifications

### Organization overview

- Organization name, status, identity, active Workspace, setup completeness, and freshness.
- Authorized operational summaries and direct paths to relevant configuration.
- Required setup is explicit; no setup requirement is hidden in a Dashboard metric.

### Workspace structure

- Programs, batches, classes, subjects, periods, status, owners, and effective dates.
- Search, Filters, result count, and clear/reset behavior where collections are large.
- Relationship and impact review before structural changes affect Students, Teachers, Attendance, Exams, Fees, or Reports.

### Membership, Roles, and Permissions

- User identity, Role, Organization, Workspace, object scope, direct/inherited/temporary status, effective time, and expiry.
- Outcome-oriented capability labels such as view, create, edit, publish, export, assign, or administer.
- Separate request, grant, remove, deny, expire, revoke, and failed states.
- Confirmation for consequential changes with actor, target, scope, effect, audit, and recovery.

### Organization settings

- Settings grouped by Organization, Workspace, notifications, security, policy, integrations, retention, and exports.
- Required versus optional fields, owner, visibility, effective time, and recovery.
- Sensitive and destructive controls are separated from routine settings.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Bottom Navigation](../components/Bottom%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Date Picker](../components/Date%20Picker.md), [Text Field](../components/Text%20Field.md), [Textarea](../components/Textarea.md), [Checkbox](../components/Checkbox.md), [Radio](../components/Radio.md), [Switch](../components/Switch.md), and [File Upload](../components/File%20Upload.md).
- [Table](../components/Table.md), [List](../components/List.md), [Data Grid](../components/Data%20Grid.md) only for approved multi-row entry, and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [Avatar](../components/Avatar.md), [Badge](../components/Badge.md), [Chip](../components/Chip.md), [Tag](../components/Tag.md), [Dialog](../components/Dialog.md), [Drawer](../components/Drawer.md), [Menu](../components/Menu.md), and [Accordion](../components/Accordion.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the permission, consequential confirmation, draft, empty, record detail, bulk operation, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Organization administration, Workspace administration, membership, Role assignment, Permission administration, export, retention, integration, and deactivation are separate capabilities.
- Apply least privilege, explicit scope, separation of duties, and deny-by-default for sensitive operations.
- A Role summary states what the Role can do, where, for whom, for how long, and what it cannot do.
- Direct, inherited, temporary, conditional, pending, denied, revoked, and expired Permissions are distinct.
- Enforce Organization and Workspace isolation at the data boundary and on direct requests, deep links, exports, caches, Notifications, and AI context.
- Permission denial explains unavailable capability without revealing protected data or record existence.

## Validation Rules

- Organization and Workspace names, identifiers, status, effective dates, and required policy fields use explicit formats and ownership.
- A program, batch, class, subject, member, Role, Permission, Notification setting, export, or integration must belong to the active Organization or Workspace.
- Permission changes require valid target user, Role/capability, scope, effective time, expiry where applicable, approver, and recovery plan.
- Structural changes validate affected Students, Teachers, Attendance, Fees, Exams, Reports, Notifications, and retention implications before commit.
- Deactivation, deletion, export, retention, and policy changes require consequence review; reset is distinct from save.
- Search and Filters cannot reveal or broaden inaccessible Organization or Workspace data.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: establish active Organization and Workspace before scoped content loads.
- `loading`: keep Organization identity, active scope, and independent controls available.
- `ready`: state status, freshness, setup completeness, and authorized actions.
- `empty`: distinguish no Organization setup, no Workspaces, no members, no matching Filters, no access, and unavailable service.
- `partial`: identify which structure, membership, import, or Permission changes completed and which did not.
- `stale`: expose last-known configuration freshness and require review before consequential changes.
- `pending`: never imply a Role, Permission, policy, export, integration, or deactivation is final before accepted completion.
- `success`: name Organization or Workspace, affected object, actor, effective time, and next action.
- `error`: distinguish validation, conflict, authorization, network, dependency, and unknown service failure; preserve safe input.
- `unauthorized` and `disabled`: communicate available support or request path without protected-data disclosure.

## Notifications

Organization Notifications cover required policy, security, membership, Permission, export, integration, and operational events. Follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md) for taxonomy, preferences, delivery, retention, idempotency, and accessibility. Mandatory governance and security Notifications explain why they cannot be disabled.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md). Organization-specific requirements:

- Organization, Workspace, Role, Permission, effective time, scope, consequence, and audit status are available in text and semantics.
- Membership tables, Permission controls, context switching, dialogs, and settings forms are keyboard complete with visible focus.
- Inherited, disabled, pending, denied, revoked, and expired states are not distinguished by color alone.
- Long Organization names, dense Permission matrices, localization, 200% zoom, reflow, mobile, and screen-reader announcements are tested.

## AI Behavior

The AI Assistant may explain existing Organization configuration, summarize an authorized audit trail, or draft a proposed change for review. It must identify source scope, freshness, generated status, uncertainty, and the human reviewer. It must not grant, remove, infer, or escalate Permissions; change policy; invite users; deactivate an Organization; send mandatory Notifications; or expose another Organization’s data.

## Security

Organization is the primary tenancy boundary for people, programs, records, Permissions, Notifications, exports, caches, and AI context. Enforce isolation at the service and data boundary, protect membership and Permission details, avoid Organization enumeration, secure exports and integrations, and audit actor, time, target, scope, before/after, approval, and result under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Organization identity and active Workspace before secondary administration panels, keep context switching responsive, avoid blocking operational work on slow settings panels, paginate members and structures, and cancel obsolete queries. Measure context switch, Organization overview, Search, Permission review, save, export, and recovery with the shared engineering performance process.

## Acceptance Criteria

- [ ] Users can identify the active Organization and Workspace before viewing or changing scoped data.
- [ ] Organization structure, membership, Roles, Permissions, settings, audit, retention, and recovery are separated by task.
- [ ] Consequential changes show scope, actor, effect, effective time, expiry, audit, and recovery before commit.
- [ ] Organization and Workspace isolation is enforced for direct access, exports, caches, Notifications, and AI context.
- [ ] Empty, partial, stale, pending, unauthorized, disabled, conflict, and error states are explicit and recoverable.
- [ ] Approved navigation and component contracts are reused without duplicate standards.
- [ ] Accessibility, privacy, security, AI, performance, and operational evidence is available.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Organization, Workspace, membership, Role, Permission, objects, scope, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: structure, context switching, forms, tables, review, bulk action, export, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: validation, state transitions, conflict, partial completion, retry, rollback, recovery, and deactivation.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: tenancy isolation, direct access, exports, caches, Notifications, audit, retention, and AI context.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, zoom, localization, reflow, mobile, and reduced motion.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [NAVIGATION_STANDARDS.md](../NAVIGATION_STANDARDS.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)