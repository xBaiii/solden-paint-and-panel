import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

/**
 * Next.js 16 renamed `middleware` to `proxy` (Node runtime only). Convex Auth
 * still returns a standard Next middleware handler, so it is exported as
 * `proxy` here.
 *
 * This is a first gate, not the security boundary: every Convex function also
 * checks the session server-side via requireUser/requireRole.
 */
const isDashboard = createRouteMatcher(["/dashboard(.*)"]);
const isSignIn = createRouteMatcher(["/sign-in"]);

export const proxy = convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const authenticated = await convexAuth.isAuthenticated();

  if (isDashboard(request) && !authenticated) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
  if (isSignIn(request) && authenticated) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }
});

export default proxy;

export const config = {
  // Skip static assets and Next internals.
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
