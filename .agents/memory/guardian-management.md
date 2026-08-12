---
name: Guardian management boundary
description: Guardian directory controls and the Firebase Auth deletion limitation
---

Guardian management can safely edit the organization-scoped Firestore profile, toggle its active status, and delete that profile from the browser. Deactivation must also be reflected in Firestore rules so an inactive guardian cannot access organization data.

**Why:** Firebase client SDKs cannot delete another user's Auth credential; that requires a trusted Admin SDK backend. Removing only the profile prevents organization access while keeping the limitation explicit instead of presenting a false full-account deletion.

**How to apply:** Keep guardian mutations organization-scoped and validate the guardian role, organization, allowed fields, and status in Firestore rules. If full credential deletion becomes mandatory, add a trusted server-side Admin SDK path before changing the UI wording.