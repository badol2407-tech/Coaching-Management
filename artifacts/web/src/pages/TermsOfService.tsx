import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-8">সর্বশেষ আপডেট: জুলাই ২০২৫</p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">১. সেবার বিবরণ</h2>
            <p className="text-muted-foreground">
              EduTrack একটি Software-as-a-Service (SaaS) platform যা Bangladesh-এর coaching center
              পরিচালনার জন্য তৈরি। এই platform ব্যবহার করে আপনি students, teachers, attendance,
              fees, exams ও expenses manage করতে পারবেন।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">২. ব্যবহারের শর্ত</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>আপনাকে কমপক্ষে ১৮ বছর বয়সী হতে হবে।</li>
              <li>আপনি যে তথ্য দিচ্ছেন তা সঠিক ও সত্য হতে হবে।</li>
              <li>একটি account একটি organization-এর জন্য — ব্যক্তিগত ব্যবহারের জন্য নয়।</li>
              <li>আপনার account-এর security আপনার দায়িত্ব।</li>
              <li>EduTrack-এর platform abuse বা misuse করা যাবে না।</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৩. Free Trial ও Subscription</h2>
            <p className="text-muted-foreground">
              নতুন account তৈরির পর ৩০ দিন সম্পূর্ণ বিনামূল্যে সব features ব্যবহার করা যাবে।
              Trial শেষে একটি paid plan select করতে হবে অথবা account inactive হয়ে যাবে।
              Subscription বাতিল করলে বাকি মাসের টাকা ফেরত দেওয়া হবে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৪. Data মালিকানা</h2>
            <p className="text-muted-foreground">
              আপনার coaching center-এর সব data আপনার। EduTrack শুধুমাত্র আপনার হয়ে
              এই data store ও process করে। আমরা আপনার data তৃতীয় পক্ষের কাছে বিক্রি করি না।
              Account বন্ধ করার আগে আপনি আপনার data export করতে পারবেন।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৫. Service Availability</h2>
            <p className="text-muted-foreground">
              আমরা ৯৯.৯% uptime নিশ্চিত করার চেষ্টা করি। তবে maintenance বা অপ্রত্যাশিত
              কারণে service temporarily unavailable হতে পারে। এজন্য EduTrack দায়বদ্ধ নয়।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৬. সীমাবদ্ধতা</h2>
            <p className="text-muted-foreground">
              EduTrack কোনো ক্ষতির জন্য দায়ী নয় যা platform ব্যবহার বা না-ব্যবহারের
              ফলে হতে পারে। আমাদের সর্বোচ্চ দায়বদ্ধতা আপনার সর্বশেষ মাসের subscription
              মূল্যের বেশি হবে না।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৭. পরিবর্তন</h2>
            <p className="text-muted-foreground">
              EduTrack যেকোনো সময় এই Terms পরিবর্তন করতে পারে। বড় পরিবর্তনের আগে
              আমরা আপনাকে email-এ জানাব। পরিবর্তনের পরও platform ব্যবহার করলে নতুন
              Terms মেনে নিয়েছেন বলে ধরা হবে।
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">৮. যোগাযোগ</h2>
            <p className="text-muted-foreground">
              Terms সংক্রান্ত যেকোনো প্রশ্নের জন্য:
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
