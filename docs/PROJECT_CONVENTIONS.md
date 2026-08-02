---
title: EduTrack Project Conventions
purpose: Provide a concise implementation map for names, paths, ownership, source control, documentation, configuration, and safe contributor behavior.
scope: Repository placement, naming, imports, source of truth, generated output, documentation, secrets, Git, and change boundaries.
audience: All contributors, maintainers, reviewers, QA, Security, Operations, Product, and Design.
related_documents:
  - ./FOLDER_STRUCTURE.md
  - ./CODING_STANDARDS.md
  - ./CONTRIBUTING.md
  - ./GIT_WORKFLOW.md
  - ./TECH_STACK.md
  - ./ENVIRONMENT_SETUP.md
  - ./DOCUMENTATION_MAP.md
  - ./IMPLEMENTATION_CHECKLIST.md
review_frequency: Quarterly and after a package, naming, source-of-truth, documentation, or contributor-process change
owner: Engineering and Developer Experience
version: 1.0.0
status: Active implementation-support handbook
last_updated: 2026-08-02
normative_level: Quick-reference guidance subordinate to Folder Structure, Coding Standards, Git Workflow, and Product Governance
canonical_terms: Organization, Workspace, Role, Permission, source of truth, generated artifact, component, module, artifact
---

# EduTrack Project Conventions

## Authority and use

This is a quick implementation map. [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) owns repository placement, [CODING_STANDARDS.md](./CODING_STANDARDS.md) owns coding conventions, [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) owns source-control workflow, and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) owns document authority. This file links those rules for fast orientation; it does not add competing thresholds.

## Repository placement

| Work | Place it in | Source-of-truth note |
| --- | --- | --- |
| Production web page or workflow | `artifacts/web/src/pages/` | Compose the current React/Vite/Firebase web path |
| Shared web component | `artifacts/web/src/components/` | Reuse approved component and token boundaries |
| Cross-page web provider | `artifacts/web/src/contexts/` | Add only when behavior is genuinely global |
| Current Firebase domain access | `artifacts/web/src/lib/hooks.ts` and existing Firebase helpers | Do not silently mix the separate API path |
| Express bootstrap or route | `artifacts/api-server/src/` | Register routes explicitly |
| OpenAPI contract | `lib/api-spec/openapi.yaml` | Author here, then regenerate consumers |
| Generated API client or Zod output | `lib/api-client-react` or `lib/api-zod` | Derived output; never hand-edit |
| Relational schema | `lib/db/src/schema/` | Pair with migration and compatibility evidence |
| Isolated component preview | `artifacts/mockup-sandbox/` | Never treat the sandbox as production source |
| Governed documentation | `docs/` or its `modules/` and `components/` subdirectories | Add metadata, owner links, and index/map reachability |

## Naming and imports

- Use `PascalCase` for React component files and exported components.
- Use `camelCase` for functions, hooks, variables, and local values.
- Use `UPPER_SNAKE_CASE` only for genuine module-level constants.
- Use domain and user-outcome names; avoid vague names when a specific name is available.
- Keep canonical terms from [GLOSSARY.md](./GLOSSARY.md), including Organization, Workspace, Role, Permission, Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Search, Filters, Profile, and Settings.
- Keep imports directed toward the owning layer. Avoid circular dependencies between pages and components, application code and generated packages, or API routes and frontend packages.
- Keep page composition, shared presentation, reusable behavior, service logic, contracts, and persistence in their respective owners.

## Source, generated, and configuration boundaries

- Author contracts and schemas in their source package, then regenerate dependent output.
- Treat package presence, an OpenAPI path, a rule file, or a mockup as insufficient evidence of runtime adoption.
- Name the active source of truth before adding a cache, fallback, provider, adapter, or migration.
- Keep runtime configuration in the relevant package or workflow boundary.
- Keep secrets, credentials, private records, environment-specific URLs, and recovery factors out of source, docs, generated output, logs, and public artifacts.

## Documentation conventions

- Use the established YAML metadata shape for governed handbooks.
- Link to the canonical owner instead of copying a binding rule.
- Update [INDEX.md](./INDEX.md) and [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) when adding or changing a governed handbook.
- Put durable authority decisions in [DECISION_LOG.md](./DECISION_LOG.md), not only in a task, issue, or pull request.
- Label current state, target intent, evidence, and known gaps separately.
- Do not leave unresolved TODO, TBD, placeholder, fake link, or example credential text in a governed document.

## Change and Git conventions

- Keep one focused purpose and one review story per branch and commit.
- Inspect `git status --short`, `git diff --stat`, `git diff --check`, and the exact changed paths before sharing.
- Do not mix application code, documentation, generated output, dependency changes, and deployment configuration unless the dependency is necessary and documented.
- Preserve unrelated user work; stop when a pull, merge, push, deployment, or migration has an unknown result.
- Use [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for synchronization, review, conflict, and recovery behavior.

## Quick safety check

- [ ] The file is in the boundary that owns the behavior.
- [ ] The source of truth and affected scope are explicit.
- [ ] Existing providers, components, tokens, patterns, and handbooks were searched first.
- [ ] No duplicate standard, component, provider, data path, or term was introduced.
- [ ] Secrets and private data are absent.
- [ ] Applicable validation and recovery evidence is recorded.

## References

- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [CODING_STANDARDS.md](./CODING_STANDARDS.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
- [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)
- [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
