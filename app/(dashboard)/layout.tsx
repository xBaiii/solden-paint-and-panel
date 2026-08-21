import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Solden Dashboard" },
  robots: { index: false, follow: false },
};

/**
 * Convex + auth are mounted here rather than in the root layout, so the public
 * marketing pages never read cookies and stay statically rendered.
 *
 * proxy.ts redirects unauthenticated requests before this renders, and every
 * Convex function re-checks the session server-side — this layout is chrome,
 * not a security boundary.
 */
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
        <DashboardShell>{children}</DashboardShell>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
