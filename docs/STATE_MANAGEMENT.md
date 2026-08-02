---
title: EduTrack State Management
purpose: Define ownership, lifecycle, cache identity, synchronization, and recovery responsibilities for frontend state in EduTrack.
scope: Firebase authentication state, profile and impersonation state, TanStack Query server/cache state, local UI state, URL state, form state, and state boundaries for future API adoption.
audience: Engineering, Product, Product Design, Accessibility, Security, QA, Reliability, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./STATE_SYSTEM.md
  - ./INTERACTION_DESIGN.md
  - ./LOADING_STATES.md
  - ./ERROR_HANDLING.md
  - ./EMPTY_STATES.md
  - ./FEEDBACK_SYSTEM.md
  - ./ENGINEERING_STANDARDS.md
  - ./PERMISSION_DESIGN.md
  - ./SECURITY_UX.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a state library, authentication, synchronization, caching, or recovery change
owner: Engineering, Product Design, Accessibility, Security, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding state and engineering standards
canonical_terms: initial, loading, ready, empty, partial, stale, pending, success, error, unauthorized, disabled, Organization, Workspace, Role, Permission, source of truth
---

# EduTrack State Management

## Metadata

This handbook maps state ownership in the current React/Firebase web application. It complements [STATE_SYSTEM.md](./STATE_SYSTEM.md), which owns the product-wide lifecycle vocabulary and transition expectations. This document explains where state lives and how it flows; it does not redefine product state semantics or release thresholds.

## Purpose

State management determines whether the interface shows the right user, Organization, record, freshness, action status, and recovery path. The architecture must prevent state from leaking across Roles or Organizations, prevent stale data from being presented as current, and keep local interaction state separate from server-owned records.

## Scope

### Included

- Firebase Auth and Firestore profile state.
- Profile override and super-admin impersonation state.
- TanStack Query server/cache state and query key conventions.
- Local layout, drawer, tab, session, and component state.
- URL state, form state, mutation state, and invalidation.
- State boundaries for a future API-backed data path.

### Excluded

- Product-wide state names and transitions owned by [STATE_SYSTEM.md](./STATE_SYSTEM.md).
- Component-specific visual contracts owned by [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) and component handbooks.
- Persistence schema or API contract details owned by [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) and [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md).

## Ownership

| State class | Owner | Current implementation |
| --- | --- | --- |
| Authentication | Firebase Auth and `AuthContext` | `onAuthStateChanged` supplies user and loading state. |
| User profile and Organization context | Firestore `users/{uid}` plus `AuthContext` | Profile includes Role, `orgId`, Organization name, Student identity, and subscription snapshot. |
| Support impersonation | `ImpersonationContext` | In-memory target and profile override; entry and exit audit writes. |
| Server/cache data | TanStack Query | Query hooks in `artifacts/web/src/lib/hooks.ts` wrap Firestore reads and mutations. |
| URL state | Wouter and browser URL | Routes, path parameters, and selected query parameters such as Student portal tabs. |
| Local shell state | Layouts and local hooks | Drawer, Sidebar expansion, open navigation modules, and session-only splash state. |
| Form and interaction state | Owning page/component | Draft values, validation, pending action, dialog, and local selection state. |
| Durable domain records | Firebase Firestore today | Organization-scoped collections; not owned by React local state. |

## Related documents

- [STATE_SYSTEM.md](./STATE_SYSTEM.md) is the canonical owner for lifecycle states and transitions.
- [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), [EMPTY_STATES.md](./EMPTY_STATES.md), and [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md) own state presentation and recovery.
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns integrity, stale-data, retry, authorization, and testing expectations.
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [SECURITY_UX.md](./SECURITY_UX.md) own permission and security state communication.

## Architecture principles

1. **State has one owner.** A value lives in AuthContext, ImpersonationContext, TanStack Query, URL, local UI state, form state, or durable storage—not in several competing owners.
2. **Server state is not local state.** Firestore/API records, freshness, errors, and mutation status belong to the query boundary; a page should not copy them into uncontrolled React state.
3. **Cache identity includes scope.** Organization, Role-relevant identity, record identifiers, filters, and view parameters must be reflected in query keys where they change the result.
4. **Missing context disables unsafe reads.** Hooks require the necessary `orgId`, `uid`, `studentId`, or record identifier before reading or writing.
5. **Mutations invalidate the affected source state.** Successful writes must invalidate or update related query keys so later reads do not present an old snapshot as current.
6. **Transitions are visible.** Pending, success, failure, stale, partial, unauthorized, and disabled states need the user-facing behavior required by the canonical state standards.
7. **Support context is reversible.** Impersonation is an explicit temporary override, not a second authenticated session.
8. **State does not grant authority.** Context values and query keys are not authorization; Firebase rules or API boundaries enforce access.

## Standards

### Current state layers

```text
durable Firebase Auth / Firestore
  -> AuthContext (user, profile, loading)
  -> ImpersonationContext (temporary profile override)
  -> TanStack Query (scoped server/cache state)
  -> page/component state (forms, dialogs, selections)
  -> URL/local storage/session storage (serializable navigation and shell preferences)
```

The query client is created in `App.tsx` with retries disabled and window-focus refetch disabled. This is current implementation behavior, not a universal policy for every future data source; changes require reliability and freshness review.

### State vocabulary

Use the lifecycle vocabulary in [STATE_SYSTEM.md](./STATE_SYSTEM.md). Architecture-specific examples include:

