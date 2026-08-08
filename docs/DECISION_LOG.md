---
title: EduTrack Documentation Decision Log
purpose: Record durable documentation architecture, authority, naming, and priority decisions.
scope: Documentation governance decisions and their rationale; not implementation task history.
audience: Product Governance, Product, Design, Engineering, Security, Privacy, AI Governance, and reviewers.
related_documents:
  - ./INDEX.md
  - ./DOCUMENTATION_MAP.md
  - ./PRODUCT_CONSTITUTION.md
  - ./PRODUCT_GOVERNANCE.md
  - ./GLOSSARY.md
review_frequency: Quarterly and when a decision is superseded
owner: Product Governance Council
version: 1.0.0
status: Active decision record
last_updated: 2026-08-01
normative_level: Governance record
canonical_terms: decision, authority, source of truth, precedence, canonical term, exception
---

# EduTrack Documentation Decision Log

This log records durable decisions that future contributors should preserve unless a newer decision explicitly supersedes them. Each decision includes the reason so reviewers can evaluate edge cases.

## Decision record format

Each entry states the date, decision, rationale, affected documents, and review trigger. Implementation details belong in code history; durable documentation rules belong here.

## Decisions

### 2026-08-01 — Establish a layered documentation hierarchy

- **Decision:** Product principles live in the Constitution; governance lives in Product Governance; release gates own binding quality requirements; domain handbooks explain implementation; review handbooks provide evidence prompts.
- **Why:** A single flat collection of handbooks made it unclear which document won when rules overlapped.
- **Affected documents:** Constitution, Product Governance, Accessibility, Ethical UX, Engineering, AI UX, all supporting handbooks.
- **Review trigger:** Revisit when a new authority class or organization-wide standard is introduced.

### 2026-08-01 — Keep the Constitution and UX Laws as complementary documents

- **Decision:** The Constitution retains the detailed principles and rationale already established; UX Laws is the review-oriented companion. UX Laws is advisory and cannot override a release gate.
- **Why:** Existing material must remain available and meaning must not be silently removed, while duplicate authority must be resolved.
- **Affected documents:** Product Constitution, UX Laws, Product Governance.
- **Review trigger:** Revisit if the UX-law chapters are formally split into separate canonical standards.

### 2026-08-01 — Accessibility, safety, control, trust, clarity, performance, convenience

- **Decision:** Resolve conflicts in that order.
- **Why:** People must be able to access and safely understand consequential work before the product optimizes speed or convenience.
- **Affected documents:** Product Constitution, Product Governance, Accessibility, Ethical UX, UX Laws, Review Checklists.
- **Review trigger:** Revisit after a policy, legal, safety, or accessibility requirement changes.

### 2026-08-01 — Adopt canonical product vocabulary

- **Decision:** Use Dashboard, Sidebar, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Organization, Profile, Settings, Notifications, Search, Filters, AI Assistant, Enterprise Module, Permission, Role, and Workspace as the canonical terms.
- **Why:** Consistent naming reduces cognitive load, improves Search and localization, and makes documentation cross-references reviewable.
- **Affected documents:** Glossary, Information Architecture, Copywriting, Navigation, and all handbooks.
- **Review trigger:** Revisit when a new product object or distinct business role is approved.

### 2026-08-01 — Require metadata on every handbook

- **Decision:** Every handbook carries title, purpose, scope, audience, related documents, review frequency, owner, version, status, last updated, normative level, and canonical terms.
- **Why:** Ownership and reviewability cannot depend on implicit context or a file’s opening paragraph.
- **Affected documents:** Every Markdown handbook under `docs/`.
- **Review trigger:** Revisit when the documentation toolchain adopts a machine-readable schema that supersedes this header contract.