import { v } from "convex/values";

/**
 * The lead pipeline. Declared once and reused by the schema union, the dashboard
 * status tabs and the status control, so adding a stage is a one-line change.
 */
export const LEAD_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "booked",
  "completed",
  "lost",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leadStatusValidator = v.union(
  ...LEAD_STATUSES.map((s) => v.literal(s)),
);

/** Stages that represent live work, used for the "in pipeline" metric. */
export const OPEN_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "quoted",
  "booked",
];

export const LEAD_PRIORITIES = ["low", "normal", "high"] as const;
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];
export const leadPriorityValidator = v.union(
  ...LEAD_PRIORITIES.map((p) => v.literal(p)),
);

export const USER_ROLES = ["owner", "admin", "staff"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const userRoleValidator = v.union(
  ...USER_ROLES.map((r) => v.literal(r)),
);

/** Roles allowed to manage the team and settings. */
export const ADMIN_ROLES: UserRole[] = ["owner", "admin"];

export const LEAD_EVENT_TYPES = [
  "created",
  "status_changed",
  "assigned",
  "note",
  "email_sent",
  "field_changed",
] as const;
export type LeadEventType = (typeof LEAD_EVENT_TYPES)[number];
export const leadEventTypeValidator = v.union(
  ...LEAD_EVENT_TYPES.map((t) => v.literal(t)),
);

export const CONTACT_METHODS = ["phone", "email", "sms"] as const;
export const contactMethodValidator = v.union(
  ...CONTACT_METHODS.map((m) => v.literal(m)),
);

/**
 * Damage/enquiry types offered in step 1 of the quote wizard. Kept in the
 * backend so the validator and the UI cannot drift apart.
 */
export const DAMAGE_TYPES = [
  "collision",
  "dent",
  "scratch",
  "hail",
  "rust",
  "respray",
  "custom",
  "glass",
  "detailing",
  "other",
] as const;
export const damageTypeValidator = v.union(
  ...DAMAGE_TYPES.map((d) => v.literal(d)),
);

/** Anonymous submission limits, enforced in the HTTP action. */
export const RATE_LIMIT = {
  /** Lead submissions permitted per IP per window. */
  submissions: 5,
  /** Photo uploads permitted per IP per window. */
  uploads: 30,
  windowMs: 60 * 60 * 1000,
} as const;

export const UPLOAD_LIMITS = {
  maxBytes: 10 * 1024 * 1024,
  contentTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ] as string[],
  maxPerLead: 10,
} as const;
