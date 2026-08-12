---
title: EduTrack UI Master Rules
purpose: Provide the single source of truth for practical UI and UX decisions across the EduTrack enterprise SaaS product.
scope: Visual hierarchy, layout, interaction, components, states, accessibility, responsive behavior, motion, AI-assisted design, and UI review decisions across every role and module.
audience: Product, Product Design, Design Systems, Engineering, Content, QA, Accessibility, AI Governance, and reviewers.
related_documents:
  - ./PRODUCT_GOVERNANCE.md
  - ./PRODUCT_CONSTITUTION.md
  - ./DESIGN_SYSTEM_GUIDE.md
  - ./DESIGN_TOKENS.md
  - ./COMPONENT_SPECIFICATIONS.md
  - ./ACCESSIBILITY_STANDARDS.md
  - ./UX_LAWS.md
  - ./USABILITY_HEURISTICS.md
  - ./GESTALT_PRINCIPLES.md
  - ./TYPOGRAPHY_SYSTEM.md
  - ./SPACING_SYSTEM.md
  - ./LAYOUT_GRID.md
  - ./COLOR_SYSTEM.md
  - ./MOTION_GUIDELINES.md
  - ./RESPONSIVE_SYSTEM.md
  - ./MOBILE_UX_GUIDE.md
  - ./NAVIGATION_STANDARDS.md
  - ./FORM_DESIGN_GUIDE.md
  - ./DASHBOARD_DESIGN_GUIDE.md
  - ./EMPTY_STATES.md
  - ./LOADING_STATES.md
  - ./ERROR_HANDLING.md
  - ./INTERACTION_DESIGN.md
  - ./AI_UX_GUIDELINES.md
  - ./REVIEW_CHECKLISTS.md
  - ./QUALITY_GATES.md
review_frequency: Quarterly and after a material product, brand, accessibility, platform, or interaction change
owner: Product Design and Product Governance
version: 1.0.0
status: Single source of truth UI/UX authority
last_updated: 2026-08-02
normative_level: Binding UI/UX standard
canonical_terms: Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Authentication, Organization, Profile, Settings, Search, Filters, AI Assistant, Workspace, Permission, Role, Component, Design Token
---

# EduTrack UI Master Rules

This is the only UI/UX authority for EduTrack. It applies to every role, module, route, component, state, viewport, and AI-assisted design change.

EduTrack is an **enterprise SaaS application**, not a marketing website. The interface must help authorized people complete operational work accurately, safely, and efficiently. It must not prioritize visual novelty, promotional storytelling, or decorative motion over task completion, trust, accessibility, and recovery.

## 1. Authority, precedence, and maintenance

### 1.1 What this document owns

This document owns the practical UI/UX decision: what a user should see, understand, choose, operate, and recover from. The linked handbooks remain implementation references and evidence owners:

- [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) owns token roles, naming, consumption, and versioning.
- [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) owns component contracts and states.
- [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) owns the WCAG 2.2 AA release gate.
- [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md), [SPACING_SYSTEM.md](./SPACING_SYSTEM.md), [LAYOUT_GRID.md](./LAYOUT_GRID.md), [COLOR_SYSTEM.md](./COLOR_SYSTEM.md), and [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) own their implementation foundations under these rules.
- [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md), and state handbooks own detailed patterns and evidence.
- [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md), security, privacy, and release-gate documents remain higher-level authorities where their constraints apply.

If another UI/UX document disagrees with this one, use this document, record the conflict through [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md), and update the lower-level document instead of creating a third rule.

### 1.2 The master decision order

When choices conflict, decide in this order:

1. Accessibility and equivalent access.
2. Safety, privacy, permission, and data integrity.
3. User control, clarity, and recoverability.
4. Performance and reliable feedback.
5. Consistency and learnability.
6. Aesthetics and visual polish.

This preserves the project decision order in [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md). A beautiful interface that blocks a user, hides a consequence, or misstates a result fails.

### 1.3 The rule-card format

Every rule in this document uses the same review questions:

- **Why:** the user, business, safety, or comprehension reason.
- **Use when:** the condition that calls for the rule.
- **Do not use when:** the boundary or exception.
- **Good:** a concrete EduTrack application.
- **Bad:** a concrete failure to reject.

If a new UI decision cannot answer all five questions, it is not ready for implementation.

## 2. Core UI principles and product-wide rules

### Rule 1 — Design for the job, not the screen

- **Why:** Enterprise users come to complete work, inspect status, make decisions, and recover from exceptions.
- **Use when:** Defining a new page, changing a module, choosing a layout, or reviewing a visual redesign.
- **Do not use when:** Treating a page as a poster, feature gallery, or collection of visually balanced cards without a user goal.
- **Good:** An Attendance page leads with current scope, roster status, marking action, pending state, and exceptions.
- **Bad:** A dashboard leads with decorative gradients and vanity metrics while overdue Fees and failed Reports are hidden below the fold.

