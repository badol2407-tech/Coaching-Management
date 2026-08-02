---
title: EduTrack Documentation
purpose: Serve as the homepage and navigation entry point for the EduTrack documentation system.
scope: Documentation hierarchy, reading order, handbook ownership, architecture, and navigation.
audience: Product, Design, Engineering, Security, Privacy, AI Governance, Operations, QA, and contributors.
related_documents:
  - ./DOCUMENTATION_MAP.md
  - ./GLOSSARY.md
  - ./PRODUCT_CONSTITUTION.md
  - ./PRODUCT_GOVERNANCE.md
  - ./REVIEW_CHECKLISTS.md
  - ./TESTING_STRATEGY.md
  - ./CI_CD_ARCHITECTURE.md
  - ./DEPLOYMENT_ARCHITECTURE.md
  - ./CONTRIBUTING.md
  - ./ENVIRONMENT_SETUP.md
  - ./TECH_STACK.md
  - ./CODING_STANDARDS.md
  - ./GIT_WORKFLOW.md
  - ./CODE_REVIEW_GUIDELINES.md
  - ./RELEASE_MANAGEMENT.md
  - ./MONITORING_AND_LOGGING.md
  - ./OBSERVABILITY.md
  - ./ERROR_MONITORING.md
  - ./DISASTER_RECOVERY.md
review_frequency: Quarterly and after documentation architecture or governance changes
owner: Product Governance Council
version: 1.9.0
status: Active documentation homepage
last_updated: 2026-08-02
normative_level: Navigation and orientation
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Classes, Subjects, Routine, Academic Sessions, Search, Filters, AI Assistant, Roles and Permissions, Audit Logs, Integrations, Import, Export, Backup, Recovery, Multi-Tenancy, Future Enterprise Modules, Enterprise Module, Permission, Role, Workspace
---

# EduTrack Documentation

EduTrack documentation is a governed system of product principles, release standards, implementation handbooks, and review guidance. This page is the starting point for understanding what is authoritative, where a rule belongs, and how to review a change.

## Documentation hierarchy

1. **Product principles** — [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) defines the durable beliefs and ethical commitments.
2. **Governance** — [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) defines authority, precedence, exceptions, evidence, and change control.
3. **Release gates** — [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md), [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md), and [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) define binding quality and safety requirements.
4. **Architecture** — [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md), [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md), [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md), [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md), [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md), [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md), [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md), [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md), [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md), [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md), [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md), [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md), [CACHING_STRATEGY.md](./CACHING_STRATEGY.md), and [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md) describe implementation boundaries and distinguish current paths from target guidance.
5. **Delivery and resilience** — [TESTING_STRATEGY.md](./TESTING_STRATEGY.md), [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md), [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md), [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md), [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md), [OBSERVABILITY.md](./OBSERVABILITY.md), [ERROR_MONITORING.md](./ERROR_MONITORING.md), and [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) define evidence, promotion, operational signals, failure response, and recovery boundaries.
6. **Contributor practice** — [CONTRIBUTING.md](./CONTRIBUTING.md), [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md), [TECH_STACK.md](./TECH_STACK.md), [CODING_STANDARDS.md](./CODING_STANDARDS.md), [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md), [GIT_WORKFLOW.md](./GIT_WORKFLOW.md), and [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) explain how to work within the governed repository without creating parallel standards.
7. **Product structure and interaction** — Information Architecture, Navigation, Interaction, Forms, Search, Filters, Tables, Mobile, Responsive, Patterns, and Copywriting explain how the product behaves.
8. **Design system foundations and data** — Design Tokens, Spacing, Layout, Iconography, Elevation, State, Feedback, Notifications, Tables, Color, Typography, Motion, Gestalt, Dashboard, and Data Visualization define reusable expression and domain presentation.
9. **Safety, resilience, and localization** — Error, Loading, Empty, Permission, Security, Internationalization, and accessibility testing handbooks define implementation-ready quality behavior.
10. **Core module specifications** — The module handbooks under [modules/](./modules/) translate the canonical standards into role, scope, journey, screen, permission, state, AI, security, performance, and acceptance contracts for Dashboard, Students, Teachers, Organization, Authentication, Profile, Attendance, Exams, Classes, Subjects, Routine, Academic Sessions, Fees, Reports, Analytics, Notifications, Search, Filters, AI Assistant, Roles and Permissions, Settings, Audit Logs, Integrations, Import and Export, Backup and Recovery, Multi-Tenancy, and Future Enterprise Modules.
11. **Review guidance** — [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md), [QUALITY_GATES.md](./QUALITY_GATES.md), [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md), [USABILITY_HEURISTICS.md](./USABILITY_HEURISTICS.md), and [UX_LAWS.md](./UX_LAWS.md) help teams inspect work. Review guidance cannot override a release gate.

