---
title: EduTrack Time Picker Handbook
purpose: Define accessible, locale-aware, and constrainable time selection for forms requiring session or event time input.
scope: Attendance session start and end times, Exam slot times, scheduled Notification delivery times, and event time input in Organization settings.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERNATIONALIZATION.md
  - ../STATE_SYSTEM.md
  - ./Date Picker.md
  - ./Text Field.md
  - ./Select.md
review_frequency: Quarterly and before time input, locale, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Time Picker, time input, hour, minute, AM/PM, 24-hour, locale, constraint
---

# Time Picker

## Purpose

Use a Time Picker when a user must provide a specific clock time as structured input. The Time Picker supports direct keyboard entry as its primary interaction, with optional picker UI for users who prefer visual selection. Use it for Attendance session start and end times, Exam slot scheduling, and Notification delivery time settings.

## Non-goals

Do not use a Time Picker when a relative time or duration is required ("in 30 minutes," "for 2 hours") — use a [Select](./Select.md) with preset options or a duration input field. Do not require the picker UI for time entry; always support direct keyboard input. Do not use a Time Picker for date selection — use a [Date Picker](./Date%20Picker.md).

## Anatomy and variants

Provide a persistent label, a text input accepting keyboard time entry, optional hour and minute spin buttons, an AM/PM toggle when 12-hour format applies, constraint and instruction text, a clear action when populated, and an error message region. Support these variants:

- **Text input only** — keyboard entry in a single text field; preferred for accuracy-first contexts such as Exam slot entry.
- **Segmented input** — separate hour, minute, and AM/PM fields (spin buttons); preferred for touch-first or structured data entry contexts.
- **Time range** — start and end time fields linked together; used for Attendance session duration or Exam slot definition.
- **Date-time** — paired with a [Date Picker](./Date%20Picker.md) for combined date and time input.

## States and behavior

Support empty, focused, populated, invalid, disabled, read-only, and error-recovery states.

- **Direct entry:** Users type the time in the locale-appropriate format. Format hints appear as instruction text ("HH:MM" for 24-hour or "HH:MM AM/PM" for 12-hour). The system accepts reasonable variations — "9am," "09:00," "9:00 AM" — before reporting a format error.
- **Spin buttons:** Arrow Up/Down increment or decrement the focused segment by one unit. Page Up/Down increment or decrement by larger steps (15 minutes for minutes, 1 hour for hours). Values wrap within valid ranges.
- **Constraints:** Minimum and maximum times are enforced with an explanation: "Session start time must be between 06:00 and 21:00." Out-of-range times are rejected at blur or submission.
- **Clear:** A clear action removes the current value and returns focus to the first input segment.
- **Range interaction:** In a time-range picker, selecting the start time focuses the end-time field. The end time must be after the start time; an error is surfaced if the constraint is violated.
- **Validation:** Format errors and out-of-range errors are surfaced after blur or on submit, preserving the typed input.

## Accessibility and responsive behavior

Each input segment has a persistent `<label>` or `aria-label`. Spin button segments use `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and `aria-valuetext` for human-readable announcement. AM/PM toggle is a group of two radio buttons or a `<select>`. Time range fields are grouped with a `<fieldset>` and `<legend>`.

Apply locale-aware 12-hour or 24-hour format from [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). Time zone display is explicit when time zones differ across the user population; do not silently convert without disclosure.

At narrow viewports, segmented inputs use minimum 44×44 CSS pixel touch targets. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Label: "Session start time." Instruction: "Enter time as HH:MM (24-hour)." Constraint: "Session start time must be between 06:00 and 21:00." Range label: "Exam slot — Start time to End time." Error: "End time must be after start time."

## Review evidence

Verify direct keyboard entry is accepted in reasonable format variations; spin button arrow keys and Page Up/Down work correctly; AM/PM toggle is keyboard-operable; constraint violations are announced with explanation; range end-time validates against start-time; clear action removes value and returns focus; locale-appropriate format is displayed; time zone is explicit when relevant; narrow viewport provides adequate touch targets; zoom to 200% keeps all segments and labels visible; screen reader announces current value, range, and spin button state.

See [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).
