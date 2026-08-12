---
title: EduTrack Security Architecture
purpose: Define the security boundaries, protected assets, control layers, and evidence model for EduTrack.
scope: Threat boundaries, identity, authorization, tenancy, data protection, secrets, uploads, logging, integrations, API and database controls, incident response, and recovery.
audience: Security, Privacy, Engineering, Backend, Frontend, Reliability, Operations, QA, Product Governance, and reviewers.
related_documents:
  - ./PRODUCT_CONSTITUTION.md
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./SECURITY_UX.md
  - ./AUTHENTICATION_ARCHITECTURE.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./modules/Audit_Logs.md
  - ./modules/Backup_and_Recovery.md
  - ./modules/Integrations.md
  - ./modules/Multi_Tenancy.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a security, privacy, dependency, data-source, incident, or deployment change
owner: Security, Privacy, Engineering, Reliability, Operations, QA, and Product Governance
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding security, privacy, tenancy, engineering, and release standards
canonical_terms: security boundary, asset, threat, Authentication, Authorization, Organization, Workspace, Role, Permission, secret, audit, incident
---

# EduTrack Security Architecture

## Metadata

This handbook connects the existing Authentication, authorization, Firebase, backend, database, audit, recovery, and security-UX standards into a system boundary view. It does not replace a canonical security threshold or invent a second privacy, Permission, retention, or incident policy.

## Purpose

EduTrack handles identity, Student and Teacher records, Attendance, Fees, Exams, Reports, Organization administration, uploaded media, and support access. Security architecture makes the paths between those assets explicit so that a control is placed at the boundary where misuse could occur.

The security model is layered:

```text
browser and build boundary
  -> Authentication and session boundary
  -> Role, Permission, and tenancy boundary
  -> Firebase/API/database/storage boundary
  -> audit, monitoring, backup, and incident boundary
```

## Scope

### Included

- Assets and trust boundaries across the current Firebase-first web path.
- The separate Express/OpenAPI/Drizzle/PostgreSQL path and its adoption conditions.
- Identity, authorization, Organization isolation, direct access, and support access.
- Sensitive data, secrets, client configuration, uploads, exports, logs, analytics, and error handling.
- Dependency, operational, incident, recovery, and evidence boundaries.

### Excluded

- User-facing security language and consent, which are owned by [SECURITY_UX.md](./SECURITY_UX.md).
- Canonical Role and Permission definitions, which are owned by [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and the module handbooks.
- Product-wide numeric accessibility, performance, retention, or encryption requirements owned by their existing standards.
- A claim that target controls already exist merely because the repository has a package, rule file, or API contract.

## Ownership

| Security area | Owner | Responsibility |
| --- | --- | --- |
| Identity and session | Security and Engineering | Protect provider state, session transitions, recovery, and sign-out. |
| Authorization and tenancy | Security, Privacy, Backend, and Engineering | Enforce Role, Permission, Organization, Workspace, and object scope at data boundaries. |
| Application and client boundary | Frontend Engineering | Minimize exposed data, avoid secret handling in the browser, and preserve safe error behavior. |
| Persistence and media | Backend, Data, Security, and Privacy | Protect records, files, exports, backups, and source-of-truth transitions. |
| Observability and incident response | Reliability, Operations, Security, and Privacy | Detect, contain, investigate, communicate, and recover from security events. |
| Evidence and exceptions | QA and Product Governance | Require evidence, owners, mitigations, approvals, and expiry for exceptions. |

## Related documents

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns technical security, privacy, tenancy, integrity, reliability, and testing requirements.
- [SECURITY_UX.md](./SECURITY_UX.md) owns user-facing security and privacy communication.
- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) owns identity and session architecture.
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) owns access evaluation and enforcement boundaries.
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) and [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) own current persistence boundaries.
- [modules/Audit_Logs.md](./modules/Audit_Logs.md) and [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md) own accountability and recovery contracts.

## Architecture principles

1. **Protect the boundary where the decision matters.** Browser visibility, cached data, and generated contracts do not replace service or rules enforcement.
2. **Minimize before protecting.** Do not collect, copy, log, export, cache, or send sensitive data that the task does not require.
3. **Fail closed without becoming opaque.** Deny protected access while providing the safe recovery or support path owned by the UX standards.
4. **Treat current state and target state as different claims.** Repository evidence must identify implemented controls, observed gaps, and prerequisites.
5. **Keep secrets out of client and user-visible channels.** Environment configuration, provider tokens, credentials, and signing material require approved secret management.
6. **Make consequential access accountable.** Support access, Permission changes, exports, sensitive reads, recovery, and integrations need a reviewable actor and outcome.
7. **Assume stale state and copied inputs.** Recheck identity, scope, Permission, object state, and signed or time-limited values at the receiving boundary.
8. **Security work is release work.** A control without negative-path, monitoring, recovery, and ownership evidence is not complete.

## Standards

### Protected assets and boundaries

| Asset | Primary boundary | Security concern |
| --- | --- | --- |
| Firebase identity and session | Firebase Auth and browser `AuthContext` | Credential, session, recovery, expiry, and sign-out integrity. |
| User profile and Organization context | Firestore profile resolution and authorization boundary | Role tampering, missing scope, stale profile, and cross-Organization access. |
| Domain records | Organization-scoped Firestore collections or future API/database | Direct reads, writes, exports, enumeration, integrity, and tenancy. |
| Uploaded media | Cloudinary upload path, deletion route, and any Firebase Storage path | File validation, access scope, replacement, deletion, and public URL exposure. |
| API and database path | Express, OpenAPI, generated client, Drizzle, and PostgreSQL | Authentication, authorization, validation, tenant constraints, secrets, and migration drift. |
| Audit and recovery data | Audit Logs and Backup/Recovery boundaries | Tampering, disclosure, retention, restore isolation, and accountability. |

