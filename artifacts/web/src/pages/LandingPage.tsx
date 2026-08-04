import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
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
  GraduationCap,
  LayoutDashboard,
  Library,
  Loader2,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Phone,
  PieChart,
  Receipt,
  RefreshCw,
  School,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  PLAN_CONFIG,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { trackFeatureUsed, trackLogin, trackLoginFailed } from "@/lib/analytics";
import { PromotionPopup } from "@/components/PromotionPopup";
import { HeroCarousel } from "@/components/HeroCarousel";
import { usePublicTestimonials } from "@/lib/public-hooks";

const googleProvider = new GoogleAuthProvider();

type AuthMode = "login" | "reset";

const features = [
  { icon: CalendarCheck, title: "Attendance", desc: "Mark attendance in seconds and see patterns before they become problems.", label: "Daily rhythm" },
  { icon: Wallet, title: "Fees", desc: "Track collection, pending payments, receipts, and follow-ups in one place.", label: "Healthy cash flow" },
  { icon: ClipboardList, title: "Exams", desc: "Plan assessments, organize subjects, and keep every deadline visible.", label: "Better preparation" },
  { icon: BarChart3, title: "Results", desc: "Publish clear results with the context students and families need.", label: "Visible progress" },
  { icon: ClipboardCheck, title: "Assignments", desc: "Share homework, due dates, and completion status without message trails.", label: "Classroom ready" },
  { icon: Bell, title: "Notices", desc: "Send one dependable update to the right people, at the right time.", label: "No missed updates" },
  { icon: Library, title: "Library", desc: "Keep resources, lending, and returns easy for every learning group.", label: "Shared resources" },
  { icon: Bus, title: "Transport", desc: "Bring routes, stops, and travel information into the daily picture.", label: "Clear logistics" },
  { icon: Users, title: "Parent Portal", desc: "Give families a calm view of attendance, fees, notices, and progress.", label: "Family trust" },
  { icon: GraduationCap, title: "Teacher Portal", desc: "Let teachers stay close to the work that matters in their classrooms.", label: "More teaching time" },
  { icon: BookOpen, title: "Student Portal", desc: "Make schedules, assignments, results, and next steps easy to follow.", label: "Student ownership" },
  { icon: PieChart, title: "Analytics", desc: "Turn everyday records into decisions your team can act on.", label: "Useful signal" },
];

const roleModules = [
  { icon: LayoutDashboard, role: "Admin", title: "See the whole school.", desc: "Operations, exceptions, payments, and performance in one focused command center." },
  { icon: GraduationCap, role: "Teacher", title: "Keep teaching in motion.", desc: "Attendance, assignments, routines, and results stay close to the classroom." },
  { icon: ShieldCheck, role: "Parent", title: "Know what matters.", desc: "Families get the right updates without being pulled into operational noise." },
  { icon: BookOpen, role: "Student", title: "Own the next step.", desc: "Students can follow their timetable, work, results, and progress with confidence." },
];

const workflow = [
  { num: "01", role: "Admin", icon: LayoutDashboard, title: "Sets the context", desc: "The day begins with one view of people, payments, attendance, and exceptions." },
  { num: "02", role: "Teacher", icon: GraduationCap, title: "Updates the work", desc: "Classroom activity flows into the same record without duplicate entry." },
  { num: "03", role: "Parent", icon: Users, title: "Sees the signal", desc: "Families receive timely, relevant updates about the learner they support." },
  { num: "04", role: "Student", icon: BookOpen, title: "Moves forward", desc: "The next class, assignment, result, or goal is always close at hand." },
];

const whyEduTrackPoints = [
  { icon: ShieldCheck, title: "One source of truth", desc: "Every role sees the same current context, shaped around what they need to do." },
  { icon: Clock3, title: "Less admin, more progress", desc: "Turn repetitive updates into simple routines your team can complete in minutes." },
  { icon: Activity, title: "Signal over noise", desc: "Clear status and useful trends help teams decide what deserves attention next." },
  { icon: Sparkles, title: "Dependable by design", desc: "A calm, focused experience that feels trustworthy on the busiest school day." },
];

