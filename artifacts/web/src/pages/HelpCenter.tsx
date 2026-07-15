import { useState } from "react";
import {
  HelpCircle, Users, GraduationCap, CalendarCheck, Wallet,
  ClipboardList, Bell, Receipt, LayoutDashboard, BookOpen,
  ChevronDown, ChevronRight, MessageCircle, Shield, Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FAQItem {
  q: string;
  a: string;
}

interface Section {
  icon: React.ElementType;
  title: string;
  color: string;
  faqs: FAQItem[];
}

const adminSections: Section[] = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    color: "text-blue-600 bg-blue-100",
    faqs: [
      { q: "Dashboard-এ কী কী দেখা যায়?", a: "Dashboard-এ আপনার coaching center-এর real-time summary দেখা যায়: মোট students, teachers, আজকের attendance হার, এই মাসের fee collection, এবং pending fees। নিচে একটি attendance chart আছে যেটা গত ৭ দিনের trend দেখায়।" },
      { q: "Dashboard কতক্ষণ পর পর update হয়?", a: "Dashboard real-time — Firebase Firestore থেকে সরাসরি data আসে। কোনো change হলে সাথে সাথে update হয়ে যায়।" },
    ],
  },
  {
    icon: Users,
    title: "Students Management",
    color: "text-green-600 bg-green-100",
    faqs: [
      { q: "নতুন student কীভাবে যোগ করব?", a: "Students → 'Add Student' button click করুন। নাম, class, phone, email এবং monthly fee amount দিন। Save করলে student list-এ যোগ হবে এবং automatically সেই মাসের fee record তৈরি হবে।" },
      { q: "Student-এর information কীভাবে edit করব?", a: "Students page-এ student-এর row-এ click করুন অথবা edit icon-এ click করুন। যা change করতে চান তা update করে Save করুন।" },
      { q: "Student delete করলে কী হবে?", a: "Student delete করলে তার সব data (attendance, fees, exam results) মুছে যাবে। এটা permanent — recover করা যাবে না। তাই delete করার আগে নিশ্চিত হন।" },
      { q: "Students-দের Organization Code কীভাবে দেব?", a: "Left sidebar-এ 'Org Code' section-এ আপনার organization-এর unique code আছে। Copy করে students-দের দিন। তারা register করে সেই code দিয়ে join করবে।" },
    ],
  },
  {
    icon: GraduationCap,
    title: "Teachers Management",
    color: "text-purple-600 bg-purple-100",
    faqs: [
      { q: "নতুন teacher কীভাবে যোগ করব?", a: "Teachers → 'Add Teacher' button click করুন। নাম, subject, phone, salary এবং joining date দিন। Teacher-কে Org Code দিলে তিনি নিজের account থেকে login করতে পারবেন।" },
      { q: "Teacher-এর salary কীভাবে track করব?", a: "প্রতিটি teacher-এর monthly salary Teachers page-এ দেখা যায়। Expenses page-এ salary হিসেবে manually expense add করতে পারেন।" },
    ],
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    color: "text-amber-600 bg-amber-100",
    faqs: [
      { q: "Attendance কীভাবে নেব?", a: "Attendance page-এ যান → Date এবং Class select করুন → প্রতিটি student-এর পাশে Present/Absent mark করুন → Save করুন। Teacher-রাও তাদের assigned class-এর attendance নিতে পারেন।" },
      { q: "পুরনো attendance কি edit করা যায়?", a: "হ্যাঁ। Attendance page-এ date select করলে সেই দিনের record দেখা যাবে। Edit করে Save করুন।" },
      { q: "Attendance report কোথায় দেখব?", a: "Dashboard-এ weekly attendance chart আছে। Students page-এ প্রতিটি student-এর attendance percentage দেখা যায়।" },
    ],
  },
  {
    icon: Wallet,
    title: "Fee Management",
    color: "text-red-600 bg-red-100",
    faqs: [
      { q: "Fee কীভাবে mark paid করব?", a: "Fees page-এ যান → Unpaid filter select করুন → যে student fee দিয়েছে তার পাশের 'Mark Paid' button-এ click করুন। Automatically payment date record হবে।" },
      { q: "কোন student fees দেয়নি তা কীভাবে দেখব?", a: "Fees page-এ 'Unpaid' filter select করুন। এই মাসের সব unpaid fee list দেখাবে।" },
      { q: "Fee amount পরিবর্তন করলে কী হয়?", a: "Student-এর fee amount পরিবর্তন করলে পরের মাস থেকে নতুন amount প্রযোজ্য হবে। বর্তমান মাসের fee manually update করতে Fees page থেকে edit করুন।" },
      { q: "Previous months-এর fees দেখব কীভাবে?", a: "Fees page-এ month filter আছে। যে মাসের fees দেখতে চান সেটা select করুন।" },
    ],
  },
  {
    icon: ClipboardList,
    title: "Exams & Results",
    color: "text-indigo-600 bg-indigo-100",
    faqs: [
      { q: "নতুন exam কীভাবে তৈরি করব?", a: "Exams → 'Create Exam' button → Exam-এর নাম, subject, date, এবং total marks দিন। Save করার পর results enter করতে পারবেন।" },
      { q: "Exam results কীভাবে enter করব?", a: "Exams page-এ exam-এর row-এ click করুন। প্রতিটি student-এর obtained marks এবং grade enter করুন। Students তাদের portal থেকে results দেখতে পারবে।" },
    ],
  },
  {
    icon: Bell,
    title: "Notices",
    color: "text-pink-600 bg-pink-100",
    faqs: [
      { q: "Notice কীভাবে post করব?", a: "Notices → 'Add Notice' button → Title এবং content লিখুন → Post করুন। সব teachers ও students তাদের portal থেকে notice দেখতে পারবে।" },
      { q: "Notice delete করলে কি সবার কাছ থেকে মুছে যাবে?", a: "হ্যাঁ। Notice delete করলে সব users-এর কাছ থেকে immediately মুছে যাবে।" },
    ],
  },
  {
    icon: Receipt,
    title: "Expenses",
    color: "text-teal-600 bg-teal-100",
    faqs: [
      { q: "Expense কীভাবে add করব?", a: "Expenses → 'Add Expense' button → Amount, category (Rent, Salary, Utilities, Others), এবং description দিন। এই data শুধু Org Admin দেখতে পারবে।" },
      { q: "Monthly expense summary কোথায় দেখব?", a: "Dashboard-এ total monthly expense দেখা যায়। Expenses page-এ month filter দিয়ে detailed breakdown দেখতে পারবেন।" },
    ],
  },
  {
    icon: BookOpen,
    title: "Classes & Routine",
    color: "text-orange-600 bg-orange-100",
    faqs: [
      { q: "Class কীভাবে তৈরি করব?", a: "Classes page-এ 'Add Class' button click করুন। Class-এর নাম এবং assigned teacher দিন। এই class-এ students enroll হবে।" },
      { q: "Class routine কীভাবে set করব?", a: "Routine page-এ প্রতিটি class-এর জন্য weekly schedule set করতে পারবেন — কোন দিন, কোন time, কোন teacher।" },
    ],
  },
  {
    icon: Settings,
    title: "Settings",
    color: "text-slate-600 bg-slate-100",
    faqs: [
      { q: "Organization-এর নাম পরিবর্তন করব কীভাবে?", a: "Settings page-এ organization name এবং other details update করতে পারবেন।" },
      { q: "নিজের account delete করলে কী হবে?", a: "Account delete করলে সব organization data মুছে যাবে। এটা irreversible। Delete করার আগে data backup নিন।" },
    ],
  },
];

