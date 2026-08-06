import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bus,
  CalendarCheck,
  Check,
  CheckCircle,
  CircleDollarSign,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Library,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  RefreshCw,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import {
  PLAN_CONFIG,
  computeExpiryDate,
  getPricingDisplay,
  type PlanTier,
} from "@/lib/plan-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { trackFeatureUsed, trackLogin, trackLoginFailed, trackRegistered } from "@/lib/analytics";
import { PromotionPopup } from "@/components/PromotionPopup";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  DEFAULT_LANDING_LAYOUT,
  type LandingPageLayout,
  type LandingWindowId,
} from "@/lib/landing-layout";
import { usePublicLandingLayout } from "@/lib/public-hooks";

const googleProvider = new GoogleAuthProvider();

type AuthMode = "login" | "signup" | "reset";
export type LandingSection = "home" | "features" | "solutions" | "pricing" | "resources" | "about";
const toBanglaDigits = (value: number) => String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
const PROMOTION_SESSION_KEY = "et_promo_shown";
const HERO_WINDOWS_ENTRANCE_KEY = "edutrack_hero_windows_entered";

function triggerHeroHaptic() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(12);
  }
}

function StrobeLights() {
  return (
    <div className="hero-mini-strobe" aria-hidden="true">
      <span className="hero-mini-strobe-light hero-mini-strobe-light--one" />
      <span className="hero-mini-strobe-light hero-mini-strobe-light--two" />
      <span className="hero-mini-strobe-light hero-mini-strobe-light--three" />
    </div>
  );
}

const features = [
  { icon: CalendarCheck, title: "Attendance & Fees", desc: "Record attendance, track collections, and keep follow-ups in one daily view.", label: "Daily operations" },
  { icon: ClipboardCheck, title: "Exams & Results", desc: "Plan assessments, publish results, and give every learner clear progress.", label: "Academic clarity" },
  { icon: Bell, title: "Assignments & Notices", desc: "Share classwork, deadlines, and important updates without message trails.", label: "One clear update" },
  { icon: Library, title: "Library & Transport", desc: "Keep resources, lending, routes, and stops easy to find when needed.", label: "Smooth logistics" },
  { icon: Users, title: "Role-based portals", desc: "Admin, teacher, parent, and student views stay focused on the next step.", label: "Four focused views" },
  { icon: BarChart3, title: "Analytics", desc: "Turn everyday school records into a small set of useful decisions.", label: "Useful signal" },
];

const workflow = [
  { num: "01", role: "Admin", icon: LayoutDashboard, title: "Sets the context", desc: "The day begins with one view of people, payments, attendance, and exceptions." },
  { num: "02", role: "Teacher", icon: GraduationCap, title: "Updates the work", desc: "Classroom activity flows into the same record without duplicate entry." },
  { num: "03", role: "Parent", icon: Users, title: "Sees the signal", desc: "Families receive timely, relevant updates about the learner they support." },
  { num: "04", role: "Student", icon: BookOpen, title: "Moves forward", desc: "The next class, assignment, result, or goal is always close at hand." },
];

const faqs = [
  { question: "EduTrack কী ধরনের school বা coaching center-এর জন্য?", answer: "EduTrack ছোট থেকে বড় school এবং coaching center-এর জন্য তৈরি। Organization admin, teachers, parents এবং students — প্রত্যেকে নিজের role অনুযায়ী একই workspace ব্যবহার করতে পারে।" },
  { question: "শুরু করতে কি কোনো credit card লাগবে?", answer: "না। Free Trial শুরু করতে credit card দরকার নেই। আপনি workspace সেটআপ করে platform-এর core workflow আগে দেখে নিতে পারবেন।" },
  { question: "আমি কি আমার teachers, parents ও students-দের যোগ করতে পারব?", answer: "হ্যাঁ। Organization setup করার পরে team-কে Organization Code দিয়ে join করাতে পারবেন। প্রত্যেকে তার role অনুযায়ী portal access পাবে।" },
  { question: "আমার data কি নিরাপদ থাকবে?", answer: "EduTrack role-based access, cloud storage এবং regular backup workflow-এর মাধ্যমে organization data পরিচালনা করতে সাহায্য করে। Access সবসময় user role এবং organization scope অনুযায়ী থাকে।" },
  { question: "পরে plan পরিবর্তন বা cancel করা যাবে?", answer: "হ্যাঁ। Plan অনুযায়ী billing cycle এবং feature access আলাদা হতে পারে। আপনার account থেকে subscription settings পরিচালনা করা যাবে।" },
];

async function createPublicOrgAccount({
  uid,
  email,
  name,
  organizationName,
  tier,
}: {
  uid: string;
  email: string;
  name: string;
  organizationName: string;
  tier: PlanTier;
}) {
  const startDate = new Date();
  const expiryDate = computeExpiryDate(tier, startDate);
  const legacyPlan = tier === "annual_premium" ? "pro" : tier === "founder_launch" ? "basic" : "free";
  const organizationRef = doc(collection(db, "organizations"));
  const profileRef = doc(db, "users", uid);
  await runTransaction(db, async (transaction) => {
    const existingProfile = await transaction.get(profileRef);
    if (existingProfile.exists()) {
      const error = new Error("This account already has an EduTrack profile.");
      (error as Error & { code: string }).code = "already-exists";
      throw error;
    }

    transaction.set(organizationRef, {
      name: organizationName,
      adminEmail: email,
      adminUid: uid,
      createdAt: serverTimestamp(),
      tier,
      plan: legacyPlan,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionExpiryDate: expiryDate.toISOString(),
      accountStatus: "active",
      status: "active",
      paymentStatus: "unpaid",
    });
    transaction.set(profileRef, {
      role: "org_admin",
      orgId: organizationRef.id,
      name,
      email,
      mustChangePassword: false,
      createdAt: serverTimestamp(),
      createdByPublicSignup: true,
    });
  });

  return organizationRef.id;
}

