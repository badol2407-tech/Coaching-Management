---
title: EduTrack Documentation Map
purpose: Show documentation hierarchy, dependencies, ownership, and the canonical home of each standard.
scope: All documents under docs/ and their relationships.
audience: Product, Design, Engineering, Governance, QA, and contributors.
related_documents:
  - ./INDEX.md
  - ./PRODUCT_GOVERNANCE.md
  - ./GLOSSARY.md
  - ./DECISION_LOG.md
review_frequency: Quarterly and after documentation architecture changes
owner: Product Governance Council
version: 1.4.0
status: Active architecture map
last_updated: 2026-08-01
normative_level: Governance reference
canonical_terms: standard, guidance, release gate, owner, dependency, source of truth
---

# EduTrack Documentation Map

This map shows which documents own standards and which documents consume them. A document may explain a rule locally, but the owner listed below is the source of truth for that rule.

## Visual hierarchy

```text
PRODUCT_CONSTITUTION
        |
        v
PRODUCT_GOVERNANCE -----> DECISION_LOG / CHANGELOG
        |
         +--> RELEASE GATES
         |      ACCESSIBILITY_STANDARDS --> ACCESSIBILITY_TESTING
        |      ETHICAL_UX_GUIDELINES
        |      ENGINEERING_STANDARDS
        |      AI_UX_GUIDELINES
         |      QUALITY_GATES
        |
        +--> PRODUCT STRUCTURE
        |      INFORMATION_ARCHITECTURE --> NAVIGATION_STANDARDS
        |                                  --> FORM_DESIGN_GUIDE
        |                                  --> COPYWRITING_GUIDELINES
        |
         +--> INTERACTION AND PATTERNS
         |      INTERACTION_DESIGN --> STATE_SYSTEM --> FEEDBACK_SYSTEM
         |                                               --> ERROR_HANDLING / LOADING_STATES / EMPTY_STATES
         |                         --> PATTERN_LIBRARY --> COMPONENT_SPECIFICATIONS --> components/
         |                                                                                  |
         |                                                                                  +--> actions: Button, Icon Button, Link, FAB
         |                                                                                  +--> form inputs: Text Field, Textarea, Password Field, Search Field, Select, Multi Select, Autocomplete, Checkbox, Radio, Switch, Slider, Date Picker, Time Picker, File Upload
         |                                                                                  +--> navigation: Sidebar, Top Navigation, Bottom Navigation, Breadcrumb, Tabs
         |                                                                                  +--> disclosure: Accordion, Dropdown, Menu, Command Palette
         |                                                                                  +--> surfaces: Card, List, Drawer, Dialog, Popover, Tooltip
         |                                                                                  +--> data: Table, Data Grid, Pagination, Charts
         |                                                                                  +--> temporal: Calendar, Timeline
         |                                                                                  +--> feedback/loading/recovery: Toast, Banner, Alert, Progress, Skeleton, Loading Spinner, Empty State, Error State
         |                                                                                  +--> status/identity: Badge, Chip, Tag, Avatar
         |                               --> DESIGN_SYSTEM_GUIDE
         |      FORM_DESIGN_GUIDE --> SEARCH_EXPERIENCE / FILTER_SYSTEM
         |      MOBILE_UX_GUIDE --> RESPONSIVE_SYSTEM
        |
         +--> VISUAL AND DATA SYSTEM
         |      DESIGN_TOKENS --> SPACING_SYSTEM / LAYOUT_GRID / ICONOGRAPHY / ELEVATION_SYSTEM
         |      COLOR_SYSTEM / TYPOGRAPHY_SYSTEM / MOTION_GUIDELINES
        |      GESTALT_PRINCIPLES
         |      DASHBOARD_DESIGN_GUIDE --> DATA_VISUALIZATION_GUIDE / TABLE_DESIGN_GUIDE
         |      NOTIFICATION_SYSTEM / PERMISSION_DESIGN / SECURITY_UX
         |      INTERNATIONALIZATION
        |
         +--> CORE MODULE SPECIFICATIONS
         |      Dashboard / Students / Teachers / Organization / Authentication / Profile
          |      Attendance / Exams / Classes / Subjects / Routine / Academic Sessions
          |      Fees / Reports / Analytics / Notifications / Search / Filters
          |      AI Assistant / Roles and Permissions / Settings / Audit Logs / Integrations
          |      Import and Export / Backup and Recovery / Multi-Tenancy / Future Enterprise Modules
         |      (consume canonical structure, interaction, component, state, security, AI, and review standards)
         |
        +--> REVIEW
               REVIEW_CHECKLISTS
               USABILITY_HEURISTICS
               UX_LAWS

GLOSSARY is the canonical vocabulary referenced by every layer.
INDEX is the navigation homepage for every layer.
```