### Rule 2 — Optimize usability before aesthetics

- **Why:** Correctness, access, trust, and task completion create product value; polish cannot repair a confusing or inaccessible workflow.
- **Use when:** Choosing between a visually attractive option and a clearer, safer, faster option.
- **Do not use when:** Using “clean” or “premium” styling to justify removing labels, context, focus, recovery, or permission information.
- **Good:** Keep a dense but readable Fee summary because amount, balance, scope, and action must be compared together.
- **Bad:** Remove the balance and confirmation details to make a payment card look minimal.

### Rule 3 — Preserve product identity

- **Why:** Familiar branding and established visual language reduce relearning and protect user trust.
- **Use when:** Improving an existing product surface, generating a UI proposal, or adapting a pattern to another module.
- **Do not use when:** Replacing the brand palette, typography family, component character, or established visual language merely to make a redesign look new.
- **Good:** Reuse the approved semantic tokens and component styles while improving alignment, grouping, spacing, and responsive behavior.
- **Bad:** Introduce a new glassmorphism theme, unrelated font family, or alternate button language for one page.

## 3. UX psychology rules

The detailed rationale and domain examples live in [UX_LAWS.md](./UX_LAWS.md), [USABILITY_HEURISTICS.md](./USABILITY_HEURISTICS.md), and [GESTALT_PRINCIPLES.md](./GESTALT_PRINCIPLES.md). This section is the practical UI decision layer; it does not create a duplicate psychology handbook.

### Rule 4 — Make system status visible

- **Why:** Users need to know whether work is idle, loading, pending, saved, partial, failed, stale, or unauthorized.
- **Use when:** A request, mutation, import, export, notification, AI generation, or background refresh can take time or have an uncertain outcome.
- **Do not use when:** Showing a spinner without naming the affected object, scope, result, or next action.
- **Good:** “Saving Attendance for Batch A” becomes “Attendance saved for 32 of 35 Students,” with failed rows identified.
- **Bad:** A button silently disables for several seconds and then leaves the user guessing whether the Fee was recorded.

### Rule 5 — Match the user's world

- **Why:** Domain language and familiar workflows reduce cognitive translation and prevent operational mistakes.
- **Use when:** Naming pages, actions, fields, statuses, filters, metrics, and help.
- **Do not use when:** Exposing database terms, internal codes, unexplained abbreviations, or generic labels where the user needs a business outcome.
- **Good:** “Record payment,” “Publish results,” “Attendance session,” and “Organization” describe the user's work.
- **Bad:** “Mutate entity,” “execute batch,” or “status: 3” appears in the interface.

### Rule 6 — Preserve control and recovery

- **Why:** Enterprise work can affect records, money, permissions, privacy, and other people; users must understand and recover from actions.
- **Use when:** A workflow includes navigation, editing, deletion, publication, payment, permission change, export, AI application, timeout, or interruption.
- **Do not use when:** An action is irreversible, destructive, or consequential without review, cancellation, undo, or a clear support path.
- **Good:** A Fee reversal names the Student, amount, scope, actor, effect, and safe recovery path before confirmation.
- **Bad:** A destructive icon deletes a record immediately with no label, confirmation, or recovery.

### Rule 7 — Prefer recognition to recall

- **Why:** Users should not memorize IDs, filters, dates, permissions, or consequences across screens.
- **Use when:** A task crosses pages, steps, roles, objects, or responsive modes.
- **Do not use when:** Hiding the active Organization, Workspace, object, date range, applied Filter, or pending consequence in a tooltip or previous screen.
- **Good:** Report export retains the title, Organization, period, Filters, freshness, and output status.
- **Bad:** The user must remember a Student ID from the roster to confirm a Fee payment.

### Rule 8 — Reduce choices without removing control

- **Why:** Irrelevant choices slow common work, while hidden consequential choices damage trust.
- **Use when:** A menu, form, filter set, dashboard, or workflow has common and advanced paths.
- **Do not use when:** Hiding cost, privacy, permission, uncertainty, or data scope behind an “advanced” disclosure.
- **Good:** Show common Report Filters first, keep applied scope visible, and disclose advanced grouping when relevant.
- **Bad:** Present 30 equal-priority controls before the user can choose the report type.

### Rule 9 — Group by meaning and show relationships

- **Why:** Proximity, similarity, common region, continuity, closure, figure/ground, common fate, and Prägnanz help users perceive structure.
- **Use when:** Grouping content, aligning values with actions, designing cards, arranging steps, or showing related state changes.
- **Do not use when:** Using containers, color, or alignment to imply a relationship that does not exist or to hide incomplete, uncertain, or unauthorized content.
- **Good:** Fee amount, balance, payment action, and receipt status share a meaningful region; a chart sits with its scope, period, freshness, and text alternative.
- **Bad:** Put unrelated metrics in the same card because their shapes align, or make a pending state look complete through visual closure.

