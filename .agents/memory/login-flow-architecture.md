---
name: Login Flow Architecture
description: How authentication and role routing works after the login flow simplification — no self-registration, no org ID entry, all accounts pre-provisioned.
---

# Login Flow Architecture

## Rule
All accounts are pre-provisioned by an admin. No user ever self-registers or enters an Org ID.

**Why:** The product is admin-provisioned SaaS. Teachers/students are created by org admin; org admins are created by super admin.

**How to apply:** Any time auth flow is touched, maintain this invariant. Never add a register form or org ID input to the login popup.

## Account creation chain
- **Super Admin** → identified by `VITE_SUPER_ADMIN_EMAIL`; Firestore profile auto-created on first login in `AuthContext.tsx`
- **Org Admin** → created by Super Admin via `ManageOrganizations.tsx` (Firebase Auth via secondary app + `users/{uid}` Firestore profile with `role: "org_admin"`)
- **Teacher** → created by Org Admin via `Teachers.tsx`
- **Student** → created by Org Admin via `Students.tsx`

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
