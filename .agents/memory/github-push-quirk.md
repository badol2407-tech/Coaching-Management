---
name: GitHub push quirks in Replit workspace
description: How to successfully push to GitHub from this workspace
---

# GitHub Push

## Working approach
Always specify the branch explicitly when using the GitHub push integration: `gitPush({ branch: "main", provider: "github" })`.
If that integration is unavailable, a normal HTTPS push with the PAT supplied as Basic authentication (`x:<token>`) works in this workspace; a Bearer extra header may be rejected even when the token is valid.
Use a normal push after synchronizing divergent histories; do not force-push `main`.

**Why:** A local branch can contain valid workspace commits while the GitHub branch contains
newer application commits. Merging the remote history preserves both sets of work and avoids
rewriting the shared branch.

## Divergence resolution
When status reports both ahead and behind:

1. Inspect `git log --graph --all` and confirm the working tree is clean.
2. Merge `origin/main` into the local branch.
3. Resolve only genuine conflicts, preserving both sides where they are independent.
4. Stage the resolutions and create the merge commit.
5. Push with the authenticated `gitPush` callback and explicit `branch: "main"`.

Do not use `git reset --hard` unless the user explicitly chooses to discard local commits.

## Authentication fallback
The GitHub push integration remains preferred because it uses managed OAuth. When a PAT is available, verify it against GitHub first and use standard Basic authentication for the HTTPS remote if the managed callback is unavailable.

**Why:** In this workspace, the same valid PAT returned `invalid credentials` when sent as a Bearer extra header but successfully pushed when encoded as the Basic `x:<token>` credential.
