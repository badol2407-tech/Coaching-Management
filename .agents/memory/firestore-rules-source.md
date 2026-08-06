---
name: Production Firestore rules source
description: The deployed Firestore rules contain the full role and organization authorization model
---

The deployed Firestore rules are the source of truth for production authorization. Before deploying a rules change, retrieve and preserve the current release; the checked-in file may be incomplete or stale. Add narrow changes to the full production rules rather than replacing them with a minimal signup-only ruleset.

**Why:** Replacing the live rules with a simplified local version can silently remove teacher, student, super-admin, join-request, or public marketing access even when the new rules compile.

**How to apply:** Validate the complete ruleset first, publish it only after compilation succeeds, then run a disposable authenticated negative/positive probe and clean up all test records. When using the Firebase Rules REST API, update a release with the `release` wrapper and `updateMask: ruleset_name`; a direct `rulesetName` payload is rejected.