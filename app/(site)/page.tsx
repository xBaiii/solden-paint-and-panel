import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Clock,
  Eye,
  FileCheck2,
  Lock,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { Container, Eyebrow, Reveal, SectionHeading } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { CtaBand } from "@/components/site/cta-band";
import { Faq, generalFaqs } from "@/components/site/faq";
import { FaqJsonLd } from "@/components/site/json-ld";
import { services } from "@/content/services";
import { featuredTestimonials } from "@/content/testimonials";
import { featuredGallery } from "@/content/gallery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  // `absolute` opts out of the root layout's "%s | Solden Paint & Panel"
  // template, which would otherwise append the brand name twice.
  title: {
    absolute: "Smash Repairs & Spray Painting Brendale | Solden Paint & Panel",
  },
  description:
    "Family owned smash repairs and spray painting in Brendale for over 30 years, serving north Brisbane. All major insurers. Free quotes.",
  alternates: { canonical: "/" },
};

/** The six services surfaced on the homepage grid. */
const homepageServiceSlugs = [
  "smash-repairs",
  "spray-painting",
  "paintless-dent-removal",
  "truck-and-commercial",
  "protection-liners",
  "custom-paint",
];

const quickLinks = [
  { label: "Smash repairs", href: "/services/smash-repairs" },
  { label: "Resprays", href: "/services/spray-painting" },
  { label: "Dent removal", href: "/services/paintless-dent-removal" },
  { label: "Hail damage", href: "/services/paintless-dent-removal" },
  { label: "Trucks & fleet", href: "/services/truck-and-commercial" },
  { label: "Raptor liners", href: "/services/protection-liners" },
  { label: "Motorbikes", href: "/services/motorcycle-paintwork" },
  { label: "Glass", href: "/services/glass-replacement" },
];

const differences = [
  {
    icon: Users,
    title: "Family owned for 30+ years",
    body: "Solden has been family owned and operated for over three decades. You deal with the people whose name is on the building, not a call centre.",
  },
  {
    icon: Eye,
    title: "Michael checks every stage",
    body: "Our managing director came up through refinishing, estimating and quality control, and personally oversees and approves each stage of every repair.",
  },
  {
    icon: Sparkles,
    title: "Sikkens waterborne refinishing",
    body: "We refinish on the Akzo Nobel Sikkens computerised premium system using environmentally friendly waterborne materials, with training kept current.",
  },
];

const process = [
  {
    icon: ClipboardCheck,
    step: "01",
    title: "Free quote",
    body: "Pop in with the vehicle, or send us photos and details online. If it isn't drivable we'll come to you by appointment.",
  },
  {
    icon: FileCheck2,
    step: "02",
    title: "Claim & approval",
    body: "If you're claiming, we liaise with your insurer and arrange the paperwork so you don't have to chase it.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Repair & refinish",
    body: "Panel, structural and paint work all happen here, under one roof, with Michael signing off each stage.",
  },
  {
    icon: CalendarCheck,
    step: "04",
    title: "Collection",
    body: "You get the car back done right the first time, on time — and backed by our full repair warranty.",
  },
];

