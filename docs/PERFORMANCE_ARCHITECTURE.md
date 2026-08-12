---
title: EduTrack Performance Architecture
purpose: Define how EduTrack keeps common workflows responsive, measures meaningful work, and avoids performance regressions across current and target data paths.
scope: Route startup, rendering, lazy loading, Firebase reads, query/cache behavior, uploads, API and database adoption, mobile networks, observability, and performance evidence.
audience: Engineering, Frontend, Backend, Reliability, QA, Product, Accessibility, Security, Privacy, Operations, and contributors.
related_documents:
  - ./PRODUCT_CONSTITUTION.md
  - ./ENGINEERING_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./CACHING_STRATEGY.md
  - ./STATE_MANAGEMENT.md
  - ./MOBILE_UX_GUIDE.md
  - ./RESPONSIVE_SYSTEM.md
  - ./ERROR_HANDLING.md
review_frequency: Quarterly and after a framework, data-source, query, infrastructure, bundle, upload, or reliability change
owner: Engineering, Frontend, Backend, Reliability, QA, Product, and Accessibility
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding engineering, accessibility, product, and reliability standards
canonical_terms: performance, latency, p50, p95, startup, interaction, freshness, loading, stale, Organization, source of truth
---

# EduTrack Performance Architecture

## Metadata

This handbook defines performance ownership and measurement boundaries. It reuses the response expectations and performance guidance already established in [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md), [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), and the module handbooks; it does not create competing numeric thresholds.

## Purpose

Performance is part of correctness, accessibility, and trust. A Teacher marking Attendance, an administrator reviewing Fees, or a Student opening a shared record needs immediate acknowledgment, useful progress, and a truthful result. The architecture therefore optimizes the path to useful work rather than only raw server or bundle metrics.

## Scope

### Included

- Initial web startup, route transitions, lazy page loading, and rendering.
- Firebase Auth/profile resolution and Firestore reads/writes.
- TanStack Query cache, invalidation, client filtering, and source freshness.
- Cloudinary image validation, compression, upload, retry, and deletion.
- Future Express/API/database performance and migration measurement.
- Mobile, constrained networks, accessibility, observability, and recovery.

### Excluded

- Product-level response expectations and interaction principles owned by the Constitution, UX laws, and Engineering Standards.
- Cache ownership and key contracts, which are detailed in [CACHING_STRATEGY.md](./CACHING_STRATEGY.md).
- Database schema ownership, which is detailed in [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Startup and frontend runtime | Frontend Engineering | Keep provider, route, bundle, render, and asset work measurable and non-blocking where safe. |
| Data access | Frontend and Backend Engineering | Reduce unnecessary reads, preserve scope, and provide stable loading and error behavior. |
| API and database | Backend, Data, and Reliability | Measure server, dependency, query, migration, and serialization cost. |
| User-perceived performance | Product, Accessibility, and Design | Ensure feedback, progress, focus, and usable content arrive in the right order. |
| Evidence and regression control | QA and Reliability | Maintain representative datasets, network profiles, measurements, and release decisions. |

## Related documents

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns p50/p95 measurement expectations and technical performance quality.
- [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) owns the product response and progress principles.
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) owns provider, route, lazy-loading, and frontend boundaries.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns source, transformation, cache, and mutation flow.
- [CACHING_STRATEGY.md](./CACHING_STRATEGY.md) owns cache identity, freshness, invalidation, and persistence.
- [QUALITY_GATES.md](./QUALITY_GATES.md) owns evidence and release decisions.

## Architecture principles

1. **Measure useful work.** Time to usable identity, content, action acknowledgment, durable acceptance, and recovery matters more than an isolated synthetic score.
2. **Prioritize the critical path.** Resolve enough context to make the next safe action available, then load optional detail independently.
3. **Do not trade security or accessibility for speed.** Scope checks, semantic status, focus, error recovery, and privacy remain release requirements.
4. **Avoid unnecessary reads and renders.** Query only the authorized data needed for the current task and preserve stable UI structure while optional regions load.
5. **Keep current and target paths separate.** Performance observations from Firestore cannot be used as evidence for the future API/database path.
6. **Make slow work visible and recoverable.** Pending, progress, timeout, cancellation, retry, partial, and unknown outcomes are part of the performance contract.
7. **Optimize for representative reality.** Test realistic Organization sizes, long names, dense records, mobile input, zoom, localization, and constrained networks.

## Standards

### Current frontend path

The web application uses React/Vite, Wouter, lazy-loaded page modules, TanStack Query, Firebase Auth/Firestore, and shared UI packages. `App.tsx` creates the query client with retries disabled and window-focus refetch disabled. Pages are loaded through `React.lazy` and Suspense fallbacks.

Current performance characteristics include:

- profile and Organization subscription context are loaded after Firebase Auth state;
- many Firestore collection hooks fetch a scoped collection and filter or summarize in the browser;
- no default `staleTime` is configured in the current query client;
- image uploads validate and compress in the browser, then use Cloudinary progress, timeout, and retry behavior;
- the separate Express service currently exposes health only, while broader API operations are contract-only.

These are observations, not universal targets. They identify likely measurement and optimization work without claiming that a page or API is within a performance budget.

