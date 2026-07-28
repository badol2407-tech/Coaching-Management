# STEP 2 — Reference Repository Deep Analysis
> All 14 repositories studied. Findings below.

---

## 1. NextJS-SMS-Template (zxmodren)

### Architecture
Next.js 14 App Router + React Server Components + Server Actions + Prisma ORM + PostgreSQL.
Route groups: `(protected)/` for authenticated users, `(auth)/` for login/register.

### Database Schema (PostgreSQL / Prisma)
```
User          → id, name, email, password, role (ADMIN|TEACHER|STUDENT), createdAt
Teacher       → id, userId(FK), gender, DOB, phone, address
Student       → id, userId(FK), gender, DOB, phone, address, classroomId
Classroom     → id, name, capacity, grade
Lesson        → id, name, teacherId(FK), categoryId(FK), day, startTime, endTime
Schedule      → id, lessonId(FK), classroomId(FK)
Assignment    → id, title, startDate, dueDate, lessonId(FK), classroomId(FK)
OnClassroom   → studentId(FK) + classroomId(FK)  [M:M junction]
```

### Auth & Authorization
- NextAuth.js v5 with Prisma adapter
- Bcrypt password hashing
- 2FA support
- Middleware.ts enforces RBAC at the edge (not client-side)
- `UserRole` enum: ADMIN / TEACHER / STUDENT

### Features
Student CRUD · Teacher CRUD · Classroom CRUD · Schedule management · Assignment management · Role-based dashboards · File uploads (Firebase/Supabase)

### Dashboard
Metrics: Total Students, Teachers, Classes, Lessons. `Overview.tsx` component.

### Performance & Security
Server Actions for mutations (no exposed API endpoints) · Zod validation on all inputs · bcrypt hashing · Middleware edge protection

### Accessibility
Radix UI primitives (full ARIA) · Tailwind responsive · Keyboard navigation

---

## 2. Frappe Education (frappe/erpnext → education module)

### Architecture
Frappe Framework — Python/MariaDB, metadata-driven DocType system. MVC via framework. Full ERP platform.

### Database Models (MariaDB)
```
Student               → profile, user_link, guardians[], siblings[]
Program               → courses[], academic_year, academic_term
Course                → topics[], materials[]
Fee Structure         → components[], total_amount, academic_year
Fee Schedule          → student_batches[], student_category, program
Student Attendance    → student, course_schedule, status (Present/Absent/Late)
Assessment Plan       → course, examiner, schedule, grading_scale
Assessment Result     → student, assessment_plan, marks[], grade
Student Applicant     → program, applying_for, status
```

### Auth & Authorization
- Frappe session management (LDAP, OAuth2, native)
- Granular RBAC via "Role Permissions Manager"
- Roles: Student, Instructor, Academic User, Academic Manager, Guardian
- Record-level rules (e.g. teacher sees only their classes)

### Features
Admission management · Program/Course hierarchy · Enrollment · Timetable · Examination + grading · LMS (articles, video) · Fee structures + payment tracking · Parent/guardian portal · Scholarship management · Certificate generation

### Dashboard & Reporting
- QWeb PDF reports: Bonafide, ID cards, Marksheets, Fee receipts
- Graph/List views on all DocTypes
- Custom Script reports (Python)
- Fee Due reports · Attendance sheets · Result analysis

### Notifications
Frappe mail module: email on fee due, attendance alerts, enrollment confirmations. System notifications.

### Performance
Redis caching · Background jobs via RQ (Python Queue) · MariaDB composite indexes · Lazy-loaded JS per module

### Security
ORM-level SQL injection protection · CSRF tokens on all forms · Role-based field-level visibility · Audit log on every DocType

---

## 3. OpenEduCat ERP (openeducat/openeducat_erp)

### Architecture
Odoo-based modular ERP. Python/PostgreSQL. Each feature = one Odoo module with models/, views/, security/, wizard/.

### Database Models (PostgreSQL / Odoo ORM)
```
op.student            → partner_id, gr_no, course_id, batch_id, admission_date
op.faculty            → partner_id, employee_id, subject_ids[]
op.course             → name, code, subject_ids[], batch_ids[]
op.batch              → name, course_id, start_date, end_date, student_ids[]
op.subject            → name, code, no_of_credit
op.student.course     → student_id, course_id, batch_id, academic_year
op.exam               → name, course_id, batch_id, date
op.marksheet          → student_id, exam_id, subject_marks[]
op.attendance         → student_id, class_id, date, present
op.library.book       → name, isbn, author_id, category_id, available_count
op.library.issue      → student_id, book_id, issued_date, return_date
op.fees.term          → name, start_date, end_date, academic_year
op.fees.struct        → course_id, line_ids[] (fee components)
```

