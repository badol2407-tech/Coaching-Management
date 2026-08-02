---
title: EduTrack Component Standards
purpose: Define the canonical implementation behavior and review contract for shared EduTrack UI components.
scope: Purpose, approved variants and sizes, states, accessibility, responsive behavior, layout, implementation boundaries, and AI rules for shared components.
out_of_scope: Design-token definitions, token values, page-specific composition, business logic, data models, API behavior, and visual redesign.
audience: Product Design, Design Systems, Frontend Engineering, QA, Accessibility, Content, and AI implementation contributors.
related_documents:
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./RESPONSIVE_SYSTEM.md
  - ./INTERACTION_DESIGN.md
  - ./STATE_SYSTEM.md
  - ./FORM_DESIGN_GUIDE.md
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./TABLE_DESIGN_GUIDE.md
  - ./DATA_VISUALIZATION_GUIDE.md
  - ./QUALITY_GATES.md
  - ./PRODUCT_GOVERNANCE.md
review_frequency: Quarterly and before a shared component API, state, variant, size, or lifecycle change
owner: Product Design, Design Systems, and Frontend Engineering
version: 2.0.1
status: Canonical single source of truth for component implementation standards
last_updated: 2026-08-02
normative_level: Binding component implementation standard
canonical_terms: component, variant, size, state, Button, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Alert, Tooltip, Card, Modal, Drawer, Dropdown, Tabs, Accordion, Table, Pagination, Sidebar, Navbar, Breadcrumb, Avatar, Skeleton, Spinner, Toast, Empty State, Loading State, Error State, Dashboard Card, Chart, Form
---

# EduTrack Component Standards

This is the **single source of truth for shared UI component implementation standards**. It defines component behavior and implementation boundaries only.

All component styling consumes [DESIGN_TOKENS.md](./DESIGN_TOKENS.md). This document does not define, rename, or duplicate design tokens. [UI_MASTER_RULES.md](./UI_MASTER_RULES.md) owns product-wide UI/UX precedence; [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) owns the WCAG 2.2 AA release gate; the linked component handbooks provide existing evidence and examples.

## Document Metadata

| Field | Value |
| --- | --- |
| Owner | Product Design, Design Systems, and Frontend Engineering |
| Status | Canonical single source of truth for component implementation standards |
| Version | 2.0.1 |
| Last Updated | 2026-08-02 |
| Related Documents | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md), [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) |
| Scope | Shared component purpose, approved variants and sizes, states, accessibility, responsive behavior, layout, governance, lifecycle, versioning, and AI validation |
| Out of Scope | Design-token definitions or values, app code, page-specific composition, business logic, data models, API behavior, and visual redesign |

## 1. Authority and implementation boundary

| Concern | Canonical authority |
| --- | --- |
| Token names, values, aliases, modes, and token governance | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) |
| Product-wide UI/UX decisions | [UI_MASTER_RULES.md](./UI_MASTER_RULES.md) |
| Shared component implementation standards | This document |
| Existing component evidence and detailed examples | [components/](./components/) |
| Accessibility acceptance | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Form behavior | [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) |
| Dashboard behavior | [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md) |
| Table behavior | [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md) |
| Chart behavior | [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md) |

Implementation rules:

- Use an existing component before proposing a new one.
- Use only existing approved variants and sizes; this document does not create new ones.
- Components consume [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) only for colors, typography, spacing, radius, elevation, borders, icons, motion, grid, breakpoints, opacity, and z-index.
- Never hardcode visual values in component implementation.
- Keep behavior consistent across modules, roles, themes, viewport sizes, zoom, localization, and input methods.
- Keep authorization, business rules, data fetching, and persistence outside the visual component.
- A component may hide or expose an action, but it is never the only permission boundary.
- Prefer composition over forks. A new component requires documented evidence that an approved component or pattern cannot meet the need.

### 1.1 Component Source Priority

Resolve every component requirement against existing sources in this order:

| Priority | Source | Resolution rule |
| ---: | --- | --- |
| 1 | Existing Component Standards | Reuse the approved implementation contract, behavior, variant, size, and state rule in this document. |
| 2 | Existing Components | Reuse the existing shared component and its approved handbook under [components/](./components/). |
| 3 | Existing Design System | Reuse the established component architecture and contribution rules in [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md) and [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md). |

Source-priority rules:

- Never create a new component if an existing component or approved composition meets the need.
- Never create a new variant if an existing variant expresses the same behavior or hierarchy.
- Never create a new size if an existing size preserves usability and accessibility.
- Never create new behavior if an existing component behavior already solves the workflow.
- If sources conflict, preserve the highest-priority approved rule and record the conflict through [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).
- A new component, variant, size, or behavior requires documented evidence that all higher-priority sources are insufficient.

### 1.2 Component Governance

Every component record and approved component handbook must include:

| Required field | Standard |
| --- | --- |
| Name | One canonical component name; aliases point to the existing source and do not create duplicate components. |
| Purpose | The user outcome and operational task the component supports. |
| Owner | An accountable Product Design, Design Systems, or Frontend Engineering owner. |
| Status | `Draft`, `Approved`, `Deprecated`, or `Removed`. |
| Version | The component contract version that applies to the record. |
| Related Tokens | A reference to [DESIGN_TOKENS.md](./DESIGN_TOKENS.md); token names and values are not defined here. |
| Accessibility Status | Evidence that WCAG 2.2 AA, keyboard, screen-reader, focus, touch, zoom, and reduced-motion requirements are satisfied where applicable. |
| Responsive Status | Evidence that mobile-first reflow, narrow-width behavior, zoom, localization, and essential task access are preserved. |
| Replacement | The approved replacement component when Status is `Deprecated`; use `Not applicable` otherwise. |

Anonymous components are forbidden. A component without a complete governance record cannot be Approved, introduced into shared product surfaces, or treated as an approved source.

### 1.2.1 Component Governance Registry

This registry supplies governance metadata for every component standard below. Behavioral rules remain in each component section; token definitions remain exclusively in [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).

