import { v } from "convex/values";
import { paginationOptsValidator, paginationResultValidator } from "convex/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import schema from "./schema";
import { leadSubmissionValidator } from "./lib/validators";
import {
  LEAD_STATUSES,
  OPEN_STATUSES,
  RATE_LIMIT,
  leadPriorityValidator,
  leadStatusValidator,
  type LeadStatus,
} from "./lib/constants";
import { requireUser } from "./model/auth";
import { consumeRateLimit, logEvent, photoUrls } from "./model/leads";

/* ---------------------------------------------------------------------------
   Public submission — internal only, called from the HTTP action in http.ts.
   Never exposed as a public mutation, so the rate limit and spam checks in the
   HTTP layer cannot be bypassed.
   --------------------------------------------------------------------------- */

export const create = internalMutation({
  args: { submission: leadSubmissionValidator },
  returns: v.id("leads"),
  handler: async (ctx, { submission }) => {
    const leadId = await ctx.db.insert("leads", {
      ...submission,
      status: "new",
      priority: submission.isClaim ? "high" : "normal",
      tags: [],
      archived: false,
    });

    await logEvent(ctx, {
      leadId,
      type: "created",
      body: "Enquiry submitted from the website.",
    });

    // Fire-and-forget, so a mail outage can never fail a customer submission.
    await ctx.scheduler.runAfter(0, internal.notifications.sendLeadEmails, {
      leadId,
    });

    return leadId;
  },
});

/** Rate-limit gate for the anonymous HTTP endpoints. */
export const checkRateLimit = internalMutation({
  args: {
    key: v.string(),
    kind: v.union(v.literal("submit"), v.literal("upload")),
  },
  returns: v.boolean(),
  handler: async (ctx, { key, kind }) => {
    const limit = kind === "submit" ? RATE_LIMIT.submissions : RATE_LIMIT.uploads;
    return await consumeRateLimit(ctx, `${kind}:${key}`, limit);
  },
});

export const getInternal = internalQuery({
  args: { leadId: v.id("leads") },
  returns: v.union(schema.doc("leads"), v.null()),
  handler: async (ctx, { leadId }) => await ctx.db.get(leadId),
});

