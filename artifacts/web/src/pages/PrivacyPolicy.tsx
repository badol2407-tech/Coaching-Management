import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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

      <main className="max-w-4xl mx-auto px-4 py-12 prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-8">সর্বশেষ আপডেট: জুলাই ২০২৫</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">১. তথ্য সংগ্রহ</h2>
            <p className="text-muted-foreground">
              EduTrack আপনার account তৈরির সময় নাম, email address এবং organization তথ্য সংগ্রহ করে।
              Coaching center-এর data যেমন student তথ্য, attendance, fees — এগুলো শুধুমাত্র
              আপনার organization-এর ব্যবহারের জন্য সংরক্ষিত হয়।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">২. তথ্য ব্যবহার</h2>
            <p className="text-muted-foreground">
              আমরা আপনার তথ্য ব্যবহার করি:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li>আপনার account ও organization পরিচালনার জন্য</li>
              <li>আপনাকে product update ও support প্রদানের জন্য</li>
              <li>App-এর performance উন্নত করার জন্য (anonymized analytics)</li>
              <li>Payment processing-এর জন্য (প্রযোজ্য ক্ষেত্রে)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৩. তথ্য সুরক্ষা</h2>
            <p className="text-muted-foreground">
              আপনার সব তথ্য Google Firebase-এ encrypted অবস্থায় সংরক্ষিত হয়।
              Firebase Authentication ব্যবহার করে নিরাপদ login নিশ্চিত করা হয়।
              প্রতিটি organization-এর data সম্পূর্ণ isolated — অন্য organization-এর কেউ
              আপনার data দেখতে পারবে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৪. তৃতীয় পক্ষের সেবা</h2>
            <p className="text-muted-foreground">
              EduTrack নিচের third-party services ব্যবহার করে:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li><strong>Google Firebase</strong> — Authentication ও Database</li>
              <li><strong>PostHog</strong> — Product analytics (anonymized)</li>
              <li><strong>SSLCommerz</strong> — Payment processing (Bangladesh)</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              এই services-গুলোর নিজস্ব privacy policy রয়েছে।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৫. Data মুছে ফেলা</h2>
            <p className="text-muted-foreground">
              আপনি যেকোনো সময় আপনার account ও সব data মুছে ফেলার request করতে পারেন।
              WhatsApp বা email-এ যোগাযোগ করুন এবং আমরা ৭ কার্যদিবসের মধ্যে আপনার
              request পূরণ করব।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৬. যোগাযোগ</h2>
            <p className="text-muted-foreground">
              Privacy সংক্রান্ত যেকোনো প্রশ্নের জন্য:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
              <li>WhatsApp: <a href="https://wa.me/8801632905056" className="text-primary hover:underline">01632905056</a></li>
              <li>Email: <a href="mailto:ashikuryt68@gmail.com" className="text-primary hover:underline">ashikuryt68@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 text-center text-sm text-muted-foreground">
        © 2025 EduTrack. 🇧🇩 Bangladesh-এ তৈরি
      </footer>
    </div>
  );
}
