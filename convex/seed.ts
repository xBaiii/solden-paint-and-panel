import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { logEvent } from "./model/leads";
import type { DAMAGE_TYPES } from "./lib/constants";

/** The damage-type union, so the literals below stay narrow. */
type Damage = (typeof DAMAGE_TYPES)[number];

/**
 * Development seed data.
 *
 * Internal only, so it is not callable from the public API. Run it from the
 * Convex dashboard or with:
 *   npx convex run seed:reset '{"confirm":"yes"}'
 *
 * The leads below are invented sample data for populating an empty dashboard —
 * they are NOT real Solden customers. Nothing here is ever shown on the public
 * site, so the "no invented facts" rule in AGENTS.md does not apply.
 */

const SAMPLE_LEADS = [
  {
    name: "Rebecca Nguyen",
    phone: "0412 884 210",
    email: "rebecca.nguyen@example.com",
    suburb: "Strathpine",
    postcode: "4500",
    preferredContact: "phone" as const,
    bestTime: "Morning (8am – 12pm)",
    vehicleMake: "Mazda",
    vehicleModel: "CX-5",
    vehicleYear: "2021",
    vehicleColour: "Soul Red",
    rego: "812XKQ",
    driveable: true,
    damageTypes: ["collision", "scratch"],
    description:
      "Someone reversed into the rear quarter panel in the Westfield car park. Paint is scraped through and there's a decent dent above the wheel arch. Car drives fine.",
    isClaim: true,
    insurer: "RACQ",
    claimNumber: "RQ-8841203",
    status: "new" as const,
    priority: "high" as const,
    daysAgo: 0.2,
    source: { page: "/quote", utmSource: "google", utmMedium: "cpc", utmCampaign: "smash-repairs-brisbane" },
  },
  {
    name: "Darren Whitcombe",
    phone: "0438 117 902",
    email: "dwhitcombe@example.com",
    suburb: "Warner",
    postcode: "4500",
    preferredContact: "phone" as const,
    vehicleMake: "Toyota",
    vehicleModel: "Hilux SR5",
    vehicleYear: "2019",
    vehicleColour: "Graphite",
    rego: "441WNR",
    driveable: true,
    serviceSlug: "protection-liners",
    damageTypes: ["custom"],
    description:
      "After a Raptor liner for the tray, colour matched to the truck rather than black. Also keen on a quote for colour coding the bull bar.",
    isClaim: false,
    status: "quoted" as const,
    priority: "normal" as const,
    quotedAmount: 1850,
    daysAgo: 3,
    source: { page: "/services/protection-liners", utmSource: "google" },
  },
  {
    name: "Priya Raghavan",
    phone: "0401 662 335",
    email: "praghavan@example.com",
    suburb: "Albany Creek",
    postcode: "4035",
    preferredContact: "email" as const,
    vehicleMake: "Subaru",
    vehicleModel: "Outback",
    vehicleYear: "2017",
    vehicleColour: "Silver",
    driveable: true,
    damageTypes: ["hail", "dent"],
    description:
      "Caught in the storm two weeks ago. Bonnet and roof are covered in small dents but the paint looks intact everywhere.",
    isClaim: true,
    insurer: "Suncorp",
    status: "booked" as const,
    priority: "normal" as const,
    quotedAmount: 3200,
    daysAgo: 6,
    source: { page: "/services/paintless-dent-removal" },
  },
  {
    name: "Councillor Fleet Services",
    phone: "(07) 3881 4400",
    email: "fleet@example.com",
    suburb: "Brendale",
    postcode: "4500",
    preferredContact: "email" as const,
    vehicleMake: "Isuzu",
    vehicleModel: "NPR 45-155",
    vehicleYear: "2020",
    driveable: false,
    serviceSlug: "truck-and-commercial",
    damageTypes: ["collision"],
    description:
      "Fleet truck clipped a gate post — driver's side door and front guard. Not safe to drive. Need an on-site quote, we have four more due for pre-sale detailing as well.",
    isClaim: false,
    status: "contacted" as const,
    priority: "high" as const,
    daysAgo: 1.5,
    source: { page: "/services/truck-and-commercial", referrer: "https://www.google.com/" },
  },
  {
    name: "Tom Ashby",
    phone: "0455 208 771",
    suburb: "Bray Park",
    postcode: "4500",
    preferredContact: "sms" as const,
    vehicleMake: "Ford",
    vehicleModel: "Mustang GT",
    vehicleYear: "2016",
    vehicleColour: "Race Red",
    driveable: true,
    serviceSlug: "detailing",
    damageTypes: ["detailing"],
    description: "Paint has gone flat after a few years outside. After a cut and polish.",
    isClaim: false,
    status: "completed" as const,
    priority: "low" as const,
    quotedAmount: 690,
    daysAgo: 21,
    source: { page: "/services/detailing" },
  },
  {
    name: "Janelle Fitzsimmons",
    phone: "0407 993 118",
    email: "jfitz@example.com",
    suburb: "Cashmere",
    postcode: "4500",
    preferredContact: "phone" as const,
    vehicleMake: "Volkswagen",
    vehicleModel: "Golf R",
    vehicleYear: "2022",
    vehicleColour: "Lapiz Blue",
    driveable: true,
    damageTypes: ["glass"],
    description: "Stone chip in the windscreen, right in the driver's line of sight.",
    isClaim: true,
    insurer: "AAMI",
    status: "lost" as const,
    priority: "normal" as const,
    lostReason: "Insurer sent them to a windscreen specialist",
    daysAgo: 14,
    source: { page: "/services/glass-replacement" },
  },
  {
    name: "Marco Bellini",
    phone: "0422 570 664",
    email: "marco.b@example.com",
    suburb: "Kallangur",
    postcode: "4503",
    preferredContact: "phone" as const,
    vehicleMake: "Ducati",
    vehicleModel: "Monster 821",
    vehicleYear: "2018",
    vehicleColour: "Matte black",
    driveable: false,
    serviceSlug: "motorcycle-paintwork",
    damageTypes: ["collision", "custom"],
    description:
      "Dropped it at low speed. Tank is scuffed and the front guard is cracked. While it's apart I'd like to talk about a custom scheme.",
    isClaim: false,
    status: "new" as const,
    priority: "normal" as const,
    daysAgo: 0.6,
    source: { page: "/services/motorcycle-paintwork", utmSource: "facebook", utmMedium: "social" },
  },
  {
    name: "Helen Kirkbride",
    phone: "0417 340 882",
    email: "hkirkbride@example.com",
    suburb: "Eatons Hill",
    postcode: "4037",
    preferredContact: "phone" as const,
    vehicleMake: "Honda",
    vehicleModel: "CR-V",
    vehicleYear: "2015",
    vehicleColour: "White",
    driveable: true,
    damageTypes: ["rust", "respray"],
    description:
      "Rust bubbling along the bottom of both rear doors. Would like to know whether it's worth repairing or if I should just sell it.",
    isClaim: false,
    status: "contacted" as const,
    priority: "normal" as const,
    daysAgo: 9,
    source: { page: "/quote" },
  },
];

