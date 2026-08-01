# EduTrack Accessibility Standards

**Status:** Release gate  
**Owner:** Engineering, Product Design, and QA  
**Target:** WCAG 2.2 AA as a minimum, with stronger requirements where safety, financial, educational, or privacy consequences justify them.

Accessibility is part of correctness. A feature is not complete if a user cannot access, understand, operate, or recover from it because of disability, device, input method, language, bandwidth, or temporary circumstance.

## Non-negotiable standards

### Perceivable information

- Text and meaningful UI must meet WCAG 2.2 AA contrast; do not use color alone for Attendance, Fee, Exam, Notification, or Report status.
- Provide text alternatives for meaningful images, charts, icons, and AI-generated visual content. Decorative media has an empty alternative.
- Charts and Analytics must provide a data table or equivalent text summary, including scope, date range, units, and limitations.
- Content must remain usable at 200% zoom and with text enlarged without loss of task access.
- Do not convey a loading, success, warning, or error state only through color, motion, sound, or position.

### Operable interaction

- All functionality works with keyboard alone, including Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Filters, Notifications, Authentication, and Organization Management.
- Focus is visible, logical, not obscured, and not trapped except inside an intentionally modal dialog.
- Touch targets are at least 44×44 CSS pixels with safe separation; primary mobile actions prefer 48×48.
- No essential behavior depends on hover, drag, precision pointer movement, or a custom gesture.
- Provide skip links or equivalent landmarks; use semantic headings, navigation, main, search, and form regions.
- Respect reduced motion and do not flash content or create seizure risk.

### Understandable content and behavior

- Form fields have persistent, programmatically associated labels, instructions, constraints, and errors.
- Error messages identify the field or object, explain the issue, preserve safe input, and state the next step.
- Authentication supports accessible password entry, recovery, session expiry, and error handling without exposing sensitive information.
- Permission changes, Fee actions, Exam publishing, Report exports, and AI actions state scope and consequence before confirmation.
- Use plain, consistent language; define domain terms and do not use icons as the only labels.

### Robust implementation

- Use semantic HTML before ARIA. ARIA must accurately reflect the interaction and state.
- Names, roles, values, expanded state, selected state, disabled state, and live updates must be available to assistive technology.
- Dynamic updates such as Attendance saves, Fee confirmations, Report completion, Notifications, and AI output must announce meaningful state without excessive interruption.
- Test with current screen readers, keyboard navigation, zoom, mobile accessibility services, high contrast, and reduced motion.

## Domain acceptance examples

| Surface | Required evidence |
| --- | --- |
| Dashboard | Heading hierarchy, keyboard reachability, readable chart summary, no status conveyed by color only |
| Students and Teachers | Search labels, row names, pagination or lazy-load status, accessible detail and edit actions |
| Attendance | Status text and accessible names, bulk-action scope, saved/failed announcements, no precision-only controls |
| Fees | Amount and currency text, accessible confirmation, errors that do not imply payment, receipt access |
| Exams | Subject and result relationships available nonvisually, publish consequence and correction path |
| Reports and Analytics | Scope, freshness, units, table or text alternative, export status, keyboard filter flow |
| Notifications | Unread status and meaning exposed semantically, dismissible nonessential alerts |
| Authentication | Keyboard-complete login and recovery, visible errors, session and lockout guidance |
| Organization Management and Profile | Role and permission impact, required/optional labels, privacy-aware disclosure |
| Search and Filters | Named controls, applied-filter summary, clear action, no hidden state |
| Mobile | Reflow without loss of content or action, no horizontal scroll for essential tasks, platform back behavior |
| AI features | Generated status, source/context, uncertainty, review action, and accessible edit/override path |

## Testing and exceptions

Automated checks are necessary but insufficient. Each release must combine automated scanning, keyboard review, screen-reader sampling, zoom/reflow testing, and realistic task testing with representative data.

An exception requires:

1. A written reason and affected users.
2. Evidence that the exception does not block essential work.
3. A safer alternative or equivalent access path.
4. An owner and expiry date.
5. Approval from Accessibility and Product Design.

See [INTERACTION_DESIGN.md](./INTERACTION_DESIGN.md), [MOBILE_UX_GUIDE.md](./MOBILE_UX_GUIDE.md), and [REVIEW_CHECKLISTS.md](./REVIEW_CHECKLISTS.md).