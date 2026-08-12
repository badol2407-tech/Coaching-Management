---
title: EduTrack Database Architecture
purpose: Define persistence ownership, data-model boundaries, integrity, tenancy readiness, migrations, and recovery obligations for EduTrack.
scope: Firestore collections, Drizzle/PostgreSQL schemas, source-of-truth decisions, Organization scope, identifiers, constraints, transactions, migrations, backups, and data access boundaries.
audience: Engineering, Backend, Data, Security, Privacy, Reliability, QA, Operations, Product, and contributors.
related_documents:
  - ./BACKEND_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./CACHING_STRATEGY.md
  - ./ENGINEERING_STANDARDS.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Import_Export.md
  - ./modules/Audit_Logs.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a schema, persistence, source-of-truth, tenancy, migration, recovery, or integrity change
owner: Backend Engineering, Data, Security, Privacy, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding engineering, security, tenancy, and recovery standards
canonical_terms: source of truth, Organization, Workspace, record, schema, migration, integrity, transaction, audit, recovery
---

# EduTrack Database Architecture

## Metadata

This handbook documents the two persistence paths present in the repository and the conditions that must be satisfied before they are combined or switched. It does not replace the source-module contracts, the multi-tenancy standard, the backup and recovery contract, or the binding integrity requirements in [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md).

## Purpose

Database architecture makes it possible to identify where a record lives, who owns it, how it is scoped, how it changes, and how it can be recovered. EduTrack currently has a Firebase-first web path and a separate Drizzle/PostgreSQL package family:

```text
active web path:
Firebase Auth -> Firestore / Cloudinary references

separate API path:
OpenAPI -> Express -> Drizzle -> PostgreSQL
```

Package presence, a generated client, or a schema definition does not make the separate path the active web source of truth.

## Scope

### Included

- Firestore Organization-scoped collections used by the web application.
- Drizzle/PostgreSQL schema and database runtime under `lib/db`.
- Identifiers, timestamps, statuses, uniqueness, references, and integrity.
- Organization and Workspace readiness for the relational path.
- Source-of-truth, migration, backfill, dual-read, dual-write, reconciliation, and rollback decisions.
- Database access, audit, backup, export, cache, and recovery boundaries.

### Excluded

- User-facing module behavior and field-level product contracts owned by the module handbooks.
- Authentication and Permission policy, which are owned by [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) and [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md).
- Firebase service configuration and rules detail, which is owned by [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md).
- Performance thresholds, which remain with the existing engineering and product standards.

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Firestore source and document paths | Web and Backend Engineering | Maintain the active web source and explicit collection boundaries. |
| Relational schema | Backend Engineering and Data | Author Drizzle schema, references, constraints, and compatibility changes. |
| Source-of-truth decisions | Engineering, Product, Data, Security, and Governance | Select one active authority per object and record migration decisions. |
| Tenancy and access | Security, Privacy, and Backend Engineering | Enforce Organization and Workspace scope at the data boundary. |
| Integrity and migration | Backend, Data, and Reliability | Define constraints, backfills, concurrency, rollback, and verification. |
| Backup and recovery | Reliability, Security, Data, and Operations | Preserve approved data and test restoration without crossing scope. |

## Related documents

- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) owns service and persistence boundary observations.
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) owns Firebase service roles and rules evidence.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns record movement and transformation boundaries.
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md) owns Organization and Workspace isolation behavior.
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md) owns preservation, restore, verification, and recovery behavior.
- [modules/Import_Export.md](./modules/Import_Export.md) owns governed dataset movement.

## Architecture principles

1. **Every object has one named source of truth.** Temporary replication is allowed only with an explicit migration and reconciliation decision.
2. **Scope is part of the data model.** Organization or Workspace isolation must be represented and enforced where records are stored, not inferred from a page or query parameter.
3. **Integrity is explicit.** Required fields, identifiers, references, uniqueness, status transitions, timestamps, and concurrency behavior are documented before implementation.
4. **Schema and contract evolve together.** API schemas, generated types, handlers, database models, migrations, and consumers must be reviewed as one compatibility change.
5. **Reads and writes are authorization-aware.** A database helper does not grant access; it receives a verified scope and enforces it.
6. **Migration is reversible or compensating.** Backfills, partial completion, conflict handling, rollback, and retirement are part of the change.
7. **Recovery does not restore authority by accident.** Credentials, sessions, and Permission state require separate policy and validation.

## Standards

### Current Firestore persistence

The active web hooks read and write Organization paths such as:

```text
organizations/{orgId}/students
organizations/{orgId}/teachers
organizations/{orgId}/attendance
organizations/{orgId}/fees
organizations/{orgId}/exams
organizations/{orgId}/results
organizations/{orgId}/notices
organizations/{orgId}/homework
organizations/{orgId}/routine
organizations/{orgId}/expenses
```

The web layer derives `orgId` from the authenticated application profile and maps Firestore documents into view models at the hook boundary. Some operations use deterministic identifiers or derived values; those choices remain domain-specific and must follow the relevant module contract.