/* ---------------------------------------------------------------------------
   Dashboard API — every function below requires an active signed-in user.
   --------------------------------------------------------------------------- */

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    status: v.optional(leadStatusValidator),
    archived: v.optional(v.boolean()),
    assignedTo: v.optional(v.id("users")),
    search: v.optional(v.string()),
  },
  returns: paginationResultValidator(schema.doc("leads")),
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const archived = args.archived ?? false;

    // Full-text search takes precedence; it has its own index.
    if (args.search !== undefined && args.search.trim().length > 0) {
      const term = args.search.trim();
      const status = args.status;
      return await ctx.db
        .query("leads")
        .withSearchIndex("search_lead", (q) => {
          const base = q.search("name", term).eq("archived", archived);
          return status === undefined ? base : base.eq("status", status);
        })
        .paginate(args.paginationOpts);
    }

    if (args.assignedTo !== undefined) {
      const assignedTo = args.assignedTo;
      return await ctx.db
        .query("leads")
        .withIndex("by_assignedTo", (q) => q.eq("assignedTo", assignedTo))
        .order("desc")
        .paginate(args.paginationOpts);
    }

    if (args.status !== undefined) {
      const status = args.status;
      return await ctx.db
        .query("leads")
        .withIndex("by_archived_and_status", (q) =>
          q.eq("archived", archived).eq("status", status),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    }

    return await ctx.db
      .query("leads")
      .withIndex("by_archived_and_status", (q) => q.eq("archived", archived))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** Counts per status, for the tab badges. */
export const statusCounts = query({
  args: { archived: v.optional(v.boolean()) },
  returns: v.record(v.string(), v.number()),
  handler: async (ctx, args) => {
    await requireUser(ctx);
    const archived = args.archived ?? false;
    const counts: Record<string, number> = { all: 0 };
    for (const status of LEAD_STATUSES) counts[status] = 0;

    // Volumes here are small (a busy panel shop is hundreds of leads a year),
    // so one indexed scan is cheaper than maintaining counter documents.
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_archived_and_status", (q) => q.eq("archived", archived))
      .collect();

    for (const lead of leads) {
      counts[lead.status] = (counts[lead.status] ?? 0) + 1;
      counts.all += 1;
    }
    return counts;
  },
});

export const get = query({
  args: { leadId: v.id("leads") },
  returns: v.union(
    v.null(),
    v.object({
      lead: schema.doc("leads"),
      photos: v.array(
        v.object({ storageId: v.id("_storage"), url: v.string() }),
      ),
      events: v.array(schema.doc("leadEvents")),
      actorNames: v.record(v.string(), v.string()),
      assigneeName: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx, { leadId }) => {
    await requireUser(ctx);
    const lead = await ctx.db.get(leadId);
    if (lead === null) return null;

    const events = await ctx.db
      .query("leadEvents")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .order("desc")
      .collect();

    const actorIds = [
      ...new Set(
        events
          .map((e) => e.actorId)
          .filter((id): id is Id<"users"> => id !== undefined),
      ),
    ];
    const actors = await Promise.all(actorIds.map((id) => ctx.db.get(id)));
    const actorNames: Record<string, string> = {};
    for (const actor of actors) {
      if (actor !== null) {
        actorNames[actor._id] = actor.name ?? actor.email ?? "Unknown";
      }
    }

    const assignee =
      lead.assignedTo === undefined ? null : await ctx.db.get(lead.assignedTo);

    return {
      lead,
      photos: await photoUrls(ctx, lead.photoIds),
      events,
      actorNames,
      assigneeName: assignee?.name ?? assignee?.email ?? null,
    };
  },
});

/** Overview metrics for the dashboard home. */
export const stats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    newThisWeek: v.number(),
    unactioned: v.number(),
    inPipeline: v.number(),
    completedThisMonth: v.number(),
    claims: v.number(),
    bySource: v.record(v.string(), v.number()),
    /** Zero-filled 30-day series, built here so the client does no date math. */
    series: v.array(v.object({ date: v.string(), leads: v.number() })),
  }),
  handler: async (ctx) => {
    await requireUser(ctx);
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_archived_and_status", (q) => q.eq("archived", false))
      .collect();

    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const bySource: Record<string, number> = {};
    const byDay: Record<string, number> = {};

    for (const lead of leads) {
      const source = lead.source?.utmSource ?? "direct";
      bySource[source] = (bySource[source] ?? 0) + 1;
      if (lead._creationTime >= monthAgo) {
        const day = new Date(lead._creationTime).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + 1;
      }
    }

    // Zero-fill the window so the chart never implies activity that isn't there.
    const series: { date: string; leads: number }[] = [];
    for (let offset = 29; offset >= 0; offset -= 1) {
      const day = new Date(now - offset * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      series.push({ date: day, leads: byDay[day] ?? 0 });
    }

    return {
      total: leads.length,
      newThisWeek: leads.filter((l) => l._creationTime >= weekAgo).length,
      unactioned: leads.filter((l) => l.status === "new").length,
      inPipeline: leads.filter((l) =>
        OPEN_STATUSES.includes(l.status as LeadStatus),
      ).length,
      completedThisMonth: leads.filter(
        (l) => l.status === "completed" && l._creationTime >= monthAgo,
      ).length,
      claims: leads.filter((l) => l.isClaim).length,
      bySource,
      series,
    };
  },
});

/* --- mutations ------------------------------------------------------------ */

export const setStatus = mutation({
  args: { leadId: v.id("leads"), status: leadStatusValidator },
  returns: v.null(),
  handler: async (ctx, { leadId, status }) => {
    const user = await requireUser(ctx);
    const lead = await ctx.db.get(leadId);
    if (lead === null) throw new Error("Lead not found.");
    if (lead.status === status) return null;

    await ctx.db.patch(leadId, {
      status,
      // "contacted" and beyond mean someone reached out, so stamp the time once.
      lastContactedAt:
        status === "new"
          ? lead.lastContactedAt
          : (lead.lastContactedAt ?? Date.now()),
    });
    await logEvent(ctx, {
      leadId,
      type: "status_changed",
      actorId: user._id,
      from: lead.status,
      to: status,
    });
    return null;
  },
});

