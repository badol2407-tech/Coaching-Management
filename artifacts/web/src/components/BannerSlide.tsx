import { PromoBanner } from "./promotionData";

interface BannerSlideProps {
  banner: PromoBanner;
  compact: boolean;
  onCtaClick: () => void;
}

export function BannerSlide({ banner, compact, onCtaClick }: BannerSlideProps) {
  const height = compact ? "min-h-[280px]" : "min-h-[240px] sm:min-h-[300px]";

  return (
    <div
      className={`relative flex overflow-hidden select-none ${height}`}
      style={{ background: banner.gradient }}
    >
      {/* Full-canvas background image */}
      <img
        src={banner.imageUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ willChange: "transform" }}
        loading="eager"
      />

      {/* Dark overlay so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.08) 100%)`,
        }}
      />

      {/* Subtle ambient glow from banner accent */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ background: banner.accentColor }}
      />

      {/* LEFT: text + CTA — overlaid on image */}
      <div className="relative z-10 flex flex-col justify-between p-5 sm:p-7 w-[60%] shrink-0">
        <div className="flex flex-col gap-2.5">
          {/* Tag badge */}
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: banner.accentColor,
              border: `1px solid ${banner.accentColor}55`,
              backdropFilter: "blur(8px)",
            }}
          >
            {banner.tag}
          </span>

          {/* Headline */}
          <h3
            className="font-extrabold leading-tight tracking-tight"
            style={{
              color: "#ffffff",
              fontSize: compact
                ? "clamp(1.05rem, 4.5vw, 1.45rem)"
                : "clamp(1rem, 3.5vw, 1.35rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {banner.headline}
          </h3>

          {/* Subtext */}
          {banner.subtext && (
            <p
              className="text-xs leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.82)",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              {banner.subtext}
            </p>
          )}
        </div>

        {/* CTA button */}
        <div className="mt-4">
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: banner.accentColor,
              color: "#0f172a",
              boxShadow: `0 4px 20px ${banner.accentColor}66`,
            }}
          >
            {banner.cta}
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* RIGHT: visual accent area — just the image shows through */}
      <div className="relative flex-1 z-10 flex items-end justify-end p-4 pb-5">
        {/* Subtle right-side badge / OK indicator */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          বিনামূল্যে শুরু করুন
        </div>
      </div>
    </div>
  );
}
