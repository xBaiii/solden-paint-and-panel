import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { userRoleValidator } from "./lib/constants";
import {
  getCurrentUser,
  requireAdmin,
  requireUser,
  toPublicUser,
} from "./model/auth";

const publicUserValidator = v.object({
  _id: v.id("users"),
  name: v.union(v.string(), v.null()),
  email: v.union(v.string(), v.null()),
  role: v.union(userRoleValidator, v.null()),
  active: v.boolean(),
});

/** The signed-in user, or null. Drives the dashboard shell and route guards. */
export const me = query({
  args: {},
  returns: v.union(publicUserValidator, v.null()),
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user === null ? null : toPublicUser(user);
  },
});

/** Team members, for the assignee picker and the settings page. */
export const list = query({
  args: {},
  returns: v.array(publicUserValidator),
  handler: async (ctx) => {
    await requireUser(ctx);
    // The team is a handful of people; bounded so this can never scan unbounded.
    const users = await ctx.db.query("users").take(200);
    return users
      .filter((u) => u.isAnonymous !== true)
      .map(toPublicUser)
      .sort((a, b) => (a.name ?? a.email ?? "").localeCompare(b.name ?? b.email ?? ""));
  },
});

export const updateProfile = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const user = await requireUser(ctx);
    const trimmed = name.trim();
    if (trimmed.length === 0) throw new Error("Please enter a name.");
    await ctx.db.patch(user._id, { name: trimmed });
    return null;
  },
});

/* --- team administration -------------------------------------------------- */

export const listInvites = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("invites"),
      email: v.string(),
      role: userRoleValidator,
      consumed: v.boolean(),
      expired: v.boolean(),
      expiresAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const invites = await ctx.db.query("invites").order("desc").take(100);
    const now = Date.now();
    return invites.map((invite) => ({
      _id: invite._id,
      email: invite.email,
      role: invite.role,
      consumed: invite.consumedAt !== undefined,
      expired: invite.expiresAt < now,
      expiresAt: invite.expiresAt,
    }));
  },
});

/**
 * Creates an invite. The invited person then signs up with this email address
 * and the auth callback in convex/auth.ts consumes the invite and applies the
 * role — the client never gets to choose its own role.
 */
export const createInvite = mutation({
  args: { email: v.string(), role: userRoleValidator },
  returns: v.id("invites"),
  handler: async (ctx, { email, role }) => {
    const admin = await requireAdmin(ctx);
    const normalised = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalised)) {
      throw new Error("Please enter a valid email address.");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", normalised))
      .first();
    if (existingUser !== null) {
      throw new Error("Someone with that email address already has an account.");
    }

    return await ctx.db.insert("invites", {
      email: normalised,
      role,
      invitedBy: admin._id,
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
    });
  },
});

export const revokeInvite = mutation({
  args: { inviteId: v.id("invites") },
  returns: v.null(),
  handler: async (ctx, { inviteId }) => {
    await requireAdmin(ctx);
    const invite = await ctx.db.get(inviteId);
    if (invite === null) return null;
    if (invite.consumedAt !== undefined) {
      throw new Error("That invite has already been used.");
    }
    await ctx.db.delete(inviteId);
    return null;
  },
});

export const setRole = mutation({
  args: { userId: v.id("users"), role: userRoleValidator },
  returns: v.null(),
  handler: async (ctx, { userId, role }) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === userId) {
      throw new Error("You cannot change your own role.");
    }
    const target = await ctx.db.get(userId);
    if (target === null) throw new Error("That user no longer exists.");
    // Only an owner may create or demote another owner.
    if ((target.role === "owner" || role === "owner") && admin.role !== "owner") {
      throw new Error("Only the owner can manage owner access.");
    }
    await ctx.db.patch(userId, { role });
    return null;
  },
});

export const setActive = mutation({
  args: { userId: v.id("users"), active: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { userId, active }) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === userId) {
      throw new Error("You cannot deactivate your own account.");
    }
    const target = await ctx.db.get(userId);
    if (target === null) throw new Error("That user no longer exists.");
    if (target.role === "owner" && admin.role !== "owner") {
      throw new Error("Only the owner can deactivate the owner account.");
    }
    await ctx.db.patch(userId, { active });
    return null;
  },
});

/* --- settings ------------------------------------------------------------- */

export const getSettings = query({
  args: {},
  returns: v.record(v.string(), v.string()),
  handler: async (ctx) => {
    await requireUser(ctx);
    const rows = await ctx.db.query("settings").take(100);
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    return settings;
  },
});

export const setSetting = mutation({
  args: { key: v.string(), value: v.string() },
  returns: v.null(),
  handler: async (ctx, { key, value }) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    if (existing === null) {
      await ctx.db.insert("settings", { key, value });
    } else {
      await ctx.db.patch(existing._id, { value });
    }
    return null;
  },
});