const faqs = [
  { question: "EduTrack কী ধরনের school বা coaching center-এর জন্য?", answer: "EduTrack ছোট থেকে বড় school এবং coaching center-এর জন্য তৈরি। Organization admin, teachers, parents এবং students — প্রত্যেকে নিজের role অনুযায়ী একই workspace ব্যবহার করতে পারে।" },
  { question: "শুরু করতে কি কোনো credit card লাগবে?", answer: "না। Free Trial শুরু করতে credit card দরকার নেই। আপনি workspace সেটআপ করে platform-এর core workflow আগে দেখে নিতে পারবেন।" },
  { question: "আমি কি আমার teachers, parents ও students-দের যোগ করতে পারব?", answer: "হ্যাঁ। Organization setup করার পরে team-কে Organization Code দিয়ে join করাতে পারবেন। প্রত্যেকে তার role অনুযায়ী portal access পাবে।" },
  { question: "আমার data কি নিরাপদ থাকবে?", answer: "EduTrack role-based access, cloud storage এবং regular backup workflow-এর মাধ্যমে organization data পরিচালনা করতে সাহায্য করে। Access সবসময় user role এবং organization scope অনুযায়ী থাকে।" },
  { question: "পরে plan পরিবর্তন বা cancel করা যাবে?", answer: "হ্যাঁ। Plan অনুযায়ী billing cycle এবং feature access আলাদা হতে পারে। আপনার account থেকে subscription settings পরিচালনা করা যাবে।" },
];

