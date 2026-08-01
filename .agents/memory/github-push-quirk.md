---
name: GitHub push quirks in Replit workspace
description: How to successfully push to GitHub from this workspace
---

# GitHub Push

## Working approach
`gitPush({ branch: "main", force: true })` — specify the branch name explicitly.

**Why:** When the local branch has commits not on the remote (after a `git reset --hard origin/main`
followed by new commits), plain `gitPush({})` returns `BRANCH_ALREADY_EXISTS`. Adding
`branch: "main"` resolves this.

## Root cause of conflicts this session
The Replit workspace started with its own git history (shallow). The GitHub repo had a full history.
Direct `git merge origin/main --allow-unrelated-histories` created hundreds of add/add conflicts
since both sides had the same EduTrack files. Fix: `git reset --hard origin/main` to align
with GitHub history, then apply only workspace-specific changes on top.

## gitPush never works with raw shell git push
Raw `git push` fails with "Invalid username or token — password authentication not supported."
Always use the `gitPush` callback from CodeExecution (uses OAuth).
