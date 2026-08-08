---
title: EduTrack Avatar Handbook
purpose: Define privacy-aware visual or textual identity for people and organizations.
scope: Student, Teacher, Profile, Organization member, and account identity surfaces.
audience: Product, Product Design, Engineering, Content, QA, Accessibility, Privacy, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../INFORMATION_ARCHITECTURE.md
  - ../SECURITY_UX.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../INTERNATIONALIZATION.md
review_frequency: Quarterly and before identity, privacy, image, or accessibility changes
owner: Product Design, Design Systems, Engineering, Privacy, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Avatar, identity, initials, profile image, fallback, privacy
---

# Avatar

## Purpose

Use an Avatar to support recognition of a Student, Teacher, Profile, Organization member, or other approved identity alongside a canonical name.

## Non-goals

Do not use it as proof of authorization, presence, status, identity verification, or a replacement for the person’s accessible name. Do not expose a profile image when privacy or permission rules prohibit it.

## Anatomy and variants

Provide an image or privacy-safe fallback such as initials, a meaningful accessible name, and an optional size or group treatment. A clickable Avatar must have a clear action name; a decorative Avatar must be hidden from redundant assistive output.

## States and behavior

Support image loading, loaded, failed, initials fallback, unknown identity, unauthorized image, updated, and selected states as applicable. Preserve the canonical name when an image fails, and do not derive sensitive identity details from color, initials, or image alone.

## Accessibility and responsive behavior

Use appropriate alternative text when the image conveys identity, avoid duplicate announcements when adjacent text already names the person, and support long names, localization, zoom, high contrast, and dynamic type. Follow [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md), [SECURITY_UX.md](../SECURITY_UX.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md).

## Content and examples

Use an Avatar beside “Aisha Khan,” “Priya Shah,” or “EduTrack Organization.” Initials must follow locale-aware naming rules and never be treated as a secure identifier.

## Review evidence

Verify privacy and permission handling, alternative text, image failure fallback, duplicate-name context, long/localized names, high contrast, zoom, mobile sizing, screen-reader output, and clickable-action labeling.