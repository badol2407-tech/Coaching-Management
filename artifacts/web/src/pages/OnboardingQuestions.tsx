import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Users, BarChart3, CalendarClock, BookOpen, AlertCircle } from "lucide-react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useLocation } from "wouter";

type AnswerKey = "mainGoal" | "centerSize";
const questions: Array<{ key: AnswerKey; title: string; description: string; options: Array<{ value: string; label: string; note: string; icon: typeof Users }> }> = [
  { key: "mainGoal", title: "What would make the biggest difference first?", description: "We will use this to shape your starting view.", options: [
    { value: "organize_students", label: "Keep students organized", note: "Profiles, attendance, and progress", icon: Users },
    { value: "understand_progress", label: "See progress clearly", note: "A sharper view of learning", icon: BarChart3 },
    { value: "save_time", label: "Save time each day", note: "Less admin, more coaching", icon: CalendarClock },
  ] },
  { key: "centerSize", title: "How big is your coaching center today?", description: "There is no wrong answer. This only helps us keep the experience relevant.", options: [
    { value: "just_starting", label: "Just getting started", note: "Building the foundation", icon: BookOpen },
    { value: "growing", label: "Growing steadily", note: "A small, busy team", icon: Users },
    { value: "established", label: "Well established", note: "Multiple classes or programs", icon: BarChart3 },
  ] },
];

export default function OnboardingQuestions() {
  const { user, loading: authLoading, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, string>>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const question = questions[questionIndex];
  const selected = answers[question.key];

  const choose = (value: string) => {
    setAnswers((current) => ({ ...current, [question.key]: value }));
    setError("");
  };

  const advance = async () => {
    if (!selected) {
      setError("Choose one option to continue.");
      return;
    }
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      return;
    }
    if (!user) {
      setError("Your session is still loading. Please try again.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateDoc(doc(db, "users", user.uid), {
        onboardingAnswers: answers,
        onboardingCompleted: true,
        profileSetupStep: "complete",
        updatedAt: serverTimestamp(),
      });
      await refreshProfile();
      setLocation("/");
    } catch {
      setError("We could not save your answers. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <QuestionShell><div data-testid="status-onboarding-loading" className="space-y-4"><div className="h-4 w-24 animate-pulse rounded bg-slate-200" /><div className="h-8 w-4/5 animate-pulse rounded bg-slate-200" /><div className="h-48 animate-pulse rounded-2xl bg-slate-100" /></div></QuestionShell>;

  return <QuestionShell>
    <div className="mb-8 flex items-center justify-between">
      <button type="button" data-testid="button-back-onboarding" onClick={() => questionIndex ? setQuestionIndex((index) => index - 1) : setLocation("/profile-setup")} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"><ArrowLeft size={16} /> Back</button>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Almost there</span>
    </div>
    <div className="mb-9 flex items-center gap-3"><div className="flex flex-1 gap-1.5">{questions.map((item, index) => <div key={item.key} className={`h-1.5 flex-1 rounded-full ${index <= questionIndex ? "bg-indigo-600" : "bg-slate-200"}`} />)}</div><span className="text-xs font-medium text-slate-400">{questionIndex + 1} of 2</span></div>
    <motion.div key={question.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
      <div><p className="text-sm font-medium text-slate-500">A couple of thoughtful questions</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{question.title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{question.description}</p></div>
      <div className="space-y-3" role="radiogroup" aria-label={question.title}>{question.options.map((option) => { const Icon = option.icon; const isSelected = selected === option.value; return <button type="button" key={option.value} data-testid={`button-option-${option.value}`} role="radio" aria-checked={isSelected} onClick={() => choose(option.value)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${isSelected ? "border-indigo-400 bg-indigo-50/80 shadow-[0_10px_30px_-20px_rgba(79,70,229,.7)]" : "border-slate-200 bg-white/55 hover:border-indigo-200 hover:bg-white"}`}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}><Icon size={19} /></span><span className="min-w-0 flex-1"><strong className="block text-sm font-semibold text-slate-800">{option.label}</strong><small className="mt-1 block text-xs text-slate-500">{option.note}</small></span><span className={`grid h-5 w-5 place-items-center rounded-full border ${isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>{isSelected && <Check size={13} />}</span></button>; })}</div>
      {error && <div data-testid="status-onboarding-error" role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700"><AlertCircle size={17} />{error}</div>}
      <button type="button" data-testid="button-next-onboarding" disabled={saving} onClick={advance} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60">{saving ? <><Loader2 size={17} className="animate-spin" /> Finishing...</> : questionIndex === 1 ? <>Finish setup <Check size={17} /></> : <>Next question <ArrowRight size={17} /></>}</button>
    </motion.div>
    <p data-testid="text-onboarding-privacy" className="mt-8 text-center text-xs leading-5 text-slate-400">Your answers personalize EduTrack. You can change them later in settings.</p>
  </QuestionShell>;
}

function QuestionShell({ children }: { children: React.ReactNode }) {
  return <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f4f5fb] px-4 py-8 text-slate-900 sm:px-6"><div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" /><div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" /><section className="relative w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_30px_80px_-35px_rgba(50,55,100,.35)] backdrop-blur-2xl sm:p-10">{children}<p className="mt-10 text-center text-xs text-slate-400">EduTrack · a calmer way to run your coaching center</p></section></main>;
}