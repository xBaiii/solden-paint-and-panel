import { services } from "@/content/services";

/**
 * Site navigation as data. Adding a page means adding an entry here — the
 * header, the mobile overlay and the footer all read from this.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Present on items that open a flyout of child links. */
  children?: { label: string; href: string; description?: string }[];
};

/** The nine services worth surfacing directly in the nav flyout. */
const featuredServiceSlugs = [
  "smash-repairs",
  "spray-painting",
  "paintless-dent-removal",
  "truck-and-commercial",
  "protection-liners",
  "custom-paint",
  "motorcycle-paintwork",
  "detailing",
  "glass-replacement",
];

export const mainNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: featuredServiceSlugs
      .map((slug) => services.find((s) => s.slug === slug))
      .filter((s): s is (typeof services)[number] => s !== undefined)
      .map((service) => ({
        label: service.shortName,
        href: `/services/${service.slug}`,
        description: service.excerpt,
      })),
  },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = [
  {
    heading: "Services",
    links: services
      .slice(0, 8)
      .map((s) => ({ label: s.shortName, href: `/services/${s.slug}` })),
  },
  {
    heading: "More services",
    links: services
      .slice(8)
      .map((s) => ({ label: s.shortName, href: `/services/${s.slug}` })),
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Reviews", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
      { label: "Get a free quote", href: "/quote" },
    ],
  },
];
