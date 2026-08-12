---
name: Production Firestore rules source
description: The deployed Firestore rules contain the full role and organization authorization model
---

The deployed Firestore rules are the source of truth for production authorization. Before deploying a rules change, retrieve and preserve the current release; the checked-in file may be incomplete or stale. Add narrow changes to the full production rules rather than replacing them with a minimal signup-only ruleset.

**Why:** Replacing the live rules with a simplified local version can silently remove teacher, student, super-admin, join-request, or public marketing access even when the new rules compile.

**How to apply:** Validate the complete ruleset first, publish it only after compilation succeeds, then run a disposable authenticated negative/positive probe and clean up all test records. When using the Firebase Rules REST API, update a release with the `release` wrapper and `updateMask: ruleset_name`; a direct `rulesetName` payload is rejected.

## Replit validation note

The local Firestore emulator needs Java and an explicitly configured free port. In this workspace, the default emulator port conflicts with the API server and the emulator's IPv6 port probe can still fail even when an alternate IPv4 port is configured, so a failed emulator start is not evidence that the rules source is invalid.

**Why:** Rules validation was blocked by the local emulator's port binding behavior rather than a reported rules compilation error.

**How to apply:** Keep the full rules source in version control and use an authenticated Firebase dry-run/deploy or a working emulator environment for authoritative compilation and release verification.