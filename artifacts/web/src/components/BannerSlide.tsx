import { PromoBanner } from "./promotionData";

interface BannerSlideProps {
  banner: PromoBanner;
  compact?: boolean;
  onCtaClick: () => void;
}

export function BannerSlide({ banner, compact = false, onCtaClick }: BannerSlideProps) {
  return (
    <div
      className={`promo-banner-slide relative flex overflow-hidden select-none ${compact ? "is-compact" : ""}`}
      style={{ background: banner.gradient }}
    >
      <div className="promo-banner-glow" aria-hidden="true" />
      <div className="promo-banner-content relative z-10 flex shrink-0 flex-col justify-between">
        <div className="flex flex-col gap-2">
          {banner.tag && <span className="promo-banner-tag">{banner.tag}</span>}
          <h3 className="promo-banner-headline">{banner.headline}</h3>
          {banner.subtext && <p className="promo-banner-subtext">{banner.subtext}</p>}
          <div className="promo-banner-proof">
            <span>{banner.feature}</span>
            <span>{banner.proof}</span>
          </div>
        </div>

        <button onClick={onCtaClick} className="promo-banner-cta" type="button">
          {banner.cta}
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="promo-banner-image-frame">
        <img
          src={banner.imageUrl}
          alt=""
          aria-hidden="true"
          className="promo-banner-image"
          loading="eager"
        />
        <div className="promo-banner-status">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          EduTrack live
        </div>
      </div>
    </div>
  );
}
