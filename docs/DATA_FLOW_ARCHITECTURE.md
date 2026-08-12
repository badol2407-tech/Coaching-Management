---
title: EduTrack Data Flow Architecture
purpose: Define how identity, Organization scope, domain records, cache state, uploads, errors, and audit events move through EduTrack.
scope: Firebase-first web data flow, AuthContext profile resolution, Firestore hooks, TanStack Query cache, Cloudinary uploads, impersonation audit, separate API flow, and state/recovery boundaries.
audience: Engineering, Security, Privacy, Product, Product Design, QA, Reliability, Operations, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Authentication.md
  - ./modules/Audit_Logs.md
  - ./modules/Import_Export.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Integrations.md
  - ./PERMISSION_DESIGN.md
  - ./SECURITY_UX.md
  - ./STATE_SYSTEM.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a data source, tenancy, authentication, upload, synchronization, or recovery change
owner: Engineering, Security, Privacy, Reliability, Product, and Operations
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding standards
canonical_terms: Organization, Workspace, Role, Permission, Authentication, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, source of truth, audit, recovery
---

# EduTrack Data Flow Architecture

## Metadata

This handbook describes the current flow of identity and domain data through the web product and the separate API architecture. It focuses on boundaries and transformations: it does not replace the canonical tenancy, security, state, module, audit, upload, or recovery handbooks.

## Purpose

Users need the interface to show data for the right Organization, Role, record, and time context, with honest freshness and recoverable failure behavior. A data-flow architecture makes the path from authentication to rendered state and back to a mutation explicit, including where scope is derived, where authorization is enforced, where values are transformed, and where outcomes are audited.

## Scope

### Included

- Firebase Auth and Firestore profile resolution.
- Organization-scoped Firestore reads and writes.
- TanStack Query cache keys and invalidation.
- Firestore timestamps and frontend view-model mapping.
- Cloudinary image upload flow and application references.
- Super-admin impersonation entry/exit audit flow.
- Separate OpenAPI/Express/Drizzle flow and its current implementation gap.
- Loading, stale, error, authorization, and recovery boundaries.

### Excluded

- Detailed schema ownership, which belongs to [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md).
- Route composition, which belongs to [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md).
- Product-specific workflow rules and retention periods owned by module handbooks.

## Ownership

| Flow concern | Owner | Responsibility |
| --- | --- | --- |
| Identity and profile context | Authentication and Engineering | Resolve Firebase user, Firestore profile, Role, Organization, and subscription snapshot. |
| Organization isolation | Security, Product, and Engineering | Derive scope from trusted profile context and enforce it at the data boundary. |
| Domain read/write adapters | Frontend and Backend Engineering | Map source records to view models and preserve explicit error behavior. |
| Cache freshness and invalidation | Frontend Engineering and Reliability | Keep query identity scoped and reconcile mutations. |
| Upload and file privacy | Engineering, Security, and Privacy | Validate, constrain, and reference uploaded objects safely. |
| Audit and support access | Security, Operations, and Engineering | Record consequential access and support actions with actor and scope. |
| Recovery and release evidence | Reliability and QA | Test retries, conflicts, partial results, stale data, and restore paths. |

## Related documents

- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md) owns Organization and Workspace isolation.
- [modules/Authentication.md](./modules/Authentication.md) owns identity, session, and recovery behavior.
- [modules/Audit_Logs.md](./modules/Audit_Logs.md) owns accountability record requirements.
- [modules/Import_Export.md](./modules/Import_Export.md), [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md), and [modules/Integrations.md](./modules/Integrations.md) own specialized movement and recovery.
- [STATE_SYSTEM.md](./STATE_SYSTEM.md), [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md), and [SECURITY_UX.md](./SECURITY_UX.md) own state, Permission, and security communication.

## Architecture principles

