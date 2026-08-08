---
title: EduTrack Routing Architecture
purpose: Define route ownership, authentication gates, Role-specific layouts, deep-link behavior, and navigation boundaries for the EduTrack web product.
scope: Wouter route composition, public routes, authenticated Role routes, impersonated views, lazy loading, base paths, redirects, and layout navigation.
audience: Product, Product Design, Engineering, Accessibility, Security, QA, Operations, and contributors.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./NAVIGATION_STANDARDS.md
  - ./PERMISSION_DESIGN.md
  - ./SECURITY_UX.md
  - ./STATE_SYSTEM.md
  - ./LOADING_STATES.md
  - ./ERROR_HANDLING.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./MOBILE_UX_GUIDE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a route, Role, layout, authentication, or deep-link behavior change
owner: Engineering, Product, Product Design, Accessibility, and Security
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-01
normative_level: Architecture guidance subordinate to binding standards
canonical_terms: Sidebar, Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Role, Permission, Workspace
---

# EduTrack Routing Architecture

## Metadata

This handbook describes the route tree implemented in `artifacts/web/src/App.tsx` and the layout navigation that surrounds it. It applies the binding navigation, information architecture, Permission, security, accessibility, and state standards; it does not create competing route or authorization policy.

## Purpose

Routing is the boundary between a user's current URL, authenticated identity, Role, Organization or Workspace scope, and the page workflow they are allowed to perform. The route architecture must make those boundaries predictable for direct links, browser navigation, mobile navigation, support access, and failure recovery.

## Scope

### Included

- Wouter router and artifact base-path configuration.
- Public routes and the authenticated route gate.
- `super_admin`, `org_admin`, `teacher`, and `student` route families.
- Role-specific layouts and Sidebar ownership.
- Super-admin impersonation route rendering.
- Lazy-loaded pages, Suspense fallback, redirects, and route-level recovery.

### Excluded

- The canonical meaning of product objects, Roles, or Permissions owned by [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md).
- UI component contracts owned by [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md).
- Backend authorization implementation; route visibility is not a substitute for data-boundary authorization.

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Route tree and page registration | Engineering | Keep path ownership, lazy imports, and fallback behavior explicit. |
| Product destinations and hierarchy | Product and Product Design | Ensure routes reflect canonical objects, tasks, scope, and Role. |
| Authentication and Role gates | Engineering and Security | Resolve identity and Role before protected route content is exposed. |
| Sidebar and deep-link behavior | Product Design, Accessibility, and Engineering | Preserve location, safe exits, keyboard operation, and responsive behavior. |
| Impersonation | Security and Engineering | Preserve actor identity, visible support state, audit logging, and exit behavior. |
| Route validation | QA, Accessibility, and Security | Test direct links, redirects, negative paths, and representative Role journeys. |

## Related documents

- [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) owns route, Sidebar, deep-link, location, and safe-exit rules.
- [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) owns destinations, objects, Roles, scopes, and hierarchy.
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [SECURITY_UX.md](./SECURITY_UX.md) own authorization and security communication.
- [STATE_SYSTEM.md](./STATE_SYSTEM.md), [LOADING_STATES.md](./LOADING_STATES.md), and [ERROR_HANDLING.md](./ERROR_HANDLING.md) own route transition and failure states.
- [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md), and [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) own cross-viewport and accessible navigation behavior.

## Architecture principles

1. **Public and protected routes are separate families.** A public route must not accidentally render authenticated content; a protected route must pass the authenticated flow.
2. **Authentication precedes Role routing.** The route tree resolves Firebase Auth state, profile state, required password changes, impersonation state, and Role before selecting a protected layout.
3. **Layouts own navigation, not authorization alone.** A hidden Sidebar item does not secure data; the data boundary must enforce authorization independently.
4. **Every path has one destination owner.** Similar workflows may share a page or component, but route ownership and canonical destination naming remain clear.
5. **Deep links fail safely.** Unknown or disallowed paths redirect or present an approved error without revealing protected object existence.
6. **Support access is visibly different from ordinary access.** Impersonation preserves the super-admin session, displays a persistent banner, writes audit entries, and has an explicit exit.
7. **Lazy loading is a state transition.** Suspense fallback, focus, announcements, and recovery are part of navigation quality.
8. **Base paths are runtime configuration.** Browser-visible URLs must work under the artifact's configured base path rather than assuming `/`.

## Standards

### Route pipeline

```text
Wouter base path
  -> public route match
  -> AuthProvider
  -> ImpersonationProvider
  -> Firebase auth loading
  -> unauthenticated LandingPage
  -> missing profile Setup
  -> mustChangePassword ForceChangePassword
  -> super_admin / org_admin / teacher / student layout
  -> Role-specific route match
  -> fallback redirect
```

`App.tsx` applies public routes for payment success/failure, privacy, terms, refund, FAQ, and organization joining. Other routes enter `AuthenticatedRoutes`.

### Current route families

