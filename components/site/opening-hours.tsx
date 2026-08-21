"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Opening hours with today's row highlighted, and an open/closed pill.
 *
 * Day-by-day rather than the grouped "Monday – Friday" list, because a customer
 * scanning for "is it open now" shouldn't have to work out which group today
 * falls into.
 *
 * Everything is computed in Australia/Brisbane, not the visitor's timezone — the
 * shop is open when the shop is open, regardless of where you're browsing from.
 * The initial render shows no highlight so the static HTML matches hydration.
 */

const DAYS = [
  { label: "Monday", hours: "8:00am – 4:00pm", open: [8, 16] as const },
  { label: "Tuesday", hours: "8:00am – 4:00pm", open: [8, 16] as const },
  { label: "Wednesday", hours: "8:00am – 4:00pm", open: [8, 16] as const },
  { label: "Thursday", hours: "8:00am – 4:00pm", open: [8, 16] as const },
  { label: "Friday", hours: "8:00am – 4:00pm", open: [8, 16] as const },
  { label: "Saturday", hours: "By appointment", open: null },
  { label: "Sunday", hours: "Closed", open: null },
];

/** Brisbane has no daylight saving, so a fixed UTC+10 offset is safe. */
function brisbaneNow(): { dayIndex: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return {
    dayIndex: DAYS.findIndex((day) => day.label === weekday),
    hour,
    minute,
  };
}

export function OpeningHours() {
  const [now, setNow] = useState<ReturnType<typeof brisbaneNow> | null>(null);

  useEffect(() => {
    setNow(brisbaneNow());
    // Re-check on the hour so a page left open doesn't go stale.
    const timer = setInterval(() => setNow(brisbaneNow()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const today = now === null ? -1 : now.dayIndex;
  const todayHours = today >= 0 ? DAYS[today].open : null;
  const isOpen =
    now !== null &&
    todayHours !== null &&
    now.hour + now.minute / 60 >= todayHours[0] &&
    now.hour + now.minute / 60 < todayHours[1];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          Opening hours
        </h3>
        {now !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              isOpen
                ? "bg-brand-50 text-brand-800"
                : "bg-neutral-100 text-neutral-600",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isOpen ? "bg-brand-600" : "bg-neutral-400",
              )}
            />
            {isOpen ? "Open now" : "Closed now"}
          </span>
        )}
      </div>

      <dl className="mt-4 space-y-0.5">
        {DAYS.map((day, index) => {
          const current = index === today;
          return (
            <div
              key={day.label}
              className={cn(
                "flex items-baseline justify-between gap-4 rounded-md px-2.5 py-1.5 text-sm",
                current ? "bg-brand-50 font-semibold text-brand-900" : "text-foreground",
              )}
            >
              <dt className={current ? undefined : "text-muted-foreground"}>
                {day.label}
                {current && <span className="sr-only"> (today)</span>}
              </dt>
              <dd className="tabular-nums">{day.hours}</dd>
            </div>
          );
        })}
      </dl>

      <ul className="mt-4 space-y-1.5 border-t border-black/8 pt-4">
        {site.hoursNotes.map((note) => (
          <li key={note} className="text-xs leading-relaxed text-muted-foreground">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
