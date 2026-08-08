---
title: EduTrack Pull Request Template
purpose: Give authors a focused pull request structure for explaining scope, ownership, evidence, risk, review, and release handoff.
scope: Change summary, affected boundaries, evidence, risks, migrations, documentation, review state, and recovery.
audience: Authors, reviewers, Engineering, QA, Security, Privacy, Accessibility, Reliability, Product, Design, and release owners.
related_documents:
  - ./GIT_WORKFLOW.md
  - ./CONTRIBUTING.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./REVIEW_CHECKLISTS.md
  - ./QUALITY_GATES.md
  - ./TESTING_STRATEGY.md
  - ./IMPLEMENTATION_CHECKLIST.md
  - ./RELEASE_MANAGEMENT.md
  - ./CODE_OWNERSHIP.md
review_frequency: Quarterly and after a pull request, review, or release-process change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active template
last_updated: 2026-08-02
normative_level: Review handoff template subordinate to Git Workflow, Code Review Guidelines, Quality Gates, and Release Management
canonical_terms: pull request, source of truth, evidence, Role, Permission, Organization, Workspace, Pass, Block, Exception, recovery
---

# EduTrack Pull Request Template

## Use and authority

Use this template to make a change reconstructable by a reviewer. [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) owns review behavior, [QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision, and [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) owns branch and commit practice. This template does not replace those owners or authorize deployment.

## Summary

**User or system problem:**

**Outcome of this change:**

**Change type:** Code / Documentation / Configuration / Generated artifact / Data or migration / Release support

**Related issue, decision, or work item:**

## Scope and ownership

**Changed paths:**

**Owning package or document:**

**Source of truth:**

**Affected Roles, Organization, Workspace, Permissions, data, integrations, and consumers:**

**Current behavior versus target intent:**

**Out-of-scope paths or behavior:**

## Implementation and consequences

**Main approach:**

**States, errors, duplicate behavior, and recovery:**

**Security, privacy, accessibility, content, and operational impact:**

**Generated artifacts, provider, migration, rollout, or deployment impact:**

**Rollback, compensation, or safe-stop path:**

## Validation evidence

Record the applicable evidence; mark an item not applicable with a reason.

- [ ] Focused typecheck, build, lint, schema, or package checks
- [ ] Contract, generated-artifact, authorization, data-integrity, migration, or direct-boundary checks
- [ ] Accessibility, responsive, performance, security, resilience, or recovery checks
- [ ] Documentation links, metadata, ownership, duplicate, orphan, and placeholder checks
- [ ] Exact changed-file inventory and whitespace check

| Evidence field | Record |
| --- | --- |
| Source revision |  |
| Environment |  |
| Scope, Role, dataset, locale, or viewport |  |
| Method or command |  |
| Result and limitations |  |
| Known defect, owner, and retest condition |  |

## Review handoff

**Requested reviewers or ownership groups:** See [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md).

**Questions or tradeoffs requiring review:**

**Known gaps and mitigation:**

**Documentation owner and map updates:**

**Release decision:** Pending / Pass / Block / Approved Exception

## Author checklist

- [ ] The change has one focused purpose and the exact paths are listed.
- [ ] The canonical source of truth and owning handbook are linked.
- [ ] Affected scope, Permissions, privacy, states, consequences, and recovery are described where applicable.
- [ ] Evidence records environment, revision, method, result, and limitations.
- [ ] Not-applicable checks have a reason.
- [ ] No secrets, private records, unrelated work, build output, or unsupported capability claims are included.
- [ ] Review completion is kept separate from release and deployment approval.

## References

- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)
