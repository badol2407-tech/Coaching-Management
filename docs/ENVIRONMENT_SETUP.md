---
title: EduTrack Environment Setup
purpose: Explain the supported local and hosted development setup, environment boundaries, configuration names, and validation commands for EduTrack contributors.
scope: Runtime prerequisites, pnpm workspace installation, web, API, database, Firebase, Cloudinary, deployment configuration, secrets, workflows, and troubleshooting.
audience: All contributors, Engineering, QA, Security, Reliability, Operations, and maintainers.
related_documents:
  - ./CONTRIBUTING.md
  - ./TECH_STACK.md
  - ./CODING_STANDARDS.md
  - ./FOLDER_STRUCTURE.md
  - ./FRONTEND_ARCHITECTURE.md
  - ./BACKEND_ARCHITECTURE.md
  - ./FIREBASE_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./SECURITY_ARCHITECTURE.md
review_frequency: Quarterly and after a runtime, package-manager, provider, environment, or deployment change
owner: Engineering, Developer Experience, Security, and Reliability
version: 1.0.0
status: Active setup guide
last_updated: 2026-08-02
normative_level: Setup guidance subordinate to security, architecture, engineering, and deployment standards
canonical_terms: local, preview, production, environment, source of truth, secret, Organization, Workspace
---

# EduTrack Environment Setup

## Purpose and boundaries

This guide helps a contributor prepare a safe local environment without confusing local success with preview or production readiness. [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) owns environment and promotion boundaries; [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) owns secret and trust-boundary requirements.

The repository contains a Firebase-first web path and a separate Express/OpenAPI/Drizzle/PostgreSQL path. Set up only the boundary needed for the change. A configured package or environment variable does not prove that the corresponding path is active in production.

## Prerequisites

- Git with access to the repository.
- Node.js 24, matching the repository’s Replit runtime configuration.
- pnpm compatible with the committed lockfile and workspace configuration.
- Access to approved non-production Firebase, Cloudinary, database, or deployment environments only when the change needs them.
- A terminal capable of running the workspace commands below.

Do not use production credentials or copy production Students, Teachers, Fees, Profiles, private prompts, provider tokens, or other protected data into local fixtures.

## Clone and install

```bash
git clone https://github.com/badol2407-tech/Coaching-Management.git
cd Coaching-Management
git switch main
pnpm install --frozen-lockfile
```

Create a focused branch before editing. See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for synchronization and commit practice.

The lockfile and `pnpm-workspace.yaml` are part of the installation contract. Do not replace pnpm with npm or Yarn, remove the minimum-release-age protection, or update the lockfile as an incidental setup step.

## Configuration and secrets

Use the approved environment or secret-management mechanism for the environment you are working in. Keep local environment files ignored, do not commit their contents, and never print secret values. Variable names are documented here so contributors can request or provision the correct boundary without placing credentials in source.

### Web client configuration

The Firebase client reads the following Vite variables when the web path is initialized:

- `VITE_FIREBASE_API_KEY` or the existing compatibility name `VITE_FIREBASE_API`;
- `VITE_FIREBASE_AUTH_DOMAIN`;
- `VITE_FIREBASE_DATABASE_URL`;
- `VITE_FIREBASE_PROJECT_ID`;
- `VITE_FIREBASE_STORAGE_BUCKET`;
- `VITE_FIREBASE_MESSAGING_SENDER_ID`;
- `VITE_FIREBASE_APP_ID`.

The web upload helper also reads:

- `VITE_CLOUDINARY_CLOUD_NAME`;
- `VITE_CLOUDINARY_UPLOAD_PRESET`.

`VITE_POSTHOG_KEY` is optional product analytics configuration. `VITE_API_URL` is used by the existing subscription surface when that API boundary is configured. Public client configuration must remain limited to approved client-safe values.

### Server and operational configuration

- `DATABASE_URL` is required by the Drizzle/PostgreSQL package and its configuration commands.
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are server-side credentials for the Cloudinary deletion boundary.
- `VERCEL_TOKEN` is required only for the deployment script when that deployment path is intentionally used.
- `PORT`, `BASE_PATH`, and `NODE_ENV` are runtime settings supplied by the relevant workflow or deployment boundary.
- `LOG_LEVEL` controls the API logger level where the service runtime supports it.

Do not assume every variable is needed for every local command. If a required value is missing, the runtime should fail explicitly; do not substitute another environment or data source.

## Start the relevant boundary

### Web application

From the repository root:

```bash
pnpm --filter @workspace/web run dev
```

The web Vite configuration reads `PORT` and `BASE_PATH` from the environment. In the managed Replit preview, use the configured web workflow so those values and path routing are supplied by the platform. For a package-only check:

```bash
pnpm --filter @workspace/web run typecheck
pnpm --filter @workspace/web run build
```

### API service

```bash
pnpm --filter @workspace/api-server run dev
```

The API service builds before starting and currently exposes its implemented health route under the `/api` boundary. Do not infer broader domain-route support from the OpenAPI document or generated client. Use [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for the current boundary and setup required for database-backed work.

### Shared packages

For shared library or contract work:

```bash
pnpm run typecheck:libs
pnpm --filter @workspace/api-spec run codegen
```

Run code generation after an OpenAPI source change and review the generated result without hand-editing it. Use the affected package checks before relying on generated types.

## Database and Firebase boundaries

Database work uses the approved development `DATABASE_URL` and the schema workflow described by [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md). Never point a local migration or seed operation at production unless an explicit production procedure authorizes it.

Firebase work uses an approved non-production project or emulator boundary when available. `database.rules.json` currently closes the Realtime Database boundary, and checked-in configuration is not proof of deployed Firestore or Storage enforcement. Follow [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) for rules, direct-access tests, provider ownership, and recovery.

## Standard validation

From the repository root:

```bash
pnpm run typecheck
pnpm run build
git diff --check
git status --short
```

Select additional checks from [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) for the actual boundary: contract, authorization, data integrity, accessibility, security, performance, resilience, recovery, provider, migration, or documentation validation.

## Troubleshooting

### Installation changes the lockfile

Stop and verify that the correct pnpm version and repository revision are being used. Do not commit an incidental lockfile change. Check the workspace configuration and retry with `pnpm install --frozen-lockfile`.

### A required environment value is missing

Confirm which boundary requires it, request the value through approved secret management, and verify only its presence or safe configuration shape. Never paste the value into a chat, issue, log, screenshot, source file, or documentation.

### The web preview is blank or at the wrong path

Check that the managed web workflow is running, that `PORT` and `BASE_PATH` are supplied by the workflow, and that browser-visible URLs respect the artifact base path. Do not hardcode localhost or a development domain into application code.

### Firebase, provider, or database behavior is unclear

Stop before using a fallback. Confirm the current source of truth, environment, identity, scope, rules, provider, and recovery path in the owning architecture handbook.

## Setup checklist

- [ ] Node.js and pnpm match the repository setup.
- [ ] Installation used the committed lockfile without unreviewed changes.
- [ ] Local configuration uses approved non-production values and no committed secrets.
- [ ] Only the required web, API, database, Firebase, provider, or deployment boundary was enabled.
- [ ] Typecheck, build, and focused validation were run for the changed boundary.
- [ ] Local results are not described as preview or production evidence.

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [TECH_STACK.md](./TECH_STACK.md)
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)
- [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md)
- [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
- [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md)
- [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md)
- [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)