| State | Architecture interpretation |
| --- | --- |
| `initial` | Required identity or scope has not yet been resolved. |
| `loading` | Firebase, Firestore, or API request is in progress. |
| `ready` | Data is available for the current scope and view. |
| `empty` | A successful scoped read has no records; distinguish it from no access or failure. |
| `partial` | A bulk or import operation produced mixed results or incomplete data. |
| `stale` | Cached data may be older than the source; expose freshness or refresh behavior. |
| `pending` | A mutation has been accepted locally or is awaiting completion. |
| `success` | The named operation completed and the affected view is reconciled. |
| `error` | The operation failed and the safe recovery path is available. |
| `unauthorized` | The user cannot perform the operation without revealing protected data. |
| `disabled` | The action or feature is unavailable for a named reason. |

## Implementation guidelines

### AuthContext

`AuthContext` owns Firebase Auth listener state, profile loading, Organization subscription snapshot, Role resolution, required password change state, logout, profile refresh, and the temporary profile override interface. Keep it free of domain collection reads beyond the profile and Organization snapshot needed for identity and access gating.

The super-admin gate currently requires a Firestore `super_admin` role and an approved email condition; an email alone does not create a profile. Preserve this defense-in-depth behavior and review it through the security owner before changing it.

### ImpersonationContext

`ImpersonationContext` owns the temporary support view. It writes entry and exit records, stores the target in local React state, sets a profile override, and restores the real profile on exit. It must never exchange or expose a target password or replace the Firebase Auth session.

Any cache or query behavior during impersonation must be reviewed for key isolation and explicit invalidation. A temporary profile change must not leave target Organization data available after exit.

### TanStack Query

Domain hooks in `artifacts/web/src/lib/hooks.ts` derive `orgId` from `useAuth`, use keys such as `[orgId, "students", search, status]`, and invalidate related keys after mutations. Preserve stable, serializable keys:

- include Organization scope first for Organization data;
- include record IDs and filters that affect results;
- avoid using mutable object identity without a stable serialization strategy;
- disable the query when required context is absent;
- map Firestore timestamps at the boundary rather than throughout pages;
- keep errors available to the owning page for approved recovery behavior.

Current hooks often fetch a collection and apply filtering or summaries in the browser. This is a known implementation characteristic and should not be described as server-side filtering or pagination.

### Local and URL state

Local state is appropriate for drawer visibility, Sidebar expansion, disclosure, selected rows, dialogs, input drafts, and transient feedback. URL state is appropriate for durable navigation context, record identity, and shareable filters or tabs. Do not use local state as a hidden substitute for Permission, Organization scope, or durable record status.

Local storage and session storage are used for selected shell preferences and splash-session behavior. Persist only non-sensitive preferences and define behavior when stored values are stale, malformed, or unavailable.

### Forms and mutations

Forms own drafts until submission. Mutation state must distinguish idle, pending, success, and failure, preserve safe input on failure, prevent duplicate submission, and reconcile affected queries after success. Consequential operations need review and recovery according to [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) and [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md).

### API migration boundary

If an object moves from Firestore to the API path, do not maintain two invisible caches or silently merge response shapes. Introduce an adapter that names:

- active source of truth;
- request and response schema;
- authentication and Organization context;
- query key and freshness behavior;
- mutation and invalidation behavior;
- migration and rollback behavior;
- treatment of stale data and failures.

## Accessibility considerations

Follow [STATE_SYSTEM.md](./STATE_SYSTEM.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).

- Loading state must not erase useful context or cause focus loss.
- Pending, success, error, stale, empty, unauthorized, and disabled states must be programmatically available and understandable without color alone.
- Cache refresh and mutation completion need an accessible status announcement where the change is not otherwise obvious.
- Form state and safe input preservation must work with keyboard, screen readers, zoom, mobile layouts, and text expansion.
- Impersonation and Role changes must be visible to assistive technology and provide an accessible exit.

## AI implementation notes

No AI state provider or AI query hook is currently implemented. If AI is added, generated state must be distinct from source-record state and include generated, reviewing, accepted, rejected, failed, and unavailable behavior as appropriate.

AI request state must expose source scope, uncertainty, limitations, cancellation or retry, and human review. Never cache generated content under an ordinary source-record key or make a generated suggestion appear as a verified record.

## Review checklist

- [ ] Each state has one clear owner and a named source of truth.
- [ ] Query keys include the scope and all result-affecting parameters.
- [ ] Missing auth, profile, Organization, Role, or record context disables unsafe reads and writes.
- [ ] Mutations define duplicate, pending, success, failure, stale, conflict, and recovery behavior.
- [ ] Role changes and impersonation cannot leak cached data across Organizations.
- [ ] URL, local storage, and session storage contain only appropriate serializable state.
- [ ] State presentation follows the canonical accessibility, interaction, loading, error, empty, feedback, and security standards.

## Validation checklist

- [ ] Auth loading, missing profile, logout, refresh, forced password change, and subscription states are tested.
- [ ] Query cache isolation is tested across Organizations, Roles, records, filters, and impersonation entry/exit.
- [ ] Mutations are tested for duplicate submission, network failure, stale data, conflict, retry, and invalidation.
- [ ] URL and local persistence survive refresh safely and fail closed when malformed or unavailable.
- [ ] Accessible announcements, focus, keyboard operation, zoom, responsive layout, and reduced motion are verified.
- [ ] Any API-backed state is tested against the API contract and explicit source-of-truth decision.
- [ ] Evidence and exceptions are recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [STATE_SYSTEM.md](./STATE_SYSTEM.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [ERROR_HANDLING.md](./ERROR_HANDLING.md)
- [LOADING_STATES.md](./LOADING_STATES.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)