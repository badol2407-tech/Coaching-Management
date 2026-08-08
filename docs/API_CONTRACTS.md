---
title: EduTrack API Contracts
purpose: Provide an implementation-facing workflow for authoring, generating, implementing, reviewing, and evolving API contracts without creating a second API authority.
scope: OpenAPI contract work, generated clients and schemas, route implementation, consumer adoption, compatibility, errors, scope, and release handoff.
audience: API Engineering, Backend Engineering, Frontend Engineering, QA, Security, Privacy, Reliability, and contributors.
related_documents:
  - ./API_LAYER_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./ENGINEERING_STANDARDS.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./ERROR_HANDLING.md
  - ./AUTHENTICATION_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./QUALITY_GATES.md
  - ./IMPLEMENTATION_CHECKLIST.md
review_frequency: Quarterly and after an API contract, generator, transport, route, or source-of-truth change
owner: API Engineering and Backend Engineering
version: 1.0.0
status: Active implementation-support handbook
last_updated: 2026-08-02
normative_level: Implementation guidance subordinate to API Layer Architecture and binding engineering, security, privacy, and release standards
canonical_terms: API, OpenAPI, operation, schema, source of truth, generated artifact, Organization, Workspace, Role, Permission, Authentication
---

# EduTrack API Contracts

## Purpose and authority

This is the practical companion for API contract work. [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) owns the API boundary, source-of-truth rules, generation model, and current implementation status. This handbook turns that architecture into a repeatable implementation sequence; it does not replace the OpenAPI file, generated packages, route implementation, or release gates.

When this handbook conflicts with [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md), [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md), or [QUALITY_GATES.md](./QUALITY_GATES.md), follow the higher-level owner and record a decision when the conflict is material.

## Current repository boundary

- `lib/api-spec/openapi.yaml` is the authored API contract.
- `lib/api-spec/orval.config.ts` defines generation behavior.
- `lib/api-client-react` contains generated React Query operations and the shared transport boundary.
- `lib/api-zod` contains generated Zod schemas and types.
- `artifacts/api-server` contains the Express service and explicitly registered routes.
- The current web product remains Firebase-first. A contract or generated operation is not evidence that the web app consumes the API.

Keep contract-only paths, mounted routes, generated output, and active web consumers distinguishable in every change.

## Contract-to-release flow

### 1. Establish the boundary

Before editing a contract, identify:

- the canonical object and workflow;
- the owning source of truth;
- the consuming package or client;
- Authentication, Role, Permission, Organization, and Workspace scope;
- audit, privacy, retention, and recovery implications;
- whether the change is contract-only, generated, server-mounted, consumer-adopted, or a combination.

Use [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) and the relevant [module specification](./modules/) for product vocabulary and workflow scope.

### 2. Author the operation

Author the contract in the OpenAPI source. Every operation should make the following reviewable:

| Contract area | Implementation question |
| --- | --- |
| Identity | What object or workflow does this operation represent? |
| Inputs | Which path, query, header, and body values are required, optional, nullable, or enumerated? |
| Output | What stable response shape and status does a successful consumer receive? |
| Failure | Which validation, authentication, authorization, not-found, conflict, dependency, and service outcomes can occur? |
| Scope | How is Organization or Workspace context resolved and enforced? |
| Side effects | Is the operation read-only, idempotent, retryable, auditable, or consequential? |
| Compatibility | Which existing clients, generated packages, routes, persistence structures, and migrations are affected? |

Use the error categories and user-facing recovery behavior owned by [ERROR_HANDLING.md](./ERROR_HANDLING.md); do not create an API-only error taxonomy that cannot be translated safely.

### 3. Generate and inspect

After an OpenAPI source change:

1. run the repository's code-generation command;
2. inspect generated React Query, Zod, and type output;
3. confirm operation names, parameters, schemas, and error handling match the authored contract;
4. do not hand-edit generated files;
5. record generation and compatibility evidence for review.

Generated output is derived evidence. If the generated result is unexpected, fix the source contract or generation configuration rather than patching the output.

### 4. Implement and mount

Implement route behavior in the backend boundary:

```text
request
  -> parse and validate
  -> authenticate
  -> resolve Organization, Workspace, Role, and Permission
  -> load or mutate the active source of truth
  -> map the domain result
  -> emit safe errors and required audit/operational signals
  -> return the contracted response
```

Register the route explicitly. A generated operation, schema, or file under `lib/` does not make a route live.

### 5. Adopt from a consumer

The web application stays on its current Firebase path unless an explicit source-of-truth and migration decision selects the API. API adoption requires an adapter, query-key and invalidation plan, authentication and scope propagation, loading and recovery behavior, staged rollout where needed, reconciliation, and rollback evidence.

Do not silently call an API from a Firebase-backed page because a generated hook is available.

## Compatibility review

Classify the change before implementation:

- **Additive:** a new operation or optional field that does not change existing interpretation.
- **Behavioral:** an existing operation keeps its shape but changes validation, authorization, state transition, freshness, or side effects.
- **Breaking:** an existing required input, response meaning, error behavior, permission boundary, or source-of-truth assumption no longer works for a current consumer.

For behavioral and breaking changes, identify consumer impact, migration order, rollout state, reconciliation, and recovery. Use [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for promotion and rollback ownership.

## Review and validation handoff

- [ ] The contract source is identified and the operation is labeled contract-only or implemented.
- [ ] Request, response, error, Authentication, Role, Permission, Organization, Workspace, audit, privacy, and recovery behavior are explicit.
- [ ] Generated packages were regenerated from the source contract.
- [ ] Mounted routes and generated operations agree.
- [ ] Existing consumers and the active Firebase source of truth were checked.
- [ ] Contract, authorization, data-integrity, accessibility-state, error, and recovery evidence is linked where applicable.
- [ ] Compatibility, migration, rollout, and rollback impact is recorded.
- [ ] The change passes the applicable [QUALITY_GATES.md](./QUALITY_GATES.md) decision.

Use [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for the broader change handoff. This document supplies the API-specific evidence, not a second release gate.

## References

- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [ERROR_HANDLING.md](./ERROR_HANDLING.md)
- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