The Firestore data model and its deployed rules are not fully represented in this repository snapshot. A collection path in a React hook is not evidence of a complete schema, index, constraint, or security rule.

### Current Drizzle/PostgreSQL path

`lib/db/src/index.ts` creates a PostgreSQL pool from `DATABASE_URL` and fails explicitly when the required configuration is absent. The current schema includes:

- `students`: serial primary key, unique `student_id`, identity/contact fields, class, batch, status, and timestamps;
- `attendance`: serial primary key, foreign key to `students`, date, status, batch, note, timestamp, and a uniqueness constraint on `(student_id, date)`.

The current relational tables do not include an Organization or tenant column. They are therefore not ready to represent the multi-Organization contract as an API source of truth without an explicit tenancy design, migration, and negative-path evidence.

### Source-of-truth boundary

Until an approved migration record says otherwise:

- Firebase/Firestore remains the active web domain source.
- The OpenAPI/Express/Drizzle/PostgreSQL path remains separate and must not be treated as an implicit fallback.
- Generated API clients do not create or reconcile Firestore records.
- A feature must not silently dual-write or merge records from both paths.

### Integrity and concurrency

For every consequential record:

- define the stable identifier and whether clients may choose it;
- define required, nullable, default, and derived fields;
- define status transitions and who may cause them;
- define timestamps, timezone, and update ordering;
- define uniqueness and relationship constraints;
- define duplicate, retry, conflict, partial, and unknown-outcome behavior;
- define audit and retention implications.

The attendance uniqueness constraint in PostgreSQL is an implementation observation, not a universal rule for every Attendance workflow. Domain module contracts and [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) remain authoritative.

## Implementation guidelines

### Schema changes

Before changing a schema, record affected objects, source of truth, Organization scope, existing data, compatibility window, backfill, validation, rollback or compensating action, cache invalidation, API generation, and operational owner. Do not use a destructive schema push as a substitute for a reviewed migration.

### Relational tenancy readiness

Before the separate API path handles Organization data, define how Organization and Workspace identity is represented, constrained, indexed, and propagated through every relevant table and relationship. Test:

- cross-Organization reads and writes;
- direct object identifiers;
- joins and aggregates;
- exports and reports;
- uniqueness within and across Organizations;
- deletion or archive behavior; and
- support access and audit scope.

### Firestore and relational reconciliation

If an object moves:

1. name the current and target authorities;
2. map identifiers, scope, fields, timestamps, statuses, references, and audit events;
3. choose a controlled backfill or dual-read/dual-write window only when necessary;
4. define conflict precedence and idempotent replay;
5. verify counts, relationships, sensitive fields, and representative module behavior;
6. cut over consumers;
7. retain rollback or compensation and retire the old path only after evidence.

### Access and cache boundaries

Database reads receive verified scope and Permission context. Query caches, exports, snapshots, and backups do not expand the underlying access decision. When a schema or source changes, invalidate affected projections according to [CACHING_STRATEGY.md](./CACHING_STRATEGY.md).

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md), and [ERROR_HANDLING.md](./ERROR_HANDLING.md).

- Validation and conflict responses identify the affected field or record in a stable, localizable way.
- Partial imports, bulk writes, stale reads, and unknown outcomes expose scope and recovery.
- Timestamps, statuses, relationships, and freshness support accessible presentation without color-only meaning.
- Database failures do not cause blank pages, silent data loss, or destructive loss of safe user input.

## AI implementation notes

No AI database path exists. Future AI features must keep generated output separate from durable source records, minimize authorized fields, identify source and freshness, and require an explicit human-controlled write for consequential changes. AI cannot choose a source of truth, approve a migration, or restore data.

## Review checklist

- [ ] Source of truth, storage path, scope, owner, and consumer are named for every affected object.
- [ ] Firestore and PostgreSQL facts are separated from target architecture.
- [ ] Organization and Workspace isolation is represented at the data boundary.
- [ ] Identifiers, references, defaults, statuses, timestamps, uniqueness, and concurrency behavior are explicit.
- [ ] Migration, backfill, reconciliation, rollback, cache, audit, export, backup, and recovery behavior are defined.
- [ ] API contract, generated artifacts, handlers, schema, and consumers agree.
- [ ] Security, privacy, accessibility, performance, and operational evidence is linked through [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Schema and contract checks pass for the affected path.
- [ ] Tests cover required, nullable, malformed, duplicate, conflict, concurrent, partial, and unknown-outcome behavior.
- [ ] Organization and Workspace negative-path tests cover direct IDs, joins, aggregates, exports, and cached results.
- [ ] Migration verification covers counts, relationships, identifiers, timestamps, status, sensitive fields, and rollback or compensation.
- [ ] Backup, restore, deletion, retention, and audit evidence is recorded for the affected data.
- [ ] Representative accessibility, mobile, localization, slow-network, and recovery states are verified.

## References

- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [CACHING_STRATEGY.md](./CACHING_STRATEGY.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)
- [modules/Import_Export.md](./modules/Import_Export.md)
- [modules/Audit_Logs.md](./modules/Audit_Logs.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)