# EduTrack — Exhaustive Gap Report
> **Principal Architect · Senior SaaS Engineer · Product Manager · UX Expert · Security Engineer · AI Product Reviewer**  
> Generated: 2026-07-28 | Source: https://github.com/badol2407-tech/Coaching-Management  
> Compared against: NextJS-SMS-Template · Frappe Education · OpenEduCat · Moodle · openSIS · RosarioSIS · Fedena · shadcn/ui · MagicUI · Tremor · React-Bits · OriginUI · Framer Motion · GSAP

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Present and well-implemented |
| ⚡ | Partial / incomplete |
| ❌ | Missing entirely |
| 🔴 | Active risk / broken |
| **P0** | Critical — fix before any growth |
| **P1** | High impact — next sprint |
| **P2** | Medium — completeness |
| **P3** | Roadmap / nice-to-have |

---

# PART 1 — ATTENDANCE

## 1.1 Core Attendance

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Daily attendance marking | ✅ Present | — | — | Core |
| Batch-wise attendance | ❌ Missing | **P0** | 6h | Coaching centres run AM/PM batches — this is the primary attendance unit |
| Subject-wise / period-wise attendance | ❌ Missing | P1 | 14h | Multi-subject coaching needs per-subject tracking |
| **Attendance % per student** | ❌ Missing | **P0** | 4h | Without %, teachers can't flag low-attenders |
| Attendance % threshold alert | ❌ Missing | P1 | 6h | Auto-flag students below 75% |
| Bulk attendance marking (mark all present, then edit) | ❌ Missing | P1 | 8h | Teacher marks 30 students individually today |
| Attendance edit / correction log | ❌ Missing | P1 | 6h | Mistakes happen; no undo/audit trail |
| Attendance by date range report | ❌ Missing | P1 | 8h | Monthly/term attendance summary |
| Attendance heatmap calendar view | ❌ Missing | P1 | 10h | Visual pattern detection |
| Student leave application | ❌ Missing | P2 | 8h | Formal leave vs unexcused absence |
| **Auto-notify parent on absence** | ❌ Missing | **P0** | 10h | Critical — parents need to know same day |
| Export attendance (PDF / CSV / Excel) | ❌ Missing | P1 | 4h | Reporting to management / parents |
| Attendance analytics on dashboard | ⚡ Partial | P1 | 8h | Exists but no charts or trend lines |
| Late arrival tracking | ❌ Missing | P2 | 6h | Common in coaching centres |

## 1.2 Attendance Architecture Gap
**Current:** Single flat attendance record per student per date.  
**Needed:** Attendance scoped to `batch + subject + date + period` with a status enum `(present, absent, late, excused)` and a mandatory `markedBy` teacher ID.

---

# PART 2 — FEES & BILLING

## 2.1 Fee Collection

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Manual fee recording | ✅ Present | — | — | Core |
| **Fee structure templates** | ❌ Missing | **P0** | 10h | Admins recreate the same amounts every month |
| **Instalment / payment plan** | ❌ Missing | P1 | 12h | Many coaching centres collect in 2–3 instalments |
| **Fee defaulters list with filter** | ⚡ Partial | **P0** | 4h | Critical cash-flow visibility |
| **Automated fee reminders (email + SMS)** | ❌ Missing | **P0** | 12h | Manual follow-up is the biggest admin pain point |
| Online payment (Stripe / Razorpay) | ❌ Missing | P1 | 24h | Reduces collection overhead dramatically |
| Fee receipt PDF generation | ❌ Missing | P1 | 8h | Parents expect receipts |
| Discount / concession / scholarship | ❌ Missing | P2 | 10h | Common in coaching — sibling discount, merit |
| Late fee / penalty calculation | ❌ Missing | P2 | 8h | Automatic penalty after due date |
| Fee collection analytics (chart) | ⚡ Partial | **P0** | 6h | No chart; just a number |
| Batch-wise fee tracking | ❌ Missing | P1 | 6h | Fees differ by batch/course |
| Fee due date management | ❌ Missing | P1 | 6h | No due date stored on fee record |
| Multi-currency support | ❌ Missing | P3 | 20h | Future international markets |
| Partial payment recording | ❌ Missing | P2 | 8h | Student pays ₹2000 of ₹3500 due |
| Payment mode tracking | ⚡ Partial | P1 | 3h | Cash/UPI/card/cheque not always recorded |
| Fee history per student | ⚡ Partial | P1 | 4h | No complete timeline view |
| Bulk fee assignment | ❌ Missing | P1 | 8h | Assign fee to all students in a batch at once |

## 2.2 SaaS Billing (Platform Level)

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Subscription billing (Stripe)** | ❌ Missing | P1 | 30h | EduTrack has no monetisation mechanism |
| Plan definition (Free/Pro/Enterprise) | ❌ Missing | P1 | 8h | No pricing tiers defined |
| Plan limits enforcement (student count, etc.) | ❌ Missing | P1 | 14h | No guards on free plan usage |
| Billing portal (manage subscription) | ❌ Missing | P1 | 12h | Orgs can't change/cancel plan |
| Invoice generation for orgs | ❌ Missing | P2 | 10h | Orgs need GST invoices |
| Trial period management | ❌ Missing | P2 | 8h | No trial → paid conversion flow |
| Usage metering | ❌ Missing | P2 | 12h | No tracking of students added, logins, API calls |

---

