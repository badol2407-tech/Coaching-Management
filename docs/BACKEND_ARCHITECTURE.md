---
title: EduTrack Backend Architecture
purpose: Define the current server, persistence, security-boundary, and target backend architecture for EduTrack.
scope: Express service, OpenAPI contract, generated API packages, Drizzle/PostgreSQL schema, Firebase rules and services, and separation between current and target data paths.
audience: Engineering, Security, Privacy, Reliability, QA, Product, Operations, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./PERMISSION_DESIGN.md
  - ./SECURITY_UX.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Authentication.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Integrations.md
  - ./AI_UX_GUIDELINES.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a service, persistence, authorization, tenancy, or migration change
owner: Engineering, Security, Privacy, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding standards
canonical_terms: Organization, Workspace, Role, Permission, Authentication, source of truth, audit, recovery, Students, Attendance, Dashboard, API
---

# EduTrack Backend Architecture

## Metadata

This handbook describes two backend-related paths that coexist in the repository. The first is the active Firebase-backed web data path. The second is a separately packaged Express, OpenAPI, generated-client, Zod, Drizzle, and PostgreSQL architecture whose contract is broader than its current route implementation. These paths must not be conflated.

## Purpose

The backend architecture must make authorization, Organization isolation, source of truth, data integrity, observability, and recovery explicit. This document records what exists now and establishes the boundary conditions for completing or extending the separate API architecture without misrepresenting it as active web behavior.

## Scope

### Included

- Firebase Auth, Firestore, Firebase Realtime Database rules, and Storage rules as they relate to the web product.
- The Express service under `artifacts/api-server`.
- The OpenAPI source under `lib/api-spec/openapi.yaml`.
- Generated React and Zod packages under `lib/api-client-react` and `lib/api-zod`.
- Drizzle/PostgreSQL schema and database initialization under `lib/db`.
- Service, persistence, tenancy, migration, and observability boundaries.

### Excluded

- Frontend route and component composition, which belongs to [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).
- Product-level Permission policy and retention rules owned by the relevant module and governance handbooks.
- Claiming that every OpenAPI operation is implemented or that PostgreSQL is the current web source of truth.

## Ownership

| Concern | Primary owner | Responsibility |
| --- | --- | --- |
| Service runtime and route registration | Engineering | Keep middleware, routes, error handling, and health behavior explicit. |
| API contract and generated artifacts | Engineering | Treat `lib/api-spec/openapi.yaml` as the contract source and regenerate dependent packages deliberately. |
| Data source and persistence | Engineering and Reliability | Name the source of truth, consistency model, migration path, and recovery behavior. |
| Authorization, tenancy, and privacy | Security, Privacy, and Engineering | Enforce scope at the data boundary and test direct access. |
| Observability and operations | Reliability and Operations | Make health, errors, latency, dependency failures, and recovery visible. |
| Release evidence | QA, Security, Accessibility, and Engineering | Validate contracts, negative paths, migrations, and operational readiness. |

## Related documents

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns technical correctness, tenancy, integrity, reliability, security, privacy, and testing.
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [SECURITY_UX.md](./SECURITY_UX.md) own Permission behavior and user-facing security communication.
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md) owns Organization and Workspace isolation behavior.
- [modules/Authentication.md](./modules/Authentication.md) owns sign-in, sessions, recovery, and security state.
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md) owns backup, restore, verification, and recovery contracts.
- [modules/Integrations.md](./modules/Integrations.md) owns external provider consent, mapping, sync, webhook, and disconnect behavior.

## Architecture principles

1. **One request has one explicit authority boundary.** The service or rules layer that authorizes a read or write must be identifiable.
2. **The source of truth is not inferred from package presence.** A schema, generated client, or route contract does not prove that the web product uses that path.
3. **Tenant scope is data-boundary behavior.** Organization or Workspace isolation cannot depend only on a URL, client filter, or hidden UI state.
4. **Contracts and implementations are compared continuously.** An OpenAPI path that is not mounted is a contract gap, not an implementation fact.
5. **Persistence changes are governed migrations.** A schema change includes compatibility, backfill, rollback or compensating behavior, and evidence.
6. **Errors are typed and observable.** Validation, authentication, authorization, not found, conflict, rate limit, dependency, timeout, and service failures remain distinguishable.
7. **Consequential writes are idempotent or recoverable.** Attendance, Fees, Exams, Permissions, exports, and integration operations need explicit duplicate and retry behavior.
8. **No secret crosses a user-visible or analytics boundary.** Credentials, tokens, private data, and sensitive payloads remain constrained to their approved server or rules boundary.

## Standards

### Current-state boundary

| Layer | Current implementation | Source of truth today |
| --- | --- | --- |
| Web authentication | Firebase Auth listener in `artifacts/web/src/contexts/AuthContext.tsx` | Firebase Auth plus `users/{uid}` profile |
| Web domain data | Direct Firestore hooks in `artifacts/web/src/lib/hooks.ts` and related helpers | Organization-scoped Firestore collections |
| Web media upload | Cloudinary helper in the web package | Cloudinary for uploaded media, with application references |
| Realtime Database | `database.rules.json` closes reads and writes | Not an active web domain data path |
| Storage | `storage.rules` governs authenticated photo access/uploads | Firebase Storage rules and stored objects |
| Express API | `artifacts/api-server/src/app.ts` mounts `/api`; routes currently include health | `GET /api/healthz` is the implemented API route |
| API contract | `lib/api-spec/openapi.yaml` describes health, Students, Attendance, and Dashboard operations | OpenAPI document is the contract source |
| PostgreSQL | Drizzle schema currently includes Students and Attendance tables | Separate database package; not the active web path |

