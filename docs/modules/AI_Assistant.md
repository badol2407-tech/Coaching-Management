---
title: EduTrack AI Assistant Module
purpose: Define transparent, scoped, human-controlled AI assistance for authorized Users without turning generated content into authority.
scope: AI Assistant entry, prompt and context selection, generated responses, summaries, explanations, drafts, citations, uncertainty, review, feedback, history, approved actions, and relationships to all authorized product modules.
audience: Product, Design, Engineering, Security, Privacy, Data, AI Governance, QA, Accessibility, Operations, and reviewers.
related_documents:
  - ../AI_UX_GUIDELINES.md
  - ../PRODUCT_GOVERNANCE.md
  - ../INFORMATION_ARCHITECTURE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../FORM_DESIGN_GUIDE.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../STATE_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../ACCESSIBILITY_TESTING.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after an AI, model, data, privacy, Role, safety, or workflow change
owner: Product, AI Governance, Security, Privacy, Data, Design, Engineering, Operations, and reviewers
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: AI Assistant, generated, source scope, uncertainty, human review, prompt, context, draft, citation, Organization, Workspace, Role, Permission, Student, Teacher, Fees, Reports, Analytics, Notifications
---

# AI Assistant

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate AI, authorization, security, accessibility, privacy, or governance standards.

## Purpose

AI Assistant is an optional assistive capability that helps authorized Users organize, summarize, explain, discover, or draft information within a stated source scope. It keeps recorded source data, generated content, uncertainty, limitations, human review, and any resulting action visibly separate.

