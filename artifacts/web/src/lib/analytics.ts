/**
 * EduTrack Analytics — PostHog event wrapper
 * All tracking calls go through here for consistency.
 */

import posthog from "posthog-js";

type Role = "super_admin" | "org_admin" | "teacher" | "student";

/* ─── Identity ─────────────────────────────────────────────── */

export function identifyUser(uid: string, props: { role: Role; email: string; name: string; orgId?: string | null; orgName?: string }) {
  posthog.identify(uid, {
    email: props.email,
    name: props.name,
    role: props.role,
    org_id: props.orgId ?? null,
    org_name: props.orgName ?? null,
  });
  posthog.register({ role: props.role, org_id: props.orgId ?? null });
}

export function resetUser() {
  posthog.reset();
}

/* ─── Auth Events ───────────────────────────────────────────── */

export function trackLogin(method: "email" | "google", role?: Role) {
  posthog.capture("user_logged_in", { method, role: role ?? null });
}

export function trackLoginFailed(method: "email" | "google", error_code: string) {
  posthog.capture("login_failed", { method, error_code });
}

export function trackRegistered(method: "email" | "google") {
  posthog.capture("user_registered", { method });
}

export function trackLogout() {
  posthog.capture("user_logged_out");
}

/* ─── Page View ─────────────────────────────────────────────── */

export function trackPageView(page: string, role?: Role) {
  posthog.capture("$pageview", { page_name: page, role: role ?? null });
}

/* ─── Students ──────────────────────────────────────────────── */

export function trackStudentAdded() {
  posthog.capture("student_added");
}

export function trackStudentUpdated() {
  posthog.capture("student_updated");
}

export function trackStudentDeleted() {
  posthog.capture("student_deleted");
}

/* ─── Teachers ──────────────────────────────────────────────── */

export function trackTeacherAdded() {
  posthog.capture("teacher_added");
}

export function trackTeacherUpdated() {
  posthog.capture("teacher_updated");
}

export function trackTeacherDeleted() {
  posthog.capture("teacher_deleted");
}

/* ─── Fees ──────────────────────────────────────────────────── */

export function trackFeeAdded(amount: number, month: string) {
  posthog.capture("fee_added", { amount, month });
}

export function trackFeeMarkedPaid(feeId: string) {
  posthog.capture("fee_marked_paid", { fee_id: feeId });
}

/* ─── Attendance ────────────────────────────────────────────── */

export function trackAttendanceMarked(date: string, count: number) {
  posthog.capture("attendance_marked", { date, student_count: count });
}

/* ─── Exams ─────────────────────────────────────────────────── */

export function trackExamCreated(subject: string) {
  posthog.capture("exam_created", { subject });
}

export function trackResultEntered() {
  posthog.capture("result_entered");
}

/* ─── Notices ───────────────────────────────────────────────── */

export function trackNoticeCreated() {
  posthog.capture("notice_created");
}

/* ─── Expenses ──────────────────────────────────────────────── */

export function trackExpenseAdded(amount: number, category: string) {
  posthog.capture("expense_added", { amount, category });
}

/* ─── Subscription / Payment ────────────────────────────────── */

export function trackSubscriptionCheckoutStarted(plan: string, amount: number) {
  posthog.capture("subscription_checkout_started", { plan, amount });
}

export function trackPaymentCompleted(plan: string, transaction_id: string) {
  posthog.capture("payment_completed", { plan, transaction_id });
}

export function trackPaymentFailed(reason?: string) {
  posthog.capture("payment_failed", { reason: reason ?? "unknown" });
}

/* ─── Feature Usage ─────────────────────────────────────────── */

export function trackFeatureUsed(feature: string, extra?: Record<string, unknown>) {
  posthog.capture("feature_used", { feature, ...extra });
}
