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
version: 1.0.0
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
         |                                                                                 |
         |                                                                                 +--> navigation / disclosure / surface / collection / overlay handbooks
         |                                               --> DESIGN_SYSTEM_GUIDE
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
| Semantic visual tokens | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | Spacing, Layout, Iconography, Elevation, Color, Typography, Motion, Components, Accessibility |
| Search and narrowing data | [SEARCH_EXPERIENCE.md](./SEARCH_EXPERIENCE.md) and [FILTER_SYSTEM.md](./FILTER_SYSTEM.md) | Forms, Tables, Dashboard, Data Visualization, Accessibility |
| Tables and structured data | [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) | Components, Search, Filters, Responsive, Data Visualization |
| Notifications and point-of-action feedback | [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md) and [FEEDBACK_SYSTEM.md](./FEEDBACK_SYSTEM.md) | State, Interaction, Ethical UX, Security, Accessibility |
| Permission and security communication | [PERMISSION_DESIGN.md](./PERMISSION_DESIGN.md) and [SECURITY_UX.md](./SECURITY_UX.md) | Governance, Engineering, Ethical UX, Authentication, Privacy |
| Responsive and localized behavior | [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) and [INTERNATIONALIZATION.md](./INTERNATIONALIZATION.md) | Mobile, Layout, Spacing, Typography, Copywriting, Accessibility |
| Dashboard and reporting presentation | Dashboard, Data Visualization, and Table handbooks | Information Architecture, Search, Filters, Accessibility |
| Release evidence | [QUALITY_GATES.md](./QUALITY_GATES.md) | Review Checklists, Accessibility Testing, every release-gate handbook |
| Usability rationale and review prompts | UX Laws, Usability Heuristics, Gestalt Principles | Governance, Accessibility, Interaction |

## Dependency rules

- Depend on a higher-level document; do not override it.
- Link to the canonical owner when repeating a principle for context.
- Do not create a second threshold for a requirement owned by a release-gate handbook.
- If a new Enterprise Module introduces a term, add it to [GLOSSARY.md](./GLOSSARY.md) before using it in another handbook.
- Component handbooks under [components/](./components/) may clarify an implementation contract but may not override a higher-level standard.
- Add a component handbook only when the component is approved in [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md); do not create parallel component documentation elsewhere.
- Navigation, disclosure, surface, collection, and overlay handbooks remain subordinate to the canonical Navigation, Interaction, State, Responsive, Accessibility, Elevation, Table, and Form handbooks.
- If a change affects a dependency, update the dependent document’s Related documents metadata and record the change.