## Ownership matrix

| Standard or concern | Canonical owner | Supporting documents |
| --- | --- | --- |
| Product principles and ethical commitments | [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) | Ethical UX, AI UX, Accessibility |
| Authority, precedence, exceptions, and document lifecycle | [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) | Decision Log, Changelog, Review Checklists |
| Product vocabulary and object naming | [GLOSSARY.md](./GLOSSARY.md) and [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Copywriting, Navigation, Forms |
| Accessibility requirements | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) | Accessibility Testing, Mobile, Motion, Components, Review Checklists |
| Safety, dignity, fairness, privacy, and accountability | [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md) | Constitution, AI UX, Governance |
| AI Assistant behavior | [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) | Constitution, Ethical UX, Accessibility |
| Technical correctness and reliability | [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) | Governance, Review Checklists |
| Information structure and scope | [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Navigation, Forms, Dashboard |
| Navigation and route behavior | [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) | Information Architecture, Accessibility, Mobile |
| Interaction states and recovery | [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) and [STATE_SYSTEM.md](./STATE_SYSTEM.md) | Feedback, Error Handling, Loading States, Empty States, Components, Forms, Motion, Patterns |
| Reusable workflow patterns | [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md) | Components, Design System, Interaction |
| Component contracts | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Accessibility, Design System, State, Feedback, component handbooks |
| Primitive component implementation | [components/](./components/) | Component Specifications, Design System, Accessibility, Form Design, Interaction |
| Action components (Button, Icon Button, Link, FAB) | [components/](./components/) | Component Specifications, Accessibility, Mobile, Permission Design |
| Form input components (Text Field, Textarea, Password Field, Search Field, Select, Multi Select, Autocomplete, Checkbox, Radio, Switch, Slider, Date Picker, Time Picker, File Upload) | [components/](./components/) | Form Design, Accessibility, Internationalization, Engineering Standards |
| Navigation components (Sidebar, Top Navigation, Bottom Navigation, Breadcrumb, Tabs) | [components/](./components/) | Navigation Standards, Accessibility, Responsive, Mobile |
| Disclosure and command components (Accordion, Dropdown, Menu, Command Palette) | [components/](./components/) | Interaction Design, Accessibility, Elevation, Responsive |
| Surface and overlay components (Card, List, Drawer, Dialog, Popover, Tooltip) | [components/](./components/) | Interaction Design, Accessibility, Elevation, State |
| Data display components (Table, Data Grid, Pagination, Charts) | [components/](./components/) | Table Design Guide, Data Visualization Guide, Accessibility, Responsive |
| Temporal and scheduling components (Calendar, Timeline) | [components/](./components/) | Form Design, Internationalization, Permission Design, Accessibility |
| Feedback, loading, and recovery components (Toast, Banner, Alert, Progress, Skeleton, Loading Spinner, Empty State, Error State) | [components/](./components/) | Feedback, Loading, Empty, Error, Color, Notification, Accessibility, State |
| Status and identity components (Badge, Chip, Tag, Avatar) | [components/](./components/) | Color System, Ethical UX, Accessibility |
| Semantic visual tokens | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Spacing, Layout, Iconography, Elevation, Color, Typography, Motion, Components, Accessibility |
| Search and narrowing data | [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md) | Forms, Tables, Dashboard, Data Visualization, Accessibility |
| Tables and structured data | [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) | Table, Data Grid, Pagination components; Search, Filters, Responsive, Data Visualization |
| Data visualization and charts | [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md) | Charts component, Dashboard, Accessibility, Color System |
| Notifications and point-of-action feedback | [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md) and [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md) | State, Interaction, Ethical UX, Security, Accessibility |
| Permission and security communication | [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [SECURITY_UX.md](./SECURITY_UX.md) | Governance, Engineering, Ethical UX, Authentication, Privacy |
| Responsive and localized behavior | [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) and [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Mobile, Layout, Spacing, Typography, Copywriting, Accessibility |
| Dashboard and reporting presentation | Dashboard, Data Visualization, and Table handbooks | Information Architecture, Search, Filters, Accessibility |
| Core module behavior | [modules/](./modules/) | Information Architecture, Navigation, Forms, Search, Filters, Patterns, Components, States, Permissions, Security, AI, Notifications, Review Checklists |
| Release evidence | [QUALITY_GATES.md](./QUALITY_GATES.md) | Review Checklists, Accessibility Testing, every release-gate handbook |
| Usability rationale and review prompts | UX Laws, Usability Heuristics, Gestalt Principles | Governance, Accessibility, Interaction |

## Core module dependency map

Every module below consumes the same canonical structure, interaction, component, state, permission, security, AI, notification, and review standards. The module specification is the domain contract; the linked handbooks remain the source of truth for cross-cutting rules.

| Module | Primary dependency emphasis | Specification |
| --- | --- | --- |
| [Dashboard](./modules/Dashboard.md) | Operational scope, exceptions, freshness, metrics, and drill-down | [Dashboard](./modules/Dashboard.md) |
| [Students](./modules/Students.md) | Identity, discovery, lifecycle, privacy, and related coaching context | [Students](./modules/Students.md) |
| [Teachers](./modules/Teachers.md) | Identity, assignment, workload context, and related operations | [Teachers](./modules/Teachers.md) |
| [Organization](./modules/Organization.md) | Organization, Workspace, structure, membership, Roles, Permissions, and governance | [Organization](./modules/Organization.md) |
| [Authentication](./modules/Authentication.md) | Sign-in, verification, recovery, sessions, sign-out, and security state | [Authentication](./modules/Authentication.md) |
| [Profile](./modules/Profile.md) | Personal identity, visibility, editing, privacy, and media behavior | [Profile](./modules/Profile.md) |
| [Attendance](./modules/Attendance.md) | Session marking, roster scope, corrections, imports, summaries, and exceptions | [Attendance](./modules/Attendance.md) |
| [Exams](./modules/Exams.md) | Assessment setup, mark entry, review, publication, correction, and results | [Exams](./modules/Exams.md) |
| [Classes](./modules/Classes.md) | Class structure, membership, Teacher assignment, Subject offerings, and lifecycle | [Classes](./modules/Classes.md) |
| [Subjects](./modules/Subjects.md) | Subject definitions, offerings, ownership, effective scope, and lifecycle | [Subjects](./modules/Subjects.md) |
| [Routine](./modules/Routine.md) | Recurring schedules, occurrences, exceptions, conflicts, and time context | [Routine](./modules/Routine.md) |
| [Academic Sessions](./modules/Academic_Sessions.md) | Period boundaries, active context, transitions, retention, and history | [Academic Sessions](./modules/Academic_Sessions.md) |
| [Fees](./modules/Fees.md) | Fee assignments, balances, payments, adjustments, reversals, receipts, and financial scope | [Fees](./modules/Fees.md) |
| [Reports](./modules/Reports.md) | Report purpose, source scope, measures, generation, freshness, limitations, and export | [Reports](./modules/Reports.md) |
| [Analytics](./modules/Analytics.md) | Measures, units, denominators, aggregations, trends, comparisons, and interpretation | [Analytics](./modules/Analytics.md) |
| [Notifications](./modules/Notifications.md) | Taxonomy, privacy, delivery, idempotency, read state, preferences, and recovery | [Notifications](./modules/Notifications.md) |
| [Search](./modules/Search.md) | Named datasets, scoped queries, matching, suggestions, history, privacy, and deep links | [Search](./modules/Search.md) |
| [Filters](./modules/Filters.md) | Criteria, operators, AND/OR logic, active state, serialization, and result semantics | [Filters](./modules/Filters.md) |
| [AI Assistant](./modules/AI_Assistant.md) | Generated assistance, source scope, uncertainty, human review, privacy, and approved action handoffs | [AI Assistant](./modules/AI_Assistant.md) |
| [Roles and Permissions](./modules/Roles_and_Permissions.md) | Role catalog, capabilities, scope, assignment, approval, inheritance, revocation, and review | [Roles and Permissions](./modules/Roles_and_Permissions.md) |
| [Settings](./modules/Settings.md) | Personal, Workspace, Organization, policy, security, Notification, integration, and system configuration | [Settings](./modules/Settings.md) |
| [Audit Logs](./modules/Audit_Logs.md) | Actor, target, scope, action, before/after, approval, result, integrity, search, export, and retention | [Audit Logs](./modules/Audit_Logs.md) |
| [Integrations](./modules/Integrations.md) | Approved providers, consent, scopes, mappings, sync, webhooks, failures, disconnect, and recovery | [Integrations](./modules/Integrations.md) |
| [Import and Export](./modules/Import_Export.md) | Dataset movement, schema, mapping, preview, validation, partial results, downloads, retention, and audit | [Import and Export](./modules/Import_Export.md) |
| [Backup and Recovery](./modules/Backup_and_Recovery.md) | Snapshot identity, freshness, integrity, restore planning, verification, rollback, retention, and recovery | [Backup and Recovery](./modules/Backup_and_Recovery.md) |
| [Multi-Tenancy](./modules/Multi_Tenancy.md) | Organization and Workspace isolation, context switching, cross-Organization controls, migration, and support access | [Multi-Tenancy](./modules/Multi_Tenancy.md) |
| [Future Enterprise Modules](./modules/Future_Enterprise_Modules.md) | Proposal, source of truth, dependency, review, evidence, pilot, release, migration, deprecation, and retirement | [Future Enterprise Modules](./modules/Future_Enterprise_Modules.md) |

## Dependency rules

- Depend on a higher-level document; do not override it.
- Link to the canonical owner when repeating a principle for context.
- Do not create a second threshold for a requirement owned by a release-gate handbook.
- If a new Enterprise Module introduces a term, add it to [GLOSSARY.md](./GLOSSARY.md) before using it in another handbook.
- Component handbooks under [components/](./components/) may clarify an implementation contract but may not override a higher-level standard.
- Add a component handbook only when the component is approved in [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md); do not create parallel component documentation elsewhere.
- Navigation, disclosure, surface, collection, and overlay handbooks remain subordinate to the canonical Navigation, Interaction, State, Responsive, Accessibility, Elevation, Table, and Form handbooks.
- Feedback, loading, recovery, status, and identity handbooks remain subordinate to the canonical Feedback, Loading, Empty, Error, Color, Notification, State, and Accessibility handbooks.
- Data display components (Table, Data Grid, Pagination, Charts) are subordinate to TABLE_DESIGN_GUIDE.md and DATA_VISUALIZATION_GUIDE.md in addition to the standard component hierarchy.
- Temporal components (Calendar, Timeline) are subordinate to FORM_DESIGN_GUIDE.md, INTERNATIONALIZATION.md, and PERMISSION_DESIGN.md.
- File Upload is subordinate to FORM_DESIGN_GUIDE.md, ENGINEERING_STANDARDS.md, and ETHICAL_UX_GUIDELINES.md.
- FAB is subordinate to MOBILE_UX_GUIDE.md, RESPONSIVE_SYSTEM.md, and PERMISSION_DESIGN.md.
- Core module specifications under [modules/](./modules/) translate the canonical standards into module contracts; they may clarify scope and behavior but may not override an owning handbook or create duplicate thresholds.
- If a change affects a dependency, update the dependent document's Related documents metadata and record the change.
