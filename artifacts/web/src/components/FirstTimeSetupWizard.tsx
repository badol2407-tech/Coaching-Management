import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { serverTimestamp } from "firebase/firestore";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  saveSetupWizardState,
  type SetupWizardStatus,
} from "@/lib/setup-wizard";

function ProgressBar({ currentStep }: { currentStep: number }) {
  const progress = currentStep >= 2 ? 100 : 50;

  return (
    <div
      className="w-full max-w-md"
      aria-label={`Setup progress: step ${currentStep} of 2`}
    >
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        <span>Set up your workspace</span>
        <span>Step {currentStep} of 2</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-200 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
        <span className={currentStep >= 1 ? "text-teal-100" : undefined}>
          Welcome
        </span>
        <span className={currentStep >= 2 ? "text-teal-100" : undefined}>
          Next step
        </span>
      </div>
    </div>
  );
}

function StepTwoPlaceholder() {
  return (
    <div className="space-y-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-teal-200/25 bg-teal-200/10 text-teal-100 shadow-[0_0_36px_rgba(45,212,191,0.18)]">
        <Check className="h-8 w-8" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 2
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          You’re ready for the next step
        </h1>
        <p className="mx-auto max-w-md text-sm leading-7 text-white/65 sm:text-base">
          Your setup progress is saved. The next part of your organization setup
          will appear here soon.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm text-white/60">
        <span className="font-medium text-white/85">Saved automatically.</span>{" "}
        You can safely leave this screen and come back from your dashboard.
      </div>
    </div>
  );
}

export default function FirstTimeSetupWizard() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [, navigate] = useLocation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<SetupWizardStatus>(
    userProfile?.setupWizard?.status ?? "not_started",
  );
  const [currentStep, setCurrentStep] = useState(
    userProfile?.setupWizard?.status === "in_progress"
      ? userProfile.setupWizard.currentStep ?? 2
      : 1,
  );

  const handleSkip = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    setError("");
    try {
      await saveSetupWizardState(user.uid, { status: "skipped" });
      await refreshProfile();
      navigate("/");
    } catch {
      setError("We couldn’t save your choice. Please try again.");
      setIsSaving(false);
    }
  };

  const handleStart = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    setError("");
    setStatus("in_progress");
    setCurrentStep(2);

    try {
      await saveSetupWizardState(user.uid, {
        status: "in_progress",
        currentStep: 2,
        completedSteps: [],
        startedAt: serverTimestamp(),
      });
      await refreshProfile();
      setIsSaving(false);
    } catch {
      setStatus("not_started");
      setCurrentStep(1);
      setError("We couldn’t save your progress. Please try again.");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        void handleSkip();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving]);

  const showStepTwo = status === "in_progress" && currentStep >= 2;

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] min-h-[100dvh] overflow-y-auto bg-[#080d2b] text-white outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-wizard-title"
      tabIndex={-1}
    >
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-teal-400/20 blur-[100px]" />
        <div className="absolute -right-28 top-[18%] h-[26rem] w-[26rem] rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="absolute bottom-[-12rem] left-[20%] h-[24rem] w-[24rem] rounded-full bg-amber-300/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_42%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3" aria-label="EduTrack">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-[0_8px_30px_rgba(15,23,42,0.24)] backdrop-blur-xl">
              <Sparkles
                className="h-5 w-5 text-teal-100"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-wide text-white">
                EduTrack
              </p>
              <p className="text-[11px] text-white/45">
                Your institution, in sync
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleSkip()}
            disabled={isSaving}
            className="min-h-11 rounded-full border border-white/15 bg-white/[0.07] px-4 text-sm font-medium text-white/75 transition-colors hover:border-white/30 hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Skip for now"}
          </button>
        </header>

        <div className="mx-auto mt-10 w-full sm:mt-14">
          <ProgressBar currentStep={showStepTwo ? 2 : 1} />
        </div>

        <main className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <section className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.085] p-6 shadow-[0_28px_100px_rgba(2,8,23,0.45)] backdrop-blur-2xl sm:p-10">
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
              aria-hidden="true"
            />

            <div id="setup-wizard-title">
              {showStepTwo ? (
                <StepTwoPlaceholder />
              ) : (
                <div className="space-y-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-amber-200/25 bg-gradient-to-br from-amber-200/20 to-teal-200/10 text-amber-100 shadow-[0_0_36px_rgba(251,191,36,0.16)]">
                    <Sparkles className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/80">
                      Welcome
                    </p>
                    <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                      Welcome to EduTrack !!!
                    </h1>
                    <p className="text-base leading-8 text-white/70 sm:text-lg">
                      চলুন ২ মিনিটে আপনার প্রতিষ্ঠান প্রস্তুত করি।
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm leading-6 text-white/60">
                    আপনার workspace-টি সাজাতে কয়েকটি সহজ ধাপ অনুসরণ করব।
                    আপনার progress automatically save হবে।
                  </div>
                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => void handleStart()}
                      disabled={isSaving}
                      className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 to-cyan-300 px-5 text-sm font-bold text-slate-950 shadow-[0_12px_30px_rgba(45,212,191,0.2)] transition-all hover:-translate-y-0.5 hover:from-teal-200 hover:to-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12183b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : null}
                      Start Setup
                      {!isSaving ? (
                        <ChevronRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSkip()}
                      disabled={isSaving}
                      className="min-h-11 rounded-xl px-5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {error ? (
              <p className="mt-5 text-center text-sm text-rose-200" role="alert">
                {error}
              </p>
            ) : null}
          </section>
        </main>

        <p className="pb-2 text-center text-xs text-white/35 sm:pb-0">
          Your workspace stays private and scoped to your organization.
        </p>
      </div>
    </div>
  );
}