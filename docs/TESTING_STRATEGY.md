---
title: EduTrack Testing Strategy
purpose: Define the risk-based testing model and evidence expectations for EduTrack product, platform, documentation, and release changes.
scope: Test layers, role and Organization scope, data integrity, contracts, accessibility, security, performance, resilience, recovery, and release evidence.
audience: Engineering, Frontend, Backend, QA, Security, Privacy, Accessibility, Reliability, Product, and reviewers.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./ACCESSIBILITY_TESTING.md
  - ./ERROR_HANDLING.md
  - ./PERFORMANCE_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./CI_CD_ARCHITECTURE.md
review_frequency: Quarterly and after a material test, data-source, contract, security, accessibility, or reliability change
owner: QA, Engineering, Security, Privacy, Accessibility, and Reliability
version: 1.0.0
status: Active testing architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding product, engineering, accessibility, security, and release standards
canonical_terms: test evidence, contract, fixture, scope, Role, Permission, Organization, Workspace, regression, recovery, release
---

# EduTrack Testing Strategy

## Metadata

This handbook defines how EduTrack chooses test layers, representative scenarios, evidence, and release coverage. It does not replace the thresholds or acceptance rules owned by [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md), or [QUALITY_GATES.md](./QUALITY_GATES.md).

## Purpose

Testing protects useful work, privacy, data integrity, accessible operation, and recovery. A test result is evidence for a stated environment, version, dataset, Role, Organization or Workspace scope, and outcome; it is not a general claim that every path is safe.

The strategy covers the active Firebase-first web path, the separately packaged Express/OpenAPI/Drizzle path, delivery automation, and documentation validation. These paths must be tested according to their actual source of truth and must not borrow evidence from one another without an explicit compatibility decision.

## Scope and current state

### Included

- Static, unit, component, contract, integration, end-to-end, accessibility, security, performance, resilience, migration, and recovery testing.
- Firebase Auth, Firestore, Storage, Cloudinary, the web runtime, the separate API service, generated API packages, and PostgreSQL readiness.
- Role, Permission, Organization, Workspace, object, source, cache, export, Notification, audit, and Integration boundaries.
- Documentation links, metadata, source-of-truth ownership, duplicate rules, orphan documents, and unresolved placeholders.

### Current repository observations

- The active web application is React/Vite with Firebase Auth and Firestore as its current identity and domain-data path.
- The separate Express service, OpenAPI contract, generated clients, Zod packages, and Drizzle/PostgreSQL package are not proof that the web product has moved to that path.
- The repository snapshot does not contain a formal test runner configuration or a `.github/workflows/` pipeline. Test automation and CI adoption are therefore target architecture unless later evidence changes that status.
- [QUALITY_GATES.md](./QUALITY_GATES.md) already requires evidence for correctness, authorization, integrity, accessibility, privacy, performance, observability, and recovery. This handbook organizes that evidence; it does not lower or duplicate those gates.

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Test strategy and evidence | QA and Reliability | Maintain the risk model, coverage map, fixtures, evidence, and retest decisions. |
| Product behavior | Product and Engineering | Define intended outcomes, affected Roles, scope, consequences, and recovery. |
| Web and API correctness | Frontend and Backend Engineering | Maintain implementation tests and contract compatibility for the source path being changed. |
| Security and privacy | Security and Privacy | Define abuse cases, sensitive-data boundaries, direct-access tests, and evidence handling. |
| Accessibility | Accessibility and QA | Maintain automated and manual evidence under [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md). |
| Release decision | Product Governance and approvers | Decide Pass, Block, or Exception using [QUALITY_GATES.md](./QUALITY_GATES.md). |

## Testing principles

1. **Test the receiving boundary.** A hidden control, client filter, generated type, or UI-only restriction is not authorization evidence.
2. **Test consequences, not only clicks.** A Fee, Attendance, Exam, Report, Permission, Backup, Integration, or AI action is covered through acceptance, durable outcome, audit, and recovery.
3. **Test the real source of truth.** Firebase evidence applies to the Firebase path; API and PostgreSQL evidence applies only after those components become the active path.
4. **Use representative scope.** Include Roles, Organization and Workspace boundaries, dense and empty datasets, long names, localized values, mobile input, zoom, and constrained networks.
5. **Make failure first-class.** Validation, authorization, not found, conflict, offline, timeout, dependency, partial, duplicate, stale, and unknown-outcome paths are deliberate test cases.
6. **Keep tests deterministic and isolated.** Fixtures identify version, environment, source, scope, and cleanup behavior; tests do not depend on another test's mutable state.
7. **Evidence must be reviewable.** Record the command or method, environment, dataset, Role, scope, result, defect, owner, and retest information required by the quality gate.
8. **Do not use generated or AI-produced output as proof.** It may create a test candidate, but a human-reviewed execution result is the evidence.

## Test layer model

| Layer | Primary question | EduTrack examples | Evidence boundary |
| --- | --- | --- | --- |
| Static and type checks | Does the changed source satisfy language and package contracts? | TypeScript, lint, formatting, generated-artifact drift | Commit, tool version, and result |
| Unit | Does a small deterministic rule behave correctly? | Scope construction, status mapping, error classification, idempotency key handling | Fixture and case result |
| Component and interaction | Does a stateful UI remain operable and understandable? | Loading, empty, Error State, form preservation, keyboard interaction | Role, viewport, assistive-technology method |
| Contract | Do producers and consumers agree? | OpenAPI, generated client, Zod schema, error envelope | Spec revision, generated output, compatibility result |
| Integration | Do boundaries work together? | Auth/profile/scope, Firestore rules, Cloudinary cleanup, API/database validation | Service versions and dependency state |
| End-to-end | Can an authorized User complete a representative journey? | Attendance save, Fee payment, Exam publication, Report export, Permission change | Role, Organization, dataset, and outcome |
| Accessibility | Can Users operate and understand the journey? | Keyboard, screen reader, zoom, reflow, contrast, reduced motion, translated content | Method, browser/device, evidence, defect |
| Security and privacy | Can an actor cross a trust or data boundary? | Direct document access, altered Organization ID, stale session, export, secret/log review | Threat case, boundary, expected denial or redaction |
| Performance | Does useful work remain measurable and recoverable? | Dashboard, Search, mutation acceptance, upload, API, cache, dependency timing | p50/p95 context and representative environment |
| Resilience and recovery | Does failure preserve safety and provide a path back? | Offline, timeout, dependency outage, duplicate retry, restore validation, rollback | Failure injection, recovery result, owner |

