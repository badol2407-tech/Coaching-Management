# Setup Wizard Step 7 — Teacher Setup Decision

## Goal

Replace the current Step 7 class-complete placeholder with a mobile-first
teacher-count decision that determines whether the first-teacher flow is needed.
Keep the wizard open and preserve the current Flowora glass experience.

## Behavior

- Expand wizard progress to nine steps.
- Step 7 presents exactly three large, one-click choices:
  - `আমি নিজেই`
  - `2–10`
  - `10+`
- The selection is rehydrated from `userProfile.setupWizard.teacherCount`.
- Debounced draft persistence writes only `setupWizard.teacherCount`.
- Continue requires a selection:
  - `আমি নিজেই`: persist `teacherSetupSkipped = true` and `currentStep = 9`.
  - `2–10` or `10+`: persist `teacherSetupSkipped = false` and `currentStep = 8`.
- Selecting a non-self choice clears any prior skip decision when Continue
  persists the branch.
- Back returns to Step 6 and preserves the selected teacher-count draft.
- Step 8 is a modular, non-persistent handoff screen titled `Create Your First
  Teacher`; it does not create a teacher yet.
- Step 9 has no new placeholder UI; its persisted step value is reserved for the
  future Subscription/Pricing step.
- Refresh and login resume from the persisted current step and selection.

## UI and accessibility

- Keep the existing Flowora glass surfaces, typography, controls, and wizard
  progress shell.
- The three choices are full-width touch-friendly buttons with pressed state,
  visible focus, and a group label.
- Continue is disabled until a choice is selected; validation remains announced
  through the existing alert region.
- Preserve step transitions and respect `prefers-reduced-motion`.

## Data flow and failure handling

The component owns the local teacher-count selection. A debounced effect updates
only `teacherCount`. Continue performs one wizard-state write containing the
selection, branch flag, and next step. If that write fails, the wizard remains on
Step 7 and does not change the local step. Back persists only the selection draft
and Step 6. No teacher or subscription document is created by this change.

## Verification

- Run workspace typecheck.
- Run the web production build.
- Restart the EduTrack preview workflow and inspect its logs.
- Commit and push the implementation to GitHub.