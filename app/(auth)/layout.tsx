import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/convex-client-provider";

/**
 * Convex + auth are scoped to the authenticated areas only. Keeping them out of
 * the root layout means the marketing pages don't read cookies, so they stay
 * statically rendered.
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
