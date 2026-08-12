---
title: EduTrack Frontend Architecture
purpose: Define the implemented frontend composition, runtime boundaries, and evolution guidance for the EduTrack web product.
scope: React and Vite application structure, providers, layouts, pages, shared UI, client data access, build/runtime boundaries, and frontend quality responsibilities.
audience: Product, Design, Engineering, Security, Privacy, Accessibility, QA, Operations, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./NAVIGATION_STANDARDS.md
  - ./STATE_SYSTEM.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./AI_UX_GUIDELINES.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./MOBILE_UX_GUIDE.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a frontend framework, authentication, data-boundary, or build change
owner: Engineering, Product Design, Accessibility, Security, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding standards
canonical_terms: Organization, Workspace, Role, Permission, Sidebar, Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Profile, Settings, AI Assistant
---

# EduTrack Frontend Architecture

## Metadata

This handbook defines the frontend architecture currently implemented by the EduTrack web product and the constraints for evolving it. It is subordinate to the governance, engineering, accessibility, interaction, navigation, state, security, and AI handbooks listed above. It describes architecture boundaries; those canonical handbooks remain the source of truth for product behavior and release requirements.

## Purpose

The frontend is the role-aware product surface through which authorized users work with an Organization or Workspace. This document makes the composition of that surface explicit so that new features preserve route ownership, data scope, state behavior, accessibility, and recoverability.

The current web application is `artifacts/web`: a React 18 and Vite application written in TypeScript. It uses Wouter for client routing, TanStack Query for server/cache state, Firebase Auth and Firestore for the active web data path, Radix-based UI components and Tailwind styling for shared presentation, and Framer Motion where motion is used. Cloudinary is used by the image-upload helper for media upload.

## Scope

### Included

- The `artifacts/web` application entry point and provider composition.
- Public, authenticated, role-specific, and impersonated route surfaces.
- Layout ownership for `super_admin`, `org_admin`, `teacher`, and `student`.
- Page modules, shared components, hooks, contexts, utilities, and Firebase access helpers.
- TanStack Query cache ownership and query invalidation as used by frontend hooks.
- Vite base-path, port, alias, build, and preview boundaries.
- Frontend responsibilities when the separate API contract is adopted in a future data path.

### Excluded

- Product vocabulary, role definitions, or Permission policy owned by [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) and [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md).
- Visual token values, primitive component contracts, or accessibility thresholds owned by the design-system and accessibility handbooks.
- Firestore rules, Firebase project administration, PostgreSQL migrations, or server deployment procedures.
- Treating the separate Express/OpenAPI/Drizzle service as if it were already the web application's source of truth.

## Ownership

| Concern | Primary owner | Frontend responsibility |
| --- | --- | --- |
| Application composition and runtime boundaries | Engineering | Keep providers, routing, layouts, and data adapters explicit and reviewable. |
| Product structure and destination ownership | Product and Product Design | Keep pages aligned to canonical objects, tasks, scope, and Role. |
| Accessible operation | Accessibility and Engineering | Implement the canonical accessibility requirements and provide evidence. |
| Organization and Role scope | Security, Product, and Engineering | Preserve scope at route, hook, cache, mutation, and rendered-data boundaries. |
| Shared UI contracts | Product Design and Engineering | Reuse approved components and preserve their state and interaction contracts. |
| Reliability and release evidence | Engineering, QA, and Reliability | Test loading, error, stale, offline, duplicate, authorization, and responsive paths. |

## Related documents

- Use [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) for canonical objects, Roles, scopes, and hierarchy.
- Use [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) for Sidebar, route, deep-link, and safe-exit behavior.
- Use [STATE_SYSTEM.md](./STATE_SYSTEM.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), and [EMPTY_STATES.md](./EMPTY_STATES.md) for user-visible state behavior.
- Use [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) and [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) for shared UI contracts.
- Use [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), and [QUALITY_GATES.md](./QUALITY_GATES.md) for binding implementation and evidence requirements.

## Architecture principles

