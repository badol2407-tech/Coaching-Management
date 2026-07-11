---
name: Importing a GitHub repo as a Replit artifact
description: Mechanical process for bringing an existing (non-Replit) GitHub repo into this monorepo as a single web artifact, without a from-scratch build.
---

When a user wants an existing GitHub repo imported as a new artifact (not built fresh), treat it as a mechanical import + scoped-edit job, not a "first build":

1. Clone the source repo to a scratch dir outside the workspace (e.g. `/tmp/<name>`).
2. Create a fresh `react-vite` artifact via the normal artifacts flow (gives a correct `artifact.toml`, workflow, and Tailwind/vite scaffold already wired for this environment).
3. Copy the source's `src/`, `public/`, `index.html`, `components.json` (or equivalent config files) over the scaffold, overwriting the scaffold's placeholder versions.
4. Manually reconcile `package.json`: the scaffold uses pnpm workspace `catalog:` versions for shared deps, so only add the packages that are genuinely unique to the source app (diff the two dependency lists — usually a short list). Remove any scaffold deps that reference the shared backend (`@workspace/api-client-react` etc.) if the imported app is self-contained and doesn't use it.
5. Reconcile `tsconfig.json`: remove `references` entries pointing at shared-backend packages that are no longer dependencies.
6. Run `pnpm install` then `pnpm run typecheck` (not `build`) to catch missing deps/type errors from the merge quickly.
7. Request required secrets (e.g. Firebase config vars) LAST, after all file/dependency work passes typecheck — use the exact env var names the source code reads.
8. For screenshot/visual verification, if the app has a splash screen and/or a session-gated promo popup with real timers, temporarily shorten/lengthen those timers to get a clean shot, then revert them immediately after — do not leave debug timer values in the codebase.
