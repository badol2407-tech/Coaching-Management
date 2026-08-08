---
name: Realtime portal synchronization
description: The four EduTrack portals share Firestore data and need cache invalidation plus profile listeners for cross-session updates
---

Use Firestore snapshot listeners as the cross-portal freshness path: organization roles listen only to collections they are authorized to read, while Super Admin listens to platform collections. Snapshot changes invalidate all related TanStack Query list, detail, dashboard, and student-specific keys. Also listen to the signed-in user and organization documents so role, membership, and subscription gates update without re-login.

**Why:** A mutation refreshes only the writer's local cache; other open portals otherwise remain stale until navigation or manual refresh.

**How to apply:** Keep the listener collection allowlist aligned with Firestore rules. Add new shared entities to both the role-specific listener map and the invalidation mapping, and preserve a visible connection state with cleanup/re-subscription on auth or organization changes.