### Auth & Authorization
Odoo res.users extension · RBAC via ir.model.access.csv + XML record rules · Groups: Faculty, Back Office Admin, Student (portal)

### Features (exhaustive)
Student admission · Course/Batch management · Faculty management · Subject management · Timetable · Attendance (by class, by course) · Examination + result/marksheet · **Library (issue/return/catalog)** · Fee structures + payment · **Quiz/online assessment** · **Parent portal** · Scholarships · ID card generation · Certificate generation · Bonafide letters · Communication log

### Dashboard & Reporting
QWeb PDF reports · Odoo Dashboard with graph widgets · Fee collection charts · Attendance analysis · Exam result distribution

### AI Features
None in core — available via third-party Odoo modules.

### Notifications
Odoo mail/chatter: email triggers on enrollment, fee due, exam published. SMS via gateway module.

---

## 4. Moodle (moodle/moodle)

### Architecture
PHP 8.x + MariaDB/PostgreSQL. Plugin-based architecture. Entry points in `public/`. Plugins in `mod/`, `blocks/`, `auth/`, `lib/`.

### Database (via XMLDB install.xml files)
```
mdl_user              → username, password (bcrypt), auth, lastlogin, timezone
mdl_course            → fullname, shortname, category, enrolments
mdl_course_modules    → course, module, instance, completion settings
mdl_grade_items       → course, itemtype, grademax, grademin, calculation
mdl_grade_grades      → itemid, userid, rawgrade, finalgrade, feedback
mdl_assign            → name, duedate, intro, submissiontypes
mdl_quiz              → name, timeopen, timeclose, attempts, grademethod
mdl_forum             → name, type, maxbytes, assessed
mdl_context           → contextlevel, instanceid  [for RBAC]
mdl_role_assignments  → roleid, contextid, userid
mdl_message           → useridfrom, useridto, subject, fullmessage, timecreated
mdl_badge             → name, description, criteria, issuername
```

### Auth & Authorization
- Pluggable auth system: Internal, LDAP, OAuth2, CAS, External DB, SAML, MNet
- Context-based RBAC: roles assigned at System / Category / Course / Module level
- Roles: Manager, Course Creator, Teacher, Non-editing Teacher, Student, Guest

### Features (exhaustive)
Courses + categories · Activities: Quiz, Assignment, Forum, SCORM, H5P, Workshop, Wiki, Glossary, Survey · **Gradebook** (weighted, letter grades, outcomes) · **Competency framework** · **Badges + Open Badges** · **Messaging** (real-time + async) · File management · **LTI provider/consumer** · **Accessibility toolkit** · **Analytics + ML risk prediction** · Backup/restore · GDPR compliance tools · Mobile app (REST API)

### Dashboard & Reporting
Configurable block-based dashboard · Admin reports: site logs, user activity, course completion · **Custom SQL report plugin** · Moodle Analytics API (pluggable ML backends) · Insights (at-risk student identification)

### AI / ML Features ⭐
`tool_analytics`: predictive models for student dropout risk · Pluggable model backends (sklearn, etc.) · Insights delivered to teacher dashboard

### Notifications
Email · Mobile push (via Moodle app) · Web notifications · In-app messaging · All via `lib/messagelib.php` event-driven dispatch

### Performance
Moodle Universal Cache (MUC): Redis / Memcached / APCu · Scheduled + adhoc tasks (cron) · Lazy-loaded JS via AMD/RequireJS · Database query caching

### Security
XMLDB (parameterised queries, no raw SQL) · HTMLPurifier (XSS) · bcrypt passwords · Nonces on forms · Capability system (200+ capabilities) · IP-based lockout

### Accessibility
WCAG 2.1 AA target · Built-in Accessibility toolkit · Screen reader testing in CI · Keyboard navigation enforced

### Mobile
Bootstrap "Boost" theme · Dedicated Moodle Mobile App (REST web services) · Offline course content