### Critical user journeys

Measure at least:

| Journey | Useful performance outcome |
| --- | --- |
| Authentication | Authenticated and correctly scoped workspace becomes usable. |
| Dashboard | Primary operational overview is useful while secondary panels continue. |
| Student/Teacher Search | Input remains responsive and results preserve scope and context. |
| Attendance | Marking is acknowledged, saved, and reconciled without duplicate action. |
| Fees | Payment action shows pending state and durable balance/receipt outcome. |
| Reports | Scope and progress are visible until the result is ready or recoverable. |
| Settings/Permissions | Consequential change confirms the actual accepted result. |
| Uploads | Validation, progress, timeout, retry, and final reference are understandable. |

### Measurement model

Capture p50 and p95 for the journeys named by [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), along with:

- startup and route-to-useful-content;
- Auth and profile resolution;
- query cache hit, miss, stale, refetch, and invalidation;
- Firestore/API request duration and payload size;
- mutation acceptance, durable completion, reconciliation, and unknown outcomes;
- long-task, bundle, render, and memory signals;
- upload validation, compression, progress, retry, and cleanup;
- error, timeout, cancellation, and recovery rates.

Measurements identify environment, version, dataset size, Role, Organization scope, device, browser, viewport, network profile, cache state, and tool version. Do not include protected record contents in telemetry.

### Data and query efficiency

Use [CACHING_STRATEGY.md](./CACHING_STRATEGY.md) for query keys and invalidation. Performance work must not broaden a query or bypass authorization. When collection size grows, prefer a governed server-side query, index, pagination, or summary contract rather than indefinitely expanding browser reads and filtering.

### API and database readiness

Before domain traffic moves to Express/PostgreSQL, measure authentication and scope resolution, validation, database queries, indexes, serialization, dependency calls, error mapping, and cache behavior. Compare contract, route, schema, Organization constraints, and rollback evidence. The current API health route is not evidence of domain latency.

## Implementation guidelines

### Loading order

Load identity and required Organization scope before protected data. Make the primary task useful before optional charts, history, or promotional content. Preserve layout, labels, filters, and user intent during loading; avoid a blank screen or an indefinite spinner.

### Interaction feedback

A direct action receives immediate visible acknowledgment. Slower work exposes meaningful pending or progress state, and work that may fail provides a retry, cancel, leave-safe, or reconciliation path. Do not report durable success before the source accepts and the affected projection is reconciled.

### Client and asset work

Keep lazy boundaries aligned with route and feature ownership. Avoid loading large optional modules on the initial route. Images and media should be validated, resized or compressed where safe, loaded at the required size, and remain privacy- and access-controlled. Performance changes must not weaken the upload or deletion contract.

### Failure and recovery

Timeout, offline, dependency failure, stale data, partial completion, and unknown outcome remain distinct. Retry only when safe and bounded; consequential writes need idempotency or explicit reconciliation. Follow [ERROR_HANDLING.md](./ERROR_HANDLING.md) and [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md).

### Accessibility and mobile

Do not remove semantic status, focus, keyboard operation, text alternatives, or reduced-motion behavior for performance. Test at increased text size, 200% zoom, narrow reflow, touch input, and representative mobile networks. See [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md) and [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md).

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md), [LOADING_STATES.md](./LOADING_STATES.md), [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md), and [ERROR_HANDLING.md](./ERROR_HANDLING.md).

- Fast paths still expose a meaningful loading or pending state when completion is not immediate.
- Slow and failed operations preserve focus, input, scope, and recovery.
- Skeletons and progressive loading preserve semantics and do not conceal missing or unauthorized data.
- Reduced motion, screen readers, keyboard users, zoom, and localization receive the same useful state as pointer users.

## AI implementation notes

No AI runtime is implemented. Future AI requests must expose pending, generated, reviewing, failed, cancelled, and unavailable states, measure provider latency without logging sensitive prompts or responses, and never turn a fast generated response into an authoritative record or consequential write.

## Review checklist

- [ ] Critical user journeys and useful outcomes are named.
- [ ] Current observations are separated from target architecture and numeric owners.
- [ ] Identity, scope, authorization, cache, query, payload, render, asset, and dependency costs are considered.
- [ ] Immediate acknowledgment, progress, timeout, retry, cancellation, partial, unknown, and recovery behavior is explicit.
- [ ] Performance optimization does not bypass security, privacy, accessibility, or integrity controls.
- [ ] Measurements use representative data, Roles, Organizations, devices, viewports, networks, and cache states.
- [ ] Evidence and exceptions follow [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] p50/p95 evidence exists for affected journeys and identifies environment, dataset, scope, device, and network.
- [ ] Startup, route, query, cache, mutation, upload, API, database, and dependency timings are distinguishable.
- [ ] Large collections, long content, localization, mobile, zoom, reduced motion, and assistive technology are tested.
- [ ] Slow, offline, timeout, duplicate, stale, partial, conflict, and unknown-outcome paths are recoverable.
- [ ] Security and authorization checks remain in the measured path.
- [ ] Regression evidence, owner, mitigation, decision, and rollback are recorded for release.

## References

- [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [CACHING_STRATEGY.md](./CACHING_STRATEGY.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md)
- [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)