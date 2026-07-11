import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { promoBanners } from "./promotionData";
import { BannerSlide } from "./BannerSlide";

interface HeroCarouselProps {
  onCtaClick: (cta: string, index: number) => void;
}

export function HeroCarousel({ onCtaClick }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactingRef = useRef(false);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!interactingRef.current) emblaApi?.scrollNext();
    }, 5000);
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
    <div
      className="relative w-full group"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-2xl shadow-xl" ref={emblaRef}>
        <div className="flex">
          {promoBanners.map((banner, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0">
              <BannerSlide
                banner={banner}
                compact={false}
                onCtaClick={() => onCtaClick(banner.cta, i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 focus-visible:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 focus-visible:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {promoBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
