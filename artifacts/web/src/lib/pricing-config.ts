import { PLAN_CONFIG, type PlanConfig, type PlanTier } from "@/lib/plan-config";

export type PricingViewport = "desktop" | "mobile";

export interface PricingLayoutItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PricingElementType = "text" | "price" | "feature" | "button";

export interface PricingElement {
  id: string;
  type: PricingElementType;
  tier: PlanTier;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

export type PricingElements = Record<
  PricingViewport,
  Record<PlanTier, PricingElement[]>
>;

export interface PublicPricingConfig {
  version: number;
  heading: {
    title: string;
    description: string;
  };
  plans: Record<PlanTier, PlanConfig>;
  layout: Record<
    PricingViewport,
    Record<PlanTier, PricingLayoutItem>
  >;
  elements: PricingElements;
  updatedAt?: unknown;
}

export const DEFAULT_PRICING_LAYOUT: PublicPricingConfig["layout"] = {
  desktop: {
    free_trial: {
      x: 0,
      y: 0,
      width: 31,
      height: 92,
    },
    founder_launch: {
      x: 34.5,
      y: 0,
      width: 31,
      height: 92,
    },
    annual_premium: {
      x: 69,
      y: 0,
      width: 31,
      height: 92,
    },
  },
  mobile: {
    free_trial: {
      x: 0,
      y: 0,
      width: 100,
      height: 29,
    },
    founder_launch: {
      x: 0,
      y: 35,
      width: 100,
      height: 29,
    },
    annual_premium: {
      x: 0,
      y: 70,
      width: 100,
      height: 29,
    },
  },
};

export const DEFAULT_PRICING_ELEMENTS: PricingElements = {
  desktop: {
    free_trial: [
      { id: "free_trial-name", type: "text", tier: "free_trial", content: PLAN_CONFIG.free_trial.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "free_trial-tagline", type: "text", tier: "free_trial", content: PLAN_CONFIG.free_trial.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "free_trial-price", type: "price", tier: "free_trial", content: String(PLAN_CONFIG.free_trial.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.free_trial.displayHighlights.map((feature, index) => ({
        id: `free_trial-feature-${index}`,
        type: "feature" as const,
        tier: "free_trial" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "free_trial-button", type: "button", tier: "free_trial", content: "Start Free Trial", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
    founder_launch: [
      { id: "founder_launch-name", type: "text", tier: "founder_launch", content: PLAN_CONFIG.founder_launch.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "founder_launch-tagline", type: "text", tier: "founder_launch", content: PLAN_CONFIG.founder_launch.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "founder_launch-price", type: "price", tier: "founder_launch", content: String(PLAN_CONFIG.founder_launch.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.founder_launch.displayHighlights.map((feature, index) => ({
        id: `founder_launch-feature-${index}`,
        type: "feature" as const,
        tier: "founder_launch" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "founder_launch-button", type: "button", tier: "founder_launch", content: "Start Free Trial", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
    annual_premium: [
      { id: "annual_premium-name", type: "text", tier: "annual_premium", content: PLAN_CONFIG.annual_premium.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "annual_premium-tagline", type: "text", tier: "annual_premium", content: PLAN_CONFIG.annual_premium.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "annual_premium-price", type: "price", tier: "annual_premium", content: String(PLAN_CONFIG.annual_premium.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.annual_premium.displayHighlights.map((feature, index) => ({
        id: `annual_premium-feature-${index}`,
        type: "feature" as const,
        tier: "annual_premium" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "annual_premium-button", type: "button", tier: "annual_premium", content: "View Annual Plan", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
  },
  mobile: {
    free_trial: [
      { id: "free_trial-name", type: "text", tier: "free_trial", content: PLAN_CONFIG.free_trial.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "free_trial-tagline", type: "text", tier: "free_trial", content: PLAN_CONFIG.free_trial.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "free_trial-price", type: "price", tier: "free_trial", content: String(PLAN_CONFIG.free_trial.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.free_trial.displayHighlights.map((feature, index) => ({
        id: `free_trial-feature-${index}`,
        type: "feature" as const,
        tier: "free_trial" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "free_trial-button", type: "button", tier: "free_trial", content: "Start Free Trial", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
    founder_launch: [
      { id: "founder_launch-name", type: "text", tier: "founder_launch", content: PLAN_CONFIG.founder_launch.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "founder_launch-tagline", type: "text", tier: "founder_launch", content: PLAN_CONFIG.founder_launch.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "founder_launch-price", type: "price", tier: "founder_launch", content: String(PLAN_CONFIG.founder_launch.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.founder_launch.displayHighlights.map((feature, index) => ({
        id: `founder_launch-feature-${index}`,
        type: "feature" as const,
        tier: "founder_launch" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "founder_launch-button", type: "button", tier: "founder_launch", content: "Start Free Trial", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
    annual_premium: [
      { id: "annual_premium-name", type: "text", tier: "annual_premium", content: PLAN_CONFIG.annual_premium.name, x: 6, y: 8, width: 88, height: 8, visible: true },
      { id: "annual_premium-tagline", type: "text", tier: "annual_premium", content: PLAN_CONFIG.annual_premium.tagline, x: 6, y: 17, width: 88, height: 7, visible: true },
      { id: "annual_premium-price", type: "price", tier: "annual_premium", content: String(PLAN_CONFIG.annual_premium.price), x: 6, y: 29, width: 88, height: 12, visible: true },
      ...PLAN_CONFIG.annual_premium.displayHighlights.map((feature, index) => ({
        id: `annual_premium-feature-${index}`,
        type: "feature" as const,
        tier: "annual_premium" as const,
        content: feature,
        x: 6,
        y: 48 + index * 6,
        width: 88,
        height: 5,
        visible: true,
      })),
      { id: "annual_premium-button", type: "button", tier: "annual_premium", content: "View Annual Plan", x: 6, y: 86, width: 88, height: 8, visible: true },
    ],
  },
};


export const DEFAULT_PUBLIC_PRICING_CONFIG: PublicPricingConfig = {
  version: 1,
  heading: {
    title: "আপনার প্রতিষ্ঠানের জন্য সঠিক প্ল্যান বেছে নিন",
    description:
      "স্বচ্ছ pricing, সহজ setup এবং আপনার প্রতিষ্ঠানের জন্য প্রয়োজনীয় সবকিছু এক জায়গায়।",
  },
  plans: PLAN_CONFIG,
  layout: DEFAULT_PRICING_LAYOUT,
  elements: DEFAULT_PRICING_ELEMENTS,
};

export function normalizePublicPricingConfig(
  data: any,
): PublicPricingConfig {
  const source = data?.plans ?? {};
  const plans = {
    ...PLAN_CONFIG,
  } as Record<PlanTier, PlanConfig>;

  (Object.keys(PLAN_CONFIG) as PlanTier[]).forEach((tier) => {
    const incoming = source[tier];

    if (!incoming || typeof incoming !== "object") {
      return;
    }

    plans[tier] = {
      ...PLAN_CONFIG[tier],
      ...incoming,
      features: {
        ...PLAN_CONFIG[tier].features,
        ...(incoming.features ?? {}),
      },
      displayHighlights: Array.isArray(incoming.displayHighlights)
        ? incoming.displayHighlights.filter(
            (value: unknown): value is string =>
              typeof value === "string",
          )
        : PLAN_CONFIG[tier].displayHighlights,
    };
  });

  const layout = {
    desktop: {
      ...DEFAULT_PRICING_LAYOUT.desktop,
    },
    mobile: {
      ...DEFAULT_PRICING_LAYOUT.mobile,
    },
  };

  for (const viewport of ["desktop", "mobile"] as PricingViewport[]) {
    for (const tier of Object.keys(PLAN_CONFIG) as PlanTier[]) {
      const incoming = data?.layout?.[viewport]?.[tier];

      if (!incoming) {
        continue;
      }

      const fallback = DEFAULT_PRICING_LAYOUT[viewport][tier];

      layout[viewport][tier] = {
        ...fallback,
        x: Number.isFinite(Number(incoming.x))
          ? Number(incoming.x)
          : fallback.x,
        y: Number.isFinite(Number(incoming.y))
          ? Number(incoming.y)
          : fallback.y,
        width: Number.isFinite(Number(incoming.width))
          ? Number(incoming.width)
          : fallback.width,
        height: Number.isFinite(Number(incoming.height))
          ? Number(incoming.height)
          : fallback.height,
      };
    }
  }

  const elements = {
    desktop: {
      free_trial: [],
      founder_launch: [],
      annual_premium: [],
    },
    mobile: {
      free_trial: [],
      founder_launch: [],
      annual_premium: [],
    },
  } as PricingElements;

  for (const viewport of ["desktop", "mobile"] as PricingViewport[]) {
    for (const tier of Object.keys(PLAN_CONFIG) as PlanTier[]) {
      const incoming = data?.elements?.[viewport]?.[tier];

      if (!Array.isArray(incoming)) {
        elements[viewport][tier] =
          DEFAULT_PRICING_ELEMENTS[viewport][tier];
        continue;
      }

      elements[viewport][tier] = incoming
        .filter((item: any) => item && typeof item === "object")
        .map((item: any, index: number) => ({
          id:
            typeof item.id === "string"
              ? item.id
              : `${viewport}-${tier}-${index}`,
          type:
            item.type === "price" ||
            item.type === "feature" ||
            item.type === "button"
              ? item.type
              : "text",
          tier,
          content:
            typeof item.content === "string" ? item.content : "",
          x: Number.isFinite(Number(item.x)) ? Number(item.x) : 0,
          y: Number.isFinite(Number(item.y)) ? Number(item.y) : 0,
          width:
            Number.isFinite(Number(item.width)) && Number(item.width) > 0
              ? Number(item.width)
              : 100,
          height:
            Number.isFinite(Number(item.height)) && Number(item.height) > 0
              ? Number(item.height)
              : 20,
          visible: item.visible !== false,
        }));
    }
  }

  return {
    version: Number(data?.version) || 1,
    heading: {
      title:
        typeof data?.heading?.title === "string"
          ? data.heading.title
          : DEFAULT_PUBLIC_PRICING_CONFIG.heading.title,
      description:
        typeof data?.heading?.description === "string"
          ? data.heading.description
          : DEFAULT_PUBLIC_PRICING_CONFIG.heading.description,
    },
    plans,
    layout,
    elements,
    updatedAt: data?.updatedAt,
  };
}
