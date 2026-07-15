import { useState, useEffect, useCallback } from "react";

/**
 * Shared hook for all portal mobile sidebar drawers.
 * Manages open/close state and locks body scroll while the drawer is open.
 */
export function useMobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll while drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
