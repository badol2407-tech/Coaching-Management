---
title: EduTrack Fees Module
purpose: Define scoped Fee balances, assignment, payment recording, adjustments, receipts, review, and financial reporting for authorized Users.
scope: Fee definitions and assignments, balances, installments, payments, adjustments, reversals, receipts, summaries, imports, exports, and authorized relationships to Students, Classes, Academic Sessions, Reports, Analytics, Notifications, Dashboard, and Organization.
audience: Product, Design, Engineering, Security, Privacy, Data, QA, Accessibility, Operations, Finance, and reviewers.
related_documents:
  - ../INFORMATION_ARCHITECTURE.md
  - ../FORM_DESIGN_GUIDE.md
  - ../SEARCH_EXPERIENCE.md
  - ../FILTER_SYSTEM.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../PERMISSION_DESIGN.md
  - ../SECURITY_UX.md
  - ../STATE_SYSTEM.md
  - ../NOTIFICATION_SYSTEM.md
  - ../PATTERN_LIBRARY.md
  - ../AI_UX_GUIDELINES.md
  - ../INTERNATIONALIZATION.md
  - ../REVIEW_CHECKLISTS.md
review_frequency: Quarterly and after a Fee, payment, Role, privacy, policy, or workflow change
owner: Product, Product Design, Engineering, Security, Privacy, Data, Operations, Finance, and Governance
version: 1.0.0
status: Active core module specification
last_updated: 2026-08-01
normative_level: Module behavior specification subordinate to canonical handbooks
canonical_terms: Fees, Fee, Fee balance, payment, installment, adjustment, reversal, receipt, Student, Class, Academic Session, Organization, Workspace, Role, Permission, Search, Filters, Reports, Analytics, Notifications, AI Assistant
---

# Fees

## Metadata

This module is an active core module specification. Its owner, scope, review cadence, version, status, normative level, canonical terms, and related documents are defined in the frontmatter above. It is subordinate to the linked canonical handbooks and does not create duplicate financial, authorization, security, accessibility, or reporting standards.

## Purpose

Fees is the scoped source-of-truth workspace for financial obligations, balances, payments, installments, adjustments, reversals, and receipts associated with an authorized Organization and Student context. It helps authorized Users understand what was billed, what was collected, what remains outstanding, and what is unresolved without implying payment success before durable confirmation.

The module applies the shared rules in [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), [SECURITY_UX.md](../SECURITY_UX.md), [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), and [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md). Those documents own the general financial-input, authorization, security, table, locale, and recovery standards.

## Scope

### Included

- Fee identity, Organization, Workspace, Student, Class, Academic Session, due context, amount, currency, and lifecycle.
- Fee assignment, installment plans, payment recording, receipts, adjustments, reversals, and review history.
- Billed, collected, outstanding, overdue, unresolved, pending, partial, paid, void, reversed, and other policy-defined states.
- Scoped Fee lists, Student history, summaries, exports, imports, exceptions, freshness, and audit context.
- Authorized relationships to Students, Classes, Academic Sessions, Reports, Analytics, Notifications, Dashboard, and Organization.

### Excluded

- Student identity, Class membership, Subject catalog, or Academic Session as a source of truth.
- Treating an attempted payment, client response, or Notification as confirmed collection.
- Silent deletion, retroactive rewriting, unauthorized disclosure, or cross-Organization aggregation.
- Financial, legal, credit, disciplinary, or educational decisions inferred from a Fee state.
- AI-generated amounts, payment approvals, reversals, or Permission changes without explicit authorized human action.

## Users & Roles

