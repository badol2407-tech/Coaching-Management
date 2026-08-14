import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleHelp,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Loader2,
  School,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { deleteField, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import {
  saveSetupWizardState,
  type ClassRange,
  type DefaultShift,
  type EducationType,
  type FirstClassShift,
  type FirstClassDraft,
  type InstituteType,
  type ProgramType,
  type SetupWizardLanguage,
  type SetupWizardStatus,
  type WeeklyHoliday,
  type WorkingDays,
} from "@/lib/setup-wizard";
import { useCreateFirstClass } from "@/lib/class-hooks";

const TOTAL_SETUP_STEPS = 7;
const currentAcademicYear = String(new Date().getFullYear());
const DEFAULT_TIME_ZONE = "Asia/Dhaka";

const instituteTypeOptions: Array<{
  value: InstituteType;
  label: string;
  Icon: LucideIcon;
}> = [
  { value: "school", label: "School", Icon: School },
  { value: "coaching_centre", label: "Coaching Centre", Icon: Building2 },
  { value: "college", label: "College", Icon: GraduationCap },
  { value: "university", label: "University", Icon: Landmark },
  { value: "training_institute", label: "Training Institute", Icon: Sparkles },
];

type StepTwoValues = {
  instituteName: string;
  instituteType: InstituteType | "";
  academicYear: string;
};

type StepThreeValues = {
  campusName: string;
  language: SetupWizardLanguage | "";
  timeZone: string;
};

type StepFourValues = {
  educationType: EducationType | "";
  classRange: ClassRange | "";
  programType: ProgramType | "";
};

type StepFiveValues = {
  weeklyHolidays: WeeklyHoliday[];
  workingDays: WorkingDays | "";
  defaultShift: DefaultShift | "";
};

type StepSixValues = {
  className: string;
  section: string;
  shift: FirstClassShift | "";
};

const educationTypeOptions: Array<{
  value: EducationType;
  label: string;
  Icon: LucideIcon;
}> = [
  { value: "school", label: "School", Icon: School },
  { value: "college", label: "College", Icon: GraduationCap },
  { value: "university", label: "University", Icon: Landmark },
  { value: "coaching_centre", label: "Coaching Centre", Icon: Building2 },
  { value: "academy", label: "Academy", Icon: Sparkles },
  { value: "other", label: "Other", Icon: CircleHelp },
];

const classRangeOptions: Array<{ value: ClassRange; label: string }> = [
  { value: "play_5", label: "Play–5" },
  { value: "6_10", label: "6–10" },
  { value: "11_12", label: "11–12" },
  { value: "custom", label: "Custom" },
];

const programOptions: Array<{ value: ProgramType; label: string }> = [
  { value: "academic", label: "Academic" },
  { value: "admission", label: "Admission" },
  { value: "job", label: "Job" },
  { value: "skill_development", label: "Skill Development" },
  { value: "mixed", label: "Mixed" },
];

const weeklyHolidayOptions: Array<{ value: WeeklyHoliday; label: string }> = [
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
  { value: "none", label: "None" },
];

const workingDaysOptions: Array<{ value: WorkingDays; label: string }> = [
  { value: 5, label: "5 Days" },
  { value: 6, label: "6 Days" },
  { value: 7, label: "7 Days" },
];

const shiftOptions: Array<{ value: DefaultShift; label: string }> = [
  { value: "morning", label: "Morning" },
  { value: "day", label: "Day" },
  { value: "evening", label: "Evening" },
  { value: "mixed", label: "Mixed" },
];

const firstClassShiftOptions: Array<{ value: FirstClassShift; label: string }> = [
  { value: "morning", label: "Morning" },
  { value: "day", label: "Day" },
  { value: "evening", label: "Evening" },
];

function getStepTwoDraft(values: StepTwoValues) {
  return {
    instituteName: values.instituteName,
    academicYear: values.academicYear,
    ...(values.instituteType ? { instituteType: values.instituteType } : {}),
  };
}

function getStepThreeDraft(values: StepThreeValues) {
  return {
    campusName: values.campusName,
    ...(values.language ? { language: values.language } : {}),
    timeZone: values.timeZone,
  };
}

function getStepFourDraft(values: StepFourValues) {
  const educationType = values.educationType || undefined;
  const isSchoolOrCollege =
    educationType === "school" || educationType === "college";
  const isCoachingCentre = educationType === "coaching_centre";

  return {
    ...(educationType ? { educationType } : {}),
    classRange:
      isSchoolOrCollege && values.classRange
        ? values.classRange
        : deleteField(),
    programType:
      isCoachingCentre && values.programType
        ? values.programType
        : deleteField(),
  };
}

function getStepFiveDraft(values: StepFiveValues) {
  return {
    weeklyHolidays: values.weeklyHolidays,
    ...(values.workingDays ? { workingDays: values.workingDays } : {}),
    ...(values.defaultShift ? { defaultShift: values.defaultShift } : {}),
  };
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  const visibleStep = Math.min(Math.max(currentStep, 1), TOTAL_SETUP_STEPS);
  const progress = (visibleStep / TOTAL_SETUP_STEPS) * 100;

  return (
    <div
      className="w-full max-w-md"
      aria-label={`Setup progress: step ${visibleStep} of ${TOTAL_SETUP_STEPS}`}
    >
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        <span>Set up your workspace</span>
        <span>
          Step {visibleStep} of {TOTAL_SETUP_STEPS}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/12">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-200 transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
        <span className={visibleStep >= 1 ? "text-teal-100" : undefined}>
          Welcome
        </span>
        <span className={visibleStep >= 2 ? "text-teal-100" : undefined}>
          Institute
        </span>
        <span className={visibleStep >= 3 ? "text-teal-100" : undefined}>
          Settings
        </span>
        <span className={visibleStep >= 4 ? "text-teal-100" : undefined}>
          Academic
        </span>
        <span className={visibleStep >= 5 ? "text-teal-100" : undefined}>
          Schedule
        </span>
        <span className={visibleStep >= 6 ? "text-teal-100" : undefined}>
          Class
        </span>
        <span className={visibleStep >= 7 ? "text-teal-100" : undefined}>
          Done
        </span>
      </div>
    </div>
  );
}

function WizardNavigation({
  onBack,
  onContinue,
  continueLabel,
  continueDisabled = false,
  isSaving = false,
}: {
  onBack: () => void;
  onContinue: () => void;
  continueLabel: string;
  continueDisabled?: boolean;
  isSaving?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={isSaving}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-semibold text-white/65 transition-all hover:border-white/25 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-28"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled || isSaving}
        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 to-cyan-300 px-5 text-sm font-bold text-slate-950 shadow-[0_12px_30px_rgba(45,212,191,0.2)] transition-all hover:-translate-y-0.5 hover:from-teal-200 hover:to-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12183b] disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {continueLabel}
        {!isSaving ? (
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        ) : null}
      </button>
    </div>
  );
}

