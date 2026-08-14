# Setup Wizard Step 2 Design

## Goal

Extend the existing EduTrack onboarding modal with institute information
collection while preserving the Flowora glassmorphism shell, keeping the
wizard open, and making the next step immediately visible after Continue.

## Architecture

- Keep one reusable wizard shell responsible for the modal, focus management,
  progress, shared navigation, errors, and loading state.
- Render each step through an isolated content component:
  - Welcome/start content
  - Institute information content
  - A temporary Step 3 placeholder
- Keep step-specific state and validation in the wizard component until future
  steps need their own hooks or modules.
- Use a step count constant so adding later steps does not require changing the
  shell structure.

## Persistence

- Add institute fields to the typed setup wizard state:
  `instituteName`, `instituteType`, and `academicYear`.
- Persist all changes with Firestore nested field paths such as
  `setupWizard.instituteName`.
- Never write a replacement `setupWizard` object.
- Debounce draft field writes while Step 2 is open.
- On Continue, validate the institute name, institute type, and academic year,
  flush the final field values, then persist `setupWizard.currentStep = 3`.
- Preserve existing fields, status, timestamps, and completed-step data.

## Navigation and resume behavior

- Step 2 Back persists `currentStep = 1` and returns to Welcome without leaving
  the modal.
- Continue persists `currentStep = 3` and renders Step 3 in the same modal.
- The wizard remains gated while setup status is `in_progress`; no dashboard
  redirect is introduced.
- The initial step and draft values come from the persisted profile so refresh
  and login resume the saved progress.
- Step changes use a short directional slide transition.

## Error handling

- Required field errors block Continue and are announced in the existing alert
  region.
- Auto-save failures are surfaced without discarding local draft values.
- Final-save failures keep the user on Step 2 so the action can be retried.