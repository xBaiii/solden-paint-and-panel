import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Phone } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { CtaBand } from "@/components/site/cta-band";
import { Faq } from "@/components/site/faq";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/site/json-ld";
import { serviceBySlug, services } from "@/content/services";
import { ServiceAreaNote } from "@/components/site/service-area-note";
import { site } from "@/lib/site";
import { clamp } from "@/lib/seo";

/** Pre-render every service page at build time. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (service === undefined) return {};
  // Titles and descriptions carry the location: "smash repairs Brendale" and
  // "panel beater north Brisbane" are the searches that actually convert.
  // `shortName` keeps the title inside 60 characters even for the longest
  // service ("Auto electrical, mechanical & air conditioning"), and `absolute`
  // opts out of the layout template so the brand isn't appended twice.
  const title = `${service.shortName} in Brendale | ${site.shortName} Paint & Panel`;
  const description = clamp(
    `${service.excerpt} Free quotes in Brendale, serving north Brisbane.`,
  );

  return {
    title: { absolute: clamp(title, 62) },
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | ${site.name}`,
      description,
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (service === undefined) notFound();

  const related = service.related
    .map((relatedSlug) => serviceBySlug(relatedSlug))
    .filter((item): item is (typeof services)[number] => item !== undefined);

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.shortName, href: `/services/${service.slug}` },
  ];

  return (
    <>
      <ServiceJsonLd
        name={service.name}
        description={service.excerpt}
        slug={service.slug}
      />
      <FaqJsonLd items={service.faqs} />
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="Service"
        title={service.name}
        description={service.excerpt}
        image={service.image}
        imageAlt=""
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/quote?service=${service.slug}`}
            className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
          >
            Get a free quote
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={site.phone.primaryHref}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            <Phone className="size-4" />
            {site.phone.primary}
          </a>
        </div>
      </PageHero>

      {/* ---------- body + includes ---------- */}
      <section className="bg-background py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-lg leading-relaxed text-foreground sm:text-xl sm:leading-relaxed">
                {service.intro}
              </p>
              <div className="mt-8 space-y-5">
                {service.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[16px] leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <ServiceAreaNote service={service.shortName.toLowerCase()} />
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-black/8 bg-surface-2 p-7">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
                  What&rsquo;s covered
                </h2>
                <ul className="mt-5 space-y-3">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      <span className="text-[15px] leading-relaxed text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 border-t border-black/8 pt-6">
                  <p className="text-sm text-muted-foreground">
                    Free quotes. Weekend and night drop-off available.
                  </p>
                  <Link
                    href={`/quote?service=${service.slug}`}
                    className="mt-4 flex h-12 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Start your quote
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ---------- image ---------- */}
      <section className="bg-surface-2 py-16 lg:py-20">
        <Container>
          <Reveal>
            <div className="relative aspect-16/9 overflow-hidden rounded-2xl border border-black/8 lg:aspect-21/9">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(min-width: 1400px) 1300px, 95vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- faqs ---------- */}
      {service.faqs.length > 0 && (
        <section className="bg-background py-20 lg:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <SectionHeading
                eyebrow="Questions"
                title={`${service.shortName}, answered`}
              />
              <Faq items={service.faqs} />
            </div>
          </Container>
        </section>
      )}

      {/* ---------- related ---------- */}
      {related.length > 0 && (
        <section className="bg-surface-2 py-20 lg:py-24">
          <Container>
            <SectionHeading eyebrow="Related" title="You might also need" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 70}>
                  <ServiceCard service={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