# PART 3 — PARENT PORTAL

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Parent role / login** | ❌ Missing | **P0** | 10h | Parents are the paying decision-makers |
| **Guardian–student link in DB** | ❌ Missing | **P0** | 8h | No `parentId` field on student record |
| Parent sees child's attendance | ❌ Missing | P1 | 4h | Most-requested parent feature |
| Parent sees child's exam results | ❌ Missing | P1 | 4h | Core parent need |
| Parent sees fee status & history | ❌ Missing | P1 | 3h | Reduces "have I paid?" enquiries |
| Parent sees homework due | ❌ Missing | P1 | 3h | Reduces missed submissions |
| Parent sees timetable | ❌ Missing | P1 | 3h | Schedule visibility |
| Parent receives push / email notifications | ❌ Missing | P1 | 8h | Proactive engagement |
| Parent can pay fees online | ❌ Missing | P2 | 20h | Full-loop convenience |
| Parent–teacher messaging | ❌ Missing | P2 | 24h | Currently no async communication channel |
| Parent mobile-optimised view | ❌ Missing | P1 | 10h | Most parents on mobile |
| Multi-child view (parent with 2 children) | ❌ Missing | P2 | 8h | Common in coaching centres |

---

# PART 4 — HOMEWORK & ASSIGNMENTS

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Homework creation (teacher) | ✅ Present | — | — | Core |
| **Student homework submission** | ❌ Missing | **P0** | 14h | Homework is one-way broadcast today |
| File attachment on homework | ❌ Missing | P1 | 8h | PDFs, images, docs |
| **Due date tracking + overdue status** | ❌ Missing | **P0** | 6h | No deadline enforcement |
| Reminder notification (D-1 before due) | ❌ Missing | P1 | 4h | Reduces missed submissions |
| Teacher grading / feedback | ❌ Missing | P1 | 10h | No marks or comments on submissions |
| Homework completion rate per batch | ❌ Missing | P1 | 6h | Analytics for teacher |
| Batch/subject filter on homework list | ❌ Missing | P1 | 4h | Homework list is unfiltered |
| Homework calendar view | ❌ Missing | P2 | 8h | See all due dates on a calendar |
| Study material / resource upload | ❌ Missing | P2 | 14h | Notes, PDFs, slides per subject |
| Video content library (LMS) | ❌ Missing | P3 | 40h | Recorded lectures |

---

# PART 5 — EXAMINATIONS & RESULTS

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Exam creation | ✅ Present | — | — | Core |
| **Per-student marks entry** | ❌ Missing | **P0** | 12h | Exams exist but results cannot be recorded |
| Marks → grade / percentage conversion | ❌ Missing | **P0** | 6h | Without this, exams are decorative |
| Pass/fail determination | ❌ Missing | P1 | 4h | Automatic based on min marks |
| GPA / CGPA calculation | ❌ Missing | P1 | 10h | Important for competitive exam prep |
| Rank / position in batch | ❌ Missing | P1 | 4h | High motivation tool for students |
| Marksheet / result card PDF | ❌ Missing | P1 | 10h | Parents expect a printable report card |
| **Student progression tracking** (exam over exam) | ❌ Missing | P1 | 16h | Core differentiator for coaching |
| Comparative analytics (batch vs batch) | ❌ Missing | P1 | 14h | Teacher needs cross-batch view |
| **Mock test / practice exam engine** | ❌ Missing | P1 | 60h | Highest-value coaching feature |
| Online quiz (MCQ auto-graded) | ❌ Missing | P1 | 50h | Self-assessment between exams |
| Exam schedule calendar | ❌ Missing | P1 | 4h | Students need advance notice |
| Parent result notification | ❌ Missing | P1 | 4h | Email/SMS when results published |
| Previous year paper uploads | ❌ Missing | P2 | 8h | Common in competitive exam coaching |
| Grading scale configuration | ❌ Missing | P2 | 6h | A+/A/B/C or custom scales |

---

# PART 6 — AI & INTELLIGENT FEATURES

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Automated scheduling (fee reminders, reports)** | ❌ Missing | **P0** | 10h | Rule-based automation, not true AI |
| **Student at-risk detection** (attendance + marks) | ❌ Missing | P2 | 60h | Moodle has this — huge differentiator |
| Smart attendance anomaly alerts | ❌ Missing | P1 | 12h | "Batch 10A attendance dropped 20% this week" |
| Fee payment prediction | ❌ Missing | P3 | 40h | Identify likely defaulters before due date |
| Exam performance prediction | ❌ Missing | P3 | 60h | Based on attendance + homework completion |
| AI chatbot (student Q&A on homework) | ❌ Missing | P3 | 80h | Async support without teacher |
| Natural language search / report queries | ❌ Missing | P3 | 80h | "Show me students who failed maths last month" |
| Auto-suggest batch assignment | ❌ Missing | P3 | 30h | Based on grade, availability, past performance |
| Smart timetable generation (conflict-free) | ❌ Missing | P2 | 30h | Algorithm-based scheduling |
| Personalised study plan generation | ❌ Missing | P3 | 60h | AI tutor roadmap per student |
| Sentiment analysis on feedback | ❌ Missing | P3 | 40h | Monitor student satisfaction |
| AI-generated progress reports | ❌ Missing | P3 | 40h | Auto-written summaries for parents |

---

# PART 7 — ANALYTICS & REPORTING

## 7.1 Org Admin Dashboard

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Revenue trend (area/bar chart)** | ❌ Missing | **P0** | 6h | Org admin needs monthly revenue visibility |
| **Attendance heatmap** | ❌ Missing | P1 | 10h | Spot absenteeism patterns visually |
| **Fee collection donut (paid vs pending)** | ❌ Missing | P1 | 4h | At-a-glance cash position |
| **Exam performance distribution** | ❌ Missing | P1 | 8h | Academic health of the centre |
| **Animated count-up on KPI cards** | ❌ Missing | P1 | 3h | Professional first impression |
| Batch-wise student headcount | ❌ Missing | P1 | 3h | Capacity planning |
| Expense vs revenue P&L | ❌ Missing | P1 | 8h | Profitability visibility |
| Upcoming exams widget | ❌ Missing | P1 | 4h | Next 7-day exam calendar |
| Pending homework submissions widget | ❌ Missing | P1 | 4h | Completion rate at a glance |
| Recent activity feed | ❌ Missing | P1 | 6h | Who did what and when |
| Fee defaulters quick list | ⚡ Partial | **P0** | 4h | Link directly to follow-up action |
| Top performers leaderboard | ❌ Missing | P2 | 6h | Motivation + marketing for centre |
| Teacher performance metrics | ❌ Missing | P2 | 10h | Hours taught, attendance marked, homework set |

