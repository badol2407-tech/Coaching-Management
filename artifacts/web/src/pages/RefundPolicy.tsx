import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RefundPolicy() {
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
        <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">সর্বশেষ আপডেট: জুলাই ২০২৫</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">সংক্ষেপে আমাদের Refund Policy:</p>
            <p className="text-amber-700 dark:text-amber-300">
              আমরা refund দিতে চাই না — তবে সমস্যা হলে সমাধান করতে চাই।
              যদি কোনো technical issue-এর কারণে service ব্যবহার না করতে পারেন, আমরা অবশ্যই সাহায্য করব।
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">১. Free Trial</h2>
            <p className="text-muted-foreground">
              নতুন account তৈরির পর ৩০ দিন সম্পূর্ণ বিনামূল্যে। Trial period-এ কোনো payment নেওয়া হয় না,
              তাই refund-এর প্রশ্ন আসে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">২. Subscription Refund</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong className="text-foreground">সাধারণ নিয়ম:</strong> Subscription payment করার পর
                refund দেওয়া হয় না। Payment করলে বুঝে নেওয়া হয় যে আপনি Terms of Service-এ agree করেছেন।
              </p>
              <p>
                <strong className="text-foreground">Exception — Technical Problem:</strong> যদি payment
                করার পর ২৪ ঘণ্টার মধ্যে service activate না হয় অথবা কোনো major technical issue-এর কারণে
                service সম্পূর্ণ unusable হয়, তাহলে আমরা refund বিবেচনা করব।
              </p>
              <p>
                <strong className="text-foreground">Double Payment:</strong> ভুলবশত একই period-এ দুইবার
                payment হলে অতিরিক্ত amount সম্পূর্ণ refund করা হবে।
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৩. Refund কীভাবে request করবেন</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Refund request করতে হলে payment-এর <strong className="text-foreground">৭ দিনের মধ্যে</strong> যোগাযোগ করুন:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>WhatsApp: <a href="https://wa.me/8801632905056" className="text-primary hover:underline">01632905056</a></li>
                <li>Email: <a href="mailto:ashikuryt68@gmail.com" className="text-primary hover:underline">ashikuryt68@gmail.com</a></li>
              </ul>
              <p className="mt-2">
                যোগাযোগ করার সময় জানান: আপনার registered email, payment date, payment amount, এবং সমস্যার বিবরণ।
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৪. Refund Processing</h2>
            <p className="text-muted-foreground">
              Refund approve হলে আপনার original payment method-এ (bKash, Nagad, Card) ৫-৭ কার্যদিবসের
              মধ্যে return করা হবে। Mobile banking-এ সাধারণত ১-২ দিনেই আসে।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৫. Subscription Cancel করলে</h2>
            <p className="text-muted-foreground">
              Subscription cancel করলে বর্তমান billing period শেষ পর্যন্ত service পাবেন।
              Period শেষ হওয়ার পর account automatically inactive হবে। Unused days-এর টাকা refund হবে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৬. আমাদের commitment</h2>
            <p className="text-muted-foreground">
              আমাদের লক্ষ্য আপনাকে সর্বোত্তম service দেওয়া। কোনো সমস্যা হলে refund-এর আগে
              সমাধান করার চেষ্টা করব। আমাদের সাথে যোগাযোগ করুন — আমরা সাহায্য করতে সদা প্রস্তুত।
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4">
          <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
          <a href="/faq" className="hover:text-foreground">FAQ</a>
        </div>
        <p className="mt-2">© 2025 EduTrack. 🇧🇩 Bangladesh-এ তৈরি</p>
      </footer>
    </div>
  );
}
