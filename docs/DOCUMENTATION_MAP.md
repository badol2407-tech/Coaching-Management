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
        |      ACCESSIBILITY_STANDARDS
        |      ETHICAL_UX_GUIDELINES
        |      ENGINEERING_STANDARDS
        |      AI_UX_GUIDELINES
        |
        +--> PRODUCT STRUCTURE
        |      INFORMATION_ARCHITECTURE --> NAVIGATION_STANDARDS
        |                                  --> FORM_DESIGN_GUIDE
        |                                  --> COPYWRITING_GUIDELINES
        |
        +--> INTERACTION AND PATTERNS
        |      INTERACTION_DESIGN --> PATTERN_LIBRARY --> COMPONENT_SPECIFICATIONS
        |                                               --> DESIGN_SYSTEM_GUIDE
        |      MOBILE_UX_GUIDE
        |
        +--> VISUAL AND DATA SYSTEM
        |      COLOR_SYSTEM / TYPOGRAPHY_SYSTEM / MOTION_GUIDELINES
        |      GESTALT_PRINCIPLES
        |      DASHBOARD_DESIGN_GUIDE --> DATA_VISUALIZATION_GUIDE
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
| Accessibility requirements | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) | Mobile, Motion, Components, Review Checklists |
| Safety, dignity, fairness, privacy, and accountability | [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md) | Constitution, AI UX, Governance |
| AI Assistant behavior | [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) | Constitution, Ethical UX, Accessibility |
| Technical correctness and reliability | [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md) | Governance, Review Checklists |
| Information structure and scope | [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) | Navigation, Forms, Dashboard |
| Navigation and route behavior | [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md) | Information Architecture, Accessibility, Mobile |
| Interaction states and recovery | [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) | Components, Forms, Motion, Patterns |
| Reusable workflow patterns | [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md) | Components, Design System, Interaction |
| Component contracts | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) | Accessibility, Design System |
| Semantic visual tokens | Color, Typography, and Motion handbooks | Design System, Components, Accessibility |
| Dashboard and reporting presentation | Dashboard and Data Visualization handbooks | Information Architecture, Accessibility |
| Release evidence | [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) | Every release-gate handbook |
| Usability rationale and review prompts | UX Laws, Usability Heuristics, Gestalt Principles | Governance, Accessibility, Interaction |

## Dependency rules

- Depend on a higher-level document; do not override it.
- Link to the canonical owner when repeating a principle for context.
- Do not create a second threshold for a requirement owned by a release-gate handbook.
- If a new Enterprise Module introduces a term, add it to [GLOSSARY.md](./GLOSSARY.md) before using it in another handbook.
- If a change affects a dependency, update the dependent document’s Related documents metadata and record the change.