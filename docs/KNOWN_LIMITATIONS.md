---
title: EduTrack Known Limitations
purpose: Maintain a source-linked register of current limitations, evidence gaps, user impact, mitigations, and follow-up ownership.
scope: Current architecture, runtime, data, security, deployment, automation, monitoring, recovery, support, and documentation limitations.
audience: Product, Engineering, Security, Privacy, QA, Reliability, Operations, Support, Governance, and contributors.
related_documents:
  - ./DOCUMENTATION_MAP.md
  - ./TECH_STACK.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./API_LAYER_ARCHITECTURE.md
  - ./DATABASE_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
  - ./AUTOMATION_GUIDE.md
  - ./MONITORING_AND_LOGGING.md
  - ./OBSERVABILITY.md
  - ./DISASTER_RECOVERY.md
  - ./SUPPORT_PLAYBOOK.md
  - ./ROADMAP.md
  - ./IMPLEMENTATION_ROADMAP.md
review_frequency: Quarterly and after a material architecture, deployment, security, incident, recovery, or source-of-truth change
owner: Product Governance, Engineering, Security, Privacy, Reliability, Operations, QA, and Product
version: 1.0.0
status: Active current-state register
last_updated: 2026-08-02
normative_level: Current-state reference subordinate to the owning architecture, security, engineering, and governance documents
canonical_terms: limitation, evidence gap, current state, target state, impact, mitigation, owner, follow-up
---

# EduTrack Known Limitations

## Purpose and authority

This register summarizes limitations already described by canonical handbooks so contributors can make safe decisions. The owning architecture or governance document remains authoritative. A limitation is not a defect claim unless the referenced evidence supports it, and a target capability is not current merely because it appears in a roadmap or package.

## Current limitations

| Area | Current limitation or evidence gap | Safe interpretation | Follow-up owner |
| --- | --- | --- | --- |
| Web and service paths | The Firebase-first web path and separate Express/OpenAPI/Drizzle/PostgreSQL path are distinct. | Do not assume the API or relational schema serves the active web product. | Engineering and Product Governance |
| Firebase enforcement | Repository evidence does not establish every deployed Firestore rule or provider control. | Obtain and test deployed enforcement at the receiving boundary. | Backend, Security, and Firebase owner |
| API behavior | The separate API service and broader contract are not interchangeable evidence of domain behavior. | Verify mounted routes, consumers, authorization, and persistence before claiming capability. | Backend and API owners |
| Production environments | A dedicated staging environment or environment approval path is not assumed without release evidence. | Keep local, preview, and production claims separate. | Engineering and Operations |
| Automation | Repository documentation does not prove a complete formal test runner or checked-in CI workflow for every required check. | Report actual commands and evidence; do not claim enforcement from guidance alone. | Engineering and Developer Experience |
| Monitoring | Complete production log aggregation, tracing, alert routing, dashboards, and retention configuration are not assumed from source presence. | Treat operational readiness as an evidence item. | Reliability and Operations |
| Recovery | A tested production restore, failover configuration, backup schedule, or recovery execution is not assumed without evidence. | Do not claim disaster readiness from a backup package or process restart. | Reliability, Data, and Operations |
| Source migration | Firebase and PostgreSQL migration or cutover is not implied by the existence of both paths. | Require an approved source-of-truth decision, compatibility, reconciliation, and recovery plan. | Engineering, Data, Security, and Governance |
| Support access | Support or impersonation authority is not created by a UI path or documentation entry. | Use approved, scoped, attributable access and record the action. | Support, Security, and Product Governance |
| Documentation | A handbook or map entry is not evidence that the corresponding runtime control exists. | Validate source, environment, ownership, links, and current behavior separately. | Documentation owners |

## How to use the register

- Link a limitation when it changes implementation, testing, release, support, or recovery decisions.
- Record evidence, affected scope, safe workaround, owner, next review, and whether the limitation is accepted, mitigated, blocked, or under investigation.
- Update this register when the canonical owner changes the current-state claim.
- Remove or reclassify an entry only after the owning document and evidence are updated.
- Do not use this register to create a new threshold, priority model, support promise, or release exception.

## Decision and communication

Limitations that affect user safety, security, privacy, data integrity, accessibility, recovery, or release readiness must be surfaced through the applicable [QUALITY_GATES.md](./QUALITY_GATES.md), [CHANGE_MANAGEMENT.md](./CHANGE_MANAGEMENT.md), [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md), or support path. Communicate uncertainty and safe user action rather than implying completion.

## References

- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)
- [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md)
- [OBSERVABILITY.md](./OBSERVABILITY.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)
- [SUPPORT_PLAYBOOK.md](./SUPPORT_PLAYBOOK.md)
- [ROADMAP.md](./ROADMAP.md)
- [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)