### Rule 10 — Reserve emphasis for priority

- **Why:** Salience directs attention; excessive emphasis makes real risk and required work harder to find.
- **Use when:** Signaling a primary action, operational exception, destructive consequence, permission boundary, stale result, or required review.
- **Do not use when:** Making every card bold, colorful, animated, or elevated, or using red for ordinary information.
- **Good:** Emphasize an unresolved Attendance exception with text, semantic status, and a scoped action.
- **Bad:** Give a promotional panel the strongest color and largest type on an operational Dashboard.

### Rule 11 — Apply the ten Nielsen heuristics as a complete review

- **Why:** A single visual check misses status, language, control, consistency, prevention, recognition, efficiency, minimalism, recovery, and help failures.
- **Use when:** Reviewing every new or materially changed UI surface; inspect all ten: visibility of system status; match with the real world; user control and freedom; consistency and standards; error prevention; recognition rather than recall; flexibility and efficiency; aesthetic and minimalist design; error recovery; and help/documentation.
- **Do not use when:** Treating one heuristic as permission to ignore accessibility, safety, security, data integrity, or the other nine.
- **Good:** A new bulk Attendance action is checked for scope/status, domain language, cancel/review, consistent control, duplicate prevention, visible selection, keyboard efficiency, relevant content, recoverable errors, and contextual help.
- **Bad:** Approve a beautiful flow because it is “minimal” while it hides system status and offers no recovery.

### Rule 12 — Use UX laws as hypotheses, then verify them

- **Why:** Fitts, Hick, Miller, Jakob, Tesler, Doherty, Peak-End, Von Restorff, Zeigarnik, Goal Gradient, Aesthetic-Usability, Choice Overload, Chunking, and Selective Attention are useful design lenses, not proof of usability.
- **Use when:** Choosing target placement, decision count, context visibility, familiar patterns, automation, feedback timing, endings, emphasis, unfinished work, progress, grouping, or exception visibility.
- **Do not use when:** Citing a law instead of testing real tasks, or using a law to justify a smaller target, hidden consequence, false progress, or decorative complexity.
- **Good:** Put “Record payment” beside the Fee balance (proximity/Fitts), show only role-relevant actions (Hick), preserve scope (Miller), and test completion with administrators.
- **Bad:** Shrink a control because “less visual noise” is preferred, or add a progress bar without a real denominator because “goal gradient” sounds motivating.

## 3.1 Platform and industry conventions

### Apple Human Interface Guidelines rule — Prefer clarity, deference, and direct manipulation

- **Why:** Apple Human Interface Guidelines reinforce clear hierarchy, understandable controls, platform-respectful behavior, and direct manipulation that keeps users oriented.
- **Use when:** Designing touch interaction, sheets, navigation, focus, gestures, confirmation, or a responsive surface that must feel familiar on Apple devices.
- **Do not use when:** Copying a native iOS pattern that conflicts with EduTrack's enterprise web workflows, keyboard access, role boundaries, or cross-platform consistency.
- **Good:** A mobile Fee review keeps the affected Student and amount visible, uses a clear sheet title and action, supports Back and Escape equivalents where applicable, and keeps the same semantic button outcome as desktop.
- **Bad:** Hide a critical permission or financial consequence behind a gesture because the interaction resembles a native app.

See [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) for platform guidance; this document and EduTrack accessibility standards remain authoritative for the product.

### Material Design rule — Use responsive surfaces, meaningful elevation, and explicit state

- **Why:** Material Design provides practical patterns for responsive layout, surfaces, elevation, motion, component states, and adaptive interaction.
- **Use when:** Structuring cards, sheets, dialogs, navigation, responsive layouts, focus states, or stateful components across desktop and mobile.
- **Do not use when:** Adding shadows, rounded cards, floating controls, or motion as decoration, or adopting Material defaults that change EduTrack branding or semantic tokens.
- **Good:** Use elevation only to distinguish a real layer such as a dialog or navigation sheet, keep state visible in text and semantics, and map the pattern to EduTrack tokens.
- **Bad:** Put every metric in a floating card with a shadow and imply importance or interactivity that does not exist.

