import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Wallet,
  ClipboardList,
  Bell,
  Receipt,
  LayoutDashboard,
  ArrowRight,
  CheckCircle,
  Loader2,
  Star,
  MessageCircle,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock3,
  BarChart3,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  MoreHorizontal,
  CircleDollarSign,
  GraduationCap as GraduationCapIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackFeatureUsed, trackLogin, trackLoginFailed } from "@/lib/analytics";
import { PromotionPopup } from "@/components/PromotionPopup";
import { HeroCarousel } from "@/components/HeroCarousel";
import { usePublicTestimonials } from "@/lib/public-hooks";

const googleProvider = new GoogleAuthProvider();

const features = [
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    desc: "Students, fees, attendance — একনজরে সব statistics দেখুন",
  },
  {
    icon: Users,
    title: "Student Management",
    desc: "Students register, update, search করুন সহজেই",
  },
  {
    icon: GraduationCap,
    title: "Teacher Portal",
    desc: "Teachers-এর subject, salary, attendance সব track করুন",
  },
  {
    icon: CalendarCheck,
    title: "Attendance Tracking",
    desc: "প্রতিদিনের attendance digital-এ record করুন",
  },
  {
    icon: Wallet,
    title: "Fee Management",
    desc: "Monthly fees track করুন, one-click-এ mark paid",
  },
  {
    icon: ClipboardList,
    title: "Exam & Results",
    desc: "Exam তৈরি করুন, results enter করুন, grade দিন",
  },
  {
    icon: Bell,
    title: "Notice Board",
    desc: "সব notices একজায়গায় — teachers ও students সবাই দেখবে",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    desc: "Coaching center-এর সব খরচ category wise log করুন",
  },
];

const roleModules = [
  {
    icon: LayoutDashboard,
    label: "Admin workspace",
    title: "Run the whole school from one view.",
    desc: "See operations, exceptions, payments, and performance without chasing updates across spreadsheets.",
  },
  {
    icon: GraduationCap,
    label: "Teacher portal",
    title: "Give teachers more time to teach.",
    desc: "Attendance, homework, routines, and results stay close to the daily classroom workflow.",
  },
  {
    icon: Users,
    label: "Student experience",
    title: "Make progress easy to follow.",
    desc: "Students can keep up with schedules, results, notices, and the next step in their learning.",
  },
  {
    icon: ShieldCheck,
    label: "Parent visibility",
    title: "Keep families in the loop.",
    desc: "Share the updates that matter without overwhelming parents with operational noise.",
  },
];

const whyEduTrackPoints = [
  {
    icon: ShieldCheck,
    title: "One source of truth",
    desc: "Every role sees the same current context, with access shaped around what they need to do.",
  },
  {
    icon: Clock3,
    title: "Less admin, more progress",
    desc: "Turn repetitive updates into simple routines your team can complete in minutes.",
  },
  {
    icon: BarChart3,
    title: "Decisions with context",
    desc: "Move from numbers to next actions with clear trends across attendance, fees, and results.",
  },
  {
    icon: Sparkles,
    title: "Built to feel dependable",
    desc: "A calm, focused experience that helps your team stay confident on busy school days.",
  },
];

const steps = [
  {
    num: "১",
    title: "Account তৈরি করুন",
    desc: "Google বা Email দিয়ে মাত্র ৩০ সেকেন্ডে register করুন।",
  },
  {
    num: "২",
    title: "Organization Setup করুন",
    desc: "আপনার coaching center-এর নাম দিন। Organization Code পাবেন।",
  },
  {
    num: "৩",
    title: "Team যোগ করুন",
    desc: "Teachers ও Students-দের Organization Code দিন — তারা join করবে।",
  },
  {
    num: "৪",
    title: "Manage করুন",
    desc: "Attendance, fees, exams সব digital-এ manage করুন।",
  },
];

