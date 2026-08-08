---
title: EduTrack Release Management
purpose: Define the practical release lifecycle for identifying, validating, promoting, observing, and recovering EduTrack changes.
scope: Release types, readiness, evidence, environments, promotion, communication, rollback, incidents, and documentation releases.
audience: Engineering, QA, Security, Privacy, Accessibility, Reliability, Operations, Product Governance, and release approvers.
related_documents:
  - ./CI_CD_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./QUALITY_GATES.md
  - ./TESTING_STRATEGY.md
  - ./MONITORING_AND_LOGGING.md
  - ./OBSERVABILITY.md
  - ./ERROR_MONITORING.md
  - ./DISASTER_RECOVERY.md
  - ./PRODUCT_GOVERNANCE.md
  - ./CHANGELOG.md
  - ./DECISION_LOG.md
review_frequency: Quarterly and after a release, deployment, incident, recovery, source-of-truth, or environment change
owner: Engineering, Reliability, Operations, QA, Security, Privacy, Accessibility, and Product Governance
version: 1.0.0
status: Active release guidance
last_updated: 2026-08-02
normative_level: Release guidance subordinate to binding quality gates, governance, engineering, security, accessibility, and deployment standards
canonical_terms: release, artifact, environment, promotion, readiness, rollback, compensating action, Pass, Block, Exception
---

# EduTrack Release Management

## Purpose and authority

A release is a controlled source-of-truth transition, not merely a successful build or file upload. This guide turns the existing release, CI/CD, deployment, testing, monitoring, and recovery handbooks into a practical sequence.

[QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision, [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) owns pipeline sequencing and artifact promotion, and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) owns environment and deployment-unit boundaries. This guide does not create competing gates or numeric thresholds.

## Current repository boundary

The repository contains distinct releaseable or operational boundaries:

- a Firebase-first React/Vite web path configured for a static web deployment;
- a separate Express service whose currently implemented route is health;
- Firebase Auth, Firestore, Realtime Database rules, Storage rules, and Cloudinary provider boundaries;
- a separately packaged OpenAPI, generated-client, Zod, Drizzle, and PostgreSQL path;
- governed documentation under `docs/`.

These paths are not interchangeable. A release record must name the path being released and must not treat a contract, schema, checked-in rule, or package as proof of deployed behavior.

## Release types

| Release type | Examples | Additional evidence |
| --- | --- | --- |
| Web application | React/Vite pages, components, routes, client data behavior | Artifact identity, routes, auth and scope, accessibility, smoke, errors, monitoring, and recovery |
| API service | Express route, middleware, health or contract implementation | Contract compatibility, route registration, auth, direct access, dependencies, logs, errors, and rollback |
| Data or rules | Firestore, Storage, Realtime Database, PostgreSQL, schema, index, or migration | Source and target, scope, compatibility, direct tests, backfill, reconciliation, backup, and compensating action |
| Provider or configuration | Firebase, Cloudinary, deployment, environment, or integration settings | Owner, environment, secret boundary, validation, effective time, exposure, and recovery |
| Documentation | Governed handbook, index, map, or documentation architecture | Links, metadata, ownership, duplicate rules, orphan documents, placeholders, and source-control identity |

One change may contain more than one release type. Track each boundary separately rather than using the web build as evidence for data, rules, provider, API, or documentation behavior.

## Lifecycle

### 1. Intake and classification

Record the source revision, requested outcome, changed paths, affected Roles, Organization or Workspace scope, data, Permissions, integrations, source of truth, consequences, and recovery owner. Classify the release type and identify generated artifacts, migrations, rules, secrets, and documentation owners.

### 2. Readiness planning

Select the applicable evidence from [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md), and [QUALITY_GATES.md](./QUALITY_GATES.md). Identify the target environment, test data, dependencies, monitoring signals, communication audience, and rollback or compensating action.

### 3. Build and inspect

Use the committed package manager and lockfile. Build the affected boundary, inspect the exact artifact, confirm generated output and configuration, and scan for secrets, private data, unexpected files, and environment leakage. Record the source revision, tool versions, artifact identity, and result.