---

## 5. openSIS-Classic (OS4ED/openSIS-Classic)

### Architecture
PHP 8.x / MySQL 8.0 / Apache. Procedural/custom PHP. Module-based file structure.

### Database Models
```
students              → id, student_id, first_name, last_name, grade_id, dob, photo
student_enrollment    → student_id, school_id, start_date, end_date, grade_id
staff                 → id, staff_id, first_name, last_name, type (teacher/admin)
course                → course_id, title, credit_hours, grade_level
course_period         → period_id, course_id, teacher_id, room, seats
student_schedule      → student_id, course_period_id, marking_period_id
attendance            → student_id, period_id, school_date, status (P/A/T/E)
gradebook_grades      → student_id, assignment_id, grade, comment
report_card_grades    → student_id, course_period_id, marking_period_id, grade
custom_fields         → module, field_name, field_type, required
calendar              → school_id, date, title, description, type
billing               → student_id, fee_id, amount, paid_date
```

### Auth & Authorization
Custom session-based PHP auth · Admin / Teacher / Student / Parent roles · IP restrictions option

### Features (exhaustive)
Student enrollment + withdrawal · Grade-level management · Scheduling (section/period) · **Multi-year academic records** · Teacher gradebook · Report cards + GPA · Attendance (daily + period) · **Custom fields** on any record · **Parent/family portal** · **Calendar + events** · Billing/fees · Health records · **Discipline tracking** · **Transportation (bus routes)** · Food service · Letters + notifications · **Setup wizard** · Custom report builder

### Notifications
Email templates for attendance, grades, enrollment · Parent notification triggers

### Reporting
Built-in reports: enrollment, attendance, grade distribution, billing · Custom report builder UI

### Mobile
Responsive PHP templates · Parent portal mobile-optimised

---

## 6. RosarioSIS (francoisjacquet/rosariosis)

### Architecture
PHP 8.x / PostgreSQL. Modular PHP, each feature in `modules/` directory.

### Database Models
```
students              → student_id, first_name, last_name, grade_id, photo
student_enrollment    → student_id, school_id, start_date, grade_id
staff                 → staff_id, first_name, last_name, profile
courses               → course_id, title, credit_hours
course_periods        → period_id, teacher_id, room
attendance            → student_id, period_id, school_date, status
grades                → student_id, course_period_id, marking_period_id, grade
student_billing       → student_id, fee_id, amount, paid_date
food_service          → student_id, date, balance, transaction_type
discipline_events     → student_id, staff_id, date, infraction, action
health_visits         → student_id, date, complaint, treatment
custom_fields         → table, field_name, type
student_reports       → custom SQL-defined report templates
```

### Auth & Authorization
Custom session PHP · Profiles: Admin, Teacher, Parent, Student, Nurse, Food Service · Field-level permission per profile

### Features (exhaustive)
Students · Staff · Scheduling · **Gradebook** · **GPA calculation** · Report cards · Attendance · **Student billing + payment plans** · **Food service** · **Discipline** · **Health/medical** · Custom fields · **Custom report builder** · Parent portal · **Automated notifications** (SMS/email) · **Mailing labels** · **Newsletter** · Calendar · Portal (student/parent self-service) · **Data import/export** · FERPA tools

### AI Features
None — rule-based only.

### Notifications ⭐
Automated triggers: absence notification to parent · Fee due reminder · Grade update push · Supports SMS gateway integration · Configurable templates

### Reporting ⭐
Custom SQL report builder · Export to CSV/PDF/Excel · Charts on key metrics · Scheduled report delivery

### Accessibility
WCAG 2.0 partial compliance · Keyboard navigation · Screen reader tested

---

## 7. Fedena (projectfedena/fedena)

### Architecture
Ruby on Rails 4/5 / MySQL. MVC, RESTful routes. `app/models/`, `app/controllers/`, `app/views/`.

### Database Models
```
User              → username, password_digest, role
Student           → admission_no, name, class_id, batch_id, guardian_id
Guardian          → name, email, phone, student_id (parent)
Batch             → name, course_id, start_date, end_date  ← KEY: coaching batches
Course            → name, code, batches[]
Subject           → name, code, batch_id, max_mark, credit_hour
Attendance        → student_id, subject_id, date, status
ExamGroup         → name, batch_id, start_date, exam_type
Exam              → name, exam_group_id, subject_id, date, max_mark, pass_mark
ExamScore         → student_id, exam_id, marks, grade
Fee               → student_id, batch_id, amount, paid_on, payment_mode
Transport         → vehicle_no, driver, route_id
EmployeeLeave     → employee_id, leave_type, from_date, to_date
```

