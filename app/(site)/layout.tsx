import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { StickyCta } from "@/components/site/sticky-cta";
import { BusinessJsonLd } from "@/components/site/json-ld";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <BusinessJsonLd />
      <SiteHeader />
      {/* pb accounts for the mobile sticky call/quote bar */}
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
