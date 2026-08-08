---
title: EduTrack Caching Strategy
purpose: Define cache ownership, identity, freshness, invalidation, privacy, and migration behavior for EduTrack.
scope: TanStack Query, Firebase-backed server state, authentication and profile context, impersonation, local persistence, URL state, mutation invalidation, future API caches, and cache observability.
audience: Frontend Engineering, Backend, Security, Privacy, Reliability, QA, Product, Accessibility, and contributors.
related_documents:
  - ./STATE_MANAGEMENT.md
  - ./STATE_SYSTEM.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./AUTHENTICATION_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./ENGINEERING_STANDARDS.md
  - ./LOADING_STATES.md
  - ./ERROR_HANDLING.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a state library, data-source, identity, tenancy, freshness, offline, or performance change
owner: Frontend Engineering, Reliability, Security, Privacy, and QA
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding state, security, engineering, and product performance standards
canonical_terms: cache, query key, freshness, stale, invalidation, Organization, Workspace, Role, Permission, source of truth, impersonation
---

# EduTrack Caching Strategy

## Metadata

This handbook explains where cached or derived state may live and how it remains scoped and honest. [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) owns state ownership and [STATE_SYSTEM.md](./STATE_SYSTEM.md) owns lifecycle vocabulary; this document does not create competing state definitions or universal freshness thresholds.

## Purpose

Caching reduces repeated work, but a cache is a projection of a source and never an authorization grant. EduTrack must prevent stale, cross-Organization, cross-Role, impersonated, or sensitive data from appearing current or accessible.

## Scope

### Included

- TanStack Query cache for Firebase-backed domain reads.
- Auth/profile and temporary impersonation context.
- Query-key identity, invalidation, freshness, stale states, and mutation reconciliation.
- URL, local storage, and session storage boundaries.
- Future API and database cache adoption.
- Privacy, security, memory, observability, and recovery considerations.

### Excluded

- Product lifecycle state and user-facing loading/error semantics owned by [STATE_SYSTEM.md](./STATE_SYSTEM.md) and related handbooks.
- Database indexing or persistence design, owned by [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).
- Authentication or Permission policy, owned by the authentication and authorization handbooks.

## Ownership

| Cache concern | Owner | Responsibility |
| --- | --- | --- |
| Server/cache state | Frontend Engineering | Define query ownership, key identity, fetch, stale, and invalidation behavior. |
| Source freshness | Backend, Data, and Reliability | Define what the source can guarantee and how changes become observable. |
| Scope isolation | Security and Frontend Engineering | Keep Organization, Workspace, Role, actor, and object context in cache identity and access checks. |
| Sensitive persistence | Security, Privacy, and Engineering | Decide what may remain in memory, browser storage, exports, or offline state. |
| Performance evidence | Reliability, QA, and Engineering | Measure cache hit, miss, stale, invalidation, and user-visible outcomes. |

## Related documents

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) owns the frontend state ownership map.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns source-to-view transformations and cache movement.
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) owns access decisions that caches cannot replace.
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) owns sensitive-data and incident boundaries.
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) owns frontend runtime and data-access boundaries.

## Architecture principles

1. **The source remains authoritative.** A cached result may be stale, partial, unavailable, or invalidated.
2. **Cache identity includes every result-affecting context.** Organization, Workspace, effective Role, actor/support context, record ID, filters, sort, pagination, and view parameters must not collide.
3. **Missing scope disables unsafe reads.** Do not create a broad key or query while identity, profile, Organization, or record context is unresolved.
4. **Mutations reconcile projections.** Invalidate or safely update all affected list, detail, summary, relationship, export, and report projections.
5. **Revocation invalidates authority-adjacent state.** Cache removal or revalidation follows identity, scope, Role, Permission, and impersonation changes.
6. **Sensitive data has the shortest approved lifetime.** Do not persist protected records in browser storage or broad analytics without an explicit decision.
7. **Freshness is visible when it affects interpretation.** Do not present stale or optimistic data as durable success.

## Standards

### Current implementation

The web application creates one TanStack `QueryClient` in `App.tsx` with retries disabled and window-focus refetch disabled. No `staleTime` is configured in the current default options. Domain hooks in `artifacts/web/src/lib/hooks.ts` wrap Firestore reads and mutations.

Current query keys place Organization scope first for Organization data, for example:

```text
[orgId, "students", search, status]
[orgId, "my_student_record", studentId]
[orgId, "teachers"]
```

Hooks disable reads when the required scope or identity is absent. Mutations commonly invalidate the affected Organization/object prefix. Several collection hooks fetch a full scoped collection and filter or summarize in the browser; this is not server-side pagination or a freshness guarantee.

### Cache classes

