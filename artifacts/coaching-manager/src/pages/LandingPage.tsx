import { useState } from "react";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap, Users, CalendarCheck, Wallet, ClipboardList,
  Bell, Receipt, LayoutDashboard, ArrowRight, CheckCircle, X,
  Loader2, Star, MessageCircle, Mail, Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackFeatureUsed, trackLogin, trackLoginFailed, trackRegistered } from "@/lib/analytics";
import { PromotionPopup } from "@/components/PromotionPopup";
import { HeroCarousel } from "@/components/HeroCarousel";
const features = [
  { icon: LayoutDashboard, title: "Real-time Dashboard", desc: "Students, fees, attendance — একনজরে সব statistics দেখুন", iconGrad: "from-blue-500 to-blue-600", accent: "from-blue-500 to-cyan-400" },
  { icon: Users, title: "Student Management", desc: "Students register, update, search করুন সহজেই", iconGrad: "from-emerald-500 to-emerald-600", accent: "from-emerald-500 to-teal-400" },
  { icon: GraduationCap, title: "Teacher Portal", desc: "Teachers-এর subject, salary, attendance সব track করুন", iconGrad: "from-violet-500 to-violet-600", accent: "from-violet-500 to-purple-400" },
  { icon: CalendarCheck, title: "Attendance Tracking", desc: "প্রতিদিনের attendance digital-এ record করুন", iconGrad: "from-amber-500 to-orange-500", accent: "from-amber-400 to-orange-400" },
  { icon: Wallet, title: "Fee Management", desc: "Monthly fees track করুন, one-click-এ mark paid", iconGrad: "from-rose-500 to-rose-600", accent: "from-rose-500 to-pink-400" },
  { icon: ClipboardList, title: "Exam & Results", desc: "Exam তৈরি করুন, results enter করুন, grade দিন", iconGrad: "from-indigo-500 to-indigo-600", accent: "from-indigo-500 to-blue-400" },
  { icon: Bell, title: "Notice Board", desc: "সব notices একজায়গায় — teachers ও students সবাই দেখবে", iconGrad: "from-pink-500 to-pink-600", accent: "from-pink-500 to-rose-400" },
  { icon: Receipt, title: "Expense Tracking", desc: "Coaching center-এর সব খরচ category wise log করুন", iconGrad: "from-teal-500 to-teal-600", accent: "from-teal-500 to-emerald-400" },
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
    name: "Free Trial",
    price: "৳0",
    period: "৩০ দিন",
    features: ["১টি Branch", "৫০ জন Student", "৩ জন Teacher", "সব core features", "Email support"],
    cta: "বিনামূল্যে শুরু করুন",
    highlight: false,
  },
  {
    name: "Basic",
    price: "৳499",
    period: "মাসে",
    features: ["১টি Branch", "২০০ জন Student", "১০ জন Teacher", "সব features", "Priority support", "Data export"],
    cta: "এখনই শুরু করুন",
    highlight: true,
  },
  {
    name: "Pro",
    price: "৳999",
    period: "মাসে",
    features: ["একাধিক Branch", "Unlimited Students", "Unlimited Teachers", "Advanced analytics", "Dedicated support", "Custom branding"],
    cta: "Pro নিন",
    highlight: false,
  },
];

const googleProvider = new GoogleAuthProvider();
type AuthMode = "login" | "register" | "reset";

