import type { Metadata } from "next";
import { Container } from "@/components/site/section";
import { PageHero } from "@/components/site/page-hero";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { CtaBand } from "@/components/site/cta-band";
import { BreadcrumbJsonLd } from "@/components/site/json-ld";
import { galleryImages } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Smash repairs, resprays, colour changes, motorbikes, trucks, protection liners and wheels — real jobs photographed at our Brendale workshop.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <>
      <BreadcrumbJsonLd trail={breadcrumbs} />

      <PageHero
        eyebrow="Gallery"
        title="Our work, not a stock library"
        description="Every photo below is a job that came through our Brendale workshop. Filter by the kind of work you're after."
        image="/images/gallery/colour-change-hsv.webp"
        imageAlt=""
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-background py-16 lg:py-20">
        <Container>
          <GalleryGrid images={galleryImages} />
        </Container>
      </section>

      <CtaBand
        title="Want yours to look like that?"
        description="Send us a few photos of the damage and we'll come back to you with a free quote."
      />
    </>
  );
}