Use more than one layer for high-consequence changes. A passing unit test cannot replace direct authorization, accessibility, recovery, or end-to-end evidence where those gates apply.

## Coverage model

Every material change records:

| Dimension | Required question |
| --- | --- |
| User and Role | Which Roles can view, change, approve, or recover this behavior? |
| Scope | Which Organization, Workspace, object, source, dataset, or period limits access? |
| State | Are initial, loading, ready, empty, partial, stale, pending, success, error, unauthorized, and disabled states applicable? |
| Consequence | What is saved, published, exported, notified, billed, synchronized, or otherwise changed? |
| Data integrity | How are duplicates, conflicts, retries, concurrency, partial work, and rollback handled? |
| Privacy and security | What must never appear in UI, URLs, logs, analytics, exports, fixtures, or AI context? |
| Accessibility | What must be operable and announced through keyboard, assistive technology, zoom, reflow, mobile, and reduced motion? |
| Operations | What signal, audit entry, error, recovery action, and incident owner prove the result? |

High-impact areas require explicit negative-path and recovery evidence:

- Authentication, Profile privacy, Organization membership, Roles and Permissions, and support or impersonation.
- Attendance correction, Fee recording or reversal, Exam publication, Report or data export, and Integrations.
- Backup and Recovery, migrations, source-of-truth changes, and AI-assisted actions.

## Role and scope test matrix

At minimum, direct-boundary tests distinguish:

1. unauthenticated actor;
2. authenticated User without a resolved Profile;
3. authenticated User with the wrong Organization or Workspace;
4. authenticated User with the correct scope but insufficient Permission;
5. authorized User with the correct object and action;
6. authorized User with stale, revoked, or changed access;
7. support or impersonated view where the real actor and effective view must remain distinct.

Do not assert only that a button is absent. Attempt the direct read, write, export, callback, cache lookup, deep link, or job action at the receiving boundary and verify safe denial without protected-record enumeration.

## Test data and environments

- Use synthetic or explicitly approved data. Do not copy production Students, Teachers, Fees, credentials, private Profile fields, raw prompts, or provider tokens into fixtures.
- Fixtures include Organization and Workspace scope, Role, Permission, lifecycle state, timestamps, locale, and source identity where those fields affect behavior.
- Seed data is versioned with the test contract and cleaned or isolated after execution.
- Local, preview, and production evidence are labeled separately. A local emulator or mock is not production-rule evidence.
- Dependency tests declare whether Firebase, Cloudinary, the API service, PostgreSQL, a provider sandbox, or a controlled failure substitute was used.
- Time, network, browser, viewport, reduced-motion, locale, and cache state are explicit when they affect the result.

## Documentation validation

Documentation changes use the same evidence discipline as product changes:

- validate every relative Markdown link from the document that contains it;
- check that each handbook is represented in [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) when it is a governed document;
- detect duplicate canonical homes, conflicting requirements, orphaned files, stale metadata, and unresolved placeholders;
- distinguish an intentional current-state gap from a placeholder or an unverified claim;
- review changed ownership and dependency edges before acceptance.

## Release evidence and CI relationship

The test selection is recorded with the change and executed by the appropriate local or automated workflow. [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) owns pipeline sequencing and artifact promotion; [QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision. A failed or missing required test blocks release unless the governed Exception process is completed.

## Review checklist

- [ ] Affected Roles, Permissions, Organization, Workspace, objects, sources, consequences, and rollback are named.
- [ ] The active source of truth is identified and current evidence is separated from target architecture.
- [ ] Success, state, negative-path, duplicate, conflict, stale, partial, timeout, offline, and unknown-outcome cases are covered where applicable.
- [ ] Direct authorization, privacy, secret, export, cache, callback, and audit boundaries are tested where applicable.
- [ ] Accessibility and performance evidence uses representative data and environments.
- [ ] Test data is synthetic or approved, scoped, isolated, and free of secrets.
- [ ] Results identify environment, version, dataset, Role, scope, method, defect, owner, and retest.
- [ ] The release decision and any Exception follow [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] The affected test layers are selected for product, platform, and documentation changes.
- [ ] Firebase, API, database, provider, and generated-contract evidence is not conflated.
- [ ] Boundary tests cover allowed, denied, stale, revoked, cross-Organization, and direct-access cases.
- [ ] Consequential writes have duplicate, retry, concurrency, audit, and recovery evidence.
- [ ] Accessibility evidence covers keyboard, screen reader, zoom, reflow, mobile, localization, and reduced motion as applicable.
- [ ] Performance evidence identifies p50/p95 context and useful-work outcome as required by [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md).
- [ ] Documentation links, duplicates, orphan docs, metadata, and placeholders validate.
- [ ] Evidence is linked to the release decision rather than reported as an unsupported coverage percentage.

## References

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)
- [ERROR_HANDLING.md](./ERROR_HANDLING.md)
- [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)