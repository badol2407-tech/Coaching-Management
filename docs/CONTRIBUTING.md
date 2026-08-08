---
title: EduTrack Contributing Guide
purpose: Help contributors understand the product documentation, repository boundaries, development setup, review expectations, and safe delivery path.
scope: Orientation, local setup, choosing an ownership boundary, implementation, documentation, testing, review, and release handoff.
audience: New and returning contributors, maintainers, reviewers, QA, Security, Product, and Design.
related_documents:
  - ./INDEX.md
  - ./ENVIRONMENT_SETUP.md
  - ./TECH_STACK.md
  - ./CODING_STANDARDS.md
  - ./GIT_WORKFLOW.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./TESTING_STRATEGY.md
  - ./QUALITY_GATES.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a contributor, repository, architecture, or release-process change
owner: Engineering, Developer Experience, and Product Governance
version: 1.0.0
status: Active contributor guide
last_updated: 2026-08-02
normative_level: Contributor guidance subordinate to product governance, engineering, security, accessibility, and release standards
canonical_terms: Organization, Workspace, Role, Permission, source of truth, artifact, evidence, release
---

# EduTrack Contributing Guide

## Welcome

EduTrack is a coaching-management product organized around authenticated identity, Organization or Workspace scope, Role-aware workflows, and clear ownership of data and behavior. Contributions should make useful work safer, more understandable, accessible, and recoverable.

Start with [INDEX.md](./INDEX.md) for the documentation hierarchy. Use [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) for product principles and authority, then use the implementation and delivery handbooks relevant to the change.

## Before making a change

1. Read [TECH_STACK.md](./TECH_STACK.md) and [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).
2. Read [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) to identify the owning package and source-of-truth file.
3. Read the relevant architecture, module, component, accessibility, security, and data-flow handbooks.
4. Define the user outcome, affected Roles, Organization or Workspace scope, objects, Permissions, states, consequences, and recovery path.
5. Check [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) for the canonical owner before adding a rule or handbook.

Do not create a new parallel provider, context, standard, component handbook, data path, or terminology set when an existing owner covers the concern.

## Set up locally

Follow [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for prerequisites, package installation, environment names, and focused commands. Never copy production data or credentials into local fixtures or committed files.

The normal workspace installation is:

```bash
pnpm install --frozen-lockfile
```

Use the managed workflow or package command for the boundary you are changing. The web product, API service, shared generated packages, database package, and mockup sandbox are separate repository boundaries; a successful check in one boundary is not evidence for another.

## Choose the correct change boundary

| Change | Start with | Keep in mind |
| --- | --- | --- |
| Web page or workflow | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Current web data access is Firebase-first; do not silently mix API and Firebase. |
| Shared component or pattern | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Check approved component ownership, states, accessibility, and responsive behavior. |
| API contract or generated client | [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) | Author the OpenAPI source, regenerate dependent packages, and compare contract to mounted routes. |
| API route or service | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Validate identity, scope, authorization, errors, integrity, observability, and recovery at the service boundary. |
| Database or persistence | [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Name the source of truth, migration order, compatibility, reconciliation, and recovery. |
| Firebase rules or provider behavior | [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) | Checked-in configuration is not proof of deployed enforcement. |
| Documentation | [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) | Extend the narrowest canonical owner and update both navigation maps when governed. |

## Implement responsibly

Follow [CODING_STANDARDS.md](./CODING_STANDARDS.md). In every material change:

- keep the source of truth and owning boundary explicit;
- preserve Role, Permission, Organization, and Workspace scope at the receiving boundary;
- cover success, loading, empty, stale, pending, unauthorized, error, duplicate, and recovery states when applicable;
- preserve safe input and make unknown outcomes visible;
- protect secrets, private data, audit context, and analytics boundaries;
- reuse canonical vocabulary and approved components;
- provide accessible keyboard, screen-reader, zoom, reflow, mobile, localization, and reduced-motion behavior where applicable;
- document migrations, generated artifacts, provider changes, and rollback or compensating actions.

## Validate the change

Select evidence using [TESTING_STRATEGY.md](./TESTING_STRATEGY.md). At minimum, run the checks appropriate to the changed package and inspect the exact diff:

```bash
pnpm run typecheck
pnpm run build
git diff --check
```

For documentation changes, validate relative links, metadata, canonical ownership, duplicate rules, orphan documents, and unresolved placeholders. For code changes, add the applicable contract, authorization, data-integrity, accessibility, security, performance, resilience, and recovery evidence.

Do not report an unsupported coverage percentage. Report the commands, environment, source revision, dataset or fixture, Role and scope, result, defects, owner, and retest information needed by the quality gate.

## Prepare review

Use [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for branch and commit practice and [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) for review preparation.

A pull request should explain:

- the user problem and outcome;
- changed paths and source of truth;
- affected Roles, scope, permissions, data, integrations, and consequences;
- tests and other evidence, including what is not applicable and why;
- migration, rollout, rollback, or compensating behavior;
- documentation ownership and map changes.

Keep the pull request small enough for a reviewer to reconstruct the change. Respond to findings with a code or documentation change, evidence, or a recorded decision; do not resolve a substantive finding by simply restating the intent.

## Release handoff

Review completion is not deployment. Follow [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md), [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md), [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md), and [QUALITY_GATES.md](./QUALITY_GATES.md) for promotion, readiness, monitoring, and recovery evidence.

Do not claim that a package, route, rule, environment, monitoring control, or deployment exists only because a source file or contract exists.

## Contributor checklist

- [ ] I read the applicable canonical owners and selected the correct repository boundary.
- [ ] I did not add a duplicate rule, data source, provider, component, or term.
- [ ] I addressed scope, Permissions, privacy, accessibility, states, errors, audit, and recovery as applicable.
- [ ] I ran the relevant validation and recorded environment, revision, result, and limitations.
- [ ] I updated governed indexes and maps when documentation changed.
- [ ] I kept secrets, production data, generated output edits, and unrelated files out of the change.
- [ ] I am not describing target architecture or missing automation as current capability.

## References

- [INDEX.md](./INDEX.md)
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)