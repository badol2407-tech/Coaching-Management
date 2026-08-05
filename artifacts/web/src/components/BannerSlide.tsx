import { PromoBanner } from "./promotionData";

interface BannerSlideProps {
  banner: PromoBanner;
  compact: boolean;
  onCtaClick: () => void;
}

export function BannerSlide({ banner, compact, onCtaClick }: BannerSlideProps) {
  const height = compact ? "min-h-[292px]" : "min-h-[240px] sm:min-h-[300px]";

  return (
    <div
      className={`promo-banner-slide relative flex overflow-hidden select-none ${height}`}
    >
      {/* LEFT: clean glass content panel */}
      <div className="promo-banner-content relative z-10 flex shrink-0 flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          {/* Tag badge */}
          {banner.tag && <span className="promo-banner-tag">{banner.tag}</span>}

          {/* Headline */}
          <h3 className="promo-banner-headline">{banner.headline}</h3>

          {/* Subtext */}
          {banner.subtext && <p className="promo-banner-subtext">{banner.subtext}</p>}
        </div>

        {/* CTA button */}
        <div className="mt-4">
          <button onClick={onCtaClick} className="promo-banner-cta">
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

      {/* RIGHT: soft photo pane with a transparent glass finish */}
      <div className="promo-banner-image-frame">
        <img
          src={banner.imageUrl}
          alt=""
          aria-hidden="true"
          className="promo-banner-image"
          loading="eager"
        />
        <div className="promo-banner-status">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          বিনামূল্যে শুরু করুন
        </div>
      </div>
    </div>
  );
}