## 7.2 Super Admin Dashboard

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **MRR / ARR trend chart** | ❌ Missing | P1 | 10h | Core SaaS health metric |
| **Org churn risk** (last login > 30d) | ❌ Missing | P1 | 12h | Identify orgs about to leave |
| Plan distribution (Free/Pro/Enterprise) | ❌ Missing | P1 | 6h | Upsell targeting |
| Top 10 orgs by student count | ❌ Missing | P1 | 4h | Power user identification |
| New org signups trend | ❌ Missing | P1 | 4h | Growth metric |
| Support ticket volume | ❌ Missing | P2 | 12h | Platform health indicator |
| Feature usage heatmap | ❌ Missing | P2 | 20h | Product analytics |

## 7.3 Reporting Engine

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Attendance report (by date range, batch, student) | ❌ Missing | P1 | 10h | Most-requested report |
| Fee collection report (monthly, annual) | ❌ Missing | P1 | 8h | Accounting/tax requirement |
| Exam result report / marksheet PDF | ❌ Missing | P1 | 10h | Parent-facing deliverable |
| Profit & Loss statement | ❌ Missing | P1 | 10h | Business health |
| Student enrollment report | ❌ Missing | P1 | 6h | Trend analysis |
| Export to CSV / Excel / PDF | ❌ Missing | P1 | 10h | All major reports |
| Scheduled report delivery (email) | ❌ Missing | P2 | 14h | Weekly summary to org admin |
| **Custom report builder** | ❌ Missing | P3 | 60h | RosarioSIS has this |
| Dashboard widget configurator | ❌ Missing | P3 | 30h | Drag-and-drop widgets |

---

# PART 8 — NOTIFICATIONS

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Automated email notifications** | ❌ Missing | **P0** | 10h | Entire notification system is manual today |
| **Automated SMS notifications** | ❌ Missing | **P0** | 12h | Preferred channel in India/SE Asia |
| Browser push notifications | ❌ Missing | P1 | 14h | Real-time in-app alerts |
| Mobile push notifications (FCM) | ❌ Missing | P2 | 16h | PWA or native app |
| **Notification triggers defined:** | | | | |
| → Student absent | ❌ | **P0** | 3h | Same-day parent alert |
| → Fee due in 3 days | ❌ | **P0** | 3h | Proactive reminder |
| → Fee overdue | ❌ | **P0** | 3h | Follow-up prompt |
| → Exam result published | ❌ | P1 | 2h | Student/parent excitement |
| → Homework due tomorrow | ❌ | P1 | 2h | Reduces missed submissions |
| → New notice posted | ❌ | P1 | 2h | Important announcements |
| → New student enrolled | ❌ | P1 | 2h | Welcome email |
| → Password changed | ❌ | P1 | 2h | Security alert |
| Notification preference centre | ❌ Missing | P2 | 8h | Users choose what they receive |
| Email template editor | ❌ Missing | P2 | 10h | Custom branding on emails |
| Notification history / log | ❌ Missing | P2 | 6h | "Was the SMS actually sent?" |
| Bulk announcement (WhatsApp/SMS) | ❌ Missing | P2 | 16h | Broadcast to all parents |
| In-app notification bell | ❌ Missing | P1 | 10h | No notification UI exists |

---

# PART 9 — SEARCH

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Global search (Cmd+K)** | ❌ Missing | P1 | 10h | Standard in modern SaaS |
| Search students by name / phone / roll no | ⚡ Client-side only | P1 | 6h | Move to server-side (Firestore) |
| Search teachers | ⚡ Client-side only | P1 | 4h | Move to server-side |
| Search across fees, exams, notices | ❌ Missing | P1 | 8h | Cross-entity search |
| Full-text search (Algolia / Typesense) | ❌ Missing | P2 | 20h | Fuzzy, typo-tolerant |
| Search history / recent | ❌ Missing | P2 | 4h | UX convenience |
| Filter + sort on every list | ⚡ Partial | P1 | 14h | Only basic filter exists |
| Server-side search (not client fetch-all) | ❌ Missing | **P0** | 10h | Required before pagination |

---

# PART 10 — CALENDAR

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Academic year / term calendar | ❌ Missing | P1 | 10h | Foundation for scheduling |
| Holiday / break calendar | ❌ Missing | P1 | 6h | Affects attendance calculation |
| Exam schedule calendar | ❌ Missing | P1 | 4h | Students need advance planning |
| Homework due date calendar | ❌ Missing | P1 | 4h | Visual deadline management |
| Teacher timetable calendar view | ❌ Missing | P1 | 8h | Weekly schedule at a glance |
| Student timetable calendar view | ❌ Missing | P1 | 6h | Personal schedule |
| Event / notice calendar | ❌ Missing | P2 | 6h | Centre events, parent meetings |
| Google Calendar sync | ❌ Missing | P3 | 20h | Export to personal calendar |
| iCal feed | ❌ Missing | P3 | 8h | Universal calendar export |
| Conflict detection in scheduling | ❌ Missing | P1 | 14h | Teacher double-booked detection |
| Substitute teacher management | ❌ Missing | P3 | 12h | Teacher absence handling |

---

# PART 11 — DARK MODE

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Dark mode toggle** | ❌ Missing | P2 | 20h | Expected in 2026 |
| System preference detection | ❌ Missing | P2 | 2h | `prefers-color-scheme` media query |
| Persistent dark mode preference | ❌ Missing | P2 | 2h | localStorage setting |
| Dark mode for all components | ❌ Missing | P2 | 16h | Charts, modals, forms in dark |
| Dark mode for PDF exports | ❌ Missing | P3 | 4h | Print-specific styles |

---

