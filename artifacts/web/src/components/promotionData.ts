import { PLAN_CONFIG, formatBnTaka } from "@/lib/plan-config";

export interface PromoBanner {
  tag: string;
  headline: string;
  subtext: string;
  cta: string;
  gradient: string;
  accentColor: string;
  textColor: string;
  iconPath: string; // SVG path data
  imageUrl: string; // AI-generated photo
}

// Founder Launch price is pulled live from PLAN_CONFIG so this banner can
// never drift out of sync with the pricing cards / Super Admin plan config.
const founderPrice = formatBnTaka(PLAN_CONFIG.founder_launch.price);

export const promoBanners: PromoBanner[] = [
  {
    tag: "🎉 Free Trial চলছে",
    headline: "আজই আপনার Coaching Center ডিজিটাল করুন",
    subtext: "৩০ দিন সম্পূর্ণ ফ্রি — কোনো credit card দরকার নেই",
    cta: "ফ্রি শুরু করুন",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
    accentColor: "#818cf8",
    textColor: "#ffffff",
    iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    imageUrl: "/banners/slide-1.jpg",
  },
  {
    tag: "🔥 নতুন Feature",
    headline: "Online Admission Form",
    subtext: "Student নিজেরাই Registration করবে — আপনার সময় বাঁচুক",
    cta: "বিস্তারিত দেখুন",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #c2410c 45%, #ea580c 100%)",
    accentColor: "#fdba74",
    textColor: "#ffffff",
    iconPath:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6",
    imageUrl: "/banners/slide-2.jpg",
  },
  {
    tag: "⚡ Time Saver",
    headline: "Attendance ১ মিনিটে",
    subtext: "Teacher-এর মূল্যবান সময় বাঁচান — digital attendance এখন আরও সহজ",
    cta: "Explore",
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #059669 100%)",
    accentColor: "#6ee7b7",
    textColor: "#ffffff",
    iconPath:
      "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    imageUrl: "/banners/slide-3.jpg",
  },
  {
    tag: "💰 Limited Offer",
    headline: `Founder Launch মাত্র ${founderPrice}/মাস`,
    subtext: "ছোট Coaching Center-এর জন্য সেরা — আজই subscribe করুন",
    cta: "Subscribe",
    gradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 45%, #7c3aed 100%)",
    accentColor: "#c4b5fd",
    textColor: "#ffffff",
    iconPath:
      "M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4Z",
    imageUrl: "/banners/slide-4.jpg",
  },
  {
    tag: "🚀 Smart Coaching",
    headline: "Results, Fees, Attendance — সব এক জায়গায়",
    subtext: "একটি platform-এই সব কিছু manage করুন। আজই live demo দেখুন।",
    cta: "Live Demo",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #0ea5e9 100%)",
    accentColor: "#7dd3fc",
    textColor: "#ffffff",
    iconPath:
      "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    imageUrl: "/banners/slide-5.jpg",
  },
];
