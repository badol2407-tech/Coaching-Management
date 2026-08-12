---
title: EduTrack Authorization Architecture
purpose: Define how authenticated identity becomes scoped, least-privilege access to Organizations, Workspaces, records, and actions.
scope: Role and Permission evaluation, Organization isolation, direct data access, route boundaries, Firebase rules, API middleware, support impersonation, audit, and denial behavior.
audience: Security, Privacy, Engineering, Backend, Frontend, Product, QA, Reliability, Operations, and reviewers.
related_documents:
  - ./PERMISSION_DESIGN.md
  - ./modules/Roles_and_Permissions.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Authentication.md
  - ./SECURITY_UX.md
  - ./ENGINEERING_STANDARDS.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./AUTHENTICATION_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./modules/Audit_Logs.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after an authorization, Role, Permission, tenancy, data-source, or security incident
owner: Security, Privacy, Engineering, Product Governance, QA, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding Permission, tenancy, security, and engineering standards
canonical_terms: Authorization, Role, Permission, Organization, Workspace, scope, actor, target, deny-by-default, audit
---

# EduTrack Authorization Architecture

## Metadata

This handbook describes the enforcement architecture required after authentication and records the evidence available in the current repository. It does not create a new Role catalog, Permission taxonomy, retention rule, or user-facing security standard. Those remain owned by [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md), [modules/Roles_and_Permissions.md](./modules/Roles_and_Permissions.md), [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md), and [SECURITY_UX.md](./SECURITY_UX.md).

## Purpose

Authorization answers whether an authenticated actor may perform a named action on a named object within a named Organization or Workspace scope. It must be enforced at the data or service boundary, not inferred from visible navigation, a React context, a URL, or a client-side filter.

The target evaluation path is:

```text
authenticated identity
  -> application profile and active scope
  -> Role and Permission resolution
  -> object relationship and state checks
  -> data-boundary enforcement
  -> typed result, denial, or audit outcome
```

## Scope

### Included

- Organization and Workspace isolation.
- Role and Permission evaluation for direct reads, writes, exports, and operations.
- Frontend route and layout gates as presentation boundaries.
- Firebase Auth/Firestore/Storage rule boundaries.
- Express/API middleware and future PostgreSQL enforcement.
- Super-admin support impersonation and actor/effective-context separation.
- Denial, non-disclosure, revocation, cache, audit, and negative-path behavior.

### Excluded

- The canonical meaning of Role and Permission capabilities, which is owned by [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and the Roles and Permissions module.
- Product workflow permissions that belong in individual module specifications.
- Authentication provider identity and session lifecycle, which are owned by [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md).
- User-facing security copy and consent behavior, which are owned by [SECURITY_UX.md](./SECURITY_UX.md).

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Capability vocabulary and user-facing model | Product Governance and Security | Maintain the canonical Role and Permission model. |
| Organization and Workspace policy | Product, Security, Privacy, and Governance | Define membership, scope, inheritance, delegation, and lifecycle. |
| Firebase enforcement | Engineering and Security | Maintain deployed Firestore, Storage, and Realtime Database rules and test direct access. |
| API enforcement | Backend and Security | Resolve identity and scope, evaluate Permissions, and reject unauthorized requests before data access. |
| Frontend visibility | Frontend Engineering and Product Design | Reflect authorized destinations without treating hidden controls as security. |
| Audit and operations | Security, Reliability, and Operations | Record consequential decisions, support access, incidents, and review evidence. |

## Related documents

- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) owns capability explanation, least privilege, approvals, and Permission-change UX.
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md) owns Organization and Workspace isolation behavior.
- [modules/Roles_and_Permissions.md](./modules/Roles_and_Permissions.md) owns the product Role and Permission module contract.
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns boundary enforcement, integrity, audit, privacy, and testing.
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) owns service and persistence boundaries.
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) owns Firebase service and rules evidence.

## Architecture principles

1. **Authenticate before authorizing.** A provider-authenticated UID is the starting identity, not the completed access decision.
2. **Deny by default.** Missing identity, profile, scope, Role, Permission, relationship, or object state must not broaden access.
3. **Enforce at the data boundary.** Route visibility and client filters may improve usability but cannot grant or protect data.
4. **Scope every decision.** Organization, Workspace, object, record, relationship, action, and effective time are part of the authorization decision.
5. **Recheck on consequential operations.** Writes, exports, Permission changes, impersonation, integrations, and recovery must not rely only on an earlier page load.
6. **Separate actor from effective context.** Support access must preserve who acted, whose view was used, what was accessed, and when support ended.
7. **Revocation wins over cache.** A stale profile, query result, browser state, or copied link is not an authorization grant.
8. **Denial does not confirm protected existence.** Unauthorized and not-found responses must follow the non-disclosure rules owned by [SECURITY_UX.md](./SECURITY_UX.md).

## Standards

### Current web authorization signals

The web application resolves a profile from `users/{uid}` and carries a Role and `orgId` through `AuthContext`. Pages and layouts select role-specific routes for `super_admin`, `org_admin`, `teacher`, and `student`. Domain hooks construct paths under `organizations/{orgId}/...` and disable reads when the required Organization context is absent.

These are application context and query-construction conventions. They are not sufficient evidence of data-boundary authorization. A direct Firestore request, Storage request, API request, export, or cached record must be tested independently.