# PART 12 — LOCALISATION & INTERNATIONALISATION

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **i18n framework (react-i18next)** | ❌ Missing | P1 | 14h | Core requirement for India/global markets |
| English language strings externalised | ❌ Missing | P1 | 10h | All strings are hardcoded |
| Hindi language support | ❌ Missing | P1 | 20h | Primary Indian market need |
| Bengali / Tamil / Marathi | ❌ Missing | P2 | 8h each | Regional coaching markets |
| RTL layout support (Arabic / Urdu) | ❌ Missing | P3 | 24h | Middle East market |
| Date format localisation | ❌ Missing | P1 | 4h | DD/MM/YYYY vs MM/DD/YYYY |
| Number / currency localisation | ❌ Missing | P1 | 4h | ₹ vs $ vs € formatting |
| Time zone handling | ❌ Missing | P1 | 8h | Org in IST, timestamps in UTC |
| Translation management workflow | ❌ Missing | P2 | 10h | How translators update strings |

---

# PART 13 — ACCESSIBILITY (A11Y)

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **WCAG 2.1 AA compliance audit** | ❌ Not done | P1 | 20h | Legal requirement in many markets |
| `aria-current="page"` on sidebar links | ❌ Missing | P1 | 1h | Screen readers can't determine active page |
| `aria-label` on all icon-only buttons | ❌ Missing | P1 | 3h | Icons without labels are invisible to AT |
| Focus trap in modal / sheet / dialog | ❌ Missing | P1 | 4h | Keyboard users escape modals accidentally |
| Skip-to-content link | ❌ Missing | P1 | 1h | Keyboard / screen reader UX |
| Keyboard navigation on all components | ⚡ Partial | P1 | 8h | Radix covers some; custom components don't |
| Color contrast WCAG AA (4.5:1 ratio) | ❌ Not verified | P1 | 6h | Unknown — no audit done |
| Focus visible ring on all interactive elements | ❌ Missing | P1 | 4h | Keyboard users can't see focus state |
| Form error announcements (aria-live) | ❌ Missing | P1 | 4h | Screen readers don't hear validation errors |
| Alt text on all images | ❌ Missing | P1 | 2h | Profile photos etc. |
| Reduced motion support | ❌ Missing | P2 | 4h | `prefers-reduced-motion` for animations |
| Screen reader tested (NVDA / VoiceOver) | ❌ Not done | P2 | 10h | Manual testing required |
| Axe / Lighthouse a11y CI check | ❌ Missing | P2 | 4h | Automated regression prevention |

---

# PART 14 — CACHING & PERFORMANCE

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Cursor pagination on ALL list hooks** | ❌ Missing | **P0** | 10h | Full collection reads = Firestore bill shock |
| **TanStack Query `staleTime`** | ❌ Missing | P1 | 2h | Every navigation re-fetches unnecessarily |
| **`React.memo` on Sidebar + stat cards** | ❌ Missing | P1 | 3h | Re-renders on every parent state change |
| `useCallback` on mutation handlers | ❌ Missing | P1 | 4h | New function reference on every render |
| `useMemo` on filtered / sorted lists | ❌ Missing | P1 | 4h | Client-side filter recomputes on every render |
| Firestore offline persistence | ❌ Missing | P1 | 2h | `enableIndexedDbPersistence(db)` — 2 lines |
| Firestore composite indexes (`.indexes.json`) | ❌ Missing | P1 | 4h | Complex filters fail silently at scale |
| Service Worker / PWA caching | ❌ Missing | P2 | 10h | Offline-capable app |
| Redis / server-side cache | ❌ Missing | P3 | 24h | Express API has no caching layer |
| Image compression & CDN | ❌ Missing | P2 | 4h | Profile photos not optimised |
| Bundle size analysis (`vite-bundle-visualizer`) | ❌ Missing | P2 | 2h | Unknown what's inflating the bundle |
| Code splitting beyond route-level | ⚡ Partial | P2 | 6h | Route lazy load exists; component-level missing |
| Prefetching on hover | ❌ Missing | P2 | 4h | TanStack Query `prefetchQuery` on hover |
| `IntersectionObserver` for list virtualisation | ❌ Missing | P2 | 8h | Long lists need virtual scroll (react-virtual) |

---

# PART 15 — TESTING

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Zero tests exist** | 🔴 None | **P0** | — | No safety net for any change |
| Unit tests (Vitest) — hooks & utils | ❌ Missing | P1 | 30h | Data transformation, calculation logic |
| Component tests (React Testing Library) | ❌ Missing | P1 | 40h | UI interaction coverage |
| Integration tests (Firestore emulator) | ❌ Missing | P1 | 30h | CRUD flows against real schema |
| E2E tests (Playwright) — critical paths | ❌ Missing | P1 | 40h | Login, enroll student, mark attendance, pay fee |
| CI pipeline (GitHub Actions) | ❌ Missing | P1 | 8h | Tests run on every push |
| Firestore emulator setup | ❌ Missing | P1 | 6h | Local dev without production DB |
| Test coverage threshold enforcement | ❌ Missing | P2 | 2h | Prevent coverage regression |
| Snapshot tests for critical UI | ❌ Missing | P2 | 10h | Detect accidental UI changes |
| Performance regression tests (Lighthouse CI) | ❌ Missing | P2 | 8h | Catch bundle size or render regressions |
| Accessibility regression (axe-playwright) | ❌ Missing | P2 | 6h | Catch a11y issues in CI |

---

