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

export type LandingPageLayout = {
  version: 1;
  desktop: LandingViewportLayout;
  mobile: LandingViewportLayout;
  updatedAt?: string;
};

export const DEFAULT_LANDING_LAYOUT: LandingPageLayout = {
  version: 1,
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
};

export function cloneLandingLayout(layout: LandingPageLayout): LandingPageLayout {
  return {
    version: 1,
    desktop: Object.fromEntries(
      LANDING_WINDOW_IDS.map((id) => [id, { ...layout.desktop[id] }]),
    ) as LandingViewportLayout,
    mobile: Object.fromEntries(
      LANDING_WINDOW_IDS.map((id) => [id, { ...layout.mobile[id] }]),
    ) as LandingViewportLayout,
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
  const updatedAt = typeof source.updatedAt === "string" ? source.updatedAt : undefined;
  return {
    version: 1,
    desktop,
    mobile,
    ...(updatedAt ? { updatedAt } : {}),
  };
}