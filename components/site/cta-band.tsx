import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/site/section";
import { site } from "@/lib/site";

/** Charcoal conversion band that sits immediately above the footer. */
export function CtaBand({
  title = "Let's get your car sorted.",
  description = "Send through a few photos and we'll come back to you with a free quote. If it's easier, pick up the phone — you'll get a straight answer either way.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* swoosh motif, echoing the logo, kept subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-[520px] rounded-full bg-brand-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 size-[420px] rounded-full bg-brand-500/5 blur-3xl"
      />

      <Container className="relative py-16 lg:py-24">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/quote"
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
        </div>
      </Container>
    </section>
  );
}
