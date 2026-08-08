import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, CheckCircle2, ClipboardCheck,
  GraduationCap, HelpCircle, LayoutDashboard, Lightbulb, Menu, PlayCircle,
  ShieldCheck, Users, Wallet, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, title: "এক নজরে পুরো দিনের ছবি", description: "Dashboard থেকে attendance, fee collection, pending work এবং আজকের priorities একসঙ্গে দেখুন।" },
  { id: "students", label: "Students", icon: Users, title: "Student record তৈরি ও খুঁজে নিন", description: "Student profile, batch, guardian contact এবং academic history একটি secure record-এ রাখুন।" },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck, title: "এক click-এ attendance", description: "Teacher class বেছে নিয়ে present, absent বা late mark করে; admin সঙ্গে সঙ্গে updated signal পায়।" },
  { id: "fees", label: "Fees", icon: Wallet, title: "Fees আর follow-up গুছিয়ে নিন", description: "Paid, partial এবং pending status আলাদা করে দেখুন—কোনো spreadsheet খুঁজতে হবে না।" },
  { id: "results", label: "Exams & results", icon: BarChart3, title: "Progress পরিষ্কারভাবে বোঝান", description: "Exam setup, marks entry এবং result publishing একই academic workflow-এর অংশ।" },
  { id: "communication", label: "Communication", icon: BookOpen, title: "সবাইকে relevant update দিন", description: "Notice, homework এবং deadline role অনুযায়ী share করুন—message trail কমে যায়।" },
];

const tips = [
  ["প্রথমে structure তৈরি করুন", "Classes এবং student list ঠিক থাকলে বাকি workflow অনেক দ্রুত চলে।"],
  ["Daily exceptions দেখুন", "Dashboard-এর pending fee, absent এবং unfinished work আগে resolve করুন।"],
  ["Role অনুযায়ী access দিন", "প্রত্যেক মানুষকে তার কাজের প্রয়োজনীয় view দিন, পুরো system নয়।"],
];

