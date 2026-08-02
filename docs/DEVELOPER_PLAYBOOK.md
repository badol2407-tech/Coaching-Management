---
title: EduTrack Developer Playbook
purpose: Give contributors a practical, evidence-oriented path from an implementation request to a reviewable and recoverable handoff.
scope: Work intake, source-of-truth selection, design and architecture handoff, implementation, validation, review, release, and recovery.
audience: Frontend, Backend, Full-stack, QA, Security, Reliability, Product, Design, and documentation contributors.
related_documents:
  - ./CONTRIBUTING.md
  - ./PROJECT_CONVENTIONS.md
  - ./ENGINEERING_STANDARDS.md
  - ./CODING_STANDARDS.md
  - ./ARCHITECTURE_DECISIONS.md
  - ./IMPLEMENTATION_CHECKLIST.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./QUALITY_GATES.md
  - ./RELEASE_MANAGEMENT.md
review_frequency: Quarterly and after a repository, architecture, source-of-truth, or release-process change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active implementation-support handbook
last_updated: 2026-08-02
normative_level: Practical guidance subordinate to Product Governance, Engineering Standards, Coding Standards, and Quality Gates
canonical_terms: source of truth, Organization, Workspace, Role, Permission, contract, artifact, evidence, recovery
---

# EduTrack Developer Playbook

## How to use this playbook

This is a route through existing standards, not a replacement for them. Use it to decide what to read, what to name, what to validate, and what evidence to hand to review. The canonical owner remains the authority for each concern in [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).

## Before touching a file

1. Read the request as a user outcome, not as a preferred implementation.
2. Confirm whether the work is code, documentation, configuration, generated output, provider behavior, data, or release work.
3. Identify affected Roles, Organization or Workspace scope, objects, Permissions, states, consequences, and recovery.
4. Use [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) and [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md) to locate the owning boundary.
5. Check [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) before adding a rule, provider, component, data path, or terminology set.
6. Preserve unrelated user work and keep the change boundary focused.

## Choose the implementation path

| Request type | First owner to read | Boundary to protect |
| --- | --- | --- |
| Web page or workflow | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Current React/Vite/Firebase web path |
| Shared component or pattern | [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) and [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Reusable states, semantics, accessibility, and responsive behavior |
| API contract or generated client | [API_CONTRACTS.md](./API_CONTRACTS.md) and [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) | OpenAPI source, generation, mounted route, and consumer boundary |
| API route or service | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Authentication, scope, authorization, errors, integrity, and observability |
| Firebase or provider behavior | [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) | Rules, environment, provider ownership, and deployment evidence |
| Database or migration | [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Source of truth, compatibility, reconciliation, and recovery |
| Documentation | [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) | Canonical owner, metadata, links, duplicates, orphans, and placeholders |

## The build loop

### Orient

Read the smallest set of owning documents that answers the request. Confirm current versus target architecture; do not treat package presence, a contract, a rule file, or a mockup as evidence of a live capability.

### Decide

If the work changes an ownership boundary, source of truth, provider, data contract, Permission model, migration, or release behavior, use [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) before implementation.

### Implement

Follow [CODING_STANDARDS.md](./CODING_STANDARDS.md), [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md), and the relevant module or component handbook. Reuse existing providers, hooks, primitives, tokens, generated boundaries, and error categories. Keep page composition, shared presentation, data access, and service behavior in their owning layers.

### Make states explicit

For each user-visible operation, consider the applicable ready, loading, empty, stale, unauthorized, validation, conflict, timeout, offline, service-failure, partial, duplicate, cancel, retry, and unknown-outcome states. Follow the existing owners for state, feedback, error, loading, empty, accessibility, and recovery behavior rather than restating their thresholds.

### Validate

Run the focused package checks and the applicable contract, authorization, data-integrity, accessibility, security, performance, resilience, and documentation checks. Use [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) to record what was run, what was not applicable, and why.

### Review

Prepare evidence in the order defined by [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md): safety and accessibility, authorization and scope, correctness and integrity, recovery, performance and operations, maintainability, then presentation.

### Release

Review completion is not deployment. Follow [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md), [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md), [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md), and [QUALITY_GATES.md](./QUALITY_GATES.md) for promotion, verification, and rollback evidence.

## Evidence handoff

A useful handoff identifies:

- source revision and exact changed paths;
- owning package and source of truth;
- affected Roles, Organization or Workspace scope, data, Permissions, and consumers;
- implementation, migration, provider, generated-artifact, and deployment impact;
- commands or methods run, environment, result, and known limitations;
- unresolved defects with owner and retest condition;
- rollback, compensation, or safe recovery path.

AI-generated code, tests, copy, or documentation can accelerate preparation but is not evidence of a passing gate.

## Safe stop conditions

Stop and preserve evidence when:

- the source of truth is unclear;
- a route, provider, rule, migration, or generated artifact has an unknown state;
- a validation or deployment result is ambiguous;
- a change would discard unrelated user work;
- a new rule would conflict with a canonical owner;
- recovery, authorization, privacy, or accessibility behavior is not yet understood.

Use [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) and [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for recovery boundaries. Do not hide uncertainty behind a successful build or a passing shallow check.

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
