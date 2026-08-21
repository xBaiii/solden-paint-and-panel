import Link from "next/link";
import { MapPin } from "lucide-react";
import { serviceAreas, site } from "@/lib/site";

/**
 * One service-area paragraph per service page.
 *
 * This exists instead of generating a page per suburb. Eighteen near-identical
 * "{service} in {suburb}" pages is the textbook doorway-page pattern Google
 * penalises; a single genuine paragraph naming the catchment, plus `areaServed`
 * in the schema, gets the geographic signal without the risk.
 *
 * The framing is always "we service" — never "we are located in" — because the
 * workshop is in Brendale and nowhere else.
 */
export function ServiceAreaNote({ service }: { service: string }) {
  const nearby = serviceAreas.slice(1, 8).join(", ");

  return (
    <div className="mt-10 rounded-2xl border border-black/8 bg-surface-2 p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
        <MapPin className="size-4" />
        Where we do it
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        Our workshop is at {site.address.street}, {site.address.suburb}, and we
        take {service} work from right across north Brisbane and the Moreton Bay
        region — {nearby} and the surrounding suburbs. There is weekend and night
        drop-off if you can&rsquo;t make it in during the week, and if your
        vehicle isn&rsquo;t drivable we&rsquo;ll quote it off-site by
        appointment.
      </p>
      <Link
        href="/contact"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
      >
        Find us and check our hours
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

/** Full catchment list, used once on the contact page. */
export function ServiceAreaList() {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
        Suburbs we service
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        We&rsquo;re based in Brendale and regularly repair vehicles for customers
        across north Brisbane and the Moreton Bay region, including:
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {serviceAreas.map((suburb) => (
          <li
            key={suburb}
            className="rounded-full border border-black/10 bg-card px-3 py-1.5 text-sm text-foreground"
          >
            {suburb}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        Not on the list? Call us on{" "}
        <a
          href={site.phone.primaryHref}
          className="font-semibold text-brand-700"
        >
          {site.phone.primary}
        </a>{" "}
        — chances are we can still help.
      </p>
    </div>
  );
}