const faqs = [
  {
    question: "EduTrack কী ধরনের coaching center-এর জন্য?",
    answer:
      "EduTrack ছোট থেকে বড় coaching center-এর জন্য তৈরি। Organization admin, teachers এবং students — প্রত্যেকে নিজের role অনুযায়ী একই workspace ব্যবহার করতে পারে।",
  },
  {
    question: "শুরু করতে কি কোনো credit card লাগবে?",
    answer:
      "না। Free Trial শুরু করতে credit card দরকার নেই। আপনি workspace সেটআপ করে platform-এর core workflow আগে দেখে নিতে পারবেন।",
  },
  {
    question: "আমি কি আমার teachers ও students-দের যোগ করতে পারব?",
    answer:
      "হ্যাঁ। Organization setup করার পরে আপনার team-কে Organization Code দিয়ে join করাতে পারবেন। প্রত্যেকে তার role অনুযায়ী portal access পাবে।",
  },
  {
    question: "আমার data কি নিরাপদ থাকবে?",
    answer:
      "EduTrack role-based access, cloud storage এবং regular backup workflow-এর মাধ্যমে organization data পরিচালনা করতে সাহায্য করে। Access সবসময় user role এবং organization scope অনুযায়ী থাকে।",
  },
  {
    question: "পরে plan পরিবর্তন বা cancel করা যাবে?",
    answer:
      "হ্যাঁ। Plan অনুযায়ী billing cycle এবং feature access আলাদা হতে পারে। আপনার account থেকে subscription settings পরিচালনা করা যাবে।",
  },
];

type AuthMode = "login" | "reset";

