---
title: EduTrack Code Review Guidelines
purpose: Define how authors and reviewers evaluate changes with clear evidence, canonical ownership, and attention to safety, accessibility, correctness, and recovery.
scope: Review preparation, review order, blocking findings, documentation reviews, generated artifacts, migrations, evidence, and decisions.
audience: Authors, reviewers, Engineering, QA, Security, Privacy, Accessibility, Reliability, Product, and Design.
related_documents:
  - ./CONTRIBUTING.md
  - ./CODING_STANDARDS.md
  - ./REVIEW_CHECKLISTS.md
  - ./QUALITY_GATES.md
  - ./ENGINEERING_STANDARDS.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./TESTING_STRATEGY.md
  - ./CI_CD_ARCHITECTURE.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a review, quality-gate, source-of-truth, or release-process change
owner: Engineering, QA, Security, Accessibility, Reliability, and Product Governance
version: 1.0.0
status: Active review guidance
last_updated: 2026-08-02
normative_level: Review guidance subordinate to binding product, engineering, accessibility, security, and release standards
canonical_terms: evidence, source of truth, Role, Permission, Organization, Workspace, Pass, Block, Exception, recovery
---

# EduTrack Code Review Guidelines

## Purpose and authority

Code review is an evidence review, not a style vote. It checks that a change belongs in the right boundary, preserves the product contracts, and has enough evidence for its risk. [QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision; [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) owns the reusable review evidence checklist.

Reviewers should link to the canonical owner when they find a requirement. They should not introduce a new threshold or rewrite an existing standard inside a pull request comment.

## Author preparation

Before requesting review, the author should provide:

- a concise problem statement and user outcome;
- changed paths, owning package, source of truth, and current-versus-target distinction;
- affected Roles, Organization or Workspace scope, objects, Permissions, data, integrations, and consequences;
- relevant states, error and recovery behavior, audit impact, and privacy boundary;
- migration, generated-artifact, provider, configuration, or deployment impact;
- validation commands, environment, source revision, fixture or dataset, result, known gaps, and retest status;
- links to changed documentation owners, decisions, and release evidence.

The author should identify questions or tradeoffs directly. A reviewer should not have to infer whether a missing test, route, rule, migration, or document is intentional.

## Review order

Review from highest consequence to lowest, using [QUALITY_GATES.md](./QUALITY_GATES.md) for the governing gate sequence:

1. **Safety, accessibility, privacy, and user control:** Can users operate, understand, recover from, and trust the change? Are protected data and sensitive actions constrained?
2. **Authorization and scope:** Is identity, Role, Permission, Organization, and Workspace scope enforced at the receiving boundary and preserved through direct access, cache, export, callback, and support paths?
3. **Correctness and data integrity:** Do contracts, persistence, status transitions, idempotency, uniqueness, audit, and compatibility match the intended behavior?
4. **Reliability and recovery:** What happens on validation failure, timeout, offline state, duplicate submission, stale data, partial completion, dependency failure, migration issue, or unknown outcome?
5. **Performance and operational visibility:** Is useful work measurable, is slow work understandable, and can logs, errors, metrics, traces, and audit records distinguish the outcome safely?
6. **Maintainability and clarity:** Does the change reuse the correct boundary, keep dependencies directed, avoid duplication, and remain understandable to the next contributor?
7. **Presentation and polish:** Does the implementation use canonical vocabulary, approved components, responsive behavior, and consistent interaction patterns?

Not every review needs every layer in equal depth. Every material change must make the applicable and not-applicable layers explicit.

## Findings and decisions

Use review comments that are specific, actionable, and tied to consequence:

- **Block:** The change cannot safely or correctly proceed without addressing the finding, or required evidence is missing under the applicable gate.
- **Request change:** A substantive correction or evidence update is needed before approval.
- **Question:** The reviewer needs clarification before determining whether the change is safe or aligned.
- **Suggestion:** A non-blocking improvement that does not change the release decision.
- **Nit:** A minor preference that should not consume review bandwidth or block the change.

Each substantive finding should explain the boundary, risk, expected behavior, and evidence that would resolve it. Avoid comments about personal preference when a canonical standard or source-of-truth owner answers the question.

## Review by change type

### Frontend and interaction changes

- Trace the route family, Role/layout, provider, hook, component, and cache boundary.
- Check loading, empty, stale, unauthorized, error, pending, duplicate, and recovery states.
- Verify keyboard operation, accessible names and announcements, focus behavior, zoom, reflow, mobile, localization, and reduced motion as applicable.
- Confirm the UI does not imply that a target API, permission, source of truth, or monitoring capability is already implemented.

### API, contract, and generated changes

- Compare the OpenAPI source, generated clients, Zod schemas, mounted routes, request/response validation, error envelope, and tests.
- Confirm generated files were produced from the source contract and were not hand-edited.
- Review authentication, authorization, direct-object access, Organization and Workspace isolation, rate limits, audit, logging, and protected error behavior.
- Check compatibility for current consumers before accepting a breaking schema or route change.

### Data, rules, provider, and migration changes

- Identify the active source of truth, target source, identifier mapping, scope, readers, writers, backfill, reconciliation, and retirement path.
- Review uniqueness, transactions or compensating behavior, duplicate and retry handling, audit, backup, restoration, and rollback.
- Distinguish checked-in Firebase or Storage rules from deployed and tested enforcement.
- Confirm provider credentials and environment configuration are injected safely and absent from source, logs, artifacts, and review output.

### Documentation changes

- Confirm the file has complete metadata and a clear owner.
- Check every relative link, reference path, and code command.
- Confirm the rule belongs to the narrowest canonical owner and is not a duplicate or conflicting threshold.
- Confirm new governed documents are reachable from [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md).
- Check orphan documents, stale metadata, unresolved placeholders, current-state claims, and target-architecture wording.
- Ensure a documentation-only change did not modify application code, configuration, generated artifacts, or lockfiles.

## Evidence expectations

Evidence should be reproducible and scoped. Record:

| Evidence field | Meaning |
| --- | --- |
| Source revision | The exact commit or artifact revision reviewed |
| Environment | Local, preview, production, emulator, provider sandbox, or other boundary |
| Scope | Role, Organization, Workspace, dataset, locale, viewport, or dependency context |
| Method | Command, test, manual journey, link checker, audit, screenshot, or measurement |
| Result | Pass, failure, partial result, not applicable with reason, or unknown |
| Defect and owner | What remains, who owns it, and the retest or expiry condition |

AI-generated code, tests, copy, or documentation may accelerate preparation but is not evidence of a passing review.

## Approval and release handoff

Approval means the reviewer has completed the requested review scope; it does not bypass required checks or authorize a production release. Mark missing evidence as Block or use the governed Exception process with owner, mitigation, approval, and expiry.

After approval, hand off to [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) and [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md). Preserve the release identity and do not claim deployment, monitoring, branch protection, or environment approval without evidence.

## Reviewer checklist

- [ ] The change has one clear purpose and the affected source of truth is named.
- [ ] Canonical owners and dependencies are linked; no duplicate standard or threshold was introduced.
- [ ] Roles, scope, Permissions, privacy, audit, and direct-boundary behavior are covered.
- [ ] Success and applicable negative, stale, duplicate, partial, timeout, offline, and recovery paths are evidenced.
- [ ] Accessibility and responsive behavior are reviewed where the user surface changes.
- [ ] Contract, generated artifact, persistence, rules, provider, and migration compatibility is reviewed where applicable.
- [ ] Validation evidence identifies revision, environment, scope, method, result, and known gaps.
- [ ] The final review state is clear: approved, changes requested, blocked, or approved Exception.

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)