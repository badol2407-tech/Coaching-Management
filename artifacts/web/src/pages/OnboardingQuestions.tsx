import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Facebook,
  GraduationCap,
  HeartHandshake,
  Loader2,
  Megaphone,
  MessageCircle,
  MonitorPlay,
  Search,
  School,
  Sparkles,
  Users,
  UserRound,
  UserRoundCheck,
  Youtube,
} from "lucide-react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useLocation } from "wouter";

type AnswerKey = "discoverySource" | "identityRole" | "roleContext";
type Answer = Partial<Record<AnswerKey, string>>;

type OnboardingOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

type OnboardingQuestion = {
  key: AnswerKey;
  title: string;
  description: string;
  options: OnboardingOption[];
};

const discoveryOptions: OnboardingOption[] = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "google_search", label: "Google Search", icon: Search },
  { value: "friends_colleagues", label: "Friends / Colleagues", icon: Users },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "school_recommendation", label: "School Recommendation", icon: School },
  { value: "ads", label: "Ads", icon: Megaphone },
  { value: "other", label: "Other", icon: Sparkles },
];

const roleOptions: OnboardingOption[] = [
  { value: "school_owner", label: "School Owner", icon: School },
  { value: "coaching_centre_owner", label: "Coaching Centre Owner", icon: BriefcaseBusiness },
  { value: "teacher", label: "Teacher", icon: GraduationCap },
  { value: "student", label: "Student", icon: BookOpen },
  { value: "guardian", label: "Guardian", icon: HeartHandshake },
  { value: "administrative_staff", label: "Administrative Staff", icon: UserRoundCheck },
  { value: "other", label: "Other", icon: UserRound },
];

const roleFollowUps: Record<string, OnboardingQuestion> = {
  school_owner: {
    key: "roleContext",
    title: "What would you like to organize first?",
    description: "This helps us shape your first EduTrack experience.",
    options: [
      { value: "students_and_classes", label: "Students & classes", icon: Users },
      { value: "attendance", label: "Attendance", icon: BadgeCheck },
      { value: "fees", label: "Fees & payments", icon: BarChart3 },
    ],
  },
  coaching_centre_owner: {
    key: "roleContext",
    title: "What would make the biggest difference for your centre?",
    description: "Choose the area you want to manage more smoothly.",
    options: [
      { value: "student_management", label: "Student management", icon: Users },
      { value: "attendance", label: "Attendance tracking", icon: BadgeCheck },
      { value: "fees", label: "Fees & payments", icon: BarChart3 },
    ],
  },
  teacher: {
    key: "roleContext",
    title: "What would you like to stay on top of?",
    description: "We will use this to keep your starting view relevant.",
    options: [
      { value: "attendance", label: "Student attendance", icon: BadgeCheck },
      { value: "progress", label: "Student progress", icon: BarChart3 },
      { value: "class_planning", label: "Class planning", icon: BookOpen },
    ],
  },
  student: {
    key: "roleContext",
    title: "What are you using EduTrack for?",
    description: "Tell us what you want to make easier.",
    options: [
      { value: "track_attendance", label: "Track my attendance", icon: BadgeCheck },
      { value: "follow_progress", label: "Follow my progress", icon: BarChart3 },
      { value: "stay_connected", label: "Stay connected with my centre", icon: MessageCircle },
    ],
  },
  guardian: {
    key: "roleContext",
    title: "What would you like to follow most closely?",
    description: "This helps us make the experience useful for your family.",
    options: [
      { value: "attendance", label: "Attendance", icon: BadgeCheck },
      { value: "progress", label: "Learning progress", icon: BarChart3 },
      { value: "fees", label: "Fees & payments", icon: BarChart3 },
    ],
  },
  administrative_staff: {
    key: "roleContext",
    title: "Which area do you handle most often?",
    description: "Choose the work you want to bring into one calmer workflow.",
    options: [
      { value: "student_records", label: "Student records", icon: Users },
      { value: "attendance", label: "Attendance", icon: BadgeCheck },
      { value: "fees", label: "Fees & payments", icon: BarChart3 },
    ],
  },
  other: {
    key: "roleContext",
    title: "What would you like EduTrack to help with?",
    description: "Choose the closest fit for your day-to-day work.",
    options: [
      { value: "organize_information", label: "Organize information", icon: Users },
      { value: "save_time", label: "Save time", icon: MonitorPlay },
      { value: "stay_connected", label: "Stay connected", icon: MessageCircle },
    ],
  },
};

