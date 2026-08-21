"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav } from "@/lib/nav";
import { site } from "@/lib/site";

/**
 * Sticky header that starts transparent over a dark hero and detaches into a
 * floating, blurred pill once the page scrolls past 20px — the nav pattern the
 * client asked for.
 *
 * `variant="overlay"` is for pages that open on a dark hero (white links over
 * the image until scroll). `variant="solid"` starts in the pill state, for pages
 * with a light header area where white-on-white would be invisible.
 */
export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll(); // the page may load already scrolled (back navigation, anchors)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Lock body scroll behind the mobile overlay.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setServicesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Piled = the compact floating card. Overlay pages only pile once scrolled. */
  const piled = variant === "solid" || scrolled || menuOpen;
  /** Dark-on-light link colours apply whenever the pill background is showing. */
  const onLight = piled;

  const services = mainNav.find((item) => item.children !== undefined);

  const openServices = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500",
        piled ? "top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4" : "top-0 left-0 right-0",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto transition-all duration-500",
          piled
            ? "max-w-[1200px] rounded-2xl border border-black/10 bg-background/80 shadow-lg backdrop-blur-xl"
            : "max-w-[1400px] border border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-5 transition-all duration-500 lg:px-8",
            piled ? "h-14" : "h-20",
          )}
        >
          {/* --- logo --------------------------------------------------- */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-label={`${site.name} home`}
          >
            <Image
              src="/images/brand/swoosh.png"
              alt=""
              width={512}
              height={512}
              priority
              className={cn(
                "w-auto transition-all duration-500 drop-shadow-[0_0_10px_rgba(57,255,20,0.35)]",
                piled ? "h-7" : "h-9",
              )}
            />
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  "font-semibold tracking-tight transition-all duration-500",
                  piled ? "text-lg text-foreground" : "text-xl text-white",
                )}
              >
                SOLDEN
              </span>
              <span
                className={cn(
                  "font-medium transition-all duration-500",
                  piled
                    ? "text-[10px] text-brand-600"
                    : "text-[11px] text-brand-neon",
                )}
              >
                Paint &amp; Panel
              </span>
            </span>
          </Link>

          {/* --- desktop links ------------------------------------------ */}
          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            {mainNav.map((item) =>
              item.children === undefined ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative text-sm transition-colors duration-300",
                    onLight
                      ? "text-foreground/70 hover:text-foreground"
                      : "text-white/75 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full",
                      onLight ? "bg-brand-600" : "bg-brand-neon",
                    )}
                  />
                </Link>
              ) : (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={scheduleCloseServices}
                >
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    onClick={() => setServicesOpen((open) => !open)}
                    className={cn(
                      "group relative flex items-center gap-1 text-sm transition-colors duration-300",
                      onLight
                        ? "text-foreground/70 hover:text-foreground"
                        : "text-white/75 hover:text-white",
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        servicesOpen && "rotate-180",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-[calc(100%-1rem)]",
                        onLight ? "bg-brand-600" : "bg-brand-neon",
                      )}
                    />
                  </button>

                  {/* flyout */}
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 w-[620px] -translate-x-1/2 pt-4 transition-all duration-200",
                      servicesOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <div className="overflow-hidden rounded-2xl border border-black/10 bg-background/95 p-2 shadow-xl backdrop-blur-xl">
                      <div className="grid grid-cols-2 gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="group rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50"
                          >
                            <span className="block text-sm font-medium text-foreground group-hover:text-brand-700">
                              {child.label}
                            </span>
                            <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                              {child.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/services"
                        className="mt-1 flex items-center justify-between rounded-xl bg-ink-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-ink-800"
                      >
                        View every service
                        <span className="text-brand-neon">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* --- desktop actions ---------------------------------------- */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={site.phone.primaryHref}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                onLight
                  ? "text-foreground/80 hover:text-foreground"
                  : "text-white/80 hover:text-white",
              )}
            >
              <Phone className="size-4" />
              {site.phone.primary}
            </a>
            <Link
              href="/quote"
              className={cn(
                "inline-flex items-center rounded-full font-semibold transition-all duration-500",
                piled
                  ? "h-9 bg-brand-600 px-4 text-xs text-white hover:bg-brand-700"
                  : "h-10 bg-brand-500 px-5 text-sm text-ink-950 hover:bg-brand-400",
              )}
            >
              Get a free quote
            </Link>
          </div>

          {/* --- mobile toggle ------------------------------------------ */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={site.phone.primaryHref}
              aria-label={`Call ${site.phone.primary}`}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full transition-colors",
                onLight
                  ? "bg-brand-600 text-white"
                  : "bg-white/10 text-white backdrop-blur",
              )}
            >
              <Phone className="size-4" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className={cn(
                "p-2 transition-colors duration-500",
                onLight ? "text-foreground" : "text-white",
              )}
            >
              {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- mobile overlay -------------------------------------------- */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-7 pb-8 pt-28">
          <div className="flex flex-1 flex-col justify-center gap-5">
            {mainNav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-4xl font-semibold tracking-tight text-foreground transition-all duration-500 hover:text-brand-600 sm:text-5xl",
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: menuOpen ? `${index * 60 + 80}ms` : "0ms" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href="/quote"
              className="flex h-14 items-center justify-center rounded-full bg-brand-600 text-base font-semibold text-white"
            >
              Get a free quote
            </Link>
            <a
              href={site.phone.primaryHref}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 text-base font-semibold text-foreground"
            >
              <Phone className="size-4" />
              {site.phone.primary}
            </a>
            <p className="pt-2 text-center text-sm text-muted-foreground">
              {site.address.full}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