function WelcomeStep({
  onStart,
  isSaving,
}: {
  onStart: () => void;
  isSaving: boolean;
}) {
  return (
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
        আপনার workspace-টি সাজাতে কয়েকটি সহজ ধাপ অনুসরণ করব। আপনার progress
        automatically save হবে।
      </div>
      <button
        type="button"
        onClick={onStart}
        disabled={isSaving}
        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-300 to-cyan-300 px-5 text-sm font-bold text-slate-950 shadow-[0_12px_30px_rgba(45,212,191,0.2)] transition-all hover:-translate-y-0.5 hover:from-teal-200 hover:to-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-100 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12183b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        Start Setup
        {!isSaving ? (
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        ) : null}
      </button>
    </div>
  );
}

function StepTwoContent({
  values,
  onChange,
  onBack,
  onContinue,
  isSaving,
  saveState,
}: {
  values: StepTwoValues;
  onChange: (values: Partial<StepTwoValues>) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 2
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Tell us about your institute
        </h1>
        <p className="text-sm leading-7 text-white/65 sm:text-base">
          Add a few details so EduTrack can shape your workspace around your
          institution.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="institute-name"
            className="text-sm font-semibold text-white/85"
          >
            Institute Name <span className="text-amber-200">*</span>
          </label>
          <input
            id="institute-name"
            type="text"
            value={values.instituteName}
            onChange={(event) =>
              onChange({ instituteName: event.target.value })
            }
            placeholder="e.g. EduTrack Academy"
            autoComplete="organization"
            className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-200/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-200/20"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Institute Type <span className="text-amber-200">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {instituteTypeOptions.map(({ value, label, Icon }) => {
              const selected = values.instituteType === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ instituteType: value })}
                  className={`group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border px-3 py-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/65 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                      selected
                        ? "border-teal-100/40 bg-teal-200/15 text-teal-100"
                        : "border-white/10 bg-white/[0.06] text-white/55 group-hover:text-teal-100"
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold leading-4">{label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label
            htmlFor="academic-year"
            className="text-sm font-semibold text-white/85"
          >
            Academic Year
          </label>
          <input
            id="academic-year"
            type="text"
            inputMode="numeric"
            value={values.academicYear}
            onChange={(event) =>
              onChange({ academicYear: event.target.value })
            }
            placeholder={currentAcademicYear}
            maxLength={4}
            className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-200/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-200/20"
          />
          <p className="text-xs text-white/40">
            Pre-filled with the current year. You can edit it anytime.
          </p>
        </div>
      </div>

      <div className="flex min-h-5 items-center justify-end text-xs text-white/40">
        {saveState === "saving" ? "Saving draft…" : null}
        {saveState === "saved" ? "Draft saved automatically" : null}
        {saveState === "error" ? (
          <span className="text-rose-200">Draft save will retry shortly</span>
        ) : null}
      </div>

      <WizardNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Continue"
        isSaving={isSaving}
      />
    </div>
  );
}

function StepThreeContent({
  values,
  onChange,
  onBack,
  onContinue,
  isSaving,
  saveState,
}: {
  values: StepThreeValues;
  onChange: (values: Partial<StepThreeValues>) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 3
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Basic institution settings
        </h1>
        <p className="text-sm leading-7 text-white/65 sm:text-base">
          Set the defaults your team will use across the EduTrack workspace.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="campus-name"
            className="text-sm font-semibold text-white/85"
          >
            Campus Name <span className="text-amber-200">*</span>
          </label>
          <input
            id="campus-name"
            type="text"
            value={values.campusName}
            onChange={(event) => onChange({ campusName: event.target.value })}
            placeholder="Main Campus"
            autoComplete="organization"
            className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-200/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-200/20"
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Language <span className="text-amber-200">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: "bn" as const, label: "বাংলা" },
              { value: "en" as const, label: "English" },
            ].map(({ value, label }) => {
              const selected = values.language === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ language: value })}
                  className={`flex min-h-32 items-center justify-center rounded-2xl border px-4 py-5 text-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <span className="text-sm font-semibold text-white/85">
            Time Zone <span className="text-amber-200">*</span>
          </span>
          <div
            role="textbox"
            aria-readonly="true"
            aria-label="Time Zone"
            className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 text-sm text-white/75"
          >
            <span>
              {values.timeZone || DEFAULT_TIME_ZONE}{" "}
              <span className="text-white/40">(GMT+6)</span>
            </span>
            <LockKeyhole
              className="h-4 w-4 text-white/40"
              aria-label="Locked"
            />
          </div>
          <p className="text-xs text-white/40">
            Time zone is fixed to your organization&apos;s location.
          </p>
        </div>
      </div>

      <div className="flex min-h-5 items-center justify-end text-xs text-white/40">
        {saveState === "saving" ? "Saving draft…" : null}
        {saveState === "saved" ? "Draft saved automatically" : null}
        {saveState === "error" ? (
          <span className="text-rose-200">Draft save will retry shortly</span>
        ) : null}
      </div>

      <WizardNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Continue"
        isSaving={isSaving}
      />
    </div>
  );
}

