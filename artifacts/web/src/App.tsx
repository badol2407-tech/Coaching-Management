import { lazy, Suspense, useState, useCallback } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { TeacherLayout } from "@/components/layout/TeacherLayout";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ImpersonationProvider, useImpersonation } from "@/contexts/ImpersonationContext";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const HelpCenter = lazy(() => import("@/pages/HelpCenter"));
const Setup = lazy(() => import("@/pages/Setup"));
const ForceChangePassword = lazy(() => import("@/pages/ForceChangePassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Students = lazy(() => import("@/pages/Students"));
const AddStudents = lazy(() => import("@/pages/AddStudents"));
const Teachers = lazy(() => import("@/pages/Teachers"));
const Attendance = lazy(() => import("@/pages/Attendance"));
const Fees = lazy(() => import("@/pages/Fees"));
const Exams = lazy(() => import("@/pages/Exams"));
const Notices = lazy(() => import("@/pages/Notices"));
const Homework = lazy(() => import("@/pages/Homework"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Classes = lazy(() => import("@/pages/Classes"));
const Settings = lazy(() => import("@/pages/Settings"));
const Routine = lazy(() => import("@/pages/Routine"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("@/pages/PaymentFail"));

// Super Admin pages — Operations
const SuperAdminDashboard = lazy(() => import("@/pages/super-admin/SuperAdminDashboard"));
const ManageOrganizations = lazy(() => import("@/pages/super-admin/ManageOrganizations"));
const ManageUsers = lazy(() => import("@/pages/super-admin/ManageUsers"));
const PaymentHistory = lazy(() => import("@/pages/super-admin/PaymentHistory"));
const ActivityLogs = lazy(() => import("@/pages/super-admin/ActivityLogs"));
const OrgAdmins = lazy(() => import("@/pages/super-admin/OrgAdmins"));
const TeachersList = lazy(() => import("@/pages/super-admin/TeachersList"));
const StudentsList = lazy(() => import("@/pages/super-admin/StudentsList"));
const AccessPortal = lazy(() => import("@/pages/super-admin/AccessPortal"));
// Super Admin pages — Billing
const PricingPlans = lazy(() => import("@/pages/super-admin/PricingPlans"));
const ActiveSubscriptions = lazy(() => import("@/pages/super-admin/ActiveSubscriptions"));
const PaidUnpaid = lazy(() => import("@/pages/super-admin/PaidUnpaid"));
const FreeTrial = lazy(() => import("@/pages/super-admin/FreeTrial"));
const Revenue = lazy(() => import("@/pages/super-admin/Revenue"));
// Super Admin pages — Marketing
const LandingPageMgmt = lazy(() => import("@/pages/super-admin/LandingPageMgmt"));
const PopupOffers = lazy(() => import("@/pages/super-admin/PopupOffers"));
const Testimonials = lazy(() => import("@/pages/super-admin/Testimonials"));
const CouponCodes = lazy(() => import("@/pages/super-admin/CouponCodes"));
const ReferralProgram = lazy(() => import("@/pages/super-admin/ReferralProgram"));
const GrowthAnalytics = lazy(() => import("@/pages/super-admin/GrowthAnalytics"));
const Campaigns = lazy(() => import("@/pages/super-admin/Campaigns"));

const TeacherDashboard = lazy(() => import("@/pages/teacher/TeacherDashboard"));
const TeacherAttendance = lazy(() => import("@/pages/teacher/TeacherAttendance"));
const TeacherStudents = lazy(() => import("@/pages/teacher/TeacherStudents"));
const TeacherExams = lazy(() => import("@/pages/teacher/TeacherExams"));
const TeacherRoutine = lazy(() => import("@/pages/teacher/TeacherRoutine"));
const TeacherSettings = lazy(() => import("@/pages/teacher/TeacherSettings"));
const StudentPortal = lazy(() => import("@/pages/student/StudentPortal"));
const JoinOrg = lazy(() => import("@/pages/JoinOrg"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

/**
 * ImpersonatedView — renders the appropriate role's layout + routes while
 * showing the persistent impersonation banner. The super admin stays
 * authenticated as themselves; only the UI context (AuthContext profile) is
 * temporarily swapped via ImpersonationContext → AuthContext.setProfileOverride.
 */
function ImpersonatedView() {
  const { impersonation } = useImpersonation();
  if (!impersonation) return null;

  return (
    <>
      {/* Banner is rendered outside the layout so it's always above everything */}
      <ImpersonationBanner />
      <Suspense fallback={<Spinner />}>
        {impersonation.role === "org_admin" && (
          <AppLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/students" component={Students} />
              <Route path="/students/add" component={AddStudents} />
              <Route path="/teachers" component={Teachers} />
              <Route path="/classes" component={Classes} />
              <Route path="/routine" component={Routine} />
              <Route path="/attendance" component={Attendance} />
              <Route path="/fees" component={Fees} />
              <Route path="/exams" component={Exams} />
              <Route path="/notices" component={Notices} />
              <Route path="/homework" component={Homework} />
              <Route path="/expenses" component={Expenses} />
              <Route path="/settings" component={Settings} />
              <Route path="/subscription" component={Subscription} />
              <Route path="/help" component={HelpCenter} />
              <Route><Redirect to="/" /></Route>
            </Switch>
          </AppLayout>
        )}
        {impersonation.role === "teacher" && (
          <TeacherLayout>
            <Switch>
              <Route path="/" component={TeacherDashboard} />
              <Route path="/attendance" component={TeacherAttendance} />
              <Route path="/students" component={TeacherStudents} />
              <Route path="/exams" component={TeacherExams} />
              <Route path="/routine" component={TeacherRoutine} />
              <Route path="/notices" component={Notices} />
              <Route path="/homework" component={Homework} />
              <Route path="/settings" component={TeacherSettings} />
              <Route><Redirect to="/" /></Route>
            </Switch>
          </TeacherLayout>
        )}
        {impersonation.role === "student" && (
          <StudentLayout>
            <Switch>
              <Route path="/" component={StudentPortal} />
              <Route><Redirect to="/" /></Route>
            </Switch>
          </StudentLayout>
        )}
      </Suspense>
    </>
  );
}

function AuthenticatedRoutes() {
  const { user, userProfile, loading } = useAuth();
  const { impersonation } = useImpersonation();

  if (loading) return <Spinner />;
  if (!user) return <Suspense fallback={<Spinner />}><LandingPage /></Suspense>;

  // During impersonation, userProfile is the overridden (impersonated) profile.
  // We need to check the *real* super admin state, so detect via impersonation context.
  const isSuperAdminSession = impersonation !== null ||
    (userProfile?.role === "super_admin" && !impersonation);

  // If there's an active impersonation, render the impersonated view.
  if (impersonation) {
    return <ImpersonatedView />;
  }

  if (!userProfile) return <Suspense fallback={<Spinner />}><Setup /></Suspense>;

  // Force password change gate — must be cleared before accessing any dashboard
  if (userProfile.mustChangePassword) {
    return (
      <Suspense fallback={<Spinner />}>
        <ForceChangePassword />
      </Suspense>
    );
  }

  if (userProfile.role === "super_admin") {
    return (
      <SuperAdminLayout>
        <Suspense fallback={<Spinner />}>
          <Switch>
            {/* Dashboard */}
            <Route path="/" component={SuperAdminDashboard} />
            {/* Operations */}
            <Route path="/operations/organizations" component={ManageOrganizations} />
            <Route path="/operations/users" component={ManageUsers} />
            <Route path="/operations/org-admins" component={OrgAdmins} />
            <Route path="/operations/teachers" component={TeachersList} />
            <Route path="/operations/students" component={StudentsList} />
            <Route path="/operations/activity" component={ActivityLogs} />
            <Route path="/operations/access-portal" component={AccessPortal} />
            {/* Billing & Finance */}
            <Route path="/billing/pricing" component={PricingPlans} />
            <Route path="/billing/subscriptions" component={ActiveSubscriptions} />
            <Route path="/billing/paid-unpaid" component={PaidUnpaid} />
            <Route path="/billing/free-trial" component={FreeTrial} />
            <Route path="/billing/revenue" component={Revenue} />
            <Route path="/billing/payments" component={PaymentHistory} />
            {/* Marketing & Growth */}
            <Route path="/marketing/landing" component={LandingPageMgmt} />
            <Route path="/marketing/popups" component={PopupOffers} />
            <Route path="/marketing/testimonials" component={Testimonials} />
            <Route path="/marketing/coupons" component={CouponCodes} />
            <Route path="/marketing/referrals" component={ReferralProgram} />
            <Route path="/marketing/analytics" component={GrowthAnalytics} />
            <Route path="/marketing/campaigns" component={Campaigns} />
            {/* Legacy redirects */}
            <Route path="/organizations"><Redirect to="/operations/organizations" /></Route>
            <Route path="/users"><Redirect to="/operations/users" /></Route>
            <Route path="/payments"><Redirect to="/billing/payments" /></Route>
            <Route path="/activity"><Redirect to="/operations/activity" /></Route>
            <Route><Redirect to="/" /></Route>
          </Switch>
        </Suspense>
      </SuperAdminLayout>
    );
  }

  if (userProfile.role === "teacher") {
    return (
      <TeacherLayout>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/" component={TeacherDashboard} />
            <Route path="/attendance" component={TeacherAttendance} />
            <Route path="/students" component={TeacherStudents} />
            <Route path="/exams" component={TeacherExams} />
            <Route path="/routine" component={TeacherRoutine} />
            <Route path="/notices" component={Notices} />
            <Route path="/homework" component={Homework} />
            <Route path="/settings" component={TeacherSettings} />
            <Route><Redirect to="/" /></Route>
          </Switch>
        </Suspense>
      </TeacherLayout>
    );
  }

  if (userProfile.role === "student") {
    return (
      <StudentLayout>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/" component={StudentPortal} />
            <Route><Redirect to="/" /></Route>
          </Switch>
        </Suspense>
      </StudentLayout>
    );
  }

  // org_admin
  return (
    <AppLayout>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/students" component={Students} />
          <Route path="/students/add" component={AddStudents} />
          <Route path="/teachers" component={Teachers} />
          <Route path="/classes" component={Classes} />
          <Route path="/routine" component={Routine} />
          <Route path="/attendance" component={Attendance} />
          <Route path="/fees" component={Fees} />
          <Route path="/exams" component={Exams} />
          <Route path="/notices" component={Notices} />
          <Route path="/homework" component={Homework} />
          <Route path="/expenses" component={Expenses} />
          <Route path="/settings" component={Settings} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/help" component={HelpCenter} />
          <Route><Redirect to="/" /></Route>
        </Switch>
      </Suspense>
    </AppLayout>
  );
}

function AppRoutes() {
  return (
    <AuthProvider>
      <ImpersonationProvider>
        <Switch>
          {/* Public routes — available regardless of auth state */}
          <Route path="/payment/success">
            <Suspense fallback={<Spinner />}><PaymentSuccess /></Suspense>
          </Route>
          <Route path="/payment/fail">
            <Suspense fallback={<Spinner />}><PaymentFail /></Suspense>
          </Route>
          <Route path="/privacy">
            <Suspense fallback={<Spinner />}><PrivacyPolicy /></Suspense>
          </Route>
          <Route path="/terms">
            <Suspense fallback={<Spinner />}><TermsOfService /></Suspense>
          </Route>
          <Route path="/refund">
            <Suspense fallback={<Spinner />}><RefundPolicy /></Suspense>
          </Route>
          <Route path="/faq">
            <Suspense fallback={<Spinner />}><FAQ /></Suspense>
          </Route>
          <Route path="/join/:code/:role?">
            <Suspense fallback={<Spinner />}><JoinOrg /></Suspense>
          </Route>
          {/* All other routes go through the auth-gated flow */}
          <Route>
            <AuthenticatedRoutes />
          </Route>
        </Switch>
      </ImpersonationProvider>
    </AuthProvider>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <ErrorBoundary>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <div inert={!splashDone ? true : undefined}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRoutes />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
