---
title: EduTrack Firebase Architecture
purpose: Define the Firebase services, client boundaries, data paths, rules evidence, and operational conditions for EduTrack.
scope: Firebase App initialization, Auth, Firestore, Realtime Database, Storage rules, configuration, Organization-scoped paths, deployment evidence, and boundaries with Cloudinary and the separate API path.
audience: Engineering, Frontend, Backend, Security, Privacy, Data, Reliability, Operations, QA, and contributors.
related_documents:
  - ./AUTHENTICATION_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./modules/Multi_Tenancy.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Integrations.md
  - ./ENGINEERING_STANDARDS.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a Firebase service, rules, project, data path, provider, or security change
owner: Frontend Engineering, Backend Engineering, Security, Privacy, Data, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding Firebase, security, tenancy, engineering, and recovery standards
canonical_terms: Firebase Auth, Firestore, Realtime Database, Storage, Organization, Workspace, Profile, rule, source of truth, Cloudinary
---

# EduTrack Firebase Architecture

## Metadata

This handbook documents the Firebase services and configuration visible in the repository. It distinguishes client initialization from deployed enforcement and identifies where the repository does not contain sufficient evidence. It does not replace [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md), which owns the authorization decision model, or [SECURITY_UX.md](./SECURITY_UX.md), which owns user-facing security communication.

## Purpose

Firebase is the active web identity and domain-data boundary. The current client uses Firebase Auth and Firestore, while Realtime Database is explicitly closed by checked-in rules. Firebase Storage rules exist for specific photo paths, but the current application image helper uses Cloudinary for uploads. Each service must have one documented purpose and one tested access boundary.

## Scope

### Included

- Firebase application initialization and environment configuration.
- Firebase Auth and Firestore usage by the web application.
- Firestore profile and Organization-scoped domain paths.
- Realtime Database and Storage rule files checked into the repository.
- Firebase project configuration and deployment evidence.
- Cloudinary boundary where it replaces Firebase Storage for application uploads.
- Future migration or coexistence with the Express/OpenAPI/Drizzle path.

### Excluded

- Canonical Authentication and Permission policy, owned by the corresponding architecture and module handbooks.
- Cloudinary provider implementation details beyond the boundary described here.
- Claiming deployed Firestore rules, indexes, functions, monitoring, or backups that are not represented by repository evidence.

## Ownership

| Firebase concern | Owner | Responsibility |
| --- | --- | --- |
| App initialization | Frontend Engineering | Initialize once, use approved runtime configuration, and expose only required clients. |
| Authentication | Security and Engineering | Maintain provider flow, sessions, profile resolution, recovery, and sign-out. |
| Firestore data | Frontend, Backend, Security, and Data | Maintain paths, source-of-truth decisions, rules, indexes, integrity, and migration evidence. |
| Realtime Database | Security and Engineering | Keep the closed boundary explicit or document an approved future use before enabling it. |
| Storage | Security, Privacy, and Engineering | Enforce path, identity, membership, file, replacement, and deletion rules. |
| Operations and recovery | Reliability, Data, and Operations | Monitor, back up, restore, validate, and respond to Firebase failures or incidents. |

## Related documents

- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) owns Firebase identity and session flow.
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) owns data-boundary access decisions.
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) owns persistence and source-of-truth decisions.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns record movement and transformations.
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md) owns Organization and Workspace isolation.

## Architecture principles

1. **One Firebase service, one declared purpose.** Auth, Firestore, Realtime Database, and Storage are not interchangeable just because the SDK exposes them together.
2. **Client paths are not rules.** A browser-generated path or query is untrusted input until the deployed boundary authorizes it.
3. **Rules are source code and deployment evidence.** Checked-in rules, deployed rules, emulator tests, and production verification must be distinguished.
4. **Organization scope is explicit at every hop.** Profile, path, rule, cache, export, and audit context must agree.
5. **Provider boundaries remain visible.** Cloudinary and a future API/database path must not be described as Firebase behavior or silent fallbacks.
6. **Closed services stay closed.** A disabled Realtime Database path is not an available backup or alternate source.

## Standards

### Initialization

`artifacts/web/src/lib/firebase.ts` reads Firebase configuration from Vite environment variables, reuses an existing app during hot-module reload, and exports `getAuth(app)` and `getFirestore(app)`. Firebase web configuration is runtime configuration, not a credential for server administration. Required values and environment separation remain operational responsibilities.

### Authentication and profile

Firebase Auth emits provider identity through `onAuthStateChanged`. The application then reads `users/{uid}` and, when `orgId` exists, reads the matching Organization document for display and subscription context. This profile lookup is application context; it does not replace Firestore, Storage, or API authorization. See [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md).

### Firestore data path

Current domain hooks construct paths under:

```text
organizations/{orgId}/{collection}
```

