---
name: UX preview validation
description: Environment constraint and validation approach for authenticated artifacts/web UI work
---

Authenticated preview screens can fail before rendering when the local Firebase client configuration is unavailable, producing `auth/invalid-api-key`.

**Why:** The failure occurs during Firebase initialization, before the UI mounts; changing Firebase setup during a UI-only audit would alter product infrastructure rather than validate the requested experience.

**How to apply:** Keep Firebase initialization unchanged for UI-only work. Validate with typecheck, production build, workflow health, focused code review, and viewport screenshots when available; report the Firebase blocker when authenticated screenshots cannot render.