The module applies the ownership and precedence rules in [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md), [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [SECURITY_UX.md](../SECURITY_UX.md). It does not create a model, safety, Permission, or source-record standard.

## Scope

### Included

- AI Assistant entry points, prompt composition, context selection, source scope, and permitted task types.
- Generated summaries, explanations, suggestions, drafts, classifications for review, citations, freshness, uncertainty, and limitations.
- Human review, edit, reject, retry, report, copy, save, and approved action handoffs.
- AI history, privacy controls, feedback, model/provider disclosure where required, and audit context.
- Authorized assistance for Students, Teachers, Attendance, Exams, Fees, Reports, Analytics, Notifications, Organization, Settings, Search, Filters, and future modules.

### Excluded

- Authentication, identity verification, Permission granting, Role assignment, or security adjudication.
- Replacing source modules, Reports, Analytics, Notifications, or human decision-makers as a source of truth.
- Silent mutation, autonomous financial, academic, disciplinary, employment, safety, or access decisions.
- Processing secrets, credentials, recovery factors, or unnecessary sensitive data.
- Presenting generated output as a verified fact, completed action, or authorized instruction.

## Users & Roles

| Role | AI Assistant responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate assistance and AI governance signals. | Explicitly authorized aggregate or support scope; minimize individual data. |
| Organization administrator | Use, review, configure approved AI contexts, and govern AI usage for the Organization. | Active Organization, Workspace, source, and Role scope. |
| Teacher | Request summaries, explanations, drafts, or discovery assistance for assigned work. | Assigned Classes, Subjects, Students, Attendance, Exams, and approved sources. |
| Student | Request explanations or summaries of own and explicitly shared content. | Own records and explicitly shared Organization content. |
| Future authorized Role | Use only AI capabilities declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. AI Assistant output is always labeled generated and remains separate from source records, Reports, Notifications, Permissions, and decisions.
2. Every request and response identifies authorized Organization, Workspace, Role, source modules, object scope, period, freshness, and relevant limitations.
3. Context is selected deliberately and cannot broaden beyond the User's current Permission. A prompt cannot grant authorization.
4. AI may summarize, explain, classify for review, suggest a Search or Filter, or draft content; it cannot silently apply the result.
5. High-impact actions require a source-module workflow with explicit human review, consequence, Permission, confirmation, and audit.
6. Uncertainty, missing data, stale source data, conflicting records, and unsupported requests are visible rather than hidden behind confident language.
7. Sensitive data is minimized before context assembly. Secrets, credentials, recovery factors, and unnecessary personal data are not submitted.
8. Feedback, rejection, correction, and reporting paths remain available. A User's correction does not silently rewrite the source record or training context.
9. AI history, prompts, outputs, citations, and retention follow approved privacy, security, and audit policy; history is not assumed to be permanent.
10. AI-generated Notifications cannot change Fees, Exams, Reports, Permissions, Profile, or Organization outcomes without the authorized workflow.

## User Journeys

### Organization administrator: review a generated summary

1. Open AI Assistant and confirm Organization, Workspace, Role, source scope, period, and intended question.
2. Review the prompt or task, context sources, privacy notice, and generated-state disclosure.
3. Inspect the response, citations, freshness, uncertainty, missing data, and limitations.
4. Edit, reject, retry, report, or open the owning source workflow.
5. Apply any approved action only after source-module confirmation and audit.

### Teacher: draft a Student or Class explanation

1. Open AI Assistant from an authorized Student, Class, Subject, Attendance, or Exam context.
2. Confirm the selected scope and the fields included or omitted.
3. Request a draft and review generated language, source references, uncertainty, and privacy.
4. Edit or reject the draft; send or save it only through the authorized Notification or source workflow.

### Student: request an explanation

1. Open AI Assistant with own or explicitly shared source context.
2. Ask a question or choose an approved explanation task.
3. Review generated status, source scope, limitations, and support path.
4. Return to the source record or request human help without treating the answer as a final decision.

### Authorized reviewer: report harmful or incorrect output

1. Open the generated response and inspect its source scope, prompt, time, and model/provider disclosure where available.
2. Report the issue with the minimum necessary context.
3. Preserve the source record and review status while routing the report to the approved governance path.

## Information Architecture

### AI Assistant entry

Purpose and generated-status disclosure → current Organization, Workspace, Role, and source context → prompt or task → privacy and context controls → submit.

### Generated response

Generated label and task → response or draft → citations and source links → freshness, uncertainty, missing data, limitations → edit, reject, retry, report, copy, save, or authorized action.

### AI history and controls

Request identity → owner and scope → prompt/output status → retention and privacy controls → feedback, report, delete, or support path.

Do not mix generated content with source-of-truth values or place private context in a response merely because the model could access it.

## Navigation Flow

`Sidebar > AI Assistant` opens the authorized assistant surface. From AI Assistant:

- source context or prompt → generated response;
- generated response → authorized Student, Teacher, Attendance, Exams, Fees, Reports, Analytics, Notifications, Search, Filters, Organization, Settings, or future-module destination;
- draft or proposed action → owning source workflow → review → confirmation → result or return to response;
- Dashboard or source module → AI Assistant with originating Organization, Workspace, Role, object, period, and Filter context;
- browser back → previous safe context without discarding an unreviewed draft.

Deep links recheck authorization and do not confirm protected source, Student, Teacher, Fee, Report, or Permission existence. Mobile preserves generated status, scope, primary review action, and recovery.

## Screen Specifications

### Assistant shell

- Purpose, generated-status disclosure, Organization, Workspace, Role, source scope, period, and privacy context are visible before submission.
- Prompt input, task type, context selector, clear action, pending state, and safe cancellation are explicit.
- The Assistant does not imply that available context is complete or authoritative.

### Generated response and review

- Generated label, response state, source links, citations, freshness, uncertainty, missing data, limitations, and review controls are visible without hover.
- Edit, reject, retry, report, copy, save, and authorized action controls are distinct.
- Proposed actions identify object, scope, effect, actor, Permission, approval, and recovery before leaving the Assistant.

### History, feedback, and privacy controls

- Request owner, source scope, timestamp, retention, privacy state, generated output, and feedback status are explicit.
- Delete, hide, report, and support paths do not imply that the source record changed.
- Sensitive prompt or response content is masked or omitted when the current Role cannot view it.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Bottom Navigation](../components/Bottom%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Textarea](../components/Textarea.md), [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), and [Command Palette](../components/Command%20Palette.md).
- [Card](../components/Card.md), [List](../components/List.md), [Table](../components/Table.md), [Accordion](../components/Accordion.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the reviewable AI, Search and filtered-list, field composition, focused overlay, consequential confirmation, draft, empty, loading/recovery, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Use AI Assistant, select source context, submit prompts, view generated history, save drafts, export output, apply approved actions, report output, and administer AI settings are separate capabilities.
- Capabilities are scoped by Organization, Workspace, Role, source module, object, Student, period, sensitivity, and action.
- AI context never grants source-record access; source and destination authorization are rechecked.
- High-impact action handoffs require separate source Permission, approval, confirmation, and audit.
- Authorization is rechecked for prompts, context assembly, caches, history, exports, Notifications, deep links, and approved actions.
- Permission denial does not reveal protected source, prompt, output, Student, or Organization existence.

## Validation Rules

- Task, source, Organization, Workspace, Role, object, period, privacy state, and requested action are validated before context assembly.
- Prompt and output handling validates sensitive data, retention, localization, citations, source freshness, and generated-state disclosure.
- Proposed actions validate source capability, scope, actor, approval, effect, confirmation, and audit before handoff.
- Duplicate submissions, stale context, conflicting source records, partial responses, and canceled requests require visible recovery.
- Client-supplied prompts or context identifiers cannot broaden authorization or bypass source filters.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [LOADING_STATES.md](../LOADING_STATES.md), [EMPTY_STATES.md](../EMPTY_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: explain the Assistant purpose and request source scope before accepting sensitive context.
- `loading`: preserve prompt, selected context, privacy controls, and focus; prevent duplicate submission.
- `ready`: show generated status, source scope, freshness, limitations, and permitted actions.
- `empty`: distinguish no prompt, no authorized context, no history, no available model/service, and unavailable source data.
- `partial`: identify available and unavailable context, citations, response regions, or action handoff.
- `stale`: expose source or response freshness and require refresh or review.
- `pending`: name generation, save, report, delete, or action handoff accepted but not final.
- `success`: name generated response, draft, report, or source action result without implying authority.
- `error`: preserve safe prompt and context; distinguish validation, privacy, authorization, model, network, timeout, and service failure.
- `unauthorized` and `disabled`: explain the available capability or support path without protected-data disclosure.

## Notifications

AI Assistant Notifications may communicate generation completion, required human review, a reported-output update, or a failed approved action. Delivery, preference, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). AI must not create artificial urgency or expose prompt/output content to an unauthorized recipient.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Generated status, source scope, citations, uncertainty, limitations, pending state, errors, and review controls are available through text and semantics.
- Prompt input, context selectors, response regions, live updates, dialogs, feedback controls, and focus recovery are keyboard and screen-reader operable.
- Generated, source, warning, error, accepted, rejected, and pending states never rely on color, motion, position, or sound alone.
- 200% zoom, 320 CSS pixel reflow, long responses, translated labels, touch, screen readers, input methods, and reduced motion are tested.

## AI Behavior

This module is the governed home for AI Assistant behavior, but [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md) remains the higher-level source of truth. All output is generated, scoped, uncertain where appropriate, reviewable, and non-authoritative. The Assistant must not process secrets, grant access, make high-impact decisions, mutate records, send consequential Notifications, or conceal missing data or harmful failure.

## Security

AI Assistant is Organization-, Workspace-, Role-, source-, object-, sensitivity-, and action-scoped. Enforce authorization and data minimization at context assembly, model/provider boundary, prompts, outputs, caches, history, exports, Notifications, deep links, audit, and action handoffs. Protect prompts and outputs as sensitive data where applicable, avoid secrets in URLs or logs, and audit high-impact review and action attempts under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Assistant identity, scope, and prompt controls before history or secondary context; cancel obsolete requests; preserve stable response structure; acknowledge slow generation; and avoid blocking source workflows on optional AI work. Measure Assistant open, context load, prompt submission, first useful response, completion, review, action handoff, report, and recovery with the shared engineering performance process; this module does not create a competing numeric threshold.

## Acceptance Criteria

- [ ] Users can identify generated status, Organization, Workspace, Role, source scope, period, freshness, limitations, and permitted actions.
- [ ] AI output remains separate from source records and is editable, rejectable, retryable, reportable, and human-reviewable.
- [ ] Context, prompts, history, caches, exports, Notifications, and action handoffs preserve authorization, privacy, and retention.
- [ ] AI cannot grant access, process secrets, make high-impact decisions, mutate records, or send consequential Notifications without an authorized workflow.
- [ ] Empty, partial, stale, pending, unauthorized, validation, model, timeout, and service-failure paths preserve safe intent.
- [ ] Approved components, canonical vocabulary, accessibility, security, governance, audit, and AI standards are reused without duplicate rules.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, reduced-motion, performance, and evidence requirements are documented.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: source scope, prompts, contexts, Roles, Permissions, Organization, Workspace, objects, sensitivity, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: prompt, context selector, response, citations, uncertainty, review, edit, reject, retry, report, action handoff, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: duplicate request, stale context, partial response, model failure, timeout, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, secrets, direct access, cache, history, export, Notification, audit, retention, and high-impact action evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, reduced-motion, and live-region evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, model/provider change, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)
- [PRODUCT_GOVERNANCE.md](../PRODUCT_GOVERNANCE.md)
- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md)
- [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md)