---
name: GitHub push quirks in Replit workspace
description: How to successfully push to GitHub from this workspace
---

# GitHub Push

## Working approach
Always specify the branch explicitly: `gitPush({ branch: "main", provider: "github" })`.
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

## gitPush never works with raw shell git push
Raw `git push` fails with "Invalid username or token — password authentication not supported."
Always use the `gitPush` callback from CodeExecution (uses OAuth).