| Class | Current owner | Persistence | Required identity |
| --- | --- | --- | --- |
| Firebase Auth state | Firebase Auth and `AuthContext` | Provider-managed session plus memory | Provider UID and session state. |
| Application profile | `AuthContext` | Memory, refreshed from Firestore | Provider UID, profile version/freshness, Organization context. |
| Support context | `ImpersonationContext` | Memory | Real actor, target UID, target Organization, effective Role, session ID. |
| Domain server state | TanStack Query | In-memory current implementation | Organization/Workspace, Role/actor context, object, filters, and view parameters. |
| URL state | Wouter/browser URL | URL | Safe route, record identity, and approved shareable filters. |
| Shell preference | Local/session storage where used | Browser storage | Non-sensitive preference only; malformed or stale values fail safely. |
| Future API state | Explicit adapter | To be decided | API identity, source, scope, contract version, and freshness policy. |

### Invalidation

After a successful mutation, invalidate every projection that can contain the changed record or derived result. This includes list, detail, summary, related module, Dashboard, report, and export-ready state where applicable. When the outcome is unknown, mark the affected state for reconciliation rather than claiming failure or success.

### Identity and impersonation

When a user signs out, the cache must not remain a usable path to protected content. When Organization, Role, Permission, or profile scope changes, remove or revalidate affected query data before rendering the new context. On impersonation entry and exit, isolate the target context from the real actor and do not leave target data available after exit.

### Freshness and stale data

Freshness behavior belongs to the object and workflow. Attendance, Fees, Permission, subscription, audit, and report data may need different reconciliation behavior. Use the shared engineering and product performance owners for any numeric targets; this document only requires that stale, pending, optimistic, partial, and reconciled states remain distinguishable.

### API migration

If an object moves from Firestore to the API path, introduce an adapter with one active source, an explicit query-key namespace, authentication and Organization propagation, response mapping, invalidation, stale behavior, rollout, reconciliation, and rollback. Do not merge two caches under a generic object key.

## Implementation guidelines

### Key construction

Use stable serializable keys. Include Organization scope first for Organization data, then object, record identity, and every parameter that changes the result. Do not use mutable object identity or omit a filter merely because it is optional.

### Sensitive data

Keep secrets, credentials, recovery factors, raw payment details, unnecessary Profile fields, and protected cross-Organization data out of browser persistence. A cache hit must still be followed by current authorization when the action is protected.

### Offline and persistence

No offline query persistence is established by the current application evidence. Adding persistence requires a security, data minimization, expiry, invalidation, conflict, sign-out, Organization switch, and recovery decision; it must not be added as a silent fallback.

### Observability

Measure cache hit/miss, stale result presentation, invalidation lag, refetch, query cancellation, error, and reconciliation outcomes without logging protected record contents. Use audit records for consequential access; cache telemetry is not an audit substitute.

## Accessibility considerations

Apply [STATE_SYSTEM.md](./STATE_SYSTEM.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).

- Stale, refreshing, pending, optimistic, partial, and reconciled states are available through text and semantics.
- Refresh and retry actions preserve focus, filters, safe form input, and the active object context.
- Cache misses do not produce blank screens or inaccessible loading loops.
- Scope changes and impersonation state are announced and offer an accessible exit or recovery.

## AI implementation notes

Generated AI output must have a separate cache namespace from source records and include source scope, freshness, generated status, uncertainty, and review state. Do not cache prompts, secrets, or unnecessary protected data. AI cache state cannot authorize a write or make a generated suggestion look like a verified record.

## Review checklist

- [ ] Every cache class has an owner, source, lifetime, persistence decision, and privacy boundary.
- [ ] Query keys include Organization, Workspace, actor/effective Role, record, filters, and other result-affecting inputs.
- [ ] Missing scope, sign-out, revocation, Organization switch, Role change, and impersonation exit invalidate unsafe state.
- [ ] Mutations reconcile all affected projections and unknown outcomes remain visible.
- [ ] Freshness, stale data, offline behavior, and persistence are explicit rather than implied.
- [ ] API migration does not silently create competing source-of-truth caches.
- [ ] Evidence is recorded under [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Cache isolation is tested across Organizations, Workspaces, Roles, records, filters, browser refresh, and impersonation.
- [ ] Mutations are tested for duplicate submission, stale reads, conflict, retry, partial completion, unknown outcome, and invalidation.
- [ ] Sign-out, session expiry, Permission revocation, profile refresh, and scope change remove or revalidate protected data.
- [ ] Any browser persistence is tested for expiry, malformed values, logout, sensitive-data minimization, and recovery.
- [ ] Cache performance and stale-data evidence is measured on representative desktop, mobile, and constrained-network conditions.
- [ ] Accessibility evidence covers stale, refresh, error, pending, partial, and recovery states.

## References

- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [STATE_SYSTEM.md](./STATE_SYSTEM.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)