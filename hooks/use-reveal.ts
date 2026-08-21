"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Adds the `reveal-in` class the first time an element scrolls into view.
 * Paired with the `.reveal` utility in globals.css — no animation library, and
 * it respects prefers-reduced-motion via the CSS rather than in JS.
 *
 * A single module-level IntersectionObserver is shared by every consumer. The
 * previous version created one observer per element, which meant ~20 observers
 * on the reviews and gallery pages; the browser had to run each of them against
 * every scroll frame.
 *
 * No IntersectionObserver fallback: Next.js 16 already requires Chrome 111+ /
 * Safari 16.4+, which all support it.
 */

type Callback = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Callback>();

function getObserver(): IntersectionObserver {
  if (observer === null) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = callbacks.get(entry.target);
          if (callback !== undefined) {
            callback();
            // One-shot: stop watching as soon as it has been revealed.
            callbacks.delete(entry.target);
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const [revealed, setRevealed] = useState(false);
  const elementRef = useRef<T | null>(null);

  // Callback ref rather than useEffect, so the element is registered the moment
  // it mounts and unregistered on unmount without an extra render pass.
  const ref = useCallback((node: T | null) => {
    const previous = elementRef.current;
    if (previous !== null) {
      callbacks.delete(previous);
      getObserver().unobserve(previous);
    }
    elementRef.current = node;
    if (node !== null) {
      callbacks.set(node, () => setRevealed(true));
      getObserver().observe(node);
    }
  }, []);

  useEffect(() => {
    return () => {
      const node = elementRef.current;
      if (node !== null) {
        callbacks.delete(node);
        observer?.unobserve(node);
      }
    };
  }, []);

  return { ref, className: revealed ? "reveal reveal-in" : "reveal" };
}