Observed collections include Students, Teachers, Attendance, Fees, Exams, Results, Notices, Homework, Routine, and Expenses. Query keys include Organization scope before object and filter parameters. Firestore timestamps are mapped at the hook boundary.

The repository snapshot does not include a Firestore rules file. The security posture of these paths therefore cannot be concluded from client code. Before relying on any path, obtain the deployed rules or approved rules source, test authenticated and unauthenticated access, test each Role and Organization boundary, and record the evidence.

### Realtime Database

`firebase.json` points Realtime Database rules to `database.rules.json`, and that file denies all reads and writes. No feature should use Realtime Database unless an approved architecture decision defines its purpose, data model, rules, migration, and recovery. It is not an implicit cache, queue, backup, or fallback for Firestore.

### Storage and Cloudinary

Checked-in `storage.rules` permits authenticated reads of Organization student-photo paths and authenticated writes subject to type and size checks. Profile-photo writes additionally require the matching UID. These rules do not, by themselves, establish Organization membership for student-photo access.

The current `image-upload.ts` pipeline validates and compresses images in the browser, uploads to Cloudinary, stores the returned secure URL and public ID in Firestore, and calls a server-side deletion endpoint for cleanup. A feature must identify whether a given object is in Cloudinary or Firebase Storage and must not silently write to both.

### Project and deployment boundary

`.firebaserc` identifies the configured Firebase project, while `firebase.json` currently declares Realtime Database and Storage rule files. These files are configuration pointers, not proof that Firestore rules, indexes, deployed versions, monitoring, or backups are current. Deployment must compare intended and deployed configuration and retain a reviewable result.

## Implementation guidelines

### Rules change

For every rule change, document affected paths, actor, Organization/Workspace scope, read/write operation, field or file constraints, denial behavior, indexes or query impact, emulator evidence, deployment target, rollback, and incident owner. Test direct requests rather than only UI flows.

### Organization isolation

Derive `orgId` from trusted profile or service context. Do not permit a client-controlled `orgId` to broaden a read or write. Recheck membership and Permission for direct documents, related records, exports, images, deep links, caches, and support access.

### Failure and availability

Distinguish Auth failure, missing profile, Firestore unavailable, rule denial, empty scoped result, Storage rejection, Cloudinary failure, and API failure. Do not silently fall back from Firestore to Realtime Database, PostgreSQL, cached data, or fabricated state.

### Migration boundary

Moving a Firebase object to PostgreSQL or another provider requires identifier mapping, Organization scope, field and timestamp mapping, audit mapping, backfill, reconciliation, dual-path observability if used, consumer cutover, rollback, and retirement. Follow [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md), [LOADING_STATES.md](./LOADING_STATES.md), and [ERROR_HANDLING.md](./ERROR_HANDLING.md).

- Auth, Firestore, rule, upload, and provider states remain distinguishable and actionable.
- Upload progress, rejection, timeout, retry, deletion, and replacement are accessible.
- Empty scoped data is not confused with denied access or unavailable service.
- Firebase failures preserve safe input and the recovery path without exposing protected records.

## AI implementation notes

No Firebase AI path is implemented. Future AI requests must use the same Firebase-authenticated Organization and Permission scope as other data operations, minimize document fields, keep generated content separate from Firestore source records, and never use AI output as a rules or authorization decision.

## Review checklist

- [ ] Each Firebase service has a declared purpose, owner, source of truth, and boundary.
- [ ] Client initialization, checked-in configuration, deployed configuration, and runtime evidence are distinguished.
- [ ] Firestore rules evidence exists for every active path or the gap is explicitly blocking.
- [ ] Auth, Firestore, Storage, Realtime Database, Cloudinary, cache, export, and API boundaries are separated.
- [ ] Organization and Workspace isolation is tested through direct requests and relevant Role paths.
- [ ] Provider failure, rule denial, empty data, stale state, retry, deletion, and recovery behavior is explicit.
- [ ] Backup, audit, privacy, accessibility, and operational evidence is linked through [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Firebase configuration loads only from approved environment sources and never contains server credentials.
- [ ] Auth and profile tests cover sign-in, sign-out, expiry, missing profile, changed scope, and revoked access.
- [ ] Firestore rules tests cover direct reads/writes, cross-Organization access, related records, exports, and Role boundaries.
- [ ] Storage tests cover path scope, membership, UID ownership, size, type, replacement, deletion, and unauthorized access.
- [ ] Realtime Database remains closed unless an approved decision and rule test says otherwise.
- [ ] Cloudinary upload and deletion tests cover invalid files, timeout, retry, partial cleanup, and stale references.
- [ ] Deployment, monitoring, backup, recovery, and incident evidence is current for the affected service.

## References

- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [modules/Multi_Tenancy.md](./modules/Multi_Tenancy.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)
- [modules/Integrations.md](./modules/Integrations.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)