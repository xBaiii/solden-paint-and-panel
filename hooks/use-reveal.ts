"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds the `reveal-in` class the first time an element scrolls into view.
 * Paired with the `.reveal` utility in globals.css — no animation library, and
 * it respects prefers-reduced-motion via the CSS rather than in JS.
 *
 * No IntersectionObserver fallback: Next.js 16 already requires Chrome 111+ /
 * Safari 16.4+, which all support it.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element === null || revealed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? "0px 0px -60px 0px",
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed, options.threshold, options.rootMargin]);

  return { ref, className: revealed ? "reveal reveal-in" : "reveal" };
}
