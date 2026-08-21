import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/site/section";

/**
 * Charcoal hero used at the top of every interior page. Because the header sits
 * transparent over it, this band must always be dark — the nav flips to its
 * light pill state only once the page scrolls.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  breadcrumbs?: { name: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      {image !== undefined && (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/75 to-ink-950" />
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[460px] rounded-full bg-brand-600/12 blur-3xl"
      />

      <Container className="relative pb-16 pt-32 lg:pb-20 lg:pt-40">
        {breadcrumbs !== undefined && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-white/50">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="size-3" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white/80">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-brand-neon"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow !== undefined && <Eyebrow tone="dark">{eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
          {title}
        </h1>
        {description !== undefined && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            {description}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