### Current Firebase evidence

The repository contains `database.rules.json`, which denies all Realtime Database reads and writes. The checked-in `storage.rules` allows authenticated reads of Organization student photos and authenticated writes subject to file type and size checks; profile-photo writes additionally require the matching UID. The student-photo rule does not, by itself, prove Organization membership.

No Firestore rules file is checked into the current repository snapshot. Therefore, this documentation does not claim that the Firestore collections used by the web hooks are protected by a particular deployed rule set. Firestore enforcement must be verified in the Firebase project configuration and covered by direct negative-path tests before a release relies on it.

### Target authorization evaluation

Every protected service operation should make the following sequence explicit:

```text
parse request
  -> authenticate actor
  -> resolve profile and active Organization/Workspace
  -> resolve Role and Permission
  -> verify object relationship and lifecycle state
  -> enforce scope at the storage/service boundary
  -> perform read or mutation
  -> emit audit/observability outcome when governed
```

Request parameters such as `orgId`, `studentId`, `class`, `batch`, `status`, `search`, or `date` narrow an authorized query; they do not establish authority.

### Separate API and relational path

The OpenAPI contract and generated client describe a future or separate service boundary. The Express service currently mounts the health route, while broader Student, Attendance, and Dashboard paths remain contract-only. The PostgreSQL schema currently lacks an Organization or tenant column. The separate path must not accept production multi-Organization traffic until identity, Permission, Organization constraints, migrations, and negative-path evidence agree.

### Support impersonation

The current support view keeps the super administrator authenticated as themselves, writes entry and exit records, and temporarily overrides the application profile. The effective target Role and Organization are presentation context, not a replacement for actor identity. Any data-boundary rule that allows support access must identify the support actor, approved target, scope, reason or ticket where policy requires, and audit result.

## Implementation guidelines

### Capability checks

Use canonical capability names and module contracts. A check should answer what action is being attempted, on which object, within which scope, for which actor, under which Role, and with which lifecycle state. Do not scatter ad hoc email, route, or UI checks as a parallel Permission system.

### Direct object access

Test collection reads, direct document reads, updates, deletes, bulk operations, exports, downloads, deep links, and related-object joins. A user who cannot see a list must not gain access by guessing an ID or calling a related endpoint.

### Scope changes

When an Organization, Workspace, Role, membership, or Permission changes, invalidate or re-evaluate route, profile, query, mutation, export, and support state. A failed re-evaluation must fail closed and provide the permitted recovery path.

### Denials and errors

Return the smallest safe result. Distinguish validation, unauthenticated, unauthorized, not found, conflict, rate limit, dependency, and service failure according to [ERROR_HANDLING.md](./ERROR_HANDLING.md), without revealing protected object existence through timing, copy, counts, Search, Notifications, analytics, or logs.

### Audit

Consequential Permission changes, support access, sensitive reads, exports, recovery, and policy changes require actor, target, scope, action, outcome, timestamp, and relevant approval or source context according to [modules/Audit_Logs.md](./modules/Audit_Logs.md). Audit records do not replace enforcement.

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md), and [SECURITY_UX.md](./SECURITY_UX.md).

- The interface communicates available, disabled, pending, denied, and revoked states without color alone.
- Hidden or disabled actions are not the only security mechanism and do not create inaccessible dead ends.
- Scope, actor, consequence, approval, and recovery are available to keyboard and assistive-technology users before consequential confirmation.
- Authorization changes, session expiry, and impersonation transitions preserve focus and disclose the effective context safely.

## AI implementation notes

The AI Assistant may explain an existing authorized Permission or draft a change for human review. It cannot infer authority, grant or revoke Permission, bypass a denial, choose a target Organization, or treat natural-language intent as authorization. AI context must be authorized independently of any generated response.

## Review checklist

- [ ] The decision identifies actor, authenticated identity, Role, Permission, Organization, Workspace, object, action, and lifecycle state.
- [ ] Enforcement occurs at the Firestore, Storage, API, or database boundary, not only in the frontend.
- [ ] Current rules evidence is distinguished from UI assumptions and target guidance.
- [ ] Direct reads, writes, exports, downloads, deep links, cached data, bulk operations, and related objects are covered.
- [ ] Revocation, stale profile, impersonation, session expiry, and cross-Organization paths fail closed.
- [ ] Consequential outcomes are auditable and do not expose protected existence.
- [ ] The documentation links to the canonical Permission, security, tenancy, audit, and quality owners.

## Validation checklist

- [ ] Each supported Role is tested against allowed, denied, expired, revoked, and out-of-scope operations.
- [ ] Cross-Organization and cross-Workspace reads, writes, direct IDs, exports, and cache paths are tested.
- [ ] Firebase rule tests cover Auth, Firestore, Storage, and Realtime Database boundaries actually used by the feature.
- [ ] API tests cover missing identity, invalid identity, denied Permission, wrong scope, not found, conflict, and dependency failure.
- [ ] Impersonation entry, actor/effective-context display, audit failure, exit, cache cleanup, and sign-out are tested.
- [ ] Security, privacy, accessibility, performance, and operational evidence is recorded under [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md)
- [modules/Roles_and_Permissions.md](./modules/Roles_and_Permissions.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Authentication.md](./modules/Authentication.md)
- [modules/Audit_Logs.md](./modules/Audit_Logs.md)
- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)