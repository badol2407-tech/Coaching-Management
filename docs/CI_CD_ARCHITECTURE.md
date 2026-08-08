---
title: EduTrack CI/CD Architecture
purpose: Define the controlled path from a reviewed change to validated build artifacts and an approved deployment.
scope: Source changes, documentation validation, dependency installation, checks, generated artifacts, quality gates, environments, approvals, promotion, and rollback handoff.
audience: Engineering, Frontend, Backend, QA, Security, Privacy, Accessibility, Reliability, Operations, Product Governance, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./QUALITY_GATES.md
  - ./TESTING_STRATEGY.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./MONITORING_AND_LOGGING.md
  - ./OBSERVABILITY.md
  - ./ERROR_MONITORING.md
  - ./SECURITY_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./FOLDER_STRUCTURE.md
review_frequency: Quarterly and after a repository, pipeline, package, deployment, security, or release-governance change
owner: Engineering, QA, Security, Accessibility, Reliability, Operations, and Product Governance
version: 1.0.0
status: Active delivery architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding engineering, security, accessibility, and release standards
canonical_terms: change, pipeline, artifact, build, validation, promotion, approval, rollback, release
---

# EduTrack CI/CD Architecture

## Metadata

This handbook defines delivery sequencing, validation ownership, and promotion boundaries. It does not replace [QUALITY_GATES.md](./QUALITY_GATES.md), which owns release decisions, or [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), which owns test selection and evidence.

## Purpose

Continuous integration should turn every reviewed change into reproducible evidence. Continuous delivery should promote only a known artifact through an approved environment and preserve a clear path to observe, pause, or roll back the release.

The pipeline must treat documentation, the active React/Vite/Firebase web path, and the separately packaged Express/OpenAPI/Drizzle path according to their actual ownership. A generated client, API contract, schema, or deployment configuration is not accepted merely because it exists in source control.

## Current repository state

- The repository has package scripts for installation, type-checking, building, and workspace orchestration, but no checked-in `.github/workflows/` pipeline is present in the current snapshot.
- `vercel.json` identifies the web build command and `artifacts/web/dist/public` as the static output directory.
- The active web path uses Firebase directly; the API service currently exposes health while the broader API contract and database package remain a separate architecture path.
- No current automated evidence is claimed for tests, security checks, accessibility checks, deployment smoke checks, or post-deployment monitoring until a workflow records it.

These observations are not failures by themselves. They identify the boundary between existing repository configuration and the target delivery system.

## Ownership

| Pipeline concern | Owner | Responsibility |
| --- | --- | --- |
| Change and branch policy | Product Governance and Engineering | Define review, scope, dependency, and exception expectations. |
| Static and package validation | Engineering | Keep install, type, format, build, generated-artifact, and dependency checks reproducible. |
| Test evidence | QA and Reliability | Select and interpret tests under [TESTING_STRATEGY.md](./TESTING_STRATEGY.md). |
| Security and privacy checks | Security and Privacy | Review dependencies, secrets, authorization boundaries, artifacts, and sensitive output. |
| Accessibility evidence | Accessibility and QA | Run applicable automated and manual checks under the accessibility standards. |
| Artifact and environment promotion | Operations and Reliability | Promote immutable outputs, verify readiness, and preserve release evidence. |
| Release decision | Product Governance and approvers | Decide Pass, Block, or approved Exception under [QUALITY_GATES.md](./QUALITY_GATES.md). |

## Pipeline principles

1. **Build once, promote the same artifact.** Do not rebuild different bytes for preview and production without recording the difference and compatibility decision.
2. **Fail before promotion.** A required check does not become optional because the change is small or visually complete.
3. **Keep source paths explicit.** Firebase web evidence, API contract evidence, database evidence, and documentation evidence remain attributable to the path actually tested.
4. **Generate deliberately.** OpenAPI changes run code generation before consumers or implementations rely on changed types; generated output is checked for drift.
5. **Protect secrets.** Credentials are injected by approved environment controls, never committed, printed, placed in artifacts, or used in untrusted build output.
6. **Prefer reversible releases.** Static releases are immutable and selectable; rules, schema, data, and configuration changes include a forward or compensating recovery plan.
7. **Publish evidence, not only status.** Each stage records version, environment, inputs, result, owner, and links to failures or exceptions.
8. **Keep deployment and monitoring connected.** A release is not complete until health, errors, latency, data freshness, and recovery signals are attributable to it.

## Pipeline stages

### 1. Change preflight

Confirm branch or review identity, changed paths, affected Roles and scope, source-of-truth impact, generated artifacts, migrations, secrets, deployment configuration, documentation ownership, and rollback or compensating behavior.

Documentation changes additionally validate links, duplicate canonical homes, orphan documents, metadata, and placeholders. A link or map failure is a documentation quality failure, not a reason to suppress the check.

### 2. Reproducible install

Use the committed package manager and lockfile. The build environment records runtime, package-manager, dependency, and tool versions. Installation must not silently change the lockfile or fetch unreviewed credentials.

### 3. Static validation

