import { v } from "convex/values";
import { contactMethodValidator, damageTypeValidator } from "./constants";

/**
 * The shape the public quote wizard submits. Defined once and reused by the
 * internal mutation's `args`, so the HTTP action and the mutation cannot drift.
 */
export const leadSubmissionValidator = v.object({
  name: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  suburb: v.optional(v.string()),
  postcode: v.optional(v.string()),
  preferredContact: contactMethodValidator,
  bestTime: v.optional(v.string()),

  vehicleMake: v.optional(v.string()),
  vehicleModel: v.optional(v.string()),
  vehicleYear: v.optional(v.string()),
  vehicleColour: v.optional(v.string()),
  rego: v.optional(v.string()),
  driveable: v.optional(v.boolean()),

  serviceSlug: v.optional(v.string()),
  damageTypes: v.array(damageTypeValidator),
  description: v.optional(v.string()),
  photoIds: v.array(v.id("_storage")),

  isClaim: v.boolean(),
  insurer: v.optional(v.string()),
  claimNumber: v.optional(v.string()),

  source: v.optional(
    v.object({
      page: v.optional(v.string()),
      referrer: v.optional(v.string()),
      utmSource: v.optional(v.string()),
      utmMedium: v.optional(v.string()),
      utmCampaign: v.optional(v.string()),
      utmTerm: v.optional(v.string()),
      utmContent: v.optional(v.string()),
      gclid: v.optional(v.string()),
    }),
  ),
});