const baseQuestions: OnboardingQuestion[] = [
  {
    key: "discoverySource",
    title: "আপনি EduTrack সম্পর্কে কীভাবে জানতে পেরেছেন?",
    description: "আপনার জন্য সবচেয়ে কাছের উত্তরটি বেছে নিন।",
    options: discoveryOptions,
  },
  {
    key: "identityRole",
    title: "নিচের কোনটি আপনার পরিচয় সবচেয়ে ভালোভাবে প্রকাশ করে?",
    description: "আপনার EduTrack অভিজ্ঞতা আরও প্রাসঙ্গিক করতে সাহায্য করুন।",
    options: roleOptions,
  },
];

export default function OnboardingQuestions() {
  const { user, userProfile, loading: authLoading, refreshProfile } = useAuth();
  const [, setLocation] = useLocation();
  const [answers, setAnswers] = useState<Answer>(() => userProfile?.onboardingAnswers ?? {});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const questions = useMemo(() => {
    const role = answers.identityRole;
    return role ? [...baseQuestions, roleFollowUps[role]] : baseQuestions;
  }, [answers.identityRole]);
  const question = questions[questionIndex] ?? baseQuestions[0];
  const selected = answers[question.key];

  const choose = async (value: string) => {
    if (saving || !user) {
      if (!user) setError("Your session is still loading. Please try again.");
      return;
    }

    const nextAnswers = { ...answers, [question.key]: value };
    setAnswers(nextAnswers);
    setError("");
    setSaving(true);

    try {
      const isLastQuestion = questionIndex === questions.length - 1;
      await updateDoc(doc(db, "users", user.uid), {
        onboardingAnswers: nextAnswers,
        onboardingCompleted: isLastQuestion,
        profileSetupStep: isLastQuestion ? "complete" : "questions",
        updatedAt: serverTimestamp(),
      });

      if (isLastQuestion) {
        await refreshProfile();
        setLocation("/");
      } else {
        setQuestionIndex((index) => index + 1);
      }
    } catch {
      setAnswers(answers);
      setError("We could not save your answer. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <QuestionShell>
        <div data-testid="status-onboarding-loading" className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </QuestionShell>
    );
  }

  return (
    <QuestionShell>
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          data-testid="button-back-onboarding"
          onClick={() => questionIndex ? setQuestionIndex((index) => index - 1) : setLocation("/profile-setup")}
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Almost there</span>
      </div>

      <div className="mb-9 flex items-center gap-3">
        <div className="flex flex-1 gap-1.5">
          {questions.map((item, index) => (
            <div key={`${item.key}-${index}`} className={`h-1.5 flex-1 rounded-full ${index <= questionIndex ? "bg-indigo-600" : "bg-slate-200"}`} />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400">{questionIndex + 1} of {questions.length}</span>
      </div>

      <motion.div key={`${question.key}-${questionIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
        <div>
          <p className="text-sm font-medium text-slate-500">A couple of thoughtful questions</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{question.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{question.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={question.title}>
          {question.options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;
            return (
              <button
                type="button"
                key={option.value}
                data-testid={`button-option-${option.value}`}
                role="radio"
                aria-checked={isSelected}
                disabled={saving}
                onClick={() => void choose(option.value)}
                className={`group relative flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition active:scale-[0.98] sm:min-h-36 ${
                  isSelected
                    ? "border-indigo-400 bg-indigo-50/90 shadow-[0_14px_35px_-22px_rgba(79,70,229,.9)]"
                    : "border-slate-200 bg-white/60 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white"
                } disabled:cursor-wait disabled:opacity-70`}
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl transition ${
                  isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                }`}>
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <strong className="text-sm font-semibold leading-5 text-slate-800">{option.label}</strong>
                <span className={`absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full border transition ${
                  isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white/70 text-transparent"
                }`}>
                  {isSelected && <Check size={13} />}
                </span>
              </button>
            );
          })}
        </div>

        {saving && (
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-indigo-600" role="status">
            <Loader2 size={15} className="animate-spin" /> Saving your answer…
          </div>
        )}
        {error && (
          <div data-testid="status-onboarding-error" role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
            <AlertCircle size={17} />{error}
          </div>
        )}
      </motion.div>

      <p data-testid="text-onboarding-privacy" className="mt-8 text-center text-xs leading-5 text-slate-400">Your answers personalize EduTrack. You can change them later in settings.</p>
    </QuestionShell>
  );
}

function QuestionShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#f4f5fb] px-4 py-8 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl" />
      <section className="relative w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-[0_30px_80px_-35px_rgba(50,55,100,.35)] backdrop-blur-2xl sm:p-10">
        {children}
        <p className="mt-10 text-center text-xs text-slate-400">EduTrack · a calmer way to run your coaching center</p>
      </section>
    </main>
  );
}