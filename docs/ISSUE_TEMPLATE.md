---
title: EduTrack Issue Template
purpose: Capture an actionable product, engineering, documentation, or operational problem with enough context for safe triage and handoff.
scope: Issue type, outcome, reproduction, impact, scope, environment, evidence, privacy, ownership, and acceptance.
audience: Product, Design, Engineering, QA, Security, Privacy, Reliability, Operations, Support, and contributors.
related_documents:
  - ./CONTRIBUTING.md
  - ./PRODUCT_GOVERNANCE.md
  - ./GLOSSARY.md
  - ./DOCUMENTATION_MAP.md
  - ./CODE_OWNERSHIP.md
  - ./TESTING_STRATEGY.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after an issue-intake, triage, or ownership-process change
owner: Product Operations, Engineering, QA, and Developer Experience
version: 1.0.0
status: Active template
last_updated: 2026-08-02
normative_level: Triage template subordinate to Product Governance, Testing Strategy, Code Ownership, and Quality Gates
canonical_terms: issue, outcome, source of truth, Role, Permission, Organization, Workspace, evidence, acceptance, recovery
---

# EduTrack Issue Template

## Use and authority

Use this template for a bug, feature request, documentation gap, operational concern, or question that needs a traceable handoff. It organizes intake; it does not define product priority, severity, release thresholds, or ownership outside the canonical handbooks.

Do not include passwords, tokens, private Student or Teacher records, raw provider credentials, or other sensitive data. Link to an approved redacted artifact instead.

## Issue type and outcome

- [ ] Bug or unexpected behavior
- [ ] Feature or workflow request
- [ ] Documentation or ownership gap
- [ ] Security, privacy, or access concern
- [ ] Reliability, performance, or recovery concern
- [ ] Question requiring an owner

**User or system outcome:**

**Short description:**

**Affected Role, Organization, Workspace, object, or workflow:**

## Observed behavior

**What happened:**

**What was expected:**

**Steps to reproduce or inspect:**

1.
2.
3.

**Frequency or trigger:**

**First known source revision or environment:**

## Scope and impact

**Affected paths, package, service, document, provider, or data boundary:**

**Current source of truth:**

**User, data, security, privacy, accessibility, or operational consequence:**

**Related state, error, duplicate, stale, partial, timeout, offline, or recovery behavior:**

## Evidence

| Evidence field | Record |
| --- | --- |
| Environment and version |  |
| Role, Organization, Workspace, dataset, locale, or viewport |  |
| Reproduction method or command |  |
| Redacted screenshot, log, test, or trace |  |
| Result and known limitations |  |

## Triage and handoff

**Likely owning area:** See [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

**Canonical handbook or decision owner:**

**Related PR, ADR, test case, incident, or release record:**

**Proposed next action:**

**Acceptance or resolution evidence:**

**Owner and retest condition:**

## Reporter checklist

- [ ] The outcome and observed behavior are clear.
- [ ] Reproduction steps or a reason they are not available are included.
- [ ] Scope, environment, and evidence are recorded.
- [ ] Sensitive data is removed or linked through an approved redacted artifact.
- [ ] The likely source-of-truth and ownership boundary are identified without claiming certainty where it is unknown.
- [ ] Resolution evidence and retest expectations are stated.

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
- [GLOSSARY.md](./GLOSSARY.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