### 4. Preview or non-production validation

Validate the release candidate in the intended non-production boundary. Keep preview data and credentials isolated from production. Run the applicable smoke, authentication, scope, contract, error, accessibility, performance, audit, monitoring, migration, and recovery checks.

### 5. Release decision

An authorized approver evaluates the evidence under [QUALITY_GATES.md](./QUALITY_GATES.md). The result is **Pass**, **Block**, or an approved **Exception**. An Exception includes the required owner, mitigation, approval, affected users, and expiry; it is not a silent waiver.

### 6. Promotion

Promote the same immutable artifact where possible. Apply database, Firebase, Storage, provider, configuration, or documentation actions in a compatibility-preserving order. Do not expose production secrets to untrusted review or preview code.

### 7. Post-release verification

Verify deployment identity, process and dependency readiness, routes, Authentication, scope, representative useful work, error behavior, latency, freshness, audit, and alert attribution. Keep preview and production evidence separate.

### 8. Closeout

Record the release result, known limitations, incidents, rollback or compensating action, follow-up owner, and links to evidence. Use [CHANGELOG.md](./CHANGELOG.md) for dated documentation evolution and [DECISION_LOG.md](./DECISION_LOG.md) for durable decisions when the release changes documentation authority or architecture.

## Environment and artifact rules

Follow [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for contributor configuration and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for local, preview, and production boundaries.

- Public client configuration is not server credential storage.
- Database URLs, provider tokens, signing material, session secrets, deployment credentials, and recovery factors stay in approved secret management.
- Configuration fails explicitly when a required value is missing or incompatible; it does not silently switch environments or sources.
- Artifact identity includes source revision and the build inputs needed to retrieve or reproduce it.
- A health response that proves process availability does not prove journey or operational readiness.

## Rollback and failed releases

- Stop further mutation when the outcome is unknown; preserve logs, release identity, and reconciliation evidence.
- Roll back a static web or service artifact only after confirming compatibility with database, rules, provider, and configuration state.
- Use a compensating migration or data action when a binary code rollback cannot reverse a data change.
- Review Firebase and Storage rule rollback for the exposure window and direct-access evidence.
- Pause or disconnect provider changes according to the owning integration contract and preserve cleanup and audit status.
- Route operational recovery through [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md); do not treat Git history as a database or provider restore.

## Emergency changes

An emergency change still records the affected boundary, risk, owner, source revision, evidence available before promotion, communication, monitoring, and recovery. Missing evidence is documented as a gap and completed as soon as safely possible under the governance and Exception process.

## Release record

| Field | Required meaning |
| --- | --- |
| Identity | Source revision, artifact identity, release type, and deployment time |
| Scope | Environment, unit, Organization impact, data path, affected modules, and Roles |
| Change | Code, contract, generated artifact, rule, schema, provider, configuration, or documentation |
| Evidence | Checks, tests, readiness, accessibility, security, monitoring, and recovery results |
| Decision | Pass, Block, or Exception with approver, reason, mitigation, and expiry |
| Recovery | Rollback or compensating action, owner, backup dependency, and communication |
| Result | Promoted, blocked, partial, failed, unknown, or rolled back with follow-up owner |

## Release checklist

- [ ] Release type, source of truth, environment, artifact, scope, and owner are named.
- [ ] Applicable test, accessibility, security, privacy, performance, migration, monitoring, and recovery evidence is linked.
- [ ] Preview and production evidence are separate.
- [ ] Secrets and environment configuration are safe and correctly scoped.
- [ ] Generated artifacts, rules, schema, providers, and consumers are compatible.
- [ ] The release decision is Pass, Block, or an approved Exception.
- [ ] Post-release health, errors, latency, freshness, audit, and key journeys are attributed to the release.
- [ ] Failed, partial, unknown, and rolled-back outcomes remain visible and recoverable.

## References

- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)
- [OBSERVABILITY.md](./OBSERVABILITY.md)
- [ERROR_MONITORING.md](./ERROR_MONITORING.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [DECISION_LOG.md](./DECISION_LOG.md)