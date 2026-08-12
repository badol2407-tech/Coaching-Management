---
title: EduTrack Authentication Architecture
purpose: Define the identity, session, profile, and authentication-provider boundaries used by EduTrack.
scope: Firebase Auth initialization, authentication state, Firestore profile resolution, Organization context, session persistence, sign-out, recovery handoffs, impersonation, and future API adoption.
audience: Engineering, Security, Privacy, Product, QA, Accessibility, Reliability, Operations, and contributors.
related_documents:
  - ./modules/Authentication.md
  - ./SECURITY_UX.md
  - ./PERMISSION_DESIGN.md
  - ./ENGINEERING_STANDARDS.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./DATA_FLOW_ARCHITECTURE.md
  - ./STATE_MANAGEMENT.md
  - ./AUTHORIZATION_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after an Authentication provider, session, profile, recovery, tenancy, or security change
owner: Security, Privacy, Engineering, Product, QA, and Reliability
version: 1.0.0
status: Active architecture handbook
last_updated: 2026-08-02
normative_level: Architecture guidance subordinate to binding Authentication, security, privacy, and engineering standards
canonical_terms: Authentication, session, Profile, Organization, Workspace, Role, Permission, user, impersonation, sign-out
---

# EduTrack Authentication Architecture

## Metadata

This handbook documents the authentication path currently implemented by the web product and the boundary required for future service adoption. It does not replace the user-facing Authentication contract in [modules/Authentication.md](./modules/Authentication.md), the security communication rules in [SECURITY_UX.md](./SECURITY_UX.md), or the enforcement requirements in [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md).

## Purpose

Authentication establishes the signed-in identity used to begin an EduTrack session. It is deliberately separate from authorization: a valid Firebase user does not by itself grant access to an Organization, Workspace, record, or action.

The architecture must make each transition reviewable:

```text
authentication provider
  -> Firebase Auth user
  -> Firestore user profile
  -> Organization and subscription snapshot
  -> route and layout context
  -> authorization and data-boundary checks
```

## Scope

### Included

- Firebase Auth initialization and the browser authentication listener.
- Credential and provider flows exposed by the web application.
- Firestore `users/{uid}` profile resolution.
- Organization identity and subscription context used by the web shell.
- Session persistence selection, sign-out, profile refresh, and session-expiry handoffs.
- Super-admin support impersonation as a temporary presentation context.
- The boundary required before the separate Express/OpenAPI service can authenticate browser or API consumers.

### Excluded

- Role and Permission policy, which is owned by [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md).
- User-facing copy, recovery states, and accessibility requirements, which are owned by the Authentication module and [SECURITY_UX.md](./SECURITY_UX.md).
- Firebase project administration or deployed rules configuration, which is documented in [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md).
- A claim that the separate API path is the active web authentication source.

## Ownership

| Concern | Owner | Responsibility |
| --- | --- | --- |
| Authentication provider | Engineering and Security | Configure the approved provider and keep provider state explicit. |
| Browser auth state | Frontend Engineering | Subscribe to provider state and expose loading, user, and sign-out behavior through `AuthContext`. |
| Profile and Organization context | Engineering and Security | Resolve the profile for the authenticated UID and preserve scope without trusting route or form input. |
| Authorization | Security and Backend Engineering | Evaluate Role, Permission, and object scope at the data boundary. |
| Recovery and session UX | Product, Security, Privacy, Accessibility, and Design | Apply the Authentication module and security communication standards. |
| Support impersonation | Security and Operations | Preserve the real actor, visible support context, audit, and reversible exit. |
| Future API authentication | Backend, API, Security, and Privacy | Select and document the service credential or session model before adoption. |

## Related documents

- [modules/Authentication.md](./modules/Authentication.md) owns sign-in, verification, recovery, session, sign-out, and security-state behavior.
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) owns post-authentication access evaluation and enforcement boundaries.
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) owns Firebase service boundaries and rules evidence.
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) owns frontend state ownership and cache implications.
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) owns the end-to-end identity and scope flow.

## Architecture principles

1. **Authentication is identity, not access.** The provider proves a user identity; downstream boundaries decide what that identity may access.
2. **The provider identity and application profile remain distinct.** Firebase `User` state and the Firestore application profile may have different availability, freshness, and failure states.
3. **Profile resolution is fail-closed.** A missing, invalid, or unavailable profile must not broaden access or silently create an elevated application identity.
4. **Organization context is derived, not selected as authority.** The active `orgId` comes from trusted profile resolution or a separately authorized context-selection flow.
5. **Support access is not a second session.** Impersonation changes the temporary application view while the real Firebase session and actor remain the super administrator's.
6. **Sign-out clears local support context before ending the provider session.** No target profile or protected view should remain available after sign-out.
7. **One source of truth is named at every adoption boundary.** The Firebase path and future API path must not silently compete for identity or profile state.

## Standards

### Current web authentication flow

The current web application initializes Firebase once and exports `auth` from `getAuth(app)`. `AuthContext` subscribes to `onAuthStateChanged`, exposes `user`, `userProfile`, and `loading`, and loads `users/{uid}` after a provider-authenticated user is observed.

The resolved application profile currently carries:

- Firebase UID, name, and email;
- one of `super_admin`, `org_admin`, `teacher`, or `student`;
- `orgId` and optional organization name;
- optional Student identity;
- temporary-password-change state; and
- an Organization subscription snapshot used by layout gating.

The profile and Organization document are application context. They are not a substitute for direct authorization on Firestore, an API, Storage, or another persistence boundary.

### Provider and session state