function AuthPanel({ defaultMode, onClose }: { defaultMode: AuthMode; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      trackLogin("google");
      onClose();
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        trackLoginFailed("google", err.code ?? "unknown");
        toast({ title: "Google Sign-In Error", description: friendlyError(err.code), variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
        setMode("login");
      } else {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);
        trackLogin("email");
        onClose();
      }
    } catch (err: any) {
      trackLoginFailed("email", err.code ?? "unknown");
      toast({ title: "Login Error", description: friendlyError(err.code), variant: "destructive" });
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
              <DialogTitle>{mode === "login" ? "Sign In to EduTrack" : "Reset Password"}</DialogTitle>
              <DialogDescription className="mt-1">{mode === "login" ? "Enter your email and password to continue" : "Enter your email to receive a reset link"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input data-testid="input-auth-email" id="auth-email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          </div>
          {mode === "login" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="auth-password">Password</Label>
                <Button data-testid="button-forgot-password" type="button" variant="link" size="sm" className="h-auto px-0" onClick={() => setMode("reset")}>Forgot Password?</Button>
              </div>
              <div className="relative">
                <Input data-testid="input-auth-password" id="auth-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} required className="pr-12" />
                <Button data-testid="button-toggle-password" type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </div>
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
              {mode === "login" ? "Login" : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </form>
        {mode === "login" && (
          <div className="space-y-3">
            <div className="relative flex items-center">
              <div className="w-full border-t" />
              <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">or</span>
            </div>
            <Button data-testid="button-google-login" type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
              <span className="font-semibold text-primary" aria-hidden="true">G</span> Continue with Google
            </Button>
          </div>
        )}
        {mode === "reset" && <Button data-testid="button-back-login" type="button" variant="link" className="mx-auto" onClick={() => setMode("login")}>Back to Login</Button>}
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

function ProductPreview() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
      <div className="relative mx-auto max-w-4xl" data-testid="dashboard-hero-preview">
        <Card className="glass-panel overflow-hidden border-primary/20 bg-card/80 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/70 px-4 py-3 sm:px-5">
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
        <Card className="absolute -bottom-4 -left-4 hidden w-48 border-primary/20 bg-card/95 shadow-lg sm:block" data-testid="card-hero-attendance">
          <CardContent className="p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Attendance</span><Badge variant="secondary">+2.4%</Badge></div><p className="mt-2 text-2xl font-semibold">92.6%</p><p className="mt-1 text-xs text-muted-foreground">vs. last Monday</p></CardContent>
        </Card>
        <Card className="absolute -right-4 -top-4 hidden w-48 border-primary/20 bg-card/95 shadow-lg sm:block" data-testid="card-hero-fees">
          <CardContent className="p-4"><div className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-primary" aria-hidden="true" /><span className="text-xs font-medium">Fees collected</span></div><p className="mt-2 text-xl font-semibold">৳8.42L</p><div className="mt-2 flex items-center gap-1 text-xs text-primary"><ArrowDownRight className="h-3 w-3 rotate-180" aria-hidden="true" />12.8% ahead</div></CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function DashboardShowcase() {
  return (
    <Card className="overflow-hidden border-primary/20 bg-sidebar text-sidebar-foreground shadow-xl" data-testid="dashboard-showcase">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sidebar-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><School className="h-4 w-4" aria-hidden="true" /></div><div><p className="text-sm font-semibold">Greenfield Learning Centre</p><p className="text-xs text-sidebar-foreground/60">All operations · 18 June 2024</p></div></div>
        <Badge variant="secondary">Organization overview</Badge>
      </div>
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Present today", "92.6%", CalendarCheck], ["Collected", "৳8.42L", Wallet], ["Results ready", "06", ClipboardList], ["Open tasks", "18", ClipboardCheck]].map(([label, value, Icon]) => (
              <div key={label as string} className="rounded-lg border border-sidebar-border bg-sidebar/70 p-3" data-testid={`showcase-stat-${String(label).toLowerCase().replace(/\s+/g, "-")}`}><Icon className="h-4 w-4 text-primary" aria-hidden="true" /><p className="mt-3 text-lg font-semibold">{value as string}</p><p className="text-xs text-sidebar-foreground/60">{label as string}</p></div>
            ))}
          </div>
          <div className="rounded-lg border border-sidebar-border bg-sidebar/70 p-4 sm:p-5">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Attendance across classes</p><p className="text-xs text-sidebar-foreground/60">A simple signal for a complex day</p></div><Button data-testid="button-showcase-report" variant="outline" size="sm" className="text-sidebar-foreground">View report <ArrowRight aria-hidden="true" /></Button></div>
            <div className="mt-5 space-y-3">
              {[["Grade 6", "96.2%", "h-10"], ["Grade 7", "91.8%", "h-8"], ["Grade 8", "94.5%", "h-9"], ["Grade 9", "88.4%", "h-6"]].map(([grade, value, height]) => (
                <div key={grade} className="flex items-center gap-3 text-xs"><span className="w-14 text-sidebar-foreground/65">{grade}</span><div className="h-2 flex-1 rounded-full bg-sidebar-border"><div className={`h-2 rounded-full bg-primary ${height} max-h-2 w-3/4`} /></div><span className="w-12 text-right font-medium">{value}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-lg border border-sidebar-border bg-sidebar/70 p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Needs attention</p><Badge variant="secondary">03</Badge></div><div className="mt-4 space-y-3">{[["18 fee follow-ups", "Finance", Wallet], ["Grade 8 results", "Academic", FileText], ["Route 04 delayed", "Transport", Bus]].map(([title, meta, Icon]) => <div key={title as string} className="flex items-start gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary"><Icon className="h-4 w-4" aria-hidden="true" /></div><div><p className="text-xs font-semibold">{title as string}</p><p className="mt-1 text-xs text-sidebar-foreground/60">{meta as string}</p></div></div>)}</div></div>
          <div className="rounded-lg border border-sidebar-border bg-primary p-4"><div className="flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" /><p className="text-sm font-semibold">Live data, less chasing</p></div><p className="mt-3 text-sm leading-relaxed text-primary-foreground/80">Updates from every portal roll into one operating picture.</p></div>
        </div>
      </div>
    </Card>
  );
}

function PricingCard({ tier, onSelect }: { tier: PlanTier; onSelect: (tier: PlanTier) => void }) {
  const plan = PLAN_CONFIG[tier];
  const pricing = getPricingDisplay(tier);
  const featured = tier === "founder_launch";
  const cadence = plan.billingCycle === "trial" ? `${plan.trialDays} days` : plan.billingCycle === "monthly" ? "month" : "year";
  return (
    <Card className={featured ? "relative flex h-full flex-col border-primary ring-2 ring-primary/20" : "flex h-full flex-col"} data-testid={`card-pricing-${tier}`}>
      {plan.badge && <Badge variant={featured ? "default" : "secondary"} className="absolute right-4 top-4">{plan.badge}</Badge>}
      <CardHeader className="space-y-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{tier === "free_trial" ? <Clock3 className="h-5 w-5" aria-hidden="true" /> : tier === "founder_launch" ? <Sparkles className="h-5 w-5" aria-hidden="true" /> : <ShieldCheck className="h-5 w-5" aria-hidden="true" />}</div><div><CardTitle className="text-xl">{plan.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p></div></CardHeader>
      <CardContent className="flex flex-1 flex-col"><div className="mb-5"><div className="flex items-baseline gap-2"><span className="font-display text-4xl tracking-tight">{pricing.price}</span><span className="text-sm text-muted-foreground">/{cadence}</span></div>{pricing.regularPrice && pricing.savings && <p className="mt-2 text-xs text-muted-foreground"><span className="line-through">{pricing.regularPrice}</span>{" "}<span className="font-medium text-primary">{pricing.savings}</span></p>}{pricing.monthlyEquivalent && <p className="mt-2 text-xs font-medium text-primary">মাসে মাত্র {pricing.monthlyEquivalent}</p>}</div><ul className="mb-6 flex-1 space-y-3">{plan.displayHighlights.map((highlight) => <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{highlight}</span></li>)}</ul><Button data-testid={`button-select-plan-${tier}`} className="w-full" variant={featured ? "default" : "outline"} onClick={() => onSelect(tier)}>{tier === "free_trial" ? "ফ্রি ট্রায়াল শুরু করুন" : tier === "founder_launch" ? "Founder Price নিন" : "Annual Plan নিন"}<ArrowRight aria-hidden="true" /></Button></CardContent>
    </Card>
  );
}

function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = usePublicTestimonials();
  if (!isLoading && testimonials.length === 0) return null;
  return (
    <section id="testimonials" className="scroll-mt-20 border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-testimonials">
      <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="From the field" title="The work feels lighter when everyone is looking at the same day." description="EduTrack ব্যবহারকারী school এবং coaching center-দের বাস্তব অভিজ্ঞতা।" />
        {isLoading ? <div className="mt-10 grid gap-4 md:grid-cols-3">{[0, 1, 2].map((item) => <Card key={item} className="space-y-4 p-6"><Skeleton className="h-4 w-24" /><Skeleton className="h-16 w-full" /><Skeleton className="h-8 w-32" /></Card>)}</div> : <div className="mt-10 grid gap-4 md:grid-cols-3">{testimonials.map((testimonial) => <Card key={testimonial.id} className="flex flex-col gap-5 p-6" data-testid={`card-testimonial-${testimonial.id}`}><div className="flex gap-1" role="img" aria-label={`${testimonial.rating || 5} out of 5 stars`}>{Array.from({ length: testimonial.rating || 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />)}</div><p className="flex-1 text-base leading-relaxed text-muted-foreground">“{testimonial.text}”</p><div className="flex items-center gap-3 border-t pt-4">{testimonial.avatar ? <img src={testimonial.avatar} alt={testimonial.name} className="h-9 w-9 rounded-full border object-cover" width="36" height="36" /> : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground" aria-hidden="true">{testimonial.name?.charAt(0)?.toUpperCase() ?? "?"}</div>}<div><p className="text-sm font-semibold">{testimonial.name}</p>{testimonial.role && <p className="text-xs text-muted-foreground">{testimonial.role}</p>}</div></div></Card>)}</div>}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  function openAuth(mode: AuthMode, source: string) {
    trackFeatureUsed("landing_cta_click", { mode, source });
    setAuthMode(mode);
    setShowAuth(true);
  }

  const whatsappMsg = encodeURIComponent("আমি EduTrack সম্পর্কে জানতে চাই। একটু বিস্তারিত বলবেন?");
  const whatsappNumber = "8801632905056";
  function selectPlan(tier: PlanTier) {
    trackFeatureUsed("pricing_cta_click", { plan: tier });
    openAuth("login", `pricing_${tier}`);
  }
  const navItems = [["Features", "#features"], ["Solutions", "#solutions"], ["Pricing", "#pricing"], ["FAQ", "#faq"], ["Contact", "#contact"]];

  return (
    <div className="min-h-screen bg-background text-foreground" id="top">
      {showAuth && <AuthPanel defaultMode={authMode} onClose={() => setShowAuth(false)} />}
      <PromotionPopup onCtaClick={(cta, index) => { trackFeatureUsed("promo_popup_cta_click", { cta, index }); openAuth("login", `promo_popup_${index}`); }} />
      <Button asChild variant="secondary" className="fixed bottom-4 right-4 z-40 rounded-full sm:bottom-6 sm:right-6">
        <a data-testid="link-whatsapp-floating" href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("whatsapp_contact_click")} aria-label="Contact EduTrack on WhatsApp"><MessageCircle aria-hidden="true" /><span>Demo নিন</span></a>
      </Button>

      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl" data-testid="navigation-header">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a data-testid="link-logo" href="#top" className="flex items-center gap-2 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="EduTrack home"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span><span className="text-lg">EduTrack</span><Badge variant="secondary" className="hidden sm:inline-flex">OS for schools</Badge></a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex" aria-label="Primary navigation">{navItems.map(([label, href]) => <a key={href} data-testid={`link-nav-${label.toLowerCase()}`} className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href}>{label}</a>)}</nav>
          <div className="flex items-center gap-2"><Button data-testid="button-login-header" variant="ghost" size="sm" onClick={() => openAuth("login", "header")}>Login</Button><Button data-testid="button-start-header" size="sm" onClick={() => openAuth("login", "header")}>Get Started <ArrowRight aria-hidden="true" /></Button><Button data-testid="button-mobile-menu" variant="outline" size="icon" className="lg:hidden" aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((open) => !open)}>{mobileNavOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</Button></div>
        </div>
        {mobileNavOpen && <nav className="border-t bg-background px-4 py-4 lg:hidden" aria-label="Mobile navigation" data-testid="nav-mobile"><div className="mx-auto grid max-w-7xl gap-1">{navItems.map(([label, href]) => <a key={href} data-testid={`link-mobile-${label.toLowerCase()}`} className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={href} onClick={() => setMobileNavOpen(false)}>{label}</a>)}</div></nav>}
      </header>

      <main>
        <section className="relative overflow-hidden border-b bg-sidebar px-4 py-16 text-sidebar-foreground sm:px-6 lg:px-8 lg:py-24" data-testid="section-hero">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" /><div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-accent/40 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <motion.div className="max-w-2xl lg:col-span-5" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}>
              <Badge variant="secondary" className="mb-5">The calm operating system for schools</Badge>
              <h1 data-testid="text-hero-headline" className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-7xl">One platform to manage <span className="block text-primary">every school.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sidebar-foreground/75 sm:text-lg">EduTrack gives administrators, teachers, parents, and students one trustworthy source of truth — from the first attendance mark to the final report.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button data-testid="button-hero-start-free" size="lg" onClick={() => openAuth("login", "hero_start_free")}>Start Free <ArrowRight aria-hidden="true" /></Button><Button data-testid="button-hero-book-demo" size="lg" variant="outline" className="bg-background/10 text-sidebar-foreground hover:bg-background/20" onClick={() => openAuth("login", "hero_book_demo")}>Book Demo <CalendarCheck aria-hidden="true" /></Button></div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-sidebar-foreground/70">{["No credit card", "Set up in minutes", "Made for busy teams"].map((signal) => <span key={signal} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{signal}</span>)}</div>
              <p className="mt-8 text-sm text-sidebar-foreground/60">আজকের কাজ, আগামীকালের confidence.</p>
            </motion.div>
            <div className="lg:col-span-7"><ProductPreview /></div>
          </div>
        </section>

        <section className="border-b px-4 py-8 sm:px-6 lg:px-8" aria-label="Trusted by school teams" data-testid="section-trusted-by"><div className="mx-auto flex max-w-7xl flex-col items-center gap-5 sm:flex-row sm:justify-between"><p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-left">Trusted by thoughtful education teams</p><div className="grid w-full grid-cols-2 gap-3 text-center sm:flex sm:w-auto sm:items-center sm:gap-8">{["Northbridge Academy", "BrightPath", "The Learning Room", "Cedar Grove"].map((name) => <span data-testid={`text-trusted-${name.toLowerCase().replace(/\s+/g, "-")}`} key={name} className="text-sm font-semibold tracking-tight text-muted-foreground/80">{name}</span>)}</div></div></section>

        <section id="overview" className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-overview"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-5"><SectionHeading eyebrow="A better daily rhythm" title="Less tab-switching. More learning." description="EduTrack brings your operational records and your people into one focused workspace — so the next action is clear." align="left" /><div className="mt-8 flex flex-wrap gap-2"><Badge variant="outline">Admin</Badge><Badge variant="outline">Teacher</Badge><Badge variant="outline">Parent</Badge><Badge variant="outline">Student</Badge></div></div><div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">{whyEduTrackPoints.map(({ icon: Icon, title, desc }, index) => <motion.div key={title} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}><Card data-testid={`card-overview-point-${index}`} className="h-full p-5 transition-colors hover:border-primary/40"><Icon className="h-5 w-5 text-primary" aria-hidden="true" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p></Card></motion.div>)}</div></div></section>

        <section id="features" className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-features"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Everything connected" title="The details that keep a school moving." description="A complete operational layer for attendance, fees, learning, logistics, and the people who make progress happen." /><div className="mt-10 grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">{features.map(({ icon: Icon, title, desc, label }, index) => <motion.div key={title} className={index === 0 ? "col-span-4 md:col-span-4 lg:col-span-4" : index === 1 ? "col-span-4 md:col-span-4 lg:col-span-4" : "col-span-4 md:col-span-4 lg:col-span-3"} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} whileHover={reduceMotion ? undefined : { y: -4 }} viewport={{ once: true, amount: 0.15 }}><Card data-testid={`card-feature-${index}`} className="group h-full p-5 transition-colors hover:border-primary/40"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><span className="text-xs text-muted-foreground">{label}</span></div><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p><div className="mt-5 flex items-center gap-2 text-xs font-medium text-primary">Explore module <ArrowRight className="h-3 w-3" aria-hidden="true" /></div></Card></motion.div>)}</div></div></section>

        <section id="solutions" className="scroll-mt-20 border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-solutions"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-12 lg:items-end"><SectionHeading eyebrow="Solutions for every role" title="One school. Four focused experiences." description="The same trustworthy record, shaped into a view that helps each person do their best work." align="left" /><div className="lg:col-span-4 lg:justify-self-end"><Button data-testid="button-solutions-demo" variant="outline" onClick={() => openAuth("login", "solutions")}>See the workspace <ArrowRight aria-hidden="true" /></Button></div></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{roleModules.map(({ icon: Icon, role, title, desc }, index) => <motion.div key={role} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}><Card data-testid={`card-solution-${index}`} className="h-full p-5"><div className="flex items-center justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><Badge variant="secondary">{role}</Badge></div><h3 className="mt-6 text-lg font-semibold leading-tight">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p></Card></motion.div>)}</div></div></section>

        <section className="border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-dashboard"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-12 lg:items-center"><div className="lg:col-span-4"><SectionHeading eyebrow="The daily command center" title="A dashboard that answers before you ask." description="Attendance, fees, results, assignments, notices, library, transport, and analytics — visible as one connected operating picture." align="left" /><div className="mt-7 flex flex-wrap gap-2"><Badge variant="secondary">Attendance</Badge><Badge variant="secondary">Fees</Badge><Badge variant="secondary">Results</Badge><Badge variant="secondary">Analytics</Badge></div></div><div className="lg:col-span-8"><DashboardShowcase /></div></div></div></section>

        <section className="border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-workflow"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="The connected workflow" title="From Admin to Student, nothing gets lost in translation." description="Each update travels with the people who need it — no duplicate spreadsheets, no guessing which message is current." /><div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{workflow.map(({ num, role, icon: Icon, title, desc }, index) => <motion.div key={role} initial={reduceMotion ? false : { opacity: 0, y: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="relative"><Card data-testid={`card-workflow-${index}`} className="h-full p-5"><div className="flex items-center justify-between"><span className="font-mono text-sm text-primary">{num}</span><Icon className="h-5 w-5 text-primary" aria-hidden="true" /></div><Badge variant="outline" className="mt-6">{role}</Badge><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p></Card>{index < workflow.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block" aria-hidden="true" />}</motion.div>)}</div></div></section>

        <section className="border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-showcase"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="See the system in context" title="Built for the minutes between the big moments." description="The value is not another dashboard. It is the confidence that the right record is already there when your team needs it." /><div className="mt-10"><DashboardShowcase /></div></div></section>

        <TestimonialsSection />

        <section id="pricing" className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-pricing"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Pricing that grows with you" title="Start small. Stay in control." description="কোনো hidden charge নেই। আপনার school বা coaching center-এর stage অনুযায়ী plan বেছে নিন।" /><div className="mt-10 grid gap-5 lg:grid-cols-3">{(["free_trial", "founder_launch", "annual_premium"] as PlanTier[]).map((tier) => <PricingCard key={tier} tier={tier} onSelect={selectPlan} />)}</div><div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">{["কোনো hidden fee নেই", "যেকোনো সময় cancel করুন", "Role-based access"].map((signal) => <span key={signal} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />{signal}</span>)}</div></div></section>

        <section id="faq" className="scroll-mt-20 border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-testid="section-faq"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-5"><div className="lg:col-span-2"><SectionHeading eyebrow="FAQ" title="Good questions deserve clear answers." description="EduTrack শুরু করার আগে সবচেয়ে সাধারণ প্রশ্নগুলোর উত্তর এখানে।" align="left" /><div className="mt-7"><Button data-testid="button-faq-contact" variant="outline" onClick={() => openAuth("login", "faq_contact")}>Still have a question <MessageCircle aria-hidden="true" /></Button></div></div><Card className="px-5 lg:col-span-3"><Accordion type="single" collapsible className="w-full">{faqs.map((faq, index) => <AccordionItem key={faq.question} value={`faq-${index}`}><AccordionTrigger data-testid={`button-faq-${index}`}>{faq.question}</AccordionTrigger><AccordionContent className="leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></Card></div></section>

        <section className="border-b bg-sidebar px-4 py-16 text-sidebar-foreground sm:px-6 lg:px-8 lg:py-24" data-testid="section-final-cta"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-end"><div className="lg:col-span-7"><Badge variant="secondary" className="mb-4">৭ দিনের Free Trial</Badge><h2 className="font-display text-3xl leading-tight tracking-tight sm:text-5xl">Make the school day feel <span className="text-primary">more possible.</span></h2><p className="mt-4 max-w-xl text-base leading-relaxed text-sidebar-foreground/75">আপনার team-এর জন্য একটি dependable workspace তৈরি করুন — আজই শুরু করুন, প্রথম দিন থেকেই clarity পান।</p></div><div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end"><Button data-testid="button-final-start" size="lg" onClick={() => openAuth("login", "final_cta")}>ফ্রি ট্রায়াল শুরু করুন <ArrowRight aria-hidden="true" /></Button><Button data-testid="button-final-demo" size="lg" variant="outline" className="bg-background/10 text-sidebar-foreground hover:bg-background/20" onClick={() => openAuth("login", "final_cta_demo")}>লাইভ ডেমো দেখুন <CalendarCheck aria-hidden="true" /></Button></div></div></section>
      </main>

      <footer id="contact" className="bg-sidebar text-sidebar-foreground" data-testid="footer-site"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-8"><div className="space-y-4 lg:col-span-5"><a data-testid="link-footer-logo" href="#top" className="flex items-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span><span className="text-lg">EduTrack</span></a><p className="max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">The calm operating system for Bangladesh-এর school এবং coaching center-দের জন্য।</p><div className="flex items-center gap-2"><a data-testid="link-footer-facebook" href="https://facebook.com/edutrack" target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("footer_social_click", { channel: "facebook" })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="EduTrack on Facebook"><span aria-hidden="true" className="font-semibold">f</span></a><a data-testid="link-footer-whatsapp" href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" onClick={() => trackFeatureUsed("footer_social_click", { channel: "whatsapp" })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="EduTrack on WhatsApp"><MessageCircle className="h-4 w-4" aria-hidden="true" /></a></div></div><FooterColumn title="Product" links={[{ label: "Overview", href: "#overview" }, { label: "Features", href: "#features" }, { label: "Solutions", href: "#solutions" }, { label: "Pricing", href: "#pricing" }, { label: "Free Trial", onClick: () => openAuth("login", "footer_product") }]} /><FooterColumn title="Support" links={[{ label: "FAQ", href: "#faq" }, { label: "Documentation", href: "/help" }, { label: "Live Chat", href: `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`, external: true }]} /><div className="space-y-4 lg:col-span-3"><h3 className="text-sm font-semibold">Contact</h3><ul className="space-y-3 text-sm text-sidebar-foreground/70"><li><a data-testid="link-contact-email" href="mailto:support@edutrack.com.bd" className="flex items-center gap-2 transition-colors hover:text-primary"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />support@edutrack.com.bd</a></li><li><a data-testid="link-contact-phone" href={`tel:+${whatsappNumber}`} className="flex items-center gap-2 transition-colors hover:text-primary"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />+880 1632-905056</a></li><li><Button data-testid="button-contact-demo" variant="outline" size="sm" className="text-sidebar-foreground" onClick={() => openAuth("login", "footer_contact")}>Book a demo <Send aria-hidden="true" /></Button></li></ul></div></div><div className="border-t border-sidebar-border"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-sidebar-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>© 2026 EduTrack. Made in Bangladesh.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><a data-testid="link-footer-privacy" className="hover:text-primary" href="/privacy">Privacy Policy</a><a data-testid="link-footer-terms" className="hover:text-primary" href="/terms">Terms of Service</a><a data-testid="link-footer-refund" className="hover:text-primary" href="/refund">Refund Policy</a><button data-testid="button-footer-login" className="hover:text-primary" onClick={() => openAuth("login", "footer_bottom")}>Login</button></div></div></div></footer>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href?: string; external?: boolean; onClick?: () => void }> }) {
  return <div className="space-y-4"><h3 className="text-sm font-semibold text-sidebar-foreground">{title}</h3><ul className="space-y-3 text-sm text-sidebar-foreground/70">{links.map((link) => <li key={link.label}>{link.onClick ? <button data-testid={`button-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`} className="transition-colors hover:text-primary" onClick={link.onClick}>{link.label}</button> : <a data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="transition-colors hover:text-primary">{link.label}</a>}</li>)}</ul></div>;
}

function friendlyError(code: string): string {
  const map: Record<string, string> = { "auth/wrong-password": "Password ভুল হয়েছে।", "auth/user-not-found": "এই email-এ কোনো account নেই।", "auth/email-already-in-use": "Email ইতিমধ্যে registered।", "auth/weak-password": "Password কমপক্ষে ৬ characters হতে হবে।", "auth/invalid-email": "Email address সঠিক নয়।", "auth/invalid-credential": "Email বা Password ভুল হয়েছে।", "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। একটু পরে আবার চেষ্টা করুন।" };
  return map[code] ?? "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}