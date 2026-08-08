---
title: EduTrack Glossary
purpose: Provide one canonical definition for important product, organizational, interaction, and governance terms.
scope: User-facing product vocabulary and documentation terms used across EduTrack.
audience: All product contributors, reviewers, support, operations, and users of the documentation.
related_documents:
  - ./INDEX.md
  - ./DOCUMENTATION_MAP.md
  - ./INFORMATION_ARCHITECTURE.md
  - ./COPYWRITING_GUIDELINES.md
review_frequency: Quarterly and before introducing or renaming a product concept
owner: Product, Content Design, and Product Governance
version: 1.0.0
status: Active vocabulary standard
last_updated: 2026-08-01
normative_level: Binding terminology reference
canonical_terms: Dashboard, Sidebar, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Organization, Profile, Settings, Notifications, Search, Filters, AI Assistant, Enterprise Module, Permission, Role, Workspace
---

# EduTrack Glossary

Use these terms exactly in user-facing copy and documentation. A product change that needs a new concept must propose its canonical term and definition before implementation.

| Term | Canonical definition | Usage rule |
| --- | --- | --- |
| **AI Assistant** | An optional assistive capability that helps organize, summarize, discover, or draft information while keeping human review and control. | Do not call generated output verified fact or authority. |
| **Analytics** | An interpreted view of data that explains trends, comparisons, or patterns within a stated scope and time range. | Include scope, freshness, units, and limitations. |
| **Attendance** | Records and workflows that describe whether a Student was present, absent, late, excused, or otherwise in a defined session. | Use “mark Attendance” for the action and “Attendance record” for the stored item. |
| **Dashboard** | A role-aware overview of current work, exceptions, scope, freshness, and relevant metrics. | Use as a destination name, not as a generic synonym for any page. |
| **Enterprise Module** | A new product capability that declares its vocabulary, roles, permissions, scope, navigation, audit, and retention relationships before release. | Use this term for future modules; do not introduce an ungoverned module name. |
| **Exams** | Assessment setup, participation, results, review, and publishing workflows. | Use “publish results” for the consequential action. |
| **Fees** | Financial balances, payments, adjustments, receipts, and related review workflows. | Use “record payment” and “Fee balance”; do not imply payment success before confirmation. |
| **Filters** | Controls that narrow a displayed set by explicit criteria such as Organization, batch, date range, or status. | Show applied Filters and provide a clear action. |
| **Notifications** | Messages or indicators that communicate relevant system, workflow, or attention state. | Do not use Notifications to create artificial urgency. |
| **Organization** | The Organization-level coaching context whose people, programs, records, and Permissions are governed together. | Use “Organization” in user-facing product areas; do not substitute tenant. |
| **Permission** | An allowed capability or scope granted to a Role or user. | Explain impact before consequential Permission changes. |
| **Profile** | A person’s identity and relevant personal or coaching information, shown according to Role and privacy scope. | Do not expose sensitive Profile data by default. |
| **Reports** | Generated or saved presentations of defined data for a stated scope, time range, and purpose. | Include freshness, limitations, and generation status. |
| **Role** | A named set of responsibilities and Permissions for a user in an Organization or Workspace. | Use “Role” rather than persona when referring to access or responsibility. |
| **Search** | A control that finds records or content within a named source and scope. | State what Search covers and how many results match. |
| **Settings** | Controls for personal, Organization, Workspace, notification, security, or system configuration. | Use the specific Settings area when scope matters. |
| **Sidebar** | The persistent or responsive navigation region used to move between primary product destinations. | Do not use “left nav” or “menu” as alternate destination names. |
| **Students** | The canonical destination and collection name for people receiving coaching or instruction. | Use “Student” for one person and “Students” for the collection; do not substitute learner. |
| **Teachers** | The canonical destination and collection name for people delivering coaching or instruction. | Use “Teacher” for one person and “Teachers” for the collection; use coach only when describing a distinct business role. |
| **Workspace** | The active context in which a user performs work, such as an Organization, program, or authorized operating area. | Keep the active Workspace visible when it changes what the user can see or do. |

## Canonical plural and action forms

| Concept | Destination or collection | Singular record | Common action |
| --- | --- | --- | --- |
| Student | Students | Student | View or update Student |
| Teacher | Teachers | Teacher | Assign or review Teacher |
| Fee | Fees | Fee | Record payment or adjust Fee |
| Exam | Exams | Exam | Review or publish results |
| Report | Reports | Report | Generate or export Report |
| Notification | Notifications | Notification | Review or dismiss Notification |
| Filter | Filters | Filter | Apply or clear Filter |

## Terms to avoid as default synonyms

| Avoid | Use instead | Reason |
| --- | --- | --- |
| learner | Student | Student is the canonical product term. |
| coach, when referring to the destination | Teacher | Teacher is the canonical destination; use coach only for a distinct role or domain distinction. |
| tenant | Organization | Organization is the user-facing term. |
| left nav / menu | Sidebar | Sidebar names the navigation region consistently. |
| insights, when referring to the product area | Analytics | Analytics is the canonical destination. |
| alerts, when referring to the product area | Notifications | Notifications is the canonical destination; use alert only for a message severity. |
| AI output as fact | generated content or AI Assistant suggestion | Preserves uncertainty and human control. |