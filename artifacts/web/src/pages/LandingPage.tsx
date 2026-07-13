import { useState } from "react";
import {
  signInWithEmailAndPassword, sendPasswordResetEmail,
  setPersistence, browserLocalPersistence, browserSessionPersistence,
  GoogleAuthProvider, signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap, Users, CalendarCheck, Wallet, ClipboardList,
  Bell, Receipt, LayoutDashboard, ArrowRight, CheckCircle, X,
  Loader2, Star, MessageCircle, Mail, Phone, Eye, EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackFeatureUsed, trackLogin, trackLoginFailed } from "@/lib/analytics";
import { PromotionPopup } from "@/components/PromotionPopup";
import { HeroCarousel } from "@/components/HeroCarousel";

const features = [
  { icon: LayoutDashboard, title: "Real-time Dashboard", desc: "Students, fees, attendance — একনজরে সব statistics দেখুন", iconGrad: "from-blue-500 to-blue-600", accent: "from-blue-500 to-cyan-400", glow: "shadow-blue-500/25", glowHover: "group-hover:shadow-blue-500/40", highlight: true },
  { icon: Users, title: "Student Management", desc: "Students register, update, search করুন সহজেই", iconGrad: "from-emerald-500 to-emerald-600", accent: "from-emerald-500 to-teal-400", glow: "shadow-emerald-500/25", glowHover: "group-hover:shadow-emerald-500/40" },
  { icon: GraduationCap, title: "Teacher Portal", desc: "Teachers-এর subject, salary, attendance সব track করুন", iconGrad: "from-violet-500 to-violet-600", accent: "from-violet-500 to-purple-400", glow: "shadow-violet-500/25", glowHover: "group-hover:shadow-violet-500/40" },
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "প্রতিদিনের attendance digital-এ record করুন", iconGrad: "from-amber-500 to-orange-500", accent: "from-amber-400 to-orange-400", glow: "shadow-amber-500/25", glowHover: "group-hover:shadow-amber-500/40" },
  { icon: Wallet, title: "Fee Management", desc: "Monthly fees track করুন, one-click-এ mark paid", iconGrad: "from-rose-500 to-rose-600", accent: "from-rose-500 to-pink-400", glow: "shadow-rose-500/25", glowHover: "group-hover:shadow-rose-500/40", highlight: true },
  { icon: ClipboardList, title: "Exam & Results", desc: "Exam তৈরি করুন, results enter করুন, grade দিন", iconGrad: "from-indigo-500 to-indigo-600", accent: "from-indigo-500 to-blue-400", glow: "shadow-indigo-500/25", glowHover: "group-hover:shadow-indigo-500/40" },
  { icon: Bell, title: "Notice Board", desc: "সব notices একজায়গায় — teachers ও students সবাই দেখবে", iconGrad: "from-pink-500 to-pink-600", accent: "from-pink-500 to-rose-400", glow: "shadow-pink-500/25", glowHover: "group-hover:shadow-pink-500/40" },
  { icon: Receipt, title: "Expense Tracking", desc: "Coaching center-এর সব খরচ category wise log করুন", iconGrad: "from-teal-500 to-teal-600", accent: "from-teal-500 to-emerald-400", glow: "shadow-teal-500/25", glowHover: "group-hover:shadow-teal-500/40" },
];

const steps = [
  { num: "১", title: "Account তৈরি করুন", desc: "Google বা Email দিয়ে মাত্র ৩০ সেকেন্ডে register করুন।" },
  { num: "২", title: "Organization Setup করুন", desc: "আপনার coaching center-এর নাম দিন। Organization Code পাবেন।" },
  { num: "৩", title: "Team যোগ করুন", desc: "Teachers ও Students-দের Organization Code দিন — তারা join করবে।" },
  { num: "৪", title: "Manage করুন", desc: "Attendance, fees, exams সব digital-এ manage করুন।" },
];

const testimonials = [
  {
    coachingName: "Bright Future Academy",
    coachingLocation: "ঢাকা",
    coachingLogoUrl: "/orgs/org-1.png",
    coachingGrad: "from-blue-500 to-indigo-600",
    name: "Md. Karim Uddin",
    role: "Principal & Founder",
    avatarUrl: "/avatars/reviewer-1.jpg",
    avatarGrad: "from-blue-400 to-blue-600",
    text: "EduTrack ব্যবহারের পর fee collection ৪৫% বেড়ে গেছে। আগে খাতায় হিসাব রাখতাম — এখন সব phone-এ instant দেখি। Absent students-দের list এক click-এই পাই। Setup-এ মাত্র ৫ মিনিট লেগেছে।",
    rating: 5,
    verified: true,
  },
  {
    coachingName: "Spectrum Coaching Centre",
    coachingLocation: "চট্টগ্রাম",
    coachingLogoUrl: "/orgs/org-2.png",
    coachingGrad: "from-emerald-500 to-teal-600",
    name: "Nasrin Akter",
    role: "Director",
    avatarUrl: "/avatars/reviewer-2.jpg",
    avatarGrad: "from-rose-400 to-rose-600",
    text: "Teacher ও student-দের আলাদা portal সবচেয়ে পছন্দের feature। Attendance নেওয়া এখন মাত্র ২ মিনিটের কাজ। Parents-দের directly fee reminder পাঠাতে পারি — অনেক সময় বাঁচে।",
    rating: 5,
    verified: true,
  },
  {
    coachingName: "Pioneer Institute",
    coachingLocation: "সিলেট",
    coachingLogoUrl: "/orgs/org-3.png",
    coachingGrad: "from-amber-500 to-orange-600",
    name: "Rafiq Hassan",
    role: "Owner & Admin",
    avatarUrl: "/avatars/reviewer-3.jpg",
    avatarGrad: "from-violet-400 to-violet-600",
    text: "Dashboard দেখেই বুঝি কোন student fees দেয়নি, কে বেশি absent। আগে এই হিসাব বের করতে ঘণ্টা লাগত। এখন সব data এক জায়গায়, সিদ্ধান্ত নেওয়া অনেক সহজ।",
    rating: 5,
    verified: true,
  },
];