| Role | Fees responsibility | Default information scope |
| --- | --- | --- |
| Super administrator | Review authorized aggregate platform or Organization signals and support cases. | Explicitly authorized aggregate scope; minimize Student-level financial data. |
| Organization administrator | Configure, assign, review, record, adjust, reverse, import, export, and govern Fees. | Active Organization and authorized Workspace, Academic Session, Class, and Student scope. |
| Teacher | View permitted Fee status when required for assigned operational work. | Assigned Class, Student, and explicitly shared Fee context; no payment administration by default. |
| Student | Review own balances, payment history, receipts, and approved correction or support paths. | Own records and explicitly shared Organization content. |
| Future authorized Role | Use only Fee actions declared by its approved Permission contract. | Explicit scope and deny-by-default. |

## Business Rules

1. Fees is the canonical destination; use “Fee” for the obligation or record, “Fee balance” for the current financial position, and “record payment” for the action.
2. Every Fee identifies Organization, Workspace where applicable, Student, Class or program context where applicable, Academic Session, amount, currency, source, owner, and status before it is shown as actionable.
3. Billed, collected, outstanding, overdue, pending, unresolved, adjusted, void, and reversed values remain distinct. A summary must not collapse them into one unexplained total.
4. An installment may be pending, partial, or paid only when the source transaction and policy support that state. The module does not invent universal due-date, grace-period, interest, or rounding thresholds.
5. A payment attempt, client-side success message, duplicate submission, or Notification is not proof of collection. Durable acceptance, receipt identity, actor, timestamp, amount, currency, and source must be visible.
6. Adjustments and reversals preserve the prior value, reason, actor, timestamp, approval requirement, and affected summaries. They do not silently erase history.
7. Currency, locale, decimal precision, date, timezone, and number formatting follow [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md); display formatting must not change stored meaning.
8. Imports and bulk assignment validate every row, preserve accepted and rejected results, and never broaden Organization, Workspace, Academic Session, Class, or Student scope.
9. Reports and Analytics identify denominator, period, freshness, exclusions, source, and unresolved data. They do not turn Fee status into a ranking or causal claim.
10. Notifications communicate relevant financial state without exposing protected details or creating artificial urgency.
11. AI Assistant output is generated and reviewable; it cannot record payment, approve adjustment, reverse a Fee, send a consequential Notification, or export financial data without explicit authorized human action.

## User Journeys

### Organization administrator: assign a Fee

1. Open Fees and confirm Organization, Workspace, Academic Session, Class, Student, currency, and assignment scope.
2. Define the approved Fee or installment context and review required fields, existing balances, duplicate signals, and affected Students.
3. Preview the assignment, selected count, billed effect, actor, and recovery path.
4. Confirm the consequential operation and observe pending, partial, success, or failure status.
5. Open the named Fee results or recoverable row-level outcome and audit entry.

### Organization administrator: record a payment

1. Search within authorized Organization, Workspace, Academic Session, Student, Fee, and status scope.
2. Open the Fee detail and review billed, collected, outstanding, pending, unresolved, and prior payment values.
3. Enter payment amount, currency, date, source, reference, receipt details, and reason where required.
4. Review duplicate signals, resulting balance, actor, visibility, and consequence before confirmation.
5. Submit and verify durable receipt, pending confirmation, conflict, or recoverable failure without losing context.

### Organization administrator: adjust or reverse a Fee

1. Open the authorized Fee history and identify the source value, current balance, prior corrections, and related summaries.
2. Enter the approved adjustment or reversal reason and review affected installments, Reports, Analytics, Notifications, and audit behavior.
3. Confirm the object, scope, financial effect, actor, approval requirement, and recovery path.
4. Verify the named result and preserved history.

### Student: review Fees

1. Open Fees and confirm own Student, Organization, Workspace, Academic Session, and date scope.
2. Review Fee identity, billed amount, collected amount, outstanding amount, installment state, receipt, freshness, and limitations.
3. Use an approved support, correction, or receipt path without modifying source financial records.

## Information Architecture

### Fees collection

Page identity and active scope → Search and Filters → billed, collected, outstanding, overdue, pending, and unresolved summary → Fee table → permitted actions and freshness.

### Fee detail

Fee identity and Student context → status and balance breakdown → installments and payment history → adjustments, reversals, receipts, Notifications, audit, and permitted actions.

