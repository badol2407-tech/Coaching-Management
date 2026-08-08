---
title: EduTrack Permission Design
purpose: Define understandable, least-privilege, and auditable Permission experiences for Roles, users, Organizations, and Workspaces.
scope: Permission discovery, role assignment, scope, requests, denials, changes, delegation, confirmation, audit, and recovery.
audience: Product, Design, Engineering, Security, Privacy, Governance, QA, Operations, Accessibility, and AI implementation contributors.
related_documents:
  - ./INFORMATION_ARCHITECTURE.md
  - ./PRODUCT_GOVERNANCE.md
  - ./ENGINEERING_STANDARDS.md
  - ./SECURITY_UX.md
  - ./STATE_SYSTEM.md
  - ./ERROR_HANDLING.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a Permission incident, policy change, or new Enterprise Module
owner: Product Governance, Security, Privacy, Product, Design, and Engineering
version: 1.0.0
status: Binding security and product standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Permission, Role, Organization, Workspace, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Profile, Settings, AI Assistant
---

# EduTrack Permission Design

## Purpose

Permission design makes capability, scope, consequence, and accountability understandable. It protects Students, Teachers, Fees, Exams, Reports, Profiles, Notifications, Organizations, and AI Assistant actions while keeping legitimate work possible.

## Scope and ownership

This handbook owns the user-facing Permission model and change workflow. [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) owns enforcement at the data boundary; [SECURITY_UX.md](./SECURITY_UX.md) owns security communication; [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) owns authority and exceptions.

## Implementation principles

1. Use the canonical distinction: a Role is a named set of responsibilities and Permissions; a Permission is an allowed capability or scope.
2. Apply least privilege, explicit scope, separation of duties, and deny-by-default for sensitive operations.
3. Explain capability in user outcomes, not internal identifiers. State whether it affects view, create, edit, publish, export, assign, or administer.
4. Show Organization, Workspace, object, Role, time limit, and affected people before a Permission is granted, removed, or inherited.
5. Make consequential Permission changes deliberate, reviewable, auditable, and reversible where safe.

## Design standards

- Permission lists group related capabilities by object and outcome: Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, and AI Assistant.
- A Role summary states what the Role can do, where, for whom, and what it cannot do.
- Inherited, direct, temporary, and conditional Permissions are visually and textually distinct.
- Permission-denied states explain the unavailable action without confirming protected data; provide a request or support path when policy allows.
- Before Fee, Exam publication, Report export, Organization administration, Authentication policy, sensitive Profile, or AI mutation access changes, show consequence and required approval.
- Confirmation must identify actor, target, scope, effective time, expiration, audit behavior, and recovery.

## Engineering standards

- Enforce Permission and Organization/Workspace isolation at the data boundary and on every direct request.
- Prevent client-only hidden controls from being treated as authorization.
- Log actor, time, target, scope, before/after, source, approval, and result for consequential changes.
- Test revocation, inheritance, stale sessions, direct links, exports, cached data, bulk changes, and concurrent edits.
- Never expose Permission metadata or protected record existence through Search, Filters, Notifications, Reports, or AI context.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md). Permission controls have persistent labels, explicit states, keyboard access, readable scope, and non-color distinctions for inherited, disabled, pending, denied, and changed states.

## AI implementation notes

The AI Assistant may explain existing Permissions or draft a change for review. It must not grant, remove, infer, or escalate Permissions, and must not treat a natural-language request as authorization.

## Review checklist

- [ ] Role, Permission, object, scope, actor, consequence, and expiry are explicit.
- [ ] Least privilege, separation of duties, and approval requirements are reviewed.
- [ ] Denied, pending, changed, revoked, and failed states are distinct.
- [ ] Audit, privacy, security, accessibility, and recovery evidence is complete.
- [ ] AI Assistant behavior is constrained to explanation and authorized review.

## Validation checklist

- [ ] Direct access, deep-link, export, cached-data, and stale-session tests pass.
- [ ] Grant, remove, request, deny, expire, revoke, and rollback paths pass.
- [ ] Organization, Settings, Authentication, Fees, Exams, Reports, Profile, and AI Assistant examples pass.
- [ ] No protected-data disclosure occurs.
- [ ] Evidence is recorded under [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [SECURITY_UX.md](./SECURITY_UX.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)