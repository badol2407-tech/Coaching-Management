/**
 * CENTRALIZED PLAN CONFIGURATION — single source of truth for:
 *   - Plan name, price, billing cycle
 *   - Trial/subscription expiry logic
 *   - Full internal feature permissions
 *   - Landing-page pricing-card highlights
 *
 * Both the landing-page pricing cards and portal feature-access rules
 * derive from this file so they can never become mismatched.
 */

// ── Tier types ─────────────────────────────────────────────────────────────────

export type PlanTier = "free_trial" | "founder_launch" | "annual_premium";

// ── Full internal feature list ─────────────────────────────────────────────────

export interface PlanFeatures {
  // Core organization management
  studentManagement: boolean;
  teacherManagement: boolean;
  attendance: boolean;
  fees: boolean;
  exams: boolean;
  homework: boolean;
  notices: boolean;
  routine: boolean;
  classes: boolean;
  expenses: boolean;
  // Portals
  orgAdminPortal: boolean;
  teacherPortal: boolean;
  studentPortal: boolean;
  // Premium features
  analytics: boolean;
  dataExport: boolean;
  customBranding: boolean;
  // Annual Premium exclusive
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  earlyAccess: boolean;
  annualPerformanceReport: boolean;
  invoiceBillingSupport: boolean;
}

// ── Plan config shape ──────────────────────────────────────────────────────────

export interface PlanConfig {
  id: PlanTier;
  name: string;
  price: number; // BDT
  billingCycle: "trial" | "monthly" | "annual";
  trialDays: number; // only for trial
  features: PlanFeatures;
  // Landing-page display ONLY — keep short (main selling points)
  displayHighlights: string[];
  badge?: string;
  tagline: string;
  regularPrice?: number;
  savings?: string;
  annualBenefit?: string;
  spotsLeft?: string;
}

// ── Shared "all features on" base ─────────────────────────────────────────────

const CORE_FEATURES: PlanFeatures = {
  studentManagement: true,
  teacherManagement: true,
  attendance: true,
  fees: true,
  exams: true,
  homework: true,
  notices: true,
  routine: true,
  classes: true,
  expenses: true,
  orgAdminPortal: true,
  teacherPortal: true,
  studentPortal: true,
  analytics: true,
  dataExport: true,
  customBranding: true,
  prioritySupport: false,
  dedicatedAccountManager: false,
  earlyAccess: false,
  annualPerformanceReport: false,
  invoiceBillingSupport: false,
};

// ── Plan configurations ────────────────────────────────────────────────────────

export const PLAN_CONFIG: Record<PlanTier, PlanConfig> = {
  // FREE TRIAL — ৳0 / 7 DAYS
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    price: 0,
    billingCycle: "trial",
    trialDays: 7,
    features: {
      ...CORE_FEATURES,
      // Free trial gets all premium features for 7 days
      prioritySupport: true,
    },
    // Landing-page card: MAIN selling points only
    displayHighlights: [
      "৭ দিন সম্পূর্ণ বিনামূল্যে",
      "সব Premium features ব্যবহার করুন",
      "Credit Card লাগবে না",
      "যেকোনো সময় Cancel করুন",
    ],
    tagline: "ঝুঁকি ছাড়াই শুরু করুন",
  },

  // FOUNDER LAUNCH — ৳749/MONTH
  founder_launch: {
    id: "founder_launch",
    name: "Founder Launch",
    price: 749,
    billingCycle: "monthly",
    trialDays: 0,
    features: {
      ...CORE_FEATURES,
      prioritySupport: true,
    },
    // Landing-page card: MAIN selling points only
    displayHighlights: [
      "সব Premium features",
      "Unlimited Students & Teachers",
      "Priority Support",
      "Advanced Analytics",
      "Custom Branding",
      "Data Export",
    ],
    badge: "Most Popular",
    tagline: "প্রথম ১০০ Coaching Center-এর জন্য",
    regularPrice: 999,
    savings: "২৫% ছাড়",
    spotsLeft: "সীমিত আসন বাকি",
  },

  // ANNUAL PREMIUM — ৳9,999/YEAR
  annual_premium: {
    id: "annual_premium",
    name: "Annual Premium",
    price: 9999,
    billingCycle: "annual",
    trialDays: 0,
    features: {
      ...CORE_FEATURES,
      prioritySupport: true,
      dedicatedAccountManager: true,
      earlyAccess: true,
      annualPerformanceReport: true,
      invoiceBillingSupport: true,
    },
    // Landing-page card: MAIN selling points only
    displayHighlights: [
      "সব Founder features",
      "২ মাস বিনামূল্যে (মাসে মাত্র ৳833)",
      "Dedicated Account Manager",
      "Early access to new features",
      "Annual performance report",
      "Invoice & billing support",
    ],
    badge: "Best Value",
    tagline: "বছরে ২ মাস একদম বিনামূল্যে",
    regularPrice: 11988,
    savings: "৳1,989 সাশ্রয়",
    annualBenefit: "২ মাস বিনামূল্যে",
  },
};

