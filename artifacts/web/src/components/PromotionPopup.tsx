import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { promoBanners } from "./promotionData";

const SESSION_KEY = "et_promo_shown";
const POPUP_DISPLAY_MS = 15000;
const POPUP_SCROLL_RATIO = 0.45;

interface PromotionPopupProps {
  onCtaClick: (cta: string, index: number) => void;
  onDismiss: () => void;
}

export function PromotionPopup({ onCtaClick, onDismiss }: PromotionPopupProps) {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);
  const featuredBanner = promoBanners[0];

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const showPopup = () => {
      if (!dismissedRef.current) setVisible(true);
    };
    const timer = window.setTimeout(showPopup, POPUP_DISPLAY_MS);
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight > 0 && window.scrollY / scrollableHeight >= POPUP_SCROLL_RATIO) {
        showPopup();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(false);
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(dismiss, POPUP_DISPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [dismiss, visible]);

  if (!featuredBanner) return null;

  const cardStyle = {
    "--promo-popup-image-position": featuredBanner.popupImagePosition,
  } as CSSProperties;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="promo-popup-backdrop fixed inset-0 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="EduTrack প্রমোশনাল অফার"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
          >
            <div
              className={`promo-popup-card promo-popup-card--${featuredBanner.overlayPosition} relative w-full max-w-[27rem]`}
              style={cardStyle}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="promo-popup-close"
                aria-label="প্রমোশন বন্ধ করুন"
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  dismiss();
                }}
                onClick={dismiss}
              >
                <X className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              </button>

              <img
                src={featuredBanner.imageUrl}
                alt="EduTrack ব্যবহার করা একটি classroom"
                className="promo-popup-image"
              />
              <div className="promo-popup-image-wash" aria-hidden="true" />
              <div className="promo-popup-visual-badge">
                <span className="promo-popup-badge-dot" />
                নতুন workspace
              </div>

              <div className="promo-popup-copy relative z-10">
                <p className="promo-popup-kicker">{featuredBanner.tag}</p>
                <h2>{featuredBanner.headline}</h2>
                <p className="promo-popup-description">{featuredBanner.subtext}</p>
                <div className="promo-popup-proof">
                  <span>{featuredBanner.feature}</span>
                  <span>{featuredBanner.proof}</span>
                </div>
                <button
                  type="button"
                  className="promo-popup-cta"
                  onClick={() => {
                    onCtaClick(featuredBanner.cta, 0);
                    dismiss();
                  }}
                >
                  {featuredBanner.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="promo-popup-progress" aria-hidden="true">
                  <span />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}