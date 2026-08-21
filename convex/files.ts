import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * The quote wizard uploads photos before the form is submitted, so an abandoned
 * form leaves files in storage that no lead references. This sweep, run daily by
 * convex/crons.ts, deletes anything older than a day that nothing points at.
 */
export const cleanupOrphanedUploads = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number(), scanned: v.number() }),
  handler: async (ctx) => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    // Files younger than the cutoff are left alone — a wizard may still be open.
    const files = await ctx.db.system.query("_storage").take(2000);
    const stale = files.filter((file) => file._creationTime < cutoff);
    if (stale.length === 0) {
      return { deleted: 0, scanned: files.length };
    }

    // Collect every storage id currently referenced by a lead.
    const referenced = new Set<Id<"_storage">>();
    for (const archived of [false, true]) {
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_archived_and_status", (q) => q.eq("archived", archived))
        .collect();
      for (const lead of leads) {
        for (const id of lead.photoIds) referenced.add(id);
      }
    }

    let deleted = 0;
    for (const file of stale) {
      if (referenced.has(file._id)) continue;
      await ctx.storage.delete(file._id);
      deleted += 1;
    }

    if (deleted > 0) {
      console.log(`[files] deleted ${deleted} orphaned upload(s).`);
    }
    return { deleted, scanned: files.length };
  },
});