function AuthPanel({ defaultMode, onClose }: { defaultMode: AuthMode; onClose: () => void }) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email);
        toast({ title: "Email পাঠানো হয়েছে!", description: "Password reset link check করুন।" });
        setMode("login");
      } else if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        trackLogin("email");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        trackRegistered("email");
      }
    } catch (err: any) {
      trackLoginFailed(mode === "login" ? "email" : "email", err.code ?? "unknown");
      toast({ title: "Error", description: friendlyError(err.code), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      trackLogin("google");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        trackLoginFailed("google", err.code ?? "unknown");
        toast({ title: "Google Error", description: friendlyError(err.code), variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2 relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl">
            {mode === "login" ? "EduTrack-এ Sign In" : mode === "register" ? "বিনামূল্যে শুরু করুন" : "Password Reset"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode !== "reset" && (
            <Button variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={loading}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google দিয়ে Continue
            </Button>
          )}
          {mode !== "reset" && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">অথবা</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" placeholder="admin@coachingcenter.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {mode !== "reset" && (
              <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            )}
            {mode === "login" && (
              <button type="button" className="text-xs text-primary hover:underline" onClick={() => setMode("reset")}>
                Password ভুলে গেছেন?
              </button>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "Sign In" : mode === "register" ? "Free Account তৈরি করুন" : "Reset Link পাঠান"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>নতুন user? <button className="text-primary font-medium hover:underline" onClick={() => setMode("register")}>Register করুন</button></>
            ) : mode === "register" ? (
              <>Already account আছে? <button className="text-primary font-medium hover:underline" onClick={() => setMode("login")}>Sign In</button></>
            ) : (
              <button className="text-primary font-medium hover:underline" onClick={() => setMode("login")}>Back to Sign In</button>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");

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
          openAuth("register", `promo_popup_${index}`);
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
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            EduTrack
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium ml-1">v1.0</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => openAuth("login", "header")}>Login</Button>
            <Button size="sm" onClick={() => openAuth("register", "header")}>
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
              <h1 className="impact-hero text-4xl sm:text-5xl xl:text-[4.25rem] leading-[1.05]">
                আপনার Coaching Center<br />
                <span className="text-gradient-hero impact-glow-indigo">
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
                  className="px-7"
                  onClick={() => openAuth("register", "hero")}
                >
                  ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-7 bg-white/[0.06] border-white/[0.15] text-white shadow-none hover:bg-white/[0.10] hover:border-white/[0.25] backdrop-blur-sm dark:bg-white/[0.06] dark:border-white/[0.15]"
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
              {/* Multi-layer glow for depth */}
              <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-600/20 via-blue-500/12 to-violet-600/8 blur-3xl rounded-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/6 blur-2xl rounded-full" />

              {/* ── Floating badge: Fee collected ── */}
              <div className="absolute -top-5 -right-4 z-20 flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] text-white px-3 py-2 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-[float_4s_ease-in-out_infinite]">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-emerald-300 leading-none">Fee Collected</div>
                  <div className="text-[11px] font-bold text-white leading-tight mt-0.5">৳৮৫,৫০০</div>
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
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_100px_rgba(99,102,241,0.14),0_48px_96px_rgba(0,0,0,0.75)]"
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
              openAuth("register", `hero_carousel_${index}`);
            }}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border py-12 px-4 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 dark:from-slate-900 dark:via-indigo-950/25 dark:to-slate-900">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ["৫০০+", "Coaching Centers"],
            ["১০,০০০+", "Students"],
            ["৯৯.৯%", "Uptime"],
            ["৫ মিনিট", "Setup Time"],
          ].map(([v, l]) => (
            <div key={l} className="glass-card rounded-2xl p-5 text-center">
              <p className="impact-heading text-[2.25rem] text-gradient-indigo">{v}</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">{l}</p>
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
            <h2 className="impact-heading text-3xl sm:text-4xl">কিভাবে কাজ করে?</h2>
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

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-slate-50 dark:bg-[#080c14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 tracking-wide uppercase">
              ✦ Features
            </div>
            <h2 className="impact-heading text-3xl sm:text-4xl">
              সব কিছু এক <span className="text-gradient-indigo">Platform-এ</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-base max-w-md mx-auto leading-relaxed">
              আপনার coaching center পরিচালনার জন্য দরকারী সব tools — এক জায়গায়।
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl border border-slate-200/70 dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] backdrop-blur-sm hover:border-slate-100 dark:hover:border-white/[0.13] hover:bg-white/95 dark:hover:bg-white/[0.07] hover:shadow-[0_8px_40px_rgba(0,0,0,0.09)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Top accent gradient line — appears on hover */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                {/* Subtle background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-2xl`} />

                {/* Icon */}
                <div className={`relative h-11 w-11 rounded-xl bg-gradient-to-br ${f.iconGrad} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
            <h2 className="impact-heading text-3xl sm:text-4xl">তারা কী বলছেন?</h2>
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
      <section id="pricing" className="py-24 px-4 bg-gradient-to-br from-slate-900 via-indigo-950/75 to-slate-900 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-700/8 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="impact-heading text-3xl sm:text-4xl text-white">
              সহজ <span className="text-gradient-gold impact-glow-gold">Pricing</span>
            </h2>
            <p className="text-slate-400 mt-3">কোনো hidden charge নেই। যেকোনো সময় upgrade বা cancel করুন।</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`p-7 rounded-2xl relative transition-all duration-300 hover:-translate-y-1 ${
                  p.highlight ? "glass-dark-featured" : "glass-dark"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 whitespace-nowrap">
                    সবচেয়ে জনপ্রিয়
                  </div>
                )}
                <h3 className="font-bold text-lg text-white/90">{p.name}</h3>
                <div className="mt-3 mb-5">
                  <span className="impact-heading text-4xl text-gradient-indigo">{p.price}</span>
                  <span className="text-slate-400 text-sm ml-1">/{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${!p.highlight ? "bg-white/[0.08] border-white/[0.15] text-white hover:bg-white/[0.14] hover:border-white/[0.25] shadow-none" : ""}`}
                  variant={p.highlight ? "default" : "outline"}
                  onClick={() => {
                    trackFeatureUsed("pricing_cta_click", { plan: p.name });
                    openAuth("register", `pricing_${p.name}`);
                  }}
                >
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
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
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-sm px-4 py-1.5 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            ৩০ দিনের Free Trial — কোনো risk নেই
          </div>

          <h2 className="impact-hero text-[2.5rem] sm:text-5xl lg:text-6xl leading-[1.05]">
            আজই আপনার Coaching Center<br />
            <span className="text-gradient-hero impact-glow-indigo">
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
              className="px-8 bg-white text-slate-900 border-transparent font-semibold btn-white-glow hover:bg-slate-50 hover:-translate-y-px active:translate-y-0"
              onClick={() => openAuth("register", "final_cta")}
            >
              ফ্রি ট্রায়াল শুরু করুন <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 bg-white/[0.06] border-white/[0.15] text-white shadow-none hover:bg-white/[0.10] hover:border-white/[0.25] backdrop-blur-sm dark:bg-white/[0.06] dark:border-white/[0.15]"
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
                    onClick={() => openAuth("register", "footer_product")}
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