See [Material Design](https://m3.material.io/) for platform-independent pattern reference; [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) and [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) own EduTrack implementation.

### Professional SaaS UI rule — Optimize repeated work, trust, and scale

- **Why:** SaaS users return frequently, operate across roles and organizations, and need predictable workflows more than novelty.
- **Use when:** Designing navigation, dashboards, tables, search, forms, permissions, reports, notifications, onboarding, and settings.
- **Do not use when:** Treating the product like a campaign website, hiding tenant scope, sacrificing density for decoration, or adding a pattern that cannot scale to real records and states.
- **Good:** A role-aware Dashboard exposes scope, freshness, exceptions, saved views, keyboard access, and scoped drill-downs for repeated operational work.
- **Bad:** A visually impressive home screen provides no clear next action, no result freshness, and no explanation of what the user can safely change.

## 4. Visual hierarchy and composition

### Rule 13 — Give every surface one focal point

- **Why:** A clear focal point lets users identify the page purpose and next useful action quickly.
- **Use when:** Designing a page, Dashboard module, modal, panel, card, or empty/error state.
- **Do not use when:** Competing headlines, equal-weight buttons, multiple accent colors, or unrelated promotional content create several first stops.
- **Good:** The Student detail page makes identity and the current task primary; secondary history and metadata support it.
- **Bad:** A page gives equal visual weight to title, five metrics, three buttons, an illustration, and a notification banner.

### Rule 14 — Establish visual hierarchy with more than size

- **Why:** Type size alone is fragile under localization, zoom, and responsive reflow.
- **Use when:** Ordering headings, content, actions, status, and supporting detail.
- **Do not use when:** Relying on tiny muted text, color alone, uppercase text, or position alone to express importance.
- **Good:** Use semantic headings, spacing, weight, alignment, labels, and status semantics to distinguish page title, section, data value, and helper text.
- **Bad:** Make an important warning smaller and lighter because it is “secondary.”

### Rule 15 — Use whitespace to clarify, not to decorate

- **Why:** Empty space separates groups, establishes rhythm, protects touch targets, and reduces scanning effort.
- **Use when:** Separating page regions, grouping fields, establishing card hierarchy, or adapting density to task risk.
- **Do not use when:** Adding large gaps to create a luxury aesthetic while pushing the primary task, scope, or recovery below the fold.
- **Good:** Keep a label close to its field, related fields in a group, and unrelated sections separated by a larger semantic gap.
- **Bad:** Place a single action far from the data it changes because the layout looks more balanced.

### Rule 16 — Follow reading flow, but do not hide critical work

- **Why:** F-pattern scanning commonly supports text-heavy operational pages; Z-pattern scanning can support simple, low-density compositions.
- **Use when:** Planning the order of headings, summaries, controls, lists, and supporting information.
- **Do not use when:** Assuming a pattern guarantees attention, or putting permissions, errors, financial consequences, or current scope in low-scan regions.
- **Good:** A Dashboard places heading/scope first, primary tasks and exceptions next, then supporting metrics and detail.
- **Bad:** Place the only “Save” action or an access warning in a visually quiet corner because the page follows a Z shape.

### Rule 17 — Use Gestalt relationships honestly

- **Why:** Users infer relationships from proximity, similarity, common region, continuity, closure, figure/ground, and synchronized change.
- **Use when:** Designing grouping, alignment, collection views, timelines, charts, cards, and state transitions.
- **Do not use when:** A visual relationship would imply shared ownership, status, permission, scope, or completion that the data does not support.
- **Good:** Align a Report Filter summary with the result set it controls and label both with the same scope.
- **Bad:** Put a permission control in a visually shared card with a read-only metric, implying the metric will change without explaining how.

## 5. Typography rules

### Rule 18 — Use semantic type roles and the approved family

- **Why:** Stable type roles make the product scannable and preserve brand familiarity across modules.
- **Use when:** Choosing a font, heading, label, body, data, helper, error, or caption treatment.
- **Do not use when:** Introducing a page-specific font, arbitrary type scale, decorative display face, or hierarchy based only on font size.
- **Good:** Use the approved typography family and semantic Page title, Section heading, Body, Label, Data value, Helper, and Error roles from [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md).
- **Bad:** Change the font family on the Dashboard to make it feel more “premium.”

### Rule 19 — Make type resilient to data and localization

- **Why:** Enterprise records contain long names, translated labels, large numbers, and user-controlled text.
- **Use when:** Designing tables, forms, metrics, navigation, notifications, charts, and responsive layouts.
- **Do not use when:** Irreversibly clipping identity, hiding units, forcing narrow columns, or using all caps for long content.
- **Good:** Wrap or disclose a long Organization name; align comparable numbers with units and periods; let translated labels expand.
- **Bad:** Truncate a Student name to an indistinguishable ellipsis or let an error overlap its action at 200% zoom.

### Rule 20 — Make content carry meaning

- **Why:** Labels, values, units, status text, and error copy must remain understandable without visual styling.
- **Use when:** Naming actions, metrics, statuses, fields, empty states, loading states, and errors.
- **Do not use when:** An icon, color, hint text, tooltip, animation, or abbreviation is the only explanation.
- **Good:** “Attendance saved for 32 of 35 Students” explains the result without relying on green.
- **Bad:** A green checkmark with no accessible name or text is the only success signal.

## 6. Layout, spacing, grid, and color

### Rule 21 — Use the 8pt spacing system

- **Why:** A shared spacing rhythm makes grouping, density, and component behavior consistent across the product.
- **Use when:** Setting page padding, section gaps, card insets, field spacing, row density, and responsive relationships.
- **Do not use when:** Forcing an 8pt value that causes text clipping, unsafe targets, chart unreadability, platform conflict, or loss of a meaningful content relationship.
- **Good:** Use semantic spacing tokens mapped to the 8pt rhythm and document a component-level exception when content or accessibility requires it.
- **Bad:** Mix arbitrary values such as 13px, 19px, and 27px across equivalent fields because each page was tuned independently.

### Rule 22 — Use a 12-column desktop grid and content-driven reflow

- **Why:** A shared grid aligns headings, controls, data, and actions; reflow keeps the same meaning when space changes.
- **Use when:** Composing desktop pages, dashboards, reports, two-pane detail views, and responsive breakpoints.
- **Do not use when:** Treating twelve columns as twelve mandatory visible regions, or shrinking every desktop region until mobile content is unreadable.
- **Good:** Align the page heading, Filter bar, metric region, and table to shared columns; collapse or stack columns at content thresholds.
- **Bad:** Create a page-specific grid that misaligns the primary action and results, or preserve a desktop table by forcing horizontal scroll for an essential task.

### Rule 23 — Apply the 60-30-10 color composition rule carefully

- **Why:** A restrained distribution creates hierarchy and protects the meaning of semantic colors.
- **Use when:** Planning surfaces, secondary regions, and a primary accent in a new composition while consuming approved semantic tokens.
- **Do not use when:** Treating the ratio as a literal token requirement, overriding brand or contrast rules, or using accent color for every status and action.
- **Good:** Let approximately 60% of the composition be the primary surface, 30% be supporting surfaces or secondary structure, and 10% be intentional emphasis; validate contrast and state semantics.
- **Bad:** Paint 10% of a dense Dashboard bright red, or add new hues to reach the ratio when the approved palette already communicates the meaning.

### Rule 24 — Use design tokens, never visual magic numbers

- **Why:** Semantic tokens keep visual meaning consistent, reviewable, accessible, and migratable.
- **Use when:** Choosing color, type, spacing, radius, elevation, icon, layout, responsive, or motion values.
- **Do not use when:** Copying raw values into page styles, creating aliases for the same meaning, or inventing a local token to avoid reviewing the system.
- **Good:** Use `surface.canvas`, `text.primary`, `action.primary`, and semantic spacing aliases from [DESIGN_TOKENS.md](./DESIGN_TOKENS.md).
- **Bad:** Add `#2f80ed`, `17px`, and `13px` directly to one page because they look right in a screenshot.

## 7. Accessibility and responsive rules

### Rule 25 — Design to WCAG 2.2 AA and equivalent access

- **Why:** Accessibility is correctness; disability, device, language, bandwidth, and temporary conditions must not block essential work.
- **Use when:** Designing or reviewing every surface, component, state, chart, form, navigation path, and AI interaction.
- **Do not use when:** Treating accessibility as a final scan, relying on automated checks alone, or accepting color, hover, drag, motion, sound, or position as the only way to access meaning.
- **Good:** Provide semantic HTML, keyboard operation, visible focus, persistent labels, error association, text alternatives, non-color status, zoom/reflow support, and assistive-technology evidence.
- **Bad:** Approve a dashboard because it passes a screenshot review while keyboard users cannot reach the chart filters.

Use [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) for binding criteria and [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) for evidence. Those documents do not create a competing UI philosophy.

### Rule 26 — Design mobile-first around the primary task

- **Why:** Mobile is a primary operating context with touch, interruptions, variable networks, and limited space.
- **Use when:** Starting a new surface, adapting a desktop feature, prioritizing actions, or designing a role-specific workflow.
- **Do not use when:** Calling a compressed desktop layout “mobile,” removing scope/status/recovery, or hiding essential actions behind gestures or hover.
- **Good:** On mobile, preserve identity and scope, primary task, status and consequence, then secondary detail; make a Teacher's Attendance task reachable one-handed where feasible.
- **Bad:** Shrink a desktop table until Student names, status, and actions are unreadable.

### Rule 27 — Respond to content and input, not device labels

- **Why:** Viewport width, zoom, dynamic text, orientation, keyboard, touch, and network vary within the same device category.
- **Use when:** Defining breakpoints, responsive modes, tables, dialogs, navigation, forms, charts, and density.
- **Do not use when:** Designing only for named phone, tablet, or desktop widths, or changing a workflow's meaning to fit a breakpoint.
- **Good:** Stack Filters when their labels no longer fit, preserve applied scope, and offer a readable list/detail alternative for a dense table.
- **Bad:** Hide a permission warning at a breakpoint or require horizontal scrolling to reach the only action.

### Rule 28 — Preserve identity, scope, hierarchy, and recovery across modes

- **Why:** Responsive transformation must change presentation without changing what the user is doing or what the result means.
- **Use when:** Collapsing navigation, changing table presentation, opening a sheet, switching orientation, or restoring an interrupted session.
- **Do not use when:** Moving or omitting a primary action without a usability reason, losing browser back behavior, or clearing safe input during reflow.
- **Good:** A Fee detail view becomes a stacked mobile layout while amount, balance, Student, scope, review, and recovery remain reachable.
- **Bad:** The mobile version removes the balance and exposes only a generic “Pay” button.

## 8. Component and interaction rules

### Rule 29 — Reuse components and keep behavior consistent

- **Why:** Consistency reduces learning cost, implementation drift, and accessibility defects.
- **Use when:** A control, state, pattern, or workflow already exists or when creating a shared primitive.
- **Do not use when:** Forking a component for cosmetic reasons, changing equivalent labels/placement/keyboard behavior between modules, or bypassing the component contract.
- **Good:** Student Search and Teacher Search use the same labeled Search Field behavior with different data scope.
- **Bad:** One module uses “Submit,” another uses “Save,” and a third uses an icon for the same operation.

### Rule 30 — Make buttons name outcomes

- **Why:** Outcome labels reduce ambiguity and prevent accidental consequential actions.
- **Use when:** Adding primary, secondary, destructive, icon, floating, or pending actions.
- **Do not use when:** Using bare “OK,” “Submit,” “Go,” unlabeled icons, or multiple equal primary buttons for unrelated outcomes.
- **Good:** “Record payment,” “Save profile,” “Publish results,” “Export report,” and “Review AI suggestion.”
- **Bad:** A red trash icon beside a Student row deletes immediately with no accessible name or confirmation.

Button contracts, states, target sizes, and keyboard behavior are implemented through [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md) and the relevant component handbook.

### Rule 31 — Treat forms as reviewable data contracts

- **Why:** Forms collect information that can affect records, money, permissions, privacy, and downstream decisions.
- **Use when:** Designing create, edit, search, filter, import, authentication, payment, publication, or AI-apply flows.
- **Do not use when:** Using placeholders as labels, hiding requiredness, validating only after failure, clearing safe input, or committing a consequential action without review.
- **Good:** A Fee form names amount and currency, shows the Student and balance, validates safely, preserves input, and reviews effect before recording.
- **Bad:** A form uses unlabeled fields, generic “Something went wrong,” and resets all entries after a network timeout.

### Rule 32 — Make navigation location and permission clear

- **Why:** Users need to know where they are, what they can access, how to return, and whether a link changed scope.
- **Use when:** Designing Sidebar, top navigation, tabs, breadcrumbs, Search, deep links, mobile navigation, or role-specific destinations.
- **Do not use when:** Using tabs as permissions, relying on hidden gestures, exposing irrelevant disabled routes, or silently discarding unsaved work.
- **Good:** A Student detail route identifies the Student, active destination, Organization/Workspace scope, and safe return path.
- **Bad:** A mobile drawer has no visible current destination and browser Back exits the task or loses the form.

### Rule 33 — Design all meaningful states

- **Why:** Users need a truthful interpretation and next action when content is loading, absent, failed, stale, partial, unauthorized, or complete.
- **Use when:** Creating or changing a component, page, query, mutation, import, export, notification, or AI surface.
- **Do not use when:** Mapping every non-success response to an empty state, showing success while work is pending, or using a spinner as a substitute for recovery.
- **Good:** Distinguish “no Students yet,” “no matching Students,” “no access,” and “Students temporarily unavailable.”
- **Bad:** Show an empty table after a failed request and imply that no records exist.

Use [EMPTY_STATES.md](./EMPTY_STATES.md), [LOADING_STATES.md](./LOADING_STATES.md), [ERROR_HANDLING.md](./ERROR_HANDLING.md), and [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md) for state contracts.

## 9. Enterprise SaaS surface rules

### Rule 34 — Design Dashboards for operational decisions

- **Why:** A Dashboard is an operational starting point, not a gallery of metrics.
- **Use when:** Choosing Dashboard modules, metrics, charts, exceptions, quick actions, freshness, and drill-downs.
- **Do not use when:** Prioritizing vanity metrics, promotional content, unexplained trends, or visual density over role-relevant work.
- **Good:** A role-aware Dashboard shows scope, freshness, current tasks, exceptions, meaningful trends, and scoped next actions with accessible alternatives.
- **Bad:** A Dashboard shows a large percentage with no denominator, period, freshness, or route to the underlying records.

### Rule 35 — Design landing pages as product orientation, not campaign theater

- **Why:** In an enterprise application, a landing or home surface should orient the authorized user to useful work and trust boundaries.
- **Use when:** Designing the authenticated home page, role entry point, onboarding surface, or product shell.
- **Do not use when:** Applying marketing-site hero patterns, fake urgency, decorative testimonials, or promotional cards that outrank operational tasks.
- **Good:** The home surface identifies the role, Organization/Workspace, current work, exceptions, and safe next actions.
- **Bad:** The authenticated landing page behaves like a campaign site and hides the user's real tasks below a visual hero.

### Rule 36 — Preserve SaaS trust and scope

- **Why:** Multi-role, multi-Organization software must make scope, permissions, freshness, ownership, and consequences legible.
- **Use when:** Designing records, metrics, exports, notifications, settings, AI, impersonation, and role-specific views.
- **Do not use when:** Blurring tenant scope, presenting estimates as facts, exposing inaccessible destinations, or implying that an AI suggestion is a recorded result.
- **Good:** A Report names Organization, period, filters, freshness, source, limitations, and export state.
- **Bad:** A chart displays an unlabeled total that could be organization-wide, personal, cached, or incomplete.

## 10. Motion and micro-interaction rules

### Rule 37 — Use lightweight micro-interactions for feedback

- **Why:** Small, immediate cues confirm input and state without interrupting operational work.
- **Use when:** A control changes state, a save begins or completes, a panel opens, a filter applies, or a recoverable error needs attention.
- **Do not use when:** Motion delays work, creates false success, distracts from data, loops for urgency, or becomes the only status signal.
- **Good:** A brief text-backed pending-to-saved transition keeps focus on the Attendance control and exposes failure if acceptance does not occur.
- **Bad:** Confetti celebrates a Fee action before the server accepts it.

### Rule 38 — Keep motion between 150 and 300ms, purposeful, and removable

- **Why:** A narrow, consistent range keeps transitions perceptible without making enterprise workflows feel slow.
- **Use when:** Applying a nonessential transition, focus movement, navigation reveal, or state change that benefits from orientation.
- **Do not use when:** Animating a long task, blocking keyboard focus, looping alerts, flashing, using parallax, or adding motion where the state is already clear.
- **Good:** A panel opens in 200ms, can be interrupted, preserves focus, and is removed or reduced under `prefers-reduced-motion`.
- **Bad:** A 900ms page transition delays a Teacher's Attendance workflow or a pulsing red badge creates urgency without new information.

The timing rule is intentionally strict for UI motion. [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md) owns implementation evidence and reduced-motion behavior.

## 11. AI Design Rules

AI may assist with layout proposals, copy drafts, component composition, and responsive suggestions. It must not become a new design authority or silently alter product identity.

AI Design Rules are mandatory:

- Never redesign the product.
- Preserve branding.
- Preserve the color palette.
- Preserve the typography family.
- Preserve the component style.
- Improve only layout, positioning, hierarchy, spacing, grouping, responsiveness, accessibility, and usability.
- Reposition components if UX psychology suggests a better placement.
- Never move components without improving usability.
- Usability always takes priority over aesthetics.
- Avoid unnecessary animations.
- Keep interactions lightweight and performant.

### Rule 39 — Preserve the product; improve usability only

- **Why:** AI-generated novelty can introduce brand drift, inconsistency, inaccessible behavior, and unnecessary migration cost.
- **Use when:** AI proposes a redesign, layout change, component placement, responsive adaptation, or visual refinement.
- **Do not use when:** Treating an AI output as permission to replace the product's brand or design system.
- **Good:** Keep the existing branding, color palette, typography family, component style, and interaction language while improving layout, positioning, hierarchy, spacing, grouping, responsiveness, accessibility, or usability.
- **Bad:** Replace the product with a new visual theme because the generated mockup looks more fashionable.

### Rule 40 — Reposition only when it improves usability

- **Why:** Placement affects discoverability, decision order, reachability, scanning, and error prevention.
- **Use when:** UX evidence, task flow, role needs, content relationships, or responsive constraints show that a component belongs elsewhere.
- **Do not use when:** Moving components for symmetry, novelty, visual balance, or personal preference without a measurable usability benefit.
- **Good:** Move a Filter summary beside its results because users need to verify scope before interpreting the table.
- **Bad:** Move the primary action away from the data it changes merely to create a more dramatic composition.

### Rule 41 — Prefer calm, performant AI-assisted UI

- **Why:** Enterprise users need fast, predictable, reviewable interactions rather than spectacle.
- **Use when:** Generating or reviewing AI-created UI, animation, copy, or responsive behavior.
- **Do not use when:** Adding unnecessary animation, heavy effects, blocking transitions, fabricated status, hidden uncertainty, or expensive client work.
- **Good:** AI suggests a token-based layout with lightweight transitions; a human verifies semantics, scope, permissions, accessibility, and performance.
- **Bad:** AI adds animated backgrounds, looping loaders, hidden AI labels, or optimistic success to make a workflow feel impressive.

The AI-specific release contract remains in [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md). AI-generated code or design is not accepted until a human checks it against this document and the applicable release gates.

## 12. Review and acceptance

### Rule 42 — Review the complete experience, not the happy-path screenshot

- **Why:** UI quality is determined by real tasks, states, roles, input methods, data conditions, and recovery—not a single static image.
- **Use when:** Approving a new surface, component, redesign, responsive change, token change, or AI-generated proposal.
- **Do not use when:** Marking a UI complete after visual inspection alone.
- **Good:** Review the primary role task, keyboard and screen reader operation, 200% zoom, mobile reflow, long content, loading, empty, error, unauthorized, stale, reduced-motion, permission, and AI states as applicable.
- **Bad:** Approve a Dashboard because its desktop screenshot is balanced while the mobile table clips and the loading state shifts the action.

### Rule 43 — Record evidence and exceptions

- **Why:** A single source of truth stays useful only when decisions, deviations, owners, and evidence remain traceable.
- **Use when:** A rule is met, an exception is necessary, a specialized component differs, or a new pattern is proposed.
- **Do not use when:** Silently bypassing a rule or turning a one-off exception into an undocumented local standard.
- **Good:** Record the user goal, affected roles, rule references, evidence, risk, owner, mitigation, and expiry through [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md) and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).
- **Bad:** Ship a custom component with “looks better” as the only rationale and no accessibility, responsive, or recovery evidence.

