import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { RATE_LIMIT, type LeadEventType } from "../lib/constants";

/** Business logic for leads. Function wrappers in convex/leads.ts stay thin. */

export async function logEvent(
  ctx: MutationCtx,
  args: {
    leadId: Id<"leads">;
    type: LeadEventType;
    actorId?: Id<"users">;
    body?: string;
    from?: string;
    to?: string;
    meta?: Record<string, string>;
  },
): Promise<Id<"leadEvents">> {
  return await ctx.db.insert("leadEvents", args);
}

/**
 * Sliding-window rate limit for anonymous endpoints, keyed by a hash of the
 * caller's IP. Returns false when the caller is over the limit.
 */
export async function consumeRateLimit(
  ctx: MutationCtx,
  key: string,
  limit: number,
): Promise<boolean> {
  const now = Date.now();
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();

  if (existing === null) {
    await ctx.db.insert("rateLimits", { key, count: 1, windowStart: now });
    return true;
  }

  // Window elapsed — start a fresh one.
  if (now - existing.windowStart > RATE_LIMIT.windowMs) {
    await ctx.db.patch(existing._id, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= limit) return false;

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
  return true;
}

/** A one-line human summary used in emails and the dashboard list. */
export function summariseLead(lead: Doc<"leads">): string {
  const vehicle = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join(" ");
  const damage = lead.damageTypes.join(", ");
  const parts = [vehicle, damage].filter((p) => p.length > 0);
  return parts.length > 0 ? parts.join(" — ") : "Enquiry";
}

/** Resolves signed URLs for a lead's photos, dropping any that have expired. */
export async function photoUrls(
  ctx: QueryCtx,
  photoIds: Id<"_storage">[],
): Promise<{ storageId: Id<"_storage">; url: string }[]> {
  const resolved = await Promise.all(
    photoIds.map(async (storageId) => {
      const url = await ctx.storage.getUrl(storageId);
      return url === null ? null : { storageId, url };
    }),
  );
  return resolved.filter(
    (entry): entry is { storageId: Id<"_storage">; url: string } => entry !== null,
  );
}