1. **Composition is explicit.** Providers, route ownership, layouts, contexts, and data access are visible in the application composition rather than hidden in page-level conventions.
2. **Role and scope precede presentation.** A page is reachable only through the authenticated and Role-aware route flow, and data hooks derive Organization scope from the authenticated profile.
3. **The frontend consumes contracts, not storage accidents.** Firestore document fields, API schemas, and page view models are separate concerns even when the current implementation maps them in one hook.
4. **The active source of truth is named.** The current web data path is direct Firebase access. The separate OpenAPI path is a contract and service boundary, not an implicit fallback.
5. **Shared behavior belongs in the narrowest reusable layer.** Cross-page auth and impersonation belong in contexts; cache behavior belongs in query hooks; reusable visual behavior belongs in components; domain composition belongs in pages.
6. **Failure remains visible and recoverable.** Loading, stale, unauthorized, empty, conflict, and service-failure states are part of the frontend contract.
7. **Accessibility is architectural.** Route transitions, lazy loading, mobile drawers, layouts, forms, tables, dialogs, and status announcements must preserve the canonical accessibility contract.
8. **AI remains assistive.** No frontend architecture may make generated content look authoritative or allow unreviewed consequential changes.

## Standards

### Binding standards

The following documents own the rules that this architecture consumes:

| Concern | Canonical owner |
| --- | --- |
| Governance and precedence | [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) |
| Technical correctness, security, tenancy, reliability, and testing | [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) |
| Product objects, Roles, Permissions, and scope | [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) and [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) |
| Routes, deep links, Sidebar, and safe exits | [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) |
| Lifecycle and interaction state | [STATE_SYSTEM.md](./STATE_SYSTEM.md) and [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) |
| Accessibility and evidence | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) |
| Responsive and small-screen behavior | [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md) |
| Shared components and visual expression | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) and [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) |
| AI disclosure, uncertainty, and control | [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) |

### Architecture-specific rules

- A page must have one owning route family and one owning Role/layout contract.
- A query or mutation must make its scope input and cache identity reviewable; it must not broaden results when the Organization or Role context is missing.
- A feature that reads or writes a new domain collection must document its source of truth, scope, query key, mutation invalidation, error behavior, and migration path.
- A feature must not introduce a second cross-cutting context when an existing provider already owns the concern.
- A future API-backed feature must not silently mix API responses and Firestore responses for the same object without an explicit adapter and freshness contract.

## Implementation guidelines

### Current application composition

`artifacts/web/src/main.tsx` mounts the React root and initializes optional PostHog analytics without blocking the first render. `artifacts/web/src/App.tsx` composes the following runtime layers:

1. `ErrorBoundary` contains unrecoverable render failures.
2. `QueryClientProvider` supplies the TanStack Query client with conservative defaults currently configured in `App.tsx`.
3. `TooltipProvider` supplies shared tooltip behavior.
4. Wouter's router uses the Vite `BASE_URL` as its base path.
5. `AuthProvider` resolves Firebase Auth state and the Firestore user profile.
6. `ImpersonationProvider` provides the super-admin support view state.
7. Public or authenticated route composition selects the correct page and layout.
8. `Toaster` provides point-of-action feedback.

Keep provider order intentional. A provider may consume only providers above it, and a new provider must state why its concern cannot remain local to a page, hook, or component.

### Route and layout ownership

The route tree is described in [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md). The four principal layouts are:

- `SuperAdminLayout` owns the super-admin console navigation and operations, billing, and marketing groups.
- `AppLayout` owns the Organization administrator workspace.
- `TeacherLayout` owns the Teacher workspace.
- `StudentLayout` owns the Student portal.

Layouts provide navigation, responsive shell behavior, identity, logout, and in some cases subscription gating. They should not become domain data stores or accumulate page-specific business rules.

### Page and component boundaries

Pages under `artifacts/web/src/pages/` compose domain workflows. Shared components under `artifacts/web/src/components/` provide reusable presentation and interaction. A page may coordinate multiple hooks and components, but it should not duplicate provider-level authentication or Organization path construction.

Use the approved component handbooks before creating a new primitive. A new feature-specific component should state its owner, supported states, accessible name and focus behavior, responsive behavior, and recovery path.

