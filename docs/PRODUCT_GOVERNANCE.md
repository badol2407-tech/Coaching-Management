---
title: EduTrack Product Governance
purpose: Define decision authority, documentation governance, change control, and release evidence.
scope: Product decisions, standards precedence, proposals, authorities, exceptions, release gates, versions, and reviews.
audience: Product, Design, Engineering, Security, Privacy, AI Governance, Operations, QA, and reviewers.
related_documents:
  - ./PRODUCT_CONSTITUTION.md
  - ./DECISION_LOG.md
  - ./REVIEW_CHECKLISTS.md
  - ./ENGINEERING_STANDARDS.md
review_frequency: Quarterly and after a material incident, policy, or governance change
owner: Product Governance Council
version: 1.0.0
status: Normative decision and change-control standard
last_updated: 2026-08-01
normative_level: Binding governance standard
canonical_terms: Organization, Workspace, Role, Permission, Enterprise Module, exception, evidence, owner, expiry
---

# EduTrack Product Governance

Governance keeps EduTrack coherent as modules, roles, data, AI, integrations, and organizations grow. It makes decisions traceable without turning the product into bureaucracy.

## Decision order

When standards conflict, decide in this order:

1. Accessibility
2. User safety
3. User control
4. Trust
5. Clarity
6. Performance
7. Convenience

The decision record must state the conflict, affected roles, data, risk, evidence, and why the chosen option preserves the higher priority.

## Documentation authority and precedence

The documentation system uses the following authority order:

1. [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) — product beliefs and non-negotiable principles.
2. This handbook — decision authority, exceptions, lifecycle, and change control.
3. Release-gate standards — [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md), [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), and [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md).
4. Domain, interaction, design-system, content, and review handbooks — implementation guidance within the higher-level constraints.
5. [GESTALT_PRINCIPLES.md](./GESTALT_PRINCIPLES.md), [USABILITY_HEURISTICS.md](./USABILITY_HEURISTICS.md), and [UX_LAWS.md](./UX_LAWS.md) — explanatory or review guidance; they do not override a release gate.

When two documents describe the same rule, the owner named in the higher document is the source of truth. Lower-level documents should link to that rule rather than restate a competing threshold.

## Documentation change record

Documentation changes must identify the affected standard, owner, version, date, rationale, evidence, and related implementation changes. Use [DECISION_LOG.md](./DECISION_LOG.md) for durable decisions and [CHANGELOG.md](./CHANGELOG.md) for dated evolution. A documentation exception must have a reason, affected users, safer alternative, owner, approval, and expiry.

## Required proposal record

Any new module, major interaction, data field, AI behavior, notification, export, permission, or integration must document:

- user and organizational problem;
- affected Students, Teachers, administrators, and roles;
- object and scope;
- privacy, safety, fairness, and accessibility impact;
- Dashboard, Search, Filters, mobile, Reports, Analytics, and Notification implications;
- source of truth and audit behavior;
- success and failure measures;
- rollout, rollback, and deprecation plan.

## Review authorities

- **Product:** purpose, priority, outcomes, and user value.
- **Design:** information architecture, interaction, copy, visual system, and accessibility.
- **Engineering:** contracts, performance, reliability, maintainability, and recovery.
- **Security and privacy:** Authentication, authorization, tenancy, data minimization, exports, and retention.
- **AI governance:** model use, evaluation, human review, uncertainty, and harmful failure modes.
- **Operations or organization representatives:** workflow fit, training, and change impact.

## Release gates

No release is complete until required checklist items pass, evidence is linked, known exceptions have owners and expiry, and monitoring is ready. High-impact changes include Fee collection, Exam publishing, Report exports, Organization permissions, Authentication, sensitive Profile data, and AI-assisted decisions.

## Evolution

New enterprise modules must reuse canonical terms, semantic tokens, component contracts, navigation rules, authorization model, audit requirements, and review checklists. Breaking changes require migration guidance and communication before rollout.

## Governance measures

- Decisions have an owner, date, rationale, evidence, and review trigger.
- Exceptions expire rather than becoming permanent hidden standards.
- Incidents and user evidence can trigger a standard update.
- Documentation changes are reviewed with the product or engineering change they govern.

See [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md), [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), and [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md).