const teacherGuide: FAQItem[] = [
  { q: "Teacher হিসেবে কীভাবে login করব?", a: "Admin-এর কাছ থেকে Organization Code নিন। EduTrack-এ register করুন এবং Setup page-এ 'Teacher' role select করে Org Code দিন।" },
  { q: "Attendance কীভাবে নেব?", a: "Attendance page-এ যান → Date এবং Class select করুন → Students-দের Present/Absent mark করুন → Save করুন।" },
  { q: "Students-এর তথ্য দেখতে পারব?", a: "হ্যাঁ। Students page-এ আপনার organization-এর সব students-এর basic information দেখতে পারবেন।" },
  { q: "Exam results enter করতে পারব?", a: "হ্যাঁ। Exams page-এ exam select করে students-দের marks enter করতে পারবেন।" },
  { q: "Settings কোথায়?", a: "Left sidebar-এর নিচে Settings আছে। সেখানে আপনার profile information update করতে পারবেন।" },
];

const studentGuide: FAQItem[] = [
  { q: "Student হিসেবে কীভাবে login করব?", a: "Admin-এর কাছ থেকে Organization Code নিন। EduTrack-এ register করুন এবং Setup page-এ 'Student' role select করে Org Code দিন।" },
  { q: "নিজের fees দেখব কীভাবে?", a: "Student Portal-এ আপনার এই মাসের fee status দেখা যাবে — paid নাকি unpaid।" },
  { q: "Attendance কোথায় দেখব?", a: "Student Portal-এ আপনার attendance percentage এবং recent records দেখতে পারবেন।" },
  { q: "Exam results কোথায় পাব?", a: "Student Portal-এ সব exam-এর results দেখা যাবে — marks, grade সহ।" },
  { q: "Notices কোথায় দেখব?", a: "Notices page-এ admin ও teachers-এর সব notices দেখতে পারবেন।" },
];

