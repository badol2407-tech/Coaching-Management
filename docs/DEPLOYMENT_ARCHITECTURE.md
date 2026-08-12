---
title: EduTrack Deployment Architecture
purpose: Define environments, deployment units, promotion, configuration, migration sequencing, verification, and rollback for EduTrack.
scope: Web, API, Firebase, Storage, provider, database, rules, configuration, releases, environments, health, rollback, and operational evidence.
audience: Engineering, Frontend, Backend, Security, Privacy, Reliability, Operations, QA, Product Governance, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./CI_CD_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./MONITORING_AND_LOGGING.md
  - ./OBSERVABILITY.md
  - ./ERROR_MONITORING.md
  - ./DISASTER_RECOVERY.md
review_frequency: Quarterly and after an environment, provider, deployment, source-of-truth, rules, schema, or incident change
owner: Engineering, Reliability, Operations, Security, Privacy, QA, and Product Governance
version: 1.0.0
status: Active deployment architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding engineering, security, privacy, and release standards
canonical_terms: environment, release, artifact, promotion, readiness, deployment, rollback, migration, source of truth
---

# EduTrack Deployment Architecture

## Metadata

This handbook defines where and how EduTrack components are promoted and verified. It does not replace [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) for pipeline sequencing, [QUALITY_GATES.md](./QUALITY_GATES.md) for release decisions, or [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md) for the Backup and Recovery product contract.

## Purpose

Deployment is a controlled source-of-truth transition, not only a successful file upload. A release must identify the artifact, environment, configuration, data path, access boundary, dependencies, health evidence, user impact, and recovery route before it is called complete.

EduTrack currently contains a Firebase-first web path, a Vercel-oriented static web configuration, and a separate Express/OpenAPI/Drizzle/PostgreSQL architecture. Deployment evidence must name which path is being released and must not imply that the API or PostgreSQL path serves the web product when repository evidence does not show that.

## Current repository state

- `vercel.json` defines the web build command and `artifacts/web/dist/public` as the output directory.
- The active web path uses Firebase Auth and Firestore; Firebase rules and provider configuration require separate deployment and verification evidence.
- The repository contains a separate API service and database package, but [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) records that the API currently exposes health while the wider contract and PostgreSQL schema are not the active web source of truth.
- Deployment automation, environment approvals, staging configuration, production monitoring, and rollback evidence are not claimed unless the deployment record shows them.

## Deployment units

| Unit | Current or target boundary | Required evidence |
| --- | --- | --- |
| Web application | React/Vite static artifact served through the configured web host | Build identity, asset and route verification, runtime configuration, authentication, scope, accessibility, and smoke evidence |
| API service | Separate Express service; current implemented route is health | Service artifact, route compatibility, authentication and authorization, dependency readiness, logs, error handling, and rollback |
| Firebase Auth and Firestore | Active identity and domain-data provider | Project/environment, rules or provider configuration, direct-access tests, migration or index evidence, and recovery |
| Firebase Realtime Database | Closed boundary under checked-in rules | No deployment or feature use without approved purpose, rules, tests, and recovery |
| Firebase Storage and Cloudinary | Media boundaries with distinct ownership | File validation, access, replacement, deletion, cleanup, provider configuration, and failure evidence |
| PostgreSQL and schema | Separate target backend path | Migration, tenancy, integrity, backfill, reconciliation, performance, backup, and rollback evidence |
| Documentation | Governed handbooks and maps | Links, ownership, metadata, duplicate, orphan, and placeholder validation |

## Environments

### Local development

Local development is for isolated implementation and contract feedback. It may use emulators, provider sandboxes, synthetic data, and local configuration. Local success is not production readiness.

### Preview or non-production

Preview validates the exact release candidate against a controlled environment. It must identify data source, Rules, provider mode, configuration, authentication, test accounts, dataset, and limitations. Preview data and credentials remain isolated from production.

### Production

Production promotion uses an approved immutable artifact or an explicitly recorded infrastructure change. The release record identifies environment, source revision, artifact identity, configuration reference, affected source path, migration or rules action, approver, monitoring owner, communication, and rollback or compensating plan.

The repository does not currently prove that a dedicated staging environment exists. Adding one is an operational decision; this document does not invent a permanent environment or promotion threshold.

## Promotion sequence

