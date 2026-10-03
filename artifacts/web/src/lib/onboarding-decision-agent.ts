/**
 * EduTrack Local Onboarding Decision Agent
 *
 * Deterministic, client-side onboarding decision layer.
 * No AI, API, network request, or external dependency.
 */

export type OnboardingAnswerMap = Record<string, string | undefined>;

export type WizardDecisionContext = {
  instituteType?: string;
  educationType?: string;
  classRange?: string;
  programType?: string;
  teacherCount?: string;
};

export type OnboardingDecision = {
  nextQuestionKey?: string;
  previousQuestionKey?: string;
  shouldResetRoleContext: boolean;
  shouldSkipTeacherSetup: boolean;
};

export function sanitizeOnboardingAnswers<T extends OnboardingAnswerMap>(
  answers: T,
): T {
  const next = { ...answers };

  if (!next.identityRole) {
    delete next.roleContext;
  }

  return next;
}

export function getOnboardingQuestionIndex(
  answers: OnboardingAnswerMap,
): number {
  if (answers.identityRole && answers.roleContext) return 2;
  if (answers.identityRole) return 1;
  return 0;
}

export function decideOnboardingNextQuestion(
  answers: OnboardingAnswerMap,
): OnboardingDecision {
  if (!answers.discoverySource) {
    return {
      nextQuestionKey: "discoverySource",
      shouldResetRoleContext: false,
      shouldSkipTeacherSetup: false,
    };
  }

  if (!answers.identityRole) {
    return {
      nextQuestionKey: "identityRole",
      shouldResetRoleContext: false,
      shouldSkipTeacherSetup: false,
    };
  }

  if (!answers.roleContext) {
    return {
      nextQuestionKey: "roleContext",
      shouldResetRoleContext: false,
      shouldSkipTeacherSetup: false,
    };
  }

  return {
    shouldResetRoleContext: false,
    shouldSkipTeacherSetup: false,
  };
}

/**
 * Parent answer -> allowed child answers.
 */
export function getVisibleEducationTypes(instituteType?: string): string[] {
  switch (instituteType) {
    case "school":
      return ["school", "academy", "other"];

    case "college":
      return ["college", "academy", "other"];

    case "university":
      return ["university", "academy", "other"];

    case "coaching_centre":
      return ["coaching_centre", "academy", "other"];

    case "training_institute":
      return ["academy", "other"];

    default:
      return [
        "school",
        "college",
        "university",
        "coaching_centre",
        "academy",
        "other",
      ];
  }
}

export function getVisibleClassRanges(educationType?: string): string[] {
  switch (educationType) {
    case "school":
      return ["play_5", "6_10", "11_12", "custom"];

    case "college":
      return ["11_12", "custom"];

    default:
      return [];
  }
}

export function getVisibleProgramTypes(educationType?: string): string[] {
  if (educationType === "coaching_centre") {
    return [
      "academic",
      "admission",
      "job",
      "skill_development",
      "mixed",
    ];
  }

  return [];
}

/**
 * Sanitizes the whole academic dependency tree.
 *
 * Only answers made invalid by a parent change are removed.
 * Unrelated answers are preserved.
 */
export function sanitizeWizardContext<T extends WizardDecisionContext>(
  context: T,
): T {
  const next = { ...context };

  const validEducationTypes = getVisibleEducationTypes(next.instituteType);
  const educationType = next.educationType;

  if (
    educationType &&
    !validEducationTypes.includes(educationType)
  ) {
    delete next.educationType;
    delete next.classRange;
    delete next.programType;
    return next;
  }

  const validClassRanges = getVisibleClassRanges(educationType);
  const validPrograms = getVisibleProgramTypes(educationType);

  if (
    next.classRange &&
    !validClassRanges.includes(next.classRange)
  ) {
    delete next.classRange;
  }

  if (
    next.programType &&
    !validPrograms.includes(next.programType)
  ) {
    delete next.programType;
  }

  return next;
}

export function getVisibleAcademicOptions(educationType?: string) {
  return {
    showClassRange: getVisibleClassRanges(educationType).length > 0,
    showPrograms: getVisibleProgramTypes(educationType).length > 0,
    classRanges: getVisibleClassRanges(educationType),
    programs: getVisibleProgramTypes(educationType),
  };
}

export function shouldSkipWizardStep(
  step: number,
  context: WizardDecisionContext,
): boolean {
  if (step === 6) {
    return (
      context.educationType === "university" ||
      context.educationType === "other"
    );
  }

  if (step === 8) {
    return context.teacherCount === "self";
  }

  return false;
}

export function getNextWizardStep(
  currentStep: number,
  context: WizardDecisionContext,
): number {
  let next = currentStep + 1;

  while (next < 9 && shouldSkipWizardStep(next, context)) {
    next += 1;
  }

  return Math.min(next, 9);
}

export function getPreviousWizardStep(
  currentStep: number,
  context: WizardDecisionContext,
): number {
  let previous = Math.max(1, currentStep - 1);

  while (previous > 1 && shouldSkipWizardStep(previous, context)) {
    previous -= 1;
  }

  return Math.max(1, previous);
}

export function validateWizardContext(
  context: WizardDecisionContext,
): string | null {
  const validClasses = getVisibleClassRanges(context.educationType);
  const validPrograms = getVisibleProgramTypes(context.educationType);

  if (
    validClasses.length > 0 &&
    !validClasses.includes(context.classRange ?? "")
  ) {
    return "Please choose a class range.";
  }

  if (
    validPrograms.length > 0 &&
    !validPrograms.includes(context.programType ?? "")
  ) {
    return "Please choose a program.";
  }

  return null;
}

export const onboardingDecisionAgent = {
  sanitizeOnboardingAnswers,
  getOnboardingQuestionIndex,
  decideOnboardingNextQuestion,
  getVisibleEducationTypes,
  getVisibleClassRanges,
  getVisibleProgramTypes,
  sanitizeWizardContext,
  getVisibleAcademicOptions,
  shouldSkipWizardStep,
  getNextWizardStep,
  getPreviousWizardStep,
  validateWizardContext,
} as const;
