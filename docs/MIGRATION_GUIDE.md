---
title: EduTrack Migration Guide
purpose: Provide a safe, evidence-oriented workflow for data, source-of-truth, provider, schema, rules, and documentation migrations.
scope: Migration intake, source and target boundaries, compatibility, scope, backfill, reconciliation, cutover, rollback, validation, and retirement.
audience: Backend, Data, Engineering, Security, Privacy, Reliability, Operations, QA, Product, and migration approvers.
related_documents:
  - ./DATABASE_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./DEPLOYMENT_CHECKLIST.md
  - ./DISASTER_RECOVERY.md
  - ./QUALITY_GATES.md
  - ./CHANGE_MANAGEMENT.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Import_Export.md
  - ./modules/Audit_Logs.md
review_frequency: Quarterly and after a schema, source-of-truth, tenancy, provider, rules, recovery, or integrity change
owner: Backend Engineering, Data, Security, Privacy, Reliability, QA, Operations, Product, and Governance
version: 1.0.0
status: Active migration guidance
last_updated: 2026-08-02
normative_level: Migration guidance subordinate to database, Firebase, security, deployment, recovery, and quality standards
canonical_terms: source of truth, source, target, migration, backfill, reconciliation, cutover, rollback, compensating action, scope
---

# EduTrack Migration Guide

## Purpose and authority

Use this guide to coordinate a migration without turning a target path into an assumed current capability. [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) owns persistence and source-of-truth boundaries; [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) owns Firebase behavior; [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns movement between boundaries; [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) owns recovery architecture.

This guide does not select a source of truth, define a retention policy, invent a backup guarantee, approve a cutover, or create a second data-integrity standard.

## Migration record

| Field | Record |
| --- | --- |
| Migration goal, owner, and decision authority |  |
| Source and target systems, versions, and environments |  |
| Affected objects, Roles, Organizations, Workspaces, and consumers |  |
| Mapping, compatibility, privacy, security, and integrity risks |  |
| Backfill, dual-read or dual-write, reconciliation, and cutover plan |  |
| Validation, rollback or compensating action, and recovery dependency |  |
| Decision, result, limitation, and follow-up |  |

## 1. Establish the boundary

- [ ] Name the current source of truth and target state separately.
- [ ] Identify consumers, writers, readers, caches, exports, providers, generated clients, rules, jobs, and audit paths.
- [ ] Confirm whether the Firebase-first web path or the separate Express/OpenAPI/Drizzle/PostgreSQL path is affected.
- [ ] Define Organization, Workspace, Role, Permission, object, and dataset scope.
- [ ] Record the architecture decision and governance authority before implementation.

## 2. Design compatibility

- [ ] Define identifiers, field mappings, timestamps, status meanings, relationships, defaults, nullability, and rejected records.
- [ ] Preserve old and new readers or writers during any transition that requires coexistence.
- [ ] Define idempotency, retry, duplicate prevention, ordering, conflict, partial completion, stale state, and unknown outcome behavior.
- [ ] Define access, privacy, audit, export, cache, notification, integration, and recovery consequences.
- [ ] Define how the target is validated before it becomes authoritative.

## 3. Prepare and execute

- [ ] Use synthetic or approved data and isolate environments and credentials.
- [ ] Add compatible schema, index, rule, provider, or capability before switching consumers where required.
- [ ] Make backfill resumable, scoped, observable, auditable, and safe to repeat.
- [ ] Preserve source records and evidence until reconciliation and recovery review are complete.
- [ ] Stop when results are unknown; do not silently retry or switch to an implicit fallback source.

## 4. Reconcile and cut over

- [ ] Compare source and target counts, identifiers, relationships, permissions, scope, timestamps, statuses, and important aggregates.
- [ ] Classify missing, duplicate, conflicting, partial, stale, rejected, and unknown records.
- [ ] Resolve or assign every discrepancy before source ownership changes.
- [ ] Record the cutover decision, effective time, approver, affected scope, communication, and recovery path.
- [ ] Keep the old path read-only, retained, or retired only under an approved decision.

## 5. Validate and retire

- [ ] Test direct access, authorization, Organization isolation, useful journeys, exports, integrations, audit, monitoring, performance, accessibility, and recovery as applicable.
- [ ] Verify source ownership, cache invalidation, delayed jobs, notifications, provider cleanup, and support visibility.
- [ ] Confirm rollback or compensating action is compatible with newer valid work.
- [ ] Remove obsolete readers, writers, rules, schemas, credentials, documentation, and access only after consumer and recovery review.
- [ ] Record the final result, limitations, evidence, owner, and follow-up.

## References

- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [CHANGE_MANAGEMENT.md](./CHANGE_MANAGEMENT.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)
- [modules/Import_Export.md](./modules/Import_Export.md)
- [modules/Audit_Logs.md](./modules/Audit_Logs.md)