# PART 16 — SECURITY

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Firestore security rules (missing from repo)** | 🔴 Critical | **P0** | 4h | Unknown if tenant data is isolated |
| **Super admin email hardcoded in source** | 🔴 Critical | **P0** | 3h | Public GitHub repo exposes admin email |
| **Server-side auth (Firebase Custom Claims)** | ❌ Missing | **P0** | 8h | All role checks are client-side — bypassable |
| Input validation (Zod on all Firestore writes) | ❌ Missing | **P0** | 8h | Malformed data writes go unchecked |
| **CORS restricted to allowlist** | 🔴 Open | **P0** | 1h | Express API accepts any origin |
| Rate limiting on Express API | ❌ Missing | P1 | 3h | No protection against abuse |
| PII to PostHog without consent gate | 🔴 Active | P1 | 4h | GDPR / privacy violation risk |
| Audit log (who changed what, when) | ❌ Missing | P1 | 10h | No accountability trail |
| **Two-factor authentication (TOTP)** | ❌ Missing | P1 | 12h | Expected for admin accounts |
| Google / OAuth SSO | ❌ Missing | P1 | 10h | Reduces friction, improves security |
| Session timeout / inactivity logout | ❌ Missing | P1 | 4h | Shared device risk |
| Brute-force protection (login lockout) | ❌ Missing | P1 | 4h | Firebase has limits but no UI feedback |
| Field-level permissions per role | ❌ Missing | P1 | 24h | Teachers can see org admin data |
| Secure file upload validation | ❌ Missing | P1 | 6h | File type / size not validated before upload |
| HTTPS enforcement | ⚡ Depends on host | P1 | 2h | Config-level |
| Content Security Policy (CSP) header | ❌ Missing | P2 | 4h | XSS mitigation layer |
| Dependency vulnerability scanning | ❌ Missing | P2 | 2h | `pnpm audit` in CI |
| Secrets in `.env` — not checked in | ✅ Good | — | — | Firebase keys via env vars |
| GDPR compliance tools (data export, delete) | ❌ Missing | P2 | 20h | Required in EU |
| Data encryption at rest | ⚡ Firebase default | P2 | — | Firestore encrypts at rest by default |
| Penetration test / security review | ❌ Not done | P2 | 40h | Before any major marketing push |

---

# PART 17 — ROLE PERMISSIONS

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Current roles: super_admin, org_admin, teacher, student | ✅ | — | — | Basic RBAC exists |
| **Parent role** | ❌ Missing | **P0** | 10h | Largest missing user type |
| Librarian role | ❌ Missing | P3 | 4h | If library module added |
| Accountant role (fees only, no student data) | ❌ Missing | P2 | 8h | Finance staff separation of duties |
| **Server-side role enforcement** | ❌ Missing | **P0** | 8h | All role checks run in browser |
| **Firestore rules enforce orgId isolation** | ❌ Missing | **P0** | 4h | Cross-tenant access not blocked at DB level |
| Field-level visibility by role | ❌ Missing | P1 | 24h | Teachers shouldn't see fee details |
| Permission denied UI (vs blank page) | ❌ Missing | P1 | 4h | Unauthorised routes show nothing |
| `usePermission(action)` hook | ❌ Missing | P1 | 6h | Permission checks scattered everywhere |
| Role change audit log | ❌ Missing | P1 | 4h | Who granted teacher access? |
| Invitation-based teacher onboarding | ⚡ Partial | P1 | 8h | Join link exists but no email invite |
| Granular permissions (teacher sees only their batch) | ❌ Missing | P2 | 20h | All teachers see all students today |

---

# PART 18 — AUDIT LOGS

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **No audit log system exists** | 🔴 None | P1 | 10h | Cannot answer "who deleted this student?" |
| Firestore write triggers → audit collection | ❌ Missing | P1 | 8h | Log every create/update/delete |
| Audit log viewer UI (org admin) | ❌ Missing | P1 | 8h | Searchable, filterable history |
| Super admin cross-org audit view | ❌ Missing | P1 | 6h | Platform-level accountability |
| Audit log export (CSV) | ❌ Missing | P2 | 4h | Compliance reporting |
| Sensitive field change log (fee amount, grade) | ❌ Missing | P1 | 6h | Detect tampering |
| Failed login attempt log | ❌ Missing | P1 | 4h | Security monitoring |
| Audit log retention policy | ❌ Missing | P2 | 4h | How long to keep logs |
| Impersonation log (super admin as org) | ⚡ Partial | P1 | 4h | Impersonation exists but not logged |

---

# PART 19 — EXPORT & DATA PORTABILITY

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Export students (CSV / Excel) | ❌ Missing | P1 | 6h | Basic admin need |
| Export attendance report | ❌ Missing | P1 | 4h | Monthly report for management |
| Export fee collection report | ❌ Missing | P1 | 4h | Accounting requirement |
| Export exam results / marksheet PDF | ❌ Missing | P1 | 10h | Parent-facing deliverable |
| Export expenses | ❌ Missing | P1 | 4h | Tax filing |
| Bulk data export (full org backup) | ❌ Missing | P2 | 16h | Data portability right (GDPR) |
| Import students (CSV upload) | ❌ Missing | P1 | 10h | Onboarding 200 students manually is painful |
| Import from competitor systems | ❌ Missing | P3 | 30h | Migration from Fedena/openSIS |
| API for external integrations | ❌ Missing | P2 | 30h | Third-party tools need data access |
| Webhook support | ❌ Missing | P2 | 20h | Trigger external actions on events |

---

# PART 20 — BACKUP & DISASTER RECOVERY

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Automated Firestore backups | ❌ Missing | P1 | 6h | Firebase exports — scheduled Cloud Function |
| Backup verification / restore test | ❌ Missing | P1 | 4h | Backup is worthless without restore test |
| Point-in-time recovery policy | ❌ Missing | P1 | 4h | Define RPO (recovery point objective) |
| Super admin one-click org data export | ❌ Missing | P1 | 8h | Manual backup option |
| Disaster recovery runbook | ❌ Missing | P2 | 8h | Written procedure for outage |
| Multi-region Firestore | ❌ Missing | P3 | 8h | Currently single-region |

---

