---
name: Imported web preview registration
description: Imported web artifacts can exist on disk without appearing in the live artifact registry.
---

Imported web projects may have a valid `.replit-artifact/artifact.toml` but still be absent from the live artifact and screenshot registries. In that case, the app can still run through a narrowly scoped workflow when its `PORT` is set explicitly.

**Why:** The imported EduTrack web package served successfully, but the platform registry only listed the API and canvas artifacts.

**How to apply:** Verify the package with its own workflow and HTTP check; do not create a duplicate artifact. Treat screenshot/presentation failures as a platform registration issue when the workflow is healthy and returns HTTP 200.