export default function HomePage() {
  const cards = homepageServiceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is (typeof services)[number] => service !== undefined);

  return (
    <>
      <FaqJsonLd items={generalFaqs} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-ink-950">
        <Image
          src="/images/hero-workshop.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/85 to-ink-950/60" />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-10 size-[560px] rounded-full bg-brand-600/15 blur-3xl"
        />

        <Container className="relative pb-20 pt-36 lg:pb-28 lg:pt-44">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-neon/25 bg-brand-neon/8 px-4 py-1.5">
              <span className="size-1.5 rounded-full bg-brand-neon" />
              <span className="text-xs font-medium tracking-wide text-brand-neon">
                {site.tagline}
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[4.2rem] lg:leading-[1.03]">
              Done right the first time.
              <span className="block text-brand-500">On time.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Brendale&rsquo;s family-owned smash repair and refinishing shop for
              over 30 years. We&rsquo;ll handle the damage, the insurer and the
              paperwork — you just need to get here.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-500 px-8 text-base font-semibold text-ink-950 transition-colors hover:bg-brand-400"
              >
                Get a free quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={site.phone.primaryHref}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-8 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/5"
              >
                <Phone className="size-4" />
                {site.phone.primary}
              </a>
            </div>

            {/* trust chips */}
            <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3">
              {site.trust.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <BadgeCheck className="size-4 shrink-0 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ================= QUICK LINKS ================= */}
      <section className="border-b border-black/8 bg-surface-2">
        <Container className="py-6">
          <div className="flex items-center gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Popular
            </span>
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="shrink-0 rounded-full border border-black/10 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-500/60 hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= THE SOLDEN DIFFERENCE ================= */}
      <section className="bg-background py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The Solden difference"
              title="A panel shop where someone's name is on the result"
              description="Plenty of shops can paint a panel. The difference shows up in the parts you can't see — who checked it, what it was painted with, and whether anyone answers the phone afterwards."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {differences.map((item, index) => (
              <Reveal key={item.title} delay={index * 90}>
                <div className="h-full rounded-2xl border border-black/8 bg-card p-7">
                  <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50">
                    <item.icon className="size-5.5 text-brand-700" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="bg-surface-2 py-20 lg:py-28">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="What we do"
                title="Not just accident repairs"
                description="Smash repairs are the core of the business, but they're a long way from all of it."
              />
              <Link
                href="/services"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700"
              >
                All services
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((service, index) => (
              <Reveal key={service.slug} delay={(index % 3) * 80}>
                <ServiceCard service={service} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= INSURANCE CLAIMS ================= */}
      <section className="relative overflow-hidden bg-ink-900 py-20 lg:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 bottom-0 size-[520px] rounded-full bg-brand-600/10 blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Eyebrow tone="dark">Insurance claims</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                It&rsquo;s your car. In most cases, it&rsquo;s your choice of repairer.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
                If your policy includes choice of repairer, you don&rsquo;t have to
                accept whoever your insurer suggests. We&rsquo;re an approved
                repairer for all major insurers with choice of repairer policies —
                and we&rsquo;ll do the annoying part for you.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "We help you through the claim process from the first phone call.",
                  "We liaise directly with your insurance company on your behalf.",
                  "We arrange all the necessary paperwork so you're not chasing it.",
                  "Private, insurance, commercial, fleet and pre-delivery all welcome.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-white/80">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-500" />
                    <span className="text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className="group mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
              >
                Start a claim enquiry
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <Reveal>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/premises.webp"
                  alt="A vehicle on site at Solden Paint & Panel in Brendale"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="bg-background py-20 lg:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Four steps, no mystery"
              description="You should always know where your car is up to. Here's the shape of every job that comes through the door."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <Reveal key={item.step} delay={index * 80}>
                <div className="relative h-full rounded-2xl border border-black/8 bg-card p-7">
                  <span className="font-mono text-xs font-semibold text-brand-600">
                    {item.step}
                  </span>
                  <div className="mt-4 inline-flex size-11 items-center justify-center rounded-xl bg-ink-900">
                    <item.icon className="size-5 text-brand-neon" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= GALLERY STRIP ================= */}
      <section className="bg-surface-2 py-20 lg:py-28">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Our work"
                title="Straight off the workshop floor"
                description="Real jobs, photographed here — not a stock library."
              />
              <Link
                href="/gallery"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700"
              >
                Full gallery
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {featuredGallery.map((image, index) => (
              <Reveal key={image.src} delay={index * 60}>
                <Link
                  href="/gallery"
                  className="group relative block aspect-square overflow-hidden rounded-xl border border-black/8"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 32vw, 48vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="bg-background py-20 lg:py-28">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                eyebrow="Reviews"
                title="What our customers say"
                description="Every review below is published on our site exactly as it was written."
              />
              <Link
                href="/testimonials"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700"
              >
                Read all reviews
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12">
            <TestimonialCarousel testimonials={featuredTestimonials} />
          </div>
        </Container>
      </section>

      {/* ================= FLEET & COMMERCIAL ================= */}
      <section className="bg-surface-2 py-20 lg:py-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-black/8">
                <Image
                  src="/images/feature-truck.webp"
                  alt="A truck in for repair at Solden Paint & Panel"
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="lg:order-first">
              <SectionHeading
                eyebrow="Fleet & commercial"
                title="An extra large booth, so size isn't your problem"
                description="Most shops are built around cars, which makes anything bigger somebody else's job. Ours isn't."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Building2, label: "Trucks, buses & commercials" },
                  { icon: Wrench, label: "Caravans & boats" },
                  { icon: Clock, label: "Fleet & pre-delivery work" },
                  { icon: Sparkles, label: "Pre-sale & auction detailing" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-black/8 bg-card px-4 py-3.5"
                  >
                    <item.icon className="size-4.5 shrink-0 text-brand-600" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/services/truck-and-commercial"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
              >
                More on truck &amp; commercial work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ================= SECURITY + WARRANTY ================= */}
      <section className="bg-background py-20 lg:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-black/8 bg-card p-8">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50">
                  <Lock className="size-5.5 text-brand-700" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  Your car doesn&rsquo;t sleep outside
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Our premises are fully secured, alarmed and monitored, and the
                  yard is gated. Vehicles are never left outside overnight — which
                  shouldn&rsquo;t be a selling point, but it is.
                </p>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="h-full rounded-2xl border border-black/8 bg-card p-8">
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50">
                  <ShieldCheck className="size-5.5 text-brand-700" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  Backed by a full repair warranty
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Every repair carries our full warranty, and we&rsquo;re a Motor
                  Trades Association Queensland member. If there is ever a problem,
                  we will fix it.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-surface-2 py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="Questions"
              title="The things people ask us most"
              description="Can't see yours? Call the shop — you'll get a person, not a queue."
            />
            <Faq items={generalFaqs} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
