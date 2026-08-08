---
title: EduTrack Data Grid Handbook
purpose: Define interactive, editable, and high-density grid behavior for inline editing and bulk data operations.
scope: Attendance marking, bulk Fee entry, Exam result grids, mark-entry sheets, and batch record editing.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../TABLE_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../INTERACTION_DESIGN.md
  - ../STATE_SYSTEM.md
  - ./Table.md
  - ./Pagination.md
review_frequency: Quarterly and before inline editing, bulk, or accessibility changes
owner: Product Design, Design Systems, Engineering, and QA
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: Data Grid, cell, inline edit, row edit, column, sort, bulk action, commit, discard
---

# Data Grid

## Purpose

Use a Data Grid when users must view and edit multiple cells across multiple records in a single surface. The Data Grid differs from a [Table](./Table.md) by supporting cell-level or row-level inline editing, spreadsheet-style navigation, and bulk commit or discard. Use it when the edit workflow benefits from seeing surrounding records simultaneously.

## Non-goals

Do not use a Data Grid for read-only record display — use a [Table](./Table.md). Do not use it for a single-record edit — use a form. Do not use it when data is hierarchical with deeply nested relationships; the flat grid model does not express hierarchy clearly. Do not use it for records where every field change requires a consequence confirmation — those belong in a [Dialog](./Dialog.md)-based edit flow.

## Anatomy and variants

Provide a grid title and scope label, column headers with data type and unit, rows with individual cells, an edit commit or discard control, a bulk-action bar when multi-row selection is supported, and loading, empty, and error states. Support these variants:

- **Single-cell edit** — activating a cell opens an inline input; focus returns to the cell after commit.
- **Row edit** — activating a row switches all editable cells in that row to inputs; row-level save and discard are provided.
- **Bulk entry** — multiple cells across rows are editable simultaneously; a staged commit with preview and consequence summary precedes submission.
- **Read-only grid** — non-editable; used for large Exam result views or Report data snapshots.

## States and behavior

Support loading, populated, empty, error, editing, staged, saving, partial-success, and unauthorized states.

- **Cell activation:** Single click or Enter activates an editable cell. Escape discards unsaved input and returns focus to the cell without committing. Tab and Shift-Tab move between editable cells; arrow keys navigate in read-only mode.
- **Commit and discard:** Unsaved changes are visually distinguished from saved values. Committing a row or bulk set shows the change count and affected scope before submission. Partial failures identify the affected rows and preserve successfully saved rows.
- **Validation:** Cell-level validation is shown inline below the cell without displacing adjacent content. Cross-row validation (such as Exam total exceeding allowed maximum) is surfaced before the bulk commit step.
- **Column operations:** Sortable columns expose direction and are keyboard-operable. Column resizing is optional and must not obscure column labels or make cells unreachable.

## Accessibility and responsive behavior

Implement the ARIA grid or treegrid role as appropriate. Each cell is a gridcell; header cells use columnheader or rowheader. Editable cells must be reachable and activatable by keyboard without a pointing device. Validation messages are associated programmatically with the affected cell. Bulk-action controls are reachable from the keyboard and announce the affected count.

At narrow viewports, fall back to a row-edit [Drawer](./Drawer.md) rather than attempting to compress a multi-column grid. The transition preserves the identity of the record being edited. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [ACCESSIBILITY_STANDARDS.md](../ACCESSIBILITY_STANDARDS.md).

## Content and examples

Title the grid with type and scope: "Attendance sheet — Batch B, Science, 14 July 2026." Column headers identify the field and its unit: "Marks obtained (max 100)." Validation messages name the field and correction: "Marks for Priya Sharma exceed maximum (100). Enter 100 or less."

## Review evidence

Verify grid semantics are correct; keyboard navigation enters, edits, commits, and discards without a pointer; validation messages are associated with affected cells; partial saves identify failed rows and preserve successful ones; bulk commit shows affected scope before submission; column headers remain visible during scroll; the narrow-viewport fallback preserves row identity and edit access; zoom to 200% does not lose cell content or controls; screen reader announces cell values, column headers, and edit state changes.

See [TABLE_DESIGN_GUIDE.md](../TABLE_DESIGN_GUIDE.md), [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), and [REVIEW_CHECKLISTS.md](../REVIEW_CHECKLISTS.md).