const plans = [
  {
    id: "free",
    emoji: "🟢",
    badge: null,
    name: "Free Trial",
    tagline: "ঝুঁকি ছাড়াই শুরু করুন",
    regularPrice: null,
    price: "৳0",
    period: "৭ দিনের জন্য",
    features: [
      "সব Premium features ব্যবহার করুন",
      "কোনো Credit Card লাগবে না",
      "যেকোনো সময় Cancel করুন",
      "Full access, no limitations",
    ],
    cta: "ফ্রি ট্রায়াল শুরু করুন",
    highlight: false,
    variant: "free",
  },
  {
    id: "founder",
    emoji: "⭐",
    badge: "Most Popular",
    name: "Founder Launch",
    tagline: "প্রথম ১০০ Coaching Center-এর জন্য",
    regularPrice: "৳999",
    price: "৳749",
    period: "/month",
    savings: "২৫% ছাড়",
    spotsLeft: "সীমিত আসন বাকি",
    features: [
      "সব Premium features",
      "Unlimited Students & Teachers",
      "Priority Support",
      "Advanced Analytics",
      "Custom Branding",
      "Data Export",
    ],
    cta: "Founder Price নিন",
    highlight: true,
    variant: "founder",
  },
  {
    id: "annual",
    emoji: "👑",
    badge: "Best Value",
    name: "Annual Premium",
    tagline: "বছরে ২ মাস একদম বিনামূল্যে",
    regularPrice: "৳11,988",
    price: "৳9,999",
    period: "/year",
    savings: "৳1,989 সাশ্রয়",
    features: [
      "সব Founder features",
      "২ মাস বিনামূল্যে (মাসে মাত্র ৳833)",
      "Dedicated Account Manager",
      "Early access to new features",
      "Annual performance report",
      "Invoice & billing support",
    ],
    cta: "Annual Plan নিন",
    highlight: false,
    variant: "annual",
  },
];

