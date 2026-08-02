---
title: EduTrack QA Checklist
purpose: Provide a practical QA execution and handoff checklist that connects selected tests to scoped evidence without replacing the testing strategy or release gates.
scope: QA intake, risk and scope, environments, test data, scenario selection, execution evidence, defects, retest, and release handoff.
audience: QA, Engineering, Product, Design, Accessibility, Security, Privacy, Reliability, Operations, and reviewers.
related_documents:
  - ./TESTING_STRATEGY.md
  - ./TEST_CASE_TEMPLATE.md
  - ./QUALITY_GATES.md
  - ./REVIEW_CHECKLISTS.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./IMPLEMENTATION_CHECKLIST.md
  - ./ACCESSIBILITY_TESTING.md
  - ./SECURITY_ARCHITECTURE.md
  - ./PERFORMANCE_ARCHITECTURE.md
review_frequency: Quarterly and after a QA, test-evidence, or release-process change
owner: QA and Reliability with Engineering and Product Governance
version: 1.0.0
status: Active checklist
last_updated: 2026-08-02
normative_level: QA execution guidance subordinate to Testing Strategy, Quality Gates, Accessibility, Security, Performance, and Release Management
canonical_terms: test evidence, fixture, scope, Role, Permission, Organization, Workspace, regression, recovery, Pass, Block, Exception
---

# EduTrack QA Checklist

## Use and authority

Use this checklist to plan and record QA execution for a change. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) owns test-layer selection and evidence shape; [QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision; [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md), [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md), and [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md) own their specialized evidence. This checklist does not create a separate coverage threshold.

## 1. Intake and scope

- [ ] The change, user outcome, source revision, and exact paths are identified.
- [ ] The owning package, source of truth, affected Roles, Organization or Workspace scope, objects, Permissions, and consumers are recorded.
- [ ] Current behavior is separated from target intent.
- [ ] Consequential actions, protected data, integrations, migrations, generated artifacts, and recovery impact are noted.
- [ ] The applicable test layers and not-applicable layers have reasons.

## 2. Environment and test data

- [ ] Environment is named: local, preview, production, emulator, provider sandbox, or another boundary.
- [ ] Browser, device, viewport, locale, reduced-motion, network, time, cache, and dependency state are recorded where relevant.
- [ ] Fixtures are synthetic or explicitly approved.
- [ ] Fixtures include relevant Role, Permission, Organization, Workspace, lifecycle, source, and dataset context.
- [ ] Production records, credentials, provider tokens, and private data are not copied into evidence.
- [ ] Seed, cleanup, isolation, and reset behavior are understood.

## 3. Scenario selection

- [ ] Ready, loading, empty, pending, success, error, unauthorized, stale, duplicate, partial, timeout, offline, and unknown-outcome states were considered where applicable.
- [ ] Direct receiving-boundary authorization is tested for allowed, denied, wrong-scope, revoked, and direct-access paths where applicable.
- [ ] Consequential writes cover integrity, retry, duplicate, concurrency, audit, and recovery behavior where applicable.
- [ ] User-surface checks cover keyboard, assistive technology, zoom, reflow, mobile, localization, and reduced motion where applicable.
- [ ] Performance, security, privacy, migration, resilience, and recovery checks are selected where the change affects those boundaries.
- [ ] Representative dense, empty, long-name, localized, and constrained-network data is included where behavior depends on it.

Use [TEST_CASE_TEMPLATE.md](./TEST_CASE_TEMPLATE.md) for each scenario that needs a repeatable execution record.

## 4. Execution evidence

- [ ] Each test records the source revision, environment, scope, method, result, and limitations.
- [ ] Screenshots, logs, traces, videos, reports, or command output are redacted and linked from an approved location.
- [ ] Failures distinguish validation, authorization, data, network, service, provider, performance, and environment causes where possible.
- [ ] A passing shallow check is not presented as evidence for a deeper boundary.
- [ ] Firebase, API, database, provider, generated-contract, local, preview, and production evidence are not conflated.
- [ ] Documentation changes include link, metadata, ownership, duplicate, orphan, and placeholder evidence.

## 5. Defects and retest

- [ ] Each unresolved defect has an owner, consequence, mitigation, and retest condition.
- [ ] A blocked scenario is distinguished from a failed scenario and an environment issue.
- [ ] Reproduction steps and actual versus expected behavior are recorded.
- [ ] Retest uses the relevant source revision and environment.
- [ ] Regression scope is selected from the affected boundary and representative journeys.
- [ ] Recovery, rollback, compensation, or safe stop is verified where applicable.

## 6. Handoff and release

- [ ] The exact test inventory and selected layers are linked.
- [ ] Not-applicable items have a reason.
- [ ] Known gaps and limitations are visible to the reviewer and approver.
- [ ] Review evidence is handed to [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md).
- [ ] The release decision follows [QUALITY_GATES.md](./QUALITY_GATES.md).
- [ ] Preview and production evidence remain separate.
- [ ] Post-release health and representative journey evidence are linked when a release occurred.

## QA evidence record

| Field | Record |
| --- | --- |
| Change or test scope |  |
| Source revision |  |
| Environment and dependencies |  |
| Role, Organization, Workspace, dataset, locale, or viewport |  |
| Selected test layers |  |
| Commands, cases, or manual journeys |  |
| Result and limitations |  |
| Defect, owner, and retest condition |  |
| Recovery or release handoff |  |

## References

- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [TEST_CASE_TEMPLATE.md](./TEST_CASE_TEMPLATE.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md)
