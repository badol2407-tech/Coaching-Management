import { useState } from "react";
import { GraduationCap, ArrowLeft, ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";

const faqs = [
  {
    category: "সাধারণ প্রশ্ন",
    items: [
      { q: "EduTrack কী?", a: "EduTrack হলো Bangladesh-এর coaching center-গুলোর জন্য একটি সম্পূর্ণ management system। Students, Teachers, Attendance, Fees, Exams, Notices — সব কিছু এক জায়গায় manage করা যায়।" },
      { q: "EduTrack কি বাংলায় ব্যবহার করা যায়?", a: "হ্যাঁ। EduTrack সম্পূর্ণ বাংলা ভাষায় তৈরি। Interface, notifications, messages — সব বাংলায়।" },
      { q: "Mobile-এ EduTrack ব্যবহার করা যাবে?", a: "হ্যাঁ। EduTrack mobile-friendly। যেকোনো smartphone-এর browser থেকে ব্যবহার করা যাবে। আলাদা app download করতে হবে না।" },
      { q: "Internet ছাড়া কাজ করে?", a: "না। EduTrack cloud-based — data save করতে এবং দেখতে internet connection দরকার।" },
    ],
  },
  {
    category: "Account ও Setup",
    items: [
      { q: "কীভাবে শুরু করব?", a: "'বিনামূল্যে শুরু করুন' button-এ click করুন → Google বা Email দিয়ে register করুন → Setup page-এ 'Org Admin' role select করুন → Organization-এর নাম দিন। ব্যস! আপনার coaching center ready।" },
      { q: "Teachers ও Students কীভাবে যোগ করব?", a: "Setup-এর পর আপনি একটি unique Organization Code পাবেন। এই code teachers ও students-দের দিন। তারা register করে সেই code দিলে automatically আপনার organization-এ join হবে।" },
      { q: "একটি account দিয়ে কি একাধিক branch manage করা যাবে?", a: "Pro plan-এ একাধিক branch support আছে। Free Trial ও Basic plan-এ শুধুমাত্র ১টি branch।" },
      { q: "Password ভুলে গেলে কী করব?", a: "Login page-এ 'Password ভুলে গেছেন?' link-এ click করুন। Email-এ password reset link পাঠানো হবে।" },
    ],
  },
  {
    category: "Pricing ও Payment",
    items: [
      { q: "Free trial-এ কতদিন সব features ব্যবহার করা যাবে?", a: "৩০ দিন সম্পূর্ণ বিনামূল্যে। কোনো credit card লাগবে না। ৩০ দিন পরে একটি plan select করতে হবে।" },
      { q: "Subscription কীভাবে করব?", a: "App-এ Subscription page থেকে plan select করুন। bKash, Nagad, card — যেকোনো উপায়ে payment করা যাবে (SSLCommerz gateway)।" },
      { q: "Subscription cancel করলে কি refund পাব?", a: "Subscription cancel করলে বাকি মাসের service পাবেন কিন্তু টাকা refund হবে না। বিস্তারিত জানতে Refund Policy দেখুন।" },
      { q: "Plan upgrade করা যাবে?", a: "হ্যাঁ, যেকোনো সময় Basic থেকে Pro-তে upgrade করা যাবে।" },
    ],
  },
  {
    category: "Data ও Security",
    items: [
      { q: "আমার data কি safe?", a: "হ্যাঁ। সব data Google Firebase-এ encrypted অবস্থায় store হয়। Organization-wise isolation — অন্য কোনো coaching center আপনার data দেখতে পারবে না।" },
      { q: "Data export করা যাবে?", a: "Basic ও Pro plan-এ data export feature আছে। Free trial-এ export সীমিত।" },
      { q: "Account বন্ধ করলে data কী হবে?", a: "Account বন্ধ করার request করলে আমরা আপনার data ৭ দিনের মধ্যে মুছে দেব। আগে export করে নিন।" },
    ],
  },
  {
    category: "Technical সমস্যা",
    items: [
      { q: "Login হচ্ছে না কেন?", a: "১. Internet connection check করুন। ২. Email ও password সঠিক কিনা দেখুন। ৩. Google দিয়ে login চেষ্টা করুন। ৪. তারপরও না হলে WhatsApp-এ যোগাযোগ করুন।" },
      { q: "Page load হচ্ছে না বা খুব slow কেন?", a: "Browser cache clear করুন (Ctrl+Shift+Delete)। অন্য browser দিয়ে চেষ্টা করুন। Internet connection check করুন।" },
      { q: "Data save হচ্ছে না কেন?", a: "Internet connection check করুন। Page refresh করে আবার চেষ্টা করুন। সমস্যা থাকলে WhatsApp-এ জানান।" },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        {open
          ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const whatsappMsg = encodeURIComponent("EduTrack সম্পর্কে একটা প্রশ্ন আছে।");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            EduTrack
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">সচরাচর জিজ্ঞাসা (FAQ)</h1>
          <p className="text-muted-foreground">EduTrack সম্পর্কে সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নের উত্তর</p>
        </div>

        <div className="space-y-10">
          {faqs.map((cat) => (
            <section key={cat.category}>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-border">{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => <FAQItem key={item.q} {...item} />)}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl text-center space-y-3">
          <MessageCircle className="h-8 w-8 text-green-500 mx-auto" />
          <h3 className="font-semibold">আপনার প্রশ্নের উত্তর পাননি?</h3>
          <p className="text-sm text-muted-foreground">WhatsApp-এ সরাসরি জিজ্ঞেস করুন। আমরা সাধারণত কয়েক ঘণ্টার মধ্যে উত্তর দিই।</p>
          <a
            href={`https://wa.me/8801632905056?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp-এ জিজ্ঞেস করুন
          </a>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4">
          <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
          <a href="/refund" className="hover:text-foreground">Refund Policy</a>
        </div>
        <p className="mt-2">© 2025 EduTrack. 🇧🇩 Bangladesh-এ তৈরি</p>
      </footer>
    </div>
  );
}
