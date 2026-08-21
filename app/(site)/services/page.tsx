import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { additionalServices, hoodLiningsNote, services } from "@/content/services";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Smash repairs, spray painting, paintless dent removal, truck and commercial work, Raptor protection liners, custom paint, glass, detailing and more — all under one roof in Brendale.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <PageHero
        eyebrow="Our services"
        title="We don't just repair and refinish cars"
        description="Smash repairs are the heart of the business, but the shop does a great deal more than that — and it's all handled in one place rather than farmed out across four."
        image="/images/feature-respray.webp"
        imageAlt=""
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />

      <section className="bg-background py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={(index % 3) * 70}>
                <ServiceCard service={service} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface-2 py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Also offered"
              title="And everything else on the list"
              description="Some jobs don't need their own page. These all come through the shop regularly — ask us about any of them."
            />
          </Reveal>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((item, index) => (
              <Reveal key={item} delay={(index % 3) * 50}>
                <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-card px-4 py-3.5">
                  <Check className="size-4 shrink-0 text-brand-600" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-10 max-w-2xl rounded-2xl border border-black/8 bg-card p-6 text-[15px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Hood linings: </span>
              {hoodLiningsNote}
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Not sure which one you need?"
        description="Describe the damage and send a couple of photos. We'll tell you what the job actually is — and what it'll cost — before you commit to anything."
      />
    </>
  );
}
