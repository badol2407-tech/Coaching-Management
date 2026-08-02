---
title: EduTrack Architecture Decisions
purpose: Provide a lightweight method for identifying, proposing, reviewing, and applying architecture decisions while keeping durable records in the existing decision log.
scope: Decision triggers, alternatives, source-of-truth boundaries, compatibility, migration, evidence, approval, and recovery.
audience: Product, Design, Engineering, Security, Privacy, Reliability, Operations, QA, and contributors.
related_documents:
  - ./DECISION_LOG.md
  - ./PRODUCT_GOVERNANCE.md
  - ./FOLDER_STRUCTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./DISASTER_RECOVERY.md
  - ./IMPLEMENTATION_CHECKLIST.md
review_frequency: Quarterly and when an architecture, source-of-truth, provider, data, contract, or recovery decision is superseded
owner: Product Governance, Engineering, and Architecture owners
version: 1.0.0
status: Active implementation-support handbook
last_updated: 2026-08-02
normative_level: Decision workflow subordinate to Product Governance and the canonical architecture handbooks
canonical_terms: decision, source of truth, boundary, Organization, Workspace, Role, Permission, migration, compatibility, recovery
---

# EduTrack Architecture Decisions

## Purpose and authority

This handbook explains when and how to make an architecture decision. [DECISION_LOG.md](./DECISION_LOG.md) remains the durable record of approved documentation architecture and governance decisions. The owning architecture handbook remains the source of truth for the technical boundary. This document does not approve a provider, replace an architecture handbook, or create an implementation requirement on its own.

## When a decision is needed

Start a decision record when work changes or creates:

- a source of truth, data provider, cache authority, or reconciliation path;
- a package, artifact, runtime, import direction, or deployment unit boundary;
- Authentication, Role, Permission, Organization, Workspace, privacy, audit, or retention behavior;
- an API contract, generated-code flow, route ownership, or consumer adoption path;
- a database, Firebase rule, Storage, Cloudinary, migration, or provider boundary;
- a shared component, token system, design-system layer, or deprecation path;
- a release, environment, monitoring, rollback, or disaster-recovery assumption;
- a current-versus-target architecture distinction that contributors could otherwise misread.

Small implementation choices that remain inside an existing owner do not require a new architecture decision. Record durable choices, not an activity log.

## Decision workflow

### Frame the problem

Describe the user or system outcome, the current behavior, the constraint, the affected Roles and scope, and the consequence of making no change. Name the canonical vocabulary from [GLOSSARY.md](./GLOSSARY.md).

### Map the boundary

Identify the current source of truth, readers, writers, package or service owner, permissions, dependencies, generated artifacts, data movement, and release unit. Distinguish evidence of current behavior from target intent.

### Compare alternatives

For each credible option, compare:

| Consideration | Evidence to inspect |
| --- | --- |
| Correctness | Contract, state, integrity, and compatibility behavior |
| Safety and privacy | Authorization, data minimization, protected boundaries, and audit |
| Accessibility and usability | User control, states, responsive behavior, and assistive access |
| Operations | Observability, dependency readiness, support, and failure response |
| Delivery | Migration order, environments, rollout, rollback, and recovery |
| Maintenance | Ownership, package direction, contributor load, and deprecation |

Prefer the smallest boundary change that preserves the active source of truth, keeps recovery possible, and reuses existing platform capability.

### Decide and record

An approved decision should identify:

- the chosen option and the problem it solves;
- rejected alternatives and the reason they are not selected;
- current and target boundaries;
- affected documents, packages, consumers, data, Roles, scope, and Permissions;
- compatibility, migration, rollout, and recovery behavior;
- required validation evidence and decision owner;
- the condition that would cause the decision to be revisited.

Record durable decisions in [DECISION_LOG.md](./DECISION_LOG.md) or in the owning architecture handbook according to [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md). Do not store a new decision only in a pull request description.

### Apply and review

Update the owning source, dependent documentation, generated artifacts, migrations, or release record in the sequence required by the decision. Re-run the applicable checks after the effective source revision changes. Mark the decision superseded rather than silently rewriting its history when a later decision changes it.

## Current boundaries to preserve

- `artifacts/web` is the active React/Vite/Firebase web product boundary.
- `artifacts/api-server` and the `lib/api-*` and `lib/db` packages form a separate Express/OpenAPI/Drizzle/PostgreSQL path whose broader contract is not proof of web adoption.
- `artifacts/mockup-sandbox` is an isolated preview boundary, not the production web source.
- `lib/api-spec/openapi.yaml` owns authored API contracts; generated clients and schemas are derived.
- Documentation ownership is governed by [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).

These observations are current-state guidance, not permission to change a boundary without a recorded decision.

## Decision review checklist

- [ ] The trigger, user or system outcome, current state, and affected scope are explicit.
- [ ] The canonical source of truth and owning architecture handbook are named.
- [ ] Alternatives, compatibility, security, privacy, accessibility, operations, delivery, maintenance, and recovery were considered.
- [ ] The selected option and rejected options are understandable.
- [ ] Dependent documents, code, generated artifacts, migrations, providers, and release records are identified.
- [ ] Approval, owner, validation evidence, revisit trigger, and supersession behavior are recorded.

## References

- [DECISION_LOG.md](./DECISION_LOG.md)
- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)
