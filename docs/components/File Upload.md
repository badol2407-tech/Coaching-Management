---
title: EduTrack File Upload Handbook
purpose: Define accessible, safe, and recoverable file selection and upload behavior.
scope: Attendance import files, Student and Teacher profile photos, Report and certificate uploads, Exam result imports, and Organization document uploads.
audience: Product Design, Engineering, Content, QA, Accessibility, and reviewers.
related_documents:
  - ../COMPONENT_SPECIFICATIONS.md
  - ../FORM_DESIGN_GUIDE.md
  - ../ACCESSIBILITY_STANDARDS.md
  - ../ENGINEERING_STANDARDS.md
  - ../ETHICAL_UX_GUIDELINES.md
  - ../STATE_SYSTEM.md
  - ./Progress.md
  - ./Button.md
review_frequency: Quarterly and before file type, size, privacy, or accessibility changes
owner: Product Design, Engineering, QA, and Security
version: 1.0.0
status: Binding component handbook
last_updated: 2026-08-01
normative_level: Binding standard
canonical_terms: File Upload, file input, drag and drop, file type, file size, upload, progress, error
---

# File Upload

## Purpose

Use a File Upload control when a user must provide a file as input to a workflow. In EduTrack, file uploads support Attendance data imports, profile photos, certificate and document uploads, Exam result imports, and Report attachments. The upload control must make file constraints, progress, success, and recovery clear at every step.

## Non-goals

Do not use File Upload for content that can be entered as structured text — use form fields. Do not silently accept files that exceed format or size limits; validate before or immediately after selection. Do not store uploaded files in the browser longer than necessary for the current task. Do not use drag-and-drop as the only interaction method; always provide a button-activated file dialog.

## Anatomy and variants

Provide a persistent label or heading naming the expected file and its purpose, a trigger button that opens the system file dialog, an optional drag-and-drop zone, accepted file types listed explicitly, maximum file size stated explicitly, a selected-file summary showing name and size before upload begins, a [Progress](./Progress.md) indicator during upload, a success confirmation after completion, and error and retry states. Support these variants:

- **Single file** — one file selected at a time; used for profile photos and certificate uploads.
- **Multi-file** — multiple files selected in one action; used for bulk Attendance imports or document batches.
- **Drag-and-drop zone** — a droppable area supplementing the button trigger; used when batch uploads benefit from visual staging. The zone is decorative enhancement; the button is the primary control.
- **Inline preview** — image files show a thumbnail after selection; used for profile photos before confirming the upload.

## States and behavior

Support idle, focused, file-selected, uploading, success, error, and canceled states.

- **File selection:** Opening the file dialog does not begin uploading. The user reviews the selected file name and size before confirming. The confirm action is a named [Button](./Button.md): "Upload attendance file" not "Upload."
- **Validation before upload:** Type and size constraints are checked immediately after selection. An invalid file shows an error with the specific reason: "Only CSV files are accepted. The selected file is an XLSX file." The invalid file is not uploaded; the user can reselect.
- **Upload progress:** Show a [Progress](./Progress.md) component with file name, bytes or percent complete, and an option to cancel. Do not navigate away from the page while upload is in progress without a warning.
- **Success:** Confirm the upload with the file name, upload timestamp, and the next available action (preview, process, replace). Do not silently succeed without confirmation.
- **Error and retry:** Identify the failure reason when possible ("File is too large — maximum is 5 MB," "Network error — upload interrupted at 60%."). Provide a retry action that restarts from the point of interruption where the backend supports resumption, or from the beginning otherwise. Preserve the selected file reference so the user does not need to reselect.
- **Sensitive files:** Profile photos and identity documents follow [ETHICAL_UX_GUIDELINES.md](../ETHICAL_UX_GUIDELINES.md) and [SECURITY_UX.md](../SECURITY_UX.md) — explain who can see the file, how long it is stored, and how it can be removed.

## Accessibility and responsive behavior

The file input is activated by a visible [Button](./Button.md). The native `<input type="file">` is associated with a persistent label. Drag-and-drop zones have `aria-label` describing their function and visually indicate drag-over state without relying on color alone. Progress updates are announced via a live region. Error messages are associated with the upload control.

Touch devices may not support drag-and-drop — the button trigger must always work. Touch targets meet 44×44 CSS pixel minimums. At narrow viewports, multi-file staging lists stack vertically. Follow [RESPONSIVE_SYSTEM.md](../RESPONSIVE_SYSTEM.md) and [MOBILE_UX_GUIDE.md](../MOBILE_UX_GUIDE.md).

## Content and examples

Label: "Attendance import file." Accepted types: "CSV files only." Size limit: "Maximum file size: 5 MB." Selected file: "batch-a-july-2026.csv — 48 KB." Progress: "Uploading batch-a-july-2026.csv — 60% complete." Success: "batch-a-july-2026.csv uploaded successfully — 14 July 2026, 10:45 am. Review imported records." Error: "Upload failed — network interrupted at 60%. Retry upload."

## Review evidence

Verify button trigger opens file dialog without drag-and-drop; invalid file type and size are rejected before upload with a specific reason; upload progress shows file name, percent, and cancel option; page navigation during upload prompts a warning; success confirmation names the file and provides a next action; error provides the reason and retry; sensitive files explain visibility and removal; drag-and-drop zone has an accessible label; live region announces progress and completion; narrow viewport provides adequate touch targets; zoom to 200% keeps label, trigger, progress, and error visible.

See [FORM_DESIGN_GUIDE.md](../FORM_DESIGN_GUIDE.md), [ENGINEERING_STANDARDS.md](../ENGINEERING_STANDARDS.md), and [ETHICAL_UX_GUIDELINES.md](../ETHICAL_UX_GUIDELINES.md).
