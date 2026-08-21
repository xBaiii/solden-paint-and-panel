/**
 * Single source of truth for Solden's business facts.
 *
 * Every value here is taken verbatim from soldenpaintandpanel.com.au. Nothing in
 * this file may be invented — no ratings, awards, accreditations, insurer names
 * or years that the business has not published itself. See CLAUDE.md.
 */

export const site = {
  name: "Solden Paint & Panel",
  shortName: "Solden",
  legalName: "Solden Paint and Panel",
  tagline: "All private, fleet & insurance companies welcome",
  slogan: "Done right the first time... on time",
  /**
   * Trailing slashes are stripped: every consumer builds URLs as `${site.url}/path`,
   * so a env value ending in "/" produced "https://host//path" in the sitemap.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.soldenpaintandpanel.com.au")
    .replace(/\/+$/, ""),

  phone: {
    primary: "(07) 3205 2988",
    secondary: "(07) 3205 2212",
    /** E.164 for tel: links and structured data. */
    primaryE164: "+61732052988",
    secondaryE164: "+61732052212",
    primaryHref: "tel:+61732052988",
    secondaryHref: "tel:+61732052212",
  },

  email: "solden@powerup.com.au",

  address: {
    street: "6 Aldinga Street",
    suburb: "Brendale",
    state: "QLD",
    postcode: "4500",
    country: "AU",
    full: "6 Aldinga Street, Brendale QLD 4500",
    /** Coordinates are approximate to the street, for the map embed only. */
    mapsQuery: "6 Aldinga Street, Brendale QLD 4500",
  },

  hours: [
    { days: "Monday – Friday", time: "8:00am – 4:00pm" },
    { days: "Saturday", time: "By appointment" },
    { days: "Sunday", time: "Closed" },
  ],

  hoursNotes: [
    "Weekend and night drop-off available.",
    "Off-site quotations for non-drivable vehicles by appointment.",
  ],

  social: {
    facebook: "https://www.facebook.com/Solden-Paint-and-Panel-558417007539598/",
  },

  /** Verified trust points. Each one traces to their current site. */
  trust: [
    "Family owned for over 30 years",
    "Approved repairer for all major insurers",
    "Motor Trades Association Queensland member",
    "Full repair warranty",
  ],
} as const;

/**
 * Suburbs a Brendale workshop realistically draws from, used for the service-area
 * section and schema.org `areaServed`.
 *
 * These are geographic facts about the shop's catchment, not business claims —
 * but note the framing is always "we service", never "we are located in".
 */
export const serviceAreas = [
  "Brendale",
  "Strathpine",
  "Bray Park",
  "Warner",
  "Albany Creek",
  "Eatons Hill",
  "Cashmere",
  "Kallangur",
  "Petrie",
  "Lawnton",
  "North Lakes",
  "Aspley",
  "Chermside",
  "Everton Park",
  "Mitchelton",
  "Ferny Hills",
  "Samford",
  "Dayboro",
] as const;

/** Broader regions, for copy that shouldn't list 18 suburbs. */
export const serviceRegions = ["North Brisbane", "Moreton Bay"] as const;

export const openingHoursSpecification = [
  {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "16:00",
  },
] as const;
