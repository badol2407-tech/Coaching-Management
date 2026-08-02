---
title: EduTrack Git Workflow
purpose: Define the repository workflow for synchronizing changes, creating focused commits, collaborating through review, and recovering safely.
scope: Remotes, branches, synchronization, commits, pull requests, documentation changes, conflicts, and safe recovery.
audience: All contributors, reviewers, release owners, and repository maintainers.
related_documents:
  - ./CONTRIBUTING.md
  - ./CODING_STANDARDS.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./CI_CD_ARCHITECTURE.md
  - ./RELEASE_MANAGEMENT.md
  - ./PRODUCT_GOVERNANCE.md
  - ./DOCUMENTATION_MAP.md
review_frequency: Quarterly and after a repository, branch, review, or delivery-process change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active contributor workflow
last_updated: 2026-08-02
normative_level: Workflow guidance subordinate to product governance, engineering, review, CI/CD, and release standards
canonical_terms: source revision, branch, commit, pull request, release, artifact, rollback
---

# EduTrack Git Workflow

## Purpose and current state

Git is the audit trail for source revisions, review boundaries, documentation evolution, and release identity. This workflow complements [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md), which owns delivery sequencing, and [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md), which owns release handling.

The current repository is hosted on GitHub at [badol2407-tech/Coaching-Management](https://github.com/badol2407-tech/Coaching-Management). The current snapshot does not evidence checked-in GitHub Actions workflows or branch-protection configuration. Local checks and human review must not be described as automated repository enforcement until that evidence exists.

## Before starting work

1. Confirm the requested scope, source-of-truth files, affected Roles and data boundaries, and whether the work is code, documentation, configuration, generated output, or a release change.
2. Start from the latest intended base branch:

   ```bash
   git fetch --prune origin
   git switch main
   git pull --ff-only origin main
   ```

3. Confirm the working tree is clean before creating a branch. Do not discard unrelated user work.
4. Create a focused branch with a descriptive name, for example:

   ```bash
   git switch -c docs/phase-5-part-4
   git switch -c feat/attendance-corrections
   git switch -c fix/profile-scope-check
   ```

Use a branch name that communicates the change without embedding a temporary ticket number or personal information.

## Keep changes focused

- One branch should have one coherent purpose and one review story.
- Do not mix formatting churn, dependency upgrades, generated output, application behavior, and documentation unless the dependency is necessary and documented.
- Do not commit secrets, credentials, private records, local environment files, build output, or editor state.
- Generated files belong in a commit only when their source contract changed and regeneration is part of the change.
- A documentation-only change must not modify application code, package manifests, lockfiles, generated artifacts, or deployment configuration.
- Before committing, inspect both the summary and the exact paths:

  ```bash
  git status --short
  git diff --stat
  git diff --check
  git diff -- docs/
  ```

## Commit conventions

Use a short, imperative subject with a clear area, followed by an optional body when context is needed:

```text
docs: add contributor workflow handbooks
fix: preserve attendance input after timeout
feat: add scoped attendance correction flow
refactor: isolate profile query boundary
```

The commit body should explain the reason, source-of-truth impact, migration or recovery concern, and validation evidence when the subject is not enough. Keep unrelated changes in separate commits.

Use the commit as a durable change boundary. Do not amend a commit that has already been shared unless the collaboration context explicitly permits it. Never rewrite a shared branch with force push.

## Synchronize before sharing

Before pushing a long-lived branch or opening a review, update it from the current base branch and resolve conflicts locally:

```bash
git fetch --prune origin
git rebase origin/main
```

If the branch is already shared, use the team’s agreed non-rewriting integration method instead of rebasing it. After a rebase, run the relevant checks again because the effective source revision changed.

## Pull requests and review

A pull request should state:

- what changed and why;
- affected Roles, Organization or Workspace scope, data, permissions, and source of truth;
- whether generated artifacts, migrations, rules, providers, or deployment configuration are involved;
- validation commands, environment, result, and known limitations;
- rollback or compensating behavior for consequential changes;
- documentation ownership and index/map updates for governed documentation.

Use [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) for review behavior and [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) for evidence. A pull request approval is not a release decision; release decisions remain under [QUALITY_GATES.md](./QUALITY_GATES.md).

## Merging and release identity

Merge only after required review evidence and checks are complete. Preserve the source revision, artifact identity, environment, approver, and result needed by [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md).

Do not infer that a merge deployed the application. Deployment, Firebase rules, provider, database, and documentation release actions remain separate until their evidence is recorded.

## Conflict resolution

When resolving a conflict:

1. Identify which file is the canonical source of truth.
2. Preserve the newer or higher-authority rule rather than combining contradictory text.
3. Re-run links, duplicate-rule, orphan, and placeholder checks for documentation conflicts.
4. Re-run contract, type, test, security, accessibility, or migration checks for implementation conflicts.
5. Record a durable decision in [DECISION_LOG.md](./DECISION_LOG.md) when the conflict changes an architectural or governance rule.

Never resolve a conflict by silently deleting an owner, permission, audit, recovery, or security requirement.

## Safe recovery

- Stop and preserve evidence when a pull, rebase, merge, or push has an unknown result.
- Inspect `git status`, `git reflog`, and the remote before retrying a consequential Git operation.
- Prefer a new corrective commit or a checkpoint over destructive history rewriting.
- Use [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) and [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) for released application, data, rules, and provider recovery; Git recovery alone does not restore deployed data or configuration.

## Contributor checklist

- [ ] The branch starts from the intended current base.
- [ ] The change is focused and contains no secrets, private data, or unrelated files.
- [ ] The commit message communicates the change.
- [ ] The exact diff, whitespace, links, duplicates, or relevant tests were checked.
- [ ] The pull request records source of truth, scope, evidence, limitations, and recovery.
- [ ] The change does not claim CI, branch protection, deployment, or monitoring that the repository does not evidence.

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
- [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
- [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)