### Auth & Authorization
Devise + Rolify (CanCanCan) · Roles: Admin, Teacher, Student, Parent, Librarian · Fine-grained CanCan abilities per controller action

### Features (exhaustive)
Students · Courses + **Batches** (coaching-specific!) · Subjects · Attendance · Exam groups + marks · **Fee collection + reports** · **Library** · Transport · HR (employee leave, payroll) · Events calendar · **News/announcements** · Parent login · Timetable

### Batch Model ⭐ (Most relevant to coaching centers)
Fedena's `Batch` model maps perfectly to coaching: Morning batch / Evening batch / Weekend batch for the same course. Students assigned to batches, not just courses. Timetables, attendance, and exams are all batch-scoped.

### Notifications
Email via ActionMailer · Configurable triggers for fees, attendance, exams

---

---

# STEP 3 — Feature Comparison Matrix

## How to Read This Matrix

| Symbol | Meaning |
|---|---|
| ✅ | Present and well-implemented |
| ⚡ | Partial — exists but incomplete or poor quality |
| ❌ | Missing entirely |
| 🔼 | Better implementation available in reference |
| P0 | Critical — blocking growth or causing risk |
| P1 | High — material impact on user value |
| P2 | Medium — important for completeness |
| P3 | Low — nice-to-have |

**Difficulty:** S = Small (< 4h) · M = Medium (4–16h) · L = Large (16–40h) · XL = Extra Large (40h+)

---

## SECTION A — CORE ACADEMIC MANAGEMENT

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Student CRUD (add/edit/delete) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| Student profile photo | ❌ | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 3h | High — personalisation |
| Student admission number / roll no | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 2h | High — identification |
| Student guardian/parent link | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 8h | High — parent portal dep |
| Student academic history | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P2 | M | 12h | Medium |
| Teacher CRUD | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| Teacher subject assignment | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Teacher leave management | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P2 | M | 10h | Medium |
| Classes / Grade levels | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Batch management** (AM/PM batches) | ❌ | ❌ | ⚡ | ✅ | — | ❌ | ❌ | ✅ | **P0** | **M** | **12h** | **Very High — coaching-specific** |
| Course/Subject hierarchy | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Enrollment / admission workflow | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | L | 20h | High |
| Custom fields on records | ❌ | ❌ | ✅ | — | — | ✅ | ✅ | ❌ | P2 | L | 24h | Medium |
| Alumni tracking | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P3 | M | 8h | Low |

---

## SECTION B — ATTENDANCE

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Daily attendance marking | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| Period-wise attendance | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 14h | High |
| Batch-wise attendance | ❌ | ❌ | — | ✅ | — | — | — | ✅ | **P0** | **S** | **6h** | **Very High — coaching** |
| Attendance summary per student | ⚡ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Attendance percentage calculation | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **S** | **4h** | **Very High** |
| Attendance heatmap/calendar view | ❌ | ❌ | — | — | — | — | — | — | P1 | M | 10h | High — visual insight |
| Bulk attendance marking | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 8h | High — teacher UX |
| **Auto-notify parent on absence** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **M** | **10h** | **Very High** |
| Leave application by student | ❌ | ❌ | ✅ | ✅ | — | — | ✅ | ✅ | P2 | M | 8h | Medium |
| Attendance export (PDF/CSV) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 4h | High |

---

## SECTION C — FEE MANAGEMENT

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Fee recording (paid/unpaid) | ✅ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | — | — | — | Core |
| Fee structure templates | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 10h | High — saves manual entry |
| Instalment / payment plans | ❌ | ❌ | ✅ | ✅ | — | — | ✅ | ✅ | P1 | M | 12h | High — coaching centres |
| Fee defaulters list | ⚡ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | **P0** | **S** | **4h** | **Very High — cash flow** |
| **Automated fee reminders (email/SMS)** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | **P0** | **M** | **12h** | **Very High** |
| Online payment gateway (Stripe/Razorpay) | ❌ | ❌ | ✅ | ⚡ | ⚡ | ⚡ | ⚡ | ❌ | P1 | L | 24h | Very High — revenue |
| Fee receipt generation (PDF) | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Discount / scholarship | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ❌ | P2 | M | 10h | Medium |
| Fee collection analytics | ⚡ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Multi-currency support | ❌ | ❌ | ✅ | ✅ | ✅ | — | — | — | P3 | L | 20h | Low (future) |

