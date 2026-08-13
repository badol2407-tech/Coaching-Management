import { memo, useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { promoBanners } from "./promotionData";
import { BannerSlide } from "./BannerSlide";

interface HeroCarouselProps {
  onCtaClick: (cta: string, index: number) => void;
}

export const HeroCarousel = memo(function HeroCarousel({ onCtaClick }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactingRef = useRef(false);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!interactingRef.current) emblaApi?.scrollNext();
    }, 5600);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onPointerDown = () => { interactingRef.current = true; };
    const onPointerUp = () => { interactingRef.current = false; };
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    onSelect();
    startAutoplay();
    return () => {
      stopAutoplay();
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  return (
    <div className="hero-promotion-rail relative w-full">
      <div className="hero-promotion-rail-heading">
        <div>
          <p className="hero-promotion-eyebrow">EduTrack-এর নতুন update</p>
          <h2>আপনার school day-এর জন্য তৈরি</h2>
        </div>
        <p className="hero-promotion-hint">Swipe করে সব feature দেখুন</p>
      </div>

      <div className="hero-promotion-viewport" ref={emblaRef}>
        <div className="flex">
          {promoBanners.map((banner, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <BannerSlide
  banner={banner}
  compact={false}
  priority={i === 0}
  onCtaClick={() => onCtaClick(banner.cta, i)}
/>onCtaClick(banner.cta, i)}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="hero-promotion-control hero-promotion-control--prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={scrollNext}
        className="hero-promotion-control hero-promotion-control--next"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="hero-promotion-dots" aria-label="Promotion slides">
        {promoBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`hero-promotion-dot ${i === selectedIndex ? "is-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
