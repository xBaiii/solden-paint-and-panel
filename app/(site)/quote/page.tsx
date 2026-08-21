import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck, Clock, Camera, ShieldCheck } from "lucide-react";
import { Container } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Repair Quote",
  description:
    "Send photos of the damage for a free quote from our Brendale workshop. We handle the insurer and the paperwork on choice-of-repairer claims.",
  alternates: { canonical: "/quote" },
};

const reassurance = [
  { icon: BadgeCheck, text: "Free quotes, no obligation" },
  { icon: ShieldCheck, text: "All major insurers, choice of repairer" },
  { icon: Camera, text: "Photos mean an accurate quote, not a guess" },
  { icon: Clock, text: "Weekend & night drop-off available" },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free quote"
        title="Tell us what happened"
        description="Five quick steps. Add a few photos and we'll come back to you with a proper quote rather than a ballpark."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Get a quote", href: "/quote" },
        ]}
      />

      <section className="bg-background py-14 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-[420px] w-full rounded-2xl" />
                </div>
              }
            >
              <QuoteWizard />
            </Suspense>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-black/8 bg-surface-2 p-7">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
                  Why bother with the form
                </h2>
                <ul className="mt-5 space-y-4">
                  {reassurance.map((item) => (
                    <li key={item.text} className="flex gap-3">
                      <item.icon className="mt-0.5 size-4.5 shrink-0 text-brand-600" />
                      <span className="text-[15px] leading-relaxed text-foreground">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 space-y-3 border-t border-black/8 pt-6 text-sm">
                  <p className="font-semibold text-foreground">Rather come in?</p>
                  <p className="leading-relaxed text-muted-foreground">
                    {site.address.full}
                    <br />
                    {site.hours[0].days}: {site.hours[0].time}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    Not drivable? We quote off-site by appointment.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
