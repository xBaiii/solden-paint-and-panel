import type { LeadStatus } from "@/convex/lib/constants";

/**
 * Presentation layer for leads: labels, colours and formatting.
 *
 * Statuses themselves are declared in convex/lib/constants.ts. This file only
 * decides how they look, so adding a stage means adding one entry here.
 */

export const STATUS_META: Record<
  LeadStatus,
  { label: string; badge: string; dot: string; description: string }
> = {
  new: {
    label: "New",
    badge: "bg-brand-50 text-brand-800 border-brand-200",
    dot: "bg-brand-500",
    description: "Nobody has touched this yet",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
    description: "We've reached out",
  },
  quoted: {
    label: "Quoted",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    description: "Quote sent, awaiting a decision",
  },
  booked: {
    label: "Booked in",
    badge: "bg-violet-50 text-violet-800 border-violet-200",
    dot: "bg-violet-500",
    description: "Scheduled for repair",
  },
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-600",
    description: "Job finished and collected",
  },
  lost: {
    label: "Lost",
    badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
    dot: "bg-neutral-400",
    description: "Went elsewhere or didn't proceed",
  },
  spam: {
    label: "Spam",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
    description: "Not a real enquiry",
  },
};

/** Order the status tabs appear in. */
export const STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "booked",
  "completed",
  "lost",
  "spam",
];

export const PRIORITY_META: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-50 text-red-700 border-red-200" },
  normal: { label: "Normal", className: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  low: { label: "Low", className: "bg-neutral-50 text-neutral-500 border-neutral-200" },
};

export const DAMAGE_LABELS: Record<string, string> = {
  collision: "Collision",
  dent: "Dents",
  scratch: "Scratches",
  hail: "Hail",
  rust: "Rust",
  respray: "Respray",
  custom: "Custom paint",
  glass: "Glass",
  detailing: "Detailing",
  other: "Other",
};

export const EVENT_LABELS: Record<string, string> = {
  created: "Enquiry received",
  status_changed: "Status changed",
  assigned: "Assigned",
  note: "Note",
  email_sent: "Email sent",
  field_changed: "Updated",
};

/** "3 minutes ago", "2 days ago" — short, for dense table cells. */
export function relativeTime(timestamp: number): string {
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(timestamp).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Vehicle description from the parts that were actually supplied. */
export function vehicleLabel(lead: {
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleColour?: string;
}): string {
  const parts = [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel].filter(
    (part): part is string => typeof part === "string" && part.length > 0,
  );
  return parts.length > 0 ? parts.join(" ") : "—";
}

/** Human label for where a lead came from. */
export function sourceLabel(source?: {
  utmSource?: string;
  referrer?: string;
  page?: string;
}): string {
  if (source === undefined) return "Direct";
  if (source.utmSource !== undefined && source.utmSource.length > 0) {
    return source.utmSource;
  }
  if (source.referrer !== undefined && source.referrer.length > 0) {
    try {
      return new URL(source.referrer).hostname.replace(/^www\./, "");
    } catch {
      return "Referral";
    }
  }
  return "Direct";
}

/** Initials for the assignee avatar. */
export function initials(name: string | null): string {
  if (name === null || name.trim().length === 0) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