### Financial summary

Scope and period → measure, currency, denominator, source, freshness, exclusions, and unresolved data → table or chart → Report or export action with preserved context.

Do not place private Profile data, inferred financial risk, or unrelated academic judgments into a Fee ledger merely because records are related in storage.

## Navigation Flow

`Sidebar > Fees` opens the authorized Fee collection. From Fees:

- Fee row or Search result → Fee detail;
- Fee detail → Student, Class, Academic Session, Reports, Analytics, Notifications, or Dashboard with scope preserved;
- assign, record payment, adjust, reverse, import, export, or receipt action → review → confirmation → result or preserved list scope;
- Dashboard exception → Fees with originating Organization, Workspace, Academic Session, Class, Student, date, and Filter context;
- browser back or breadcrumb → previous safe list and query state.

Deep links recheck authorization and do not confirm protected Student or Fee existence. Mobile preserves Fee identity, balance state, scope, primary action, and recovery.

## Screen Specifications

### Fees collection

- Named Search and Filters identify the Fee dataset and active Organization, Workspace, Academic Session, Class, Student, date, and status scope.
- Summary values distinguish billed, collected, outstanding, overdue, pending, and unresolved amounts with currency and freshness.
- Each row identifies Student or approved record identity, Fee context, amount state, due context, freshness, and permitted action.
- No balance, defaulter count, or status is conveyed by color or a decorative badge alone.

### Fee detail and payment history

- Fee identity, Student scope, currency, source, lifecycle, balance breakdown, and freshness lead the page.
- Installments and payments are separate from adjustments and reversals; each has amount, currency, status, source, actor, timestamp, and history where authorized.
- Payment form preserves safe input, validates duplicate and scope signals, and presents consequence review before submission.

### Adjustment, reversal, and receipt review

- Reason, affected amount, current and resulting balance, approval requirement, actor, visibility, and recovery are explicit.
- Receipt status distinguishes pending, accepted, failed, void, and unavailable outcomes without relying on color.
- Exports and receipts preserve scope, currency, units, date, limitations, and sensitive-data handling.

### Fee import and summary

- File purpose, accepted type, size, mapping, Organization, Workspace, Academic Session, target scope, progress, row errors, partial result, and retry are explicit.
- Summary views provide a table or text equivalent and identify denominator, source, period, freshness, exclusions, and unresolved values.

## Component Composition

Reuse:

- [Sidebar](../components/Sidebar.md), [Top Navigation](../components/Top%20Navigation.md), [Breadcrumb](../components/Breadcrumb.md), and [Tabs](../components/Tabs.md).
- [Search Field](../components/Search%20Field.md), [Select](../components/Select.md), [Multi Select](../components/Multi%20Select.md), [Autocomplete](../components/Autocomplete.md), [Date Picker](../components/Date%20Picker.md), [File Upload](../components/File%20Upload.md), [Text Field](../components/Text%20Field.md), and [Textarea](../components/Textarea.md).
- [Table](../components/Table.md) for ledgers and histories, [Data Grid](../components/Data%20Grid.md) for approved bulk assignment, [Charts](../components/Charts.md), and [Pagination](../components/Pagination.md).
- [Card](../components/Card.md), [List](../components/List.md), [Badge](../components/Badge.md), [Tag](../components/Tag.md), [Chip](../components/Chip.md), [Drawer](../components/Drawer.md), [Dialog](../components/Dialog.md), and [Menu](../components/Menu.md).
- [Button](../components/Button.md), [Link](../components/Link.md), [Toast](../components/Toast.md), [Banner](../components/Banner.md), [Alert](../components/Alert.md), [Progress](../components/Progress.md), [Skeleton](../components/Skeleton.md), [Empty State](../components/Empty%20State.md), and [Error State](../components/Error%20State.md).

Use the Fees search/list, structured data, bulk operation, field composition, consequential confirmation, reviewable AI, empty, loading/recovery, and mobile patterns in [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md).