See [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md) for the dependency graph and ownership matrix.

## Recommended reading order

### New contributors

1. [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md)
2. [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
3. [GLOSSARY.md](./GLOSSARY.md)
4. [CONTRIBUTING.md](./CONTRIBUTING.md)
5. [TECH_STACK.md](./TECH_STACK.md) and [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
6. [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
7. [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)
8. [CODING_STANDARDS.md](./CODING_STANDARDS.md)
9. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
10. [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) and [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md)
11. [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) and [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md)

### Designing a feature

1. [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md)
2. [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md)
3. [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md)
4. [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and the relevant foundation handbook
5. [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md)
6. [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
7. The relevant component handbook under [components/](./components/), when one exists
8. The relevant behavior handbook: [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md), [FILTER_SYSTEM.md](./FILTER_SYSTEM.md), [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md), or [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)
9. [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md)
10. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)
11. [QUALITY_GATES.md](./QUALITY_GATES.md)

### API or shared implementation work

1. [API_CONTRACTS.md](./API_CONTRACTS.md) for API contract, generation, route, and consumer work.
2. [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) for shared component work.
3. [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) when an ownership or source-of-truth boundary changes.
4. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for evidence and handoff.

### Building a feature

1. [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md)
2. [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
3. [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
4. The relevant architecture handbook: [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md), [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md), [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md), [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md), [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md), [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md), [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md), [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md), [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md), [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md), [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md), [CACHING_STRATEGY.md](./CACHING_STRATEGY.md), or [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md)
5. The relevant domain handbook: [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md), [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), or [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md)
6. The relevant [core module specification](./modules/) when the work affects Dashboard, Students, Teachers, Organization, Authentication, Profile, Attendance, Exams, Classes, Subjects, Routine, Academic Sessions, Fees, Reports, Analytics, Notifications, Search, Filters, AI Assistant, Roles and Permissions, Settings, Audit Logs, Integrations, Import and Export, Backup and Recovery, Multi-Tenancy, or Future Enterprise Modules
7. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
8. [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md)
9. [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md)

## Quick navigation

| Need | Start here |
| --- | --- |
| Understand product principles | [Product Constitution](./PRODUCT_CONSTITUTION.md) |
| Resolve a standards conflict | [Product Governance](./PRODUCT_GOVERNANCE.md) |
| Find a canonical term | [Glossary](./GLOSSARY.md) |
| Understand document ownership | [Documentation Map](./DOCUMENTATION_MAP.md) |
| Understand implementation boundaries | [Frontend Architecture](./FRONTEND_ARCHITECTURE.md), [Backend Architecture](./BACKEND_ARCHITECTURE.md), and [Folder Structure](./FOLDER_STRUCTURE.md) |
| Understand routes and Role layouts | [Routing Architecture](./ROUTING_ARCHITECTURE.md) |
| Understand frontend state ownership | [State Management](./STATE_MANAGEMENT.md) |
| Understand API contracts and generated clients | [API Layer Architecture](./API_LAYER_ARCHITECTURE.md) |
| Author or evolve an API contract | [API Contracts](./API_CONTRACTS.md) |
| Trace identity, scope, and records | [Data Flow Architecture](./DATA_FLOW_ARCHITECTURE.md) |
| Understand authentication identity and sessions | [Authentication Architecture](./AUTHENTICATION_ARCHITECTURE.md) |
| Understand Roles, Permissions, and data-boundary access | [Authorization Architecture](./AUTHORIZATION_ARCHITECTURE.md) |
| Understand cross-cutting security boundaries | [Security Architecture](./SECURITY_ARCHITECTURE.md) |
| Understand persistence and schema boundaries | [Database Architecture](./DATABASE_ARCHITECTURE.md) |
| Understand Firebase service boundaries and rules evidence | [Firebase Architecture](./FIREBASE_ARCHITECTURE.md) |
| Understand cache identity, freshness, and invalidation | [Caching Strategy](./CACHING_STRATEGY.md) |
| Understand performance measurement and critical paths | [Performance Architecture](./PERFORMANCE_ARCHITECTURE.md) |
| Define test layers and release evidence | [Testing Strategy](./TESTING_STRATEGY.md) |
| Understand pipeline checks and promotion | [CI/CD Architecture](./CI_CD_ARCHITECTURE.md) |
| Understand environments and deployment recovery | [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md) |
| Set up a safe contributor environment | [Environment Setup](./ENVIRONMENT_SETUP.md) |
| Understand the repository technology boundaries | [Technology Stack](./TECH_STACK.md) |
| Follow implementation conventions | [Coding Standards](./CODING_STANDARDS.md) |
| Use the implementation quick map | [Project Conventions](./PROJECT_CONVENTIONS.md) |
| Contribute a change | [Contributing Guide](./CONTRIBUTING.md) |
| Follow the end-to-end developer flow | [Developer Playbook](./DEVELOPER_PLAYBOOK.md) |
| Synchronize branches and commits | [Git Workflow](./GIT_WORKFLOW.md) |
| Prepare or perform a review | [Code Review Guidelines](./CODE_REVIEW_GUIDELINES.md) |
| Manage a release handoff | [Release Management](./RELEASE_MANAGEMENT.md) |
| Understand operational signals and structured logs | [Monitoring and Logging](./MONITORING_AND_LOGGING.md) |
| Correlate journeys, signals, and outcomes | [Observability](./OBSERVABILITY.md) |
| Group and triage application errors | [Error Monitoring](./ERROR_MONITORING.md) |
| Plan disaster response and return to service | [Disaster Recovery](./DISASTER_RECOVERY.md) |
| Review a release | [Quality Gates](./QUALITY_GATES.md) and [Review Checklists](./REVIEW_CHECKLISTS.md) |
| Design accessible behavior | [Accessibility Standards](./ACCESSIBILITY_STANDARDS.md) |
| Test accessibility | [Accessibility Testing](./ACCESSIBILITY_TESTING.md) |
| Design navigation or structure | [Information Architecture](./INFORMATION_ARCHITECTURE.md) |
| Design interactions and recovery | [Interaction Design](./INTERACTION_DESIGN.md) |
| Define states, feedback, or recovery | [State System](./STATE_SYSTEM.md), [Feedback System](./FEEDBACK_SYSTEM.md), and [Error Handling](./ERROR_HANDLING.md) |
| Use a reusable UI pattern | [Pattern Library](./PATTERN_LIBRARY.md) |
| Implement a primitive component | [Component Specifications](./COMPONENT_SPECIFICATIONS.md) and the relevant [component handbook](./components/) |
| Extend or review a shared component | [Component Standards](./COMPONENT_STANDARDS.md) |
| Apply the visual system | [Design System Guide](./DESIGN_SYSTEM_GUIDE.md) |
| Apply foundation tokens | [Design Tokens](./DESIGN_TOKENS.md), [Spacing System](./SPACING_SYSTEM.md), and [Layout Grid](./LAYOUT_GRID.md) |
| Write interface copy | [Copywriting Guidelines](./COPYWRITING_GUIDELINES.md) |
| Design a Dashboard | [Dashboard Design Guide](./DASHBOARD_DESIGN_GUIDE.md) |
| Present data honestly | [Data Visualization Guide](./DATA_VISUALIZATION_GUIDE.md) |
| Design Search, Filters, or tables | [Search Experience](./SEARCH_EXPERIENCE.md), [Filter System](./FILTER_SYSTEM.md), and [Table Design Guide](./TABLE_DESIGN_GUIDE.md) |
| Design responsive or localized behavior | [Responsive System](./RESPONSIVE_SYSTEM.md) and [Internationalization](./INTERNATIONALIZATION.md) |
| Design Permissions or security | [Permission Design](./PERMISSION_DESIGN.md) and [Security UX](./SECURITY_UX.md) |
| Design AI Assistant behavior | [AI UX Guidelines](./AI_UX_GUIDELINES.md) |
| Specify a core product module | [Core module specifications](./modules/) |
| Specify Dashboard behavior | [Dashboard module](./modules/Dashboard.md) |
| Specify Students behavior | [Students module](./modules/Students.md) |
| Specify Teachers behavior | [Teachers module](./modules/Teachers.md) |
| Specify Organization behavior | [Organization module](./modules/Organization.md) |
| Specify Authentication behavior | [Authentication module](./modules/Authentication.md) |
| Specify Profile behavior | [Profile module](./modules/Profile.md) |
| Specify Attendance behavior | [Attendance module](./modules/Attendance.md) |
| Specify Exams behavior | [Exams module](./modules/Exams.md) |
| Specify Classes behavior | [Classes module](./modules/Classes.md) |
| Specify Subjects behavior | [Subjects module](./modules/Subjects.md) |
| Specify Routine behavior | [Routine module](./modules/Routine.md) |
| Specify Academic Sessions behavior | [Academic Sessions module](./modules/Academic_Sessions.md) |
| Specify Fees behavior | [Fees module](./modules/Fees.md) |
| Specify Reports behavior | [Reports module](./modules/Reports.md) |
| Specify Analytics behavior | [Analytics module](./modules/Analytics.md) |
| Specify Notifications behavior | [Notifications module](./modules/Notifications.md) |
| Specify Search behavior | [Search module](./modules/Search.md) |
| Specify Filters behavior | [Filters module](./modules/Filters.md) |
| Specify AI Assistant behavior | [AI Assistant module](./modules/AI_Assistant.md) |
| Specify Roles and Permissions behavior | [Roles and Permissions module](./modules/Roles_and_Permissions.md) |
| Specify Settings behavior | [Settings module](./modules/Settings.md) |
| Specify Audit Logs behavior | [Audit Logs module](./modules/Audit_Logs.md) |
| Specify Integrations behavior | [Integrations module](./modules/Integrations.md) |
| Specify Import and Export behavior | [Import and Export module](./modules/Import_Export.md) |
| Specify Backup and Recovery behavior | [Backup and Recovery module](./modules/Backup_and_Recovery.md) |
| Specify Multi-Tenancy behavior | [Multi-Tenancy module](./modules/Multi_Tenancy.md) |
| Govern future Enterprise Modules | [Future Enterprise Modules](./modules/Future_Enterprise_Modules.md) |
| Understand changes over time | [Changelog](./CHANGELOG.md) and [Decision Log](./DECISION_LOG.md) |
| Propose or apply an architecture decision | [Architecture Decisions](./ARCHITECTURE_DECISIONS.md) |
| Prepare implementation evidence | [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md) |

## Handbook directory

| Handbook | Purpose |
| --- | --- |
| [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) | Defines accessible operation and release evidence. |
| [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) | Defines repeatable accessibility evidence and retest requirements. |
| [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) | Defines transparent, safe, human-controlled AI Assistant behavior. |
| [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) | Defines semantic color roles and non-color status communication. |
| [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Defines reusable component contracts and states. |
| [COMPONENT_STANDARDS.md](./COMPONENT_STANDARDS.md) | Provides the practical selection, extension, evidence, and lifecycle flow for shared components. |
| [components/](./components/) | Defines implementation-ready handbooks for the approved primitive, navigation, disclosure, surface, collection, overlay, feedback, loading, recovery, status, identity, data, temporal, upload, and floating-action components. |
| [COPYWRITING_GUIDELINES.md](./COPYWRITING_GUIDELINES.md) | Defines clear, honest, canonical product language. |
| [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md) | Defines Dashboard priorities, metrics, scope, and states. |
| [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md) | Defines honest and accessible Reports and Analytics presentation. |
| [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) | Defines design-system layers, contributions, and quality gates. |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Defines semantic token roles, tiers, consumption, and versioning. |
| [ELEVATION_SYSTEM.md](./ELEVATION_SYSTEM.md) | Defines surfaces, overlays, depth, and stacking behavior. |
| [EMPTY_STATES.md](./EMPTY_STATES.md) | Defines truthful empty states and recovery actions. |
| [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) | Defines technical correctness, security, reliability, and maintainability. |
| [CODING_STANDARDS.md](./CODING_STANDARDS.md) | Defines practical implementation conventions without replacing binding standards. |
| [PROJECT_CONVENTIONS.md](./PROJECT_CONVENTIONS.md) | Provides a quick map for placement, naming, source boundaries, and safe contributor behavior. |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Explains repository orientation, contribution flow, evidence, and handoff. |
| [DEVELOPER_PLAYBOOK.md](./DEVELOPER_PLAYBOOK.md) | Routes contributors from work intake through implementation, evidence, review, and release. |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Defines safe local setup, configuration names, environment boundaries, and validation commands. |
| [TECH_STACK.md](./TECH_STACK.md) | Records the repository technology boundaries and current-versus-target distinctions. |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | Defines synchronization, branches, commits, conflicts, and safe Git recovery. |
| [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md) | Defines evidence-based review order, findings, and change-type guidance. |
| [RELEASE_MANAGEMENT.md](./RELEASE_MANAGEMENT.md) | Defines practical release classification, readiness, promotion, verification, and recovery handoff. |
| [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) | Defines the React/Vite web composition, frontend boundaries, and current Firebase data path. |
| [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) | Defines the current Firebase boundary and separate Express/OpenAPI/Drizzle backend architecture. |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Defines repository package ownership and implementation placement. |
| [ROUTING_ARCHITECTURE.md](./ROUTING_ARCHITECTURE.md) | Defines public, authenticated, Role-specific, and impersonated route families. |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | Defines ownership of auth, profile, cache, URL, local, and mutation state. |
| [API_LAYER_ARCHITECTURE.md](./API_LAYER_ARCHITECTURE.md) | Defines OpenAPI, generated clients, Zod schemas, transport, and Express implementation boundaries. |
| [API_CONTRACTS.md](./API_CONTRACTS.md) | Provides the practical API contract authoring, generation, implementation, and compatibility flow. |
| [DATA_FLOW_ARCHITECTURE.md](./DATA_FLOW_ARCHITECTURE.md) | Defines identity, Organization scope, Firestore, cache, upload, audit, and API data movement. |
| [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) | Defines provider identity, session, profile, Organization context, sign-out, and impersonation boundaries. |
| [AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md) | Defines Role, Permission, Organization, Workspace, direct-access, and data-boundary enforcement. |
| [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md) | Defines protected assets, trust boundaries, control layers, secrets, incidents, and security evidence. |
| [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Defines Firestore and PostgreSQL persistence ownership, integrity, tenancy readiness, and migrations. |
| [FIREBASE_ARCHITECTURE.md](./FIREBASE_ARCHITECTURE.md) | Defines Firebase Auth, Firestore, Realtime Database, Storage, configuration, rules evidence, and provider boundaries. |
| [CACHING_STRATEGY.md](./CACHING_STRATEGY.md) | Defines cache ownership, query identity, freshness, invalidation, privacy, and source migration behavior. |
| [PERFORMANCE_ARCHITECTURE.md](./PERFORMANCE_ARCHITECTURE.md) | Defines critical journeys, measurement, loading order, responsive work, and performance evidence. |
| [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) | Defines test layers, representative coverage, evidence, and validation boundaries. |
| [CI_CD_ARCHITECTURE.md](./CI_CD_ARCHITECTURE.md) | Defines delivery stages, generated artifacts, checks, approvals, and promotion. |
| [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) | Defines environments, deployment units, migration sequencing, readiness, and rollback. |
| [MONITORING_AND_LOGGING.md](./MONITORING_AND_LOGGING.md) | Defines safe operational signals, structured logs, health, dependencies, and monitoring ownership. |
| [OBSERVABILITY.md](./OBSERVABILITY.md) | Defines correlation of signals across journeys, releases, dependencies, outcomes, and recovery. |
| [ERROR_MONITORING.md](./ERROR_MONITORING.md) | Defines error grouping, severity, triage, regression detection, and remediation evidence. |
| [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) | Defines disaster scenarios, recovery objectives, restoration, validation, and return to service. |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | Defines error categories, safe input preservation, and recovery. |
| [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md) | Defines dignity, fairness, safety, privacy, and accountability expectations. |
| [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md) | Defines point-of-action status, progress, consequence, and recovery feedback. |
| [FILTER_SYSTEM.md](./FILTER_SYSTEM.md) | Defines transparent, accessible, and scoped Filters. |
| [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) | Defines safe and recoverable forms, Search, and Filters. |
| [GESTALT_PRINCIPLES.md](./GESTALT_PRINCIPLES.md) | Explains grouping and visual-comprehension principles. |
| [ICONOGRAPHY.md](./ICONOGRAPHY.md) | Defines icon meaning, labeling, construction, and accessibility. |
| [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Defines canonical objects, roles, tasks, scopes, and hierarchy. |
| [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Defines locale, language, script, direction, time, number, and currency behavior. |
| [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) | Defines interaction states, consequences, feedback, and recovery. |
| [LAYOUT_GRID.md](./LAYOUT_GRID.md) | Defines page geometry, alignment, content width, and responsive composition. |
| [LOADING_STATES.md](./LOADING_STATES.md) | Defines honest, stable, and accessible loading behavior. |
| [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md) | Defines resilient small-screen and variable-network behavior. |
| [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) | Defines purposeful and reduced-motion-aware animation. |
| [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) | Defines Sidebar, routes, location, deep links, and safe exits. |
| [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md) | Defines relevant, private, accessible, and non-manipulative Notifications. |
| [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md) | Defines reusable workflow patterns. |
| [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) | Defines understandable, least-privilege, and auditable Permissions. |
| [PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md) | Defines durable product, UX, AI, engineering, and ethical principles. |
| [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) | Defines authority, precedence, exceptions, and change control. |
| [QUALITY_GATES.md](./QUALITY_GATES.md) | Defines evidence, decisions, and exceptions before acceptance or release. |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Provides a reusable implementation, validation, review, release, and recovery handoff checklist. |
| [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) | Provides a decision workflow while keeping durable records in the existing decision log. |
| [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) | Defines release and design evidence gates. |
| [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) | Defines cross-viewport, input, zoom, and device adaptation. |
| [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) | Defines scoped, accessible, private, and comprehensible Search. |
| [SECURITY_UX.md](./SECURITY_UX.md) | Defines Authentication, privacy, security communication, and recovery. |
| [SPACING_SYSTEM.md](./SPACING_SYSTEM.md) | Defines semantic spacing, grouping, density, and touch separation. |
| [STATE_SYSTEM.md](./STATE_SYSTEM.md) | Defines lifecycle states and transitions across the product. |
| [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) | Defines accessible and resilient data-table behavior. |
| [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) | Defines readable, scalable, and semantic type roles. |
| [USABILITY_HEURISTICS.md](./USABILITY_HEURISTICS.md) | Provides a structured usability review lens. |
| [UX_LAWS.md](./UX_LAWS.md) | Translates UX laws into domain-specific review guidance. |

## Core module directory

The core module specifications translate the canonical standards into module-specific contracts. They are subordinate to the handbooks listed in their metadata and must link to those owners rather than create competing thresholds.

| Module | Purpose |
| --- | --- |
| [Dashboard](./modules/Dashboard.md) | Role-aware operational overview, exceptions, scope, freshness, and next actions. |
| [Students](./modules/Students.md) | Authorized Student discovery, detail, lifecycle, and related coaching context. |
| [Teachers](./modules/Teachers.md) | Authorized Teacher discovery, assignment, workload context, and related operations. |
| [Organization](./modules/Organization.md) | Organization and Workspace identity, structure, membership, Roles, Permissions, and governance. |
| [Authentication](./modules/Authentication.md) | Sign-in, verification, recovery, sessions, sign-out, and security state. |
| [Profile](./modules/Profile.md) | Privacy-aware personal identity, visibility, editing, and media behavior. |
| [Attendance](./modules/Attendance.md) | Scoped session marking, review, correction, import, summaries, and related operational context. |
| [Exams](./modules/Exams.md) | Exam setup, participation, mark entry, review, publication, correction, and result access. |
| [Classes](./modules/Classes.md) | Class identity, membership, assignments, Subjects, lifecycle, and operational scope. |
| [Subjects](./modules/Subjects.md) | Subject definitions, offerings, ownership, lifecycle, and instructional relationships. |
| [Routine](./modules/Routine.md) | Recurring instructional schedules, exceptions, conflicts, and calendar context. |
| [Academic Sessions](./modules/Academic_Sessions.md) | Governed academic periods, boundaries, transitions, and historical session context. |
| [Fees](./modules/Fees.md) | Fee assignments, balances, payments, installments, adjustments, reversals, receipts, and financial review. |
| [Reports](./modules/Reports.md) | Scoped Report definition, generation, review, saving, sharing, export, freshness, and limitations. |
| [Analytics](./modules/Analytics.md) | Interpretable trends, comparisons, measures, denominators, freshness, limitations, and drill-down. |
| [Notifications](./modules/Notifications.md) | Relevant, private, accessible, idempotent, and reviewable workflow communication. |
| [Search](./modules/Search.md) | Scoped, accessible, private, and recoverable discovery across authorized datasets. |
| [Filters](./modules/Filters.md) | Transparent, serializable, accessible, and scoped narrowing of authorized datasets. |
| [AI Assistant](./modules/AI_Assistant.md) | Transparent, scoped, human-controlled assistance with generated status, source context, uncertainty, and review. |
| [Roles and Permissions](./modules/Roles_and_Permissions.md) | Least-privilege, scoped, auditable, and recoverable access governance. |
| [Settings](./modules/Settings.md) | Discoverable, scoped, reviewable, and recoverable personal, Workspace, Organization, and policy configuration. |
| [Audit Logs](./modules/Audit_Logs.md) | Authorized, append-oriented accountability records with actor, scope, action, result, integrity, and retention. |
| [Integrations](./modules/Integrations.md) | Governed, consent-aware, scoped, observable, and recoverable connections to approved external systems. |
| [Import and Export](./modules/Import_Export.md) | Scoped, reviewable, privacy-preserving, and recoverable movement of approved data. |
| [Backup and Recovery](./modules/Backup_and_Recovery.md) | Governed, tested, observable, and auditable preservation and restoration of approved data and configuration. |
| [Multi-Tenancy](./modules/Multi_Tenancy.md) | Organization and Workspace isolation, context selection, lifecycle, and cross-Organization safety. |
| [Future Enterprise Modules](./modules/Future_Enterprise_Modules.md) | Governed proposal, review, rollout, migration, deprecation, and retirement of future enterprise capabilities. |

## Component handbook directory

The component library covers 51 approved primitive components organized by category. Each handbook defines purpose, non-goals, anatomy, variants, states, interaction, accessibility, responsive behavior, content constraints, and review evidence.

### Actions

| Component | Purpose |
| --- | --- |
| [Button](./components/Button.md) | Primary, secondary, and destructive actions with pending and disabled states. |
| [Icon Button](./components/Icon%20Button.md) | Icon-only actions with mandatory accessible name and consequence clarity. |
| [Link](./components/Link.md) | Navigation and resource references with browser-native behavior. |
| [FAB](./components/FAB.md) | Floating primary action for mobile surfaces, role-aware and scope-labeled. |

### Form inputs

| Component | Purpose |
| --- | --- |
| [Text Field](./components/Text%20Field.md) | Single-line text input with label, instruction, and error. |
| [Textarea](./components/Textarea.md) | Multi-line text input for longer free-form content. |
| [Password Field](./components/Password%20Field.md) | Masked text input with reveal toggle and strength guidance. |
| [Search Field](./components/Search%20Field.md) | Scoped search input identifying the searched dataset. |
| [Select](./components/Select.md) | Single-choice selection from a bounded option set. |
| [Multi Select](./components/Multi%20Select.md) | Multiple independent selections from a bounded option set. |
| [Autocomplete](./components/Autocomplete.md) | Filterable selection with typeahead from a large or dynamic dataset. |
| [Checkbox](./components/Checkbox.md) | Independent boolean or multi-choice selection. |
| [Radio](./components/Radio.md) | Mutually exclusive single-choice selection. |
| [Switch](./components/Switch.md) | Immediate binary setting toggle. |
| [Slider](./components/Slider.md) | Ordered range adjustment with a precise-value alternative. |
| [Date Picker](./components/Date%20Picker.md) | Locale-aware, constrained date and date-range input. |
| [Time Picker](./components/Time%20Picker.md) | Locale-aware, constrained clock-time input. |
| [File Upload](./components/File%20Upload.md) | Validated, progress-tracked file selection and upload. |

### Navigation

| Component | Purpose |
| --- | --- |
| [Sidebar](./components/Sidebar.md) | Desktop primary navigation with role-aware destinations. |
| [Top Navigation](./components/Top%20Navigation.md) | Desktop top-bar navigation with scope and identity. |
| [Bottom Navigation](./components/Bottom%20Navigation.md) | Mobile primary navigation with thumb-reachable destinations. |
| [Breadcrumb](./components/Breadcrumb.md) | Hierarchical location indicator with a return path. |
| [Tabs](./components/Tabs.md) | Closely related views of the same object or task. |

### Disclosure and command

| Component | Purpose |
| --- | --- |
| [Accordion](./components/Accordion.md) | Progressive disclosure of optional secondary detail. |
| [Dropdown](./components/Dropdown.md) | Anchored contextual action or value disclosure. |
| [Menu](./components/Menu.md) | Bounded set of related actions or destinations. |
| [Command Palette](./components/Command%20Palette.md) | Scoped keyboard-first search and command surface. |

### Surfaces, collections, and overlays

| Component | Purpose |
| --- | --- |
| [Card](./components/Card.md) | Meaningfully grouped content with identity and actions. |
| [List](./components/List.md) | Sequential records without two-dimensional table relationship. |
| [Drawer](./components/Drawer.md) | Focused detail or task overlay preserving page context. |
| [Dialog](./components/Dialog.md) | Intentional interruption for consequential review. |
| [Popover](./components/Popover.md) | Anchored contextual supporting detail. |
| [Tooltip](./components/Tooltip.md) | Supplemental label for a visible or programmatic name. |

### Data display

| Component | Purpose |
| --- | --- |
| [Table](./components/Table.md) | Scoped, sortable, two-dimensional record display with row actions. |
| [Data Grid](./components/Data%20Grid.md) | Inline editable multi-row grid for Attendance, Exam, and bulk entry. |
| [Pagination](./components/Pagination.md) | Page-based navigation through large record sets. |
| [Charts](./components/Charts.md) | Honest, accessible visual encoding for Analytics, Reports, and Dashboard. |

### Temporal and scheduling

| Component | Purpose |
| --- | --- |
| [Calendar](./components/Calendar.md) | Date-grid browser for Attendance sessions, Exam schedules, and due dates. |
| [Timeline](./components/Timeline.md) | Chronological event sequence for audit trails and record history. |

### Feedback, loading, and recovery

| Component | Purpose |
| --- | --- |
| [Toast](./components/Toast.md) | Brief, non-critical point-of-action feedback. |
| [Banner](./components/Banner.md) | Persistent page or scope-level information. |
| [Alert](./components/Alert.md) | Important inline status or recovery message. |
| [Progress](./components/Progress.md) | Measurable completion feedback for scoped operations. |
| [Skeleton](./components/Skeleton.md) | Structural placeholder when the resulting layout is known. |
| [Loading Spinner](./components/Loading%20Spinner.md) | Brief indeterminate work indicator. |
| [Empty State](./components/Empty%20State.md) | Truthful message and next action when no content is available. |
| [Error State](./components/Error%20State.md) | Recovery message and next action for failed or unavailable work. |

### Status and metadata

| Component | Purpose |
| --- | --- |
| [Badge](./components/Badge.md) | Compact count or semantic status label. |
| [Chip](./components/Chip.md) | Compact interactive metadata tag. |
| [Tag](./components/Tag.md) | Non-interactive metadata label. |
| [Avatar](./components/Avatar.md) | Privacy-aware person or record identity representation. |

## Architecture overview

EduTrack is organized around a **Workspace** or **Organization** context, the user's **Role**, the product object being handled, the task being performed, and the active scope. The primary product areas are Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Organization, Profile, Settings, Classes, Subjects, Routine, Academic Sessions, Search, and Filters. The AI Assistant is an assistive capability, not an authority.

Every new Enterprise Module must declare its canonical vocabulary, owning Role and Permission model, parent Workspace or Organization scope, navigation entry point, relationships to existing objects, audit behavior, and retention requirements. This is the minimum architecture contract in [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md).

## Maintenance

Every handbook has a metadata block. Owners review documents at the stated frequency and after a material product, policy, accessibility, security, or platform change. Record durable decisions in [DECISION_LOG.md](./DECISION_LOG.md) and dated evolution in [CHANGELOG.md](./CHANGELOG.md).

The component handbook directory currently covers 51 approved components across actions, form inputs, navigation, disclosure, surfaces, data display, temporal and scheduling, feedback, loading, recovery, status, and identity categories. Use [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) to confirm the owning contract before creating or extending a handbook.
