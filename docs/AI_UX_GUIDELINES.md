# EduTrack AI UX Guidelines

**Status:** Normative safety and interaction standard  
**Owner:** Product, AI Governance, Engineering, Security, and Design  

AI in EduTrack is an assistant, not an authority. It may summarize, organize, search, draft, and surface patterns, but it must not silently decide a person's educational, financial, employment, access, or safety outcome.

## AI disclosure

Every AI feature must clearly state:

- that AI is involved;
- what input, records, or scope it used;
- what it can and cannot establish;
- whether the output is generated, retrieved, predicted, or recorded;
- how current the information is;
- what human review is required;
- how to correct, reject, report, or disable it.

**Examples:** An Attendance risk suggestion names the included dates and records; a Student summary states its source scope; a Fee assistant cannot imply payment acceptance; an Exam analysis labels inference; a Report narrative identifies generated text; an AI Notification explains why it was suggested.

## Human control

- AI must not create, modify, publish, delete, charge, notify, or change permissions without explicit authorized user action.
- High-impact actions require meaningful human review with enough context to disagree.
- Provide edit, regenerate, reject, undo, and report paths where applicable.
- Do not preselect a generated recommendation when doing so would create pressure or hidden consent.
- Preserve the original record when AI drafts are applied.

## Privacy and data minimization

Use only the data necessary for the stated task. Respect organization, role, Student, Teacher, Profile, Authentication, and record permissions. Do not expose one organization's data in Search, Filters, Dashboard, Reports, Analytics, or model context. Define retention and deletion behavior for prompts, outputs, feedback, and logs.

## Accuracy and uncertainty

Do not present generated content as verified fact. Show source records, confidence or uncertainty when meaningful, missing-data limitations, and a route to inspect the evidence. A low-confidence output should not merely use a softer color; it must explain what review is needed.

## Fairness and safety

Test AI across roles, languages, accessibility needs, data completeness, and representative Student and Teacher populations. Do not rank or label people using proxy attributes without a justified, reviewed purpose. Never use AI to manufacture engagement, fake Notifications, pressure Fee payment, or infer sensitive traits.

## AI-specific acceptance measures

- A user can identify AI output versus recorded data without opening a hidden panel.
- Every high-impact action has a human review and correction path.
- Prompt and output scopes are permission-checked.
- AI errors fail visibly and never fabricate a successful Attendance, Fee, Exam, Report, or Profile change.
- Evaluation includes accuracy, harmful false positives/negatives, privacy leakage, accessibility, latency, and drift monitoring.

See [AI Philosophy in PRODUCT_CONSTITUTION.md](./PRODUCT_CONSTITUTION.md), [ETHICAL_UX_GUIDELINES.md](./ETHICAL_UX_GUIDELINES.md), and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).