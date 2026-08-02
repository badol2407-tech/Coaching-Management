---
title: EduTrack Code Ownership Guide
purpose: Map repository boundaries to their canonical owners, review partners, and escalation paths without claiming unverified repository enforcement.
scope: Package ownership, source-of-truth boundaries, documentation ownership, review routing, generated artifacts, preview boundaries, and escalation.
audience: All contributors, Engineering, Product, Design, QA, Security, Privacy, Accessibility, Reliability, Operations, and reviewers.
related_documents:
  - ./FOLDER_STRUCTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./DOCUMENTATION_MAP.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./GIT_WORKFLOW.md
  - ./PR_TEMPLATE.md
review_frequency: Quarterly and after a package, source-of-truth, ownership, or repository-boundary change
owner: Engineering and Product Governance
version: 1.0.0
status: Active ownership guidance
last_updated: 2026-08-02
normative_level: Ownership guidance subordinate to repository structure, architecture handbooks, Product Governance, and review standards
canonical_terms: owner, reviewer, source of truth, boundary, Organization, Workspace, Role, Permission, generated artifact, escalation
---

# EduTrack Code Ownership Guide

## Use and authority

Use this guide to route a change to the team or discipline that owns the affected boundary. [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) owns repository placement, the architecture handbooks own technical boundaries, and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) owns documentation authority. This guide is not evidence of a checked-in GitHub `CODEOWNERS` file, branch protection, automatic reviewer assignment, or deployment approval.

An owner is accountable for the source of truth and review context. A reviewer is asked to inspect the change. An approver or release owner makes the decision required by the applicable governance or release handbook.

## Boundary map

| Repository boundary | Primary source of truth | Typical owner | Review partners | Start with |
| --- | --- | --- | --- | --- |
| `artifacts/web/` | React/Vite/Firebase web product sources | Frontend Engineering | Product Design, Accessibility, QA, Security | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) |
| `artifacts/api-server/` | Express service and mounted route implementation | Backend Engineering | API Engineering, Security, QA, Reliability | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) |
| `lib/api-spec/` | Authored OpenAPI contract and generation configuration | API Engineering | Backend Engineering, Frontend Engineering, Security | [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) |
| `lib/api-client-react/` and `lib/api-zod/` | Generated output derived from the API contract | API Engineering | Backend Engineering, Frontend Engineering | [API_CONTRACTS.md](./API_CONTRACTS.md) |
| `lib/db/` | Database package and persistence boundary | Backend and Data Engineering | Security, Reliability, QA, Product Governance | [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) |
| `artifacts/mockup-sandbox/` | Isolated component and design preview sources | Product Design and Design Systems | Frontend Engineering, Accessibility | [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) |
| `docs/` and its `modules/` and `components/` directories | Governed documentation source files | Product Governance and the named handbook owner | Engineering, Product, Design, QA, Security | [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) |

The current web product and the separate Express/OpenAPI/Drizzle path remain distinct. A package, contract, route, rule, or preview does not prove adoption by another boundary.

## Ownership by concern

| Concern | Canonical owner | Route changes through |
| --- | --- | --- |
| Product principles, authority, exceptions, and document lifecycle | Product Constitution and Product Governance | Product Governance |
| API contract, generation, transport, and implementation status | API Layer Architecture | API Engineering and Backend Engineering |
| Frontend composition and current web data path | Frontend Architecture | Frontend Engineering |
| Service, persistence, and backend boundaries | Backend Architecture and Database Architecture | Backend and Data Engineering |
| Identity, Role, Permission, Organization, and Workspace access | Authentication Architecture and Authorization Architecture | Security, Backend, and owning feature team |
| Component contract and shared component lifecycle | Component Specifications and component handbooks | Product Design, Design Systems, Frontend Engineering |
| Test layer selection and evidence shape | Testing Strategy | QA and Reliability |
| Release decision and exceptions | Quality Gates | Product Governance and approvers |
| Review evidence and findings | Code Review Guidelines and Review Checklists | Reviewers and owning team |
| Documentation ownership and dependencies | Documentation Map | Named handbook owner and Product Governance |

## Routing a change

1. Identify the changed path and the source of truth.
2. Read the owning architecture, module, component, or governance handbook.
3. Name the affected Roles, Permissions, Organization or Workspace scope, data, consumers, and consequences.
4. Select review partners from the boundary map and the risk of the change.
5. Use [PR_TEMPLATE.md](./PR_TEMPLATE.md) and [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) to record evidence.
6. Escalate an ownership or source-of-truth conflict through [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) before implementation.

## Boundary rules

- Do not hand-edit generated API clients or schemas; update their authored source and regenerate.
- Do not assign authorization ownership to a UI component; enforce access at the receiving data or workflow boundary.
- Do not treat a documentation reference, package, mockup, or checked-in rule as proof of runtime adoption.
- Do not create a new provider, data path, component handbook, or terminology set when an existing owner covers the concern.
- Keep documentation templates and routing guides subordinate to the canonical standards they reference.
- Preserve source-of-truth, migration, rollback, audit, privacy, and recovery ownership when a change crosses packages.

## Ownership uncertainty

When ownership is unclear, stop before editing the boundary, record the competing sources of truth, and route the question to Product Governance and the relevant architecture owners. Use [ADR_TEMPLATE.md](./ADR_TEMPLATE.md) for a material decision and record the approved result in [DECISION_LOG.md](./DECISION_LOG.md).

## References

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [PR_TEMPLATE.md](./PR_TEMPLATE.md)
