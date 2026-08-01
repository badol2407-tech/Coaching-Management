# EduTrack Design System Guide

**Status:** Normative system governance  
**Owner:** Design Systems, Product Design, Engineering, and QA  

The design system is a shared language for structure, semantics, accessibility, interaction, and implementation. It exists to reduce inconsistency and make safe product evolution easier—not to prevent useful domain-specific design.

## System layers

1. **Foundations:** typography, color, spacing, elevation, radius, motion, icons, and responsive tokens.
2. **Primitives:** buttons, inputs, links, focus rings, surfaces, layout, and status indicators.
3. **Components:** tables, dialogs, tabs, menus, charts, notifications, forms, and navigation.
4. **Patterns:** Attendance marking, Fee collection, Report filters, Exam publishing, Profile editing, Authentication recovery, and AI review.
5. **Product compositions:** Dashboard, Students, Teachers, Reports, Analytics, Organization Management, and future modules.

Do not skip a layer by creating one-off styles inside a product page.

## Contribution rules

Every new component or token must include:

- semantic purpose and non-goals;
- supported states;
- roles and permissions relevant to it;
- keyboard and screen-reader behavior;
- mobile and zoom behavior;
- content and localization constraints;
- examples in at least two EduTrack modules;
- test and review evidence;
- migration or deprecation plan.

## Semantic tokens

Components consume semantic tokens, not raw color or spacing values. Token names should describe role or intent. A change to a token must be reviewed for Dashboard, Students, Teachers, Attendance, Fees, Exams, Reports, Analytics, Notifications, Authentication, Organization Management, Profile, Search, Filters, mobile, and AI surfaces where it is used.

## System quality gates

- Meet accessibility standards before visual acceptance.
- Maintain visual and behavioral consistency across roles.
- Preserve user control and clear system status.
- Test realistic density, long text, missing data, localization, slow networks, reduced motion, and high contrast.
- Document breaking changes and provide migration guidance.

## Measures

- Shared patterns are reused rather than forked.
- Component behavior is identical across equivalent modules unless an exception is documented.
- Design and code sources remain synchronized.
- Deprecated components have owners, dates, and replacement guidance.

See [COMPONENT_SPECIFICATIONS.md](./COMPONENT_SPECIFICATIONS.md), [PATTERN_LIBRARY.md](./PATTERN_LIBRARY.md), and [PRODUCT_GOVERNANCE.md](./PRODUCT_GOVERNANCE.md).