The landing authentication surface currently supports email/password sign-in, Google sign-in, password reset, and a remember-me choice. The browser selects Firebase local or session persistence for the email/password path. Authentication persistence is not a Permission decision and must not be treated as proof that a user may retain access after revocation.

`logout` resets analytics identity and the temporary profile override before calling Firebase `signOut`. A future session-management surface must follow the distinct sign-out, session-expiry, recovery, and revocation states in [modules/Authentication.md](./modules/Authentication.md).

### Profile and elevated-role gate

The current `AuthContext` applies two checks for the `super_admin` application role: the Firestore profile must identify the role, and the email must be in the application whitelist. A matching email alone does not create a profile. This is an implementation observation and a security-sensitive control; changing it requires an explicit security review and a move toward a server-controlled authorization source.

The whitelist is currently application code, not an independently managed policy service. It must never be described as the complete authorization model. All Organization and object access still requires the authorization boundary described in [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md).

### Support impersonation

`ImpersonationContext` writes an entry record, keeps the super administrator's Firebase session, applies a temporary profile override, and writes an exit record when support view ends. The target password is not exchanged. The support banner and the actor/target distinction are part of the safety contract.

Cache and query state must be isolated on entry and exit. Restoring the real profile alone is not evidence that target data has been removed from an in-memory cache; see [CACHING_STRATEGY.md](./CACHING_STRATEGY.md).

### Future API authentication boundary

The generated client has an optional bearer-token facility for configured API consumers, and its own documentation states that it is not a browser session-cookie substitute. Before the web application adopts the Express path, document:

- whether browser requests use a session, token, or another approved mechanism;
- token or session verification, expiry, refresh, revocation, and logout;
- how Firebase identity maps to the service identity;
- how Organization, Workspace, Role, and Permission context is resolved;
- how profile changes and provider changes reconcile; and
- how the Firebase-first path is rolled back without two active identity authorities.

No API route beyond the current health route is evidence of an implemented domain authentication flow.

## Implementation guidelines

### Authentication lifecycle

```text
initial
  -> provider loading
  -> unauthenticated
  -> provider authenticated / profile loading
  -> profile resolved / authorization context pending
  -> authenticated and scoped
  -> session expired, signed out, or profile unavailable
```

Keep provider loading, profile loading, missing profile, invalid profile, unauthorized, and service failure distinguishable. Route loading must not expose protected page content before the required identity and profile context is available.

### Deep links and return paths

An unauthenticated deep link may preserve a safe return destination, but the destination must be validated after authentication and authorization. Do not place credentials, recovery factors, tokens, or unnecessary sensitive data in the URL. After sign-out or revocation, browser history must not restore protected content as an active surface.

### Profile refresh

Profile refresh may update Organization name, subscription snapshot, Role, or other application context. A refresh must not silently preserve permissions that the refreshed profile no longer supports. Related query state and route access must be re-evaluated when identity or scope changes.

### Recovery and failure

Provider errors, missing profiles, expired sessions, network failures, and authorization failures remain separate states. Preserve safe form intent according to [modules/Authentication.md](./modules/Authentication.md), and never use a client fallback profile to make a protected page appear available.

## Accessibility considerations

Apply [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md), [modules/Authentication.md](./modules/Authentication.md), and [SECURITY_UX.md](./SECURITY_UX.md).

- Auth loading, profile loading, expiry, error, and sign-out transitions expose meaningful status.
- Focus and safe input are preserved through provider, profile, recovery, and session transitions.
- Role, Organization, Workspace, and impersonation context are visible to assistive technology where the user is authorized to see them.
- Masking, persistence, sign-out, and recovery controls have labels and consequences that do not depend on color, timing, or hover.

## AI implementation notes

No AI authentication implementation exists. The AI Assistant must not receive credentials, recovery factors, session tokens, raw authentication telemetry, or unnecessary identity data. It cannot authenticate a user, resolve suspicious activity, grant access, or choose a recovery outcome. Any future explanation of an auth error must use the canonical error and recovery owners.

## Review checklist

- [ ] Provider identity, application profile, Organization context, Role, Permission, and source of truth are separately named.
- [ ] Provider loading, profile loading, missing profile, expiry, sign-out, recovery, unauthorized, and service-failure paths are distinct.
- [ ] No client-controlled route, query, form, or cache value establishes access.
- [ ] Super-admin support access preserves actor identity, target context, audit, visible indication, and reversible exit.
- [ ] Query and local state are isolated when identity, Organization, Role, or impersonation changes.
- [ ] Any API adoption names the authentication mechanism, verification, refresh, revocation, migration, and rollback behavior.
- [ ] Security, privacy, accessibility, performance, and incident evidence is linked through [QUALITY_GATES.md](./QUALITY_GATES.md).

## Validation checklist

- [ ] Auth listener behavior is tested for initial loading, sign-in, sign-out, profile absence, malformed profile, network failure, and refresh.
- [ ] Direct protected navigation is tested before and after profile resolution, revocation, expiry, and sign-out.
- [ ] Return destinations, recovery paths, copied links, and browser history do not disclose protected content.
- [ ] Impersonation entry, target-data isolation, exit, reload, failure, and sign-out are tested.
- [ ] Provider and profile errors do not enumerate accounts or reveal secrets.
- [ ] Representative keyboard, screen-reader, zoom, mobile, localization, reduced-motion, and slow-network evidence is recorded.
- [ ] Evidence, known gaps, owners, mitigations, and exceptions are recorded under [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [modules/Authentication.md](./modules/Authentication.md)
- [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [SECURITY_UX.md](./SECURITY_UX.md)
- [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md)
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md)
- [CACHING_STRATEGY.md](./CACHING_STRATEGY.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)