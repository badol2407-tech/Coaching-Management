import { PromoBanner } from "./promotionData";
import type { CSSProperties } from "react";

interface BannerSlideProps {
  banner: PromoBanner;
  compact?: boolean;
  onCtaClick: () => void;
}

export function BannerSlide({ banner, compact = false, onCtaClick }: BannerSlideProps) {
  const style = {
    background: banner.gradient,
    "--promo-rail-image-position": banner.railImagePosition,
  } as CSSProperties;

  return (
    <div
      className={`promo-banner-slide promo-banner-slide--${banner.overlayPosition} relative overflow-hidden select-none ${compact ? "is-compact" : ""}`}
      style={style}
    >
      <img
        src={banner.imageUrl}
        alt=""
        aria-hidden="true"
        className="promo-banner-image"
        loading="eager"
      />
      <div className="promo-banner-image-wash" aria-hidden="true" />
      <div className="promo-banner-glow" aria-hidden="true" />
      <div className="promo-banner-content relative z-10">
        <div className="flex flex-col gap-2">
          {banner.tag && <span className="promo-banner-tag">{banner.tag}</span>}
          <h3 className="promo-banner-headline">{banner.headline}</h3>
          {banner.subtext && <p className="promo-banner-subtext">{banner.subtext}</p>}
          <div className="promo-banner-proof">
            <span>{banner.feature}</span>
            <span>{banner.proof}</span>
          </div>
        </div>

        <button onClick={onCtaClick} className="promo-banner-cta mt-3" type="button">
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

      <div className="promo-banner-status">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        EduTrack live
      </div>
    </div>
  );
}
