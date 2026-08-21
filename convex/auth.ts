import { ConvexError } from "convex/values";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import type { MutationCtx } from "./_generated/server";
import { ADMIN_ROLES, type UserRole } from "./lib/constants";

/**
 * Email + password auth for the internal dashboard.
 *
 * Errors here are ConvexError, not Error. Convex redacts plain Error messages
 * from public functions in production ("Server Error"), so a plain throw would
 * leave the sign-in form unable to tell "not invited" from "wrong password".
 *
 * Signup is invite-only: the first account ever created becomes the owner, and
 * every account after that must have an unconsumed, unexpired invite matching
 * its email address. This runs server-side in a callback, so a client cannot
 * skip it or nominate its own role.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      id: "password",
      /**
       * The default `profile` maps only `email`, which silently discarded the
       * name the sign-up form collects — leaving the dashboard showing an email
       * address instead of the person.
       */
      profile(params) {
        const email = String(params.email ?? "").toLowerCase();
        const name = typeof params.name === "string" ? params.name.trim() : "";
        // `undefined` is not a Convex value, so the key is omitted rather than
        // set to undefined when no name was supplied.
        return { email, ...(name.length > 0 ? { name } : {}) };
      },
    }),
  ],

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
        throw new ConvexError(
          "An email address is required to create an account.",
        );
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
        throw new ConvexError(
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
      if (user === null) throw new ConvexError("Account not found.");
      // `active` is only ever explicitly false for a deactivated account.
      if (user.active === false) {
        throw new ConvexError("This account has been deactivated.");
      }
    },
  },
});

/** Re-exported so callers don't need to reach into lib/constants. */
export { ADMIN_ROLES };