export const assign = mutation({
  args: { leadId: v.id("leads"), assignedTo: v.union(v.id("users"), v.null()) },
  returns: v.null(),
  handler: async (ctx, { leadId, assignedTo }) => {
    const user = await requireUser(ctx);
    const lead = await ctx.db.get(leadId);
    if (lead === null) throw new Error("Lead not found.");

    await ctx.db.patch(leadId, {
      assignedTo: assignedTo === null ? undefined : assignedTo,
    });

    const target = assignedTo === null ? null : await ctx.db.get(assignedTo);
    await logEvent(ctx, {
      leadId,
      type: "assigned",
      actorId: user._id,
      to:
        target === null
          ? "Unassigned"
          : (target.name ?? target.email ?? "Unknown"),
    });
    return null;
  },
});

export const addNote = mutation({
  args: { leadId: v.id("leads"), body: v.string() },
  returns: v.null(),
  handler: async (ctx, { leadId, body }) => {
    const user = await requireUser(ctx);
    const trimmed = body.trim();
    if (trimmed.length === 0) throw new Error("A note cannot be empty.");
    const lead = await ctx.db.get(leadId);
    if (lead === null) throw new Error("Lead not found.");

    await logEvent(ctx, {
      leadId,
      type: "note",
      actorId: user._id,
      body: trimmed,
    });
    return null;
  },
});

export const updateDetails = mutation({
  args: {
    leadId: v.id("leads"),
    priority: v.optional(leadPriorityValidator),
    tags: v.optional(v.array(v.string())),
    quotedAmount: v.optional(v.union(v.number(), v.null())),
    lostReason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (lead === null) throw new Error("Lead not found.");

    const patch: Partial<Doc<"leads">> = {};
    if (args.priority !== undefined) patch.priority = args.priority;
    if (args.tags !== undefined) patch.tags = args.tags;
    if (args.lostReason !== undefined) patch.lostReason = args.lostReason;
    if (args.quotedAmount !== undefined) {
      patch.quotedAmount =
        args.quotedAmount === null ? undefined : args.quotedAmount;
    }
    if (Object.keys(patch).length === 0) return null;

    await ctx.db.patch(args.leadId, patch);
    await logEvent(ctx, {
      leadId: args.leadId,
      type: "field_changed",
      actorId: user._id,
      body: `Updated ${Object.keys(patch).join(", ")}.`,
    });
    return null;
  },
});

export const setArchived = mutation({
  args: { leadIds: v.array(v.id("leads")), archived: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { leadIds, archived }) => {
    const user = await requireUser(ctx);
    for (const leadId of leadIds) {
      const lead = await ctx.db.get(leadId);
      if (lead === null || lead.archived === archived) continue;
      await ctx.db.patch(leadId, { archived });
      await logEvent(ctx, {
        leadId,
        type: "field_changed",
        actorId: user._id,
        body: archived ? "Archived." : "Restored from archive.",
      });
    }
    return null;
  },
});

/** Bulk status change from the table selection toolbar. */
export const bulkSetStatus = mutation({
  args: { leadIds: v.array(v.id("leads")), status: leadStatusValidator },
  returns: v.null(),
  handler: async (ctx, { leadIds, status }) => {
    const user = await requireUser(ctx);
    for (const leadId of leadIds) {
      const lead = await ctx.db.get(leadId);
      if (lead === null || lead.status === status) continue;
      await ctx.db.patch(leadId, { status });
      await logEvent(ctx, {
        leadId,
        type: "status_changed",
        actorId: user._id,
        from: lead.status,
        to: status,
      });
    }
    return null;
  },
});

/** Clears the unread marker. Silent — deliberately writes no timeline event. */
export const markRead = mutation({
  args: { leadId: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { leadId }) => {
    await requireUser(ctx);
    const lead = await ctx.db.get(leadId);
    if (lead === null || lead.readAt !== undefined) return null;
    await ctx.db.patch(leadId, { readAt: Date.now() });
    return null;
  },
});

/** Every non-archived lead, for CSV export. */
export const exportAll = query({
  args: {},
  returns: v.array(schema.doc("leads")),
  handler: async (ctx) => {
    await requireUser(ctx);
    return await ctx.db
      .query("leads")
      .withIndex("by_archived_and_status", (q) => q.eq("archived", false))
      .order("desc")
      .collect();
  },
});