function AuthPanel({
  defaultMode,
  defaultTier = "free_trial",
  onClose,
}: {
  defaultMode: AuthMode;
  defaultTier?: PlanTier;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [signupTier, setSignupTier] = useState<PlanTier>(defaultTier);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();

  async function handleGoogle() {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      if (mode === "signup") {
        const googleName = result.user.displayName?.trim() || result.user.email?.split("@")[0] || "School Admin";
        try {
          await createPublicOrgAccount({
            uid: result.user.uid,
            email: result.user.email ?? email,
            name: googleName,
            organizationName: organizationName.trim() || `${googleName}'s School`,
            tier: signupTier,
          });
        } catch (error) {
          await signOut(auth).catch(() => undefined);
          if ((error as { code?: string })?.code === "already-exists") {
            const accountExistsError = new Error("This Google account already has an EduTrack profile.");
            (accountExistsError as Error & { code: string }).code = "auth/account-exists";
            throw accountExistsError;
          }
          throw error;
        }
        await refreshProfile();
        trackRegistered("google");
        navigate("/");
      } else {
        trackLogin("google");
        navigate("/");
      }
      onClose();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        if (mode === "login") trackLoginFailed("google", err.code ?? "unknown");
        toast({ title: mode === "signup" ? "Sign Up Error" : "Google Sign-In Error", description: friendlyError(err.code), variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    if (mode === "signup" && (!name.trim() || !organizationName.trim())) {
      toast({ title: "Name and organization are required", variant: "destructive" });
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Please enter the same password twice.", variant: "destructive" });
      return;
    }
    if (mode !== "reset" && password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
        setMode("login");
      } else if (mode === "signup") {
        await setPersistence(auth, browserLocalPersistence);
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: name.trim() });
        try {
          await createPublicOrgAccount({
            uid: credential.user.uid,
            email: email.trim(),
            name: name.trim(),
            organizationName: organizationName.trim(),
            tier: signupTier,
          });
        } catch (error) {
          await deleteUser(credential.user).catch(() => undefined);
          throw error;
        }
        await refreshProfile();
        trackRegistered("email");
        toast({ title: "Account created!", description: "Your EduTrack workspace is ready." });
        navigate("/");
        onClose();
      } else {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email.trim(), password);
        trackLogin("email");
        navigate("/");
        onClose();
      }
    } catch (err: any) {
      if (mode === "login") trackLoginFailed("email", err.code ?? "unknown");
      toast({ title: mode === "signup" ? "Sign Up Error" : "Login Error", description: friendlyError(err.code), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-auth">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>{mode === "login" ? "Sign In to EduTrack" : mode === "signup" ? "Create your EduTrack workspace" : "Reset Password"}</DialogTitle>
              <DialogDescription className="mt-1">{mode === "login" ? "Enter your email and password to continue" : mode === "signup" ? "Start your school workspace in real time — no credit card required." : "Enter your email to receive a reset link"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Your name</Label>
                  <Input data-testid="input-signup-name" id="signup-name" placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-organization">School / coaching name</Label>
                  <Input data-testid="input-signup-organization" id="signup-organization" placeholder="Your organization" value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-plan">Start with a plan</Label>
                <select data-testid="select-signup-plan" id="signup-plan" value={signupTier} onChange={(event) => setSignupTier(event.target.value as PlanTier)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {(Object.keys(PLAN_CONFIG) as PlanTier[]).map((tier) => <option key={tier} value={tier}>{PLAN_CONFIG[tier].name} — {getPricingDisplay(tier).price}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input data-testid="input-auth-email" id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          </div>
          {mode !== "reset" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="auth-password">Password</Label>
                {mode === "login" && <Button data-testid="button-forgot-password" type="button" variant="link" size="sm" className="h-auto px-0" onClick={() => setMode("reset")}>Forgot Password?</Button>}
              </div>
              <div className="relative">
                <Input data-testid="input-auth-password" id="auth-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required className="pr-12" />
                <Button data-testid="button-toggle-password" type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </div>
            </div>
          )}
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <Input
                data-testid="input-signup-confirm-password"
                id="signup-confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          )}
          {mode === "login" && (
            <div className="flex items-center gap-2">
              <Checkbox data-testid="checkbox-remember-me" id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
              <Label htmlFor="remember-me" className="cursor-pointer font-normal text-muted-foreground">Remember me</Label>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-3">
            <Button data-testid="button-auth-submit" type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </form>
        {mode !== "reset" && (
          <div className="space-y-3">
            <div className="relative flex items-center">
              <div className="w-full border-t" />
              <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">or</span>
            </div>
            <Button data-testid={`button-google-${mode}`} type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
              <span className="font-semibold text-primary" aria-hidden="true">G</span> Continue with Google
            </Button>
          </div>
        )}
        {mode === "reset" ? (
          <Button data-testid="button-back-login" type="button" variant="link" className="mx-auto" onClick={() => setMode("login")}>Back to Login</Button>
        ) : (
          <Button data-testid="button-toggle-auth-mode" type="button" variant="link" className="mx-auto" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "New to EduTrack? Sign Up" : "Already have an account? Log in"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({ eyebrow, title, description, align = "center" }: { eyebrow: string; title: string; description: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left"}>
      <Badge variant="secondary" className="mb-4">{eyebrow}</Badge>
      <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl" data-testid={`heading-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`}>{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function AdminGauge() {
  return (
    <Card className="dashboard-gauge-card rounded-3xl border-primary/10 bg-card p-5 text-center shadow-lg" data-testid="admin-dashboard-gauge">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Gauge className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-semibold">আজকের অপারেশন</p>
      <div className="dashboard-gauge mt-5">
        <div className="dashboard-gauge-value">92.6%</div>
        <div className="dashboard-gauge-label">স্কুল হেলথ</div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">অ্যাটেনড্যান্স, ফি এবং রেজাল্ট এক নজরে</p>
    </Card>
  );
}

function MiniSparkline({ bars = ["h-5", "h-8", "h-6", "h-10", "h-9", "h-12", "h-11"] }: { bars?: string[] }) {
  return (
    <div className="flex h-16 items-end gap-2" aria-label="Seven day trend chart">
      {bars.map((height, index) => (
        <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-1">
          <div className={`w-full rounded-t-sm bg-primary/70 ${height}`} />
          <span className="text-xs text-muted-foreground">{["M", "T", "W", "T", "F", "S", "M"][index]}</span>
        </div>
      ))}
    </div>
  );
}

function TeamProgressWindow({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [progress, setProgress] = useState(reduceMotion ? 56 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(56);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 2800;

    function tick(now: number) {
      const elapsed = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setProgress(Math.round(eased * 56));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const needleRotation = -90 + progress * 1.8;

  return (
    <div
      className="hero-mini-window hero-mini-team glass-panel rounded-2xl border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur-xl"
      data-testid="hero-window-team-progress"
      aria-label={`স্কুলের স্বাস্থ্য ${progress}% Healthy`}
      onTouchStart={triggerHeroHaptic}
    >
      <StrobeLights />
      <div className="hero-mini-header">
        <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground">স্কুলের স্বাস্থ্য</p>
        <span className="hero-mini-header-icon flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
      <div className="hero-speedometer mt-2">
          <svg viewBox="0 0 180 112" role="img" aria-label={`${progress}% Healthy`}>
          <path className="hero-speedometer-track" d="M 22 94 A 68 68 0 0 1 158 94" pathLength="1" />
          <path
            className="hero-speedometer-progress"
            d="M 22 94 A 68 68 0 0 1 158 94"
            pathLength="1"
            style={{ strokeDashoffset: 1 - progress / 100 }}
          />
          <g className="hero-speedometer-needle" transform={`rotate(${needleRotation} 90 94)`}>
            <line x1="90" y1="94" x2="90" y2="27" />
          </g>
          <circle className="hero-speedometer-hub" cx="90" cy="94" r="6" />
        </svg>
        <div className="hero-speedometer-value">
          <strong>{progress}%</strong>
          <span>Healthy</span>
        </div>
      </div>
    </div>
  );
}

function AttendanceChart() {
  const grades = ["ষষ্ঠ", "সপ্তম", "অষ্টম", "নবম", "দশম"];
  const values = [38, 45, 33, 42, 48];
  const chart = { left: 31, top: 12, width: 139, height: 96 };
  const points = values.map((value, index) => ({
    x: chart.left + (chart.width / (values.length - 1)) * index,
    y: chart.top + ((50 - value) / 40) * chart.height,
  }));
  const linePath = points.map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const lastPoint = points[points.length - 1] ?? { x: chart.left, y: chart.top + chart.height };
  const areaPath = `${linePath} L ${lastPoint.x} ${chart.top + chart.height} L ${chart.left} ${chart.top + chart.height} Z`;
  const yTicks = [50, 40, 30, 20, 10];

  return (
    <div className="hero-attendance-chart" aria-label="শ্রেণিভিত্তিক উপস্থিতি চার্ট">
      <svg viewBox="0 0 180 150" role="img" aria-labelledby="attendance-chart-title attendance-chart-description">
        <title id="attendance-chart-title">আজকের উপস্থিতি</title>
        <desc id="attendance-chart-description">ষষ্ঠ থেকে দশম শ্রেণির উপস্থিতি ১০ থেকে ৫০-এর স্কেলে দেখানো হয়েছে।</desc>
        <defs>
          <linearGradient id="attendance-area-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(221 83% 58% / .32)" />
            <stop offset="100%" stopColor="hsl(267 75% 72% / .03)" />
          </linearGradient>
          <linearGradient id="attendance-line-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="hsl(221 83% 58%)" />
            <stop offset="100%" stopColor="hsl(267 75% 64%)" />
          </linearGradient>
          <filter id="attendance-point-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="hero-attendance-grid">
          {yTicks.map((tick) => {
            const y = chart.top + ((50 - tick) / 40) * chart.height;
            return (
              <g key={tick}>
                <line x1={chart.left} x2={chart.left + chart.width} y1={y} y2={y} />
                <text x="25" y={y + 2.5} textAnchor="end">{toBanglaDigits(tick)}</text>
              </g>
            );
          })}
        </g>
        <line className="hero-attendance-axis" x1={chart.left} x2={chart.left} y1={chart.top} y2={chart.top + chart.height} />
        <line className="hero-attendance-axis" x1={chart.left} x2={chart.left + chart.width} y1={chart.top + chart.height} y2={chart.top + chart.height} />
        <path className="hero-attendance-area" d={areaPath} />
        <path className="hero-attendance-line" pathLength="1" d={linePath} />
        {points.map(({ x, y }, index) => (
          <g key={grades[index]} filter="url(#attendance-point-glow)">
            <circle className="hero-attendance-point-halo" cx={x} cy={y} r="5.5" />
            <circle className="hero-attendance-point" cx={x} cy={y} r="2.7" />
          </g>
        ))}
        {grades.map((grade, index) => (
          <text key={grade} className="hero-attendance-grade" x={points[index].x} y="121" textAnchor="middle">{grade}</text>
        ))}
        <text className="hero-attendance-axis-label" x="99" y="145" textAnchor="middle">শ্রেণি</text>
        <text className="hero-attendance-axis-label" transform="translate(8 62) rotate(-90)" textAnchor="middle">উপস্থিতি</text>
      </svg>
    </div>
  );
}

const examResults = [
  { subject: "পদার্থবিজ্ঞান", value: 89 },
  { subject: "রসায়ন", value: 87 },
  { subject: "উচ্চতর গণিত", value: 88 },
  { subject: "জীববিজ্ঞান", value: 85 },
  { subject: "ইংরেজি", value: 91 },
];

function RadarChart({ animateOrbit }: { animateOrbit: boolean }) {
  const chart = { cx: 110, cy: 77, radius: 46, labelRadius: 67 };
  const totalScore = examResults.reduce((sum, result) => sum + result.value, 0);
  const points = examResults.map((result, index) => {
    const angle = -90 + index * 72;
    const point = polarPoint(chart.cx, chart.cy, chart.radius * (result.value / 100), angle);
    const labelPoint = polarPoint(chart.cx, chart.cy, chart.labelRadius, angle);
    return { ...result, angle, point, labelPoint };
  });
  const polygonPath = points.map(({ point }, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ") + " Z";
  const orbitPoints = [points[0], ...points.slice(1).reverse(), points[0]];
  const orbitPath = orbitPoints.map(({ point }, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const orbitMotionPath = orbitPoints
    .map(({ point }, index) => `${index === 0 ? "M" : "L"} ${point.x - points[0].point.x} ${point.y - points[0].point.y}`)
    .join(" ");
  const orbitSegmentLengths = orbitPoints.slice(0, -1).map(({ point }, index) => {
    const nextPoint = orbitPoints[index + 1]?.point ?? point;
    return Math.hypot(nextPoint.x - point.x, nextPoint.y - point.y);
  });
  const orbitTotalLength = orbitSegmentLengths.reduce((sum, length) => sum + length, 0);
  let travelledLength = 0;
  const orbitVertexProgress = orbitSegmentLengths.map((length) => {
    const progress = orbitTotalLength > 0 ? travelledLength / orbitTotalLength : 0;
    travelledLength += length;
    return progress;
  });
  const outerPoints = examResults.map((_, index) => polarPoint(chart.cx, chart.cy, chart.radius, -90 + index * 72));
  const axisLabelAnchor = (x: number) => (x < chart.cx - 8 ? "end" : x > chart.cx + 8 ? "start" : "middle");

  return (
    <div className="hero-radar-chart" aria-label="রাফির পরীক্ষার ফলাফল">
      <svg viewBox="0 0 220 165" role="img" aria-labelledby="radar-title radar-description">
        <title id="radar-title">রাফির পরীক্ষার ফলাফল</title>
        <desc id="radar-description">পদার্থবিজ্ঞান ৮৯, রসায়ন ৮৭, উচ্চতর গণিত ৮৮, জীববিজ্ঞান ৮৫, ইংরেজি ৯১।</desc>
        <defs>
          <linearGradient id="radar-fill-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(221 83% 58% / .34)" />
            <stop offset="100%" stopColor="hsl(267 75% 68% / .16)" />
          </linearGradient>
          <linearGradient id="radar-stroke-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(221 83% 58%)" />
            <stop offset="100%" stopColor="hsl(267 75% 64%)" />
          </linearGradient>
          <filter id="radar-point-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g className="hero-radar-grid">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <polygon
              key={scale}
              points={examResults.map((_, index) => {
                const point = polarPoint(chart.cx, chart.cy, chart.radius * scale, -90 + index * 72);
                return `${point.x},${point.y}`;
              }).join(" ")}
            />
          ))}
          {outerPoints.map((point, index) => (
            <line key={examResults[index].subject} x1={chart.cx} y1={chart.cy} x2={point.x} y2={point.y} />
          ))}
        </g>
        <g className="hero-radar-orbit" aria-hidden="true">
          <path className="hero-radar-orbit-track" d={orbitPath} />
          <circle className="hero-radar-orbit-dot" cx={points[0].point.x} cy={points[0].point.y} r="2.4">
            {animateOrbit && <animateMotion dur="8s" repeatCount="indefinite" path={orbitMotionPath} />}
          </circle>
          <circle className="hero-radar-orbit-glint" cx={points[0].point.x} cy={points[0].point.y} r="5.5">
            {animateOrbit && (
              <>
                <animateMotion dur="8s" repeatCount="indefinite" path={orbitMotionPath} />
                <animate
                  attributeName="opacity"
                  dur="8s"
                  repeatCount="indefinite"
                  values=".92;.18;.92;.18;.92;.18;.92;.18;.92;.18;.92"
                  keyTimes="0;.12;.2;.32;.4;.52;.6;.72;.8;.92;1"
                />
              </>
            )}
          </circle>
          {animateOrbit && (
            <>
              <g className="hero-radar-sparkle-trail" transform={`translate(${points[0].point.x} ${points[0].point.y})`}>
                {[0.18, 0.34, 0.52, 0.72].map((offset, index) => (
                  <g
                    key={`sparkle-trail-${index}`}
                    transform={`rotate(${index * 27 - 22}) scale(${0.7 + index * 0.12})`}
                  >
                    <path className="hero-radar-sparkle" d="M 0 -2 L 0 -5 M -2 0 L -5 0 M 0 2 L 0 5 M 2 0 L 5 0" />
                    <animateMotion
                      dur="8s"
                      begin={`-${offset}s`}
                      repeatCount="indefinite"
                      path={orbitMotionPath}
                    />
                    <animate
                      attributeName="opacity"
                      dur={`${1.5 + index * 0.15}s`}
                      repeatCount="indefinite"
                      values=".25;.95;.18"
                    />
                  </g>
                ))}
              </g>
              {orbitPoints.slice(0, -1).map(({ point }, index) => (
                <g
                  key={`sparkle-burst-${index}`}
                  className="hero-radar-sparkle-burst"
                  style={{ animationDelay: `${(orbitVertexProgress[index] ?? 0) * 8}s` }}
                  transform={`translate(${point.x} ${point.y})`}
                >
                  <path
                    className="hero-radar-sparkle-burst-line"
                    d="M 0 -2 L 0 -8 M -2 0 L -8 0 M 0 2 L 0 8 M 2 0 L 8 0 M -1.5 -1.5 L -5 -5 M 1.5 1.5 L 5 5 M 1.5 -1.5 L 5 -5 M -1.5 1.5 L -5 5"
                  />
                  <circle className="hero-radar-sparkle-burst-core" cx="0" cy="0" r="1.8" />
                </g>
              ))}
            </>
          )}
        </g>
        <polygon className="hero-radar-data-area" points={points.map(({ point }) => `${point.x},${point.y}`).join(" ")} />
        <path className="hero-radar-data-line" d={polygonPath} />
        {points.map(({ point, subject }, index) => (
          <g key={subject} className="hero-radar-point" style={{ animationDelay: `${1.95 + index * 0.12}s` }} filter="url(#radar-point-glow)">
            <circle className="hero-radar-point-halo" cx={point.x} cy={point.y} r="5.5" />
            <circle className="hero-radar-point-core" cx={point.x} cy={point.y} r="2.7" />
          </g>
        ))}
        <text className="hero-radar-center-label" x={chart.cx} y={chart.cy - 2} textAnchor="middle">মোট স্কোর</text>
        <text className="hero-radar-center-value" x={chart.cx} y={chart.cy + 8} textAnchor="middle">{toBanglaDigits(totalScore)}/৫০০</text>
        {points.map(({ labelPoint, subject, value }) => (
          <g key={`${subject}-label`}>
            <text className="hero-radar-subject" x={labelPoint.x} y={labelPoint.y + 2} textAnchor={axisLabelAnchor(labelPoint.x)}>{subject}</text>
            <text className="hero-radar-value-outer" x={labelPoint.x} y={labelPoint.y + 10} textAnchor={axisLabelAnchor(labelPoint.x)}>{toBanglaDigits(value)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

type FeeSlice = {
  name: string;
  amount: number;
  color: string;
  status: "paid" | "due";
};

const monthlyFees: FeeSlice[] = [
  { name: "নীলা", amount: 1650, color: "#20b77a", status: "paid" },
  { name: "রাহুল", amount: 2150, color: "#ef6877", status: "due" },
  { name: "মিথিলা", amount: 2750, color: "#20b77a", status: "paid" },
  { name: "রাফি", amount: 3250, color: "#ef6877", status: "due" },
  { name: "আদিবা", amount: 4800, color: "#20b77a", status: "paid" },
];

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function donutSlicePath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarPoint(cx, cy, outerRadius, endAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, startAngle);
  const innerStart = polarPoint(cx, cy, innerRadius, startAngle);
  const innerEnd = polarPoint(cx, cy, innerRadius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function MonthlyFeeChart() {
  const total = monthlyFees.reduce((sum, slice) => sum + slice.amount, 0);
  const feeSegments = monthlyFees.map((slice, index) => {
    const startAngle = monthlyFees
      .slice(0, index)
      .reduce((sum, currentSlice) => sum + (currentSlice.amount / total) * 360, 0);
    const endAngle = startAngle + (slice.amount / total) * 360;
    const textAngle = startAngle + (endAngle - startAngle) / 2;
    return {
      slice,
      startAngle,
      endAngle,
      namePoint: polarPoint(140, 112, 56, textAngle),
    };
  });

  return (
    <div className="hero-fee-chart" aria-label="শিক্ষার্থীদের মাসিক ফি দেওয়ার অবস্থা">
      <svg viewBox="0 0 280 230" role="img" aria-labelledby="monthly-fee-title monthly-fee-description">
        <title id="monthly-fee-title">মাসিক ফি</title>
        <desc id="monthly-fee-description">সবুজ অংশ ফি দিয়েছে এবং লাল অংশ ফি বাকি বোঝায়।</desc>
        <defs>
          <linearGradient id="fee-glass-highlight" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 100% / .9)" />
            <stop offset="44%" stopColor="hsl(0 0% 100% / .24)" />
            <stop offset="100%" stopColor="hsl(224 70% 77% / .2)" />
          </linearGradient>
          <filter id="fee-wheel-shadow" x="-35%" y="-35%" width="170%" height="170%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="hsl(224 56% 22% / .2)" />
          </filter>
        </defs>

        <g className="hero-fee-wheel" filter="url(#fee-wheel-shadow)">
          <circle className="hero-fee-wheel-shadow" cx="140" cy="112" r="75" />
          <circle className="hero-fee-wheel-base" cx="140" cy="112" r="73" />
          {feeSegments.map(({ slice, startAngle, endAngle }) => (
            <path
              key={`${slice.name}-branch`}
              className="hero-fee-sunburst-branch"
              d={donutSlicePath(140, 112, 78, 69, startAngle + 1, endAngle - 1)}
              fill={slice.color}
            />
          ))}
          {feeSegments.map(({ slice, startAngle, endAngle }) => (
            <g key={slice.name}>
              <path
                className={`hero-fee-slice hero-fee-slice--${slice.status}`}
                d={donutSlicePath(140, 112, 69, 40, startAngle + 1, endAngle - 1)}
                fill={slice.color}
              />
            </g>
          ))}
          <circle className="hero-fee-inner-glass" cx="140" cy="112" r="41" />
          <circle className="hero-fee-inner-highlight" cx="140" cy="112" r="29" />
          <path className="hero-fee-reflection" d="M 102 69 A 58 58 0 0 1 157 51" />
        </g>
        <g className="hero-fee-labels" aria-hidden="true">
          {feeSegments.map(({ slice, namePoint }) => (
            <text key={`${slice.name}-label`} className="hero-fee-name" x={namePoint.x} y={namePoint.y + 2} textAnchor="middle">
              {slice.name}
            </text>
          ))}
        </g>
        <text className="hero-fee-center-label" x="140" y="109" textAnchor="middle">মাসিক</text>
        <text className="hero-fee-center-value" x="140" y="123" textAnchor="middle">ফি</text>
      </svg>
      <div className="hero-fee-legend" aria-label="ফি status legend">
        <span><i className="hero-fee-legend-dot hero-fee-legend-dot--paid" />দিয়েছে</span>
        <span><i className="hero-fee-legend-dot hero-fee-legend-dot--due" />বাকি</span>
      </div>
    </div>
  );
}

type HeroWindowEntrancePhase = "waiting" | "entering" | "settled";

function HeroMiniWindows({
  reduceMotion,
  enter,
  layout,
}: {
  reduceMotion: boolean | null;
  enter: boolean;
  layout: LandingPageLayout;
}) {
  const [entrancePhase, setEntrancePhase] = useState<HeroWindowEntrancePhase>(
    () => (enter ? "settled" : "waiting"),
  );

  useEffect(() => {
    if (!enter || entrancePhase !== "waiting") return;
    if (reduceMotion) {
      setEntrancePhase("settled");
      return;
    }

    setEntrancePhase("entering");
    const timer = window.setTimeout(() => setEntrancePhase("settled"), 2000);
    return () => window.clearTimeout(timer);
  }, [enter, entrancePhase, reduceMotion]);

  const floatTransition = (duration: number, delay = 0) => ({
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  });

  const windowStyle = (id: LandingWindowId): CSSProperties => {
    const desktop = layout.desktop[id];
    const mobile = layout.mobile[id];
    return {
      "--hero-window-desktop-x": `${desktop.x}%`,
      "--hero-window-desktop-y": `${desktop.y}%`,
      "--hero-window-desktop-width": `${desktop.width}%`,
      "--hero-window-desktop-height": `${desktop.height}%`,
      "--hero-window-mobile-x": `${mobile.x}%`,
      "--hero-window-mobile-y": `${mobile.y}%`,
      "--hero-window-mobile-width": `${mobile.width}%`,
      "--hero-window-mobile-height": `${mobile.height}%`,
    } as CSSProperties;
  };

  return (
    <motion.div
      className={`hero-mini-stage hero-mini-stage--${entrancePhase} hero-mini-stage--custom-layout relative mx-auto mt-14 max-w-6xl`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      data-testid="hero-mini-windows"
    >
      <div className="hero-mini-horizon" aria-hidden="true">
        <span className="hero-mini-orb hero-mini-orb-one" />
        <span className="hero-mini-orb hero-mini-orb-two" />
        <span className="hero-mini-orb hero-mini-orb-three" />
      </div>

      <div className="hero-mini-entrance-group">
        <motion.div
          animate={reduceMotion || entrancePhase !== "settled" ? undefined : { y: [0, -7, 0] }}
          transition={floatTransition(5.4)}
          className="hero-mini-float hero-mini-team-float"
          style={windowStyle("health")}
        >
          <TeamProgressWindow reduceMotion={reduceMotion} />
        </motion.div>

        <motion.div
          animate={reduceMotion || entrancePhase !== "settled" ? undefined : { y: [0, 7, 0] }}
          transition={floatTransition(5.8, 0.3)}
          className="hero-mini-float hero-mini-plan-float"
          style={windowStyle("fee")}
          data-testid="hero-window-todays-plan"
        >
           <div
             className="hero-mini-window hero-mini-plan glass-panel rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl"
             onTouchStart={triggerHeroHaptic}
           >
              <StrobeLights />
             <div className="hero-mini-header">
               <p className="text-xs font-semibold tracking-[0.08em] text-foreground/80">মাসিক ফি</p>
               <Wallet className="hero-mini-header-icon h-4 w-4 text-primary" aria-hidden="true" />
             </div>
             <MonthlyFeeChart />
          </div>
        </motion.div>

        <motion.div
          animate={reduceMotion || entrancePhase !== "settled" ? undefined : { y: [0, -6, 0] }}
          transition={floatTransition(5.2, 0.55)}
          className="hero-mini-float hero-mini-projects-float"
          style={windowStyle("attendance")}
        >
           <div
             className="hero-mini-window hero-mini-projects glass-panel rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur-xl"
             data-testid="hero-window-active-projects"
             onTouchStart={triggerHeroHaptic}
           >
              <StrobeLights />
             <div className="hero-mini-header">
               <p className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground">আজকের উপস্থিতি</p>
               <span className="hero-mini-header-icon flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
             </div>
             <AttendanceChart />
           </div>
        </motion.div>

        <motion.div
          animate={reduceMotion || entrancePhase !== "settled" ? undefined : { y: [0, 5, 0] }}
          transition={floatTransition(5.1, 0.2)}
          className="hero-mini-float hero-mini-due-float"
          style={windowStyle("results")}
        >
          <div
            className="hero-mini-window hero-mini-due glass-panel rounded-2xl border border-white/70 bg-white/90 p-3 shadow-xl backdrop-blur-xl"
            data-testid="hero-window-exam-results"
            aria-label="পরীক্ষার ফলাফল রাফি"
            onTouchStart={triggerHeroHaptic}
          >
             <StrobeLights />
            <div className="hero-mini-header">
              <div className="text-center">
                <p className="text-[10px] font-semibold tracking-[0.08em] text-foreground/80">পরীক্ষার ফলাফল</p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">রাফি</p>
              </div>
              <BarChart3 className="hero-mini-header-icon h-4 w-4 text-primary" aria-hidden="true" />
            </div>
             <RadarChart animateOrbit={reduceMotion !== true} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProductPreview() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
      <div className="relative mx-auto max-w-5xl lg:-translate-x-1 lg:scale-100 xl:scale-110" data-testid="dashboard-hero-preview">
        <Card className="browser-mockup glass-panel glow-primary relative overflow-hidden bg-card/80 lg:rotate-1">
          <div className="browser-chrome flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1.5" aria-label="Browser window controls">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
              <span className="ml-2 hidden text-[10px] font-medium text-muted-foreground sm:inline">app.edutrack.school/dashboard</span>
            </div>
            <Badge variant="outline" className="hidden sm:inline-flex">Live workspace</Badge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-card/75 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-4 w-4" aria-hidden="true" /></div>
              <div><p className="text-sm font-semibold">Good morning, Ayesha</p><p className="text-xs text-muted-foreground">Tuesday, 18 June 2024 · Dhaka</p></div>
            </div>
            <div className="flex items-center gap-2"><Badge variant="outline">Admin view</Badge><Button data-testid="button-preview-more" variant="ghost" size="icon" aria-label="More dashboard actions"><MoreHorizontal aria-hidden="true" /></Button></div>
          </div>
          <div className="grid gap-4 bg-muted/30 p-4 sm:p-5 lg:grid-cols-5">
            <div className="space-y-4 lg:col-span-3">
              <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium text-muted-foreground">Overview</p><p className="mt-1 text-xl font-semibold tracking-tight">Tuesday at a glance</p></div><Badge variant="secondary">Live</Badge></div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Students", "1,248", "+8.4%", Users],
                  ["Attendance", "92.6%", "Today", CalendarCheck],
                  ["Fees collected", "৳8.42L", "This month", CircleDollarSign],
                  ["Active classes", "36", "Running now", GraduationCap],
                ].map(([label, value, meta, Icon]) => (
                  <div key={label as string} className="rounded-lg border bg-card p-3" data-testid={`metric-${String(label).toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{label as string}</span><Icon className="h-4 w-4 text-primary" aria-hidden="true" /></div>
                    <p className="mt-3 text-lg font-semibold tracking-tight">{value as string}</p><p className="mt-1 text-xs text-muted-foreground">{meta as string}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Attendance trend</p><p className="text-xs text-muted-foreground">Last 7 school days</p></div><TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" /></div>
                <MiniSparkline />
              </div>
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">Today’s focus</p><Badge variant="secondary">4 items</Badge></div>
                <div className="mt-3 space-y-3">
                  {[["Grade 8 results", "Ready to publish", CheckCircle], ["Fee reminders", "18 families pending", Wallet], ["Staff meeting", "03:30 PM · Room 2", CalendarCheck]].map(([title, meta, Icon]) => (
                    <div key={title as string} className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></div><div className="min-w-0"><p className="truncate text-xs font-semibold">{title as string}</p><p className="text-xs text-muted-foreground">{meta as string}</p></div></div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">Latest notice</p><span className="text-xs text-primary">2 min ago</span></div>
                <div className="mt-3 flex items-start gap-3 rounded-md bg-muted/60 p-3"><Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><div><p className="text-xs font-medium">Parent orientation is tomorrow</p><p className="mt-1 text-xs text-muted-foreground">Notice sent to 248 parents</p></div></div>
              </div>
              <div className="rounded-lg border bg-primary p-4 text-primary-foreground"><div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" aria-hidden="true" /><p className="text-sm font-semibold">Weekly health</p></div><p className="mt-3 text-2xl font-semibold">On track</p><p className="mt-1 text-xs text-primary-foreground/75">All key operations are within target.</p></div>
            </div>
          </div>
        </Card>
        <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-5 -left-5 hidden sm:block">
          <Card className="glass-panel w-48 rounded-xl border-primary/20 shadow-xl" data-testid="card-hero-attendance">
            <CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Attendance</span><Badge variant="secondary">+2.4%</Badge></div><p className="mt-2 text-2xl font-semibold">92.6%</p><p className="mt-1 text-xs text-muted-foreground">vs. last Monday</p></CardContent>
          </Card>
        </motion.div>
        <motion.div animate={reduceMotion ? undefined : { y: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -right-5 -top-5 hidden sm:block">
          <Card className="glass-panel w-48 rounded-xl border-primary/20 shadow-xl" data-testid="card-hero-fees">
            <CardContent className="p-4"><div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-primary" aria-hidden="true" /><span className="text-xs font-medium">Fees collected</span></div><p className="mt-2 text-xl font-semibold">৳8.42L</p><div className="mt-2 flex items-center gap-1 text-xs text-primary"><ArrowDownRight className="h-3 w-3 rotate-180" aria-hidden="true" />12.8% ahead</div></CardContent>
          </Card>
        </motion.div>
        <motion.div animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute -bottom-7 right-8 hidden xl:block">
          <Card className="glass-panel w-44 rounded-xl border-primary/20 shadow-xl" data-testid="card-hero-results">
            <CardContent className="p-4"><div className="flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" aria-hidden="true" /><span className="text-xs font-medium">Exam results</span></div><p className="mt-2 text-xl font-semibold">06 ready</p><p className="mt-1 text-xs text-muted-foreground">Publish when you’re ready</p></CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardShowcase({ variant = "main" }: { variant?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative isolate px-1 sm:px-4 lg:px-8" data-testid={`dashboard-showcase-shell-${variant}`}>
      <Card className="dashboard-showcase-card browser-mockup relative z-10 overflow-hidden bg-card text-card-foreground lg:-rotate-1" data-testid={`dashboard-showcase-${variant}`}>
        <div className="browser-chrome flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-1.5" aria-label="Browser window controls">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
            <span className="ml-2 hidden text-xs font-medium text-muted-foreground sm:inline">edutrack.school · organization overview</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">LIVE</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><School className="h-4 w-4" aria-hidden="true" /></div><div><p className="text-sm font-semibold">Greenfield Learning Centre</p><p className="text-xs text-muted-foreground">All operations · 18 June 2024</p></div></div>
          <Badge variant="secondary">Organization overview</Badge>
        </div>
        <div className="grid gap-4 bg-muted/20 p-4 sm:p-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["Present today", "92.6%", CalendarCheck], ["Collected", "৳8.42L", Wallet], ["Results ready", "06", ClipboardList], ["Open tasks", "18", ClipboardCheck]].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-xl border border-border bg-card p-3 transition-transform hover:-translate-y-1" data-testid={`showcase-stat-${variant}-${String(label).toLowerCase().replace(/\s+/g, "-")}`}><Icon className="h-4 w-4 text-primary" aria-hidden="true" /><p className="mt-3 text-lg font-semibold">{value as string}</p><p className="text-xs text-muted-foreground">{label as string}</p></div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Attendance across classes</p><p className="text-xs text-muted-foreground">A simple signal for a complex day</p></div><Button data-testid={`button-showcase-report-${variant}`} variant="outline" size="sm">View report <ArrowRight aria-hidden="true" /></Button></div>
              <div className="mt-5 space-y-3">
                {[["Grade 6", "96.2%", "h-10"], ["Grade 7", "91.8%", "h-8"], ["Grade 8", "94.5%", "h-9"], ["Grade 9", "88.4%", "h-6"]].map(([grade, value, height]) => (
                  <div key={grade} className="flex items-center gap-3 text-xs"><span className="w-14 text-muted-foreground">{grade}</span><div className="h-2 flex-1 rounded-full bg-muted"><div className={`h-2 rounded-full bg-primary ${height} max-h-2 w-3/4`} /></div><span className="w-12 text-right font-medium">{value}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Needs attention</p><Badge variant="secondary">03</Badge></div><div className="mt-4 space-y-3">{[["18 fee follow-ups", "Finance", Wallet], ["Grade 8 results", "Academic", FileText], ["Route 04 delayed", "Transport", Bus]].map(([title, meta, Icon]) => <div key={title as string} className="flex items-start gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></div><div><p className="text-xs font-semibold">{title as string}</p><p className="mt-1 text-xs text-muted-foreground">{meta as string}</p></div></div>)}</div></div>
            <div className="rounded-xl border border-sidebar-border bg-primary p-4"><div className="flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" /><p className="text-sm font-semibold">Live data, less chasing</p></div><p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Updates from every portal roll into one operating picture.</p></div>
          </div>
        </div>
      </Card>
      <motion.div animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-2 top-12 z-20 hidden xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-attendance-${variant}`}>
          <CardContent className="p-3"><p className="text-xs text-muted-foreground">Attendance</p><p className="mt-1 text-xl font-semibold">92.6%</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-4/5 rounded-full bg-primary" /></div><p className="mt-1 text-xs text-primary">+2.4% this week</p></CardContent>
        </Card>
      </motion.div>
      <motion.div animate={reduceMotion ? undefined : { y: [0, 8, 0] }} transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute -right-2 top-20 z-20 hidden xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-fees-${variant}`}>
          <CardContent className="p-3"><div className="flex items-center gap-2"><Wallet className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">Fees collected</p></div><p className="mt-1 text-lg font-semibold">৳8.42L</p><p className="mt-1 text-xs text-primary">12.8% ahead</p></CardContent>
        </Card>
      </motion.div>
      <motion.div animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }} className="absolute -bottom-5 left-20 z-20 hidden xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-exams-${variant}`}>
          <CardContent className="p-3"><div className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">Exam results</p></div><p className="mt-1 text-lg font-semibold">06 ready</p><p className="mt-1 text-xs text-muted-foreground">Publish with confidence</p></CardContent>
        </Card>
      </motion.div>
      <motion.div animate={reduceMotion ? undefined : { y: [0, 7, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute -bottom-5 right-16 z-20 hidden xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-people-${variant}`}>
          <CardContent className="p-3"><div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">People online</p></div><p className="mt-1 text-lg font-semibold">1,284</p><p className="mt-1 text-xs text-primary">24 teachers active</p></CardContent>
        </Card>
      </motion.div>
      <motion.div animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }} className="absolute -left-2 bottom-20 z-20 hidden 2xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-students-${variant}`}>
          <CardContent className="p-3"><div className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">Students</p></div><p className="mt-1 text-lg font-semibold">1,248</p><p className="mt-1 text-xs text-primary">+8.4% this term</p></CardContent>
        </Card>
      </motion.div>
      <motion.div animate={reduceMotion ? undefined : { y: [0, 7, 0] }} transition={{ duration: 5.3, repeat: Infinity, ease: "easeInOut", delay: 1.1 }} className="absolute -right-2 bottom-24 z-20 hidden 2xl:block">
        <Card className="glass-panel w-40 rounded-xl border-primary/20 shadow-xl" data-testid={`card-showcase-notification-${variant}`}>
          <CardContent className="p-3"><div className="flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-primary" aria-hidden="true" /><p className="text-xs text-muted-foreground">Latest notice</p></div><p className="mt-2 truncate text-xs font-semibold">Parent orientation tomorrow</p><p className="mt-1 text-xs text-primary">Sent to 248 parents</p></CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function PricingCard({ tier, onSelect }: { tier: PlanTier; onSelect: (tier: PlanTier) => void }) {
  const plan = PLAN_CONFIG[tier];
  const pricing = getPricingDisplay(tier);
  const featured = tier === "founder_launch";
  const cadence = plan.billingCycle === "trial" ? `${plan.trialDays} days` : plan.billingCycle === "monthly" ? "month" : "year";
  return (
    <Card className={featured ? "relative flex h-full flex-col border-primary ring-2 ring-primary/20" : "flex h-full flex-col"} data-testid={`card-pricing-${tier}`}>
      {plan.badge && <Badge variant={featured ? "default" : "secondary"} className={featured ? "premium-badge absolute right-4 top-4 px-4 py-1.5 text-sm font-semibold" : "absolute right-4 top-4"}>{plan.badge}</Badge>}
      <CardHeader className="space-y-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{tier === "free_trial" ? <Clock3 className="h-5 w-5" aria-hidden="true" /> : tier === "founder_launch" ? <Sparkles className="h-5 w-5" aria-hidden="true" /> : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}</div><div><CardTitle className="text-xl">{plan.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p></div></CardHeader>
      <CardContent className="flex flex-1 flex-col"><div className="mb-5"><div className="flex items-baseline gap-2"><span className="font-display text-4xl tracking-tight">{pricing.price}</span><span className="text-sm text-muted-foreground">/{cadence}</span></div>{pricing.regularPrice && pricing.savings && <p className="mt-2 text-xs text-muted-foreground"><span className="line-through">{pricing.regularPrice}</span>{" "}<span className="font-medium text-primary">{pricing.savings}</span></p>}{pricing.monthlyEquivalent && <p className="mt-2 text-xs font-medium text-primary">মাসে মাত্র {pricing.monthlyEquivalent}</p>}</div><ul className="mb-6 flex-1 space-y-3">{plan.displayHighlights.map((highlight) => <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{highlight}</span></li>)}</ul><Button data-testid={`button-select-plan-${tier}`} className="w-full" variant={featured ? "default" : "outline"} onClick={() => onSelect(tier)}>{tier === "free_trial" ? "ফ্রি ট্রায়াল শুরু করুন" : tier === "founder_launch" ? "Founder Price নিন" : "Annual Plan নিন"}<ArrowRight aria-hidden="true" /></Button></CardContent>
    </Card>
  );
}

function LandingContent({
  section,
  heroRef,
  reduceMotion,
  openAuth,
  selectPlan,
  heroWindowsEnter,
  landingLayout,
}: {
  section: LandingSection;
  heroRef: React.RefObject<HTMLElement | null>;
  reduceMotion: boolean | null;
  openAuth: (mode: AuthMode, source: string, tier?: PlanTier) => void;
  selectPlan: (tier: PlanTier) => void;
  heroWindowsEnter: boolean;
  landingLayout: LandingPageLayout;
}) {
  if (section === "home") {
    return (
      <section ref={heroRef} className="landing-hero relative overflow-hidden border-b px-4 py-24 text-foreground sm:px-6 sm:py-28 lg:px-8 lg:py-36" data-testid="section-hero">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-chart-4/10 blur-3xl" aria-hidden="true" />
        <motion.div className="relative mx-auto max-w-4xl text-center" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
          <h1 data-testid="text-hero-headline" className="font-display text-[42px] leading-[1.08] tracking-tight sm:text-[58px] lg:text-[76px]">এক প্ল্যাটফর্মে <span className="block text-primary">পুরো স্কুল পরিচালনা করুন</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-foreground/70 sm:text-lg">EduTrack-এর মাধ্যমে attendance, fees, exams, results, notices এবং প্রতিদিনের school operations এক জায়গা থেকে সহজে পরিচালনা করুন।</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button data-testid="button-hero-start-free" size="lg" className="glow-primary" onClick={() => openAuth("signup", "hero_start_free")}>ফ্রি ট্রায়াল শুরু করুন <ArrowRight aria-hidden="true" /></Button>
            <Button data-testid="button-hero-book-demo" size="lg" variant="outline" className="bg-background/80 text-foreground shadow-sm hover:bg-background" onClick={() => openAuth("login", "hero_book_demo")}>ডেমো দেখুন <CalendarCheck aria-hidden="true" /></Button>
          </div>
        </motion.div>
         <HeroMiniWindows
           reduceMotion={reduceMotion}
           enter={heroWindowsEnter}
           layout={landingLayout}
         />
          <div className="relative mx-auto mt-10 max-w-6xl">
            <HeroCarousel
              onCtaClick={(cta, index) => {
                trackFeatureUsed("promo_rail_cta_click", { cta, index });
                openAuth("login", `promo_rail_${index}`);
              }}
            />
          </div>
      </section>
    );
  }

  if (section === "features") {
    return (
      <section className="landing-section border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-features">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Features" title="সব কাজ, একটি পরিষ্কার workspace-এ" description="Attendance থেকে analytics—EduTrack প্রতিদিনের school operations-কে কম manual এবং বেশি visible করে।" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, label }) => (
              <Card key={title} className="group h-full border-border/80 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg" data-testid={`card-feature-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <CardHeader><div className="mb-2 flex items-center justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-5 w-5" aria-hidden="true" /></div><Badge variant="secondary">{label}</Badge></div><CardTitle className="text-xl">{title}</CardTitle></CardHeader>
                <CardContent><p className="leading-relaxed text-muted-foreground">{desc}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-primary">Built for the full school day</p><h3 className="mt-1 text-2xl font-semibold tracking-tight">আপনার team যা ব্যবহার করে, সেটাই একসঙ্গে থাকে</h3><p className="mt-2 max-w-2xl text-muted-foreground">Role-based access, shared records এবং focused views দিয়ে duplication কমান, follow-up সহজ করুন।</p></div><Button onClick={() => openAuth("signup", "features_cta")}>Workspace শুরু করুন <ArrowRight aria-hidden="true" /></Button></div>
          </div>
        </div>
      </section>
    );
  }

  if (section === "solutions") {
    return (
      <section className="landing-section border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-solutions">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Solutions" title="Admin থেকে student—একটি connected workflow" description="যে role-ই ব্যবহার করুক, প্রত্যেকে নিজের কাজের জন্য প্রয়োজনীয় signal পায়।" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {workflow.map(({ num, role, icon: Icon, title, desc }) => (
              <Card key={role} className="relative overflow-hidden border-border/80 p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg" data-testid={`card-solution-${role.toLowerCase()}`}>
                <span className="absolute right-5 top-4 text-4xl font-semibold text-primary/10">{num}</span>
                <div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><div><Badge variant="outline">{role}</Badge><h3 className="mt-3 text-xl font-semibold">{title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{desc}</p></div></div>
              </Card>
            ))}
          </div>
          <div className="mt-10 grid gap-5 rounded-2xl bg-slate-950 p-6 text-white sm:grid-cols-3 sm:p-8">
            {[["One source of truth", "একবার update করুন, team-এর সবাই relevant view-তে দেখুক।"], ["Less follow-up", "Pending কাজ এবং exceptions আলাদা করে চোখে পড়ে।"], ["Ready to grow", "ছোট coaching center থেকে multi-class school—workflow বদলাতে হয় না।"]].map(([title, desc]) => <div key={title} className="space-y-2"><CheckCircle className="h-5 w-5 text-blue-300" aria-hidden="true" /><h3 className="font-semibold">{title}</h3><p className="text-sm leading-relaxed text-white/65">{desc}</p></div>)}
          </div>
        </div>
      </section>
    );
  }

  if (section === "pricing") {
    return (
      <section className="landing-section border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-pricing">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Pricing" title="আপনার স্কুলের জন্য সঠিক প্ল্যান বেছে নিন" description="কোনো hidden charge নেই। Free Trial দিয়ে শুরু করুন, তারপর আপনার growth অনুযায়ী plan বেছে নিন।" />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{(["free_trial", "founder_launch", "annual_premium"] as PlanTier[]).map((tier) => <PricingCard key={tier} tier={tier} onSelect={selectPlan} />)}</div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[["Free Trial", "৭ দিন", "সব premium features দিয়ে workspace দেখে নিন।"], ["Billing", "মাসিক / বার্ষিক", "Founder Launch মাসিক, Annual Premium বছরে billed হয়।"], ["No card required", "আজই শুরু করুন", "Trial শুরু করতে credit card বা upfront payment লাগে না।"]].map(([title, value, desc]) => <Card key={title} className="border-border/80 p-5"><p className="text-sm font-medium text-muted-foreground">{title}</p><p className="mt-2 text-xl font-semibold">{value}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p></Card>)}
          </div>
        </div>
      </section>
    );
  }

  if (section === "resources") {
    return (
      <section className="surface-lavender border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-resources">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2"><SectionHeading eyebrow="Resources" title="শুরু করার আগে যা জানা দরকার" description="FAQs, Help Center এবং সরাসরি support—সবকিছু এক জায়গায়।" align="left" /><div className="mt-6 flex flex-wrap gap-3"><Button variant="outline" asChild><a href="/help">Help Center <ArrowRight aria-hidden="true" /></a></Button><Button variant="outline" onClick={() => openAuth("login", "resources_contact")}>যোগাযোগ করুন <MessageCircle aria-hidden="true" /></Button></div></div>
          <Card className="rounded-2xl bg-background px-5 shadow-sm lg:col-span-3"><Accordion type="single" collapsible className="w-full">{faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger data-testid={`button-faq-${index}`}>{faq.question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></Card>
        </div>
      </section>
    );
  }

  return (
    <section className="landing-section border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-about">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="About EduTrack" title="বাংলাদেশের শিক্ষা প্রতিষ্ঠানকে আরও organized করার জন্য" description="EduTrack এমন একটি dependable operating layer, যেখানে school-এর মানুষ, process এবং progress একই workspace-এ যুক্ত থাকে।" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[["Clarity", "প্রতিদিন কী হচ্ছে এবং কোথায় attention দরকার—এক নজরে বোঝা যায়।"], ["Connection", "Admin, teacher, parent এবং student একই তথ্যের চারটি focused view পায়।"], ["Confidence", "Role-based access এবং organization scope data-কে সঠিক জায়গায় রাখে।"]].map(([title, desc], index) => <Card key={title} className="p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">0{index + 1}</div><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{desc}</p></Card>)}
        </div>
        <div className="mt-10 rounded-2xl border bg-muted/30 p-6 text-center sm:p-8"><h3 className="text-2xl font-semibold">আপনার school-এর জন্য workspace তৈরি করুন</h3><p className="mx-auto mt-2 max-w-2xl text-muted-foreground">আজই শুরু করুন এবং প্রথম দিন থেকেই operations-এর উপর আরও পরিষ্কার control পান।</p><Button className="mt-5" onClick={() => openAuth("signup", "about_cta")}>Sign Up করুন <ArrowRight aria-hidden="true" /></Button></div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroWindowsEnter, setHeroWindowsEnter] = useState(
    () =>
      sessionStorage.getItem(HERO_WINDOWS_ENTRANCE_KEY) === "1" ||
      sessionStorage.getItem(PROMOTION_SESSION_KEY) === "1",
  );
  const reduceMotion = useReducedMotion();
  const landingLayout = usePublicLandingLayout() ?? DEFAULT_LANDING_LAYOUT;
  const heroRef = useRef<HTMLElement>(null);
  const [location] = useLocation();
  const section: LandingSection = location === "/features"
    ? "features"
    : location === "/solutions"
      ? "solutions"
      : location === "/pricing"
        ? "pricing"
        : location === "/resources"
          ? "resources"
          : location === "/about"
            ? "about"
            : "home";

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || reduceMotion) return;
    const currentHero = hero;

    function updateSpotlight(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const bounds = currentHero.getBoundingClientRect();
      currentHero.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      currentHero.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      currentHero.style.setProperty("--pointer-opacity", "1");
    }

    function hideSpotlight() {
      currentHero.style.setProperty("--pointer-opacity", "0");
    }

    currentHero.addEventListener("pointermove", updateSpotlight);
    currentHero.addEventListener("pointerleave", hideSpotlight);
    return () => {
      currentHero.removeEventListener("pointermove", updateSpotlight);
      currentHero.removeEventListener("pointerleave", hideSpotlight);
    };
  }, [reduceMotion]);

  function openAuth(mode: AuthMode, source: string, tier: PlanTier = "free_trial") {
    trackFeatureUsed("landing_cta_click", { mode, source });
    setAuthMode(mode);
    setSignupTier(tier);
    setShowAuth(true);
  }

  const handlePromotionDismiss = useCallback(() => {
    sessionStorage.setItem(HERO_WINDOWS_ENTRANCE_KEY, "1");
    setHeroWindowsEnter(true);
  }, []);

  const whatsappMsg = encodeURIComponent("আমি EduTrack সম্পর্কে জানতে চাই। একটু বিস্তারিত বলবেন?");
  const whatsappNumber = "8801632905056";
  const [signupTier, setSignupTier] = useState<PlanTier>("free_trial");
  function selectPlan(tier: PlanTier) {
    trackFeatureUsed("pricing_cta_click", { plan: tier });
    openAuth("signup", `pricing_${tier}`, tier);
  }
  const navItems = [
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/solutions" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
  ];

  return (
    <div className="landing-shell min-h-screen overflow-x-clip bg-background text-foreground" id="top">
       {showAuth && <AuthPanel defaultMode={authMode} defaultTier={signupTier} onClose={() => setShowAuth(false)} />}
      <PromotionPopup
        onDismiss={handlePromotionDismiss}
        onCtaClick={(cta, index) => { trackFeatureUsed("promo_popup_cta_click", { cta, index }); openAuth("login", `promo_popup_${index}`); }}
      />
      <Button asChild variant="secondary" className="fixed bottom-4 right-4 z-40 rounded-full sm:bottom-6 sm:right-6">
        <a data-testid="link-whatsapp-floating" href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("whatsapp_contact_click")} aria-label="Contact EduTrack on WhatsApp"><MessageCircle aria-hidden="true" /><span>Demo নিন</span></a>
      </Button>

      <header className="landing-nav glass-panel sticky top-4 z-30 mx-3 rounded-2xl border bg-background/75 backdrop-blur-xl sm:mx-5 lg:mx-auto lg:max-w-[calc(80rem-2rem)]" data-testid="navigation-header">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
           <a data-testid="link-logo" href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="EduTrack home"><span data-app-logo className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span><span className="text-lg">EduTrack</span><Badge variant="secondary" className="hidden lg:inline-flex">OS for schools</Badge></a>
            <nav className="hidden items-center gap-4 text-[13px] font-medium text-muted-foreground md:flex lg:gap-7" aria-label="Primary navigation">{navItems.map(({ label, href }) => <a key={label} data-testid={`link-nav-${label.toLowerCase()}`} className="landing-nav-link whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href}>{label}</a>)}</nav>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden items-center gap-1 sm:flex">
                <Button data-testid="button-login-header" variant="ghost" size="sm" className="landing-nav-login px-3 text-sm font-medium" onClick={() => openAuth("login", "header")}>Log in</Button>
                <Button data-testid="button-signup-header" size="sm" className="landing-nav-signup rounded-full px-4 text-sm font-semibold shadow-sm" onClick={() => openAuth("signup", "header_signup")}>Sign Up</Button>
              </div>
              <Button data-testid="button-mobile-menu" variant="outline" size="icon" className="md:hidden" aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>{mobileNavOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</Button>
            </div>
        </div>
         {mobileNavOpen && <div className="border-t bg-background px-4 py-4 md:hidden"><nav className="mx-auto grid max-w-7xl gap-1" aria-label="Mobile navigation" data-testid="nav-mobile">{navItems.map(({ label, href }) => <a key={label} data-testid={`link-mobile-${label.toLowerCase()}`} className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href} onClick={() => setMobileNavOpen(false)}>{label}</a>)}</nav><div className="mt-3 flex gap-2 border-t pt-3 sm:hidden"><Button data-testid="button-login-mobile" variant="ghost" className="flex-1" onClick={() => { setMobileNavOpen(false); openAuth("login", "header_mobile"); }}>Log in</Button><Button data-testid="button-signup-mobile" className="flex-1 rounded-full" onClick={() => { setMobileNavOpen(false); openAuth("signup", "header_mobile_signup"); }}>Sign Up</Button></div></div>}
      </header>

       <main>
         <LandingContent
           section={section}
           heroRef={heroRef}
           reduceMotion={reduceMotion}
           openAuth={openAuth}
           selectPlan={selectPlan}
           heroWindowsEnter={heroWindowsEnter}
            landingLayout={landingLayout}
         />
       </main>

        <footer id="contact" className="landing-footer text-white" data-testid="footer-site"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8"><div className="space-y-4 lg:col-span-4"><a data-testid="link-footer-logo" href="/" className="flex items-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span><span className="text-lg">EduTrack</span></a><p className="max-w-xs text-sm leading-relaxed text-white/70">বাংলাদেশের school এবং coaching center-এর জন্য সহজ, নির্ভরযোগ্য management platform।</p><div className="flex items-center gap-2"><a data-testid="link-footer-facebook" href="https://facebook.com/edutrack" target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("footer_social_click", { channel: "facebook" })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="EduTrack on Facebook"><span aria-hidden="true" className="font-semibold">f</span></a><a data-testid="link-footer-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("footer_social_click", { channel: "whatsapp" })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="EduTrack on WhatsApp"><MessageCircle className="h-4 w-4" aria-hidden="true" /></a></div></div><FooterColumn title="Product" links={[{ label: "Features", href: "/features" }, { label: "Solutions", href: "/solutions" }, { label: "Pricing", href: "/pricing" }, { label: "ফ্রি ট্রায়াল", onClick: () => openAuth("signup", "footer_product") }]} /><FooterColumn title="Support us" links={[{ label: "প্রশ্নোত্তর", href: "/resources" }, { label: "Help Center", href: "/help" }, { label: "WhatsApp Support", href: `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`, external: true }]} /><div className="space-y-4 lg:col-span-3"><h3 className="text-sm font-semibold">Address & contact</h3><ul className="space-y-3 text-sm text-white/70"><li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" /><span>Dhaka, Bangladesh<br />শিক্ষা প্রতিষ্ঠান পরিচালনার জন্য</span></li><li><a data-testid="link-contact-email" href="mailto:support@edutrack.com.bd" className="flex items-center gap-2 transition-colors hover:text-blue-200"><Mail className="h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />support@edutrack.com.bd</a></li><li><a data-testid="link-contact-phone" href={`tel:+${whatsappNumber}`} className="flex items-center gap-2 transition-colors hover:text-blue-200"><Phone className="h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />+880 1632-905056</a></li><li><Button data-testid="button-contact-demo" variant="outline" size="sm" className="border-white/25 text-white hover:bg-white/10" onClick={() => openAuth("login", "footer_contact")}>Book a demo <Send aria-hidden="true" /></Button></li></ul></div></div><div className="border-t border-white/15"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>© 2026 EduTrack. Made in Bangladesh.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><a data-testid="link-footer-privacy" className="hover:text-blue-200" href="/privacy">Privacy Policy</a><a data-testid="link-footer-terms" className="hover:text-blue-200" href="/terms">Terms of Service</a><a data-testid="link-footer-refund" className="hover:text-blue-200" href="/refund">Refund Policy</a><button data-testid="button-footer-login" className="hover:text-blue-200" onClick={() => openAuth("login", "footer_bottom")}>Login</button></div></div></div></footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href?: string; external?: boolean; onClick?: () => void }> }) {
  return <div className="space-y-4"><h3 className="text-sm font-semibold text-white">{title}</h3><ul className="space-y-3 text-sm text-white/70">{links.map((link) => <li key={link.label}>{link.onClick ? <button data-testid={`button-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`} className="transition-colors hover:text-blue-200" onClick={link.onClick}>{link.label}</button> : <a data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="transition-colors hover:text-blue-200">{link.label}</a>}</li>)}</ul></div>;
}

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/wrong-password": "Password ভুল হয়েছে।",
    "auth/user-not-found": "এই email-এ কোনো account নেই।",
    "auth/email-already-in-use": "Email ইতিমধ্যে registered। Login করুন বা অন্য email ব্যবহার করুন।",
    "auth/account-exists": "এই Google account-এর EduTrack profile আগে থেকেই আছে। Login করুন।",
    "auth/weak-password": "Password কমপক্ষে ৬ characters হতে হবে।",
    "auth/invalid-email": "Email address সঠিক নয়।",
    "auth/invalid-credential": "Email বা Password ভুল হয়েছে।",
    "auth/operation-not-allowed": "এই signup method Firebase-এ চালু করা নেই। Admin configuration check করুন।",
    "auth/configuration-not-found": "Firebase authentication configuration পাওয়া যায়নি।",
    "auth/network-request-failed": "Internet connection check করে আবার চেষ্টা করুন।",
    "permission-denied": "Workspace setup Firebase permission-এর কারণে আটকে গেছে। Firestore rules update করার পর আবার চেষ্টা করুন।",
    "failed-precondition": "Firebase setup অসম্পূর্ণ। Firestore database ও rules configuration check করুন।",
    "unavailable": "Firebase service এখন সাময়িকভাবে unavailable। একটু পরে আবার চেষ্টা করুন।",
    "deadline-exceeded": "Firebase response পেতে দেরি হচ্ছে। আবার চেষ্টা করুন।",
    "already-exists": "এই workspace আগে থেকেই তৈরি হয়েছে। Login করে চেষ্টা করুন।",
  };
  return map[code] ?? "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}