import type { Metadata } from "next";
import Image from "next/image";
import { Lock, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Solden Paint & Panel has been family owned and operated in Brendale for over 30 years. Managing director Michael Curtin personally approves every stage of every repair.",
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    icon: Sparkles,
    title: "Akzo Nobel Sikkens refinishing",
    body: "We refinish on the Sikkens computerised premium system using environmentally friendly waterborne materials, and the team's training is kept current as the technology moves.",
  },
  {
    icon: Truck,
    title: "An extra large spray booth",
    body: "Cars are the easy part. Our booth also takes commercial vehicles, boats, caravans, buses and larger transport, which is why fleet operators keep coming back.",
  },
  {
    icon: Lock,
    title: "Fully secured premises",
    body: "The site is alarmed, monitored and gated, and vehicles are never left outside overnight. Your car is as safe here as it is at home.",
  },
  {
    icon: ShieldCheck,
    title: "A full repair warranty",
    body: "Every repair is backed by our warranty, and we're a Motor Trades Association Queensland member. If there is ever a problem, we will fix it.",
  },
];

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="About us"
        title="Thirty years, one family, the same standard"
        description="Solden Paint and Panel was established over 30 years ago and is still family owned and operated. That's the whole explanation for how we work."
        image="/images/premises.webp"
        imageAlt=""
        breadcrumbs={breadcrumbs}
      />

      {/* ---------- story ---------- */}
      <section className="bg-background py-20 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHeading
                eyebrow="Our story"
                title="A family business that acts like one"
              />
              <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-muted-foreground">
                <p>
                  Established over 30 years ago, Solden Paint and Panel is a family
                  owned and operated business that prides itself on high quality
                  vehicle repairs, genuinely personal service, and a strong emphasis
                  on attention to detail.
                </p>
                <p>
                  We look after private, insurance, commercial, fleet and
                  pre-delivery customers, and we&rsquo;re capable of repairing
                  everything from the smallest dent to a full custom rebuild. If
                  you&rsquo;re making an insurance claim, we&rsquo;re an approved
                  repairer for all major insurers with choice of repairer policies.
                </p>
                <p>
                  Our team will help you through the claim process, liaise with your
                  insurance company and arrange all the necessary paperwork, so the
                  experience is a comfortable and stress-free one. That part matters
                  more than people expect — an accident is bad enough without the
                  admin.
                </p>
                <p>
                  Customers tend to mention Mick and Vanessa by name in their
                  reviews, which is probably the most accurate description of the
                  business there is.
                </p>
              </div>
            </div>

            <Reveal>
              <div className="rounded-2xl border border-black/8 bg-surface-2 p-8">
                <h3 className="text-lg font-semibold tracking-tight">
                  Michael Curtin
                </h3>
                <p className="mt-1 text-sm font-medium text-brand-700">
                  Managing Director
                </p>
                <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                  Michael has a passion for automotive repairs and a background in
                  refinishing, estimating and quality control. He personally
                  oversees and approves each stage of the repair process to make
                  sure repairs are carried out to the highest possible quality.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  In practice, that means someone who knows exactly what a good
                  repair looks like signs off on yours before you see it.
                </p>

                <div className="mt-7 border-t border-black/8 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Our slogan
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    &ldquo;{site.slogan}&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- pillars ---------- */}
      <section className="bg-surface-2 py-20 lg:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Not just accident repairs"
              title="What's actually behind the roller door"
              description="We also work alongside vehicle specialists for custom airbrushing, vehicle maintenance, powder coating and protection liners — so a big job doesn't get carted between four different shops."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={(index % 2) * 90}>
                <div className="h-full rounded-2xl border border-black/8 bg-card p-7">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50">
                    <pillar.icon className="size-5.5 text-brand-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- workshop images ---------- */}
      <section className="bg-background py-16 lg:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/images/feature-stripdown.webp",
                alt: "A vehicle stripped back for repair in the workshop",
              },
              {
                src: "/images/feature-respray.webp",
                alt: "A refinished red hatchback after paintwork",
              },
              {
                src: "/images/feature-wheels.webp",
                alt: "A finished alloy wheel and tyre",
              },
            ].map((image, index) => (
              <Reveal key={image.src} delay={index * 80}>
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-black/8">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 640px) 31vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title="Come and meet the team."
        description={`Pop in with your vehicle for a free quote or to talk through your concerns. We're at ${site.address.full}, open ${site.hours[0].time} Monday to Friday.`}
      />
    </>
  );
}