### Current-state security observations

- The active web path initializes Firebase Auth and Firestore in the browser and reads domain records through Organization-derived hooks.
- Firebase client configuration is supplied through Vite environment variables; client configuration is not treated as a secret.
- The current image helper validates and compresses files in the browser, uploads to Cloudinary with a configured unsigned upload preset, stores the returned URL and public ID in application records, and calls a server-side deletion endpoint for removal.
- `database.rules.json` denies all Realtime Database access.
- `storage.rules` constrains the checked-in Storage paths by authentication, path, type, and size, but the student-photo read/write rule does not itself establish Organization membership.
- No Firestore rules file is present in the repository snapshot. Deployed Firestore enforcement must be obtained and tested from the Firebase project rather than inferred from the React code.
- The separate API service currently exposes health only, while the broader OpenAPI contract and PostgreSQL schema are not the active web source of truth.
- The application contains a super-admin email whitelist in frontend code. This is a sensitive implementation observation and is not a substitute for server-controlled Permission policy.

### Control layers

1. **Build and configuration:** keep secrets out of source, validate required runtime configuration, review dependencies, and keep environment-specific URLs out of committed documentation.
2. **Identity:** use the approved Authentication provider, distinguish provider user from application profile, and handle expiry, revocation, recovery, and sign-out.
3. **Authorization:** resolve actor, Role, Permission, Organization, Workspace, object, and action at the receiving boundary.
4. **Data:** enforce scope, validate input, preserve integrity, protect exports and files, and avoid overbroad reads.
5. **Transport and integrations:** use approved encrypted transport and provider scopes; verify webhook or callback authenticity before processing.
6. **Observability:** emit safe structured operational signals and governed audit events without credential or sensitive-content leakage.
7. **Recovery:** preserve incident evidence, restore only approved scope, verify integrity, and keep rollback and communication ownership visible.

## Implementation guidelines

### Threat review

Every material change should evaluate at least:

| Threat | Required question |
| --- | --- |
| Account compromise | What can the actor access after sign-in, and how are sessions revoked? |
| Role or profile tampering | Can a client edit its own Role, Organization, or Permission context? |
| Cross-Organization access | Can a guessed ID, altered query, export, cache, or related record cross scope? |
| Sensitive disclosure | Can logs, URLs, analytics, errors, Notifications, files, or AI context reveal data? |
| Upload abuse | Are type, size, destination, access, replacement, deletion, and malware/content risks addressed? |
| Replay or duplicate mutation | Can retries, copied requests, or stale forms duplicate a consequential operation? |
| Dependency or provider outage | Does failure remain visible, safe, observable, and recoverable? |
| Support misuse | Is the real actor distinct from the effective view and is entry/exit auditable? |

### Secrets and configuration

Use the project secret-management process for credentials and signing material. Never place tokens, passwords, private keys, recovery factors, database connection strings, or provider secrets in application code, docs, logs, analytics, URLs, or generated artifacts. Public Firebase web configuration and Cloudinary upload configuration must still be reviewed for scope, abuse potential, and environment separation.

### Logging and analytics

Operational logs should contain safe correlation and failure categories, not passwords, tokens, full sensitive records, or raw prompts. Analytics is not an audit record and must not become a second store for identity, Permission, financial, coaching, or security data. Consequential access follows the Audit Logs contract.

### Incident and recovery boundary

An incident path identifies detection, containment, affected scope, actor and data impact, user communication, credential/session action, evidence preservation, recovery, validation, and follow-up ownership. Backup and recovery must not restore credentials, sessions, or Permission state automatically; follow [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md).

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [SECURITY_UX.md](./SECURITY_UX.md), and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md).

- Security state, denial, expiry, risk, and recovery are available as semantic text and status.
- Masking, consent, support access, export, and destructive controls are operable by keyboard and assistive technology.
- Security feedback is understandable without color, sound, timing, or fear-based language.
- Protected content is not hidden in a way that creates an inaccessible dead end; the permitted recovery path remains discoverable.

## AI implementation notes

No AI runtime is implemented in the current repository. Future AI processing must minimize authorized inputs, declare source scope and retention, separate generated output from records, avoid secrets and raw security telemetry, and require human review for security, Permission, financial, or other consequential actions. AI cannot approve a security gate or decide an incident response.

## Review checklist

- [ ] Assets, actors, trust boundaries, data sources, and failure modes are named.
- [ ] Current controls are distinguished from target controls and repository gaps.
- [ ] Authentication, authorization, Organization isolation, direct access, files, exports, secrets, logs, analytics, and integrations are covered.
- [ ] Sensitive data is minimized at collection, transport, storage, cache, export, Notification, analytics, and AI boundaries.
- [ ] Consequential access and changes have audit, monitoring, incident, and recovery ownership.
- [ ] Dependencies, configuration, deployments, rules, and environment separation are reviewed.
- [ ] Evidence and exceptions follow [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Threat review covers account compromise, privilege escalation, tenancy, disclosure, upload, replay, outage, and support misuse.
- [ ] Direct boundary tests cover Firebase, Storage, API, database, exports, files, copied links, stale sessions, and cache state.
- [ ] Secret scans and log/analytics reviews show no credentials or unnecessary protected data.
- [ ] Incident detection, containment, communication, recovery, and evidence-preservation paths are exercised.
- [ ] Dependency and configuration changes have compatibility and rollback evidence.
- [ ] Keyboard, screen-reader, zoom, mobile, localization, and reduced-motion security experiences are tested.

## References

- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [modules/Audit_Logs.md](./modules/Audit_Logs.md)
- [modules/Backup_and_Recovery.md](./modules/Backup_and_Recovery.md)
- [modules/Integrations.md](./modules/Integrations.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)