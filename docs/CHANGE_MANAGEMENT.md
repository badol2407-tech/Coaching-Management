---
title: EduTrack Change Management
purpose: Provide a practical way to classify, coordinate, validate, communicate, and close changes while preserving existing governance authority.
scope: Change intake, impact, ownership, decision records, implementation, evidence, release, communication, recovery, and closeout.
audience: Product, Design, Engineering, Security, Privacy, QA, Reliability, Operations, Support, and approvers.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ARCHITECTURE_DECISIONS.md
  - ./ADR_TEMPLATE.md
  - ./ISSUE_TEMPLATE.md
  - ./CODE_OWNERSHIP.md
  - ./PR_TEMPLATE.md
  - ./TESTING_STRATEGY.md
  - ./QUALITY_GATES.md
  - ./RELEASE_MANAGEMENT.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./INCIDENT_RESPONSE.md
  - ./CHANGELOG.md
  - ./DECISION_LOG.md
review_frequency: Quarterly and after a product, architecture, source-of-truth, release, incident, or governance change
owner: Product Governance, Product, Engineering, QA, Reliability, Operations, Security, Privacy, and Support
version: 1.0.0
status: Active change-coordination guidance
last_updated: 2026-08-02
normative_level: Coordination guidance subordinate to product governance, architecture decisions, quality gates, and release management
canonical_terms: change, impact, owner, source of truth, decision, evidence, release, exception, recovery
---

# EduTrack Change Management

## Purpose and authority

Use this guide to coordinate a change from a clear problem through validated implementation and closeout. [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) owns authority, precedence, exceptions, and change control; [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) owns decision preparation; [QUALITY_GATES.md](./QUALITY_GATES.md) owns release decisions; [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) owns promotion and recovery handoff.

This guide does not create a parallel approval process, priority model, severity scale, release threshold, incident policy, or source-of-truth rule.

## Change record

| Field | Record |
| --- | --- |
| Problem, requested outcome, and affected Users |  |
| Changed boundary, source of truth, and owner |  |
| Roles, Permissions, Organizations, Workspaces, and data impact |  |
| Security, privacy, accessibility, performance, and recovery impact |  |
| Decision, approver, exception, mitigation, and expiry |  |
| Evidence, release identity, communication, and follow-up |  |

## Change flow

### 1. Intake and classify

- [ ] Capture the problem, desired outcome, affected users, current behavior, evidence, and limitations.
- [ ] Classify the change as product, design, implementation, contract, data or rules, provider or configuration, documentation, maintenance, release, or incident follow-up.
- [ ] Identify whether the change affects a shared foundation, canonical term, source of truth, Organization boundary, Permission, generated artifact, or recovery path.
- [ ] Use [ISSUE_TEMPLATE.md](./ISSUE_TEMPLATE.md) and route the work with [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

### 2. Assess impact and authority

- [ ] Identify the canonical owner and supporting documents in [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).
- [ ] Record affected Roles, Organizations, Workspaces, objects, data, integrations, dependencies, and user-facing consequences.
- [ ] Determine whether an architecture decision, migration, security review, accessibility evidence, or incident follow-up is required.
- [ ] Do not treat a new document, package, contract, or configuration file as proof of implemented behavior.

### 3. Decide and plan

- [ ] Record alternatives, constraints, tradeoffs, decision authority, migration sequence, and recovery path.
- [ ] Use [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) when a source-of-truth, ownership, architecture, provider, or boundary decision changes.
- [ ] Define implementation scope, test evidence, review partners, release unit, communication, and follow-up owner.
- [ ] Record exceptions with reason, affected users, safer alternative, mitigation, approver, and expiry under governance.

### 4. Implement and review

- [ ] Keep the source of truth and owning boundary explicit.
- [ ] Preserve authentication, authorization, Organization scope, data integrity, privacy, accessibility, and recovery behavior.
- [ ] Update dependent documentation metadata and maps when a governed dependency changes.
- [ ] Use [PR_TEMPLATE.md](./PR_TEMPLATE.md), [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), and the applicable review and QA evidence.

### 5. Release and communicate

- [ ] Confirm applicable gates and evidence under [QUALITY_GATES.md](./QUALITY_GATES.md).
- [ ] Use [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for promotion, verification, and recovery.
- [ ] Communicate confirmed impact, changed behavior, effective time, safe user action, limitations, and support route.
- [ ] Escalate unexpected impact or unsafe outcomes through [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md).

### 6. Close and learn

- [ ] Record result, source revision, artifact, evidence, known limitations, incident or rollback, and follow-up.
- [ ] Update [CHANGELOG.md](./CHANGELOG.md) for dated evolution and [DECISION_LOG.md](./DECISION_LOG.md) for durable decisions.
- [ ] Confirm owners accepted follow-up work and that no unresolved source-of-truth or documentation conflict remains.

## Change evidence

A change record should make it possible for a reviewer or responder to reconstruct what changed, why it changed, who owns it, which evidence supports it, what remains uncertain, and how to recover. Do not report unsupported coverage or readiness claims.

## References

- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
- [ADR_TEMPLATE.md](./ADR_TEMPLATE.md)
- [ISSUE_TEMPLATE.md](./ISSUE_TEMPLATE.md)
- [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md)
- [PR_TEMPLATE.md](./PR_TEMPLATE.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [DECISION_LOG.md](./DECISION_LOG.md)
