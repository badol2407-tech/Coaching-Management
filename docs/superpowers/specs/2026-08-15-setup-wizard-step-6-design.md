# Setup Wizard Step 6 — Create Your First Class

## Goal

Replace the existing Step 6 placeholder in `FirstTimeSetupWizard` with a resumable,
mobile-first class creation form that keeps the current EduTrack Flowora glass
experience and leaves the wizard open after the first class is created.

## Behavior

- Step 6 edits three fields:
  - Class Name: required and trimmed before validation/submission.
  - Section: defaults to `A` and is persisted in the draft.
  - Shift: one of `Morning`, `Day`, or `Evening`.
- The draft is rehydrated from `userProfile.setupWizard.firstClassDraft` whenever
  the authenticated profile is available.
- Field changes schedule a debounced profile update containing only the draft
  (`className`, `section`, and `shift`). Draft persistence never creates a class.
- Continue validates the required Class Name. If validation fails, the form stays
  on Step 6 and shows an accessible error.
- A successful Continue creates exactly one organization-scoped Class document
  through the existing class creation path.
- If class creation fails, `setupWizard.currentStep` and
  `setupWizard.firstClassCreated` are unchanged.
- Only after class creation succeeds, persist:
  - `setupWizard.firstClassCreated = true`
  - `setupWizard.currentStep = 7`
- Back changes the wizard step to 5 without deleting the saved draft.
- Step 7 is a modular placeholder that confirms setup progress and keeps the
  wizard open. It must not create another class.
- Refreshes and later logins resume at the persisted wizard step and draft.

## UI and accessibility

- Keep the current Flowora glass surfaces, typography, controls, and wizard
  progress treatment.
- Use existing motion conventions for step transitions and respect
  `prefers-reduced-motion`.
- Keep controls touch-friendly on small screens.
- Associate labels and validation messages with their controls, expose draft
  saving/submit status to assistive technology, and disable Continue while the
  class creation mutation is in flight.

## Data flow

`FirstTimeSetupWizard` owns the local Step 6 form state. The existing auth/profile
update helper persists the debounced draft and wizard metadata. The existing
organization-scoped class hook creates the Class document. The profile refresh
or cache update after each successful write is the source of truth for reload and
cross-session resume.

## Failure handling

Draft-save errors are non-blocking and must not create a class or advance the
wizard. Class creation errors remain on Step 6, preserve the form values, show a
user-readable error, and leave wizard metadata unchanged. Successful class
creation invalidates or refreshes the class list so the new record is visible
after the wizard completes.

## Verification

- Run the web package typecheck.
- Run the web production build.
- Confirm the preview starts cleanly.
- Confirm the final changes are committed and pushed to the linked GitHub
  repository without exposing credentials.