# PART 21 — PERFORMANCE (CODE LEVEL)

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Unbounded collection reads (all hooks)** | 🔴 Critical | **P0** | 10h | 1000 students = 1000 reads per page load |
| `staleTime` on all TanStack queries | ❌ Missing | P1 | 2h | Unnecessary refetches on every navigation |
| `React.memo` on Sidebar, stat cards | ❌ Missing | P1 | 3h | Sidebar re-renders on every state change |
| `useMemo` on filtered student lists | ❌ Missing | P1 | 4h | Filter runs on every keystroke |
| `useCallback` on Firestore mutation handlers | ❌ Missing | P1 | 4h | New function reference causes child re-renders |
| Optimistic updates on mutations | ❌ Missing | P1 | 10h | UI waits for Firestore round-trip |
| Virtual list (`@tanstack/react-virtual`) | ❌ Missing | P2 | 8h | 500-row student list freezes on low-end devices |
| Firestore offline persistence | ❌ Missing | P1 | 2h | App unusable on slow connections |
| Firestore composite indexes | ❌ Missing | P1 | 4h | Complex queries fail without indexes |
| Bundle analyser in build pipeline | ❌ Missing | P2 | 2h | Unknown bundle bloat |
| Lazy load heavy components (charts, PDF gen) | ⚡ Partial | P1 | 4h | Routes are lazy; heavy components within pages are not |
| Prefetch on hover / visible | ❌ Missing | P2 | 4h | Anticipatory loading |

---

# PART 22 — SEO

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| `<title>` per page | ❌ Missing | P1 | 3h | All pages show same tab title |
| Meta description per page | ❌ Missing | P1 | 3h | Affects search snippet |
| Open Graph tags (sharing previews) | ❌ Missing | P1 | 4h | Social sharing looks broken |
| Twitter / X card meta tags | ❌ Missing | P2 | 2h | Social sharing |
| Structured data (JSON-LD) | ❌ Missing | P2 | 6h | Rich search results |
| `robots.txt` | ❌ Missing | P1 | 1h | Search engines crawl protected pages |
| `sitemap.xml` (for landing page) | ❌ Missing | P1 | 2h | Only landing + marketing pages need this |
| Landing page SEO content | ⚡ Partial | P1 | 8h | Thin content, no keyword strategy |
| Canonical URLs | ❌ Missing | P2 | 2h | Duplicate content prevention |
| `lang` attribute on `<html>` | ❌ Missing | P1 | 1h | Screen reader and search engine signal |
| Performance score (Core Web Vitals) | ❌ Not measured | P1 | 4h | LCP, FID, CLS not measured |

---

# PART 23 — MULTI-TENANCY

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Multi-tenant data path (`orgs/{orgId}/...`) | ✅ Correct | — | — | Foundation is right |
| **Firestore rules enforce orgId isolation** | ❌ Missing | **P0** | 4h | Rules not in repo — isolation unverified |
| **Cross-tenant data leakage prevention** | ❌ Unverified | **P0** | 4h | No rules = potential cross-org access |
| Org-level feature flags | ❌ Missing | P1 | 10h | Enable features per plan |
| Org-level branding (logo, colors) | ❌ Missing | P2 | 14h | White-label per org |
| Org data isolation in storage (Firebase Storage) | ❌ Missing | P1 | 4h | File paths must include orgId |
| Org deletion / offboarding | ❌ Missing | P1 | 10h | Cascade delete all org data |
| Org status (active / suspended / trial) | ⚡ Partial | P1 | 6h | Status field exists; enforcement missing |
| Plan enforcement (student count limits) | ❌ Missing | P1 | 14h | Free plan can add unlimited students |
| Cross-org reporting (super admin) | ⚡ Partial | P1 | 10h | Basic counts exist; no trends or breakdowns |

---

# PART 24 — BILLING & SUBSCRIPTION (SAAS PLATFORM)

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Stripe integration** | ❌ Missing | P1 | 30h | EduTrack generates ₹0 today |
| Pricing tiers (Free / Pro / Enterprise) | ❌ Missing | P1 | 8h | No business model implemented |
| Checkout flow | ❌ Missing | P1 | 10h | Can't subscribe even if user wants to |
| Subscription management portal | ❌ Missing | P1 | 12h | Upgrade, downgrade, cancel |
| Webhook handler (Stripe events) | ❌ Missing | P1 | 8h | Payment success → activate plan |
| Invoice generation for orgs | ❌ Missing | P2 | 10h | GST invoice required in India |
| Trial period (14 / 30 days free) | ❌ Missing | P2 | 8h | Conversion funnel |
| Dunning management (failed payments) | ❌ Missing | P2 | 8h | Automatic retry + notification |
| Annual vs monthly pricing | ❌ Missing | P2 | 4h | Annual discount incentive |
| Promo codes / coupons | ❌ Missing | P3 | 8h | Growth hacking |
| Affiliate / referral tracking | ❌ Missing | P3 | 20h | Referral program |

---

# PART 25 — MONITORING & OBSERVABILITY

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| Error tracking (Sentry) | ❌ Missing | P1 | 4h | No visibility into production crashes |
| **Application performance monitoring** | ❌ Missing | P1 | 6h | No latency data |
| Firebase Performance Monitoring | ❌ Missing | P1 | 2h | Free — just add SDK |
| Uptime monitoring | ❌ Missing | P1 | 2h | No alert if app goes down |
| PostHog analytics (product) | ⚡ Partial | P1 | 4h | Installed but no events tracked |
| Custom event tracking | ❌ Missing | P1 | 8h | Define funnel events (enroll, pay, mark attendance) |
| Dashboard of DAU / MAU | ❌ Missing | P1 | 6h | Product usage visibility |
| Firestore usage dashboard | ❌ Missing | P1 | 2h | Cost monitoring |
| Log aggregation (Cloud Logging) | ❌ Missing | P2 | 6h | Server-side log search |
| Alerting on error rate / latency | ❌ Missing | P1 | 4h | PagerDuty / OpsGenie integration |
| Health check endpoint | ✅ Present | — | — | `/api/healthz` exists |

---

