---
title: EduTrack Onboarding Guide
purpose: Help a new contributor orient to the product, repository boundaries, documentation owners, safe setup, and evidence-based delivery path.
scope: Product context, documentation hierarchy, repository orientation, local setup, ownership, implementation, validation, review, release, and support.
audience: New and returning contributors, maintainers, reviewers, QA, Security, Product, Design, and Operations.
related_documents:
  - ./INDEX.md
  - ./PRODUCT_CONSTITUTION.md
  - ./PRODUCT_GOVERNANCE.md
  - ./GLOSSARY.md
  - ./CONTRIBUTING.md
  - ./ENVIRONMENT_SETUP.md
  - ./TECH_STACK.md
  - ./FOLDER_STRUCTURE.md
  - ./PROJECT_CONVENTIONS.md
  - ./CODE_OWNERSHIP.md
  - ./DEVELOPER_PLAYBOOK.md
  - ./DEVELOPMENT_WORKFLOW.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a repository, architecture, contributor, or release-process change
owner: Engineering, Developer Experience, and Product Governance
version: 1.0.0
status: Active contributor onboarding guide
last_updated: 2026-08-02
normative_level: Onboarding guidance subordinate to product governance, engineering, security, accessibility, and release standards
canonical_terms: Organization, Workspace, Role, Permission, source of truth, boundary, artifact, evidence, release
---

# EduTrack Onboarding Guide

## How to use this guide

Use this guide to find the right owner and repository boundary before making a change. It is a route through existing documentation, not a replacement for any canonical standard. Start with [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) when the correct owner is unclear.

## Product orientation

EduTrack is organized around authenticated identity, Organization or Workspace scope, Role-aware workflows, and clear ownership of data and behavior. Core product areas include Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Classes, Subjects, Routine, Academic Sessions, Search, Filters, and the AI Assistant.

Read [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md), [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md), and [GLOSSARY.md](./GLOSSARY.md) before introducing a new term, workflow, authority, or source-of-truth claim.

## Repository orientation

| Boundary | Start with | Important distinction |
| --- | --- | --- |
| Web application | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | The current web path is React/Vite/Firebase-first. |
| API service | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | The separate service and its current implemented routes are not automatically the web source of truth. |
| API contract and generated packages | [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) | The OpenAPI source, generation, mounted routes, and consumers must agree. |
| Persistence and migration | [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Firestore and the separate Drizzle/PostgreSQL path remain distinct until an approved decision changes that. |
| Firebase and provider behavior | [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) | Checked-in configuration is not proof of deployed enforcement. |
| Shared components | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Use the owning component contract before adding or extending a primitive. |
| Documentation | [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) | Extend the narrowest canonical owner and update navigation maps. |

Read [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md), [TECH_STACK.md](./TECH_STACK.md), and [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md) to locate files, packages, scripts, generated output, and documentation boundaries.

## First-day setup

- [ ] Read the product, governance, glossary, contribution, and environment documents.
- [ ] Confirm the repository revision and package-manager setup.
- [ ] Install with the committed lockfile and use approved non-production configuration.
- [ ] Start only the workflow or package boundary needed for the task.
- [ ] Verify that no production data, credentials, or private configuration enters local files or fixtures.
- [ ] Run the focused typecheck, build, or validation command for the boundary being changed.
- [ ] Keep local results distinct from preview and production evidence.

Follow [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for setup commands and [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor expectations. This guide does not repeat their commands or environment policy.

## Before the first implementation

1. Translate the request into a user outcome and affected boundary.
2. Identify Roles, Permissions, Organization or Workspace scope, objects, states, data, integrations, and recovery implications.
3. Check [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md) for the owning package and review partners.
4. Check [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) before adding a new rule, term, provider, component, data path, or handbook.
5. Use [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md) to plan implementation, evidence, review, and handoff.

## Getting help safely

Ask for the smallest missing context and do not request secrets, credentials, full protected records, or production exports. Route user-impacting reports through [SUPPORT_PLAYBOOK.md](./SUPPORT_PLAYBOOK.md), operational conditions through [OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md), and security or data-integrity concerns through [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md).

## Onboarding completion

Onboarding is complete when the contributor can identify the product vocabulary, owning repository boundary, relevant canonical documents, safe local setup, evidence path, review partners, release handoff, and support or incident route. It is not complete merely because dependencies install or a local process starts.

## References

- [INDEX.md](./INDEX.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md)
- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md)
- [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md)
- [DEVELOPMENT_WORKFLOW.md](./DEVELOPMENT_WORKFLOW.md)
