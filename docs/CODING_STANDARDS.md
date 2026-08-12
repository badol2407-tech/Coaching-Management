---
title: EduTrack Coding Standards
purpose: Define practical implementation conventions that keep EduTrack code readable, explicit, testable, secure, and aligned with the existing architecture.
scope: TypeScript, React, API, data access, generated artifacts, errors, observability, security, accessibility, and documentation contributions.
audience: Frontend, Backend, Full-stack, QA, Security, Reliability, and documentation contributors.
related_documents:
  - ./ENGINEERING_STANDARDS.md
  - ./FOLDER_STRUCTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a language, framework, package-boundary, security, or source-of-truth change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active contributor standard
last_updated: 2026-08-02
normative_level: Contributor guidance subordinate to binding product, engineering, accessibility, security, and release standards
canonical_terms: Organization, Workspace, Role, Permission, source of truth, generated artifact, recovery, audit
---

# EduTrack Coding Standards

## Purpose and authority

These standards make everyday implementation decisions consistent without creating a second set of product, accessibility, security, or release thresholds. The binding rule for a concern remains the canonical owner named in [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).

When a local convention conflicts with a higher-level standard, follow the higher-level standard and record the decision through [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) when the conflict is material.

## Core principles

1. **Make ownership visible.** Every route, page, hook, component, data source, contract, generated artifact, and configuration value has one clear owner.
2. **Prefer explicit behavior.** Name states, inputs, errors, scope, and recovery paths rather than relying on hidden defaults.
3. **Preserve the active source of truth.** Do not add a fallback or mix Firebase, API, PostgreSQL, provider, cache, or fabricated data without an approved source-of-truth decision.
4. **Change the narrowest boundary.** Reuse an existing provider, hook, component, utility, or handbook before adding a parallel one.
5. **Keep useful work recoverable.** A failed or interrupted operation must not silently discard safe input or make an unknown result appear successful.
6. **Treat accessibility, privacy, and observability as implementation concerns.** They are part of the feature contract, not cleanup after the feature is complete.

## Repository and naming conventions

Use [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) to choose a package and source-of-truth boundary before writing code.

- Keep frontend pages under `artifacts/web/src/pages/`, shared UI under `artifacts/web/src/components/`, cross-page providers under `artifacts/web/src/contexts/`, and current Firebase domain access in the established hook boundary.
- Keep Express bootstrap and registered routes under `artifacts/api-server/src/`.
- Author OpenAPI contracts in `lib/api-spec/openapi.yaml`, relational schema in `lib/db/src/schema/`, and generated outputs only in their generated packages.
- Use `PascalCase` for React component files and exported components, `camelCase` for functions and variables, and `UPPER_SNAKE_CASE` only for true module-level constants.
- Use names that describe the domain object or user outcome. Avoid vague names such as `data`, `utils`, `helper`, `thing`, or `temp` when a specific name is available.
- Keep imports directed toward the owning layer. Do not create circular dependencies between pages and components, generated packages and application code, or route modules and frontend packages.

## TypeScript

- Keep strict type checking enabled and fix the underlying type rather than weakening a boundary with `any`, unchecked casts, or non-null assertions.
- Give public functions, route handlers, hooks, context values, and exported data shapes explicit types when inference would hide the contract.
- Narrow unknown input at the boundary. Validate request payloads, provider results, persisted records, and external responses before using them.
- Prefer discriminated unions for lifecycle and result states when a value can be loading, ready, partial, stale, unauthorized, failed, or otherwise distinct.
- Keep dates, identifiers, status values, scopes, and permission decisions semantically typed and normalized at the boundary.
- Do not hand-edit generated API clients, generated Zod schemas, or generated type files. Change the source contract and run the repository’s code-generation command.

## React and frontend code

- Keep provider composition, route ownership, Role/layout behavior, and data-source boundaries explicit as described in [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md).
- Pages compose workflows; shared components own reusable presentation and interaction; hooks own reusable data or behavior. Do not move page-specific business rules into a global provider.
- Reuse approved primitives and patterns from [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) and [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md) before creating a new primitive.
- Make Organization or Workspace scope part of query identity and mutation behavior. Never broaden a query because scope is missing or unavailable.
- Model loading, empty, stale, unauthorized, validation, conflict, timeout, offline, and service-failure states where they can occur. Do not use a blank screen or fabricated record as a silent fallback.
- Keep controls keyboard-operable, semantically named, focus-safe, responsive, and understandable without color, hover, motion, or pointer-only interaction. Use [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) for the binding requirements.
- Keep analytics separate from product state and audit records. Do not send secrets, credentials, protected record contents, raw prompts, or unnecessary personal data to analytics.

## API, service, and persistence code

- Register routes explicitly. A contract or generated operation is not evidence that a handler is mounted or production-ready.
- Validate requests and responses at service boundaries using the approved schema path. Map failures to distinguishable, safe errors without exposing protected-record existence.
- Enforce Authentication, Role, Permission, Organization, and Workspace constraints at the receiving data boundary, not only in navigation or client filters.
- Use the service logging conventions and structured request context. Do not use `console.log` in server code, put secrets in logs, or log raw sensitive payloads.
- Make consequential writes idempotent or recoverable, preserve uniqueness and integrity constraints, and record audit context where the owning handbook requires it.
- Treat migrations, backfills, rules, provider configuration, and source-of-truth changes as compatibility work. Include reconciliation and rollback or compensating behavior before release.

## Errors and recovery

Use the categories and recovery behavior owned by [ERROR_HANDLING.md](./ERROR_HANDLING.md), [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), and [ERROR_MONITORING.md](./ERROR_MONITORING.md).

- Fail explicitly when required configuration, identity, scope, dependencies, or contracts are absent.
- Preserve safe user input through validation, navigation, timeout, offline, and service failure.
- Distinguish user-correctable validation from authorization, not found, conflict, rate-limit, dependency, timeout, and service failures.
- Never silently fall back from an unavailable source to stale, unrelated, cached, or fabricated data.
- Make retry, cancel, duplicate submission, partial completion, and unknown-outcome behavior deliberate.

## Documentation and comments

- Add or update documentation when a change alters an ownership boundary, source of truth, public contract, migration, release procedure, or durable decision.
- Link to the canonical owner instead of copying a binding rule into a lower-level file.
- Use the metadata shape established by existing handbooks: title, purpose, scope, audience, related documents, review frequency, owner, version, status, last updated, normative level, and canonical terms.
- Comments should explain why a non-obvious decision exists, not restate what the code already says. Marking unfinished work with a placeholder is not a substitute for an issue, decision, or explicit current-state gap.
- For governed documentation, update [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) in the same change.

## Validation before review

Run the checks applicable to the changed boundary. The standard workspace checks are:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
```

For focused work, also run the affected package’s typecheck or build command and the relevant test, contract, accessibility, security, performance, resilience, or documentation checks. Use [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) to select evidence and [QUALITY_GATES.md](./QUALITY_GATES.md) for the release decision.

Before opening review, confirm:

- [ ] The changed path and source of truth are documented.
- [ ] The implementation reuses existing boundaries and does not introduce a duplicate rule or provider.
- [ ] Scope, permissions, privacy, audit, errors, recovery, and accessibility implications are addressed.
- [ ] Generated artifacts were regenerated rather than hand-edited when a source contract changed.
- [ ] Relevant validation evidence is recorded with environment, revision, result, and known gaps.

## References

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)