| Route family | Layout | Representative paths |
| --- | --- | --- |
| Public | No protected layout | `/payment/success`, `/payment/fail`, `/privacy`, `/terms`, `/refund`, `/faq`, `/join/:code/:role?` |
| Super admin | `SuperAdminLayout` | `/`, `/operations/organizations`, `/operations/users`, `/operations/org-admins`, `/operations/teachers`, `/operations/students`, `/operations/activity`, `/operations/access-portal`, `/billing/pricing`, `/billing/subscriptions`, `/billing/paid-unpaid`, `/billing/free-trial`, `/billing/revenue`, `/billing/history`, `/marketing/landing`, `/marketing/popups`, `/marketing/testimonials`, `/marketing/coupons`, `/marketing/referrals`, `/marketing/analytics`, `/marketing/campaigns` |
| Organization admin | `AppLayout` | `/`, `/students`, `/students/add`, `/students/:id`, `/teachers`, `/classes`, `/routine`, `/attendance`, `/fees`, `/exams`, `/notices`, `/homework`, `/expenses`, `/settings`, `/subscription`, `/help`, `/id-cards`, `/reports` |
| Teacher | `TeacherLayout` | `/`, `/attendance`, `/students`, `/exams`, `/routine`, `/notices`, `/homework`, `/settings`, `/id-cards` |
| Student | `StudentLayout` | `/` with portal tab state for the current Student experience |

The same URL can be owned by different Role layouts with different page implementations. This is intentional and must remain explicit in route reviews.

### Current authentication and Role gates

`AuthContext` listens to Firebase Auth, loads `users/{uid}`, resolves the Organization profile and subscription snapshot, and rejects an unapproved stored `super_admin` role. `App.tsx` handles loading, missing profile, forced password change, Role selection, and fallback redirects. Layouts may apply subscription access gating for non-super-admin users.

These client gates are navigation behavior, not the complete authorization boundary. Firestore rules or an API service must independently enforce the same scope and Permission.

## Implementation guidelines

### Adding a route

Before adding a route:

1. Identify the canonical destination and Role ownership.
2. Confirm whether the destination is public, authenticated, or support-only.
3. Select the owning layout and page module.
4. Add a lazy import and route entry in the appropriate family.
5. Add Sidebar navigation only where the destination is part of that Role's primary work.
6. Define unknown path, unauthorized, loading, and direct-link behavior.
7. Test the route under the artifact base path and representative viewport sizes.

### Path and URL state

Use path parameters for record identity when the existing route family uses them, such as `/students/:id`. Use query parameters for view state where the current product already does so, such as the Student portal's `tab` value. Query state must remain serializable, scoped, understandable, and recoverable according to [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md).

Do not place secrets, access tokens, or unnecessary sensitive Profile data in URLs. Avoid using a URL alone to establish Organization scope.

### Layout boundaries

`AppLayout`, `TeacherLayout`, `StudentLayout`, and `SuperAdminLayout` own shell composition, navigation, mobile drawer behavior, user identity, logout, and selected access gates. Pages own domain content. Keep cross-layout navigation conventions aligned without forcing unrelated Role destinations into one shared menu.

### Impersonation

`ImpersonationContext` writes entry and exit records to Firestore, overrides the effective profile for rendering, keeps the real super-admin session, and restores the real profile on exit. Any route added to an impersonated Role family must be reviewed for:

- whether the target Role should see it;
- whether the page's hooks use the overridden Organization profile safely;
- whether the persistent impersonation banner remains visible;
- whether exit behavior remains available;
- whether audit and privacy requirements are satisfied.

### Redirects and not-found behavior

Role route families currently use a catch-all redirect to `/`. New routes must not use broad redirects to mask an authorization or implementation error. If a user has a valid route but lacks access, use the approved unauthorized state; if the path is unknown, use the approved not-found or safe redirect behavior.

### Lazy loading and route transitions

Pages are lazy-loaded with `Suspense`. The fallback must be stable, perceivable, and compatible with focus and screen-reader expectations. A route transition must not silently discard safe form input or query state, and a failed module load must have an explicit recovery path.

## Accessibility considerations

Follow [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md), and the Sidebar component handbook.

- Each layout exposes a named navigation region and accessible drawer open/close controls.
- Current route and expanded navigation state are conveyed without color alone.
- Mobile drawer focus, backdrop dismissal, escape behavior, and return focus are tested.
- Route changes and lazy fallback states do not create focus loss or an inaccessible loading dead end.
- Redirects and authorization failures explain the resulting location and available next action.
- Long route labels, translated content, zoom, text enlargement, keyboard navigation, and reduced motion are tested.

## AI implementation notes

No AI route is currently implemented. If the AI Assistant receives a dedicated route, it must be clearly identified as assistive, respect the user's Organization and Role scope, and follow [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) and [modules/AI_Assistant.md](./modules/AI_Assistant.md).

Do not make AI suggestions look like ordinary source-record pages or route generated actions directly to consequential writes without a review step.

## Review checklist

- [ ] The route has one canonical destination owner and an explicit Role/layout family.
- [ ] Public, authenticated, missing-profile, forced-password, subscription, unauthorized, and unknown-path behavior is defined.
- [ ] Direct links cannot bypass data-boundary authorization or reveal protected object existence.
- [ ] Sidebar, breadcrumbs, tabs, query state, browser back, and mobile drawer behavior follow the navigation owner.
- [ ] Lazy loading, focus, announcements, errors, and recovery are tested.
- [ ] Impersonation visibility, audit, and exit behavior remain intact where applicable.
- [ ] Base-path and deployment-preview behavior are verified.

## Validation checklist

- [ ] Every registered route resolves to an existing page or explicit route component.
- [ ] Every lazy page has a Suspense fallback and failure recovery.
- [ ] Each Role family is tested while authenticated as that Role and through a direct deep link.
- [ ] Unknown and disallowed paths fail safely without widening scope.
- [ ] Mobile navigation, keyboard navigation, screen reader landmarks, zoom, and reduced motion are validated.
- [ ] Route changes do not introduce undocumented API or Firestore data paths.
- [ ] Evidence and exceptions are recorded through [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md)
- [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)