import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
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

  return (
    <>
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="Contact"
        title="Pop in, call, or send it through"
        description="Bring your vehicle in for a free quote or to talk through your concerns. If that's not practical, the phone and the form both reach the same team."
        breadcrumbs={breadcrumbs}
      />

      {/* ---------- details ---------- */}
      <section className="bg-background py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-black/8 bg-card p-6">
              <Phone className="size-5 text-brand-600" />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Phone
              </h2>
              <a
                href={site.phone.primaryHref}
                className="mt-2 block text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-brand-700"
              >
                {site.phone.primary}
              </a>
              <a
                href={site.phone.secondaryHref}
                className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-brand-700"
              >
                {site.phone.secondary}
              </a>
            </div>

            <div className="rounded-2xl border border-black/8 bg-card p-6">
              <Mail className="size-5 text-brand-600" />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Email
              </h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block break-all text-base font-semibold tracking-tight text-foreground transition-colors hover:text-brand-700"
              >
                {site.email}
              </a>
            </div>

            <div className="rounded-2xl border border-black/8 bg-card p-6">
              <MapPin className="size-5 text-brand-600" />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Workshop
              </h2>
              <p className="mt-2 text-base font-semibold leading-snug tracking-tight text-foreground">
                {site.address.street}
                <br />
                {site.address.suburb} {site.address.state} {site.address.postcode}
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-card p-6">
              <Clock className="size-5 text-brand-600" />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Hours
              </h2>
              <ul className="mt-2 space-y-1">
                {site.hours.map((entry) => (
                  <li key={entry.days} className="text-sm text-foreground">
                    <span className="font-semibold">{entry.days}</span>
                    <br />
                    <span className="text-muted-foreground">{entry.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <p className="text-sm leading-relaxed text-brand-800">
              <span className="font-semibold">Good to know: </span>
              {site.hoursNotes.join(" ")}
            </p>
          </div>
        </Container>
      </section>

      {/* ---------- service area ---------- */}
      <section className="bg-surface-2 py-14 lg:py-16">
        <Container>
          <ServiceAreaList />
        </Container>
      </section>

      {/* ---------- form + map ---------- */}
      <section className="bg-background py-16 lg:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                eyebrow="Send an enquiry"
                title="Tell us what you need"
                description={
                  <>
                    After a repair quote? The{" "}
                    <Link
                      href="/quote"
                      className="font-semibold text-brand-700 underline underline-offset-2"
                    >
                      quote form
                    </Link>{" "}
                    lets you attach photos, which means a far more accurate answer.
                  </>
                }
              />
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>

            <div className="lg:pt-4">
              <div className="overflow-hidden rounded-2xl border border-black/8 bg-card">
                <iframe
                  title={`Map showing ${site.name} at ${site.address.full}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[380px] w-full border-0"
                />
                <div className="p-6">
                  <p className="text-sm font-semibold text-foreground">
                    {site.legalName}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {site.address.full}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
                  >
                    Get directions
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
