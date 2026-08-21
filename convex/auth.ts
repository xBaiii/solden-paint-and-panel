import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { MutationCtx } from "./_generated/server";
import { ADMIN_ROLES, type UserRole } from "./lib/constants";

/**
 * Email + password auth for the internal dashboard.
 *
 * Signup is invite-only: the first account ever created becomes the owner, and
 * every account after that must have an unconsumed, unexpired invite matching
 * its email address. This runs server-side in a callback, so a client cannot
 * skip it or nominate its own role.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({ id: "password" })],

  callbacks: {
    async afterUserCreatedOrUpdated(baseCtx, { userId, existingUserId, profile }) {
      // Existing account signing in again — nothing to provision.
      if (existingUserId !== null) return;

      const ctx = baseCtx as unknown as MutationCtx;
      const email = typeof profile.email === "string" ? profile.email.toLowerCase() : null;

      // Is this the very first account on the deployment?
      const others = await ctx.db.query("users").take(2);
      const isFirstUser = others.filter((u) => u._id !== userId).length === 0;

      if (isFirstUser) {
        await ctx.db.patch(userId, { role: "owner", active: true, email: email ?? undefined });
        return;
      }

      if (email === null) {
        throw new Error("An email address is required to create an account.");
      }

      const invite = await ctx.db
        .query("invites")
        .withIndex("by_email", (q) => q.eq("email", email))
        .order("desc")
        .first();

      if (
        invite === null ||
        invite.consumedAt !== undefined ||
        invite.expiresAt < Date.now()
      ) {
        // Roll the half-created user back so a rejected signup leaves no trace.
        await ctx.db.delete(userId);
        throw new Error(
          "That email address has not been invited. Ask an administrator for an invite.",
        );
      }

      await ctx.db.patch(userId, {
        role: invite.role as UserRole,
        active: true,
        email,
      });
      await ctx.db.patch(invite._id, { consumedAt: Date.now() });
    },

    async beforeSessionCreation(baseCtx, { userId }) {
      const ctx = baseCtx as unknown as MutationCtx;
      const user = await ctx.db.get(userId);
      if (user === null) throw new Error("Account not found.");
      // `active` is only ever explicitly false for a deactivated account.
      if (user.active === false) {
        throw new Error("This account has been deactivated.");
      }
    },
  },
});

/** Re-exported so callers don't need to reach into lib/constants. */
export { ADMIN_ROLES };