## 13. Practical page checklist

Before accepting any UI change, answer:

- [ ] Is the user goal and enterprise workflow explicit?
- [ ] Is the product identity preserved?
- [ ] Is there one clear focal point and a useful next action?
- [ ] Are hierarchy, grouping, whitespace, reading flow, and scope understandable?
- [ ] Are approved type, color, spacing, layout, motion, and component tokens used?
- [ ] Does the page follow the 8pt rhythm and 12-column desktop composition where applicable?
- [ ] Is color restrained and semantic rather than decorative?
- [ ] Are buttons labeled by outcome and forms reviewable and recoverable?
- [ ] Is navigation location, permission, and return behavior clear?
- [ ] Are loading, empty, error, stale, partial, unauthorized, and success states truthful?
- [ ] Does the experience work mobile-first, responsively, with keyboard, zoom, screen readers, and reduced motion?
- [ ] Does the Dashboard or authenticated landing surface prioritize operational work over marketing presentation?
- [ ] Is motion limited to purposeful 150–300ms transitions and absent where unnecessary?
- [ ] If AI helped, did a human preserve branding, palette, typography, component style, and usability?
- [ ] Is evidence recorded, and is every exception owned and time-bounded?

Use [QUALITY_GATES.md](./QUALITY_GATES.md) for release decisions. This document governs UI/UX choices; it does not replace security, privacy, architecture, testing, or deployment evidence.

