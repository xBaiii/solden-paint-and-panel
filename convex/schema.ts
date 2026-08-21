import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import {
  contactMethodValidator,
  damageTypeValidator,
  leadEventTypeValidator,
  leadPriorityValidator,
  leadStatusValidator,
  userRoleValidator,
} from "./lib/constants";

/** Where a lead came from. Captured client-side on wizard mount. */
const attribution = v.object({
  page: v.optional(v.string()),
  referrer: v.optional(v.string()),
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  gclid: v.optional(v.string()),
});

export default defineSchema({
  // Convex Auth's tables (authAccounts, authSessions, ...) plus our own user
  // profile fields. Roles live here so authorization never depends on the client.
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),

    role: v.optional(userRoleValidator),
    /** Deactivated staff keep their history but cannot sign in. */
    active: v.optional(v.boolean()),
  }).index("email", ["email"]),

  /**
   * Invite-only signup. A row must exist and be unconsumed for a new email to
   * create an account — see model/auth.ts.
   */
  invites: defineTable({
    email: v.string(),
    role: userRoleValidator,
    invitedBy: v.id("users"),
    consumedAt: v.optional(v.number()),
    expiresAt: v.number(),
  }).index("by_email", ["email"]),

  leads: defineTable({
    // --- contact -----------------------------------------------------------
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    suburb: v.optional(v.string()),
    postcode: v.optional(v.string()),
    preferredContact: contactMethodValidator,
    bestTime: v.optional(v.string()),

    // --- vehicle -----------------------------------------------------------
    vehicleMake: v.optional(v.string()),
    vehicleModel: v.optional(v.string()),
    vehicleYear: v.optional(v.string()),
    vehicleColour: v.optional(v.string()),
    rego: v.optional(v.string()),
    driveable: v.optional(v.boolean()),

    // --- the job -----------------------------------------------------------
    /** Set when the enquiry started from a service landing page. */
    serviceSlug: v.optional(v.string()),
    damageTypes: v.array(damageTypeValidator),
    description: v.optional(v.string()),
    /** Bounded by UPLOAD_LIMITS.maxPerLead, so an array field is safe here. */
    photoIds: v.array(v.id("_storage")),

    // --- insurance ---------------------------------------------------------
    isClaim: v.boolean(),
    insurer: v.optional(v.string()),
    claimNumber: v.optional(v.string()),

    // --- pipeline ----------------------------------------------------------
    status: leadStatusValidator,
    priority: leadPriorityValidator,
    assignedTo: v.optional(v.id("users")),
    tags: v.array(v.string()),
    quotedAmount: v.optional(v.number()),
    lostReason: v.optional(v.string()),
    lastContactedAt: v.optional(v.number()),
    /** Cleared the first time a signed-in user opens the lead. */
    readAt: v.optional(v.number()),
    archived: v.boolean(),

    source: v.optional(attribution),
  })
    .index("by_status", ["status"])
    .index("by_archived_and_status", ["archived", "status"])
    .index("by_assignedTo", ["assignedTo"])
    .index("by_phone", ["phone"])
    .index("by_email", ["email"])
    .searchIndex("search_lead", {
      searchField: "name",
      filterFields: ["status", "archived"],
    }),

  /**
   * Append-only activity feed and audit log. A separate table rather than an
   * array on the lead, so it can grow without bound.
   */
  leadEvents: defineTable({
    leadId: v.id("leads"),
    type: leadEventTypeValidator,
    /** Null for events caused by the public form rather than a staff member. */
    actorId: v.optional(v.id("users")),
    body: v.optional(v.string()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    meta: v.optional(v.record(v.string(), v.string())),
  }).index("by_lead", ["leadId"]),

  /** Sliding-window counters for anonymous HTTP endpoints, keyed by hashed IP. */
  rateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_key", ["key"]),

  /** Editable notification recipients, so the shop can change them without a deploy. */
  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
