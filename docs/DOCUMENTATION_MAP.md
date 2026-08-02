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
version: 1.7.0
status: Active architecture map
last_updated: 2026-08-02
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
          +--> IMPLEMENTATION ARCHITECTURE
                 FOLDER_STRUCTURE
                 FRONTEND_ARCHITECTURE --> ROUTING_ARCHITECTURE / STATE_MANAGEMENT
                  BACKEND_ARCHITECTURE --> API_LAYER_ARCHITECTURE / DATABASE_ARCHITECTURE
                  AUTHENTICATION_ARCHITECTURE --> AUTHORIZATION_ARCHITECTURE
                  AUTHORIZATION_ARCHITECTURE --> SECURITY_ARCHITECTURE
                  FIREBASE_ARCHITECTURE --> AUTHENTICATION_ARCHITECTURE / DATABASE_ARCHITECTURE
                  DATABASE_ARCHITECTURE --> CACHING_STRATEGY / PERFORMANCE_ARCHITECTURE
                  DATA_FLOW_ARCHITECTURE --> FRONTEND_ARCHITECTURE / BACKEND_ARCHITECTURE / API_LAYER_ARCHITECTURE / CACHING_STRATEGY
                  PERFORMANCE_ARCHITECTURE --> QUALITY_GATES
         |
          +--> DELIVERY AND RESILIENCE
                 TESTING_STRATEGY --> CI_CD_ARCHITECTURE --> DEPLOYMENT_ARCHITECTURE
                 MONITORING_AND_LOGGING --> OBSERVABILITY --> ERROR_MONITORING
                 DISASTER_RECOVERY --> BACKUP_AND_RECOVERY / DEPLOYMENT_ARCHITECTURE
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
| Repository and package placement | [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Frontend Architecture, Backend Architecture, API Layer Architecture |
| Web composition and frontend runtime boundaries | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Routing Architecture, State Management, Data Flow Architecture, Components |
| Service, persistence, and backend boundaries | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | API Layer Architecture, Data Flow Architecture, Engineering Standards |
| Route families, Role layouts, and deep-link implementation | [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md) | Navigation Standards, Information Architecture, Frontend Architecture |
| Frontend state ownership and cache identity | [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | State System, Interaction Design, Frontend Architecture, Data Flow Architecture |
| API contract, generation, transport, and implementation status | [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) | Backend Architecture, Frontend Architecture, Engineering Standards |
| End-to-end identity, scope, record, upload, and error movement | [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) | Multi-Tenancy, Authentication, Audit Logs, Frontend Architecture, Backend Architecture |
| Provider identity, sessions, profile context, and impersonation | [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) | Authentication, Security UX, Authorization Architecture, Firebase Architecture, State Management |
| Role, Permission, Organization, Workspace, and direct-access enforcement | [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) | Permission Design, Roles and Permissions, Multi-Tenancy, Authentication Architecture, Security Architecture |
| Protected assets, trust boundaries, secrets, incidents, and security controls | [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) | Engineering Standards, Security UX, Authentication Architecture, Authorization Architecture, Firebase Architecture, Database Architecture |
| Persistence ownership, schema, integrity, tenancy readiness, and migrations | [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Backend Architecture, Firebase Architecture, API Layer Architecture, Multi-Tenancy, Backup and Recovery, Data Flow Architecture |
| Firebase Auth, Firestore, Realtime Database, Storage, rules, and provider boundaries | [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) | Authentication Architecture, Authorization Architecture, Database Architecture, Security Architecture, Data Flow Architecture |
| Cache ownership, identity, freshness, invalidation, privacy, and migration | [CACHING_STRATEGY.md](./CACHING_STRATEGY.md) | State Management, Data Flow Architecture, Authentication Architecture, Authorization Architecture, Security Architecture, Database Architecture |
| Critical journeys, useful work, measurement, and performance evidence | [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md) | Engineering Standards, Product Constitution, Frontend Architecture, Backend Architecture, Caching Strategy, Quality Gates |
| Test layers, representative coverage, and release evidence | [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | Engineering Standards, Quality Gates, Accessibility Testing, Security Architecture, Performance Architecture |
| Delivery stages, generated artifacts, and promotion checks | [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) | Testing Strategy, Engineering Standards, Quality Gates, Security Architecture, Deployment Architecture |
| Environments, deployment units, readiness, and rollback | [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) | CI/CD Architecture, Backend Architecture, Firebase Architecture, Database Architecture, Security Architecture, Disaster Recovery |
| Operational signals, structured logs, and health monitoring | [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md) | Engineering Standards, Security Architecture, Error Handling, Performance Architecture, Audit Logs |
| Cross-signal journey correlation and operational diagnosis | [OBSERVABILITY.md](./OBSERVABILITY.md) | Monitoring and Logging, Performance Architecture, Data Flow Architecture, Deployment Architecture, Error Monitoring |
| Error grouping, severity, triage, and regression monitoring | [ERROR_MONITORING.md](./ERROR_MONITORING.md) | Error Handling, Monitoring and Logging, Observability, Security Architecture, Deployment Architecture |
| Disaster scenarios, recovery coordination, and return to service | [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) | Backup and Recovery, Deployment Architecture, Monitoring and Logging, Security Architecture, Database Architecture |
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
- Architecture handbooks describe implementation boundaries and current-state observations; they may not convert a target contract into an implemented capability.
- `FRONTEND_ARCHITECTURE.md` is the current web composition owner; `BACKEND_ARCHITECTURE.md` is the service and persistence boundary owner; `API_LAYER_ARCHITECTURE.md` is the contract/generation boundary owner; and `DATA_FLOW_ARCHITECTURE.md` describes their connections without replacing any of them.
- `AUTHENTICATION_ARCHITECTURE.md` is the provider identity and session boundary owner; `AUTHORIZATION_ARCHITECTURE.md` is the access-evaluation and data-boundary owner; `SECURITY_ARCHITECTURE.md` connects cross-cutting security controls without replacing the binding security or engineering standards.
- `DATABASE_ARCHITECTURE.md` is the persistence, integrity, and migration boundary owner; `FIREBASE_ARCHITECTURE.md` is the Firebase-service and rules-evidence owner; neither document claims a deployed control that is not evidenced.
- `CACHING_STRATEGY.md` is the cache identity, freshness, invalidation, and persistence boundary owner; `PERFORMANCE_ARCHITECTURE.md` is the useful-work measurement and performance-evidence boundary owner. Neither replaces `STATE_SYSTEM.md` or `ENGINEERING_STANDARDS.md`.
- `TESTING_STRATEGY.md` owns test-layer selection and evidence shape; `CI_CD_ARCHITECTURE.md` owns pipeline sequencing and artifact promotion; `QUALITY_GATES.md` owns the release decision. They must not create competing thresholds.
- `DEPLOYMENT_ARCHITECTURE.md` owns environment and deployment-unit boundaries; `BACKEND_ARCHITECTURE.md`, `FIREBASE_ARCHITECTURE.md`, and `DATABASE_ARCHITECTURE.md` remain owners of their respective runtime and persistence boundaries.
- `MONITORING_AND_LOGGING.md` owns signal emission and safe structured telemetry; `OBSERVABILITY.md` owns cross-signal interpretation; `ERROR_MONITORING.md` owns operational error grouping and triage; `ERROR_HANDLING.md` remains the user-facing error owner.
- `DISASTER_RECOVERY.md` coordinates cross-service disaster response and return to service; `modules/Backup_and_Recovery.md` remains the source of truth for snapshot, restore, validation, retention, and recovery-operation behavior.
- Operational handbooks may describe current gaps and target controls but may not claim deployed monitoring, tested recovery, protected branches, environment approvals, or service readiness without evidence.
- The Firebase-first web path and the separate Express/OpenAPI/Drizzle path must remain explicitly distinguished until an approved source-of-truth and migration decision changes that relationship.
- If a change affects a dependency, update the dependent document's Related documents metadata and record the change.
