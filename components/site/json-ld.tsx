import {
  openingHoursSpecification,
  serviceAreas,
  serviceRegions,
  site,
} from "@/lib/site";
import { services, type ServiceFaq } from "@/content/services";

/**
 * Structured data.
 *
 * Deliberately no `aggregateRating` or `review` markup: Solden does not publish
 * per-review ratings or a verified aggregate, and fabricating either would be
 * inventing review data (and is against Google's structured data policies).
 *
 * Also deliberately no `priceRange` and no `geo` coordinates — we don't have
 * verified values for either, and a wrong pin on a map is worse than no pin.
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

/** Suburb + region entries for `areaServed`. */
const areaServed = [
  ...serviceAreas.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "AdministrativeArea", name: "Queensland" },
  })),
  ...serviceRegions.map((name) => ({
    "@type": "AdministrativeArea",
    name,
  })),
];

const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  site.address.mapsQuery,
)}`;

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
        // E.164 rather than the human-formatted "(07) 3205 2988".
        telephone: site.phone.primaryE164,
        email: site.email,
        image: `${site.url}/images/premises.webp`,
        logo: `${site.url}/images/brand/swoosh.png`,
        slogan: site.slogan,
        description:
          "Family owned smash repairs, spray painting and refinishing in Brendale, serving north Brisbane and the Moreton Bay region. Approved repairer for all major insurers with choice of repairer policies.",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.suburb,
          addressRegion: site.address.state,
          postalCode: site.address.postcode,
          addressCountry: site.address.country,
        },
        hasMap: mapUrl,
        openingHoursSpecification: openingHoursSpecification.map((entry) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: entry.days,
          opens: entry.opens,
          closes: entry.closes,
        })),
        // Saturday is "by appointment" — schema.org has no clean way to say
        // that, and inventing a range would be worse than omitting it.
        sameAs: [site.social.facebook],
        memberOf: {
          "@type": "Organization",
          name: "Motor Trades Association Queensland",
        },
        areaServed,
        makesOffer: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.name,
            url: `${site.url}/services/${service.slug}`,
          },
        })),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#business` },
        inLanguage: "en-AU",
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
        areaServed,
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