1. Confirm change scope, source of truth, compatibility, security, accessibility, data, and recovery impact.
2. Build and inspect the artifact according to [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md).
3. Deploy to preview or the approved non-production boundary.
4. Run smoke, contract, direct-access, accessibility, error, performance, and recovery checks applicable to the change.
5. Confirm configuration and secrets are environment-specific and not included in client or public artifacts.
6. Prepare database migration, Firebase rules, Storage rules, or provider changes in a compatibility-preserving order.
7. Obtain the release decision under [QUALITY_GATES.md](./QUALITY_GATES.md).
8. Promote the same artifact or record an intentional infrastructure difference.
9. Verify health, readiness, authentication, scope, key journeys, errors, latency, freshness, audit, and alert attribution.
10. Record the release result, known limitations, rollback decision, and follow-up evidence.

## Configuration and secrets

- Public web configuration is limited to approved client-safe values and is reviewed for environment and abuse scope.
- Server credentials, database URLs, provider tokens, signing material, session secrets, deployment credentials, and recovery factors use approved secret management.
- Production secrets are never available to untrusted preview or pull-request code.
- Runtime configuration fails explicitly when a required value is absent or incompatible; it does not silently fall back to another environment or data source.
- Configuration changes identify owner, affected unit, effective time, validation, rollback, and incident path.

## Data, rules, and schema changes

Deployment order preserves the compatibility of old and new readers, writers, rules, and data:

1. document source and target, identifier mapping, Organization or Workspace scope, and affected consumers;
2. add compatible schema, index, rules, or provider capability;
3. deploy code that can read both states when a transition requires it;
4. backfill or migrate with idempotency, progress, audit, and reconciliation;
5. switch source or consumer ownership only after validation;
6. remove obsolete paths only after evidence, communication, retention, and recovery review.

Never treat Realtime Database as an implicit Firebase fallback, PostgreSQL as an implicit Firestore fallback, or cache as a source of truth. Follow [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md), [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md), and [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md).

## Health and readiness

Health is layered:

- **Process availability:** the service or static host responds.
- **Dependency readiness:** required identity, database, provider, rules, or configuration dependencies are available for the deployed unit.
- **Route readiness:** intended routes or assets are mounted and compatible.
- **Journey readiness:** representative authorized Users can complete useful work.
- **Operational readiness:** logs, metrics, traces, error monitoring, audit, alerts, runbooks, and recovery ownership are active.

A health endpoint that only proves process availability must not claim domain or dependency readiness.

## Rollback and release failure

- Static web releases should remain selectable as immutable artifacts where the host supports it.
- API releases roll back to a compatible artifact only after confirming database, rules, and provider compatibility.
- Database and data changes use a reversible migration or compensating action; destructive changes are not assumed to be safely undone by redeploying code.
- Firebase and Storage rules roll back only with direct-access evidence and an incident-aware review of the exposure window.
- Provider configuration changes pause or disconnect according to the Integration contract and preserve audit and cleanup status.
- If the result is unknown, stop further mutation, preserve evidence, reconcile the source of truth, and communicate the next safe action.

## Deployment record

Every production release records:

| Field | Required meaning |
| --- | --- |
| Release identity | Source revision, artifact identity, and deployment time |
| Scope | Environment, service/unit, Organization impact, data path, and affected modules |
| Change | Code, contract, generated artifact, rules, schema, provider, configuration, or documentation |
| Readiness | Checks, dependencies, health, journey, accessibility, security, and monitoring evidence |
| Approval | Decision, approver, exception if any, and effective time |
| Recovery | Rollback or compensating action, owner, backup/recovery dependency, and communication path |
| Result | Promoted, blocked, partial, failed, rolled back, or unknown with follow-up owner |

## Review checklist

- [ ] Deployment unit, source of truth, environment, artifact, configuration, dependencies, and affected scope are named.
- [ ] Preview and production evidence are separate.
- [ ] Authentication, authorization, Organization isolation, data integrity, accessibility, performance, and error paths are verified.
- [ ] Firebase, API, database, Storage, Cloudinary, provider, and documentation changes have their own deployment evidence.
- [ ] Migrations and rules changes preserve compatibility and have reconciliation and recovery.
- [ ] Health distinguishes process, dependency, route, journey, and operational readiness.
- [ ] Monitoring, error monitoring, audit, communication, and rollback owners are assigned.

## Validation checklist

- [ ] Release identity and artifact can be reproduced or retrieved.
- [ ] Runtime configuration and secrets are environment-correct and absent from public artifacts.
- [ ] Direct-access and negative-path tests cover the receiving boundary.
- [ ] Smoke checks cover authentication, scope, representative useful work, errors, and recovery.
- [ ] Post-deployment signals are attributable to the release.
- [ ] Failed, partial, unknown, and rolled-back outcomes remain visible and auditable.
- [ ] Disaster recovery impact is reviewed under [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md).

## References

- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)
- [OBSERVABILITY.md](./OBSERVABILITY.md)
- [ERROR_MONITORING.md](./ERROR_MONITORING.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)