## Permissions

- Read Fee, assign, record payment, view receipt, adjust, reverse, approve, import, export, view sensitive details, view history, and administer Fees are separate capabilities.
- All capabilities are scoped by Organization, Workspace, Academic Session, Class, Student, Fee, and Role.
- Teachers cannot record payment, adjust, reverse, or export financial records unless an explicit approved Permission grants that capability.
- Bulk assignment, payment recording, adjustment, reversal, import, export, and sensitive-detail access require explicit capability and consequence review.
- Authorization is rechecked for collection queries, detail reads, direct links, caches, imports, exports, summaries, Notifications, and AI context.
- Permission denial does not reveal protected Student, Fee, balance, payment, or receipt existence.

## Validation Rules

- Organization, Workspace, Student, Fee, Academic Session, currency, source, amount, date, and responsible Role must be valid before a financial action.
- Amounts, currency, precision, sign, installment relationship, duplicate reference, and resulting balance are validated server-side.
- Payment, adjustment, reversal, import, and export requests validate authorization and scope independently of client-supplied parameters.
- Duplicate payment references, stale balances, concurrent edits, partial saves, and conflicting adjustments require visible conflict handling.
- A Fee summary cannot present collected or paid status while the source transaction remains pending or unresolved.
- Import rows validate identity, scope, amount, currency, date, duplicate, existing balance, and authorization conditions.

## Empty / Loading / Error States

Follow [STATE_SYSTEM.md](../STATE_SYSTEM.md), [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md), [EMPTY_STATES.md](../EMPTY_STATES.md), [LOADING_STATES.md](../LOADING_STATES.md), and [ERROR_HANDLING.md](../ERROR_HANDLING.md).

- `initial`: request Organization, Workspace, Academic Session, and Fee scope before querying.
- `loading`: preserve scope, Search, Filters, safe form input, and ledger structure.
- `ready`: show Fee identity, currency, balance breakdown, freshness, and permitted actions.
- `empty`: distinguish no Fees, no assigned balances, no matching Filters, no payment history, no access, and unavailable service.
- `partial`: identify accepted and failed rows, available and missing summaries, or recorded and unresolved payment regions.
- `stale`: expose balance freshness and require refresh or conflict review before consequential commit.
- `pending`: name the payment, adjustment, reversal, or import accepted but not final.
- `success`: name the Fee, affected amount, currency, receipt or result, and next action.
- `error`: preserve safe input, Search, Filters, and file review; distinguish validation, duplicate, conflict, authorization, network, and service failure.
- `unauthorized` and `disabled`: explain the available capability or support path without protected-data disclosure.

## Notifications

Fee Notifications may communicate an assigned balance, payment result, receipt availability, due context, approved adjustment, failed import, or required review. Delivery, preference, read state, privacy, idempotency, and retention follow [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md). Notifications identify source Fee, scope, time, consequence, and action without exposing unrelated Student data or creating artificial urgency.

## Accessibility

Apply [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md) and [ACCESSIBILITY_TESTING.md](../ACCESSIBILITY_TESTING.md):

- Fee identity, Student scope, amount, currency, balance state, payment state, validation, receipt, and freshness are available through text and semantics.
- Tables and Data Grids have captions, row identity, keyboard operation, programmatic headers, and focus recovery.
- Payment and adjustment dialogs state object, scope, effect, actor, approval, and recovery; focus is trapped and restored appropriately.
- Currency, negative values, decimal separators, dates, translated labels, 200% zoom, 320 CSS pixel reflow, screen readers, touch, and reduced motion are tested.
- Pending, partial, paid, overdue, reversed, unresolved, unauthorized, and error states never rely on color, icon, position, or sound alone.

## AI Behavior

