import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { footerNav } from "@/lib/nav";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink-950 text-white">
      {/* thin brand rule — the neon reads correctly on charcoal */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-neon/60 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* --- identity + contact ----------------------------------- */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/brand/swoosh.png"
                alt=""
                width={512}
                height={512}
                className="h-10 w-auto drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]"
              />
              <span className="flex flex-col leading-none">
                <span className="text-xl font-semibold tracking-tight">SOLDEN</span>
                <span className="text-[11px] font-medium text-brand-neon">
                  Paint &amp; Panel
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Family owned and operated for over 30 years. Smash repairs, spray
              painting and refinishing in Brendale for private, insurance, fleet
              and commercial customers.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li>
                <a
                  href={site.phone.primaryHref}
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-brand-neon"
                >
                  <Phone className="size-4 shrink-0 text-brand-500" />
                  {site.phone.primary}
                </a>
              </li>
              <li>
                <a
                  href={site.phone.secondaryHref}
                  className="flex items-center gap-3 text-white/80 transition-colors hover:text-brand-neon"
                >
                  <Phone className="size-4 shrink-0 text-brand-500" />
                  {site.phone.secondary}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 break-all text-white/80 transition-colors hover:text-brand-neon"
                >
                  <Mail className="size-4 shrink-0 text-brand-500" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.suburb} {site.address.state} {site.address.postcode}
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-500" />
                <span>
                  {site.hours.map((entry) => (
                    <span key={entry.days} className="block">
                      {entry.days}: {entry.time}
                    </span>
                  ))}
                </span>
              </li>
            </ul>

            <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/45">
              {site.hoursNotes.join(" ")}
            </p>
          </div>

          {/* --- link columns ----------------------------------------- */}
          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((column) => (
              <div key={column.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-500">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* --- bottom bar --------------------------------------------- */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="rounded-md bg-white px-3 py-2">
              <Image
                src="/images/brand/mta-queensland.png"
                alt="Motor Trades Association Queensland member"
                width={360}
                height={159}
                className="h-7 w-auto"
              />
            </div>
            <p className="text-xs text-white/45">
              Motor Trades Association
              <br />
              Queensland member
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-white/45 sm:items-end">
            <p>
              &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                Facebook
              </a>
              <Link href="/quote" className="transition-colors hover:text-white">
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