# PART 26 — ERROR HANDLING

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Global `<ErrorBoundary>` on every page** | ❌ Missing | **P0** | 3h | One Firestore error crashes entire SPA |
| Firestore error codes → user messages | ❌ Missing | **P0** | 6h | `catch(e) { setProfile(null) }` — silent failures |
| Network offline detection + banner | ❌ Missing | P1 | 4h | User doesn't know they're offline |
| Retry logic on failed reads | ❌ Missing | P1 | 4h | Transient errors cause permanent blank pages |
| 404 page (route not found) | ❌ Missing | P1 | 2h | Unknown routes show nothing |
| 403 page (permission denied) | ❌ Missing | P1 | 2h | Unauthorised access shows nothing |
| Form submit error handling | ⚡ Partial | P1 | 4h | Some forms show errors; others are silent |
| API timeout handling | ❌ Missing | P1 | 4h | Long Firestore reads don't time out |
| Mutation failure rollback (TanStack) | ❌ Missing | P1 | 6h | Optimistic updates need rollback |
| Error reporting to Sentry | ❌ Missing | P1 | 4h | Errors not captured anywhere |
| User-facing error log | ❌ Missing | P2 | 6h | "Copy error details" button for support |

---

# PART 27 — DEVELOPER EXPERIENCE (DX)

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Zero tests** | 🔴 None | **P0** | 80h | Developers afraid to refactor |
| Firestore emulator setup | ❌ Missing | P1 | 6h | Dev hits production DB |
| `createCrudHooks(collectionPath)` factory | ❌ Missing | P1 | 8h | Same 30-line pattern repeated per entity |
| `usePermission(action)` hook | ❌ Missing | P1 | 6h | Permission checks scattered inline |
| `mapDoc` typed generics (not `any`) | 🔴 `any` types | P1 | 6h | Type safety broken at DB boundary |
| Zod schemas per entity | ❌ Missing | P1 | 8h | No runtime schema validation |
| Storybook for component documentation | ❌ Missing | P2 | 20h | No isolated component dev |
| ESLint strict config | ❌ Missing | P1 | 4h | No linting enforced |
| Prettier enforced in CI | ❌ Missing | P1 | 2h | Inconsistent formatting |
| Pre-commit hooks (Husky + lint-staged) | ❌ Missing | P1 | 3h | Bad code can be committed |
| Environment-specific Firebase projects | ❌ Missing | P1 | 4h | Dev and prod share the same Firestore |
| README / CONTRIBUTING guide | ❌ Missing | P2 | 4h | No onboarding docs |
| OpenAPI spec for Express API | ✅ Present | — | — | Good foundation |
| Component naming conventions | ⚡ Inconsistent | P2 | 4h | Mix of patterns across files |
| PR / issue templates on GitHub | ❌ Missing | P2 | 2h | No contribution standards |
| Semantic versioning + changelog | ❌ Missing | P2 | 4h | No release process |
| Database migration strategy | ❌ Missing | P1 | 8h | Schema changes break production silently |
| Local `.env.example` file | ❌ Missing | P1 | 1h | New devs don't know what env vars are needed |

---

# PART 28 — UX / UI GAPS

## 28.1 Loading States

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Skeleton loaders on all lists | ❌ Missing | **P0** | 4h |
| Skeleton on dashboard stats | ❌ Missing | P1 | 2h |
| Skeleton on chart widgets | ❌ Missing | P1 | 2h |
| Button loading spinner on form submit | ⚡ Partial | P1 | 3h |
| Page-level suspense fallback | ❌ Missing | P1 | 2h |

## 28.2 Empty States

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Empty state with CTA on every list page | ⚡ Text only | **P0** | 6h |
| Onboarding prompt on first login | ❌ Missing | **P0** | 8h |
| Illustration on empty states | ❌ Missing | P1 | 4h |

## 28.3 Navigation

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Collapsible sidebar (mini-mode) | ❌ Missing | P1 | 6h |
| Breadcrumb navigation | ❌ Missing | P1 | 3h |
| Mobile bottom navigation bar | ❌ Missing | P1 | 5h |
| Active state indicator on sidebar | ❌ Missing | P1 | 1h |
| Keyboard shortcut map (Cmd+K, Cmd+/) | ❌ Missing | P2 | 8h |

## 28.4 Forms

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Inline real-time validation | ❌ Missing | P1 | 8h |
| Prevent sheet close on outside click when dirty | ❌ Missing | P1 | 3h |
| Multi-step wizard for complex forms | ❌ Missing | P1 | 12h |
| Autosave / draft state | ❌ Missing | P2 | 10h |
| Bulk actions (select all + delete / export) | ❌ Missing | P1 | 8h |

## 28.5 Feedback & Interactions

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Consistent toast notifications on all mutations | ⚡ Inconsistent | P1 | 3h |
| Confirm dialog (not `window.confirm`) | ❌ Missing | **P0** | 4h |
| Undo / soft-delete (30s undo toast) | ❌ Missing | P2 | 10h |
| Success animations (confetti on fee paid) | ❌ Missing | P2 | 2h |
| Progress indicator on multi-step actions | ❌ Missing | P1 | 4h |

## 28.6 Animations

| Gap | Status | Priority | Est. |
|---|---|---|---|
| Page transition (BlurFade / slide) | ⚡ Basic | P1 | 4h |
| List stagger on mount (Framer Motion) | ❌ Missing | P1 | 4h |
| Animated count-up on dashboard numbers (GSAP) | ❌ Missing | P1 | 3h |
| Chart draw animation (Recharts) | ❌ Missing | P1 | 3h |
| Sidebar collapse animation | ❌ Missing | P1 | 3h |
| Sheet / modal entrance animation | ⚡ Basic | P1 | 2h |
| Scroll-triggered reveals (landing page) | ❌ Missing | P1 | 6h |
| Hover micro-interactions on cards | ❌ Missing | P1 | 3h |
| Loading shimmer on skeletons | ❌ Missing | P1 | 2h |

