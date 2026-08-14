# Academic Structure Setup Step

## Goal

Replace the onboarding wizard's Step 4 placeholder with a card-based Academic
Structure step and add a modular Step 5 placeholder without changing the
Flowora-style wizard shell, navigation behavior, or refresh-resume flow.

## Design

- Step 4 presents six large Education Type cards: School, College, University,
  Coaching Centre, Academy, and Other.
- School and College reveal a second card group for Play–5, 6–10, 11–12, or
  Custom. Coaching Centre reveals Academic, Admission, Job, Skill Development,
  or Mixed.
- Education Type is always required. A conditional card group is required when
  the selected type is School, College, or Coaching Centre.
- Selecting a different Education Type clears incompatible in-memory choices
  and the corresponding nested Firestore fields.
- Draft saves are debounced and use dotted nested Firestore paths only:
  `setupWizard.educationType`, `setupWizard.classRange`, and
  `setupWizard.programType`. Conditional fields are deleted when they no longer
  apply.
- Continue performs a final Step 4 save and then saves
  `setupWizard.currentStep = 5`. Back moves to Step 3 and the wizard remains
  open.
- Step 5 is an independent placeholder component with the existing wizard
  navigation treatment and a Back action to Step 4.

## Verification

Run the web package typecheck and production build, restart the web preview,
inspect workflow/browser logs, and verify the wizard renders through Step 5
without redirects or dashboard navigation.