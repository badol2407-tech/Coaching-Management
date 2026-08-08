---
title: EduTrack API Layer Architecture
purpose: Define the OpenAPI contract, generated client and schema layers, Express implementation boundary, and current integration status for EduTrack APIs.
scope: OpenAPI source, Orval generation, generated React Query and Zod packages, custom fetch transport, Express route registration, API errors, authentication, and web adoption boundaries.
audience: Engineering, Security, Privacy, Reliability, QA, Product, Operations, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./BACKEND_ARCHITECTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./PERMISSION_DESIGN.md
  - ./SECURITY_UX.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Authentication.md
  - ./ERROR_HANDLING.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after an API contract, generator, transport, authentication, or route implementation change
owner: API Engineering, Backend Engineering, Security, Privacy, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding engineering and security standards
canonical_terms: API, source of truth, Organization, Workspace, Role, Permission, Authentication, Students, Attendance, Dashboard, Reports, error, contract
---

# EduTrack API Layer Architecture

## Metadata

This handbook documents the API layer that exists in the repository and clearly separates the OpenAPI contract from the currently mounted Express implementation and from the Firebase-first web application. It is an implementation architecture guide, not an assertion that all contracted operations are live.

## Purpose

An API layer gives independently deployable clients a typed, validated, observable boundary for domain operations. To be trustworthy, the contract, generated clients, validators, route handlers, authorization, persistence, and error behavior must agree. This handbook defines those relationships and the evidence required before the separate API path becomes an active web source.

## Scope

### Included

- `lib/api-spec/openapi.yaml` as the contract source.
- `lib/api-spec/orval.config.ts` as generation configuration.
- `lib/api-client-react` generated React Query client and `customFetch`.
- `lib/api-zod` generated Zod schemas and TypeScript types.
- `artifacts/api-server` Express setup and route registration.
- Authentication, scope, validation, error, and compatibility boundaries.

### Excluded

- Direct Firestore hook implementation, except where the web/API boundary must be distinguished.
- Database schema details beyond API compatibility, which belong to [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md).
- Product-level object and Permission definitions owned by the module and canonical standards.

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| OpenAPI contract | API Engineering | Author paths, operations, schemas, parameters, errors, and compatibility intent. |
| Code generation | API Engineering and Developer Experience | Maintain Orval configuration and review generated output. |
| Express implementation | Backend Engineering | Register routes, middleware, validation, authorization, persistence, and errors. |
| Client transport | API Engineering | Maintain fetch behavior, base URL, auth mode, parsing, and typed errors. |
| Security and tenancy | Security and Backend Engineering | Enforce Authentication, Role, Permission, and Organization scope at the API boundary. |
| Consumer adoption | Frontend and API Engineering | Introduce adapters and source-of-truth decisions before using generated operations in the web app. |

## Related documents

- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) owns service and persistence boundaries.
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) owns the current Firebase-first web integration boundary.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns end-to-end identity, scope, record, and error movement.
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns contract correctness, authorization, reliability, security, privacy, and testing.
- [ERROR_HANDLING.md](./ERROR_HANDLING.md) owns user-visible error categories and recovery.

## Architecture principles

1. **OpenAPI is authored once.** The YAML contract is the source for generated API types, client operations, and Zod schemas.
2. **Generated output is derived.** Do not hand-edit generated operations or schemas to hide contract or implementation drift.
3. **A contract path is not a live route.** The mounted Express route set is the implementation truth; gaps are recorded explicitly.
4. **Validation and authorization are separate.** A syntactically valid request can still be unauthorized or out of Organization scope.
5. **The client transport is explicit.** Base URL, authentication mode, response parsing, and error mapping are deliberate configuration.
6. **One object has one active source of truth.** Generated API hooks must not silently compete with Firestore hooks for the same web object.
7. **Compatibility is a release concern.** Contract changes require consumer, server, generated artifact, persistence, migration, and rollback review.

## Standards

### Current API surface

The OpenAPI document defines `/api/healthz`, Students operations, Attendance operations, and Dashboard operations including statistics, daily attendance, monthly attendance, and batches. The Express service currently mounts the health route; the broader paths are contract definitions, not confirmed implemented endpoints.

The API server's current route flow is:

```text
Express app -> JSON/CORS/logging middleware -> /api router -> health router -> /healthz
```

### Generation layers

`orval.config.ts` uses the OpenAPI document to generate a React Query client under `lib/api-client-react/src/generated` and Zod output under `lib/api-zod/src/generated`. The generated client uses `customFetch`, with `/api` as its configured relative base.

The custom fetch layer supports:

- optional base URL prepending for relative paths;
- an optional bearer token getter for clients that need it;
- JSON, text, blob, and automatic response parsing;
- typed `ApiError` for non-success responses;
- `ResponseParseError` for malformed JSON responses;
- explicit no-body handling.