1. **Trusted identity establishes scope.** The active `orgId` comes from the authenticated Firestore profile; client input must not select an arbitrary Organization.
2. **Every hop preserves scope.** Route, hook, cache, mutation, upload, API request, and rendered record must retain the relevant Organization, Workspace, Role, and Permission context.
3. **Source records remain distinct from view models.** Timestamp conversion, sorting, filtering, and summaries happen at a declared boundary.
4. **The cache is a projection, not authority.** Query data may be stale and is never an authorization grant.
5. **Writes have explicit outcomes.** A successful request, partial batch, conflict, rejected authorization, and unknown service outcome are not interchangeable.
6. **Sensitive data takes the shortest approved path.** Do not copy protected values into URLs, analytics, broad caches, logs, or unrelated collections.
7. **Audit follows consequential access and change.** Support access, Permission changes, financial changes, exports, and other governed actions must remain reviewable.
8. **Two data paths do not become one by coincidence.** Firebase and API flows require an explicit source-of-truth decision before coexistence or migration.

## Standards

### Current Firebase-first flow

```text
Firebase Auth
  -> AuthContext.onAuthStateChanged
  -> users/{uid} profile
  -> Role + orgId + optional studentId
  -> organizations/{orgId} profile/subscription snapshot
  -> page/layout route gate
  -> TanStack Query hook
  -> Firestore collection/document query
  -> mapDoc/timestamp conversion/filter/summary
  -> query cache
  -> page and approved UI state
```

The current domain path uses collections such as:

```text
organizations/{orgId}/students
organizations/{orgId}/teachers
organizations/{orgId}/attendance
organizations/{orgId}/fees
organizations/{orgId}/exams
organizations/{orgId}/results
organizations/{orgId}/notices
organizations/{orgId}/homework
organizations/{orgId}/routine
organizations/{orgId}/expenses
```

Some records also use `seen/{uid}` subcollections for idempotent Student acknowledgement behavior. These paths are implementation observations, not replacements for the domain module and security contracts.

### Current mutation flow

```text
page form/action
  -> TanStack Query mutation
  -> orgId from AuthContext
  -> Firestore add/set/update/delete
  -> server timestamp or deterministic document identity where used
  -> invalidate affected query keys
  -> page observes pending/success/error and reconciled data
```

Attendance uses deterministic `studentId_date` document IDs for single and bulk marking to prevent duplicate records for the same Student and date. Fee installments are currently stored as an array on the Fee document, with `pending`, `partial`, or `paid` status derived from totals. These implementation choices require integrity and concurrency review before being generalized to other domains.

### Identity and impersonation flow

`AuthContext` resolves the real Firebase session and effective profile. `ImpersonationContext` writes an entry record, sets a temporary profile override, and renders the target Role layout while the super-admin remains authenticated as themselves. On exit it writes an exit record, clears the override, and restores the real profile.

Firestore reads during impersonation run under the super-admin's token according to the current implementation comments and rule model. This is support access, not a target user's session, and must remain visible and auditable.

### Upload flow

The web package uses a Cloudinary helper for image uploads. The data flow must keep the upload result, application record, access policy, failure state, and deletion/replacement behavior explicit. Firebase Storage rules also exist for authenticated photo access/uploads. A feature must identify which storage provider is its source for a given object rather than silently writing to both.

### Separate API flow

The target/separate API flow is:

```text
API consumer
  -> customFetch / generated operation
  -> Express /api route
  -> request validation
  -> Authentication + Organization/Role/Permission resolution
  -> Drizzle/PostgreSQL or another declared source
  -> typed response/error
  -> client cache/view-model adapter
```

At present, only the health route is mounted in the Express service while the OpenAPI contract describes broader Students, Attendance, and Dashboard operations. The web product does not currently use this API flow for its domain data.

## Implementation guidelines

### Scope derivation

Never accept `orgId` from a user-controlled filter as authority. Derive it from the authenticated profile or a server-verified request context. If the active profile has no required scope, disable the query or return an explicit setup/unauthorized state rather than reading a broad collection.