function AuthPanel({
  defaultMode,
  onClose,
}: {
  defaultMode: AuthMode;
  onClose: () => void;
}) {
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
        toast({
          title: "Google Sign-In Error",
          description: friendlyError(err.code),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        toast({
          title: "Reset link sent!",
          description: "Check your email for the password reset link.",
        });
        setMode("login");
      } else {
        const persistence = rememberMe
          ? browserLocalPersistence
          : browserSessionPersistence;
        await setPersistence(auth, persistence);
        await signInWithEmailAndPassword(auth, email, password);
        trackLogin("email");
        onClose();
      }
    } catch (err: any) {
      trackLoginFailed("email", err.code ?? "unknown");
      toast({
        title: "Login Error",
        description: friendlyError(err.code),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle>
                {mode === "login" ? "Sign In to EduTrack" : "Reset Password"}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {mode === "login"
                  ? "Enter your email and password to continue"
                  : "Enter your email to receive a reset link"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {mode === "login" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="auth-password">Password</Label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="h-auto px-0"
                  onClick={() => setMode("reset")}
                >
                  Forgot Password?
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label
                htmlFor="remember-me"
                className="cursor-pointer font-normal text-muted-foreground"
              >
                Remember me
              </Label>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {mode === "login" ? "Login" : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </form>

        {mode === "login" && (
          <div className="space-y-3">
            <div className="relative flex items-center">
              <div className="w-full border-t" />
              <span className="absolute left-1/2 -translate-x-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">
                or
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogle}
              disabled={loading}
            >
              <span
                className="font-semibold text-primary"
                aria-hidden="true"
              >
                G
              </span>
              Continue with Google
            </Button>
          </div>
        )}

        {mode === "reset" && (
          <Button
            type="button"
            variant="link"
            className="mx-auto"
            onClick={() => setMode("login")}
          >
            ← Back to Login
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <Badge variant="secondary" className="mb-4">
        {eyebrow}
      </Badge>
      <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ProductPreview() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <Card data-testid="card-dashboard-preview" className="glass-panel overflow-hidden border-primary/20 bg-card/80 shadow-xl">
        <div className="flex items-center justify-between border-b bg-muted/70 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCapIcon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold">Good morning, Ayesha</p>
              <p className="text-xs text-muted-foreground">Tuesday, 18 June 2024</p>
            </div>
          </div>
          <Badge variant="outline">Admin view</Badge>
        </div>
        <div className="grid gap-4 bg-muted/30 p-4 sm:p-5 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Overview</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">Tuesday at a glance</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="More overview actions" data-testid="button-preview-more">
                <MoreHorizontal aria-hidden="true" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Students", value: "1,248", meta: "+8.4%", icon: Users },
                { label: "Attendance", value: "92.6%", meta: "Today", icon: CalendarCheck },
                { label: "Fees collected", value: "৳8.42L", meta: "This month", icon: CircleDollarSign },
                { label: "Active classes", value: "36", meta: "Running now", icon: GraduationCap },
              ].map(({ label, value, meta, icon: Icon }) => (
                <div key={label} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-lg font-semibold tracking-tight">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Attendance trend</p>
                  <p className="text-xs text-muted-foreground">Last 7 school days</p>
                </div>
                <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-4 flex h-16 items-end gap-2" aria-label="Attendance trend chart">
                {["h-8", "h-10", "h-9", "h-12", "h-11", "h-14", "h-12"].map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-1">
                    <div className={`w-full rounded-t-sm bg-primary/70 ${height}`} />
                    <span className="text-xs text-muted-foreground">{["M", "T", "W", "T", "F", "S", "M"][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Today’s focus</p>
                <Badge variant="secondary">4 items</Badge>
              </div>
              <div className="mt-3 space-y-3">
                {[
                  ["Grade 8 results", "Ready to publish", CheckCircle],
                  ["Fee reminders", "18 families pending", Wallet],
                  ["Staff meeting", "03:30 PM · Room 2", CalendarCheck],
                ].map(([title, meta, Icon]) => (
                  <div key={title as string} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{title as string}</p>
                      <p className="text-xs text-muted-foreground">{meta as string}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-xs text-primary">View all</span>
              </div>
              <div className="mt-3 flex items-start gap-3 rounded-md bg-muted/60 p-3">
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium">Parent orientation is tomorrow</p>
                  <p className="mt-1 text-xs text-muted-foreground">Notice sent to 248 parents</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                <p className="text-sm font-semibold">Weekly health</p>
              </div>
              <p className="mt-3 text-2xl font-semibold">On track</p>
              <p className="mt-1 text-xs text-primary-foreground/75">All key operations are within target.</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function PricingCard({
  tier,
  onSelect,
}: {
  tier: PlanTier;
  onSelect: (tier: PlanTier) => void;
}) {
  const plan = PLAN_CONFIG[tier];
  const pricing = getPricingDisplay(tier);
  const featured = tier === "founder_launch";
  const cadence =
    plan.billingCycle === "trial"
      ? `${plan.trialDays} days`
      : plan.billingCycle === "monthly"
        ? "month"
        : "year";

  return (
    <Card
      className={
        featured
          ? "relative flex h-full flex-col border-primary ring-2 ring-primary/20"
          : "flex h-full flex-col"
      }
    >
      {plan.badge && (
        <Badge
          variant={featured ? "default" : "secondary"}
          className="absolute right-4 top-4"
        >
          {plan.badge}
        </Badge>
      )}
      <CardHeader className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {tier === "free_trial" ? (
            <Clock3 className="h-5 w-5" aria-hidden="true" />
          ) : tier === "founder_launch" ? (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="mb-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl tracking-tight">
              {pricing.price}
            </span>
            <span className="text-sm text-muted-foreground">/{cadence}</span>
          </div>
          {pricing.regularPrice && pricing.savings && (
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="line-through">{pricing.regularPrice}</span>{" "}
              <span className="font-medium text-primary">{pricing.savings}</span>
            </p>
          )}
          {pricing.monthlyEquivalent && (
            <p className="mt-2 text-xs font-medium text-primary">
              মাসে মাত্র {pricing.monthlyEquivalent}
            </p>
          )}
        </div>
        <ul className="mb-6 flex-1 space-y-3">
          {plan.displayHighlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={featured ? "default" : "outline"}
          onClick={() => onSelect(tier)}
        >
          {tier === "free_trial"
            ? "ফ্রি ট্রায়াল শুরু করুন"
            : tier === "founder_launch"
              ? "Founder Price নিন"
              : "Annual Plan নিন"}
          <ArrowRight aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}

function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = usePublicTestimonials();

  if (!isLoading && testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 border-t bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Social proof"
          title="যারা EduTrack ব্যবহার করছেন"
          description="EduTrack ব্যবহারকারী coaching center-দের বাস্তব অভিজ্ঞতা।"
        />

        {isLoading ? (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <Card key={item} className="space-y-4 p-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-32" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col gap-5 p-6">
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={`${testimonial.rating || 5} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating || 5 }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-primary text-primary"
                        aria-hidden="true"
                      />
                    ),
                  )}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  “{testimonial.text}”
                </p>
                <div className="flex items-center gap-3 border-t pt-4">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-9 w-9 rounded-full border object-cover"
                      width="36"
                      height="36"
                    />
                  ) : (
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {testimonial.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    {testimonial.role && (
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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

  const whatsappMsg = encodeURIComponent(
    "আমি EduTrack সম্পর্কে জানতে চাই। একটু বিস্তারিত বলবেন?",
  );
  const whatsappNumber = "8801632905056";

  function selectPlan(tier: PlanTier) {
    trackFeatureUsed("pricing_cta_click", { plan: tier });
    openAuth("login", `pricing_${tier}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showAuth && (
        <AuthPanel
          defaultMode={authMode}
          onClose={() => setShowAuth(false)}
        />
      )}

      <PromotionPopup
        onCtaClick={(cta, index) => {
          trackFeatureUsed("promo_popup_cta_click", { cta, index });
          openAuth("login", `promo_popup_${index}`);
        }}
      />

      <Button
        asChild
        variant="secondary"
        className="fixed bottom-4 right-4 z-40 rounded-full sm:bottom-6 sm:right-6"
      >
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackFeatureUsed("whatsapp_contact_click")}
          aria-label="Contact EduTrack on WhatsApp"
        >
          <MessageCircle aria-hidden="true" />
          <span>Demo নিন</span>
        </a>
      </Button>

      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="EduTrack home"
          >
            <span
              data-app-logo
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg">EduTrack</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v1.0
            </Badge>
          </a>

          <nav
            className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex"
            aria-label="Primary navigation"
          >
            <a data-testid="link-nav-overview" className="transition-colors hover:text-foreground" href="#overview">
              Overview
            </a>
            <a data-testid="link-nav-features" className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a data-testid="link-nav-pricing" className="transition-colors hover:text-foreground" href="#pricing">
              Pricing
            </a>
            <a data-testid="link-nav-modules" className="transition-colors hover:text-foreground" href="#modules">
              Modules
            </a>
            <a data-testid="link-nav-faq" className="transition-colors hover:text-foreground" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              data-testid="button-login-header"
              variant="ghost"
              size="sm"
              onClick={() => openAuth("login", "header")}
            >
              Login
            </Button>
            <Button data-testid="button-start-header" size="sm" onClick={() => openAuth("login", "header")}>
              বিনামূল্যে শুরু করুন
            </Button>
            <Button
              data-testid="button-mobile-menu"
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav
            className="border-t bg-background px-4 py-4 lg:hidden"
            aria-label="Mobile navigation"
            data-testid="nav-mobile"
          >
            <div className="mx-auto grid max-w-7xl gap-1">
              {[
                ["Overview", "#overview"],
                ["Features", "#features"],
                ["Modules", "#modules"],
                ["Pricing", "#pricing"],
                ["Why EduTrack", "#why-edutrack"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  data-testid={`link-mobile-${label.toLowerCase()}`}
                  className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={href}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative overflow-hidden border-b bg-sidebar px-4 py-16 text-sidebar-foreground sm:px-6 lg:px-8 lg:py-32">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-accent/40 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="max-w-2xl lg:col-span-5">
              <Badge variant="secondary" className="mb-5">
                Coaching center management, simplified
              </Badge>
              <h1 data-testid="text-hero-headline" className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-7xl">
                The calm behind
                <span className="mt-2 block text-primary">a busy school day.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sidebar-foreground/75 sm:text-lg">
                EduTrack gives administrators, teachers, students, and parents one clear place to keep learning moving — from first bell to final report.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button data-testid="button-hero-trial" size="lg" onClick={() => openAuth("login", "hero")}>
                  Start free trial
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Button
                  data-testid="button-hero-demo"
                  size="lg"
                  variant="outline"
                  className="bg-background/10 text-sidebar-foreground hover:bg-background/20"
                  onClick={() => openAuth("login", "hero_demo")}
                >
                  See how it works
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-sidebar-foreground/70">
                {[
                  "No credit card",
                  "Set up in minutes",
                  "Cancel anytime",
                ].map((signal) => (
                  <span key={signal} className="flex items-center gap-2">
                    <CheckCircle
                      className="h-4 w-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section className="border-b px-4 py-8 sm:px-6 lg:px-8" aria-label="Trusted by schools">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-left">
              Trusted by thoughtful school teams
            </p>
            <div className="grid w-full grid-cols-2 gap-3 text-center sm:flex sm:w-auto sm:items-center sm:gap-8">
              {["Northbridge Academy", "BrightPath", "The Learning Room", "Cedar Grove"].map((name) => (
                <span key={name} className="text-sm font-semibold tracking-tight text-muted-foreground/80">{name}</span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Product overview"
                title="একটি workspace-এ পুরো coaching operation"
                description="Admin, teacher এবং student — সবাইকে একই operational context-এ এনে daily work-কে আরও স্বচ্ছ করুন।"
                align="left"
              />
              <h3 className="mt-8 text-lg font-semibold">Benefits for your team</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: LayoutDashboard,
                    title: "এক নজরে status",
                    desc: "Daily work এবং exceptions দ্রুত বুঝুন।",
                  },
                  {
                    icon: Users,
                    title: "Role-aware access",
                    desc: "প্রত্যেকে নিজের কাজের জন্য উপযুক্ত view পায়।",
                  },
                  {
                    icon: Receipt,
                    title: "Records এক জায়গায়",
                    desc: "Fees, attendance এবং results সহজে খুঁজে পান।",
                  },
                  {
                    icon: ShieldCheck,
                    title: "নির্ভরযোগ্য workflow",
                    desc: "সঠিক scope, status এবং next action স্পষ্ট থাকে।",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <Card key={title} className="p-4">
                    <Icon
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                    <h3 className="mt-3 text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="bg-muted/40 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold">Built for repeated work</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    EduTrack-এর workflow এমনভাবে সাজানো যে routine tasks, team
                    coordination এবং operational review বারবার একই পরিচিত
                    pattern-এ সম্পন্ন করা যায়।
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["১", "Workspace"],
                  ["৩", "Role portals"],
                  ["∞", "Daily records"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border bg-card p-4">
                    <p className="font-display text-2xl text-primary">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="border-b bg-muted/40 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {[
              ["৫০০+", "Coaching Centers"],
              ["১০,০০০+", "Students"],
              ["৯৯.৯%", "Uptime"],
              ["৫ মিনিট", "Setup Time"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border bg-card p-4">
                <p className="font-display text-2xl text-primary sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Features"
              title="সব কিছু এক platform-এ"
              description="আপনার coaching center পরিচালনার জন্য দরকারী সব tools — এক জায়গায়।"
            />
            <div className="mt-10 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className={index === 0 ? "lg:col-span-2 lg:row-span-2" : index === 1 ? "lg:col-span-2" : "lg:col-span-1"}
                >
                  <Card
                    data-testid={`card-feature-${index}`}
                    className="group h-full p-5 transition-colors hover:border-primary/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Screenshots & preview"
              title="EduTrack-এর workflow এক নজরে দেখুন"
              description="পরিচিত dashboard pattern, clear status এবং focused actions — daily work দ্রুত বুঝতে সাহায্য করে।"
            />
            <div className="mt-10">
              <HeroCarousel
                onCtaClick={(cta, index) => {
                  trackFeatureUsed("hero_carousel_cta_click", { cta, index });
                  openAuth("login", `hero_carousel_${index}`);
                }}
              />
            </div>
          </div>
        </section>

        <section className="border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="How it works"
              title="শুরু করা সহজ"
              description="মাত্র ৪টি ধাপে আপনার coaching center digital হয়ে যাবে।"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.num} className="relative">
                  <Card className="h-full p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                      {step.num}
                    </div>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </Card>
                  {index < steps.length - 1 && (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="modules"
          className="scroll-mt-20 border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Built around people"
              title="Every role gets a clearer day."
              description="EduTrack brings the full learning community into one shared rhythm, while keeping every view focused and relevant."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roleModules.map(({ icon: Icon, label, title, desc }, index) => (
                <motion.div
                  key={label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card data-testid={`card-module-${index}`} className="h-full p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <Badge variant="secondary">{label}</Badge>
                    </div>
                    <h3 className="mt-6 text-lg font-semibold leading-tight">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="why-edutrack"
          className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading
                eyebrow="Why EduTrack"
                title="More clarity, less coordination overhead."
                description="A thoughtful system should make good work easier to repeat. EduTrack gives your team the context, confidence, and calm to keep moving."
                align="left"
              />
              <Card className="mt-8 overflow-hidden bg-sidebar text-sidebar-foreground">
                <CardContent className="p-6 sm:p-8">
                  <Badge variant="secondary">A better operating rhythm</Badge>
                  <p className="mt-6 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                    One calm workspace for every busy school day.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/75">
                    From the first attendance mark to the final result report, your team can see what is happening and what needs attention next.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {whyEduTrackPoints.map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Card data-testid={`card-why-${index}`} className="h-full p-5">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />

        <section
          id="pricing"
          className="scroll-mt-20 border-b px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Pricing"
              title="সহজ, স্বচ্ছ pricing"
              description="কোনো hidden charge নেই। আপনার coaching center-এর stage অনুযায়ী plan বেছে নিন।"
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {(["free_trial", "founder_launch", "annual_premium"] as PlanTier[]).map(
                (tier) => (
                  <PricingCard key={tier} tier={tier} onSelect={selectPlan} />
                ),
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "কোনো hidden fee নেই",
                "যেকোনো সময় cancel করুন",
                "Role-based access",
              ].map((signal) => (
                <span key={signal} className="flex items-center gap-2">
                  <CheckCircle
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-20 border-b bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="FAQ"
                title="যা জানতে চান"
                description="EduTrack শুরু করার আগে সবচেয়ে সাধারণ প্রশ্নগুলোর উত্তর এখানে।"
                align="left"
              />
            </div>
            <Card className="px-5 lg:col-span-3">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </section>

        <section className="bg-sidebar px-4 py-16 text-sidebar-foreground sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              ৭ দিনের Free Trial
            </Badge>
            <h2 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              আজই আপনার Coaching Center
              <span className="mt-2 block text-primary">ডিজিটাল করুন</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sidebar-foreground/75">
              মাত্র কয়েক মিনিটে setup করুন এবং আজ থেকেই সময় ও খরচ বাঁচানো শুরু
              করুন।
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => openAuth("login", "final_cta")}>
                ফ্রি ট্রায়াল শুরু করুন
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-background/10 text-sidebar-foreground hover:bg-background/20"
                onClick={() => openAuth("login", "final_cta_demo")}
              >
                লাইভ ডেমো দেখুন
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-sidebar-foreground/70">
              {["Free Trial", "No Credit Card Required", "24/7 Support"].map(
                (label) => (
                  <span key={label} className="flex items-center gap-2">
                    <CheckCircle
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-sidebar text-sidebar-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <a
              href="#top"
              className="flex items-center gap-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-lg">EduTrack</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              Bangladesh-এর coaching center-দের জন্য তৈরি সম্পূর্ণ digital
              management platform।
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/edutrack"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackFeatureUsed("footer_social_click", {
                    channel: "facebook",
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="EduTrack on Facebook"
              >
                <span aria-hidden="true" className="font-semibold">
                  f
                </span>
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackFeatureUsed("footer_social_click", {
                    channel: "whatsapp",
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="EduTrack on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Product"
            links={[
              { label: "Overview", href: "#overview" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              {
                label: "Free Trial",
                onClick: () => openAuth("login", "footer_product"),
              },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { label: "FAQ", href: "#faq" },
              { label: "Documentation", href: "/help" },
              {
                label: "Live Chat",
                href: `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`,
                external: true,
              },
            ]}
          />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-sidebar-foreground">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li>
                <a
                  href="mailto:support@edutrack.com.bd"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  support@edutrack.com.bd
                </a>
              </li>
              <li>
                <a
                  href={`tel:+${whatsappNumber}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  +880 1632-905056
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-sidebar-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>© 2026 EduTrack. Made in Bangladesh.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a className="hover:text-primary" href="/privacy">
                Privacy Policy
              </a>
              <a className="hover:text-primary" href="/terms">
                Terms of Service
              </a>
              <a className="hover:text-primary" href="/refund">
                Refund Policy
              </a>
              <button
                className="hover:text-primary"
                onClick={() => openAuth("login", "footer_bottom")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{
    label: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  }>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-sidebar-foreground">{title}</h3>
      <ul className="space-y-3 text-sm text-sidebar-foreground/70">
        {links.map((link) => (
          <li key={link.label}>
            {link.onClick ? (
              <button
                className="transition-colors hover:text-primary"
                onClick={link.onClick}
              >
                {link.label}
              </button>
            ) : (
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    "auth/wrong-password": "Password ভুল হয়েছে।",
    "auth/user-not-found": "এই email-এ কোনো account নেই।",
    "auth/email-already-in-use": "Email ইতিমধ্যে registered।",
    "auth/weak-password": "Password কমপক্ষে ৬ characters হতে হবে।",
    "auth/invalid-email": "Email address সঠিক নয়।",
    "auth/invalid-credential": "Email বা Password ভুল হয়েছে।",
    "auth/too-many-requests": "অনেকবার চেষ্টা হয়েছে। একটু পরে আবার চেষ্টা করুন।",
  };
  return map[code] ?? "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}