function AccordionItem({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        {open ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const { userProfile } = useAuth();
  const role = userProfile?.role ?? "org_admin";
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const whatsappMsg = encodeURIComponent("EduTrack সম্পর্কে একটা প্রশ্ন আছে।");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <HelpCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Help Center</h1>
          <p className="text-sm text-muted-foreground">
            {role === "teacher" ? "Teacher Guide" : role === "student" ? "Student Guide" : "Admin User Guide"} — সব প্রশ্নের উত্তর এখানে
          </p>
        </div>
      </div>

      {/* Quick contact */}
      <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
        <MessageCircle className="h-5 w-5 text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">উত্তর খুঁজে পাচ্ছেন না?</p>
          <p className="text-xs text-green-600 dark:text-green-400">WhatsApp-এ সরাসরি জিজ্ঞেস করুন — ২৪ ঘণ্টায় উত্তর পাবেন।</p>
        </div>
        <a
          href={`https://wa.me/8801632905056?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md font-medium transition-colors"
        >
          WhatsApp
        </a>
      </div>

      {/* Teacher Guide */}
      {role === "teacher" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Teacher Guide</h2>
          {teacherGuide.map((item) => <AccordionItem key={item.q} {...item} />)}
        </div>
      )}

      {/* Student Guide */}
      {role === "student" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Student Guide</h2>
          {studentGuide.map((item) => <AccordionItem key={item.q} {...item} />)}
        </div>
      )}

      {/* Admin Guide — all sections */}
      {(role === "org_admin" || role === "super_admin") && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Admin Guide</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {adminSections.map((s) => (
              <button
                key={s.title}
                onClick={() => setActiveSection(activeSection === s.title ? null : s.title)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  activeSection === s.title ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
              >
                <div className={`h-8 w-8 rounded-lg ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{s.title}</span>
                {activeSection === s.title
                  ? <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
                  : <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />}
              </button>
            ))}
          </div>

          {activeSection && (() => {
            const section = adminSections.find((s) => s.title === activeSection);
            if (!section) return null;
            return (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <section.icon className="h-4 w-4" />
                  {section.title} — বিস্তারিত
                </h3>
                {section.faqs.map((item) => <AccordionItem key={item.q} {...item} />)}
              </div>
            );
          })()}

          {!activeSection && (
            <p className="text-sm text-muted-foreground text-center py-4">
              উপরে যেকোনো section select করুন বিস্তারিত দেখতে।
            </p>
          )}
        </div>
      )}

      {/* Security note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
        <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Data Security</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            আপনার সব data Firebase-এ encrypted। Organization-wise isolation — অন্য কেউ আপনার data দেখতে পারবে না।
            আরও জানতে <a href="/privacy" className="underline">Privacy Policy</a> দেখুন।
          </p>
        </div>
      </div>
    </div>
  );
}