The AI Assistant may summarize authorized Fee patterns, explain a balance breakdown, or draft a support explanation. It must label generated content, identify source Fees, Student or Class scope, period, currency, freshness, uncertainty, missing data, limitations, and review controls. It must not invent amounts, classify a Student as financially risky, record payment, approve an adjustment, reverse a Fee, send a consequential Notification, or export financial data without explicit authorized human review and action.

## Security

Fees is Organization-, Workspace-, Academic Session-, Class-, Student-, Fee-, and Role-scoped. Enforce authorization at assignment, collection queries, record reads and writes, caches, imports, exports, receipts, summaries, Notifications, deep links, audit, and AI boundaries. Mask sensitive payment details by default, protect files and exports, avoid identifiers in URLs or logs where not required, and audit assignment, payment, adjustment, reversal, approval, import, and export actions under [SECURITY_UX.md](../SECURITY_UX.md), [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md), and [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md).

## Performance

Load Fee identity, scope, and balance summary before secondary history or charts; paginate large ledgers; cancel obsolete Search and Filter requests; preserve stable table structure; and acknowledge staged or slow payment and import work. Measure collection open, balance refresh, payment submission, adjustment, bulk assignment, import, summary, export, receipt, and recovery with the shared engineering performance process; this module does not create a competing numeric threshold.

## Acceptance Criteria

- [ ] Authorized Users can open the correct Fee within explicit Organization, Workspace, Academic Session, Class, Student, date, currency, and Role scope.
- [ ] Fee views distinguish billed, collected, outstanding, overdue, pending, partial, paid, reversed, and unresolved values with source and freshness.
- [ ] Payment, adjustment, reversal, import, receipt, and export workflows state permission, scope, consequence, actor, audit, and recovery.
- [ ] Financial records remain distinct from Student identity, Class membership, Attendance, Exams, Reports, Analytics, and inferred outcomes.
- [ ] Empty, stale, pending, unauthorized, validation, duplicate, conflict, and service-failure paths preserve safe intent.
- [ ] Approved components, canonical vocabulary, Notifications, AI behavior, privacy, retention, currency, and audit rules are used without duplicate standards.
- [ ] Keyboard, screen-reader, zoom, localization, mobile, reduced-motion, performance, and financial-data evidence requirements are documented.

## Validation Checklist

- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Fee scope, Students, Classes, Academic Sessions, Roles, Permissions, Organization, Workspace, and cross-module impact.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: Search, Filters, ledgers, Data Grid, tables, payment, adjustment, reversal, receipt, import, export, summary, and component composition.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: currency, precision, duplicate prevention, stale balance, concurrent edit, partial save, retry, rollback, and recovery.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: privacy, direct access, cache, file, Notification, AI, audit, retention, receipt, and export evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: keyboard, screen reader, contrast, localization, responsive, mobile, reduced-motion, and financial-format evidence.
- [ ] Pass / Fail / Not applicable with reason / Exception with owner and expiry: performance, reliability, monitoring, migration, and incident ownership.
- [ ] Evidence links, known gaps, owner, mitigation, due date, expiry, approver, and decision are recorded under [QUALITY_GATES.md](../QUALITY_GATES.md).

## References

- [INFORMATION_ARCHITECTURE.md](../INFORMATION_ARCHITECTURE.md)
- [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md)
- [SEARCH_EXPERIENCE.md](../SEARCH_EXPERIENCE.md)
- [FILTER_SYSTEM.md](../FILTER_SYSTEM.md)
- [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md)
- [PERMISSION_DESIGN.md](../PERMISSION_DESIGN.md)
- [SECURITY_UX.md](../SECURITY_UX.md)
- [STATE_SYSTEM.md](../STATE_SYSTEM.md)
- [NOTIFICATION_SYSTEM.md](../NOTIFICATION_SYSTEM.md)
- [PATTERN_LIBRARY.md](../PATTERN_LIBRARY.md)
- [AI_UX_GUIDELINES.md](../AI_UX_GUIDELINES.md)
- [INTERNATIONALIZATION.md](../INTERNATIONALIZATION.md)