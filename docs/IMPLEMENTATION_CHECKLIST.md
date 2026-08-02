---
title: EduTrack Implementation Checklist
purpose: Provide a reusable evidence checklist for implementation handoffs without replacing domain standards, test selection, review guidance, or release gates.
scope: Scope, ownership, architecture, implementation, states, validation, review, release, and recovery evidence.
audience: Frontend, Backend, Full-stack, QA, Security, Reliability, Product, Design, and documentation contributors.
related_documents:
  - ./DEVELOPER_PLAYBOOK.md
  - ./PROJECT_CONVENTIONS.md
  - ./ARCHITECTURE_DECISIONS.md
  - ./API_CONTRACTS.md
  - ./COMPONENT_STANDARDS.md
  - ./ENGINEERING_STANDARDS.md
  - ./TESTING_STRATEGY.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./QUALITY_GATES.md
  - ./RELEASE_MANAGEMENT.md
review_frequency: Quarterly and after a material implementation, validation, or release-process change
owner: Engineering, QA, Product Governance, and Developer Experience
version: 1.0.0
status: Active implementation-support checklist
last_updated: 2026-08-02
normative_level: Checklist guidance subordinate to canonical architecture, testing, accessibility, security, and release owners
canonical_terms: implementation, source of truth, Role, Permission, Organization, Workspace, evidence, recovery, release
---

# EduTrack Implementation Checklist

## How to use it

Use this checklist to prepare a change for review. Check only what is supported by evidence. A not-applicable item needs a reason, and a missing higher-priority requirement remains a block under [QUALITY_GATES.md](./QUALITY_GATES.md). This checklist does not create new pass thresholds.

## 1. Scope and ownership

- [ ] The user or system outcome is stated.
- [ ] Changed paths and owning package are listed.
- [ ] The source of truth is named for each affected object or workflow.
- [ ] Affected Roles, Permissions, Organization or Workspace scope, data, integrations, and consumers are listed.
- [ ] Current behavior is separated from target intent.
- [ ] Unrelated user work and generated or build output are excluded.
- [ ] [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md) and [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) were checked.

## 2. Architecture and contract

- [ ] The relevant architecture and module handbooks were read.
- [ ] An architecture decision was recorded or the change was confirmed to remain within an existing owner.
- [ ] API work follows [API_CONTRACTS.md](./API_CONTRACTS.md).
- [ ] Shared component work follows [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md).
- [ ] Source-of-truth, package direction, provider, migration, and compatibility impact are explicit.
- [ ] Generated artifacts were regenerated from their source contract when applicable.

## 3. Implementation behavior

- [ ] Existing providers, hooks, primitives, tokens, patterns, and error categories were reused.
- [ ] Success, loading, empty, stale, unauthorized, validation, conflict, timeout, offline, service-failure, duplicate, partial, cancel, retry, and unknown-outcome states were considered where applicable.
- [ ] Safe user input is preserved through recoverable failures.
- [ ] Consequential actions expose consequence, confirmation, audit, and recovery behavior where required.
- [ ] Organization, Workspace, Role, and Permission constraints are enforced at the receiving boundary.
- [ ] Analytics, logs, audit records, secrets, and private data remain in their approved boundaries.

## 4. Quality evidence

- [ ] Focused package typecheck, build, lint, or schema checks were run as applicable.
- [ ] Contract and generated-code checks were run for contract changes.
- [ ] Authorization, direct-access, data-integrity, and migration checks were run for data or permission changes.
- [ ] Accessibility and responsive checks were run for user-surface changes.
- [ ] Security, privacy, performance, resilience, and recovery checks were selected where applicable.
- [ ] Documentation links, metadata, canonical ownership, duplicate rules, orphan documents, and placeholders were checked for documentation changes.
- [ ] Each check records environment, revision, scope, method, result, and known limitations.

## 5. Review handoff

- [ ] The exact diff and changed-file inventory were inspected.
- [ ] The review follows the consequence order in [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md).
- [ ] Known defects have an owner and retest condition.
- [ ] Not-applicable evidence has a reason.
- [ ] Migration, rollout, feature-flag, provider, generated-artifact, and rollback details are included where relevant.
- [ ] The change does not claim a route, rule, monitoring control, branch protection, environment, or deployment that is not evidenced.

## 6. Release closeout

- [ ] The applicable [QUALITY_GATES.md](./QUALITY_GATES.md) decision is Pass, Block, or an approved Exception.
- [ ] The release identity, artifact, environment, approver, monitoring owner, and recovery path are recorded.
- [ ] Preview and production evidence are kept separate.
- [ ] Post-release health and representative journey checks are linked where a release occurred.
- [ ] Documentation ownership and index/map updates are complete for governed documentation.

## Evidence record

Use the following field order in a review or release handoff:

| Field | Record |
| --- | --- |
| Source revision | Commit, artifact, or document revision |
| Environment | Local, preview, production, emulator, or provider boundary |
| Scope | Role, Organization, Workspace, locale, viewport, dataset, or dependency context |
| Method | Command, test, manual journey, audit, link check, or measurement |
| Result | Pass, failure, partial, not applicable with reason, or unknown |
| Defect and owner | Remaining issue, accountable owner, and retest condition |
| Recovery | Rollback, compensation, retry, restore, or safe stop |

## References

- [DEVELOPER_PLAYBOOK.md](./DEVELOPER_PLAYBOOK.md)
- [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
- [API_CONTRACTS.md](./API_CONTRACTS.md)
- [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)
