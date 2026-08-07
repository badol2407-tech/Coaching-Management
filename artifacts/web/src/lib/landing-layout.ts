export const LANDING_WINDOW_IDS = ["health", "attendance", "fee", "results"] as const;

export type LandingWindowId = (typeof LANDING_WINDOW_IDS)[number];
export type LandingViewport = "desktop" | "mobile";

export type LandingWindowLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LandingViewportLayout = Record<LandingWindowId, LandingWindowLayout>;

export const LANDING_BLOCK_IDS = ["home", "features", "solutions", "pricing", "resources", "about"] as const;
export type LandingBlockId = (typeof LANDING_BLOCK_IDS)[number];

export type LandingBlock = {
  id: LandingBlockId;
  label: string;
  visible: boolean;
  title: string;
  description: string;
  customText: string[];
  sensitivity: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LandingPageLayout = {
  version: 2;
  desktop: LandingViewportLayout;
  mobile: LandingViewportLayout;
  blocks: Record<LandingBlockId, LandingBlock>;
  updatedAt?: string;
};

export const DEFAULT_LANDING_LAYOUT: LandingPageLayout = {
  version: 2,
  desktop: {
    health: { x: 20, y: 7, width: 15, height: 39 },
    attendance: { x: 58, y: 0, width: 16, height: 42 },
    fee: { x: 43, y: 58, width: 18.5, height: 43 },
    results: { x: 25, y: 51, width: 18.5, height: 49 },
  },
  mobile: {
    health: { x: 29, y: 0, width: 41, height: 19 },
    attendance: { x: 23, y: 21, width: 54, height: 22 },
    fee: { x: 19, y: 69, width: 61, height: 22 },
    results: { x: 20, y: 45, width: 60, height: 22 },
  },
  blocks: {
    home: {
      id: "home",
      label: "Hero & overview",
      visible: true,
      title: "এক প্ল্যাটফর্মে পুরো স্কুল পরিচালনা করুন",
      description: "EduTrack-এর মাধ্যমে attendance, fees, exams, results, notices এবং প্রতিদিনের school operations এক জায়গা থেকে সহজে পরিচালনা করুন।",
      customText: [],
      sensitivity: 72,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    features: {
      id: "features",
      label: "Features",
      visible: true,
      title: "সব কাজ, একটি পরিষ্কার workspace-এ",
      description: "Attendance থেকে analytics—EduTrack প্রতিদিনের school operations-কে কম manual এবং বেশি visible করে।",
      customText: [],
      sensitivity: 64,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    solutions: {
      id: "solutions",
      label: "Solutions",
      visible: true,
      title: "Admin থেকে student—একটি connected workflow",
      description: "যে role-ই ব্যবহার করুক, প্রত্যেকে নিজের কাজের জন্য প্রয়োজনীয় signal পায়।",
      customText: [],
      sensitivity: 68,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    pricing: {
      id: "pricing",
      label: "Pricing",
      visible: true,
      title: "আপনার স্কুলের জন্য সঠিক প্ল্যান বেছে নিন",
      description: "কোনো hidden charge নেই। Free Trial দিয়ে শুরু করুন, তারপর আপনার growth অনুযায়ী plan বেছে নিন।",
      customText: [],
      sensitivity: 60,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    resources: {
      id: "resources",
      label: "Resources",
      visible: true,
      title: "শুরু করার আগে যা জানা দরকার",
      description: "FAQs, Help Center এবং সরাসরি support—সবকিছু এক জায়গায়।",
      customText: [],
      sensitivity: 76,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    about: {
      id: "about",
      label: "About",
      visible: true,
      title: "বাংলাদেশের শিক্ষা প্রতিষ্ঠানকে আরও organized করার জন্য",
      description: "EduTrack এমন একটি dependable operating layer, যেখানে school-এর মানুষ, process এবং progress একই workspace-এ যুক্ত থাকে।",
      customText: [],
      sensitivity: 58,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  },
};

export function cloneLandingLayout(layout: LandingPageLayout): LandingPageLayout {
  return {
    version: 2,
    desktop: Object.fromEntries(
      LANDING_WINDOW_IDS.map((id) => [id, { ...layout.desktop[id] }]),
    ) as LandingViewportLayout,
    mobile: Object.fromEntries(
      LANDING_WINDOW_IDS.map((id) => [id, { ...layout.mobile[id] }]),
    ) as LandingViewportLayout,
    blocks: Object.fromEntries(
      LANDING_BLOCK_IDS.map((id) => [id, { ...DEFAULT_LANDING_LAYOUT.blocks[id], ...layout.blocks?.[id], customText: [...(layout.blocks?.[id]?.customText ?? [])] }]),
    ) as Record<LandingBlockId, LandingBlock>,
    ...(layout.updatedAt ? { updatedAt: layout.updatedAt } : {}),
  };
}

function numberInRange(value: unknown, fallback: number, min: number, max: number) {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, numeric));
}

function normalizeViewportLayout(
  value: unknown,
  fallback: LandingViewportLayout,
): LandingViewportLayout {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(
    LANDING_WINDOW_IDS.map((id) => {
      const item = source[id] && typeof source[id] === "object"
        ? source[id] as Record<string, unknown>
        : {};
      const fallbackItem = fallback[id];
      const width = numberInRange(item.width, fallbackItem.width, 8, 75);
      return [
        id,
        {
          width,
          height: numberInRange(item.height, fallbackItem.height, 10, 70),
          x: numberInRange(item.x, fallbackItem.x, 0, 100 - width),
          y: numberInRange(item.y, fallbackItem.y, 0, 100 - numberInRange(item.height, fallbackItem.height, 10, 70)),
        },
      ];
    }),
  ) as LandingViewportLayout;
}

export function normalizeLandingLayout(value: unknown): LandingPageLayout {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const desktop = normalizeViewportLayout(source.desktop, DEFAULT_LANDING_LAYOUT.desktop);
  const mobile = normalizeViewportLayout(source.mobile, DEFAULT_LANDING_LAYOUT.mobile);
  const sourceBlocks = source.blocks && typeof source.blocks === "object"
    ? source.blocks as Record<string, unknown>
    : {};
  const blocks = Object.fromEntries(
    LANDING_BLOCK_IDS.map((id) => {
      const item = sourceBlocks[id] && typeof sourceBlocks[id] === "object"
        ? sourceBlocks[id] as Record<string, unknown>
        : {};
      const fallback = DEFAULT_LANDING_LAYOUT.blocks[id];
      const customText = Array.isArray(item.customText)
        ? item.customText.filter((text): text is string => typeof text === "string").slice(0, 12)
        : fallback.customText;
      return [id, {
        ...fallback,
        ...item,
        id,
        label: typeof item.label === "string" ? item.label : fallback.label,
        visible: typeof item.visible === "boolean" ? item.visible : fallback.visible,
        title: typeof item.title === "string" ? item.title : fallback.title,
        description: typeof item.description === "string" ? item.description : fallback.description,
        customText,
        sensitivity: numberInRange(item.sensitivity, fallback.sensitivity, 0, 100),
      }];
    }),
  ) as Record<LandingBlockId, LandingBlock>;
  const updatedAt = typeof source.updatedAt === "string" ? source.updatedAt : undefined;
  return {
    version: 2,
    desktop,
    mobile,
    blocks,
    ...(updatedAt ? { updatedAt } : {}),
  };
}