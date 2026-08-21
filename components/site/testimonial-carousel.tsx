"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/content/testimonials";

/**
 * Scroll-snap testimonial rail. Deliberately no star ratings — Solden does not
 * publish per-review ratings, and inventing them would be fabricating reviews.
 */
export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (rail === null) return;
    setAtStart(rail.scrollLeft <= 8);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateEdges();
    const rail = railRef.current;
    if (rail === null) return;
    rail.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (rail === null) return;
    const card = rail.querySelector("article");
    const amount = card instanceof HTMLElement ? card.offsetWidth + 20 : 340;
    rail.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.author}
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-black/8 bg-card p-6 sm:w-[360px]"
          >
            <Quote className="size-7 shrink-0 text-brand-500" />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <footer className="mt-5 border-t border-black/8 pt-4 text-sm font-semibold text-muted-foreground">
              {testimonial.author}
            </footer>
          </article>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          aria-label="Previous reviews"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border border-black/10 transition-colors",
            atStart
              ? "cursor-not-allowed text-muted-foreground/40"
              : "text-foreground hover:bg-surface-2",
          )}
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          aria-label="More reviews"
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border border-black/10 transition-colors",
            atEnd
              ? "cursor-not-allowed text-muted-foreground/40"
              : "text-foreground hover:bg-surface-2",
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
