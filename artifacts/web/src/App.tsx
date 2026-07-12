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
const SuperAdminDashboard = lazy(() => import("@/pages/super-admin/SuperAdminDashboard"));
const ManageOrganizations = lazy(() => import("@/pages/super-admin/ManageOrganizations"));
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

function AuthenticatedRoutes() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Suspense fallback={<Spinner />}><LandingPage /></Suspense>;
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
            <Route path="/" component={SuperAdminDashboard} />
            <Route path="/organizations" component={ManageOrganizations} />
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
        <Route path="/join/:code">
          <Suspense fallback={<Spinner />}><JoinOrg /></Suspense>
        </Route>
        {/* All other routes go through the auth-gated flow */}
        <Route>
          <AuthenticatedRoutes />
        </Route>
      </Switch>
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