function StepFourContent({
  values,
  onChange,
  onBack,
  onContinue,
  isSaving,
  saveState,
}: {
  values: StepFourValues;
  onChange: (values: Partial<StepFourValues>) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  const showClassRange =
    values.educationType === "school" || values.educationType === "college";
  const showPrograms = values.educationType === "coaching_centre";

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 4
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Academic Structure
        </h1>
        <p className="text-sm leading-7 text-white/65 sm:text-base">
          Tell us how your learning programs are organized so EduTrack can
          tailor your workspace.
        </p>
      </div>

      <div className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Education Type <span className="text-amber-200">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {educationTypeOptions.map(({ value, label, Icon }) => {
              const selected = values.educationType === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ educationType: value })}
                  className={`group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border px-3 py-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/65 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                      selected
                        ? "border-teal-100/40 bg-teal-200/15 text-teal-100"
                        : "border-white/10 bg-white/[0.06] text-white/55 group-hover:text-teal-100"
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold leading-4">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {showClassRange ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-white/85">
              Class Range <span className="text-amber-200">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {classRangeOptions.map(({ value, label }) => {
                const selected = values.classRange === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ classRange: value })}
                    className={`flex min-h-24 items-center justify-center rounded-2xl border px-4 py-5 text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                      selected
                        ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                        : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {showPrograms ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-white/85">
              Program <span className="text-amber-200">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {programOptions.map(({ value, label }) => {
                const selected = values.programType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChange({ programType: value })}
                    className={`flex min-h-24 items-center justify-center rounded-2xl border px-4 py-5 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                      selected
                        ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                        : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}
      </div>

      <div className="flex min-h-5 items-center justify-end text-xs text-white/40">
        {saveState === "saving" ? "Saving draft…" : null}
        {saveState === "saved" ? "Draft saved automatically" : null}
        {saveState === "error" ? (
          <span className="text-rose-200">Draft save will retry shortly</span>
        ) : null}
      </div>

      <WizardNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Continue"
        isSaving={isSaving}
      />
    </div>
  );
}

function StepFiveContent({
  values,
  onChange,
  onBack,
  onContinue,
  isSaving,
  saveState,
}: {
  values: StepFiveValues;
  onChange: (values: Partial<StepFiveValues>) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  const toggleHoliday = (holiday: WeeklyHoliday) => {
    if (holiday === "none") {
      onChange({
        weeklyHolidays: values.weeklyHolidays.includes("none") ? [] : ["none"],
      });
      return;
    }

    const withoutNone = values.weeklyHolidays.filter((value) => value !== "none");
    onChange({
      weeklyHolidays: withoutNone.includes(holiday)
        ? withoutNone.filter((value) => value !== holiday)
        : [...withoutNone, holiday],
    });
  };

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 5
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Working Schedule
        </h1>
        <p className="text-sm leading-7 text-white/65 sm:text-base">
          Set the weekly rhythm EduTrack will use for your classes and
          activities.
        </p>
      </div>

      <div className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Weekly Holiday <span className="text-white/45">(multi-select)</span>{" "}
            <span className="text-amber-200">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {weeklyHolidayOptions.map(({ value, label }) => {
              const selected = values.weeklyHolidays.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleHoliday(value)}
                  className={`flex min-h-24 items-center justify-center rounded-2xl border px-3 py-5 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Working Days <span className="text-amber-200">*</span>
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {workingDaysOptions.map(({ value, label }) => {
              const selected = values.workingDays === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ workingDays: value })}
                  className={`flex min-h-24 items-center justify-center rounded-2xl border px-3 py-5 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">
            Default Class Shift <span className="text-amber-200">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {shiftOptions.map(({ value, label }) => {
              const selected = values.defaultShift === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ defaultShift: value })}
                  className={`flex min-h-24 items-center justify-center rounded-2xl border px-4 py-5 text-center text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex min-h-5 items-center justify-end text-xs text-white/40">
        {saveState === "saving" ? "Saving draft…" : null}
        {saveState === "saved" ? "Draft saved automatically" : null}
        {saveState === "error" ? (
          <span className="text-rose-200">Draft save will retry shortly</span>
        ) : null}
      </div>

      <WizardNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Continue"
        isSaving={isSaving}
      />
    </div>
  );
}

function StepSixContent({
  values,
  onChange,
  onBack,
  onContinue,
  isSaving,
  saveState,
}: {
  values: StepSixValues;
  onChange: (values: Partial<StepSixValues>) => void;
  onBack: () => void;
  onContinue: () => void;
  isSaving: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
}) {
  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 6
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Create your first class
        </h1>
        <p className="max-w-md text-sm leading-7 text-white/65 sm:text-base">
          Start with one class. You can add more sections, teachers, and students
          from your workspace later.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="first-class-name"
            className="text-sm font-semibold text-white/85"
          >
            Class Name <span className="text-amber-200">*</span>
          </label>
          <input
            id="first-class-name"
            type="text"
            value={values.className}
            onChange={(event) => onChange({ className: event.target.value })}
            placeholder="e.g. Class 10"
            autoComplete="off"
            aria-invalid={!values.className.trim()}
            className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-200/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-200/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="first-class-section"
            className="text-sm font-semibold text-white/85"
          >
            Section
          </label>
          <input
            id="first-class-section"
            type="text"
            value={values.section}
            onChange={(event) => onChange({ section: event.target.value })}
            placeholder="A"
            autoComplete="off"
            className="min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-teal-200/70 focus:bg-white/[0.1] focus:ring-2 focus:ring-teal-200/20"
          />
          <p className="text-xs text-white/40">Section A is ready by default.</p>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-white/85">Shift</legend>
          <div className="grid grid-cols-3 gap-3">
            {firstClassShiftOptions.map(({ value, label }) => {
              const selected = values.shift === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ shift: value })}
                  className={`flex min-h-20 items-center justify-center rounded-2xl border px-3 py-4 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                    selected
                      ? "border-teal-200/80 bg-teal-200/15 text-teal-50 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                      : "border-white/10 bg-white/[0.045] text-white/70 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div
        className="flex min-h-5 items-center justify-end text-xs text-white/40"
        role="status"
        aria-live="polite"
      >
        {saveState === "saving" ? "Saving draft…" : null}
        {saveState === "saved" ? "Draft saved automatically" : null}
        {saveState === "error" ? (
          <span className="text-rose-200">Draft save will retry shortly</span>
        ) : null}
      </div>

      <WizardNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueLabel="Create class"
        isSaving={isSaving}
      />
    </div>
  );
}

function StepSevenPlaceholder({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-7 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-teal-200/25 bg-teal-200/10 text-teal-100 shadow-[0_0_36px_rgba(45,212,191,0.18)]">
        <Check className="h-8 w-8" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/80">
          Step 7
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your first class is ready
        </h1>
        <p className="mx-auto max-w-md text-sm leading-7 text-white/65 sm:text-base">
          Your first class has been added to your organization. The next part of
          your workspace setup will appear here soon.
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm leading-6 text-white/60">
        <span className="font-medium text-white/85">Setup saved.</span>{" "}
        Your wizard will stay open until setup is fully completed.
      </div>
      <WizardNavigation
        onBack={onBack}
        onContinue={() => {}}
        continueLabel="Coming soon"
        continueDisabled
      />
    </div>
  );
}

export default function FirstTimeSetupWizard() {
  const { user, userProfile, refreshProfile } = useAuth();
  const createFirstClass = useCreateFirstClass();
  const dialogRef = useRef<HTMLDivElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousStepRef = useRef(
    userProfile?.setupWizard?.status === "in_progress"
      ? userProfile.setupWizard.currentStep ?? 2
      : 1,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [status, setStatus] = useState<SetupWizardStatus>(
    userProfile?.setupWizard?.status ?? "not_started",
  );
  const [currentStep, setCurrentStep] = useState(
    userProfile?.setupWizard?.status === "in_progress"
      ? userProfile.setupWizard.currentStep ?? 2
      : 1,
  );
  const [stepTwoValues, setStepTwoValues] = useState<StepTwoValues>({
    instituteName: userProfile?.setupWizard?.instituteName ?? "",
    instituteType: userProfile?.setupWizard?.instituteType ?? "",
    academicYear: userProfile?.setupWizard?.academicYear ?? currentAcademicYear,
  });
  const [stepThreeValues, setStepThreeValues] = useState<StepThreeValues>({
    campusName: userProfile?.setupWizard?.campusName ?? "Main Campus",
    language: userProfile?.setupWizard?.language ?? "",
    timeZone: userProfile?.setupWizard?.timeZone ?? DEFAULT_TIME_ZONE,
  });
  const [stepFourValues, setStepFourValues] = useState<StepFourValues>({
    educationType: userProfile?.setupWizard?.educationType ?? "",
    classRange: userProfile?.setupWizard?.classRange ?? "",
    programType: userProfile?.setupWizard?.programType ?? "",
  });
  const [stepFiveValues, setStepFiveValues] = useState<StepFiveValues>({
    weeklyHolidays: userProfile?.setupWizard?.weeklyHolidays ?? [],
    workingDays: userProfile?.setupWizard?.workingDays ?? "",
    defaultShift: userProfile?.setupWizard?.defaultShift ?? "",
  });
  const [stepSixValues, setStepSixValues] = useState<StepSixValues>({
    className: userProfile?.setupWizard?.firstClassDraft?.className ?? "",
    section: userProfile?.setupWizard?.firstClassDraft?.section ?? "A",
    shift: userProfile?.setupWizard?.firstClassDraft?.shift ?? "",
  });

  useEffect(() => {
    const persistedWizard = userProfile?.setupWizard;
    if (!persistedWizard) return;

    const nextStep =
      persistedWizard.status === "in_progress"
        ? persistedWizard.firstClassCreated
          ? 7
          : persistedWizard.currentStep ?? 2
        : 1;
    setStatus(persistedWizard.status);
    setCurrentStep(nextStep);
    setStepTwoValues({
      instituteName: persistedWizard.instituteName ?? "",
      instituteType: persistedWizard.instituteType ?? "",
      academicYear: persistedWizard.academicYear ?? currentAcademicYear,
    });
    setStepThreeValues({
      campusName: persistedWizard.campusName ?? "Main Campus",
      language: persistedWizard.language ?? "",
      timeZone: persistedWizard.timeZone ?? DEFAULT_TIME_ZONE,
    });
    setStepFourValues({
      educationType: persistedWizard.educationType ?? "",
      classRange: persistedWizard.classRange ?? "",
      programType: persistedWizard.programType ?? "",
    });
    setStepFiveValues({
      weeklyHolidays: persistedWizard.weeklyHolidays ?? [],
      workingDays: persistedWizard.workingDays ?? "",
      defaultShift: persistedWizard.defaultShift ?? "",
    });
    setStepSixValues({
      className: persistedWizard.firstClassDraft?.className ?? "",
      section: persistedWizard.firstClassDraft?.section ?? "A",
      shift: persistedWizard.firstClassDraft?.shift ?? "",
    });
  }, [userProfile?.setupWizard]);

  useEffect(() => {
    if (
      !user ||
      status !== "in_progress" ||
      currentStep !== 2 ||
      !stepTwoValues.instituteName.trim() &&
        !stepTwoValues.instituteType &&
        !stepTwoValues.academicYear.trim()
    ) {
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      setSaveState("saving");
      void saveSetupWizardState(user.uid, getStepTwoDraft(stepTwoValues))
        .then(() => setSaveState("saved"))
        .catch(() => {
          setSaveState("error");
          setError("Your draft could not be saved. We’ll keep trying.");
        });
    }, 650);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [currentStep, status, stepTwoValues, user]);

  useEffect(() => {
    if (
      !user ||
      status !== "in_progress" ||
      currentStep !== 3 ||
      !stepThreeValues.campusName.trim() &&
        !stepThreeValues.language &&
        !stepThreeValues.timeZone.trim()
    ) {
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      setSaveState("saving");
      void saveSetupWizardState(user.uid, getStepThreeDraft(stepThreeValues))
        .then(() => setSaveState("saved"))
        .catch(() => {
          setSaveState("error");
          setError("Your draft could not be saved. We’ll keep trying.");
        });
    }, 650);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [currentStep, status, stepThreeValues, user]);

  useEffect(() => {
    if (
      !user ||
      status !== "in_progress" ||
      currentStep !== 4 ||
      !stepFourValues.educationType
    ) {
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      setSaveState("saving");
      void saveSetupWizardState(user.uid, getStepFourDraft(stepFourValues))
        .then(() => setSaveState("saved"))
        .catch(() => {
          setSaveState("error");
          setError("Your draft could not be saved. We’ll keep trying.");
        });
    }, 650);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [currentStep, status, stepFourValues, user]);

  useEffect(() => {
    if (
      !user ||
      status !== "in_progress" ||
      currentStep !== 5 ||
      (!stepFiveValues.weeklyHolidays.length &&
        !stepFiveValues.workingDays &&
        !stepFiveValues.defaultShift)
    ) {
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      setSaveState("saving");
      void saveSetupWizardState(user.uid, getStepFiveDraft(stepFiveValues))
        .then(() => setSaveState("saved"))
        .catch(() => {
          setSaveState("error");
          setError("Your draft could not be saved. We’ll keep trying.");
        });
    }, 650);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [currentStep, status, stepFiveValues, user]);

  useEffect(() => {
    if (!user || status !== "in_progress" || currentStep !== 6) {
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      setSaveState("saving");
      const firstClassDraft: FirstClassDraft = {
        className: stepSixValues.className,
        section: stepSixValues.section,
        ...(stepSixValues.shift ? { shift: stepSixValues.shift } : {}),
      };
      void saveSetupWizardState(user.uid, { firstClassDraft })
        .then(() => setSaveState("saved"))
        .catch(() => {
          setSaveState("error");
          setError("Your draft could not be saved. We’ll keep trying.");
        });
    }, 650);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [currentStep, status, stepSixValues, user]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
  }, []);

  const updateStepTwoValues = (values: Partial<StepTwoValues>) => {
    setError("");
    setSaveState("idle");
    setStepTwoValues((current) => ({ ...current, ...values }));
  };

  const updateStepThreeValues = (values: Partial<StepThreeValues>) => {
    setError("");
    setSaveState("idle");
    setStepThreeValues((current) => ({ ...current, ...values }));
  };

  const updateStepFourValues = (values: Partial<StepFourValues>) => {
    setError("");
    setSaveState("idle");
    setStepFourValues((current) => {
      const nextEducationType = values.educationType ?? current.educationType;
      const educationTypeChanged =
        values.educationType !== undefined &&
        values.educationType !== current.educationType;
      const isSchoolOrCollege =
        nextEducationType === "school" || nextEducationType === "college";
      const isCoachingCentre = nextEducationType === "coaching_centre";

      return {
        ...current,
        ...values,
        classRange:
          educationTypeChanged || !isSchoolOrCollege
            ? ""
            : (values.classRange ?? current.classRange),
        programType:
          educationTypeChanged || !isCoachingCentre
            ? ""
            : (values.programType ?? current.programType),
      };
    });
  };

  const updateStepFiveValues = (values: Partial<StepFiveValues>) => {
    setError("");
    setSaveState("idle");
    setStepFiveValues((current) => ({
      ...current,
      ...values,
      weeklyHolidays: values.weeklyHolidays
        ? values.weeklyHolidays.includes("none")
          ? ["none"]
          : values.weeklyHolidays
        : current.weeklyHolidays,
    }));
  };

  const updateStepSixValues = (values: Partial<StepSixValues>) => {
    setError("");
    setSaveState("idle");
    setStepSixValues((current) => ({ ...current, ...values }));
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
        startedAt: serverTimestamp(),
      });
      await refreshProfile();
    } catch {
      setStatus("not_started");
      setCurrentStep(1);
      setError("We couldn’t save your progress. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = async () => {
    if (!user || isSaving || currentStep <= 1) return;

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    const nextStep = Math.max(1, currentStep - 1);
    setIsSaving(true);
    setError("");
    try {
      if (currentStep === 2) {
        await saveSetupWizardState(user.uid, getStepTwoDraft(stepTwoValues));
      }
      if (currentStep === 3) {
        await saveSetupWizardState(user.uid, getStepThreeDraft(stepThreeValues));
      }
      if (currentStep === 4 && stepFourValues.educationType) {
        await saveSetupWizardState(user.uid, getStepFourDraft(stepFourValues));
      }
      if (
        currentStep === 5 &&
        (stepFiveValues.weeklyHolidays.length ||
          stepFiveValues.workingDays ||
          stepFiveValues.defaultShift)
      ) {
        await saveSetupWizardState(user.uid, getStepFiveDraft(stepFiveValues));
      }
      await saveSetupWizardState(user.uid, { currentStep: nextStep });
      setCurrentStep(nextStep);
    } catch {
      setError("We couldn’t move back. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepTwoContinue = async () => {
    if (!user || isSaving) return;

    const instituteName = stepTwoValues.instituteName.trim();
    const academicYear = stepTwoValues.academicYear.trim();

    if (!instituteName) {
      setError("Please enter your institute name.");
      return;
    }
    if (!stepTwoValues.instituteType) {
      setError("Please choose your institute type.");
      return;
    }
    if (!/^\d{4}$/.test(academicYear)) {
      setError("Please enter a valid four-digit academic year.");
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setIsSaving(true);
    setSaveState("saving");
    setError("");

    try {
      await saveSetupWizardState(
        user.uid,
        getStepTwoDraft({
          instituteName,
          instituteType: stepTwoValues.instituteType,
          academicYear,
        }),
      );
      await saveSetupWizardState(user.uid, { currentStep: 3 });
      setStepTwoValues({
        instituteName,
        instituteType: stepTwoValues.instituteType,
        academicYear,
      });
      setCurrentStep(3);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setError("We couldn’t save your institute details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepThreeContinue = async () => {
    if (!user || isSaving) return;

    const campusName = stepThreeValues.campusName.trim();
    const timeZone = stepThreeValues.timeZone.trim();

    if (!campusName) {
      setError("Please enter your campus name.");
      return;
    }
    if (!stepThreeValues.language) {
      setError("Please choose a language.");
      return;
    }
    if (!timeZone) {
      setError("Time zone is required.");
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setIsSaving(true);
    setSaveState("saving");
    setError("");

    try {
      await saveSetupWizardState(
        user.uid,
        getStepThreeDraft({
          campusName,
          language: stepThreeValues.language,
          timeZone,
        }),
      );
      await saveSetupWizardState(user.uid, { currentStep: 4 });
      setStepThreeValues({
        campusName,
        language: stepThreeValues.language,
        timeZone,
      });
      setCurrentStep(4);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setError("We couldn’t save your institution settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepFourContinue = async () => {
    if (!user || isSaving) return;

    const { educationType, classRange, programType } = stepFourValues;
    const isSchoolOrCollege =
      educationType === "school" || educationType === "college";
    const isCoachingCentre = educationType === "coaching_centre";

    if (!educationType) {
      setError("Please choose an education type.");
      return;
    }
    if (isSchoolOrCollege && !classRange) {
      setError("Please choose a class range.");
      return;
    }
    if (isCoachingCentre && !programType) {
      setError("Please choose a program.");
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setIsSaving(true);
    setSaveState("saving");
    setError("");

    try {
      await saveSetupWizardState(user.uid, getStepFourDraft(stepFourValues));
      await saveSetupWizardState(user.uid, { currentStep: 5 });
      setCurrentStep(5);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setError("We couldn’t save your academic structure. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepFiveContinue = async () => {
    if (!user || isSaving) return;

    const { weeklyHolidays, workingDays, defaultShift } = stepFiveValues;

    if (!weeklyHolidays.length) {
      setError("Please choose at least one weekly holiday option.");
      return;
    }
    if (!workingDays) {
      setError("Please choose the number of working days.");
      return;
    }
    if (!defaultShift) {
      setError("Please choose a default class shift.");
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setIsSaving(true);
    setSaveState("saving");
    setError("");

    try {
      await saveSetupWizardState(user.uid, getStepFiveDraft(stepFiveValues));
      await saveSetupWizardState(user.uid, { currentStep: 6 });
      setCurrentStep(6);
      setSaveState("saved");
    } catch {
      setSaveState("error");
      setError("We couldn’t save your working schedule. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepSixContinue = async () => {
    if (!user || isSaving) return;

    const className = stepSixValues.className.trim();
    const section = stepSixValues.section.trim() || "A";

    if (!className) {
      setError("Please enter a class name.");
      return;
    }

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    setIsSaving(true);
    setSaveState("saving");
    setError("");

    try {
      const firstClassDraft: FirstClassDraft = {
        className,
        section,
        ...(stepSixValues.shift ? { shift: stepSixValues.shift } : {}),
      };
      await createFirstClass.mutateAsync({
        data: {
          name: className,
          section,
          ...(stepSixValues.shift ? { shift: stepSixValues.shift } : {}),
          setupWizardFirstClass: true,
        },
      });
      await saveSetupWizardState(user.uid, {
        firstClassDraft,
        firstClassCreated: true,
        currentStep: 7,
      });
      setStepSixValues({ className, section, shift: stepSixValues.shift });
      setCurrentStep(7);
      setSaveState("saved");
      await refreshProfile();
    } catch {
      setSaveState("error");
      setError("We couldn’t create your first class. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const visibleStep = Math.min(Math.max(1, currentStep), TOTAL_SETUP_STEPS);
  const slideDirection = visibleStep >= previousStepRef.current ? 1 : -1;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    previousStepRef.current = visibleStep;
  }, [visibleStep]);

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
        </header>

        <div className="mx-auto mt-10 w-full sm:mt-14">
          <ProgressBar currentStep={visibleStep} />
        </div>

        <main className="flex flex-1 items-center justify-center py-10 sm:py-14">
          <section className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.085] p-6 shadow-[0_28px_100px_rgba(2,8,23,0.45)] backdrop-blur-2xl sm:p-10">
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
              aria-hidden="true"
            />

            <div id="setup-wizard-title">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={visibleStep}
                  initial={{ opacity: 0, x: slideDirection * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: slideDirection * -28 }}
                   transition={
                     prefersReducedMotion
                       ? { duration: 0 }
                       : { duration: 0.3, ease: "easeOut" }
                   }
                >
                  {visibleStep === 1 ? (
                    <WelcomeStep onStart={handleStart} isSaving={isSaving} />
                  ) : visibleStep === 2 ? (
                    <StepTwoContent
                      values={stepTwoValues}
                      onChange={updateStepTwoValues}
                      onBack={() => void handleBack()}
                      onContinue={() => void handleStepTwoContinue()}
                      isSaving={isSaving}
                      saveState={saveState}
                    />
                  ) : visibleStep === 3 ? (
                    <StepThreeContent
                      values={stepThreeValues}
                      onChange={updateStepThreeValues}
                      onBack={() => void handleBack()}
                      onContinue={() => void handleStepThreeContinue()}
                      isSaving={isSaving}
                      saveState={saveState}
                    />
                  ) : visibleStep === 4 ? (
                    <StepFourContent
                      values={stepFourValues}
                      onChange={updateStepFourValues}
                      onBack={() => void handleBack()}
                      onContinue={() => void handleStepFourContinue()}
                      isSaving={isSaving}
                      saveState={saveState}
                    />
                  ) : visibleStep === 5 ? (
                    <StepFiveContent
                      values={stepFiveValues}
                      onChange={updateStepFiveValues}
                      onBack={() => void handleBack()}
                      onContinue={() => void handleStepFiveContinue()}
                      isSaving={isSaving}
                      saveState={saveState}
                    />
                  ) : visibleStep === 6 ? (
                    <StepSixContent
                      values={stepSixValues}
                      onChange={updateStepSixValues}
                      onBack={() => void handleBack()}
                      onContinue={() => void handleStepSixContinue()}
                      isSaving={isSaving}
                      saveState={saveState}
                    />
                  ) : (
                    <StepSevenPlaceholder onBack={() => void handleBack()} />
                  )}
                </motion.div>
              </AnimatePresence>
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