type AuthMode = "login" | "reset";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Reset link sent!", description: "Check your email for the password reset link." });
        setMode("login");
      } else {
        const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistence);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center space-y-2 relative pb-3">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl">
            {mode === "login" ? "Sign In to EduTrack" : "Reset Password"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Enter your email and password to continue"
              : "Enter your email to receive a reset link"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
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

            {/* Password — only in login mode */}
            {mode === "login" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => setMode("reset")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember me — only in login mode */}
            {mode === "login" && (
              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "Login" : "Send Reset Link"}
            </Button>
          </form>

          {mode === "login" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {mode === "reset" && (
            <p className="text-center text-sm">
              <button
                className="text-primary font-medium hover:underline"
                onClick={() => setMode("login")}
              >
                ← Back to Login
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  function openAuth(mode: AuthMode, source: string) {
    trackFeatureUsed("landing_cta_click", { mode, source });
    setAuthMode(mode);
    setShowAuth(true);
  }

  const whatsappMsg = encodeURIComponent("আমি EduTrack সম্পর্কে জানতে চাই। একটু বিস্তারিত বলবেন?");
  const whatsappNumber = "8801632905056";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {showAuth && <AuthPanel defaultMode={authMode} onClose={() => setShowAuth(false)} />}

      {/* Promotional Popup — shown once per session */}
      <PromotionPopup
        onCtaClick={(cta, index) => {
          trackFeatureUsed("promo_popup_cta_click", { cta, index });
          openAuth("login", `promo_popup_${index}`);
        }}
      />

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackFeatureUsed("whatsapp_contact_click")}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Demo নিন</span>
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div data-app-logo="true" className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            EduTrack
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-1">v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => openAuth("login", "header")}>Login</Button>
            <Button
              size="sm"
              onClick={() => openAuth("login", "header")}
            >
              বিনামূল্যে শুরু করুন
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-0 right-0 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[120px]" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 xl:gap-20 items-center">

            {/* LEFT: Content */}
            <div className="space-y-7 text-center lg:text-left">
              <h1 className="font-display text-4xl sm:text-5xl xl:text-[3.5rem] leading-[1.1]">
                আপনার Coaching Center<br />
                <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  ডিজিটাল করুন আজই
                </span>
              </h1>

              <p className="text-[1.05rem] text-slate-300 leading-relaxed max-w-[28rem] mx-auto lg:mx-0">
                Students, Attendance, Fees ও Exams — সব একসাথে, সহজে পরিচালনা করুন।
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="font-display text-[0.95rem] tracking-normal"
                  onClick={() => openAuth("login", "hero")}
                >
                  ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 text-[0.95rem] bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                  onClick={() => openAuth("login", "hero")}
                >
                  লাইভ ডেমো দেখুন
                </Button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  Credit card দরকার নেই
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  ৩০ দিন বিনামূল্যে
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  যেকোনো সময় cancel
                </span>
              </div>
            </div>

            {/* RIGHT: Dashboard Mockup */}
            <div className="relative hidden lg:block">
              {/* Multi-layer glow for depth — soft, premium halo around the hero visual */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600/25 via-blue-500/15 to-violet-600/10 blur-[64px] rounded-[2rem]" />
              <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-600/20 via-blue-500/12 to-violet-600/8 blur-3xl rounded-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/6 blur-2xl rounded-full" />

              {/* ── Floating badge: Fee collected — gold accent for a key money stat ── */}
              <div className="glass-panel-dark glow-gold absolute -top-5 -right-4 z-20 flex items-center gap-2 text-white px-3 py-2 rounded-xl animate-[float_4s_ease-in-out_infinite]">
                <div className="h-6 w-6 rounded-lg bg-gold-soft border flex items-center justify-center shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gold leading-none">Fee Collected</div>
                  <div className="stat-display text-[11px] text-white leading-tight mt-0.5">৳৮৫,৫০০</div>
                </div>
              </div>

              {/* ── Floating badge: Attendance rate ── */}
              <div className="absolute -left-6 top-1/3 z-20 flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] text-white px-3 py-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-[float_5s_ease-in-out_0.8s_infinite]">
                <div className="h-6 w-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <CalendarCheck className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-indigo-300 leading-none">Attendance</div>
                  <div className="text-[11px] font-bold text-white leading-tight mt-0.5">৮৫% গড়</div>
                </div>
              </div>

              {/* Browser shell */}
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.09] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_48px_96px_rgba(0,0,0,0.75),0_0_100px_-24px_rgba(99,102,241,0.45)]"
                style={{ transform: "perspective(1200px) rotateY(-2deg) rotateX(1deg)" }}>

                {/* Browser chrome */}
                <div className="bg-[#161b27] border-b border-white/[0.07] px-4 py-2.5 flex items-center gap-3">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28ca41]/90" />
                  </div>
                  <div className="flex-1 bg-[#0d1117] rounded-md px-3 py-1.5 text-[11px] text-slate-500 font-mono tracking-tight flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-600/60 inline-block shrink-0" />
                    app.edutrack.com/dashboard
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 shrink-0" />
                  </div>
                </div>

                {/* App shell */}
                <div className="bg-[#0b0f1a] text-white">

                  {/* ── Top navigation bar ── */}
                  <nav className="bg-[#0d1120]/90 border-b border-white/[0.06] px-4 py-2.5 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                      {/* Logo */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="h-5 w-5 rounded-md bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/40">
                          <GraduationCap className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-white text-xs font-bold tracking-tight">EduTrack</span>
                      </div>
                      {/* Nav links */}
                      <div className="flex items-center gap-4">
                        {[
                          ["Dashboard", true],
                          ["Students", false],
                          ["Teachers", false],
                          ["Fees", false],
                          ["Reports", false],
                        ].map(([label, active]) => (
                          <span
                            key={label as string}
                            className={`text-[11px] font-medium cursor-default select-none pb-0.5 ${
                              active
                                ? "text-indigo-400 border-b border-indigo-500"
                                : "text-slate-500"
                            }`}
                          >
                            {label as string}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Right side */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                        <Bell className="h-2.5 w-2.5 text-slate-400" />
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 border border-[#0b0f1a]" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold select-none shadow-sm shadow-indigo-500/30">
                        A
                      </div>
                    </div>
                  </nav>

                  {/* ── Dashboard body ── */}
                  <div className="p-4 space-y-3">

                    {/* Page heading */}
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="text-[13px] font-semibold text-slate-100">Dashboard</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">July 2026 overview</div>
                      </div>
                      <div className="text-[10px] bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2.5 py-1 rounded-lg cursor-default hover:bg-indigo-500/20 transition-colors">
                        + নতুন Student
                      </div>
                    </div>

                    {/* ── Stats cards ── */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "মোট Students", value: "১,২৪৮", sub: "↑ ১২% এই মাসে", positive: true,  bg: "from-blue-500/10 to-blue-600/5",    border: "border-blue-500/20",    icon: "👥", dot: "bg-blue-400" },
                        { label: "Teachers",       value: "৩২",      sub: "+ ৩ নতুন",    positive: true,  bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20", icon: "🎓", dot: "bg-emerald-400" },
                        { label: "Monthly Income", value: "৳৮৫,৫০০", sub: "↑ ৮% বৃদ্ধি", positive: true,  bg: "from-indigo-500/10 to-indigo-600/5",  border: "border-indigo-500/20",  icon: "💰", dot: "bg-indigo-400" },
                        { label: "Pending Fees",   value: "৳১২,৩০০", sub: "১৮ জন বাকি", positive: false, bg: "from-amber-500/10 to-amber-600/5",    border: "border-amber-500/20",   icon: "⚠️", dot: "bg-amber-400" },
                      ].map((card) => (
                        <div key={card.label} className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-xl p-2.5 space-y-1.5`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400 leading-tight font-medium">{card.label}</span>
                            <span className="text-[12px] leading-none">{card.icon}</span>
                          </div>
                          <div className="text-[14px] font-bold text-slate-100 leading-tight tracking-tight">{card.value}</div>
                          <div className={`flex items-center gap-1 text-[9px] font-semibold leading-tight ${card.positive ? "text-emerald-400" : "text-amber-400"}`}>
                            <span className={`w-1 h-1 rounded-full ${card.dot} shrink-0`} />
                            {card.sub}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ── Chart + Activity row ── */}
                    <div className="grid grid-cols-5 gap-2">

                      {/* Attendance bar chart */}
                      <div className="col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[11px] font-semibold text-slate-200">সাপ্তাহিক Attendance</div>
                          <div className="flex items-center gap-1 text-[9px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                            <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                            Live
                          </div>
                        </div>
                        <div className="flex items-end gap-1.5 h-[68px]">
                          {[
                            { day: "রবি", pct: 76 },
                            { day: "সোম", pct: 91 },
                            { day: "মঙ্গল", pct: 88 },
                            { day: "বুধ", pct: 72 },
                            { day: "বৃহ", pct: 95 },
                            { day: "শুক্র", pct: 83 },
                            { day: "শনি", pct: 89 },
                          ].map((d) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className={`w-full rounded-t-md ${d.pct === 95 ? "bg-gradient-to-t from-indigo-600 to-indigo-400" : d.pct > 85 ? "bg-gradient-to-t from-indigo-600/90 to-indigo-400/80" : "bg-gradient-to-t from-indigo-700/60 to-indigo-500/50"}`}
                                style={{ height: `${d.pct}%` }}
                              />
                              <span className="text-[7px] text-slate-600 leading-none">{d.day}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05]">
                          <span className="flex items-center gap-1 text-[9px] text-slate-500">
                            <span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" /> উপস্থিত
                          </span>
                          <span className="text-[9px] font-semibold text-emerald-400">গড়: ৮৫%</span>
                        </div>
                      </div>

                      {/* Recent activity */}
                      <div className="col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                        <div className="text-[11px] font-semibold text-slate-200 mb-2.5">সাম্প্রতিক কার্যক্রম</div>
                        <div className="space-y-2.5">
                          {[
                            { text: "রাহুল fees দিয়েছে", time: "২ মি আগে", dot: "bg-emerald-400" },
                            { text: "Class 9 attendance", time: "১৫ মি আগে", dot: "bg-blue-400" },
                            { text: "নতুন student যোগ দিয়েছে", time: "১ ঘ আগে", dot: "bg-indigo-400" },
                            { text: "Notice প্রকাশিত", time: "২ ঘ আগে", dot: "bg-amber-400" },
                          ].map((act) => (
                            <div key={act.text} className="flex items-start gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${act.dot} mt-1 shrink-0`} />
                              <div>
                                <div className="text-[10px] text-slate-300 leading-tight">{act.text}</div>
                                <div className="text-[9px] text-slate-600 mt-0.5">{act.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge — "Live" indicator */}
              <div className="absolute -bottom-4 left-6 z-20 flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-sm border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-full shadow-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Real-time data sync চলছে
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hero Carousel — same 5 banners, full-width below the hero */}
      <section className="px-4 py-6 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <HeroCarousel
            onCtaClick={(cta, index) => {
              trackFeatureUsed("hero_carousel_cta_click", { cta, index });
              openAuth("login", `hero_carousel_${index}`);
            }}
          />
        </div>
      </section>

      {/* Stats — dark premium panel with glass cards and gold key-metric accents */}
      <section className="relative overflow-hidden py-16 px-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-indigo-600/12 rounded-full blur-[110px]" />
        <div className="relative max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 text-center">
          {[
            ["৫০০+", "Coaching Centers"],
            ["১০,০০০+", "Students"],
            ["৯৯.৯%", "Uptime"],
            ["৫ মিনিট", "Setup Time"],
          ].map(([v, l]) => (
            <div key={l} className="glass-panel-dark rounded-2xl p-5 md:p-6">
              <p className="stat-display text-gold-gradient text-2xl md:text-3xl">{v}</p>
              <p className="text-sm text-slate-400 mt-1.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-5 px-4 border-b border-border bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "Secure Cloud Storage",
            "Mobile Friendly",
            "Daily Backup",
            "Role Based Access",
            "99.9% Uptime",
          ].map((label) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium select-none">
              <div className="h-5 w-5 rounded-full bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
              </div>
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl">কিভাবে কাজ করে?</h2>
            <p className="text-muted-foreground mt-2">মাত্র ৪টি ধাপে আপনার coaching center digital হয়ে যাবে</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center space-y-3">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center mx-auto relative z-10">
                  {s.num}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — glassmorphism reserved for this highlight section only */}
      <section id="features" className="relative overflow-hidden py-24 px-4 bg-slate-50 dark:bg-[#080c14]">
        {/* Ambient glow so the glass blur has something to read against */}
        <div className="pointer-events-none absolute top-24 left-1/4 w-[420px] h-[420px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-violet-500/8 dark:bg-violet-500/12 rounded-full blur-[110px]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              ✦ Features
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">সব কিছু এক Platform-এ</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-md mx-auto leading-relaxed">
              আপনার coaching center পরিচালনার জন্য দরকারী সব tools — এক জায়গায়।
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className={`glass-panel group relative p-6 rounded-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ${f.highlight ? "glow-primary" : ""}`}
              >
                {/* Top accent gradient line — appears on hover */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.accent} ${f.highlight ? "opacity-70" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`} />
                {/* Subtle background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 rounded-2xl`} />

                {f.highlight && (
                  <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wide text-gold bg-gold-soft border rounded-full px-2 py-0.5">
                    Popular
                  </div>
                )}

                {/* Icon — soft colored glow that intensifies on hover */}
                <div className={`relative h-11 w-11 rounded-xl bg-gradient-to-br ${f.iconGrad} flex items-center justify-center mb-4 shadow-lg ${f.glow} ${f.glowHover} group-hover:scale-110 transition-all duration-300`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>

                <h3 className="relative font-semibold text-[0.95rem] mb-2 tracking-tight">{f.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-[#080c14]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              ★ Social Proof
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">তারা কী বলছেন?</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-md mx-auto leading-relaxed">
              সারা বাংলাদেশে ৫০০+ coaching center EduTrack-এর উপর ভরসা রাখছে
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group bg-white dark:bg-slate-900/70 border border-border rounded-2xl p-6 flex flex-col gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header: coaching logo + stars */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${t.coachingGrad} flex items-center justify-center shrink-0 shadow-md p-1.5`}>
                      <img src={t.coachingLogoUrl} alt={t.coachingName} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold leading-tight truncate">{t.coachingName}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{t.coachingLocation}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0 pt-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed flex-1">
                  "{t.text}"
                </p>

                {/* Footer: avatar + identity + verified */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 shadow-sm border border-border">
                      <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover object-center" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold leading-tight">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  {t.verified && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 relative overflow-hidden">
        {/* Cinematic background glows */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-0 left-[10%] w-[350px] h-[350px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 right-[5%] w-[400px] h-[350px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)" }} />

        {/* Keyframe animations injected via style tag */}
        <style>{`
          @keyframes pricing-gold-pulse {
            0%,100% { box-shadow: 0 0 50px -8px rgba(245,158,11,0.55), 0 0 100px -20px rgba(245,158,11,0.28), 0 40px 80px rgba(0,0,0,0.55); }
            50%      { box-shadow: 0 0 70px -8px rgba(245,158,11,0.75), 0 0 140px -20px rgba(245,158,11,0.42), 0 40px 80px rgba(0,0,0,0.55); }
          }
          @keyframes pricing-shimmer {
            0%   { transform: translateX(-120%) skewX(-15deg); }
            100% { transform: translateX(400%) skewX(-15deg); }
          }
          @keyframes pricing-scan {
            0%   { top: -2px; }
            100% { top: 100%; }
          }
          @keyframes pricing-float {
            0%,100% { transform: translateY(0px); }
            50%      { transform: translateY(-5px); }
          }
          @keyframes pricing-badge-glow {
            0%,100% { box-shadow: 0 0 14px rgba(245,158,11,0.65), 0 4px 14px rgba(0,0,0,0.45); }
            50%      { box-shadow: 0 0 26px rgba(245,158,11,0.9),  0 4px 14px rgba(0,0,0,0.45); }
          }
          @keyframes pricing-green-pulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0), 0 20px 50px rgba(0,0,0,0.22); }
            50%      { box-shadow: 0 0 22px -4px rgba(34,197,94,0.22), 0 20px 50px rgba(0,0,0,0.22); }
          }
          @keyframes pricing-purple-pulse {
            0%,100% { box-shadow: 0 0 40px -10px rgba(139,92,246,0.5), 0 0 80px -20px rgba(99,102,241,0.25), 0 30px 70px rgba(0,0,0,0.6); }
            50%      { box-shadow: 0 0 55px -10px rgba(139,92,246,0.7), 0 0 110px -20px rgba(99,102,241,0.38), 0 30px 70px rgba(0,0,0,0.6); }
          }
          .pricing-card-free:hover   { transform: translateY(-5px); box-shadow: 0 30px 60px rgba(0,0,0,0.18), 0 0 30px -5px rgba(34,197,94,0.3) !important; }
          .pricing-card-annual:hover { transform: translateY(-5px); box-shadow: 0 0 65px -10px rgba(139,92,246,0.8), 0 0 120px -20px rgba(99,102,241,0.42), 0 30px 70px rgba(0,0,0,0.6) !important; }
          .pricing-btn-free:hover   { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,197,94,0.45) !important; }
          .pricing-btn-gold:hover   { filter: brightness(1.08); }
          .pricing-btn-indigo:hover { filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 10px 28px rgba(139,92,246,0.55) !important; }
        `}</style>

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }} />
              সীমিত সময়ের Offer — এখনই সুযোগ নিন
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight">
              সহজ, স্বচ্ছ{" "}
              <span style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Pricing</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              কোনো hidden charge নেই। যেকোনো সময় cancel করুন।
            </p>
          </div>

          {/* ── Cards — flex row so center card can be taller ── */}
          <div className="flex flex-col md:flex-row gap-5 md:items-center justify-center">

            {/* ── Card 1: Free Trial — Bright frosted glass ── */}
            {/* Outer gradient border wrapper — matches Annual/Founder structure */}
            <div
              className="pricing-card-free relative md:flex-1 self-stretch transition-all duration-300"
              style={{
                padding: "1.5px",
                background: "linear-gradient(150deg,rgba(34,197,94,0.7) 0%,rgba(22,163,74,0.45) 40%,rgba(21,128,61,0.28) 70%,rgba(20,184,166,0.35) 100%)",
                borderRadius: "18px",
                animation: "pricing-green-pulse 4s ease-in-out infinite",
              }}
            >
              {/* Inner frosted-glass content card */}
              <div
                className="relative flex flex-col h-full overflow-hidden"
                style={{
                  background: "linear-gradient(160deg,rgba(255,255,255,0.93) 0%,rgba(240,253,244,0.9) 100%)",
                  borderRadius: "16px",
                  padding: "28px 24px 24px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Green top accent bar */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-[3px]" style={{ borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg,transparent 0%,#22c55e 40%,#16a34a 60%,transparent 100%)" }} />
                {/* Green corner glow blobs */}
                <div className="pointer-events-none absolute top-[-30px] left-[-30px] w-[160px] h-[160px] rounded-full" style={{ background: "radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 70%)" }} />
                <div className="pointer-events-none absolute bottom-[-20px] right-[-20px] w-[120px] h-[120px] rounded-full" style={{ background: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)" }} />

                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "1.5px solid rgba(34,197,94,0.4)", boxShadow: "0 4px 14px rgba(34,197,94,0.25)" }}>🟢</div>
                  <h3 className="font-black text-xl" style={{ color: "#0f172a" }}>Free Trial</h3>
                  <p className="text-sm mt-1 font-medium" style={{ color: "#475569" }}>ঝুঁকি ছাড়াই শুরু করুন</p>
                </div>

                <div className="mb-6 relative">
                  <span className="font-black tracking-tighter" style={{ fontSize: "clamp(48px,6vw,60px)", lineHeight: 1, color: "#0f172a", textShadow: "0 2px 8px rgba(34,197,94,0.18)" }}>৳0</span>
                  <p className="text-sm mt-2 font-medium" style={{ color: "#64748b" }}>৭ দিনের জন্য সম্পূর্ণ বিনামূল্যে</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1 relative">
                  {[
                    "Access to all Premium features",
                    "কোনো Credit Card লাগবে না",
                    "যেকোনো সময় Cancel করুন",
                    "Full access, no limitations",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-medium" style={{ color: "#1e293b" }}>
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="pricing-btn-free relative w-full h-12 rounded-xl font-black text-sm transition-all duration-200"
                  style={{ background: "linear-gradient(90deg,#16a34a,#22c55e)", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(34,197,94,0.38), inset 0 1px 0 rgba(255,255,255,0.25)", letterSpacing: "0.01em" }}
                  onClick={() => {
                    trackFeatureUsed("pricing_cta_click", { plan: "free_trial" });
                    openAuth("login", "pricing_free_trial");
                  }}
                >
                  ফ্রি ট্রায়াল শুরু করুন →
                </button>
              </div>
            </div>

            {/* ── Card 2: Founder Launch — DOMINANT FOCAL CARD ── */}
            <div
              className="relative flex flex-col md:flex-[1.12] rounded-[22px] md:-my-5"
              style={{
                padding: "2px",
                background: "linear-gradient(150deg,#fbbf24 0%,#f59e0b 35%,#d97706 65%,#b45309 100%)",
                animation: "pricing-gold-pulse 3s ease-in-out infinite",
                zIndex: 2,
              }}
            >
              {/* Most Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-5 py-1.5 rounded-full whitespace-nowrap"
                  style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b)", color: "#1a0e00", animation: "pricing-badge-glow 2s ease-in-out infinite", letterSpacing: "0.07em" }}
                >
                  ⭐ Most Popular
                </div>
              </div>

              <div
                className="relative flex flex-col flex-1 rounded-[20px] overflow-hidden"
                style={{ background: "linear-gradient(160deg,#131008 0%,#1b1508 35%,#16110a 70%,#0e0b06 100%)", padding: "32px 26px" }}
              >
                {/* Inner ambient glow */}
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% -10%,rgba(245,158,11,0.16) 0%,transparent 65%)" }} />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2" style={{ background: "radial-gradient(ellipse at 50% 120%,rgba(245,158,11,0.05) 0%,transparent 70%)" }} />
                {/* Shimmer */}
                <div
                  className="pointer-events-none absolute top-0 bottom-0 w-[28%]"
                  style={{ left: "-40%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.045),transparent)", animation: "pricing-shimmer 5s ease-in-out infinite", transform: "skewX(-15deg)" }}
                />
                {/* Scan line */}
                <div
                  className="pointer-events-none absolute left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent)", animation: "pricing-scan 4.5s linear infinite" }}
                />

                {/* Content */}
                <div className="relative mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", animation: "pricing-float 4s ease-in-out infinite" }}
                  >⭐</div>
                  <h3 className="font-black text-2xl tracking-tight" style={{ color: "#fef3c7" }}>Founder Launch</h3>
                  <p className="text-sm mt-1" style={{ color: "rgba(245,158,11,0.6)" }}>প্রথম ১০০ Coaching Center-এর জন্য</p>
                </div>

                <div className="relative mb-5">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-base font-semibold line-through" style={{ color: "rgba(245,158,11,0.4)" }}>৳999</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#fbbf24" }}>২৫% ছাড়</span>
                  </div>
                  <div className="flex items-baseline gap-2" style={{ lineHeight: 1 }}>
                    <span className="font-black text-white" style={{ fontSize: "clamp(52px,7vw,68px)", letterSpacing: "-0.05em", textShadow: "0 0 40px rgba(245,158,11,0.45),0 0 80px rgba(245,158,11,0.2)" }}>৳749</span>
                    <span className="text-sm font-medium" style={{ color: "rgba(245,158,11,0.6)", paddingBottom: 8 }}>/month</span>
                  </div>
                  {/* Scarcity bar */}
                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(245,158,11,0.08)" }}>
                      <div className="h-full w-[68%] rounded-full" style={{ background: "linear-gradient(90deg,#d97706,#fbbf24)" }} />
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "rgba(245,158,11,0.75)" }}>৬৮/১০০ নেওয়া হয়েছে</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-7 flex-1">
                  {[
                    "সব Premium features",
                    "Unlimited Students & Teachers",
                    "Priority Support",
                    "Advanced Analytics",
                    "Custom Branding",
                    "Data Export",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(254,243,199,0.82)" }}>
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="pricing-btn-gold relative w-full h-12 rounded-xl font-black text-base transition-all duration-200 overflow-hidden"
                  style={{ background: "linear-gradient(90deg,#f59e0b,#fbbf24)", color: "#1a0e00", border: "none", cursor: "pointer", boxShadow: "0 6px 22px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.22)", letterSpacing: "0.01em" }}
                  onClick={() => {
                    trackFeatureUsed("pricing_cta_click", { plan: "founder_launch" });
                    openAuth("login", "pricing_founder_launch");
                  }}
                >
                  Founder Price নিন →
                </button>
              </div>
            </div>

            {/* ── Card 3: Annual Premium — Rich dark purple glass ── */}
            <div
              className="pricing-card-annual relative md:flex-1 self-stretch p-[1.5px] transition-all duration-300"
              style={{
                background: "linear-gradient(150deg,rgba(139,92,246,0.9) 0%,rgba(99,102,241,0.6) 40%,rgba(67,56,202,0.4) 70%,rgba(109,40,217,0.5) 100%)",
                animation: "pricing-purple-pulse 3.5s ease-in-out infinite",
                borderRadius: "16px",
              }}
            >
              {/* Best Value badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-1.5 text-white text-xs font-black uppercase tracking-wider px-5 py-1.5 rounded-full whitespace-nowrap" style={{ background: "linear-gradient(90deg,#7c3aed,#6366f1,#8b5cf6)", boxShadow: "0 0 20px rgba(139,92,246,0.75), 0 4px 14px rgba(0,0,0,0.5)", letterSpacing: "0.07em" }}>
                  👑 Best Value
                </div>
              </div>

              {/* Inner card */}
              <div
                className="relative flex flex-col h-full overflow-hidden"
                style={{ background: "linear-gradient(160deg,#0d0b1a 0%,#110d24 30%,#0f0c1f 65%,#0a0816 100%)", borderRadius: "14px", padding: "28px 24px 24px" }}
              >
                {/* Ambient purple radial at top */}
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% -15%,rgba(139,92,246,0.22) 0%,transparent 60%)" }} />
                {/* Bottom undertone */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2" style={{ background: "radial-gradient(ellipse at 50% 115%,rgba(99,102,241,0.1) 0%,transparent 65%)" }} />
                {/* Top shimmer line */}
                <div className="pointer-events-none absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(167,139,250,0.55),transparent)" }} />
                {/* Corner glow blobs */}
                <div className="pointer-events-none absolute top-[-30px] right-[-30px] w-[140px] h-[140px] rounded-full" style={{ background: "radial-gradient(circle,rgba(139,92,246,0.18) 0%,transparent 70%)" }} />
                <div className="pointer-events-none absolute bottom-[-20px] left-[-20px] w-[100px] h-[100px] rounded-full" style={{ background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)" }} />

                <div className="relative mb-5 mt-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.22),rgba(99,102,241,0.14))", border: "1.5px solid rgba(167,139,250,0.35)", boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}>👑</div>
                  <h3 className="font-black text-2xl tracking-tight text-white">Annual Premium</h3>
                  <p className="text-sm mt-1 font-medium" style={{ color: "rgba(196,181,253,0.75)" }}>বছরে ২ মাস একদম বিনামূল্যে</p>
                </div>

                <div className="relative mb-5">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-base font-semibold line-through" style={{ color: "rgba(196,181,253,0.38)" }}>৳11,988</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(167,139,250,0.4)", color: "#c4b5fd" }}>৳1,989 সাশ্রয়</span>
                  </div>
                  <div className="flex items-baseline gap-2" style={{ lineHeight: 1 }}>
                    <span className="font-black text-white" style={{ fontSize: "clamp(44px,6vw,58px)", letterSpacing: "-0.04em", textShadow: "0 0 35px rgba(167,139,250,0.5),0 0 70px rgba(139,92,246,0.25)" }}>৳9,999</span>
                    <span className="text-sm font-medium" style={{ color: "rgba(196,181,253,0.55)", paddingBottom: 6 }}>/year</span>
                  </div>
                  <p className="text-xs font-bold mt-2" style={{ color: "#a78bfa", textShadow: "0 0 10px rgba(167,139,250,0.4)" }}>মাসে মাত্র ৳833 — ২ মাস ফ্রি!</p>
                </div>

                <ul className="space-y-3 mb-7 flex-1 relative">
                  {[
                    "সব Founder features included",
                    "২ মাস বিনামূল্যে",
                    "Dedicated Account Manager",
                    "Early access to new features",
                    "Annual performance report",
                    "Invoice & billing support",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-medium" style={{ color: "rgba(233,228,255,0.88)" }}>
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className="pricing-btn-indigo relative w-full h-12 rounded-xl font-black text-sm text-white transition-all duration-200 overflow-hidden"
                  style={{ background: "linear-gradient(90deg,#6d28d9,#7c3aed,#6366f1)", border: "none", cursor: "pointer", boxShadow: "0 6px 22px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.18)", letterSpacing: "0.01em" }}
                  onClick={() => {
                    trackFeatureUsed("pricing_cta_click", { plan: "annual_premium" });
                    openAuth("login", "pricing_annual_premium");
                  }}
                >
                  Annual Plan নিন →
                </button>
              </div>
            </div>

          </div>

          {/* Trust line */}
          <p className="text-center text-sm mt-12 flex items-center justify-center gap-2" style={{ color: "rgba(255,255,255,0.28)" }}>
            <CheckCircle className="h-4 w-4 text-green-500" />
            কোনো hidden fee নেই · যেকোনো সময় cancel করুন · SSL secured payment
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/12 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-700/10 blur-[100px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[300px] bg-violet-700/8 blur-[100px] rounded-full" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          {/* Eyebrow — special offer, so it carries the gold accent */}
          <div className="glass-panel-dark glow-gold inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gold font-semibold">৩০ দিনের Free Trial</span>
            <span className="text-slate-300">— কোনো risk নেই</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.1]">
            আজই আপনার Coaching Center<br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              ডিজিটাল করুন
            </span>
          </h2>

          <p className="text-[1.05rem] text-slate-300 leading-relaxed max-w-xl mx-auto">
            মাত্র কয়েক মিনিটে সেটআপ করুন এবং আজ থেকেই সময় ও খরচ বাঁচানো শুরু করুন।
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="font-display h-14 px-8 text-base tracking-normal bg-white text-slate-900 border-white/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),0_2px_10px_rgba(0,0,0,0.2),0_0_40px_-8px_rgba(255,255,255,0.4)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_2px_12px_rgba(0,0,0,0.25),0_0_56px_-8px_rgba(255,255,255,0.55)] hover:brightness-100 hover:bg-slate-50"
              onClick={() => openAuth("login", "final_cta")}
            >
              ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/35"
              onClick={() => openAuth("login", "final_cta_demo")}
            >
              লাইভ ডেমো দেখুন
            </Button>
          </div>

          {/* Trust micro-signals */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {[
              "Free Trial",
              "No Credit Card Required",
              "24/7 Support",
            ].map((label) => (
              <span key={label} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/[0.06] text-slate-400">
        {/* Main grid */}
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

            {/* Brand column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/30">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">EduTrack</span>
              </div>
              <p className="text-sm leading-relaxed max-w-[220px]">
                Bangladesh-এর coaching center-দের জন্য তৈরি সম্পূর্ণ digital management platform।
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://facebook.com/edutrack"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackFeatureUsed("footer_social_click", { channel: "facebook" })}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/40 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackFeatureUsed("footer_social_click", { channel: "whatsapp" })}
                  className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-green-600/30 hover:border-green-500/40 transition-all duration-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Product column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Features", href: "#features", internal: true },
                  { label: "Pricing", href: "#pricing", internal: true },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white transition-colors duration-150">{label}</a>
                  </li>
                ))}
                <li>
                  <button
                    className="hover:text-white transition-colors duration-150 text-left"
                    onClick={() => openAuth("login", "footer_product")}
                  >
                    Free Trial
                  </button>
                </li>
              </ul>
            </div>

            {/* Support column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "FAQ", href: "/faq" },
                  { label: "Documentation", href: "/help" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="hover:text-white transition-colors duration-150">{label}</a>
                  </li>
                ))}
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-150"
                  >
                    Live Chat
                  </a>
                </li>
              </ul>
            </div>

            {/* Company column */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-150">About</a></li>
                <li>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors duration-150"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a href="mailto:support@edutrack.com.bd" className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    support@edutrack.com.bd
                  </a>
                </li>
                <li>
                  <a href={`tel:+${whatsappNumber}`} className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    +880 1632-905056
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © 2026 EduTrack. 🇧🇩 Made in Bangladesh with ❤️
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
              <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="/refund" className="hover:text-slate-300 transition-colors">Refund Policy</a>
              <button className="hover:text-slate-300 transition-colors" onClick={() => openAuth("login", "footer_bottom")}>
                Login
              </button>
            </div>
          </div>
        </div>
      </footer>
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
