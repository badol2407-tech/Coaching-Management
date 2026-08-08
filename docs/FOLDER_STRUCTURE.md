---
title: EduTrack Folder Structure
purpose: Explain repository boundaries, package ownership, and where implementation and documentation changes belong.
scope: Repository-level artifacts, shared libraries, frontend source, API service, database, generated packages, documentation, and configuration boundaries.
audience: Engineering, Product, Design, QA, Operations, Security, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./DOCUMENTATION_MAP.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a package, artifact, generated-code, or documentation-structure change
owner: Engineering, Product Governance, and Developer Experience
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding standards
canonical_terms: Organization, Workspace, Role, Permission, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Sidebar, AI Assistant
---

# EduTrack Folder Structure

## Metadata

This handbook documents the repository structure as an ownership map, not as a license to create parallel implementations. The current repository contains a Firebase-first web artifact and a separate API/database package family. The location of a file does not by itself establish that it is active, generated, or authoritative; the source-of-truth rules below do.

## Purpose

A predictable folder structure reduces accidental coupling, makes review ownership visible, and helps contributors place code, contracts, generated output, tests, and documentation in the correct boundary. It also makes current-versus-target architecture gaps discoverable.

## Scope

### Included

- Repository root and workspace package boundaries.
- `artifacts/web`, `artifacts/api-server`, and `artifacts/mockup-sandbox`.
- Shared `lib` packages for API contracts, generated clients, Zod schemas, and database access.
- `docs` and its handbook subdirectories.
- Configuration, rules, generated output, and source-of-truth expectations.

### Excluded

- Detailed page routes and state transitions, which belong to [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md) and [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md).
- Product module requirements, visual tokens, and release thresholds owned by existing canonical handbooks.
- A claim that every directory is currently used by the web application's runtime.

## Ownership

| Area | Owner | Placement rule |
| --- | --- | --- |
| Product documentation | Product Governance and the named handbook owners | Place governed handbooks under `docs/`; link owners instead of duplicating standards. |
| Web application | Frontend Engineering | Place pages, components, contexts, hooks, utilities, and assets under `artifacts/web/src`. |
| API service | Backend Engineering | Place Express bootstrap and route modules under `artifacts/api-server/src`. |
| API contract | Backend Engineering and API consumers | Author the contract in `lib/api-spec/openapi.yaml`; do not author contract rules in generated output. |
| Generated API packages | Engineering | Regenerate `lib/api-client-react` and `lib/api-zod`; review output but do not hand-edit generated files. |
| Relational persistence | Backend Engineering and Reliability | Place Drizzle schema and database exports under `lib/db`. |
| Component prototypes | Product Design and Frontend Engineering | Keep isolated live prototypes in `artifacts/mockup-sandbox`; do not make it the production source. |

## Related documents

- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) defines document ownership and dependency direction.
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) defines web runtime composition and frontend boundaries.
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) defines service, persistence, and current/target backend boundaries.
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) defines contract and client-generation ownership.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) defines movement of identity, scope, domain data, and errors.
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) defines approved shared component contracts.

## Architecture principles

1. **Package boundaries communicate ownership.** A package should have one primary responsibility and an explicit public surface.
2. **Source files and generated files are different authorities.** Contracts and schemas are authored in their source packages; generated clients and validators are derived artifacts.
3. **Artifacts are products or isolated previews.** The production web app is `artifacts/web`; the API service is `artifacts/api-server`; the mockup server is not a production runtime.
4. **Documentation is a governed dependency graph.** New handbooks must be indexed, owned, linked, and subordinate to existing standards.
5. **Cross-package imports follow direction.** UI may consume shared contracts deliberately; generated output must not reach back into application implementation.
6. **A folder name does not prove runtime usage.** Confirm imports, workflow configuration, route registration, and package scripts before describing a path as active.
7. **New domain boundaries declare their data and Permission contracts.** Placement cannot substitute for scope, authorization, audit, or retention design.

## Standards

### Repository map

```text
.
├── artifacts/
│   ├── web/              # React + Vite EduTrack web product
│   ├── api-server/       # Express API service; currently health route only
│   └── mockup-sandbox/   # Isolated component preview service
├── lib/
│   ├── api-spec/         # OpenAPI source and Orval configuration
│   ├── api-client-react/ # Generated React Query client and custom fetch
│   ├── api-zod/          # Generated Zod schemas and TypeScript types
│   └── db/               # Drizzle/PostgreSQL schema and database exports
├── docs/                 # Governed product, design, engineering, and architecture handbooks
├── database.rules.json   # Firebase Realtime Database access rules
└── storage.rules         # Firebase Storage access rules
```

### Web package

The production web package has these primary boundaries:

| Path | Responsibility |
| --- | --- |
| `artifacts/web/src/main.tsx` | Root mount and optional analytics initialization. |
| `artifacts/web/src/App.tsx` | Provider composition, Wouter router, route families, lazy page loading, and top-level fallback. |
| `artifacts/web/src/pages/` | Domain page composition and user workflows. |
| `artifacts/web/src/components/` | Shared and feature-level UI composition. |
| `artifacts/web/src/components/layout/` | Role-specific application shells and navigation. |
| `artifacts/web/src/contexts/` | Auth and impersonation cross-page state. |
| `artifacts/web/src/lib/hooks.ts` | TanStack Query hooks and current Firestore domain access. |
| `artifacts/web/src/lib/firebase.ts` | Firebase app, Auth, and Firestore initialization. |
| `artifacts/web/src/lib/image-upload.ts` | Cloudinary upload helper boundary. |
| `artifacts/web/src/hooks/` | Local browser/device hooks such as responsive and mobile drawer behavior. |
| `artifacts/web/src/index.css` | Global styles and design-system consumption. |