---

# PART 29 — LEAD / CRM

| Gap | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Inquiry / lead capture form** | ❌ Missing | **P0** | 12h | Biggest growth funnel entry point |
| **Lead status pipeline** (New → Contacted → Enrolled) | ❌ Missing | **P0** | 16h | ERPNext / OpenEduCat both have this |
| Lead source tracking (walk-in, referral, social) | ❌ Missing | P1 | 4h | Marketing ROI measurement |
| Follow-up reminder / task | ❌ Missing | P1 | 8h | Sales cadence automation |
| Lead → student conversion | ❌ Missing | P1 | 6h | One-click enrollment from lead |
| Conversion rate analytics | ❌ Missing | P2 | 10h | Funnel metrics |
| Lost lead reason tracking | ❌ Missing | P2 | 6h | Improve conversion |
| Public inquiry form (embeddable) | ❌ Missing | P2 | 10h | Website widget |

---

# PART 30 — ADDITIONAL MODULES (FROM REFERENCE SYSTEMS)

| Module | Status | Priority | Est. | Business Impact |
|---|---|---|---|---|
| **Onboarding wizard (first-run setup)** | ❌ Missing | **P0** | 24h | Activation — users quit without guidance |
| Library management (issue/return) | ❌ Missing | P3 | 30h | OpenEduCat, Fedena both have this |
| Transport / bus routes | ❌ Missing | P3 | 40h | openSIS has this |
| Health / medical records | ❌ Missing | P3 | 20h | RosarioSIS has this |
| Discipline / incident tracking | ❌ Missing | P3 | 16h | RosarioSIS has this |
| Food service / canteen | ❌ Missing | P3 | 20h | openSIS has this |
| Alumni management | ❌ Missing | P3 | 8h | OpenEduCat has this |
| Certificate / ID card generation | ❌ Missing | P2 | 14h | OpenEduCat has QWeb PDF generation |
| **Live class / video call integration** | ❌ Missing | P2 | 30h | Zoom / Jitsi / Google Meet |
| Google Classroom integration | ❌ Missing | P3 | 30h | LMS bridge |
| WhatsApp Business API | ❌ Missing | P2 | 20h | Dominant messaging in India |
| **Self-onboarding + join code (public)** | ⚡ Partial | **P0** | 8h | Join link exists; no guided wizard |

---

# MASTER GAP SUMMARY

## Total Gap Count

| Priority | Gap Count | Total Est. Hours |
|---|---|---|
| **P0 — Critical (fix now)** | **42 gaps** | **~290h** |
| **P1 — High (next sprint)** | **87 gaps** | **~480h** |
| **P2 — Medium (following sprint)** | **61 gaps** | **~380h** |
| **P3 — Roadmap** | **28 gaps** | **~420h** |
| **TOTAL** | **218 gaps** | **~1,570h** |

## Top 20 Gaps by Business Impact × Effort Ratio (Best ROI First)

| # | Gap | Priority | Hours | Impact |
|---|---|---|---|---|
| 1 | Firestore security rules | P0 | 4h | 🔴 Critical — data breach |
| 2 | Remove hardcoded admin email | P0 | 3h | 🔴 Critical — public repo exposure |
| 3 | `window.confirm` → AlertDialog | P0 | 4h | High — basic UX |
| 4 | ErrorBoundary on every page | P0 | 3h | High — reliability |
| 5 | Skeleton loaders | P0 | 4h | High — UX |
| 6 | Fee defaulters list | P0 | 4h | Very High — cash flow |
| 7 | Attendance % per student | P0 | 4h | Very High — core metric |
| 8 | TanStack `staleTime` | P1 | 2h | High — performance |
| 9 | Firestore offline persistence | P1 | 2h | Medium — UX |
| 10 | CORS allowlist | P0 | 1h | High — security |
| 11 | Animated count-up on stats (GSAP) | P1 | 3h | High — first impression |
| 12 | `react-i18next` setup | P1 | 14h | Very High — India market |
| 13 | Parent notification on absence | P0 | 10h | Very High — retention |
| 14 | Per-student exam marks entry | P0 | 12h | Very High — missing core feature |
| 15 | Fee structure templates | P0 | 10h | High — reduces admin work |
| 16 | Bulk attendance marking | P1 | 8h | High — teacher UX |
| 17 | Automated email notification system | P0 | 10h | Very High — engagement |
| 18 | Batch management | P0 | 12h | Very High — coaching USP |
| 19 | Student homework submission | P0 | 14h | Very High — core missing feature |
| 20 | Revenue trend chart | P0 | 6h | Very High — decision-making |

---

## Recommended Implementation Order

### Phase 1 — Foundation (Weeks 1–2): ~90h
Security hardening · Pagination · ErrorBoundary · Skeletons · Empty states · Confirm dialogs · GSAP count-up · Attendance % · Fee defaulters · Revenue chart

### Phase 2 — Core Completion (Weeks 3–5): ~140h
Exam marks entry · Batch management · Homework submission · Fee structure templates · Automated email/SMS · Parent role + portal · Onboarding wizard

### Phase 3 — Analytics & Growth (Weeks 6–8): ~120h
Dashboard charts (Tremor) · Attendance heatmap · Exam analytics · Lead CRM · Export (CSV/PDF) · Audit logs · Global search (Cmd+K) · i18n foundation

### Phase 4 — SaaS Maturity (Weeks 9–12): ~160h
Stripe billing · 2FA · Google SSO · Dark mode · PWA · Notification centre · Test suite (Vitest + Playwright) · CI pipeline

### Phase 5 — Differentiation (Weeks 13–20): ~200h
Mock test engine · Student at-risk AI · Video calls · WhatsApp API · Custom reports · Mobile app · White-labelling

---

*Full detail on every gap is available in `EDUTRACK_STEP2_REFERENCE_ANALYSIS.md` and `EDUTRACK_ANALYSIS.md`.*
