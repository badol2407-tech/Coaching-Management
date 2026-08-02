import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Shared hook for all portal mobile sidebar drawers.
 * Manages open/close state and locks body scroll while the drawer is open.
 */
export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      const mobile = media.matches;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Prevent background scroll while drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab") return;
      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        drawer.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const activeIsFocusable = active instanceof HTMLElement && focusable.includes(active);

      if (!activeIsFocusable) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile) return undefined;
    if (isOpen) {
      const frame = requestAnimationFrame(() => drawerRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    triggerRef.current?.focus();
    return undefined;
  }, [isMobile, isOpen]);

  const open = useCallback(() => {
    if (isMobile) setIsOpen(true);
  }, [isMobile]);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, isMobile, drawerRef, triggerRef, open, close };
}