The PostgreSQL schema currently does not mirror the Organization-scoped Firestore path with an Organization or tenant column. This is an architecture gap to resolve before the API path can become a multi-Organization source of truth; it is not a reason to infer isolation that the schema does not enforce.

### Target guidance for the separate API path

Before the Express/OpenAPI/Drizzle path handles production domain traffic, it must define:

- Authentication and token/session verification at the service boundary.
- Role and Permission evaluation for every operation, including direct object access.
- Organization or Workspace scope in request context and persistence constraints.
- Request validation from generated Zod schemas and response validation where appropriate.
- Error envelope, correlation, audit, rate-limit, and observability contracts.
- Database migration, backfill, uniqueness, transaction, and recovery behavior.
- Compatibility between OpenAPI schemas, generated packages, route handlers, and database models.

These are architecture requirements derived from the binding engineering and security standards; they do not replace those standards with new numeric thresholds.

## Implementation guidelines

### Express service

`artifacts/api-server/src/app.ts` is responsible for Express setup, JSON parsing, CORS, request logging, and mounting the `/api` router. `artifacts/api-server/src/routes/index.ts` currently mounts the health route, and `health.ts` returns the generated `HealthCheckResponse` for `/healthz`.

Keep route registration explicit. A route should be mounted only after its handler, validation, authorization, persistence, error mapping, and tests exist. Health must report dependency readiness according to the operational contract rather than imply that all domain routes are available.

### Contract generation

`lib/api-spec/orval.config.ts` generates:

- React Query client code in `lib/api-client-react/src/generated` using `customFetch`.
- Zod schemas and TypeScript types in `lib/api-zod/src/generated`.

The OpenAPI title is intentionally `Api` because generated exports depend on it. Contract edits require generated-artifact review, route implementation review, and compatibility checks. Generated output is not the place to author business rules.

### Database

`lib/db/src/index.ts` creates a PostgreSQL pool from `DATABASE_URL` and exposes Drizzle with the schema barrel. Current schemas include Students and Attendance, including an Attendance uniqueness constraint. Database initialization must fail explicitly when its required connection configuration is absent.

Before adding API-backed Organization data, align the relational model with the Organization and Workspace contract. State whether records are Organization-scoped, globally shared, or owned by another source, and test cross-Organization reads and writes.

### Firebase web boundary

The current web path derives `orgId` from the authenticated Firestore profile and constructs paths such as `organizations/{orgId}/students`. Firebase rules remain the enforcement boundary; client path construction is not sufficient authorization. Changes to Firestore collections, Storage access, or profile resolution require direct-access and negative-path testing.

### API client boundary

`lib/api-client-react/src/custom-fetch.ts` supports an optional base URL and bearer token getter for API consumers such as non-browser bundles. Its own comments state that the bearer getter is not for browser applications that use session cookies. A new web API integration must choose its authentication model deliberately and must not attach an unreviewed token flow.

## Accessibility considerations

Backend architecture affects accessibility by determining whether the frontend can receive stable status, validation, error, progress, and recovery information. Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md).

- API and Firebase errors must preserve enough semantic information for accessible inline validation and recovery.
- Long-running operations need machine-readable progress or pending state where the frontend presents progress.
- Authorization failures must not leak protected object existence and must map to an understandable, non-ambiguous UI state.
- Response schemas must not require inaccessible presentation assumptions such as color-only status or hover-only metadata.
- Generated schemas and error envelopes must support localized labels and text expansion without truncating meaning.

## AI implementation notes

No AI implementation code was found in the backend packages. If an AI service is introduced, [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) and the AI Assistant module specification remain authoritative.

An AI backend must carry Organization, Workspace, Role, Permission, source scope, and user intent through the request boundary; minimize input data; separate generated output from source records; record model and source metadata appropriate to audit; and require explicit human review for any consequential write. AI-generated output must not silently become a trusted database field.

## Review checklist

- [ ] The change names the active source of truth and distinguishes it from contracts or target architecture.
- [ ] Authentication, Role, Permission, Organization scope, direct-object access, and cross-Organization negative paths are defined.
- [ ] Request and response schemas, generated artifacts, handlers, database models, and migrations agree.
- [ ] Errors remain typed, safe, observable, and recoverable.
- [ ] Idempotency, uniqueness, retries, transactions, compensating actions, and audit behavior are explicit for consequential writes.
- [ ] Firebase rules or API middleware enforce the same scope the UI communicates.
- [ ] Operational health, dependencies, logs, privacy, and incident ownership are reviewed.
- [ ] Accessibility and AI implications are linked to their canonical owners.

## Validation checklist

- [ ] The implemented route set is compared with the OpenAPI path set; unimplemented operations are recorded as gaps.
- [ ] Contract generation completes without drift and generated packages type-check.
- [ ] Route tests cover success, validation, authentication, authorization, not found, conflict, dependency, timeout, and malformed response paths as applicable.
- [ ] Database tests cover Organization scope, uniqueness, concurrent writes, migration compatibility, and recovery.
- [ ] Firebase tests cover direct reads and writes across roles and Organizations.
- [ ] Health checks distinguish process availability from required dependency readiness.
- [ ] Sensitive fields, credentials, tokens, logs, analytics, exports, and error bodies are reviewed.
- [ ] Release evidence and exceptions are recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)