### Data access boundary

The active web pattern is:

```text
page -> domain hook in artifacts/web/src/lib -> Firebase Auth-derived profile -> Firestore/Cloudinary
                                      -> TanStack Query cache
```

`hooks.ts` provides `orgCol` and `orgDocRef` helpers for paths under `organizations/{orgId}/{collection}`. Hooks derive `orgId` from `useAuth().userProfile`, use query keys beginning with the scope, and invalidate related keys after mutations. Preserve this pattern for current Firebase-backed work.

The generated API client under `lib/api-client-react` is a separate capability. Do not import it into a Firebase-backed page merely because a generated operation exists. A migration to the API path requires an explicit source-of-truth decision, adapter, authorization contract, error mapping, cache strategy, and rollout evidence.

### Build and runtime boundary

`artifacts/web/vite.config.ts` owns the frontend base path, port, aliases, build output, allowed hosts, and Replit integration. Browser-visible URLs must respect the artifact base path. Services must bind to the configured `PORT`; frontend code must not hardcode a development domain or localhost endpoint.

### Observability

The analytics wrapper in `artifacts/web/src/lib/analytics.ts` centralizes identity and product event calls. Analytics must not become a source of truth for product state, expose sensitive data, or replace audit records. Follow the privacy and security owners before adding event properties.

### Current gaps and target guidance

The current implementation has direct Firestore reads and writes in frontend hooks, client-side filtering in several list and summary hooks, and a separate API service that currently serves health only. Target architecture should move only deliberately selected server-side responsibilities to the API boundary; it must not imply that undocumented API routes or tenant guarantees already exist.

## Accessibility considerations

The frontend architecture must preserve the requirements in [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and the evidence process in [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md).

- Lazy-loaded pages need an understandable loading state and must not strand focus during route changes.
- Layouts, mobile drawers, expand/collapse controls, and role-specific Sidebars need semantic names, keyboard operation, visible state, and safe focus return.
- Route and query state must remain understandable without color, hover, motion, or pointer-only interaction.
- Error, empty, stale, pending, and unauthorized states must be exposed through the approved feedback and announcement patterns.
- Responsive transformations must preserve identity, scope, status, action access, and recovery on small screens and at increased text size.

## AI implementation notes

No AI implementation code is part of the current frontend runtime. If an AI Assistant is added, it must use [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) and the AI Assistant module specification rather than inventing a frontend-specific policy.

The architecture must keep generated content separate from source records, show source scope and freshness, expose uncertainty and limitations, and require explicit human review before consequential actions. AI requests must inherit the authenticated Organization and Role scope, minimize sent data, and remain observable without logging sensitive prompts or responses.

## Review checklist

- [ ] The change identifies its owning route family, layout, Role, Organization or Workspace scope, and source of truth.
- [ ] Provider, context, hook, page, component, and utility responsibilities remain appropriately separated.
- [ ] Existing canonical navigation, state, accessibility, responsive, security, and AI standards are linked rather than duplicated.
- [ ] Loading, empty, error, stale, pending, unauthorized, duplicate, and recovery behavior is specified.
- [ ] Query keys, mutation invalidation, direct deep links, and cache scope are reviewed.
- [ ] Any API-bound change distinguishes the active Firebase path from the separate OpenAPI service path.
- [ ] Analytics additions respect privacy, do not replace audit records, and include a removal or review owner.
- [ ] Release evidence is recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Type-check, build, and route checks pass for the affected frontend package.
- [ ] Representative Role paths are tested for direct navigation, unauthorized access, subscription gating where applicable, and impersonation exit.
- [ ] Firestore reads and writes are verified to use the authenticated Organization scope and expected query keys.
- [ ] Mutation retry, duplicate submission, stale cache, network failure, and service failure behavior is verified.
- [ ] Keyboard, screen reader, zoom, responsive, mobile drawer, reduced-motion, and localization evidence is attached.
- [ ] No undocumented API route, client fallback, or fabricated state is presented as implemented behavior.
- [ ] Reviewers can trace the implementation to the relevant source files without changing canonical standards.

## References

- [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
- [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md)