export default function DemoWorkspace() {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const current = steps.find((step) => step.id === active) ?? steps[0];
  const stepIndex = steps.findIndex((step) => step.id === active);
  const Icon = current.icon;

  function goTo(id: string) {
    setActive(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markComplete() {
    setCompleted((items) => items.includes(active) ? items : [...items, active]);
    if (stepIndex < steps.length - 1) goTo(steps[stepIndex + 1].id);
  }

  return (
    <div className="demo-workspace min-h-screen text-foreground">
      <div className="demo-ambient demo-ambient-one" aria-hidden="true" />
      <div className="demo-ambient demo-ambient-two" aria-hidden="true" />
      <header className="demo-topbar glass-panel sticky top-3 z-30 mx-3 rounded-2xl border sm:mx-5">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></span>
            <span>EduTrack <span className="font-normal text-muted-foreground">Demo</span></span>
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            <Badge variant="secondary">Guided workspace</Badge>
            <Button asChild size="sm"><Link href="/">Back to website</Link></Button>
          </div>
          <Button variant="outline" size="icon" className="sm:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Open demo navigation">
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileOpen && <nav className="border-t border-white/20 p-3 sm:hidden">{steps.map((step) => <button key={step.id} onClick={() => goTo(step.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-white/30"><step.icon className="h-4 w-4 text-primary" />{step.label}</button>)}</nav>}
      </header>

      <main className="relative mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8 lg:pt-12">
        <aside className="hidden lg:block">
          <div className="glass-panel sticky top-24 rounded-3xl p-3">
            <p className="px-3 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">Explore the process</p>
            <nav className="space-y-1">
              {steps.map((step, index) => (
                <button key={step.id} onClick={() => goTo(step.id)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition ${active === step.id ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-white/30 hover:text-foreground"}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${active === step.id ? "bg-white/20" : "bg-primary/10 text-primary"}`}>{completed.includes(step.id) ? <CheckCircle2 className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}</span>
                  <span><span className="block text-[10px] opacity-60">0{index + 1}</span>{step.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-4 border-t border-border/60 pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Journey progress</span><span>{completed.length}/{steps.length}</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed.length / steps.length) * 100}%` }} /></div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 max-w-3xl">
            <Badge className="mb-4 gap-2"><PlayCircle className="h-3.5 w-3.5" /> Interactive product tour</Badge>
            <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">EduTrack কীভাবে আপনার পুরো process সহজ করে, নিজে দেখে নিন</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">এটি একটি safe demo workspace। এখানে real account বা data ছাড়াই admin, teacher এবং student workflow-এর সম্পূর্ণ ধারণা পাবেন।</p>
          </div>

          <Card className="demo-hero-card glass-panel overflow-hidden rounded-[2rem] border-primary/20">
            <CardContent className="p-6 sm:p-9">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div className="flex gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-7 w-7" /></div><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-primary">Step 0{stepIndex + 1} · {current.label}</p><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{current.title}</h2><p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{current.description}</p></div></div>
                <Badge variant="outline" className="w-fit shrink-0">{completed.includes(active) ? "Completed" : "Live preview"}</Badge>
              </div>
              <DemoPanel step={active} />
              <div className="mt-7 flex flex-col justify-between gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center">
                <Button variant="ghost" disabled={stepIndex === 0} onClick={() => goTo(steps[stepIndex - 1].id)} className="justify-start gap-2"><ArrowLeft className="h-4 w-4" /> Previous</Button>
                <Button onClick={markComplete} className="gap-2">{stepIndex === steps.length - 1 ? "Tour complete" : "Mark complete & continue"} <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-5 md:grid-cols-[1fr_.8fr]">
            <Card className="glass-panel rounded-3xl"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="h-5 w-5 text-primary" /> Quick tips</CardTitle></CardHeader><CardContent className="space-y-3">{tips.map(([title, text]) => <div key={title} className="rounded-2xl border border-white/20 bg-white/20 p-4"><p className="font-medium">{title}</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</CardContent></Card>
            <Card className="glass-panel rounded-3xl"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><HelpCircle className="h-5 w-5 text-primary" /> Need help?</CardTitle></CardHeader><CardContent><p className="text-sm leading-relaxed text-muted-foreground">যে কোনো step-এ আটকে গেলে Help Center-এ বিস্তারিত manual, common problem এবং solution দেখতে পারবেন।</p><Button asChild variant="outline" className="mt-5 gap-2"><Link href="/help">Open Help Center <ArrowRight className="h-4 w-4" /></Link></Button></CardContent></Card>
          </div>
        </section>
      </main>
      <footer className="relative border-t border-white/20 px-4 py-8 text-center text-sm text-muted-foreground">Demo mode · আপনার real workspace তৈরি করতে <Link href="/" className="font-medium text-primary hover:underline">EduTrack-এ ফিরে যান</Link></footer>
    </div>
  );
}

function DemoPanel({ step }: { step: string }) {
  if (step === "students") return <div className="demo-data-panel mt-8 grid gap-3 sm:grid-cols-3">{[["ST-1042", "Rafi Ahmed", "Class 8 · Active"], ["ST-1043", "Nusrat Jahan", "Class 7 · Active"], ["ST-1044", "Samiul Hasan", "Class 9 · Follow-up"]].map(([id, name, detail]) => <div key={id} className="rounded-2xl border border-white/25 bg-white/25 p-4"><p className="text-xs text-muted-foreground">{id}</p><p className="mt-3 font-semibold">{name}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>)}</div>;
  if (step === "attendance") return <div className="demo-data-panel mt-8 space-y-3">{[["Class 8 · Mathematics", "32 students", "94% present"], ["Class 7 · English", "28 students", "89% present"], ["Class 9 · Science", "30 students", "97% present"]].map(([title, count, status]) => <div key={title} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/25 bg-white/25 p-4"><span className="font-medium">{title}</span><span className="text-sm text-muted-foreground">{count}</span><Badge variant="secondary" className="text-emerald-600">{status}</Badge></div>)}</div>;
  if (step === "fees") return <div className="demo-data-panel mt-8 grid gap-3 sm:grid-cols-3">{[["৳ 84,500", "Collected this month", "92%"], ["৳ 7,200", "Pending follow-up", "8 families"], ["৳ 12,000", "Partial payments", "5 records"]].map(([value, label, meta]) => <div key={label} className="rounded-2xl border border-white/25 bg-white/25 p-4"><p className="text-2xl font-semibold">{value}</p><p className="mt-2 text-sm text-muted-foreground">{label}</p><p className="mt-3 text-xs font-medium text-primary">{meta}</p></div>)}</div>;
  if (step === "results") return <div className="demo-data-panel mt-8 rounded-2xl border border-white/25 bg-white/25 p-5"><div className="flex items-end gap-3">{[42, 68, 55, 82, 74, 91, 78].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-xl bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${height}px` }} /><span className="text-[10px] text-muted-foreground">W{index + 1}</span></div>)}</div><p className="mt-4 text-sm text-muted-foreground">Class average rises as teachers compare topics and follow up early.</p></div>;
  if (step === "communication") return <div className="demo-data-panel mt-8 space-y-3">{["Parent orientation · Tomorrow, 10:00 AM", "Homework reminder · Class 8 Mathematics", "Exam routine published · Term 2"].map((notice, index) => <div key={notice} className="flex items-center gap-3 rounded-2xl border border-white/25 bg-white/25 p-4"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">0{index + 1}</span><span className="text-sm font-medium">{notice}</span><CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" /></div>)}</div>;
  const summary = [
    { value: "1,248", label: "Students", icon: Users },
    { value: "94.2%", label: "Attendance", icon: ClipboardCheck },
    { value: "৳ 84.5k", label: "Collected", icon: Wallet },
    { value: "18", label: "Open tasks", icon: ShieldCheck },
  ];
  return <div className="demo-data-panel mt-8 grid gap-3 sm:grid-cols-4">{summary.map(({ value, label, icon: PanelIcon }) => <div key={label} className="rounded-2xl border border-white/25 bg-white/25 p-4"><PanelIcon className="h-4 w-4 text-primary" /><p className="mt-4 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>;
}