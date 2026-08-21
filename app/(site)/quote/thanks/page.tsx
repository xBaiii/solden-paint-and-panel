import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Phone } from "lucide-react";
import { Container } from "@/components/site/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquiry received",
  description: "Thanks — your enquiry has reached the Solden Paint & Panel team.",
  robots: { index: false, follow: false },
};

export default function QuoteThanksPage() {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 size-[520px] rounded-full bg-brand-600/15 blur-3xl"
      />
      <Container className="relative flex min-h-[80vh] flex-col items-center justify-center py-32 text-center">
        <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-brand-500/15">
          <CheckCircle2 className="size-8 text-brand-neon" />
        </div>

        <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Got it. We&rsquo;ll be in touch.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">
          Your enquiry has landed with our team, and a copy is on its way to your
          inbox if you gave us an email address.
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left">
            <Clock className="size-5 text-brand-500" />
            <h2 className="mt-4 text-base font-semibold text-white">
              What happens next
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              We review the photos and details, then call or email you to talk
              through the repair and book a time that suits.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left">
            <Phone className="size-5 text-brand-500" />
            <h2 className="mt-4 text-base font-semibold text-white">
              Need it sooner?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              If it&rsquo;s urgent, or the car isn&rsquo;t drivable, call the shop
              on{" "}
              <a
                href={site.phone.primaryHref}
                className="font-semibold text-brand-neon"
              >
                {site.phone.primary}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/gallery"
            className="inline-flex h-13 items-center justify-center rounded-full bg-brand-500 px-7 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
          >
            See our work
          </Link>
          <Link
            href="/"
            className="inline-flex h-13 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
