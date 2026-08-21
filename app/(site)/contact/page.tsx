import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { OpeningHours } from "@/components/site/opening-hours";
import { ServiceAreaList } from "@/components/site/service-area-note";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Brendale Workshop",
  description: `${site.address.full}. Call ${site.phone.primary} for smash repairs and spray painting. Open 8:00am–4:00pm Monday to Friday.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ];

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.address.mapsQuery,
  )}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    site.address.mapsQuery,
  )}`;

  return (
    <>
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="Contact"
        title="Pop in, call, or send it through"
        description="Bring your vehicle in for a free quote or to talk through your concerns. If that's not practical, the phone and the form both reach the same team."
        breadcrumbs={breadcrumbs}
      />

      {/* ---------- map: full width, address card floated over it ---------- */}
      <section className="relative" style={{ contentVisibility: "visible" }}>
        <div className="relative h-[320px] w-full bg-surface-2 sm:h-[420px]">
          <iframe
            title={`Map showing ${site.name} at ${site.address.full}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
          />

          {/* Floated like a Maps info window. Hidden below md, where a card over
              a 320px map would cover most of it. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 hidden justify-start p-5 md:flex">
            <div className="pointer-events-auto max-w-xs rounded-xl border border-black/10 bg-background/95 p-4 shadow-lg backdrop-blur">
              <p className="text-sm font-semibold text-foreground">
                {site.legalName}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {site.address.street}
                <br />
                {site.address.suburb} {site.address.state} {site.address.postcode}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-ink-800"
              >
                <Navigation className="size-3.5" />
                Get directions
              </a>
            </div>
          </div>
        </div>

        <div className="border-b border-black/8 bg-surface-2 p-5 md:hidden">
          <p className="text-sm font-semibold">{site.address.full}</p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white"
          >
            <Navigation className="size-4" />
            Get directions
          </a>
        </div>
      </section>

      {/* ---------- details | form ---------- */}
      <section className="bg-background py-14 lg:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* --- left: how to reach us --- */}
            <div className="rounded-2xl border border-black/8 bg-card p-6 sm:p-7 lg:p-8">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Contact us
              </h2>

              <div className="mt-7 space-y-5">
                <div className="flex gap-3.5">
                  <Phone className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <div>
                    <a
                      href={site.phone.primaryHref}
                      className="block text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-brand-700"
                    >
                      {site.phone.primary}
                    </a>
                    <a
                      href={site.phone.secondaryHref}
                      className="mt-0.5 block text-sm text-muted-foreground transition-colors hover:text-brand-700"
                    >
                      {site.phone.secondary}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Mail className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-[15px] font-medium text-foreground transition-colors hover:text-brand-700"
                  >
                    {site.email}
                  </a>
                </div>

                <div className="flex gap-3.5">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" />
                  <div>
                    <p className="text-[15px] font-medium leading-relaxed text-foreground">
                      {site.address.street}
                      <br />
                      {site.address.suburb} {site.address.state}{" "}
                      {site.address.postcode}
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
                    >
                      Get directions
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-black/8 pt-7">
                <OpeningHours />
              </div>

              <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-4">
                <p className="text-sm leading-relaxed text-brand-800">
                  <span className="font-semibold">Not drivable? </span>
                  Don&rsquo;t risk it. We quote off-site by appointment &mdash; give
                  us a call and we&rsquo;ll come to the vehicle.
                </p>
              </div>
            </div>

            {/* --- right: enquiry form --- */}
            <div>
              <SectionHeading
                title="Make an enquiry"
                description={
                  <>
                    After a repair quote? The{" "}
                    <Link
                      href="/quote"
                      className="font-semibold text-brand-700 underline underline-offset-2"
                    >
                      quote form
                    </Link>{" "}
                    lets you attach photos of the damage, which means a far more
                    accurate answer than we can give from a message alone.
                  </>
                }
              />
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- service area ---------- */}
      <section className="border-t border-black/8 bg-surface-2 py-14 lg:py-16">
        <Container>
          <ServiceAreaList />
        </Container>
      </section>
    </>
  );
}
