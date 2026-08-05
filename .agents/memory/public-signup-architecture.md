---
name: Public signup architecture
description: Public EduTrack registration creates a tenant and its first org-admin profile
---

Public registration is intentionally an organization-admin onboarding flow, not a teacher/student self-enrollment flow. A successful signup creates Firebase Auth identity, one `organizations` document, and the matching `users/{uid}` profile with `role: "org_admin"` and a selected plan. The organization/profile records must be committed atomically, and a newly created email Auth user must be removed if onboarding fails.

**Why:** AuthContext requires a Firestore profile and organization context before routing a user into the product; allowing a public account without those records would send the user to Setup or create an unscoped account.

**How to apply:** Keep public marketing routes outside authenticated product routing, keep registration writes scoped to the signup-created tenant, preserve the existing admin-created teacher/student flow, and keep the Firestore rules narrow enough to require the matching atomic organization/profile pair.