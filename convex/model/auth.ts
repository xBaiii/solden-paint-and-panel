import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ADMIN_ROLES, type UserRole } from "../lib/constants";

/**
 * Authorization helpers. Every dashboard-facing function starts with one of
 * these — identity is always derived server-side from the session, never taken
 * as an argument.
 */

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users"> | null> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) return null;
  const user = await ctx.db.get(userId);
  if (user === null || user.active === false) return null;
  return user;
}

/** Throws unless there is an active signed-in user. */
export async function requireUser(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
  const user = await getCurrentUser(ctx);
  if (user === null) {
    throw new Error("Not signed in.");
  }
  return user;
}

/** Throws unless the signed-in user holds one of `roles`. */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  roles: UserRole[],
): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role === undefined || !roles.includes(user.role)) {
    throw new Error("You don't have permission to do that.");
  }
  return user;
}

/** Throws unless the signed-in user can manage the team and settings. */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<Doc<"users">> {
  return requireRole(ctx, ADMIN_ROLES);
}

export function isAdminRole(role: UserRole | undefined): boolean {
  return role !== undefined && ADMIN_ROLES.includes(role);
}

export type PublicUser = {
  _id: Id<"users">;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  active: boolean;
};

/** Strips auth internals before a user document is sent to the client. */
export function toPublicUser(user: Doc<"users">): PublicUser {
  return {
    _id: user._id,
    name: user.name ?? null,
    email: user.email ?? null,
    role: (user.role as UserRole | undefined) ?? null,
    active: user.active !== false,
  };
}
