import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { promoBanners } from "./promotionData";
import { BannerSlide } from "./BannerSlide";

const SESSION_KEY = "et_promo_shown";

interface PromotionPopupProps {
  onCtaClick: (cta: string, index: number) => void;
}

export function PromotionPopup({ onCtaClick }: PromotionPopupProps) {
  const [visible, setVisible] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactingRef = useRef(false);

  // Show once per session
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
    stopAutoplay();
  }, []);

  // Autoplay
  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      if (!interactingRef.current) emblaApi?.scrollNext();
    }, 4000);
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi || !visible) return;
    startAutoplay();
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onPointerDown = () => { interactingRef.current = true; };
    const onPointerUp = () => { interactingRef.current = false; };
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    onSelect(); // sync dots to Embla's actual starting snap on mount
    return () => {
      stopAutoplay();
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi, visible, startAutoplay, stopAutoplay]);

  // Keyboard escape
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="EduTrack প্রমোশনাল অফার"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
            style={{ willChange: "transform, opacity" }}
          >
            <div
              className="pointer-events-auto relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
            >
              {/* Glass card */}
              <div className="rounded-[22px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 bg-[#0d0f1a]">

                {/* Close button */}
                <button
                  onClick={dismiss}
                  className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 flex items-center justify-center transition-all"
                  aria-label="বন্ধ করুন"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex">
                    {promoBanners.map((banner, i) => (
                      <div key={i} className="flex-[0_0_100%] min-w-0">
                        <BannerSlide
                          banner={banner}
                          compact={true}
                          onCtaClick={() => {
                            onCtaClick(banner.cta, i);
                            dismiss();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom controls */}
                <div className="flex items-center justify-between px-5 py-3 bg-black/30 backdrop-blur-sm">
                  {/* Prev */}
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Dots */}
                  <div className="flex gap-2">
                    {promoBanners.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === selectedIndex
                            ? "w-6 bg-white"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
