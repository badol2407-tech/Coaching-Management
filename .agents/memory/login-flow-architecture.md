---
name: Login Flow Architecture
description: How authentication and role routing works, including the org-scoped self-registration join link (student/teacher) that still requires admin approval.
---

# Login Flow Architecture

## Rule
Super Admin and Org Admin accounts are always admin-provisioned (never self-registered). Students and teachers CAN self-register via an org-scoped join link, but their `users/{uid}` profile — which is what makes login actually work — is only created when an org admin approves the request.

**Why:** Org admins wanted students/teachers to set their own login password directly on the admission/join form instead of receiving a generated one, without opening self-registration into an unmoderated signup.

**How to apply:** Never let a self-registered account log in before admin approval. The Firebase Auth user (email+password) is created immediately at submit time (so the password is set), but `users/{uid}` (read by `AuthContext` to route by role) is only written during admin approval. Any new self-service entry point must follow this same two-step (auth account now, profile doc on approval) pattern.

## Account creation chain
- **Super Admin** → identified by `VITE_SUPER_ADMIN_EMAIL`; Firestore profile auto-created on first login in `AuthContext.tsx`
- **Org Admin** → created by Super Admin via `ManageOrganizations.tsx` (Firebase Auth via secondary app + `users/{uid}` Firestore profile with `role: "org_admin"`)
- **Teacher** → created by Org Admin via `Teachers.tsx` (admin sets a temp password), OR self-registers with own email/password via `/join/:orgId` (`JoinOrg.tsx`, role="teacher") → lands in `organizations/{orgId}/teacher_requests`, approved in `AddStudents.tsx`'s Admission Link tab
- **Student** → created by Org Admin via `Students.tsx`/`AddStudents.tsx`, OR self-registers with own email/password via the same `/join/:orgId` link (role="student") → lands in `organizations/{orgId}/admission_requests`, approved in the same tab

`firestore.rules` allows public (unauthenticated) `create` on both `admission_requests` and `teacher_requests` subcollections; both require manual `firebase deploy --only firestore:rules` (see below) or the join link's teacher path will fail with permission-denied.

## Login popup (AuthPanel in LandingPage.tsx)
- Modes: `"login"` | `"reset"` only (no register)
- Fields: Email, Password (toggle show/hide), Remember Me (checkbox), Forgot Password link
- Remember Me → `setPersistence(auth, browserLocalPersistence)` vs `browserSessionPersistence`
- Forgot Password → `sendPasswordResetEmail(auth, email)`, switches back to login mode on success

## Post-login routing (App.tsx + AuthContext.tsx)
1. Firebase Auth fires `onAuthStateChanged`
2. `AuthContext.loadProfile()` reads `users/{uid}` from Firestore → gets `role` + `orgId`
3. If `mustChangePassword === true` → `ForceChangePassword.tsx` blocks all other routes
4. Role → dashboard mapping:
   - `super_admin` → `SuperAdminLayout` + SuperAdminDashboard
   - `org_admin` → `AppLayout` + Dashboard
   - `teacher` → `TeacherLayout` + TeacherDashboard
   - `student` → `StudentLayout` + StudentPortal
5. If no Firestore profile exists → `Setup.tsx` shows "Account not configured, contact your admin"

## mustChangePassword gate
- Set to `true` when any admin creates a teacher/student/org_admin account
- Cleared to `false` in `ForceChangePassword.tsx` after user sets new password
- `updatePassword(user, newPassword)` + `updateDoc(users/{uid}, { mustChangePassword: false })`
- `auth/requires-recent-login` error means user must log out and back in first

## Secondary app trick (auth-utils.ts)
`createFirebaseAuthUser(email, password)` uses `initializeApp(config, 'secondary-N')` to create accounts without replacing the admin's auth session.