Pages should import shared behavior from these boundaries rather than recreating auth resolution, Organization path construction, query invalidation, or primitive component contracts.

### API and shared libraries

| Path | Responsibility | Authority |
| --- | --- | --- |
| `artifacts/api-server/src/app.ts` | Express application setup and `/api` mount | Service runtime |
| `artifacts/api-server/src/routes/` | Registered API route modules | Implemented route behavior |
| `lib/api-spec/openapi.yaml` | API paths, schemas, and operation contract | Contract source of truth |
| `lib/api-spec/orval.config.ts` | Generation configuration | Generation policy |
| `lib/api-client-react/src/custom-fetch.ts` | Shared generated-client fetch mutator | Client transport behavior |
| `lib/api-client-react/src/generated/` | Generated React Query operations | Derived output |
| `lib/api-zod/src/generated/` | Generated Zod schemas and types | Derived output |
| `lib/db/src/schema/` | Drizzle relational schema | Database model source |
| `lib/db/src/index.ts` | PostgreSQL pool and Drizzle exports | Database runtime entry |

### Documentation

Root handbooks under `docs/` own cross-cutting principles and standards. Core module specifications live under `docs/modules/`; approved component handbooks live under `docs/components/`. Architecture handbooks are root-level because they connect multiple implementation packages and are indexed in [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).

Do not create an architecture rule inside a module handbook when the rule applies to the whole application. Link the architecture handbook and the canonical standard instead.

## Implementation guidelines

### Choosing a location

- Put a new page in `artifacts/web/src/pages/` when it is a route-owned workflow.
- Put cross-page auth or impersonation behavior in the existing contexts only when it is genuinely global.
- Put a domain query or mutation in the existing frontend hook boundary when the current source is Firestore.
- Put a reusable primitive in the approved component structure after checking [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md).
- Put an API contract change in `lib/api-spec/openapi.yaml`, then regenerate and review generated packages.
- Put an API handler in `artifacts/api-server/src/routes/` and register it explicitly.
- Put a relational schema change in `lib/db/src/schema/` with migration and compatibility evidence.
- Put new product standards in the narrowest existing canonical handbook, not in an architecture document.

### Import direction

The preferred direction is:

```text
pages -> components / contexts / hooks / lib
api-client-react generated -> custom-fetch
api-zod generated -> OpenAPI-derived schemas
api-server routes -> api-zod / db
db -> schema
```

Avoid circular dependencies between pages and components, between generated code and application code, or between API route modules and frontend packages.

### Current-versus-target placement

The current web data path belongs in `artifacts/web/src/lib/hooks.ts` and Firebase helpers. The separate API path belongs in `artifacts/api-server` and `lib`, but its broader OpenAPI operations are not proof of mounted handlers. A migration must preserve a single named source of truth per object during rollout.

### Configuration and secrets

Runtime configuration belongs in the package or workflow conventions for the relevant artifact. Secrets must use the environment and secret-management process; never commit values into source, documentation, generated output, or analytics. `DATABASE_URL` is required by the Drizzle database entry point; Firebase and Cloudinary configuration is consumed by the web package according to its existing runtime setup.

## Accessibility considerations

Folder placement affects accessibility when it determines whether a shared contract is reused. Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md), and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md).

- Shared accessible behavior belongs in the approved component or pattern boundary, not in one page only.
- A responsive or mobile hook must not remove the semantic and keyboard behavior required by the component contract.
- Loading and error components must remain discoverable and consistent across lazy-loaded pages.
- Isolated mockups may explore presentation, but production accessibility evidence must be collected against the integrated web artifact.

## AI implementation notes

No folder currently establishes an AI runtime or model integration. If the AI Assistant is added, place reusable provider/client logic in an explicitly owned boundary, keep prompts and responses out of generic analytics or logs, and link the implementation to [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) and [modules/AI_Assistant.md](./modules/AI_Assistant.md).

Generated AI content, source citations, uncertainty, approvals, and write handoffs need explicit types and ownership. Do not hide AI behavior in a generic utility whose scope and safety contract cannot be reviewed.

## Review checklist

- [ ] The changed file is in the package that owns the behavior.
- [ ] The package's public boundary and import direction remain clear.
- [ ] Generated output was not hand-edited and contract changes include regeneration evidence.
- [ ] The source of truth is named for every new data or API boundary.
- [ ] Documentation changes are indexed and do not duplicate canonical standards.
- [ ] Secrets, credentials, private data, and environment-specific URLs are absent from committed files.
- [ ] Accessibility, responsive, security, AI, and recovery owners are linked where relevant.

## Validation checklist

- [ ] Workspace package scripts, type checks, builds, and generated-code checks pass for affected packages.
- [ ] Route registration and workflow configuration agree with the artifact being described.
- [ ] Cross-package imports do not introduce circular or forbidden dependencies.
- [ ] API contract, generated packages, handlers, and database schema are compared where applicable.
- [ ] Documentation links resolve and all architecture handbooks are reachable from the indexes.
- [ ] A file inventory confirms no application code or unapproved documentation was changed.
- [ ] Release evidence is recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)