import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { Container, Reveal } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What Solden Paint & Panel customers say about their repairs, published exactly as written.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Reviews", href: "/testimonials" },
  ];

  return (
    <>
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="Reviews"
        title="In our customers' own words"
        description="Published exactly as they were written. No editing, no cherry-picked star ratings."
        image="/images/gallery/respray-red-mazda.webp"
        imageAlt=""
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-background py-16 lg:py-24">
        <Container>
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.author} delay={(index % 3) * 70}>
                <figure className="break-inside-avoid rounded-2xl border border-black/8 bg-card p-7">
                  <Quote className="size-6 text-brand-500" />
                  <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-black/8 pt-4 text-sm font-semibold text-muted-foreground">
                    {testimonial.author}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Join them."
        description="Get a free quote and find out why our customers keep using their first names when they talk about us."
      />
    </>
  );
}