### Read transformations

`mapDoc` currently adds a Firestore document ID and normalizes `createdAt` timestamps to strings. Domain hooks may apply filters, sorting, numeric conversion, and summaries. Keep transformations at the hook or adapter boundary, name assumptions, preserve source freshness where relevant, and avoid mutating cached source data in place.

### Write integrity

Use deterministic IDs or server-side idempotency where the domain requires duplicate prevention. For bulk writes, define whether partial completion is possible, how failed items are reported, and how retry avoids duplicate or conflicting records. A client-side `Promise.all` is not by itself a transaction or an atomic operation.

### Query and cache integrity

Query keys begin with Organization scope in current hooks, such as `[orgId, "students", search, status]`. Every parameter that changes a result must be represented. After a mutation, invalidate all affected projections, including summaries and related detail, or update them through a documented safe strategy.

### Errors and unknown outcomes

Map Firestore/API failures into the canonical error categories. Preserve safe form input and intent on validation or service failure. Do not present a write as failed if the request outcome is unknown without explaining reconciliation or refresh behavior; do not present stale cached data as current without a stale state.

### Migration boundary

When an object moves between Firebase and PostgreSQL/API:

1. Declare the current source and target source.
2. Define identifiers, field mapping, Organization scope, timestamps, status, and audit mapping.
3. Define dual-read or dual-write behavior only if necessary and observable.
4. Define reconciliation, backfill, conflict, rollback, and retirement behavior.
5. Update frontend cache and route consumers only after contract evidence exists.

## Accessibility considerations

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [STATE_SYSTEM.md](./STATE_SYSTEM.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), and [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md).

- Data flow must provide stable labels, statuses, result counts, timestamps, and errors for accessible presentation.
- Loading and mutation transitions preserve page context, focus, safe input, and recovery.
- Partial bulk outcomes identify affected records without relying on color alone.
- Authorization and missing-scope outcomes are distinguishable without confirming protected data.
- Upload progress, rejection, replacement, and recovery have accessible status and controls.

## AI implementation notes

No AI data flow is currently implemented. If introduced, AI inputs must be limited to authorized scope, source records must remain distinct from generated output, and model calls must expose enough metadata for human review, uncertainty, source attribution, and audit without logging sensitive content unnecessarily.

AI output must not enter a durable Student, Teacher, Fee, Exam, Permission, or Report source record without an explicit authorized review and write operation.

## Review checklist

- [ ] Every hop identifies source, destination, scope, owner, transformation, and failure behavior.
- [ ] Organization and Role context cannot be replaced by client-controlled input.
- [ ] Firestore/API paths, cache keys, and rendered records remain scope-aligned.
- [ ] Writes define duplicate, partial, conflict, unknown-outcome, and recovery behavior.
- [ ] Upload provider, access rules, replacement, and deletion behavior are explicit.
- [ ] Audit, privacy, retention, and sensitive-data minimization are reviewed.
- [ ] Firebase-first and API-target paths are not presented as one implemented path.

## Validation checklist

- [ ] Auth and profile resolution are tested for missing, invalid, stale, and changed Organization context.
- [ ] Cross-Organization reads, writes, direct links, cached records, and impersonation exit are tested.
- [ ] Query keys and invalidation are tested for filters, summaries, detail, and mutations.
- [ ] Deterministic attendance writes, fee installment totals, and bulk operations are tested for duplicate and partial outcomes.
- [ ] Upload access, invalid files, failed uploads, replacement, and recovery are tested.
- [ ] API contract paths are compared with mounted routes and declared source of truth.
- [ ] Accessible state, privacy, security, observability, and recovery evidence is recorded.
- [ ] Release evidence and exceptions are recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Audit_Logs.md](./modules/Audit_Logs.md)
- [modules/Import_Export.md](./modules/Import_Export.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)