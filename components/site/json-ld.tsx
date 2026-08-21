import { openingHoursSpecification, site } from "@/lib/site";
import type { ServiceFaq } from "@/content/services";

/**
 * Structured data.
 *
 * Deliberately no `aggregateRating` or `review` markup: Solden does not publish
 * per-review ratings or a verified aggregate, and fabricating either would be
 * inventing review data (and is against Google's structured data policies).
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated here from typed constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BusinessJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "@id": `${site.url}/#business`,
        name: site.legalName,
        alternateName: site.name,
        url: site.url,
        telephone: site.phone.primary,
        email: site.email,
        image: `${site.url}/images/premises.webp`,
        slogan: site.slogan,
        description:
          "Family owned smash repairs, spray painting and refinishing in Brendale, Queensland. Approved repairer for all major insurers with choice of repairer policies.",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.suburb,
          addressRegion: site.address.state,
          postalCode: site.address.postcode,
          addressCountry: site.address.country,
        },
        openingHoursSpecification: openingHoursSpecification.map((entry) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: entry.days,
          opens: entry.opens,
          closes: entry.closes,
        })),
        sameAs: [site.social.facebook],
        memberOf: {
          "@type": "Organization",
          name: "Motor Trades Association Queensland",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Brisbane, Moreton Bay and South East Queensland",
        },
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: `${site.url}/services/${slug}`,
        serviceType: name,
        provider: { "@id": `${site.url}/#business` },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Brisbane and Moreton Bay, Queensland",
        },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: ServiceFaq[] }) {
  if (items.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  trail,
}: {
  trail: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: `${site.url}${crumb.href}`,
        })),
      }}
    />
  );
}