## 14. Reference map

| Decision | Start here | Detailed implementation owner |
| --- | --- | --- |
| Authority, conflict, or exception | This document and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md) | Product Governance |
| UX rationale and heuristics | Rules 4–12 | [UX_LAWS.md](./UX_LAWS.md), [USABILITY_HEURISTICS.md](./USABILITY_HEURISTICS.md), [GESTALT_PRINCIPLES.md](./GESTALT_PRINCIPLES.md) |
| Tokens and visual foundations | Rules 18–24 | [DESIGN_TOKENS.md](./DESIGN_TOKENS.md), [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md), [SPACING_SYSTEM.md](./SPACING_SYSTEM.md), [LAYOUT_GRID.md](./LAYOUT_GRID.md), [COLOR_SYSTEM.md](./COLOR_SYSTEM.md) |
| Accessibility and responsive behavior | Rules 25–28 | [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md), [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md), [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md) |
| Components, forms, navigation, and states | Rules 29–33 | [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md), state handbooks |
| Dashboard and authenticated home | Rules 34–36 | [DASHBOARD_DESIGN_GUIDE.md](./DASHBOARD_DESIGN_GUIDE.md), [INFORMATION_ARCHITECTURE.md](./INFORMATION_ARCHITECTURE.md) |
| Motion and AI-assisted design | Rules 37–41 | [MOTION_GUIDELINES.md](./MOTION_GUIDELINES.md), [AI_UX_GUIDELINES.md](./AI_UX_GUIDELINES.md) |
| Review evidence and release | Rules 42–43 | [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md), [QUALITY_GATES.md](./QUALITY_GATES.md) |