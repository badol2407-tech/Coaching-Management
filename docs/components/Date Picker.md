---
title: EduTrack Date Picker Handbook
purpose: Define accessible, locale-aware, and constrainable date and date-range selection for forms and filters.
scope: Attendance session date selection, Fee due date entry, Exam date assignment, Report date range filters, and Profile birth date input.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERNATIONALIZATION.md
  - ../FILTER_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ./Calendar.md
  - ./Time Picker.md
  - ./Text Field.md
review_frequency: Quarterly and before date input, locale, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Date Picker, date input, date range, calendar popover, locale, constraint, format
---

# Date Picker

## Purpose

Use a Date Picker when a user must provide a specific date or date range as structured input. The Date Picker combines a text field for direct keyboard entry with an optional calendar popover for visual selection. It is the canonical form control for dates in EduTrack — used for Attendance session dates, Fee due dates, Exam dates, and Report filter ranges.

## Non-goals

Do not use a Date Picker to browse existing events across time — use a [Calendar](./Calendar.md). Do not use it for relative time selection such as "last 30 days" — pair it with a [Select](./Select.md) for preset ranges and a Date Picker for custom ranges. Do not require a calendar popover for a date the user knows precisely; always support direct keyboard entry in the text field.

## Anatomy and variants

Provide a persistent label, a text input field accepting keyboard date entry, a calendar-trigger icon button, an optional calendar popover, a clear action when the field is populated, constraint and instruction text, and an error message region. Support these variants:

- **Single date** — one date field with optional calendar popover; used for Attendance date, Exam date, or Fee due date.
- **Date range** — start and end date fields linked together; the calendar popover shows range selection across one or two months. Used for Report date range and Analytics period Filters.
- **Date-time** — single date field combined with a [Time Picker](./Time%20Picker.md); used when both date and time are required.
- **Read-only date display** — formatted date without an input; used in record summaries and export previews.

## States and behavior

Support empty, focused, populated, open (calendar visible), selecting, invalid, disabled, read-only, and error-recovery states.

- **Direct entry:** Users may type a date directly in the field without opening the calendar. Format hints appear as instructional text ("DD/MM/YYYY" or locale-appropriate pattern). The system parses reasonable variations before reporting an error.
- **Calendar popover:** Opening the calendar popover does not commit a value. Navigating calendar months does not change the field value. Selecting a date closes the popover and populates the field; the field retains focus.
- **Constraints:** Minimum and maximum dates are enforced with an explanation: "Attendance date must fall within the current academic term (1 June – 30 November 2026)." Constrained dates in the calendar popover are visually marked and announced as unavailable.
- **Clear:** A clear action removes the current value and returns focus to the input field.
- **Validation:** Date format errors and out-of-range errors are surfaced after blur or on submit, preserving the typed input.
- **Range interaction:** In a date-range picker, selecting the start date opens or focuses the end-date field. The range is highlighted in the calendar popover as both dates are chosen.

## Accessibility and responsive behavior

The text input has a persistent `<label>`. The calendar popover trigger is an icon button with an accessible name: "Choose date for [field label]." The calendar popover implements the ARIA dialog pattern with focus trap and Escape-to-close returning focus to the trigger. Arrow keys navigate calendar days; Page Up/Down navigate months; Ctrl+Page Up/Down navigate years. Unavailable dates are marked `aria-disabled="true"` and announce the constraint reason.

Apply locale-aware date formats, first-day-of-week, and calendar systems from [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). At narrow viewports, the calendar popover becomes a bottom sheet or full-screen modal to ensure touch-target adequacy. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Label: "Attendance session date." Instruction: "Enter date as DD/MM/YYYY or select from the calendar." Constraint: "Select a date within the current academic term: 1 June – 30 November 2026." Error: "Date is outside the academic term. Enter a date between 1 June and 30 November 2026." Calendar trigger: "Choose attendance session date."

## Review evidence

Verify direct keyboard entry is accepted without requiring the calendar; calendar popover opens and closes without committing a value; Escape closes and returns focus to the trigger; constrained dates are marked unavailable and the constraint is announced; range start and end interact correctly; clear action removes value and focuses the field; error message preserves the typed input; locale-aware format is applied; narrow viewport presents a touch-friendly calendar; zoom to 200% keeps label, field, and trigger visible; screen reader announces selected date, unavailable dates, and constraint messages.

See [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md), and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).
