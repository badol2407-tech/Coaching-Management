---
title: EduTrack Development Workflow
purpose: Provide a repeatable path from scoped work through implementation, validation, review, release handoff, and recovery.
scope: Intake, ownership, architecture, implementation, generated output, testing, review, documentation, release, and recovery.
audience: Frontend, Backend, Full-stack, QA, Security, Reliability, Product, Design, Operations, and documentation contributors.
related_documents:
  - ./ONBOARDING_GUIDE.md
  - ./CONTRIBUTING.md
  - ./CODE_OWNERSHIP.md
  - ./PROJECT_CONVENTIONS.md
  - ./DEVELOPER_PLAYBOOK.md
  - ./IMPLEMENTATION_CHECKLIST.md
  - ./CHANGE_MANAGEMENT.md
  - ./ARCHITECTURE_DECISIONS.md
  - ./TESTING_STRATEGY.md
  - ./AUTOMATION_GUIDE.md
  - ./PR_TEMPLATE.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./QUALITY_GATES.md
  - ./RELEASE_MANAGEMENT.md
review_frequency: Quarterly and after a repository, architecture, source-of-truth, or release-process change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active development workflow
last_updated: 2026-08-02
normative_level: Workflow guidance subordinate to product governance, engineering, testing, review, and release standards
canonical_terms: scope, owner, source of truth, implementation, evidence, review, release, recovery
---

# EduTrack Development Workflow

## Purpose and authority

Use this workflow to connect existing contributor, implementation, testing, review, and release handbooks. [DEVELOPER_PLAYBOOK.md](./DEVELOPER_PLAYBOOK.md) and [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) remain the detailed implementation authorities; [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) owns test-layer selection; [QUALITY_GATES.md](./QUALITY_GATES.md) owns release decisions.

This workflow does not create a second coding standard, test threshold, review policy, branch rule, deployment process, or recovery guarantee.

## 1. Scope the work

- [ ] Record the requested outcome, current behavior, affected users, and changed paths.
- [ ] Classify the work as code, documentation, configuration, generated output, provider behavior, data, migration, release, maintenance, or incident follow-up.
- [ ] Identify affected Roles, Permissions, Organizations, Workspaces, objects, states, integrations, source of truth, and consequences.
- [ ] Use [ISSUE_TEMPLATE.md](./ISSUE_TEMPLATE.md) for actionable intake and [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md) for routing.

## 2. Orient and decide

- [ ] Read the narrowest architecture, module, component, security, accessibility, data-flow, and governance owners.
- [ ] Check [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) before adding a standard or parallel implementation path.
- [ ] Use [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) and [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) when ownership, source of truth, provider, or boundary decisions change.
- [ ] Record alternatives, constraints, migration sequence, rollback or compensating action, and follow-up ownership.

## 3. Implement the smallest safe change

- [ ] Keep the owning boundary and source of truth explicit.
- [ ] Preserve identity, authorization, Organization or Workspace scope, data integrity, privacy, and audit behavior.
- [ ] Cover applicable success, loading, empty, stale, pending, unauthorized, error, duplicate, partial, and recovery states.
- [ ] Keep generated artifacts synchronized with their source and do not hand-edit generated output unless the owning workflow requires it.
- [ ] Keep secrets, production data, unrelated files, and unsupported target-state claims out of the change.

## 4. Validate the changed boundary

- [ ] Select evidence through [TESTING_STRATEGY.md](./TESTING_STRATEGY.md).
- [ ] Run focused type, build, contract, authorization, data-integrity, accessibility, security, performance, resilience, provider, migration, or documentation checks as applicable.
- [ ] Record environment, source revision, dataset or fixture, Role and scope, method, result, defect, owner, and retest condition.
- [ ] Run [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md) guidance when checks or delivery automation are introduced or changed.

## 5. Prepare review

- [ ] Inspect the exact diff and changed-file inventory.
- [ ] Explain user outcome, source of truth, affected scope, evidence, known limitations, migration or rollout behavior, and recovery.
- [ ] Use [PR_TEMPLATE.md](./PR_TEMPLATE.md) and [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md).
- [ ] Route security, privacy, accessibility, data, provider, operational, and support implications to the relevant owners.
- [ ] Treat not-applicable evidence as a reasoned record, not an empty claim.

## 6. Release or hand off

- [ ] Confirm the applicable [QUALITY_GATES.md](./QUALITY_GATES.md) decision.
- [ ] Use [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md), [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md), and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) when a release occurs.
- [ ] Link monitoring, error, incident, support, migration, recovery, and communication evidence where relevant.
- [ ] Record the result as promoted, blocked, partial, failed, unknown, rolled back, or not released.

## 7. Close the work

- [ ] Record known limitations and follow-up owners in [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) when the limitation is durable or cross-cutting.
- [ ] Update [CHANGELOG.md](./CHANGELOG.md) for dated evolution and [DECISION_LOG.md](./DECISION_LOG.md) for durable decisions.
- [ ] Confirm documentation ownership, index/map updates, and clean scope.
- [ ] Preserve a safe recovery path and communicate any remaining user impact.

## Evidence handoff

The handoff should allow another contributor to reconstruct what changed, why it changed, what was checked, what remains uncertain, who owns the next action, and how to stop or recover safely. Local success is not production evidence.

## References

- [ONBOARDING_GUIDE.md](./ONBOARDING_GUIDE.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md)
- [DEVELOPER_PLAYBOOK.md](./DEVELOPER_PLAYBOOK.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- [CHANGE_MANAGEMENT.md](./CHANGE_MANAGEMENT.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [PR_TEMPLATE.md](./PR_TEMPLATE.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md)
