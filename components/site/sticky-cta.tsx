"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareText, Phone } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Mobile-only call/quote bar. Hidden on the quote flow itself, where it would
 * compete with the form's own submit button.
 */
export function StickyCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/quote")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-background/95 backdrop-blur-xl lg:hidden">
      <div
        className="grid grid-cols-2 gap-2 p-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <a
          href={site.phone.primaryHref}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 text-sm font-semibold text-foreground"
        >
          <Phone className="size-4 text-brand-600" />
          Call now
        </a>
        <Link
          href="/quote"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white"
        >
          <MessageSquareText className="size-4" />
          Free quote
        </Link>
      </div>
    </div>
  );
}