| Name | Purpose | Owner | Status | Version | Related Tokens | Accessibility Status | Responsive Status | Replacement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Button | [Button](#button) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Input | [Input](#input) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Text Field |
| Textarea | [Textarea](#textarea) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Select | [Select](#select) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Checkbox | [Checkbox](#checkbox) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Radio | [Radio](#radio) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Switch | [Switch](#switch) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Badge | [Badge](#badge) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Alert | [Alert](#alert) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Tooltip | [Tooltip](#tooltip) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Card | [Card](#card) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Modal | [Modal](#modal) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Dialog |
| Drawer | [Drawer](#drawer) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Dropdown | [Dropdown](#dropdown) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Tabs | [Tabs](#tabs) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Accordion | [Accordion](#accordion) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Table | [Table](#table) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Pagination | [Pagination](#pagination) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Sidebar | [Sidebar](#sidebar) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Navbar | [Navbar](#navbar) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Top Navigation |
| Breadcrumb | [Breadcrumb](#breadcrumb) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Avatar | [Avatar](#avatar) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Skeleton | [Skeleton](#skeleton) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Spinner | [Spinner](#spinner) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Loading Spinner |
| Toast | [Toast](#toast) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Empty State | [Empty State](#empty-state) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Loading State | [Loading State](#loading-state) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Error State | [Error State](#error-state) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Dashboard Cards | [Dashboard Cards](#dashboard-cards) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Charts | [Charts](#charts) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |
| Forms | [Forms](#forms) | Shared Design System owners | Approved | 1.0.0 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | WCAG 2.2 AA; see section | Mobile-first; see section | Not applicable |

The governance record applies to every component section below. The component heading supplies **Name**; the section’s Purpose row supplies **Purpose**; and the following shared record defines the required metadata without duplicating component behavior:

| Governance field | Required source |
| --- | --- |
| Name | Canonical `###` component heading and approved source handbook |
| Purpose | Component Purpose row in this document |
| Owner | Owner in this document and the approved source handbook |
| Status | Component lifecycle status: `Draft`, `Approved`, `Deprecated`, or `Removed` |
| Version | Component contract version in the approved source handbook; update when the contract changes |
| Related Tokens | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) only; token definitions and values remain out of scope here |
| Accessibility Status | Component Accessibility row plus evidence against [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) |
| Responsive Status | Component Responsive behavior row plus evidence against [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md) |
| Replacement | Required approved replacement when the component is Deprecated; otherwise `Not applicable` |

## 1.3 Component Lifecycle

Every component follows this lifecycle:

**Draft → Approved → Deprecated → Removed**

| Stage | Meaning | Required gate |
| --- | --- | --- |
| Draft | Proposed component or contract under review; not available for shared product use. | Purpose, owner, source-priority review, accessibility plan, responsive plan, and affected consumers are recorded. |
| Approved | Component may be consumed by approved product surfaces. | Governance fields, implementation contract, accessibility evidence, responsive evidence, and reuse decision pass review. |
| Deprecated | Component remains available for backward compatibility but must not be used for new work. | Replacement component, migration mapping, owner, deprecation date, and consumer inventory are recorded. |
| Removed | Component is no longer available after migration is complete. | All consumers migrate, validation passes, release evidence is recorded, and governance approves removal. |

Lifecycle rules:

- A component cannot skip from Draft to Removed.
- Deprecation must precede removal.
- A Deprecated component remains compatible until its migration is complete.
- A component purpose must not be silently repurposed; create a governed replacement when behavior changes materially.

## 1.4 Component Versioning

| Version change | Meaning | Required handling |
| --- | --- | --- |
| Major | Breaking component behavior | Record compatibility impact, migration plan, consumer inventory, replacement or transition path, and release evidence. |
| Minor | New component | Complete source-priority review and governance approval; do not silently alter existing component behavior. |
| Patch | Documentation updates | Clarify guidance, correct references, or update metadata without changing component behavior or consumer contracts. |

Versioning rules:

- A Major change requires a migration plan before Approved consumers adopt it.
- A Minor change must not introduce a duplicate component, variant, size, or behavior.
- A Patch change must not alter the implementation contract.
- Update this document and the owning component record when an approved standard changes.

## 2. Shared state contract

Every component review must account for the following states. A state that does not apply must remain absent; do not simulate an irrelevant state.

| State | Implementation requirement |
| --- | --- |
| Default | Expose the component’s normal purpose, value, and available action. |
| Hover | Provide pointer feedback only; never make essential meaning or operation hover-only. |
| Active | Communicate the current press, selection, expansion, or committed interaction. |
| Focus | Preserve a visible, keyboard-reachable focus state and logical focus order. |
| Disabled | Prevent the unavailable operation without destroying context; explain the reason when it is not obvious. |
| Loading | Communicate the affected object and preserve safe input, scope, and recovery. Prevent duplicate or conflicting actions. |
| Error | Identify the affected object, explain the problem, preserve safe input, and provide a safe next step. |

## 3. Global accessibility and responsive rules

- Meet WCAG 2.2 AA and the requirements in [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md).
- Use semantic HTML before ARIA; add ARIA only when it accurately exposes the implemented behavior.
- Every interactive control has an accessible name, keyboard operation, visible focus, programmatic state, and a safe recovery path.
- Do not use color, motion, position, iconography, or hover as the only status or meaning signal.
- Start with the narrowest supported layout, then enhance for available space.
- Preserve labels, scope, action access, status, and recovery at mobile widths and 200% zoom.
- Never introduce essential horizontal scrolling, clipped text, hover-only behavior, or precision-only interaction.
- Use [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) for every visual value; no raw colors, spacing, typography, radius, shadow, or animation values.

## 4. Canonical names and existing sources

Requested names are mapped to existing project authorities. These aliases do not create new components.

| Standard name | Existing source or implementation authority |
| --- | --- |
| Input | [Text Field](./components/Text%20Field.md) |
| Modal | [Dialog](./components/Dialog.md) |
| Navbar | [Top Navigation](./components/Top%20Navigation.md) |
| Spinner | [Loading Spinner](./components/Loading%20Spinner.md) |
| Loading State | [LOADING_STATES.md](./LOADING_STATES.md) and [Skeleton](./components/Skeleton.md) |
| Forms | [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) and existing field handbooks |
| Dashboard Cards | [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md) and [Charts](./components/Charts.md) |

## 5. Component standards

Each component below uses the same implementation contract: Purpose, Variants, Sizes, States, Accessibility, Responsive behavior, Layout & spacing rules, Do / Don't, and AI Rules.

### Button

| Field | Standard |
| --- | --- |
| Purpose | Activate an operation in the current context, such as saving, creating, applying, exporting, or confirming. Use a link for navigation. |
| Variants | Use only the approved `primary`, `secondary`, `quiet`, and `destructive` variants from [Button.md](./components/Button.md). Variants communicate hierarchy, not permission. |
| Sizes | Use only sizes already supported by the existing Button implementation. Do not add a size for visual preference. |
| States | Default: named action. Hover: pointer feedback. Active: press feedback. Focus: visible keyboard focus. Disabled: unavailable action with context preserved. Loading: prevent duplicate submission and retain the action meaning. Error: expose failed result and recovery. |
| Accessibility | Use a native button with an explicit form type, accessible name, keyboard activation, visible focus, WCAG 2.2 AA contrast, and an equivalent non-color status cue. |
| Responsive behavior | Keep the label and action reachable at narrow widths; allow the control to reflow with its group instead of clipping or relying on hover. |
| Layout & spacing rules | Align the Button with the action scope and related fields. Consume only [DESIGN_TOKENS.md](./DESIGN_TOKENS.md); never add page-local visual values. |
| Do / Don't | Do use verb-plus-object labels and confirm consequential destructive actions. Don’t use an unlabeled icon-only action, duplicate-submit, or hide why an unavailable action cannot run. |
| AI Rules | Reuse the existing Button and approved variants. Never invent a variant, size, token, loading animation, or alternate button style. |

### Input

| Field | Standard |
| --- | --- |
| Purpose | Capture one-line text such as a Student ID, name, email, identifier, or short title. This standard maps to [Text Field](./components/Text%20Field.md). |
| Variants | Use only existing input modes and approved field patterns. Use Textarea, Password Field, Search Field, Select, or Autocomplete when their existing contract fits better. |
| Sizes | Use only sizes supported by the existing Text Field implementation. Do not create compact or large variants locally. |
| States | Default: persistent label and value context. Hover: pointer feedback. Active: editing context. Focus: visible focus and caret. Disabled: unavailable without losing value context. Loading: preserve value while the owning operation is pending. Error: associate the message and preserve safe input. |
| Accessibility | Use a persistent programmatic label, instruction and error association, appropriate autocomplete and input mode, keyboard access, WCAG 2.2 AA contrast, and screen-reader state. |
| Responsive behavior | Allow the field and its label, help, and error content to wrap at narrow widths and 200% zoom without horizontal scrolling. |
| Layout & spacing rules | Keep the label, control, instruction, and error in one meaningful field group. Use [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md) and the token registry; never use arbitrary field spacing. |
| Do / Don't | Do distinguish required from optional and validate at a useful point. Don’t clear typed input after validation or server failure, or use hint text as the label. |
| AI Rules | Reuse the existing Text Field contract. Never invent input modes, field sizes, token values, or validation behavior. |

### Textarea

| Field | Standard |
| --- | --- |
| Purpose | Capture meaningful multi-line content such as notes, descriptions, explanations, or review comments. |
| Variants | Use only the approved Textarea behavior in [Textarea.md](./components/Textarea.md); a character count is allowed only when an existing workflow defines a limit or recommendation. |
| Sizes | Use only the existing Textarea sizing behavior. Do not add local row counts or visual sizes as new component variants. |
| States | Default: editable multi-line value. Hover: pointer feedback. Active: editing. Focus: visible focus and caret. Disabled: preserve readable content. Loading: preserve content while saving. Error: explain the field or server problem and preserve line breaks and input. |
| Accessibility | Provide a persistent label, instruction where needed, error association, keyboard access, readable character guidance, WCAG 2.2 AA contrast, and screen-reader announcements. |
| Responsive behavior | Permit safe wrapping and vertical growth at narrow widths and zoom; never require horizontal scrolling for essential text entry. |
| Layout & spacing rules | Keep label, control, count, help, and error in one field group. Consume only the token registry for visual values. |
| Do / Don't | Do preserve user text across errors and interruptions. Don’t unexpectedly reformat, truncate, or use Textarea for a one-line constrained selection. |
| AI Rules | Reuse the approved Textarea contract and existing form patterns. Never invent an editor mode, size, token, or auto-format rule. |

### Select

| Field | Standard |
| --- | --- |
| Purpose | Choose one value from a known, bounded set. |
| Variants | Use only the approved Select pattern in [Select.md](./components/Select.md). Use Multi Select or Autocomplete when the existing source contract requires multiple or searchable values. |
| Sizes | Use only existing Select sizes. Do not create a size to fit a toolbar or card. |
| States | Default: label and current value context. Hover: pointer feedback. Active: open or committed interaction. Focus: visible focus and keyboard route. Disabled: unavailable with value context preserved. Loading: identify unavailable options and recovery. Error: preserve the prior value and explain the failed option load or validation. |
| Accessibility | Use a programmatic label, keyboard opening and option navigation, announced selected value, visible focus, correct expanded/selected state, touch access, and WCAG 2.2 AA behavior. Hint text is not a value. |
| Responsive behavior | Keep the option surface within the viewport and make all options reachable by keyboard and touch; use a responsive alternative only when the existing pattern requires it. |
| Layout & spacing rules | Keep label, control, instruction, error, and option surface associated. Use only approved tokens and the existing Select implementation. |
| Do / Don't | Do make selection reversible before commit and preserve scope. Don’t use Select for free text, an unbounded dataset, or a multi-value choice without the approved component. |
| AI Rules | Reuse existing Select, Multi Select, or Autocomplete contracts. Never invent option grouping, size, search behavior, or token values. |

### Checkbox

| Field | Standard |
| --- | --- |
| Purpose | Represent an independent choice or a parent selection summary. |
| Variants | Use only the approved Checkbox pattern in [Checkbox.md](./components/Checkbox.md). Mixed is a selection summary state, not a new visual variant. |
| Sizes | Use only existing Checkbox sizes and touch treatment. Do not reduce it to fit a dense row. |
| States | Default: unchecked or checked. Hover: pointer feedback. Active: pending change. Focus: visible focus. Disabled: unavailable with label retained. Loading: prevent conflicting bulk changes. Error: identify failed persistence and preserve the intended scope. |
| Accessibility | Provide a persistent label, group legend where needed, programmatic checked or mixed state, keyboard operation, non-color meaning, safe touch separation, and WCAG 2.2 AA feedback. |
| Responsive behavior | Keep the checkbox and label together, allow long labels to wrap, and preserve the full target at narrow widths and zoom. |
| Layout & spacing rules | Align the control, label, consequence text, and error as one choice group. Consume only [DESIGN_TOKENS.md](./DESIGN_TOKENS.md). |
| Do / Don't | Do show selected scope and count for bulk actions. Don’t preselect consequential consent, use Checkbox for mutually exclusive choices, or make color the only state cue. |
| AI Rules | Reuse the existing Checkbox contract. Never invent a selection variant, size, token, or hidden consent behavior. |

### Radio

| Field | Standard |
| --- | --- |
| Purpose | Choose exactly one value from a mutually exclusive set. |
| Variants | Use only the approved Radio group pattern in [Radio.md](./components/Radio.md). An explicit “None” option is content, not a new component variant. |
| Sizes | Use only existing Radio sizes and group layout. Do not compact away labels or safe touch access. |
| States | Default: one clear group choice or no choice when permitted. Hover: pointer feedback. Active: selected interaction. Focus: visible focus and group navigation. Disabled: preserve option meaning. Loading: prevent conflicting changes. Error: identify the group problem and preserve the current choice. |
| Accessibility | Provide a group legend, programmatic checked state, arrow-key navigation, keyboard access, visible focus, clear required state, and WCAG 2.2 AA status and error handling. |
| Responsive behavior | Stack options when needed for readability; preserve the group label and all choices at narrow widths and zoom. |
| Layout & spacing rules | Keep the legend, options, supporting consequence text, and error in one semantic group. Use only approved tokens. |
| Do / Don't | Do use Radio for mutually exclusive choices. Don’t use it for independent selection, an immediate setting, or a long searchable set. |
| AI Rules | Reuse the existing Radio group. Never invent option presentation, group behavior, size, or token values. |

### Switch

| Field | Standard |
| --- | --- |
| Purpose | Toggle a setting whose effect is understood as on or off and is expected to apply immediately or through the owning workflow. |
| Variants | Use only the approved Switch pattern in [Switch.md](./components/Switch.md). On and off are states, not variants. |
| Sizes | Use only existing Switch sizes. Do not reduce the target or create a decorative compact switch. |
| States | Default: actual persisted on/off state. Hover: pointer feedback. Active: toggle interaction. Focus: visible focus. Disabled: unavailable with state retained. Loading: prevent conflicting toggles and report actual system state. Error: explain failed persistence and offer retry or recovery. |
| Accessibility | Provide a persistent label, programmatic checked state, keyboard operation, visible focus, text or status meaning beyond the track and thumb, and WCAG 2.2 AA feedback. |
| Responsive behavior | Keep label, state, and control reachable together; allow the label to wrap without shrinking the target. |
| Layout & spacing rules | Align the Switch with its label and consequence text. Use only the token registry for spacing and visual treatment. |
| Do / Don't | Do report the persisted state and consequence. Don’t claim success before persistence, use Switch for a multi-choice selection, or rely on color alone. |
| AI Rules | Reuse the existing Switch behavior. Never invent a switch style, size, optimistic state, or token. |

### Badge

| Field | Standard |
| --- | --- |
| Purpose | Provide compact, non-interactive status or metadata adjacent to an object or value. |
| Variants | Use only existing semantic Badge variants from [Badge.md](./components/Badge.md). The meaning must come from text or an equivalent accessible label, not appearance alone. |
| Sizes | Use only existing Badge sizes. Never shrink text or target until status is unreadable. |
| States | Default: concise status or metadata. Hover: only when an existing pattern provides supplementary detail. Active: not applicable unless the approved pattern makes it interactive. Focus: only when interactive. Disabled: not applicable for passive status. Loading: use the owning loading pattern, not a misleading Badge. Error: state the actual error or failed condition. |
| Accessibility | Expose readable status text, sufficient contrast, non-color meaning, and a programmatic relationship to the object it describes. Do not use Badge as the only label for an action. |
| Responsive behavior | Allow text to wrap or reflow without clipping; preserve status meaning at narrow widths and zoom. |
| Layout & spacing rules | Place the Badge next to the object or value it qualifies. Use only approved tokens and avoid decorative status clutter. |
| Do / Don't | Do use concise, truthful status and metadata. Don’t use Badge for a primary action, hide critical instructions in it, or encode permission only through color. |
| AI Rules | Reuse the approved Badge variants and semantics. Never invent a status color, size, token, or interactive behavior. |

### Alert

| Field | Standard |
| --- | --- |
| Purpose | Present persistent or important status, guidance, warning, or error that requires awareness or action. |
| Variants | Use only existing semantic Alert variants from [Alert.md](./components/Alert.md). Choose the variant by meaning and consequence, not visual preference. |
| Sizes | Use only existing Alert sizes or density modes. Do not compress away message, scope, or recovery. |
| States | Default: visible message and scope. Hover: not required. Active: action inside the Alert follows its control semantics. Focus: actionable content remains reachable. Disabled: only its action may be disabled with explanation. Loading: identify pending status. Error: explain the affected object and recovery. |
| Accessibility | Use an appropriate semantic status or alert role, readable heading/message, non-color cue, keyboard access for actions, focus handling, and WCAG 2.2 AA announcement behavior. |
| Responsive behavior | Reflow message and actions vertically when necessary; never clip the alert or obscure required content. |
| Layout & spacing rules | Place the Alert near the content or action it explains and preserve its relationship at all widths. Consume only approved tokens. |
| Do / Don't | Do state scope, consequence, and next step. Don’t use Alert as a transient Toast, expose sensitive details, or make color the only signal. |
| AI Rules | Reuse existing Alert variants and feedback rules. Never invent severity, dismissibility, size, token, or escalation behavior. |

### Tooltip

| Field | Standard |
| --- | --- |
| Purpose | Supplement an unfamiliar control or concise metadata with non-critical explanatory text. |
| Variants | Use only the approved Tooltip pattern in [Tooltip.md](./components/Tooltip.md). |
| Sizes | Use only the existing Tooltip content and placement behavior; do not create a visual size scale. |
| States | Default: no tooltip unless needed. Hover: show supplementary content without delay that blocks work. Active: preserve trigger operation. Focus: show for keyboard focus when appropriate. Disabled: do not rely on a disabled control’s tooltip as its only explanation. Loading: not a substitute for loading feedback. Error: not a substitute for visible error content. |
| Accessibility | Make content reachable by keyboard and touch where needed, associate it with the trigger, provide a dismiss path, and never use it as the only label, instruction, status, or error. |
| Responsive behavior | Keep content within the viewport and provide an accessible alternative on touch devices and narrow widths. |
| Layout & spacing rules | Anchor the Tooltip to the relevant trigger and avoid obscuring the task or focus. Use only approved tokens. |
| Do / Don't | Do explain unfamiliar controls briefly. Don’t put critical values, long instructions, or required recovery only in a Tooltip. |
| AI Rules | Reuse the existing Tooltip behavior. Never invent hover-only workflows, placement rules, size, or token values. |

### Card

| Field | Standard |
| --- | --- |
| Purpose | Group related content, identity, status, metric, or actions into a meaningful surface. |
| Variants | Use only approved Card composition patterns from [Card.md](./components/Card.md). Interactive Cards must retain an explicit action or link semantics. |
| Sizes | Use only existing Card layouts. Do not create page-specific sizes to force unrelated content into a grid. |
| States | Default: clear identity and content scope. Hover: feedback only for interactive Cards. Active: selected or opened state when defined by the pattern. Focus: visible focus for interactive Cards. Disabled: unavailable action remains understandable. Loading: reserve the known structure. Error: identify failed content and recovery. |
| Accessibility | Use meaningful headings, landmarks or grouping semantics, keyboard access for interactive Cards, visible focus, and non-color status. Do not make a whole Card interactive without an accessible name and target behavior. |
| Responsive behavior | Reflow Card content and actions from multi-column to a readable stack; never rely on fixed height or clipped content. |
| Layout & spacing rules | Group only related content; align heading, value, status, and action. Use token-defined surface, spacing, radius, and elevation only. |
| Do / Don't | Do use Card to clarify relationships. Don’t place unrelated metrics together, hide required actions below hover, or use Card as a substitute for page hierarchy. |
| AI Rules | Reuse existing Card composition and tokens. Never invent a Card variant, elevation, radius, size, or decorative surface. |

### Modal

| Field | Standard |
| --- | --- |
| Purpose | Interrupt the current task for focused information, confirmation, or a bounded operation requiring review. This standard maps to [Dialog](./components/Dialog.md). |
| Variants | Use only existing Dialog variants and workflow patterns. Use a non-modal surface when the user must retain page context and interaction. |
| Sizes | Use only existing Dialog sizes and responsive transformations. Do not create a size that hides the title, consequence, or recovery path. |
| States | Default: descriptive title, scope, and action. Hover: standard control feedback. Active: action review or editing. Focus: contained logical focus. Disabled: unavailable action is explained. Loading: identify the affected operation and prevent duplicate commit. Error: preserve input and provide recovery. |
| Accessibility | Use a descriptive accessible title, correct dialog semantics, focus containment and restoration, keyboard dismissal where safe, visible focus, WCAG 2.2 AA contrast, and explicit consequence review. |
| Responsive behavior | Fit the viewport, reflow content and actions, and transform according to the existing Dialog pattern on mobile; never trap content behind inaccessible overflow. |
| Layout & spacing rules | Keep title, scope, content, consequence, primary action, secondary action, and dismissal relationship clear. Use only [DESIGN_TOKENS.md](./DESIGN_TOKENS.md). |
| Do / Don't | Do use Modal for focused review and bounded tasks. Don’t use it for routine page content, hide material consequences, or execute an irreversible action without review. |
| AI Rules | Reuse Dialog behavior and approved variants. Never invent overlay layers, focus behavior, size, token, or animation. |

### Drawer

| Field | Standard |
| --- | --- |
| Purpose | Expose related detail or a focused task while preserving meaningful page context. |
| Variants | Use only existing Drawer patterns from [Drawer.md](./components/Drawer.md), including the approved responsive transformation. |
| Sizes | Use only existing Drawer sizes or placement behavior. Do not create a width that obscures the originating context or essential action. |
| States | Default: named detail or task scope. Hover: standard control feedback. Active: editing or action interaction. Focus: logical focus within the Drawer. Disabled: preserve context and explain unavailable actions. Loading: identify the affected detail or task. Error: provide recovery without losing the originating context. |
| Accessibility | Provide a title, correct region/dialog semantics, focus management and restoration, keyboard dismissal, visible focus, and WCAG 2.2 AA access to all content and actions. |
| Responsive behavior | Reflow or transform to the approved mobile presentation; do not require hidden horizontal content or precision gestures. |
| Layout & spacing rules | Keep trigger, Drawer title, scope, content, actions, and close control related. Consume only approved tokens. |
| Do / Don't | Do use Drawer for related detail or focused work. Don’t hide critical navigation, create an unannounced modal effect, or discard unsaved input on close. |
| AI Rules | Reuse existing Drawer behavior. Never invent placement, size, focus, token, or dismissal behavior. |

### Dropdown

| Field | Standard |
| --- | --- |
| Purpose | Expose contextual actions or a bounded command set associated with a trigger. |
| Variants | Use only the approved Dropdown and Menu patterns in [Dropdown.md](./components/Dropdown.md). Use Select or Autocomplete for value entry rather than actions. |
| Sizes | Use only existing Dropdown sizing and density. Do not create a compact menu that makes targets or labels inaccessible. |
| States | Default: trigger exposes purpose. Hover: pointer feedback. Active: open and selected action. Focus: keyboard navigation and visible focus. Disabled: unavailable action remains understandable. Loading: show action-specific pending state. Error: report failed action and recovery outside or within the approved surface. |
| Accessibility | Use an accessible trigger and menu semantics, keyboard open/navigation/close, focus return, announced disabled and selected states, touch access, and WCAG 2.2 AA behavior. |
| Responsive behavior | Keep the menu within the viewport and adapt placement without hiding actions; touch users must have an equivalent operation. |
| Layout & spacing rules | Anchor the Dropdown to its trigger and preserve action grouping and consequence. Use only approved tokens. |
| Do / Don't | Do group related commands and confirm consequential actions. Don’t hide permission scope, rely on hover, or place required instructions only in a menu. |
| AI Rules | Reuse the existing Dropdown or Menu. Never invent menu hierarchy, placement, size, token, or command side effects. |

### Tabs

| Field | Standard |
| --- | --- |
| Purpose | Switch between closely related views without changing the identity or primary scope of the current object. |
| Variants | Use only approved Tabs patterns from [Tabs.md](./components/Tabs.md). Use navigation when destinations or object identity change. |
| Sizes | Use only existing Tabs sizes and overflow behavior. Do not add a size to fit too many labels. |
| States | Default: selected tab and visible panel are clear. Hover: pointer feedback. Active: selection change. Focus: keyboard navigation and visible focus. Disabled: unavailable tab preserves its label and reason where needed. Loading: identify panel scope. Error: show panel-specific recovery without losing selected context. |
| Accessibility | Use tablist, tab, and tabpanel semantics accurately, expose selected and controlled relationships, support keyboard navigation, maintain focus, and meet WCAG 2.2 AA. |
| Responsive behavior | Allow labels to scroll or reflow only through the existing pattern; do not truncate essential tab meaning or create inaccessible horizontal overflow. |
| Layout & spacing rules | Keep tabs aligned with the controlled panel and use consistent grouping. Consume only approved tokens. |
| Do / Don't | Do use Tabs for peer views of the same object. Don’t hide critical state in an unselected tab, use Tabs as primary navigation, or make color the only selected cue. |
| AI Rules | Reuse existing Tabs behavior. Never invent tab overflow, size, selection, panel loading, or token rules. |

### Accordion

| Field | Standard |
| --- | --- |
| Purpose | Reveal or hide secondary detail while keeping the surrounding page context visible. |
| Variants | Use only approved Accordion behavior from [Accordion.md](./components/Accordion.md), including the existing single or multiple expansion behavior where documented. |
| Sizes | Use only existing Accordion density. Do not reduce headings or targets to fit more items. |
| States | Default: heading and disclosure state are clear. Hover: pointer feedback. Active: opening or closing. Focus: visible focus and keyboard disclosure. Disabled: unavailable section remains understandable. Loading: identify the affected section. Error: explain failed content and recovery inside the section. |
| Accessibility | Use heading and disclosure semantics, accurate expanded/controls state, keyboard operation, visible focus, logical order, and WCAG 2.2 AA contrast and touch access. |
| Responsive behavior | Allow headings and content to wrap; preserve disclosure controls and expanded content at narrow widths and zoom. |
| Layout & spacing rules | Use Accordion only for related secondary content and keep each heading tied to its panel. Use only approved tokens. |
| Do / Don't | Do expose useful summaries in headings. Don’t hide required actions, errors, or primary information only inside collapsed content. |
| AI Rules | Reuse the existing Accordion behavior. Never invent expansion rules, size, token, or hidden-content dependency. |

### Table

| Field | Standard |
| --- | --- |
| Purpose | Present structured records whose rows, columns, labels, values, and actions must be compared. |
| Variants | Use only existing Table patterns from [Table.md](./components/Table.md) and [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md). Use Data Grid for approved simultaneous multi-row editing. |
| Sizes | Use only existing Table density modes. Do not reduce content, target size, or row identity to fit more rows. |
| States | Default: caption, scope, columns, and row identity are clear. Hover: supplementary row feedback only. Active: selected, sorted, or edited state. Focus: keyboard reachability and visible focus. Disabled: unavailable row action is explained. Loading: reserve stable structure. Error: identify failed load or action and recovery. |
| Accessibility | Provide a caption or title, correct headers and relationships, announced sort/filter state, accessible row actions, keyboard operation, non-color status, and WCAG 2.2 AA reflow behavior. |
| Responsive behavior | Transform to the existing responsive detail pattern when a table would become unreadable; never require horizontal scrolling for an essential task. |
| Layout & spacing rules | Align headers, values, units, status, and row actions consistently. Use only approved tokens and [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md). |
| Do / Don't | Do distinguish empty, filtered-empty, loading, unavailable, and error states. Don’t hide row identity on hover, truncate critical values, or use a table for unrelated cards. |
| AI Rules | Reuse the existing Table or Data Grid. Never invent columns, density, sorting semantics, responsive behavior, or token values. |

### Pagination

| Field | Standard |
| --- | --- |
| Purpose | Move through a bounded record set while preserving query, filter, sort, and scope context. |
| Variants | Use only approved Pagination patterns from [Pagination.md](./components/Pagination.md). |
| Sizes | Use only existing Pagination sizes and density. Do not hide the current range or essential navigation to save space. |
| States | Default: current page and result scope are clear. Hover: pointer feedback. Active: selected page or pending navigation. Focus: keyboard navigation and visible focus. Disabled: unavailable previous/next is announced or visually clear. Loading: prevent conflicting page changes and identify the affected set. Error: preserve the current page and provide retry. |
| Accessibility | Expose current page, available pages or next/previous meaning, result range, keyboard access, focus handling, and WCAG 2.2 AA labels and state. |
| Responsive behavior | Use the approved compact or previous/next transformation without hiding scope or making page selection inaccessible. |
| Layout & spacing rules | Keep Pagination associated with the Table or record set it controls. Use only approved tokens. |
| Do / Don't | Do preserve filters, sorting, and scope. Don’t reset the user’s query or use unlabeled icon-only page controls. |
| AI Rules | Reuse existing Pagination behavior. Never invent page-size, range, size, or token rules. |

### Sidebar

| Field | Standard |
| --- | --- |
| Purpose | Provide persistent role-aware navigation and workspace context for primary product destinations. |
| Variants | Use only approved Sidebar patterns from [Sidebar.md](./components/Sidebar.md), including existing expanded or collapsed behavior. |
| Sizes | Use only existing Sidebar widths and density. Do not create a local navigation width. |
| States | Default: current location, scope, and destinations are clear. Hover: pointer feedback. Active: current destination is exposed by more than color. Focus: keyboard navigation and visible focus. Disabled: unavailable destination is handled according to permission rules. Loading: preserve navigation context while destination data resolves. Error: retain recovery and safe return path. |
| Accessibility | Use navigation landmarks, accessible names, current-location state, keyboard access, visible focus, skip or equivalent landmarks, and WCAG 2.2 AA behavior. |
| Responsive behavior | Reflow to the approved mobile navigation pattern without hiding required destinations or relying on hover. Preserve platform back and return behavior. |
| Layout & spacing rules | Align navigation hierarchy and workspace scope consistently across modules. Consume only approved tokens. |
| Do / Don't | Do make role, Organization, and current location understandable. Don’t make the Sidebar the only authorization layer or hide destinations without an understandable permission boundary. |
| AI Rules | Reuse existing Sidebar and navigation patterns. Never invent navigation hierarchy, collapse rules, size, token, or permission behavior. |

### Navbar

| Field | Standard |
| --- | --- |
| Purpose | Provide global or workspace-level navigation, identity, scope, and primary utility actions. This standard maps to [Top Navigation](./components/Top%20Navigation.md). |
| Variants | Use only approved Top Navigation patterns. Do not create a second navigation language for a single module. |
| Sizes | Use only existing Navbar density and responsive behavior. Do not shrink labels or controls below accessible operation. |
| States | Default: product, scope, and primary utilities are clear. Hover: pointer feedback. Active: current destination or utility state. Focus: visible logical focus. Disabled: unavailable utility retains explanation where needed. Loading: preserve scope while utilities resolve. Error: expose failed utility state and recovery. |
| Accessibility | Use semantic header and navigation landmarks, accessible names, keyboard reachability, visible focus, current location, and WCAG 2.2 AA behavior. |
| Responsive behavior | Reflow to the approved mobile navigation pattern; preserve scope, identity, notifications, and safe return behavior. |
| Layout & spacing rules | Keep global navigation, scope switcher, identity, and utility actions in stable relationships. Use only approved tokens. |
| Do / Don't | Do preserve current Organization, Workspace, and role context. Don’t replace navigation with a logo-only bar, hide required actions behind hover, or duplicate Sidebar destinations inconsistently. |
| AI Rules | Reuse existing Top Navigation and shared navigation patterns. Never invent a Navbar variant, size, token, or role-visibility rule. |

### Breadcrumb

| Field | Standard |
| --- | --- |
| Purpose | Show the user’s hierarchical location and provide a safe path back through related contexts. |
| Variants | Use only approved Breadcrumb behavior from [Breadcrumb.md](./components/Breadcrumb.md), including the existing current-location and truncation behavior. |
| Sizes | Use only existing Breadcrumb sizing. Do not remove labels to fit a viewport. |
| States | Default: hierarchy and current location are clear. Hover: link feedback. Active: selected navigation route. Focus: visible focus and keyboard navigation. Disabled: non-navigable current item remains understandable. Loading: preserve hierarchy while labels resolve. Error: expose unavailable path or recovery without false location. |
| Accessibility | Use navigation landmark and accessible label, ordered links, current-page state, keyboard access, visible focus, and WCAG 2.2 AA text and reflow. |
| Responsive behavior | Use the approved narrow-width truncation or collapsing pattern while keeping the current location and a safe return path. |
| Layout & spacing rules | Keep Breadcrumb aligned with page title and scope; use only approved tokens and avoid decorative separators as the only relationship cue. |
| Do / Don't | Do show meaningful object and module hierarchy. Don’t expose internal IDs as the primary location or remove current context because the path is long. |
| AI Rules | Reuse existing Breadcrumb behavior. Never invent hierarchy, truncation, size, token, or navigation semantics. |

### Avatar

| Field | Standard |
| --- | --- |
| Purpose | Represent a person, organization, or record identity with a privacy-aware fallback. |
| Variants | Use only approved image, initials, and fallback behavior from [Avatar.md](./components/Avatar.md). Avatar appearance does not grant permission or indicate presence unless the existing pattern explicitly exposes that state. |
| Sizes | Use only existing Avatar sizes. Do not reduce identity text or target to fit a layout. |
| States | Default: identity is understandable. Hover: supplementary detail only where approved. Active: selected identity only when the surrounding control defines it. Focus: visible focus when interactive. Disabled: preserve identity while disabling its action. Loading: use Skeleton or approved loading treatment. Error: show the approved fallback and preserve the name. |
| Accessibility | Provide meaningful alternative text or accessible name, privacy-aware fallback, keyboard access when interactive, non-color identity meaning, and WCAG 2.2 AA contrast. |
| Responsive behavior | Preserve name or accessible identity when the image is hidden or constrained; allow adjacent labels to wrap. |
| Layout & spacing rules | Keep Avatar associated with the person or record it identifies. Use only approved tokens for size, spacing, and shape. |
| Do / Don't | Do preserve identity when imagery fails. Don’t expose private imagery unnecessarily or imply role, status, or authorization through decoration alone. |
| AI Rules | Reuse existing Avatar and fallback behavior. Never invent an Avatar size, image treatment, token, or privacy interpretation. |

### Skeleton

| Field | Standard |
| --- | --- |
| Purpose | Reserve the known shape of content while that content is loading. |
| Variants | Use only the approved Skeleton shapes and compositions from [Skeleton.md](./components/Skeleton.md). |
| Sizes | Match the known consuming content structure through existing implementation behavior; do not create arbitrary reserved dimensions. |
| States | Default: not shown when content is ready. Hover: not applicable. Active: not applicable. Focus: not focusable. Disabled: not applicable. Loading: stable shape with truthful scope. Error: replace with Error State when loading fails; never leave Skeleton indefinitely. |
| Accessibility | Do not expose decorative Skeletons as interactive content; announce meaningful loading status through the owning workflow and preserve reduced-motion behavior. |
| Responsive behavior | Match the responsive structure of the content it reserves; prevent layout shift without blocking reflow or zoom. |
| Layout & spacing rules | Place Skeletons exactly where the known content will appear and consume only approved tokens. |
| Do / Don't | Do reserve predictable content structure. Don’t use Skeleton to imply success, show fake values, or mask an error or empty state. |
| AI Rules | Reuse the existing Skeleton composition. Never invent simulated content, shape, size, token, or indefinite loading behavior. |

### Spinner

| Field | Standard |
| --- | --- |
| Purpose | Indicate brief indeterminate work when the affected operation and scope are already clear. This standard maps to [Loading Spinner](./components/Loading%20Spinner.md). |
| Variants | Use only approved Loading Spinner placement and status patterns. Use Skeleton or a durable status for known content loading. |
| Sizes | Use only existing Spinner sizes. Do not scale it decoratively or use size as the only progress meaning. |
| States | Default: not shown when idle. Hover: not applicable. Active: not applicable. Focus: not focusable unless part of an accessible status control. Disabled: not applicable. Loading: identify the affected action or object and prevent duplicate work. Error: replace with a truthful Error State or recovery message. |
| Accessibility | Provide an accessible status for meaningful loading, avoid interruptive announcements, preserve reduced motion, and never rely on animation alone. |
| Responsive behavior | Keep the Spinner visible within its context at narrow widths; do not obscure the only action or status. |
| Layout & spacing rules | Place Spinner beside or within the affected operation and use only approved tokens. |
| Do / Don't | Do use Spinner for brief indeterminate work. Don’t use it without scope, as a substitute for an error, or indefinitely for known content. |
| AI Rules | Reuse existing Spinner behavior. Never invent a spinner animation, duration, size, token, or loading claim. |

### Toast

| Field | Standard |
| --- | --- |
| Purpose | Provide concise transient feedback with an optional safe action such as Retry or Undo. |
| Variants | Use only the approved neutral, success, warning, and recoverable-error variants from [Toast.md](./components/Toast.md). |
| Sizes | Use only existing Toast sizing and density. Do not reduce readable message or action content. |
| States | Default: concise message and scope. Hover: pause or allow interaction according to the existing pattern. Active: action is pending. Focus: action and dismissal are reachable. Disabled: only the safe action may be unavailable with explanation. Loading: show action-specific pending status. Error: preserve important failure in durable page or activity feedback. |
| Accessibility | Use an appropriate live-region strategy, readable message, non-color status, keyboard-accessible actions, dismissal control where appropriate, and WCAG 2.2 AA contrast. |
| Responsive behavior | Reflow within the viewport and avoid covering essential controls; preserve the message and action on mobile. |
| Layout & spacing rules | Anchor feedback to the relevant workflow without obscuring focus or required action. Use only approved tokens. |
| Do / Don't | Do pause for interaction and preserve consequential results durably. Don’t use Toast as the only record of a Fee, Exam, permission, privacy, security, or other material result. |
| AI Rules | Reuse existing Toast variants and feedback rules. Never invent duration, stacking, severity, size, token, or recovery behavior. |

### Empty State

| Field | Standard |
| --- | --- |
| Purpose | Explain that a completed request has no content for the current object, scope, query, permission, or setup condition. |
| Variants | Use only approved no records, no results, first-use, not configured, no access, and unavailable variants from [Empty State](./components/Empty%20State.md). |
| Sizes | Use only existing Empty State composition. Do not reduce explanation or safe action to fit a card. |
| States | Default: specific condition and scope. Hover: standard action feedback. Active: primary recovery or setup action. Focus: action is reachable and visible. Disabled: unavailable action is explained. Loading: use Loading State instead. Error: use Error State instead. |
| Accessibility | Provide a clear heading, object and scope, readable explanation, accessible action, non-color meaning, and WCAG 2.2 AA structure and contrast. |
| Responsive behavior | Keep heading, explanation, and primary safe action readable and reachable at narrow widths and zoom. |
| Layout & spacing rules | Place the Empty State in the content region it describes and distinguish filtered-empty from no records. Use only approved tokens. |
| Do / Don't | Do offer one safe next action such as clear filters, refresh, or create. Don’t disguise loading, service failure, unauthorized access, or an error as empty content. |
| AI Rules | Reuse the existing Empty State variants and copy patterns. Never invent a status, action, illustration, size, or token. |

### Loading State

| Field | Standard |
| --- | --- |
| Purpose | Communicate that content or an operation is in progress, including its affected scope and expected recovery path. |
| Variants | Use only existing Loading State patterns: Skeleton for known structure, Spinner for brief indeterminate work, or the owning workflow’s approved progress treatment. |
| Sizes | Match the consuming content or workflow through existing patterns; do not define a new loading size. |
| States | Default: loading is absent when idle. Hover: not applicable. Active: not applicable. Focus: not focusable unless it contains an action. Disabled: affected actions are safely controlled. Loading: truthful scope and no false values. Error: transition to Error State when the operation fails. |
| Accessibility | Announce meaningful status without excessive interruption, preserve keyboard and screen-reader context, respect reduced motion, and never communicate loading only through motion. |
| Responsive behavior | Preserve layout stability and reflow across mobile, desktop, and zoom without hiding the affected scope. |
| Layout & spacing rules | Reserve space in the same relationship as the eventual content and use only approved tokens. |
| Do / Don't | Do distinguish loading from empty, stale, unavailable, and error. Don’t show fake content, block unrelated work, or leave a loading state without a completion or recovery path. |
| AI Rules | Reuse existing loading patterns. Never invent animation, duration, simulated data, size, token, or completion claims. |

### Error State

| Field | Standard |
| --- | --- |
| Purpose | Explain that content or an operation did not complete as intended and provide a safe next action. |
| Variants | Use only approved load failure, save failure, timeout, conflict, unavailable service, unauthorized, partial, and unknown-outcome variants from [Error State](./components/Error%20State.md). |
| Sizes | Use only existing Error State composition. Do not reduce the explanation, affected scope, or recovery action. |
| States | Default: truthful failure and scope. Hover: action feedback. Active: retry or recovery pending. Focus: recovery is visible and reachable. Disabled: unavailable retry explains why. Loading: show retrying status without duplicate requests. Error: preserve the original failure context. |
| Accessibility | Identify the affected object, completion status, cause at an appropriate level, next step, accessible action, non-color cue, and WCAG 2.2 AA announcement and focus behavior. |
| Responsive behavior | Reflow message and recovery action without clipping, horizontal scrolling, or loss of scope at narrow widths and zoom. |
| Layout & spacing rules | Keep the Error State near the failed content or action and preserve safe user input and filters. Use only approved tokens. |
| Do / Don't | Do distinguish failed, partial, unauthorized, unavailable, and unknown outcomes. Don’t claim a consequential operation failed when its outcome is unknown or clear safe input. |
| AI Rules | Reuse existing Error State variants and recovery patterns. Never invent failure severity, retry behavior, size, token, or certainty. |

### Dashboard Cards

| Field | Standard |
| --- | --- |
| Purpose | Summarize an operational metric, status, trend, or next action with enough context to support a decision. |
| Variants | Use only approved metric, summary, status, action, and chart-card compositions from [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md). |
| Sizes | Use only existing dashboard composition and density. Do not create a size that removes metric name, unit, period, denominator, freshness, or action context. |
| States | Default: name, value, unit, period, scope, and interpretation are clear. Hover: supplementary interaction only. Active: selected or drilled-down state. Focus: keyboard access and visible focus. Disabled: unavailable action retains explanation. Loading: stable structure without fake values. Error: identify failed metric and recovery. |
| Accessibility | Expose metric meaning, unit, comparison, period, freshness, and status in text; provide keyboard access and WCAG 2.2 AA contrast and reflow. |
| Responsive behavior | Reflow cards according to task priority; preserve critical exceptions, scope, and actions on mobile and at zoom. |
| Layout & spacing rules | Group only related metrics, align comparable values, and keep action and interpretation adjacent. Use [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) only. |
| Do / Don't | Do prioritize operational attention and define denominators. Don’t use vanity metrics, decorative cards, or position/color as the only status or meaning. |
| AI Rules | Reuse existing dashboard card patterns. Never invent a metric variant, size, raw value, chart decoration, or hidden data scope. |

### Charts

| Field | Standard |
| --- | --- |
| Purpose | Show a meaningful relationship, trend, comparison, or distribution that supports an operational decision; exact values remain available in text or tabular form. |
| Variants | Use only approved Bar, Line, Donut/Pie, Stacked Bar, Scatter/Distribution, and Metric Tile patterns from [Charts](./components/Charts.md) and [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md). |
| Sizes | Use only existing chart compositions and responsive treatments. Do not invent a size that removes title, scope, units, legend, freshness, or accessible alternative. |
| States | Default: title, scope, units, and data are clear. Hover: supplementary tooltip only. Active: selected data or drill-down. Focus: keyboard-accessible controls and visible focus. Disabled: unavailable interaction is explained. Loading: stable skeleton in the chart region. Error: truthful failed-data state and recovery. |
| Accessibility | Provide a title, scope, units, text summary or accessible equivalent, data table for screen readers, non-color series distinction, keyboard access where interactive, WCAG 2.2 AA contrast, and reduced-motion behavior. Critical values must not require hover. |
| Responsive behavior | Simplify or transform to the existing responsive chart pattern; preserve the most important insight and link to the full table or record set. |
| Layout & spacing rules | Keep chart, title, scope, period, freshness, legend, and interpretation together. Use only approved tokens and existing visualization guidance. |
| Do / Don't | Do preserve scope, exact values, units, freshness, and drill-down context. Don’t use 3D perspective, color alone, misleading axes, or an AI estimate presented as recorded fact. |
| AI Rules | Reuse existing chart patterns and label AI-generated output with its source scope and review status. Never invent a chart type, scale, token, or unsupported certainty. |

### Forms

| Field | Standard |
| --- | --- |
| Purpose | Collect, validate, review, and record information safely within a defined workflow. |
| Variants | Use only existing create, edit, filter, search, review, and workflow form compositions from [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md). |
| Sizes | Use the existing field and form layout behavior; do not create page-specific form sizes or density that weaken readability or touch access. |
| States | Default: purpose, scope, labels, required/optional status, and primary action are clear. Hover: control feedback. Active: editing or selection. Focus: logical keyboard order and visible focus. Disabled: unavailable field or action is explained. Loading: preserve draft and prevent conflicting commits. Error: identify field or record, explain correction, preserve safe input, and provide recovery. |
| Accessibility | Every field has a persistent programmatic label, instruction and error association, keyboard access, understandable constraints, visible focus, non-color status, and WCAG 2.2 AA behavior. |
| Responsive behavior | Mobile-first forms complete essential work without horizontal scrolling; groups reflow while preserving question order, scope, actions, errors, and recovery at zoom. |
| Layout & spacing rules | Use one question per field, group related fields by meaning, separate consequential actions from secondary actions, and use only [DESIGN_TOKENS.md](./DESIGN_TOKENS.md). |
| Do / Don't | Do validate when useful, preserve drafts and safe input, state consequence before commit, and distinguish Save from Reset. Don’t clear recoverable input, hide required fields, or put business authorization only in the component. |
| AI Rules | Reuse existing field handbooks and form patterns. Never invent a field variant, validation rule, size, token, or consequential commit behavior. |

## 6. Component review checklist

Before approving a component or component change, verify:

- [ ] The approved component or pattern was reused; no duplicate component, variant, or size was introduced.
- [ ] Every requested contract field is documented: Purpose, Variants, Sizes, States, Accessibility, Responsive behavior, Layout & spacing rules, Do / Don't, and AI Rules.
- [ ] All visual values resolve through [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).
- [ ] Default, hover, active, focus, disabled, loading, and error behavior is truthful and tested where applicable.
- [ ] WCAG 2.2 AA, keyboard, screen-reader, touch, zoom, localization, and reduced-motion behavior are preserved.
- [ ] Mobile-first reflow preserves labels, scope, action access, status, and recovery.
- [ ] Page composition, business logic, permission enforcement, and data contracts remain outside the shared visual component.
- [ ] Existing component handbook, module examples, and [QUALITY_GATES.md](./QUALITY_GATES.md) evidence are linked.

### 6.1 AI Validation Checklist

Before finalizing any component-related design or implementation change, verify:

- [ ] Uses [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) only for visual values.
- [ ] No hardcoded colors, spacing, typography, radius, shadows, borders, icon dimensions, breakpoints, or animation values.
- [ ] No duplicate components are introduced.
- [ ] No duplicate variants are introduced.
- [ ] No new sizes are introduced without approved governance evidence.
- [ ] Accessibility is preserved, including WCAG 2.2 AA, keyboard, screen-reader, focus, touch, zoom, and reduced-motion behavior.
- [ ] Responsive behavior is preserved across mobile-first, desktop, narrow-width, localization, and 200% zoom conditions.
- [ ] Existing components and approved compositions are reused.
- [ ] No implementation code is included in this documentation.

If any checklist item fails, stop before finalizing and resolve or escalate the issue. AI must not silently create, rename, fork, or reinterpret a component, variant, size, behavior, or token.

## 7. References

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md)
- [DESIGN_SYSTEM_GUIDE.md](./DESIGN_SYSTEM_GUIDE.md)
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md)
- [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)
- [STATE_SYSTEM.md](./STATE_SYSTEM.md)
- [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md)
- [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md)
- [TABLE_DESIGN_GUIDE.md](./TABLE_DESIGN_GUIDE.md)
- [DATA_VISUALIZATION_GUIDE.md](./DATA_VISUALIZATION_GUIDE.md)
- [QUALITY_GATES.md](./QUALITY_GATES.md)