The browser web app currently does not import the generated client for its domain data path; it uses Firebase hooks instead.

### Contract and error model

Every operation must define request parameters, request body, successful response, authorization expectations, and failure responses. The implementation must preserve status and safe error details without leaking protected object existence or secrets. Use the error categories in [ERROR_HANDLING.md](./ERROR_HANDLING.md) rather than inventing a client-only taxonomy.

### Authentication and scope

The current custom fetch bearer-token facility is intended for configured API consumers and explicitly is not a browser session-cookie substitute. Before API adoption by the web app, choose and document the Authentication model, Organization context, Role and Permission evaluation, token/session lifetime, refresh behavior, and logout/revocation behavior.

OpenAPI query parameters such as `batch`, `class`, `status`, `search`, `studentId`, `date`, and `month` are filters or operation inputs; they do not establish authorization or Organization scope.

## Implementation guidelines

### Authoring a contract

1. Start with the canonical object and workflow definition.
2. Declare source of truth, Organization or Workspace scope, Role and Permission requirements, and audit implications.
3. Define stable request and response schemas with explicit nullable, required, and enum behavior.
4. Define validation, authorization, not-found, conflict, dependency, and service failure responses.
5. Generate client and Zod packages.
6. Implement and register the route.
7. Add contract, authorization, persistence, accessibility-state, and recovery tests.

### Generated package discipline

The API title must remain compatible with the generation assumptions documented in `orval.config.ts`. Generated output should be reviewed as a build artifact. Custom behavior belongs in `custom-fetch.ts`, an adapter, or a route/service module—not in generated operation files.

### Server implementation

Route modules should be small and explicit:

```text
request -> parse/validate -> authenticate -> resolve Organization/Role/Permission
         -> load or mutate source -> map domain result -> typed response
         -> audit/observe consequential outcome
```

The current health route parses its response through `HealthCheckResponse` before returning JSON. Domain routes must apply equivalent request and response discipline once implemented.

### Web adoption

A Firebase-backed page remains on the Firebase path unless an explicit migration record selects the API source. API adoption requires:

- a source-of-truth and rollout decision;
- an adapter for API response shapes;
- query key and invalidation design;
- authentication and Organization scope propagation;
- loading, stale, error, retry, and offline behavior;
- feature-flag or staged rollout behavior if both paths temporarily coexist;
- rollback and reconciliation evidence.

## Accessibility considerations

API responses determine whether frontend controls can communicate meaningful status. Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), [LOADING_STATES.md](./LOADING_STATES.md), and [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md).

- Validation responses identify the affected field or operation in a stable, localizable way.
- Pending or asynchronous operations provide status and recovery information.
- Errors distinguish authorization, validation, conflict, unavailable service, and retryable dependency failure without exposing protected data.
- Response data includes the labels, relationships, scope, and status needed for non-color, non-hover, keyboard-complete presentation.
- Pagination, filtering, and sorting metadata must support accessible result counts and preserved query context when introduced.

## AI implementation notes

No AI operation exists in the current OpenAPI contract or Express implementation. If AI endpoints are proposed, they must be separately identified, scoped, rate-limited, auditable, and governed by [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md).

An AI endpoint must distinguish generated suggestions from source records, return source scope and uncertainty metadata where appropriate, and never apply a consequential write solely because a client received generated output.

## Review checklist

- [ ] The OpenAPI path is labeled as implemented or contract-only.
- [ ] Request, response, error, Authentication, Organization scope, Role, Permission, audit, and retention behavior are documented.
- [ ] Generated React and Zod artifacts are regenerated and reviewed.
- [ ] Express route registration and handler implementation agree with the contract.
- [ ] Database model and migration support the contract without weakening tenant isolation.
- [ ] Client transport authentication and base-path behavior are explicit.
- [ ] The web app's active Firebase source of truth is not silently mixed with the API path.
- [ ] Accessibility, privacy, security, AI, and recovery owners are linked.

## Validation checklist

- [ ] OpenAPI syntax and generated output checks pass.
- [ ] Contract tests cover required, nullable, enum, malformed, and unknown input behavior.
- [ ] Route tests cover success, authentication, authorization, Organization isolation, not found, conflict, and dependency failures.
- [ ] `ApiError` and response parse failures map to safe, recoverable UI states.
- [ ] Generated client hooks are tested for query keys, mutation behavior, and response handling where consumed.
- [ ] Browser or other consumer authentication flows are tested without leaking credentials.
- [ ] Implemented route inventory is compared with the contract inventory.
- [ ] Release evidence is recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [ERROR_HANDLING.md](./ERROR_HANDLING.md)
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)