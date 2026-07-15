---
name: Artifact registration can go stale even when files persist
description: listArtifacts()/workflows can be empty even though artifacts/<slug>/.replit-artifact/artifact.toml files exist on disk — don't trust file presence alone.
---

`.replit-artifact/artifact.toml` files surviving on disk (e.g. after a restore from a snapshot/backup, or across a migration/import) do **not** guarantee the artifact is actually registered. `listArtifacts()` can return empty and no workflow will exist for it even with a seemingly valid toml present.

**Why:** Registration state (workflow config, artifact index) is tracked separately from the files on disk. A prior turn's `createArtifact` call can leave files behind whose registration doesn't persist across certain operations (e.g. project/task restore or re-import).

**How to apply:** If a `web`/etc. artifact directory exists but doesn't show up in `listArtifacts()` or has no matching workflow, don't try to hand-edit `.replit-artifact/artifact.toml` or `.replit` to fix it. Instead: back up the directory's real source content elsewhere (e.g. `/tmp/backup/`), delete the artifact directory, call `createArtifact` fresh for that slug/type, then copy the real app source back into the newly scaffolded directory (merging `package.json` dependencies rather than overwriting the scaffold's).

Note: `createArtifact` has no `"api"` artifactType — a pre-existing `artifacts/api-server` (kind=api) scaffold that's unused by the app (e.g. a Firebase-only frontend with no backend calls) can just be left as an unregistered plain directory; it doesn't need a workflow if nothing in the app calls it.

When merging an old app's `package.json` into a freshly scaffolded one, check **both** `dependencies` and `devDependencies` in the old file — some apps split runtime packages (e.g. `firebase`, `posthog-js`, `xlsx`) into `dependencies` while the Replit Vite scaffold convention puts everything client-side into `devDependencies`. Missing this causes "Failed to resolve import" errors at dev-server start that look unrelated to the merge.
