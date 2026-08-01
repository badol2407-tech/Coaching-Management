---
title: EduTrack Internationalization
purpose: Define the product and implementation requirements for language, locale, script, direction, time, number, and cultural variation.
scope: Translation readiness, locale formatting, text expansion, pluralization, date/time, currency, RTL, fallback, and localized data.
audience: Product, Design, Engineering, Content, QA, Accessibility, Operations, Localization, and AI implementation contributors.
related_documents:
  - ./COPYWRITING_GUIDELINES.md
  - ./TYPOGRAPHY_SYSTEM.md
  - ./DESIGN_TOKENS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./TABLE_DESIGN_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and before adding a locale or changing localized content behavior
owner: Product, Content Design, Engineering, Localization, Accessibility, and QA
version: 1.0.0
status: Binding content and implementation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, Authentication, Permission, Role, Workspace, AI Assistant
---

# EduTrack Internationalization

## Purpose

Internationalization makes EduTrack usable across languages, locales, scripts, time zones, number systems, and reading directions without changing domain meaning. A Fee amount, Attendance date, Exam result, Report, Notification, or Dashboard metric must remain unambiguous.

## Scope and ownership

This handbook owns implementation readiness and locale behavior. [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md) owns source language and terminology; [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) owns type resilience; [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) owns layout adaptation.

## Implementation principles

1. Treat text, date, time, number, currency, unit, and direction as variable content from the first implementation.
2. Translate meaning, not word order; preserve canonical glossary terms and domain distinctions.
3. Never concatenate translated fragments when grammar or pluralization may vary.
4. Keep locale, time zone, currency, calendar, and measurement assumptions visible where they affect a decision.
5. Provide a complete fallback path that does not mix languages within a single critical action or error.

## Design standards

- Use translation keys with context, description, variable types, and approved source copy; do not use visible strings as keys.
- Support plural, zero, one, many, gender or grammatical variation where the locale requires it.
- Format dates and times using the active locale and time zone; state inclusion, time zone, and freshness in Attendance, Fees, Exams, Reports, Notifications, and Analytics.
- Format currency with currency code or symbol plus unambiguous amount; never infer currency from a symbol alone.
- Design for text expansion, long Student and Teacher names, translated Search and Filter labels, narrow mobile widths, and RTL mirroring.
- Do not mirror content whose meaning is directional, such as time progression, charts, or media controls, without domain review.
- AI Assistant output must state language and locale context when translation, summarization, dates, currency, or local terms affect meaning.

## Engineering standards

- Use locale-aware platform formatting APIs and typed translation resources.
- Reject missing keys in CI for supported locales; surface fallback usage for critical flows.
- Test sorting, Search, Filters, tables, exports, validation, Notifications, and authorization copy in every supported locale.
- Store canonical timestamps and amounts in unambiguous source formats; localize only at presentation boundaries.
- Avoid locale-sensitive parsing of user input without explicit validation and confirmation.

## Accessibility requirements

Follow [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md). Ensure screen readers receive the correct language, direction, labels, names, announcements, and localized error context. Translation must not remove accessible names or create clipped focus targets.

## AI implementation notes

The AI Assistant must not auto-translate high-impact Fee, Exam, Permission, Authentication, legal, or security content without identifying the generated translation and providing human review. It must preserve canonical terms and disclose uncertainty.

## Review checklist

- [ ] Locale, time zone, currency, calendar, direction, and supported language behavior are defined.
- [ ] Translation keys, variables, pluralization, fallback, and context are reviewable.
- [ ] Long text, RTL, mobile, tables, Search, Filters, errors, and Notifications are tested.
- [ ] Domain terms remain canonical and unambiguous.
- [ ] AI-generated language is labeled and reviewable.

## Validation checklist

- [ ] Missing-key, overflow, reflow, RTL, locale-format, and screen-reader checks pass.
- [ ] Dates, times, amounts, units, counts, and freshness remain accurate.
- [ ] Dashboard, Students, Attendance, Fees, Exams, Reports, Notifications, Authentication, and Settings examples pass.
- [ ] Supported exports and AI Assistant language behavior are validated.
- [ ] Evidence is linked in [QUALITY_GATES.md](./QUALITY_GATES.md).

## References

- [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md)
- [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md)
- [GLOSSARY.md](./GLOSSARY.md)