Run applicable formatting, lint, type, schema, configuration, and generated-artifact checks. Confirm that the API contract, generated React client, generated Zod schemas, route implementation, and database model remain compatible when the API path is affected.

### 4. Build

Build the affected package and any required shared packages. For the web path, the deployable output is the configured static directory from [vercel.json](../vercel.json); for the separate API path, the service build and health behavior are validated independently.

### 5. Test and quality evidence

Run the test layers selected by [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), including direct authorization, data integrity, accessibility, security, performance, resilience, and recovery evidence where applicable. Record not-applicable decisions rather than hiding missing evidence.

### 6. Artifact inspection

Inspect the exact artifact for unexpected files, source maps or diagnostics policy, client-exposed configuration, secrets, dependency licenses where required, route fallback behavior, generated output, and environment-specific values. The artifact is identified by source revision, build inputs, and content digest or equivalent immutable identity.

### 7. Preview or non-production validation

Deploy the artifact to the intended preview or non-production boundary. Run smoke checks for process or static availability, authentication and scope entry, representative read paths, a safe mutation or dry run where permitted, errors, accessibility, and monitoring attribution. Do not treat preview data as production evidence.

### 8. Approval and production promotion

The approver verifies applicable [QUALITY_GATES.md](./QUALITY_GATES.md), compatibility, data migration or rules plan, monitoring readiness, recovery owner, communication, and release scope. Production promotion references the already-built artifact and records the decision.

### 9. Post-deployment verification

Confirm deployment identity, health/readiness, error rate, latency, data freshness, authentication, key user journeys, audit behavior, and alert routing. If evidence is ambiguous, preserve the release and route to the operational decision owner rather than claiming success.

## Branch and promotion model

The target model is:

```text
reviewed change
    -> integration checks
    -> immutable artifact
    -> preview or non-production verification
    -> approved promotion
    -> production verification
    -> monitored release or rollback
```

The repository does not currently declare branch protection or environment approval configuration. Those controls must be adopted through an explicit repository and governance change; this handbook does not claim that a protected `main` branch or staging environment already exists.

## Secrets, permissions, and supply chain

- Build jobs receive only the minimum environment access for their stage.
- Public Firebase web configuration and Cloudinary upload configuration are reviewed for scope and abuse potential but are not treated as server credentials.
- Database URLs, provider tokens, signing material, session secrets, deployment credentials, and recovery factors remain in approved secret management.
- Pull-request or untrusted code must not receive production secrets.
- Dependency updates identify source, license or policy impact, lockfile change, vulnerability result, and rollback or pinning decision.
- Logs and artifacts are scanned for credentials, tokens, private records, raw prompts, and unnecessary personal data.

## Migrations and generated artifacts

When a change affects OpenAPI, generated clients, Zod schemas, database schema, Firebase rules, Storage rules, Cloudinary behavior, or source-of-truth movement:

1. identify the current and target path;
2. update the source contract or rule;
3. regenerate or package dependent artifacts;
4. run compatibility, authorization, data-integrity, and recovery checks;
5. deploy in an order that preserves readers and writers;
6. reconcile and validate the durable result;
7. retain a rollback or compensating plan.

No pipeline step may infer tenancy, route support, deployed rules, backup readiness, or production monitoring from source-file presence alone.

## Failure, cancellation, and rollback

- A failed stage keeps its evidence and failure category.
- A cancelled job is not a pass and does not silently promote a prior unverified artifact.
- Retry is bounded and safe for the operation; consequential writes and deployment mutations use idempotency or reconciliation.
- Rollback uses the release plan in [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md). Data, rules, and schema changes may require a compensating change rather than binary reversal.
- Error details are diagnosable in protected telemetry without leaking secrets or protected record existence to a user or public build log.

## Review checklist

- [ ] Changed paths, source of truth, Roles, scope, consequence, generated artifacts, migrations, and recovery are identified.
- [ ] Installation, static checks, build, tests, security, accessibility, artifact inspection, and smoke checks are selected.
- [ ] The same immutable artifact is used for promotion or differences are explicitly recorded.
- [ ] Secrets and untrusted code boundaries are protected.
- [ ] API, database, Firebase, provider, and documentation changes have compatibility evidence.
- [ ] Monitoring, error, audit, and rollback ownership is ready before production promotion.
- [ ] Any missing evidence is Block or an approved Exception under [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] The pipeline reports source revision, environment, versions, artifact identity, stage result, and owner.
- [ ] Documentation link, duplicate, orphan, metadata, and placeholder checks run for documentation changes.
- [ ] Generated artifacts are regenerated after every relevant API contract change.
- [ ] Direct authorization, data-integrity, accessibility, security, performance, resilience, and recovery checks are linked when applicable.
- [ ] Preview and production evidence are not conflated.
- [ ] Post-deployment health, error, latency, freshness, and key-journey checks attribute results to the release.
- [ ] Failed, cancelled, retried, blocked, Exception, promoted, and rolled-back states remain distinguishable.

## References

- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)
- [OBSERVABILITY.md](./OBSERVABILITY.md)
- [ERROR_MONITORING.md](./ERROR_MONITORING.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)