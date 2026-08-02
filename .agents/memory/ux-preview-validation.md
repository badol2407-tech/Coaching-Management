---
name: UX preview validation
description: Environment constraint and validation approach for authenticated artifacts/web UI work
---

Authenticated preview screens require the Firebase project metadata and the `FIREBASE_API_KEY` secret to be available to Vite. The API key is public at runtime but should remain out of the repository.

**Why:** Firebase initializes before the UI mounts, so an absent key causes `auth/invalid-api-key` and a white screen. Centralizing the project metadata and injecting the key through Vite keeps primary and secondary auth clients consistent without committing the key.

**How to apply:** Ensure `FIREBASE_API_KEY` is available to the development and production build environments, keep the Firebase project metadata consistent across auth clients, and validate with typecheck, build, workflow health, and viewport screenshots.