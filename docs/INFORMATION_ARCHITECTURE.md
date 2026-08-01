# EduTrack Information Architecture

**Status:** Normative product structure  
**Owner:** Product, Design, and Engineering  

Information architecture defines how EduTrack names, groups, scopes, and exposes information. It must scale from daily coaching work to future enterprise modules without forcing users to understand internal storage or permission models.

## Organizing model

Use four stable dimensions:

1. **Role:** super administrator, organization administrator, Teacher, Student, and future authorized roles.
2. **Object:** Student, Teacher, batch, Attendance record, Fee, Exam, Report, Notification, Profile, or organization.
3. **Task:** view, create, review, correct, communicate, configure, export, or analyze.
4. **Scope:** organization, program, batch, class, subject, date range, or individual record.

Every page and API-backed view must make its current role, object, task, and scope discoverable.

## Naming standards

- Use one canonical term per object. Do not alternate between “learner” and “Student” in the interface unless a specific audience requires it.
- Use verbs for actions: “Record payment,” “Mark attendance,” “Publish results,” “Export report.”
- Use nouns for destinations: “Students,” “Teachers,” “Attendance,” “Fees,” “Exams,” “Reports,” “Analytics,” “Notifications,” “Organization Management,” and “Profile.”
- Preserve user-facing names when data moves between Dashboard, Search, Filters, mobile, Notifications, and Reports.
- Expose internal IDs only as supporting identifiers, never as the primary identity.

## Information hierarchy

The default hierarchy is:

1. Current user goal and page identity.
2. Scope and freshness.
3. Primary object or decision.
4. Required action and relevant status.
5. Supporting detail.
6. History, audit, and advanced configuration.

**Examples:** Dashboard opens with operational scope and exceptions, not decorative metrics. A Student page leads with identity and status before secondary metadata. Fees place balance and payment state before history. Reports place filters and freshness before chart interpretation. AI places generated status and source context before suggestions.

## Classification rules

Group information by user questions:

- **Who or what is this?** Student, Teacher, Profile, organization identity.
- **What is happening?** Attendance, Fees, Exams, Notifications, current Dashboard state.
- **What should I do?** Tasks, exceptions, approvals, corrections.
- **Why does it matter?** Reports, Analytics, trends, comparison, uncertainty.
- **How is it configured?** Organization Management, permissions, integrations, Authentication.

Do not mix identity, financial, educational, and permission data merely because they belong to the same database record. Access and task context determine what is shown.

## Scope and filtering

The active scope must be visible and persistent. A Report or Analytics view must show organization, batch, date range, and applied Filters. Search must state what it searches and how many results match. Mobile views may collapse scope visually but may not remove it semantically.

## Future-module rule

New enterprise modules must declare:

- the object vocabulary they introduce;
- the roles that can see and change it;
- the parent scope;
- relationships to existing Students, Teachers, Attendance, Fees, Exams, Reports, Notifications, Profile, and organization records;
- the Dashboard, Search, Filter, and mobile entry points;
- the audit and retention requirements.

If a new module cannot explain these relationships, it is not ready for navigation or production design.

See [NAVIGATION_STANDARDS.md](./NAVIGATION_STANDARDS.md), [FORM_DESIGN_GUIDE.md](./FORM_DESIGN_GUIDE.md), and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).