---

## SECTION D — EXAMINATIONS & RESULTS

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Exam creation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| Per-student marks entry | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **M** | **12h** | **Very High — core feature** |
| Marks → Grade conversion | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 6h | High |
| GPA / CGPA calculation | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| Result / marksheet PDF | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| **Mock test / practice exam engine** | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | **P1** | **XL** | **60h** | **Very High — coaching USP** |
| Online quiz / MCQ engine | ❌ | ❌ | ⚡ | ✅ | ✅ | ❌ | ❌ | ❌ | P1 | XL | 50h | Very High |
| Comparative exam analytics | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | P1 | M | 14h | High |
| **Student progression tracking** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P1** | **M** | **16h** | **Very High** |
| Rank / position in class | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P2 | S | 4h | Medium |
| Parent result notification | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 4h | High |

---

## SECTION E — TIMETABLE & SCHEDULING

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Basic routine/timetable | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | — | — | — | Core |
| **Conflict detection** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 14h | High — admin UX |
| Teacher timetable view | ❌ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 6h | High |
| Student timetable view | ❌ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Holiday / leave calendar | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P2 | S | 6h | Medium |
| Substitution management | ❌ | ❌ | — | — | — | ✅ | ✅ | ❌ | P3 | M | 12h | Low |

---

## SECTION F — COMMUNICATION & NOTIFICATIONS

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Notice board (one-way broadcast) | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Email notifications (automated)** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **M** | **10h** | **Very High** |
| **SMS notifications** | ❌ | ❌ | ✅ | ✅ | ⚡ | ✅ | ✅ | ✅ | **P0** | **M** | **12h** | **Very High — India market** |
| In-app messaging (teacher↔parent) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | P1 | L | 30h | High |
| Push notifications (browser/mobile) | ❌ | ❌ | — | — | ✅ | — | — | — | P2 | L | 20h | Medium |
| Bulk message to class/batch | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Notification preference settings | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | P2 | M | 8h | Medium |
| Email template editor | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | P2 | M | 10h | Medium |

---

