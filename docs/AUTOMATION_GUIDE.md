---
title: EduTrack Automation Guide
purpose: Describe how validation and delivery automation should be selected, scoped, reported, and evolved without claiming automation that the repository does not evidence.
scope: Documentation checks, static checks, package checks, contract generation, test execution, CI/CD boundaries, evidence, failure handling, and adoption gaps.
audience: Engineering, QA, Reliability, Security, Product Governance, Operations, and contributors.
related_documents:
  - ./TESTING_STRATEGY.md
  - ./CI_CD_ARCHITECTURE.md
  - ./QUALITY_GATES.md
  - ./ENVIRONMENT_SETUP.md
  - ./IMPLEMENTATION_CHECKLIST.md
  - ./QA_CHECKLIST.md
  - ./TEST_CASE_TEMPLATE.md
  - ./GIT_WORKFLOW.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a validation, CI/CD, generated-artifact, or release-process change
owner: Engineering, QA, and Reliability
version: 1.0.0
status: Active implementation-support guide
last_updated: 2026-08-02
normative_level: Automation guidance subordinate to Testing Strategy, CI/CD Architecture, Quality Gates, Environment Setup, and release owners
canonical_terms: automation, evidence, source of truth, generated artifact, environment, test layer, release, recovery
---

# EduTrack Automation Guide

## Use and current state

This guide helps contributors choose safe automation boundaries and report their results. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) owns test-layer selection, [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) owns pipeline sequencing and artifact promotion, and [QUALITY_GATES.md](./QUALITY_GATES.md) owns the release decision.

The current repository snapshot does not evidence a formal test-runner configuration or a checked-in `.github/workflows/` pipeline. Local commands, package scripts, and this guide must not be described as automated repository enforcement. Treat automation adoption as a target change until the relevant configuration and successful runs are evidenced.

## Automation principles

- Automate repeatable evidence, not authority decisions.
- Run checks against the actual source of truth and name the environment and dependency boundary.
- Keep Firebase-first web evidence separate from the Express/OpenAPI/Drizzle path.
- Make failures actionable and preserve enough output for a reviewer to reproduce them.
- Do not expose secrets, private records, raw prompts, provider credentials, or sensitive logs in automation output.
- Keep generated artifacts derived from their authored source.
- Prefer a safe stop over an automatic mutation when the source of truth, migration state, authorization result, or recovery path is uncertain.
- Record current gaps instead of silently treating missing automation as a pass.

## Automation layers

| Layer | Useful automation | Canonical owner | Evidence to retain |
| --- | --- | --- | --- |
| Documentation | Relative links, heading references, metadata, ownership reachability, duplicate rules, orphan files, placeholders, and changed-file scope | Documentation Map and Testing Strategy | Revision, files, command, result, limitations |
| Static package checks | Typecheck, lint, formatting, schema checks, and build commands for the changed package | Engineering Standards and package owners | Package, tool version, command, result |
| API contract | OpenAPI validation, generated-output drift, route/consumer compatibility, and error-shape checks | API Layer Architecture and API Contracts | Contract revision, generated revision, route/consumer scope |
| Test execution | Selected unit, component, integration, end-to-end, accessibility, security, performance, resilience, and recovery cases | Testing Strategy | Test layer, fixture, environment, scope, result, defect |
| Release and promotion | Artifact identity, approvals, environment separation, health checks, and rollback evidence | CI/CD Architecture, Deployment Architecture, and Quality Gates | Artifact, environment, approver, result, recovery |

Automation should report evidence for the layer it actually ran. A successful documentation check does not prove application correctness, and a successful build does not prove authorization, accessibility, recovery, or release readiness.

## Local validation flow

Select the smallest relevant commands from [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) and the owning package. The repository's contributor guidance names these common checks:

```bash
pnpm run typecheck
pnpm run build
git diff --check
```

For a documentation-only change, also run the link, metadata, ownership, duplicate, orphan, and placeholder checks described by [TESTING_STRATEGY.md](./TESTING_STRATEGY.md). For a contract change, validate the authored contract and regeneration boundary before reviewing consumers.

## Automation evidence record

| Field | Record |
| --- | --- |
| Source revision |  |
| Automation layer |  |
| Environment and dependencies |  |
| Scope, Role, Organization, Workspace, dataset, or package |  |
| Command, workflow, or method |  |
| Result and captured artifact |  |
| Known limitation or not-applicable reason |  |
| Defect, owner, and retest condition |  |

## Failure and recovery

- Stop promotion when a required check fails or has an unknown result.
- Separate a failed check from an unavailable environment, missing dependency, and unsupported test.
- Preserve the source revision, command, output, environment, and scope before retrying.
- Do not auto-retry a consequential mutation without confirming idempotency and duplicate behavior.
- Route source-of-truth, provider, migration, or recovery uncertainty through [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md).
- Use [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for released-system recovery.

## Adopting new automation

Before adding a workflow, script, generator, or automated mutation:

1. Name the source of truth, owning package, consumer, and environment boundary.
2. Confirm the check belongs to the relevant testing or delivery layer.
3. Define inputs, fixtures, permissions, secrets handling, outputs, failure behavior, and cleanup.
4. Record the decision and update the owning architecture or delivery handbook when the boundary changes.
5. Prove the automation with a scoped run before describing it as available.
6. Update [CODE_OWNERSHIP.md](./CODE_OWNERSHIP.md), [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md), and the relevant handoff template when ownership changes.

## References

- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- [QA_CHECKLIST.md](./QA_CHECKLIST.md)
- [TEST_CASE_TEMPLATE.md](./TEST_CASE_TEMPLATE.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
