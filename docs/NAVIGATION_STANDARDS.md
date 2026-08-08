---
title: EduTrack Navigation Standards
purpose: Define discoverable, consistent, permission-aware, and recoverable navigation across EduTrack.
scope: Primary and secondary navigation, Sidebar, location, Search, deep links, responsive behavior, exits, and errors.
audience: Product, Design, Engineering, Security, Content, QA, and reviewers.
related_documents:
  - ./INFORMATION_ARCHITECTURE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./INTERACTION_DESIGN.md
  - ./MOBILE_UX_GUIDE.md
review_frequency: Quarterly and before route, module, permission, or navigation changes
owner: Product, Product Design, and Engineering
version: 1.0.0
status: Binding navigation standard
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Dashboard, Sidebar, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Search, Filters, Workspace
---

# EduTrack Navigation Standards

Navigation helps users understand where they are, what they can access, and how to return safely. It must be role-aware without becoming unpredictable, and responsive without hiding essential work.

## Primary navigation

Primary navigation must provide stable destinations for the user's Role. The product may prioritize Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, and Profile differently by Role, but equivalent destinations must retain consistent names and behavior.

**Rule:** Do not expose irrelevant disabled destinations as a substitute for authorization. Hide inaccessible destinations when their existence would confuse, but provide clear permission feedback when a user follows a valid link to a resource they cannot access.

**Examples:** A Teacher sees teaching workflows first; an organization administrator sees organization controls; a Student sees their own Profile, Attendance, Exams, Fees, Reports, and Notifications; future modules declare their role scope before appearing.

## Location and orientation

Every page must expose:

- a unique page title;
- the active navigation destination;
- the current object or scope;
- a predictable route and browser history behavior;
- a way to return without losing safe input.

Student detail, Fee history, Exam results, Report detail, and Organization subpages should use breadcrumbs or an equivalent accessible location indicator when hierarchy matters. Mobile must not rely on breadcrumbs alone.

## Secondary navigation

Use tabs for closely related views of the same object or task. Use links for movement between objects or workflows. Use filters for changing the current result set. Do not use tabs as a substitute for permission or scope.

**Examples:** Fee collection, Due List, Payment History, and Income Summary may be related views; Students and Fees are distinct destinations; Attendance filters change a session view; Reports and Analytics may link to related interpretations without pretending they are the same dataset.

## Search, command, and deep links

Search must have a named input, clear scope, keyboard operation, result count or status, and a no-result explanation. Deep links to Student, Teacher, Attendance, Fee, Exam, Report, Notification, or Profile records must validate authorization and show the record's identity.

## Responsive navigation

Desktop navigation may collapse on smaller screens, but:

- the current destination remains clear;
- primary actions remain reachable;
- browser back works;
- no essential workflow depends on a hidden gesture;
- Authentication and recovery remain available;
- Organization and Profile do not become inaccessible because of viewport size.

## External and destructive exits

Opening an export, receipt, or external AI source must communicate the destination and preserve the current page. Leaving a form with unsaved Student, Teacher, Fee, Exam, Report, Organization, or Profile changes must offer Save, Discard, or Stay.

## Navigation review measures

- A user can identify current location within 3 seconds on desktop and mobile.
- Keyboard users can reach every primary destination without pointer input.
- No navigation action silently discards safe data.
- Role-based navigation has documented visibility and permission tests.
- Analytics, Reports, and exports preserve scope through navigation.

See [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) and [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md).