const DAY = 24 * 60 * 60 * 1000;

export const reset = internalMutation({
  args: { confirm: v.string() },
  returns: v.object({ deleted: v.number(), inserted: v.number() }),
  handler: async (ctx, { confirm }) => {
    if (confirm !== "yes") {
      throw new Error(
        'Pass {"confirm":"yes"} — this deletes every lead and lead event.',
      );
    }

    // Clear existing leads and their events.
    let deleted = 0;
    for (const archived of [false, true]) {
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_archived_and_status", (q) => q.eq("archived", archived))
        .collect();
      for (const lead of leads) {
        const events = await ctx.db
          .query("leadEvents")
          .withIndex("by_lead", (q) => q.eq("leadId", lead._id))
          .collect();
        for (const event of events) await ctx.db.delete(event._id);
        await ctx.db.delete(lead._id);
        deleted += 1;
      }
    }

    const now = Date.now();
    let inserted = 0;

    for (const sample of SAMPLE_LEADS) {
      const { daysAgo, ...rest } = sample;
      const leadId = await ctx.db.insert("leads", {
        ...rest,
        // Authored as literals above, so this narrowing is safe.
        damageTypes: rest.damageTypes as Damage[],
        photoIds: [],
        tags: [],
        archived: false,
        // Anything past "new" has obviously been opened by someone.
        readAt: rest.status === "new" ? undefined : now - daysAgo * DAY + 3600_000,
        lastContactedAt:
          rest.status === "new" ? undefined : now - daysAgo * DAY + 7200_000,
      });

      await logEvent(ctx, {
        leadId,
        type: "created",
        body: "Enquiry submitted from the website.",
      });

      if (rest.status !== "new") {
        await logEvent(ctx, {
          leadId,
          type: "status_changed",
          from: "new",
          to: rest.status,
        });
      }
      inserted += 1;
    }

    return { deleted, inserted };
  },
});

/** Clears the anonymous rate-limit counters. Dev convenience for testing. */
export const clearRateLimits = internalMutation({
  args: {},
  returns: v.object({ cleared: v.number() }),
  handler: async (ctx) => {
    const rows = await ctx.db.query("rateLimits").take(1000);
    for (const row of rows) await ctx.db.delete(row._id);
    return { cleared: rows.length };
  },
});