// ── Utility helpers ───────────────────────────────────────────────────────────

/** Map legacy Firestore plan IDs ("free" | "basic" | "pro") to new tier IDs. */
export function mapLegacyPlanToTier(plan?: string | null): PlanTier {
  const mapping: Record<string, PlanTier> = {
    free: "free_trial",
    basic: "founder_launch",
    pro: "annual_premium",
    // New IDs pass through directly
    free_trial: "free_trial",
    founder_launch: "founder_launch",
    annual_premium: "annual_premium",
  };
  return mapping[plan ?? "free"] ?? "free_trial";
}

/** Derive a legacy plan string from a tier (for backward compat writes). */
export function tierToLegacyPlan(tier: PlanTier): string {
  const map: Record<PlanTier, string> = {
    free_trial: "free",
    founder_launch: "basic",
    annual_premium: "pro",
  };
  return map[tier];
}

/** Return the canonical tier for an org, preferring the new `tier` field. */
export function getEffectiveTier(org: { tier?: string | null; plan?: string | null }): PlanTier {
  return mapLegacyPlanToTier(org.tier ?? org.plan ?? "free");
}

/**
 * Compute a subscription expiry date from a start date and tier.
 * Free Trial → +7 days, Founder Launch → +1 month, Annual Premium → +1 year.
 */
export function computeExpiryDate(tier: PlanTier, startDate: Date = new Date()): Date {
  const d = new Date(startDate);
  if (tier === "free_trial") {
    d.setDate(d.getDate() + PLAN_CONFIG.free_trial.trialDays);
  } else if (tier === "founder_launch") {
    d.setMonth(d.getMonth() + 1);
  } else {
    d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

/** Human-readable tier label. */
export function getTierLabel(tier: PlanTier): string {
  return PLAN_CONFIG[tier].name;
}

/** Monthly equivalent price (for display). */
export function getMonthlyEquivalent(tier: PlanTier): number {
  const cfg = PLAN_CONFIG[tier];
  if (cfg.billingCycle === "annual") return Math.round(cfg.price / 12);
  return cfg.price;
}

/** All tiers as an ordered array for selects/tables. */
export const ALL_TIERS: PlanTier[] = ["free_trial", "founder_launch", "annual_premium"];

// ── Display formatting helpers ──────────────────────────────────────────────

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert an integer to Bengali numerals with thousands separators (e.g. 9999 -> "৯,৯৯৯"). */
export function toBnNumber(n: number): string {
  const withCommas = Math.round(n).toLocaleString("en-US");
  return withCommas.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Format a tier's price as a Bengali Taka string, e.g. "৳749" -> "৳৭৪৯". */
export function formatBnTaka(n: number): string {
  return `৳${toBnNumber(n)}`;
}

/**
 * Landing-page pricing-card display values, all derived from PLAN_CONFIG so the
 * banner, cards, and every price shown on the page can never drift out of sync.
 */
/** Short "price / cadence" label for admin selects and tables, e.g. "৳749/month". */
export function getTierPriceLabel(tier: PlanTier): string {
  const cfg = PLAN_CONFIG[tier];
  const cadence = cfg.billingCycle === "trial" ? `/ ${cfg.trialDays} days` : cfg.billingCycle === "monthly" ? "/month" : "/year";
  return `${formatBnTaka(cfg.price)} ${cadence}`;
}

export function getPricingDisplay(tier: PlanTier) {
  const cfg = PLAN_CONFIG[tier];
  return {
    price: formatBnTaka(cfg.price),
    regularPrice: cfg.regularPrice != null ? formatBnTaka(cfg.regularPrice) : null,
    savings: cfg.savings ?? null,
    monthlyEquivalent: cfg.billingCycle === "annual" ? formatBnTaka(getMonthlyEquivalent(tier)) : null,
  };
}
