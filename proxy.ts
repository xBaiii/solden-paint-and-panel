import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

/**
 * Next.js 16 renamed `middleware` to `proxy` (Node runtime only, not
 * configurable). Convex Auth still returns a standard Next middleware handler,
 * so it is exported as `proxy` here.
 *
 * This is a first gate for UX, not the security boundary: every Convex function
 * independently checks the session server-side via requireUser/requireRole, so
 * a bypass here would still not expose data.
 */
const isDashboard = createRouteMatcher(["/dashboard", "/dashboard/(.*)"]);
const isSignIn = createRouteMatcher(["/sign-in"]);

export const proxy = convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    const authenticated = await convexAuth.isAuthenticated();

    if (isDashboard(request) && !authenticated) {
      return nextjsMiddlewareRedirect(request, "/sign-in");
    }
    // Already signed in — no reason to show the sign-in form again.
    if (isSignIn(request) && authenticated) {
      return nextjsMiddlewareRedirect(request, "/dashboard");
    }
  },
);

export default proxy;

/**
 * Scoped deliberately to the authenticated areas. The marketing pages are
 * static and use no Convex client, so running the proxy across them would cost
 * a Node invocation per request for nothing.
 *
 * Paths are listed explicitly rather than as a negative-lookahead regex: the
 * regex form is easy to get subtly wrong (a lost backslash silently matches
 * everything or nothing), and this is a security-adjacent control.
 */
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/sign-in"],
};
