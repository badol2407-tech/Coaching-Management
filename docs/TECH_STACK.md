---
title: EduTrack Technology Stack
purpose: Provide a source-linked overview of the languages, runtimes, frameworks, services, packages, and build boundaries used by EduTrack.
scope: Repository tooling, frontend, backend, persistence, identity, providers, generated contracts, delivery, and documentation.
audience: Contributors, reviewers, Product, Design, QA, Security, Reliability, Operations, and maintainers.
related_documents:
  - ./ENVIRONMENT_SETUP.md
  - ./FOLDER_STRUCTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./CI_CD_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a runtime, framework, provider, source-of-truth, or package-boundary change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active stack reference
last_updated: 2026-08-02
normative_level: Reference guidance subordinate to architecture, security, engineering, and deployment standards
canonical_terms: React, Vite, Firebase, Firestore, Express, OpenAPI, Zod, Drizzle, PostgreSQL, Organization, Workspace, source of truth
---

# EduTrack Technology Stack

## How to read this reference

This is a source-linked stack inventory, not a promise that every package or contract is active in every runtime. The repository currently contains a Firebase-first web path and a separately packaged Express/OpenAPI/Drizzle/PostgreSQL path. [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) and [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) own the current-versus-target boundary.

When this document differs from an implementation or package manifest, verify the source files and update the owning architecture handbook rather than silently treating package presence as runtime evidence.

## At a glance

| Layer | Technology | Repository boundary |
| --- | --- | --- |
| Workspace | pnpm workspaces | `pnpm-workspace.yaml`, root `package.json` |
| Runtime | Node.js 24 | Replit runtime configuration and package scripts |
| Language | TypeScript | Application, shared libraries, and scripts |
| Web | React, Vite, Wouter | `artifacts/web` |
| UI | Radix UI, Tailwind CSS, class-variance-authority, Lucide, React Icons | `artifacts/web` and the isolated mockup sandbox |
| Web state and motion | TanStack Query, Framer Motion | `artifacts/web` |
| Web data path | Firebase Auth and Firestore | Current web source of identity and domain data |
| Media | Cloudinary upload and deletion boundary | Web upload helper and `api/cloudinary-delete.js` |
| API | Express 5, CORS, cookie parsing, Pino logging | `artifacts/api-server` |
| API contract | OpenAPI and Orval-generated clients | `lib/api-spec`, `lib/api-client-react`, `lib/api-zod` |
| Validation | Zod and generated Zod schemas | `lib/api-zod` and service boundaries |
| Relational data | PostgreSQL and Drizzle ORM | `lib/db`, separate API path |
| Visualization and exports | Recharts and XLSX | Web reporting and export surfaces |
| Product analytics | PostHog client integration | Optional web analytics boundary |
| Delivery | Vercel-oriented static configuration and Replit-managed workflows | `vercel.json`, artifact configuration, `.replit` |
| Documentation | Markdown handbooks with YAML front matter | `docs/` |

## Repository tooling

- **Workspace orchestration:** pnpm workspaces manage `artifacts/*`, `lib/*`, integration libraries, and `scripts`.
- **Type checking:** TypeScript project references cover shared libraries; leaf packages use their package-specific typecheck command.
- **Build:** Vite builds the web artifact; the API uses its package build script and esbuild configuration; the root coordinates typecheck and package builds.
- **Package safety:** `pnpm-workspace.yaml` applies a minimum package release age and approved build settings. Do not disable those protections as a convenience.
- **Configuration:** package manifests, Vite configuration, artifact configuration, Firebase files, `vercel.json`, and workflow settings each own their relevant boundary.

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for file ownership and [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for setup and configuration names.

## Frontend stack

`artifacts/web` is the production web package:

- React and TypeScript provide component and application composition.
- Vite owns the development server, base path, aliases, allowed hosts, build output, and environment loading.
- Wouter owns client route composition.
- TanStack Query owns server/cache state at the frontend hook boundary.
- Radix UI primitives, Tailwind CSS, class-variance-authority, and the existing icon packages provide shared presentation and interaction.
- Framer Motion provides motion where the product contract permits it.
- Firebase Auth and Firestore are the active web identity and domain-data path.
- Cloudinary handles the current image-upload provider boundary; the application stores provider references in its domain data and uses a server-side deletion boundary for cleanup.
- Recharts and XLSX support existing reporting, visualization, and export surfaces.
- PostHog is an optional analytics boundary and does not replace product state, audit records, or operational monitoring.

Use [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md), [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md), and [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) for ownership and implementation rules.

## Backend and shared API stack

The repository also packages a separate backend path:

- Express mounts the API service and explicit route modules under `artifacts/api-server`.
- Pino and the request logger provide structured server logging.
- `lib/api-spec/openapi.yaml` is the contract source of truth.
- Orval generates the React Query client in `lib/api-client-react` and Zod schemas/types in `lib/api-zod`.
- Drizzle ORM and PostgreSQL provide the separate relational persistence boundary in `lib/db`.
- The implemented API route set is narrower than the contract. The current route evidence and source-of-truth distinction are maintained in [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md).

Do not import or activate the separate API path in a Firebase-backed web feature merely because a generated operation exists. A source-of-truth, authentication, authorization, migration, cache, error, and rollout decision is required first.

## Identity, data, and provider boundaries

- **Firebase Auth:** current web identity and session provider.
- **Firestore:** current Organization-scoped web domain data provider.
- **Realtime Database:** closed by checked-in rules and not an implicit cache, backup, or fallback.
- **Firebase Storage:** a distinct rules boundary; it must not be confused with Cloudinary.
- **Cloudinary:** current media provider boundary for the web image-upload helper.
- **PostgreSQL:** separate relational target path with Drizzle schema; package presence does not make it the web source of truth.

These services have different rules, credentials, failure behavior, and recovery requirements. Follow [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md), [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md), and [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) before moving data between them.

## Delivery and operations

- The web deployment configuration in `vercel.json` uses pnpm installation, the web build command, a static output directory, and an SPA rewrite.
- Replit artifact configuration supplies managed service workflows, ports, preview paths, and environment values for the artifact boundaries.
- Firebase rules and provider configuration require their own deployment and verification evidence.
- The repository does not currently evidence a complete checked-in CI pipeline or universal production monitoring. Treat target delivery architecture as target until a release record proves it.

Use [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md), [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md), [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md), and [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) for delivery and operational expectations.

## Choosing a technology boundary

Before adding a package, provider, framework, or service:

1. confirm the existing owner does not already solve the need;
2. name the source of truth and affected runtime;
3. evaluate security, privacy, accessibility, Organization and Workspace scope, performance, recovery, and maintenance impact;
4. record compatibility, licensing, package-lock, and deployment consequences;
5. update the owning architecture or decision document if the boundary changes.

Do not add a dependency to a generated package, production artifact, or root workspace only for convenience. Keep package ownership local and remove unused dependencies when the owning change retires.

## Stack validation checklist

- [ ] The technology is present in the package, configuration, or runtime boundary being described.
- [ ] Current web behavior is distinguished from the separate API/database target path.
- [ ] Identity, data, provider, generated-code, and deployment ownership are named.
- [ ] New packages or providers have security, privacy, accessibility, performance, recovery, and maintenance review.
- [ ] Runtime configuration and secrets remain in the approved environment boundary.
- [ ] Documentation changes are linked from the indexes and do not create a duplicate source of truth.

## References

- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)