# EduTrack Product Governance

**Status:** Normative decision and change-control standard  
**Owner:** Product Governance Council  

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