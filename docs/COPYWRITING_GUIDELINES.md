---
title: EduTrack Copywriting Guidelines
purpose: Define clear, honest, accessible, and consistent product language.
scope: Labels, actions, statuses, errors, confirmations, AI Assistant copy, localization, and accessibility.
audience: Product, Design, Content, Engineering, Support, Localization, and reviewers.
related_documents:
  - ./INFORMATION_ARCHITECTURE.md
  - ./INTERACTION_DESIGN.md
  - ./FORM_DESIGN_GUIDE.md
  - ./AI_UX_GUIDELINES.md
review_frequency: Quarterly and after terminology, policy, or localization changes
owner: Product, Content Design, and Product Design
version: 1.0.0
status: Binding content standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, AI Assistant, Permission, Role, Workspace
---

# EduTrack Copywriting Guidelines

Words are part of the product's safety and data contract. Copy must be precise, respectful, translatable, accessible, and consistent across Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Authentication, Organization, Profile, Search, Filters, mobile, and AI Assistant.

## Voice

Be clear, calm, direct, respectful, and specific. Explain what happened and what the user can do. Avoid hype, blame, shame, fake urgency, unexplained jargon, and person-reducing labels.

## Labels and actions

Use nouns for destinations and verbs for actions. Prefer “Record payment” over “Submit,” “Mark attendance” over “Proceed,” “Review report” over “View,” and “Publish results” over “Done.” Labels must describe the result, not the implementation.

## Status language

Use precise states: not started, in progress, pending review, saved, partially saved, complete, failed, unavailable, unauthorized, and stale where applicable. Do not call a pending Fee paid, a draft Exam published, a generated Report verified, or an AI suggestion a fact.

## Errors

An error should say:

1. what failed;
2. what data or record was affected;
3. whether anything was saved;
4. what to do next.

Example: “Payment not recorded for Amina Rahman. No balance changed. Check the connection and try again.” Do not expose secrets or internal stack traces in Authentication or data errors.

## Confirmation and warnings

Name the object, scope, consequence, and recovery. “Publish Exam results for Grade 10, Term 2? Students and authorized Teachers will be able to view them. You can correct results later from Results history.” Avoid “Are you sure?” without context.

## AI copy

Use “AI-generated,” “suggested,” “estimated,” or “based on these records” where accurate. Explain uncertainty and review. Never imply the AI observed a Student, Teacher, or organization directly or knows intent it cannot establish.

## Localization and accessibility

Avoid idioms, puns, unexplained abbreviations, gender assumptions, and text embedded only in images. Keep labels expandable. Use locale-aware dates, numbers, currencies, and names. Do not encode meaning only in punctuation, capitalization, or color.

## Copy measures

- A representative user can explain every primary action before selecting it.
- Errors identify recovery and data state.
- Status language is consistent across modules.
- Content passes screen-reader, translation, long-text, and mobile review.
- Notification copy states why the user is receiving it and whether action is required.

See [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), and [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md).