## SECTION G — PARENT / STUDENT PORTAL

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Student portal (self-view) | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 16h | High |
| **Parent portal (view child's data)** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | **P0** | **L** | **24h** | **Very High** |
| Parent login (separate role) | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| Guardian-student linking | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Parent sees: attendance | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Parent sees: exam results | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Parent sees: fee status | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 3h | High |
| Parent pays fees online | ❌ | ❌ | ✅ | ⚡ | ⚡ | ⚡ | ✅ | ❌ | P2 | L | 20h | High |

---

## SECTION H — DASHBOARD & ANALYTICS

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Student/teacher count KPIs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Revenue trend chart** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | **P0** | **S** | **6h** | **Very High** |
| **Attendance heatmap** | ❌ | ❌ | — | ✅ | ✅ | — | ✅ | — | P1 | M | 10h | High |
| **Fee collection donut chart** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| **Exam performance distribution** | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| Pending defaulters widget | ⚡ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 4h | High |
| Recent activity feed | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 6h | Medium |
| **Animated stat count-up** | ❌ | ❌ | — | — | — | — | — | — | P1 | S | 3h | High — first impression |
| Batch-wise headcount | ❌ | ❌ | — | ✅ | — | — | — | ✅ | P1 | S | 3h | High — coaching |
| Super admin: MRR/ARR | ❌ | ❌ | ✅ | — | — | — | — | — | P1 | M | 10h | Very High — SaaS |
| Super admin: org churn risk | ❌ | ❌ | — | — | — | — | — | — | P2 | M | 12h | High — retention |
| **Student at-risk prediction (AI)** | ❌ | ❌ | — | — | ✅ | — | — | — | P2 | XL | 60h | Very High — differentiator |
| Custom report builder | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | P2 | XL | 60h | High |
| Export dashboard data (PDF/CSV) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High |

---

## SECTION I — HOMEWORK & LMS

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Homework assignment creation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Student homework submission** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **M** | **14h** | **Very High** |
| Teacher homework grading | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| Due date tracking + reminders | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 6h | High |
| File attachment on homework | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | P1 | M | 8h | High |
| Study material / content library | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | P2 | L | 24h | Medium |
| Video content (LMS) | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | P2 | L | 30h | Medium |
| Live class / video call integration | ❌ | ❌ | — | — | ✅ (LTI) | — | — | — | P2 | L | 30h | High — hybrid coaching |

---

## SECTION J — LEAD / CRM (SaaS + Coaching Specific)

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Inquiry / lead capture form** | ❌ | ❌ | ✅ | ✅ | — | ✅ | — | — | **P0** | **M** | **12h** | **Very High — growth funnel** |
| **Lead → enrolled pipeline** | ❌ | ❌ | ✅ | ✅ | — | ✅ | — | — | **P0** | **M** | **16h** | **Very High** |
| Lead source tracking (referral/social) | ❌ | ❌ | ✅ | — | — | — | — | — | P1 | S | 4h | High — marketing ROI |
| Follow-up reminders | ❌ | ❌ | ✅ | ✅ | — | ✅ | — | — | P1 | M | 8h | High |
| Conversion rate analytics | ❌ | ❌ | ✅ | — | — | — | — | — | P2 | M | 10h | Medium |

---

## SECTION K — EXPENSES & FINANCE

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Expense logging | ✅ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | — | — | — | Core |
| Expense categories | ⚡ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | S | 3h | Medium |
| Revenue vs expense dashboard | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 8h | High |
| **Profit/loss report** | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| Budget planning | ❌ | ❌ | ✅ | ✅ | — | — | — | — | P2 | M | 14h | Medium |
| Invoice generation | ❌ | ❌ | ✅ | ✅ | — | ✅ | ✅ | ❌ | P2 | M | 10h | Medium |
| Accounting integration | ❌ | ❌ | ✅ | ✅ | — | — | — | — | P3 | XL | 60h | Low (enterprise) |

---

## SECTION L — SECURITY & AUTH

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Email/password auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Two-factor authentication (2FA)** | ❌ | ✅ | ✅ | — | ✅ | ✅ | — | — | P1 | M | 12h | High — security |
| OAuth / Google SSO | ❌ | ❌ | ✅ | — | ✅ | — | — | — | P1 | M | 10h | High — reduce friction |
| **Firestore security rules** | ❌ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | **P0** | **S** | **4h** | **Critical** |
| Server-side auth gate (middleware) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | M | 10h | **Critical** |
| **Admin email hardcoded in source** | 🔴BAD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | **P0** | **S** | **3h** | **Critical** |
| Field-level permissions per role | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | L | 24h | High |
| Audit log (who changed what) | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High — compliance |
| Rate limiting on API | ❌ | — | ✅ | — | ✅ | ✅ | ✅ | — | P1 | S | 3h | Medium |
| CORS restricted to allowlist | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | S | 1h | Medium |
| Input validation (Zod/server) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | M | 8h | High |
| Password change enforcement | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Good |
| GDPR / data privacy tools | ❌ | ❌ | ⚡ | — | ✅ | — | — | — | P2 | L | 20h | Medium |

---

## SECTION M — PERFORMANCE

| Feature | EduTrack | NextJS-SMS | ERPNext | OpenEduCat | Moodle | openSIS | RosarioSIS | Fedena | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Pagination on all list pages** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **M** | **10h** | **Critical — cost & UX** |
| Lazy loading routes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | — | — | — | Good |
| **Query stale time (cache)** | ❌ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | P1 | S | 2h | High |
| Offline / service worker | ❌ | — | — | — | ✅ | — | — | — | P2 | L | 20h | Medium |
| Background job queue | ❌ | — | ✅ | ✅ | ✅ | — | ✅ | ✅ | P2 | L | 24h | Medium |
| Server-side search / filtering | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 10h | High |
| Image optimisation | ❌ | ✅ | ✅ | — | ✅ | — | — | — | P2 | S | 4h | Medium |
| React.memo on static components | ❌ | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | P1 | S | 3h | Medium |
| Firestore composite indexes | ❌ | N/A | ✅ | ✅ | N/A | N/A | N/A | N/A | P1 | S | 4h | High |

---

## SECTION N — UI / UX

| Feature | EduTrack | shadcn/ui | MagicUI | Tremor | React-Bits | OriginUI | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|---|
| Skeleton loaders | ❌ | ✅ | ✅ | ✅ | — | — | **P0** | **S** | **4h** | **High** |
| Empty states with CTAs | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | **P0** | **S** | **6h** | **High** |
| Error boundary / fallback | ❌ | ✅ | — | — | — | — | **P0** | **S** | **3h** | **High** |
| Confirm dialogs (not `window.confirm`) | ❌ | ✅ | — | — | — | — | **P0** | **S** | **4h** | **High** |
| Global search (Cmd+K) | ❌ | ✅ (cmdk) | — | — | — | ✅ | P1 | M | 10h | High |
| **Animated count-up on stats** | ❌ | — | ✅ | — | — | — | P1 | S | 3h | High |
| **Page transition animations** | ⚡ | — | ✅ (BlurFade) | — | — | — | P1 | S | 4h | High |
| **List stagger animations** | ❌ | — | ✅ | — | ✅ | — | P1 | S | 4h | High |
| Confetti on milestone events | ❌ | — | ✅ | — | — | — | P2 | S | 2h | Medium |
| Dark mode | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | P2 | L | 20h | Medium |
| Responsive mobile layout | ⚡ | ✅ | ✅ | ✅ | ✅ | ✅ | P1 | M | 14h | High |
| Bottom nav for mobile | ❌ | — | — | — | ✅ (Dock) | — | P1 | S | 5h | High |
| Sidebar collapse / mini-mode | ❌ | ✅ | — | — | — | — | P1 | S | 6h | High |
| Breadcrumb navigation | ❌ | ✅ | — | — | — | — | P1 | S | 3h | Medium |
| **Keyboard shortcuts** | ❌ | ✅ | — | — | — | — | P2 | M | 8h | Medium |
| Inline form validation | ❌ | ✅ (react-hook-form) | — | — | — | ✅ | P1 | M | 8h | High |
| Optimistic updates | ❌ | — | — | — | — | — | P1 | M | 10h | High |
| Multi-step forms / wizard | ❌ | — | — | — | — | ✅ | P1 | M | 12h | High |
| Toast notifications (consistent) | ⚡ | ✅ (Sonner) | — | — | — | — | P1 | S | 3h | High |
| **WCAG AA accessibility** | ❌ | ✅ | ⚡ | ✅ | ⚡ | ✅ | P1 | L | 20h | High |

---

## SECTION O — SAAS / PLATFORM

| Feature | EduTrack | ERPNext | Moodle | openSIS | RosarioSIS | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|---|
| **Onboarding wizard (first-run)** | ❌ | ⚡ | — | ✅ | — | **P0** | **L** | **24h** | **Very High** |
| **Subscription billing (Stripe)** | ❌ | ✅ | ⚡ | — | — | P1 | L | 30h | Very High |
| Plan limits enforcement | ❌ | ✅ | — | — | — | P1 | M | 14h | High |
| Org settings page | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Core |
| **Super admin analytics (MRR/churn)** | ⚡ | ✅ | — | — | — | P1 | M | 14h | Very High |
| Impersonation (debug as org) | ✅ | ✅ | — | — | — | — | — | — | Good |
| Audit logs (super admin) | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | Good |
| White-labelling | ❌ | ✅ | ✅ | ⚡ | — | P3 | XL | 60h | Medium (enterprise) |
| **PWA / install prompt** | ❌ | — | ✅ | — | — | P2 | M | 10h | Medium |
| Public join link (invite code) | ✅ | — | ✅ | — | — | — | — | — | Good |

---

## SECTION P — AI / INTELLIGENT FEATURES

| Feature | EduTrack | ERPNext | OpenEduCat | Moodle | Priority | Difficulty | Est. Hours | Business Impact |
|---|---|---|---|---|---|---|---|---|
| **Student at-risk detection** | ❌ | — | — | ✅ | P2 | XL | 60h | Very High — differentiator |
| Automated fee reminder scheduling | ❌ | ✅ | ✅ | — | **P0** | M | 10h | Very High |
| Smart attendance patterns (low % alert) | ❌ | — | ✅ | ✅ | P1 | M | 12h | High |
| AI chatbot (student Q&A) | ❌ | — | — | ⚡ | P3 | XL | 80h | Medium |
| Predictive exam performance | ❌ | — | — | ✅ | P2 | XL | 60h | High |
| Auto-suggest batch assignment | ❌ | — | — | — | P3 | L | 30h | Medium |
| Natural language report queries | ❌ | — | — | — | P3 | XL | 80h | Medium |

---

# MASTER PRIORITY SUMMARY

## P0 — Fix Now (Critical / Blocking)

| # | Feature | Hours | Impact |
|---|---|---|---|
| 1 | Firestore security rules | 4h | Critical — data breach risk |
| 2 | Remove hardcoded admin email | 3h | Critical — public GitHub exposure |
| 3 | Pagination on all list hooks | 10h | Critical — cost + scalability |
| 4 | Skeleton loaders on all lists | 4h | High — UX |
| 5 | Empty states with CTA buttons | 6h | High — onboarding |
| 6 | Error boundary on every page | 3h | High — reliability |
| 7 | `window.confirm` → shadcn AlertDialog | 4h | High — UX |
| 8 | Per-student marks entry (exam results) | 12h | Very High — core missing feature |
| 9 | Batch management | 12h | Very High — coaching USP |
| 10 | Student homework submission | 14h | Very High — core missing feature |
| 11 | Automated email/SMS fee reminders | 12h | Very High — cash flow |
| 12 | Fee defaulters list + alerts | 4h | Very High — cash flow |
| 13 | Attendance % calculation | 4h | Very High |
| 14 | Parent portal + guardian link | 32h | Very High |
| 15 | Lead/inquiry CRM pipeline | 28h | Very High — growth |
| 16 | Onboarding wizard | 24h | Very High — activation |
| 17 | Input validation (Zod on writes) | 8h | High — data integrity |
| **Total P0** | | **~184h** | |

## P1 — High Impact (Next Sprint)

Revenue trend charts · Attendance heatmap · Exam analytics · Online payment (Stripe) · Fee structure templates · Student progression tracking · Teacher timetable view · Conflict detection · OAuth/Google SSO · 2FA · Audit log · Global search (Cmd+K) · Animated stat cards · Page transitions · Mobile responsive improvements · Inline form validation · Optimistic updates · Server-side search · React.memo on Sidebar

**~210h total**

## P2 — Medium (Following Sprint)

PWA manifest · Dark mode · Keyboard shortcuts · Bulk attendance marking · Student academic history · Subscription billing · Super admin MRR dashboard · Background job queue · Offline Firestore · Push notifications · Custom fields · Leave management · Budget planning · Quiz engine (MVP)

**~280h total**

## P3 — Roadmap

White-labelling · Custom report builder · Alumni module · Transportation · Library management · AI at-risk prediction · NLP reports · Full LMS · Accounting integration

**~400h total**

---

# COMPONENT UPGRADE MAP

## Current → Best Available Replacement

| Current in EduTrack | Replace With | From Library | Benefit |
|---|---|---|---|
| Basic stat cards (plain numbers) | `AreaChart` + `BadgeDelta` + GSAP count-up | Tremor + GSAP | Animated, contextual |
| `window.confirm()` delete | `AlertDialog` | shadcn/ui | Accessible, brandable |
| Spinner loading state | `Skeleton` | shadcn/ui | Layout-preserving |
| Plain "No data" text | Custom `EmptyState` | shadcn/ui + MagicUI SpotlightCard | Actionable, delightful |
| Basic toast | `Sonner` | shadcn/ui | Stacked, dismissible |
| Sidebar (no collapse) | `Sidebar` (collapsible) | shadcn/ui | Space efficient |
| No search | `Command` (cmdk) | shadcn/ui | Keyboard-first |
| Basic form inputs | `react-hook-form` + Zod | shadcn/ui | Inline validation |
| No page transitions | `AnimatePresence` + `BlurFade` | Framer Motion + MagicUI | Professional feel |
| No list animations | `motion.div` variants + stagger | Framer Motion | Perceived performance |
| No milestone feedback | `Confetti` | MagicUI | Emotional engagement |
| No mobile nav | `Dock` | React-Bits | Thumb-friendly |
| Basic onboarding | `AnimatedBeam` wizard | MagicUI | Guided activation |
| No charts | `BarChart` + `AreaChart` + `DonutChart` | Tremor / Recharts | Data-driven decisions |
