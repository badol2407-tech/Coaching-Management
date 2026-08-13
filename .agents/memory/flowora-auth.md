---
name: Flowora authentication boundary
description: Flowora onboarding requires an existing Firebase account and must not use anonymous sign-in as a bootstrap fallback
---

Flowora onboarding must never create an anonymous Firebase session during bootstrap. It relies on a real authenticated user; no session is an `auth/unauthenticated` condition and should be routed to login rather than presented as a connectivity failure.

**Why:** The Firebase project rejects anonymous sign-in with `auth/admin-restricted-operation`, and treating that as a connection problem hides the actual account requirement.

**How to apply:** Preserve the authenticated UID check before every Firestore write, classify auth failures separately from permission and network failures, and keep onboarding completion as a second write after the pricing/profile write succeeds.