"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { galleryCategories, type GalleryImage } from "@/content/gallery";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = useMemo(
    () =>
      active === "all"
        ? images
        : images.filter((image) => image.category === active),
    [images, active],
  );

  // Only offer filters that actually have photos behind them.
  const available = galleryCategories.filter(
    (category) =>
      category.slug === "all" ||
      images.some((image) => image.category === category.slug),
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {available.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActive(category.slug)}
            aria-pressed={active === category.slug}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === category.slug
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-black/10 text-muted-foreground hover:border-brand-500/50 hover:text-foreground",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Fixed-ratio grid rather than `columns` masonry: multi-column layout
          re-balances on every transform/paint change, which is expensive with
          20+ images, and it also caused layout shift as images decoded. */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setLightbox(image)}
            className={cn(
              "group relative block overflow-hidden rounded-xl border border-black/8 bg-surface-2 outline-none [contain:paint] focus-visible:ring-2 focus-visible:ring-brand-500",
              image.tall === true ? "aspect-3/4" : "aspect-4/3",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              // Only the first row is likely above the fold.
              loading={index < 4 ? "eager" : "lazy"}
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/20" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No photos in this category yet.
        </p>
      )}

      {/* --- lightbox ------------------------------------------------- */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink-950/92 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <figure
            className="max-h-full w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1600}
              height={1200}
              className="mx-auto h-auto max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/70">
              {lightbox.alt}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
