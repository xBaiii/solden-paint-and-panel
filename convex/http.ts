import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { auth } from "./auth";
import { DAMAGE_TYPES, UPLOAD_LIMITS } from "./lib/constants";

/**
 * Public endpoints for the marketing site.
 *
 * Lead submission and photo upload run as HTTP actions rather than public
 * mutations for one reason: a Convex mutation cannot see the request headers, so
 * it has no way to rate-limit an anonymous caller. HTTP actions can read the
 * forwarded IP, verify a Turnstile token, and only then call the *internal*
 * mutation — which is not callable from the public API at all.
 */

const http = httpRouter();
auth.addHttpRoutes(http);

/* --- helpers -------------------------------------------------------------- */

/** Allowed browser origins. Set SITE_URL on the deployment in production. */
function allowedOrigin(request: Request): string {
  const configured = process.env.SITE_URL;
  const origin = request.headers.get("Origin");
  if (configured !== undefined && origin === configured) return origin;
  // Local development.
  if (origin !== null && /^http:\/\/localhost:\d+$/.test(origin)) return origin;
  return configured ?? "*";
}

function corsHeaders(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": allowedOrigin(request),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(
  request: Request,
  body: unknown,
  status: number,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(request) },
  });
}

const preflight = httpAction(async (_ctx, request) => {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
});

/**
 * A stable, non-reversible key for the caller. Hashing means we rate-limit by
 * IP without ever storing one.
 */
async function callerKey(request: Request): Promise<string> {
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("cf-connecting-ip") ??
    "unknown";
  const data = new TextEncoder().encode(`solden:${forwarded}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Verifies a Cloudflare Turnstile token when a secret is configured. */
async function turnstileOk(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (secret === undefined || secret.length === 0) return true; // not configured
  if (typeof token !== "string" || token.length === 0) return false;

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

/* --- narrowing ------------------------------------------------------------ */

function str(value: unknown, max = 2000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed.slice(0, max);
}

function bool(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

const DAMAGE_SET = new Set<string>(DAMAGE_TYPES);

/**
 * Builds the submission from an untrusted body, field by field. Only known keys
 * survive — Convex rejects unexpected fields, and this also stops a caller
 * setting anything it shouldn't (status, priority, tags).
 */
function pickSubmission(raw: Record<string, unknown>) {
  const damageTypes = Array.isArray(raw.damageTypes)
    ? raw.damageTypes.filter(
        (d): d is (typeof DAMAGE_TYPES)[number] =>
          typeof d === "string" && DAMAGE_SET.has(d),
      )
    : [];

  const photoIds = Array.isArray(raw.photoIds)
    ? raw.photoIds
        .filter((p): p is string => typeof p === "string")
        .slice(0, UPLOAD_LIMITS.maxPerLead)
    : [];

  const preferred = str(raw.preferredContact);
  const preferredContact: "phone" | "email" | "sms" =
    preferred === "phone" || preferred === "email" || preferred === "sms"
      ? preferred
      : "phone";

  const rawSource =
    typeof raw.source === "object" && raw.source !== null
      ? (raw.source as Record<string, unknown>)
      : {};

  return {
    name: str(raw.name, 120) ?? "",
    phone: str(raw.phone, 40) ?? "",
    email: str(raw.email, 200),
    suburb: str(raw.suburb, 120),
    postcode: str(raw.postcode, 10),
    preferredContact,
    bestTime: str(raw.bestTime, 120),

    vehicleMake: str(raw.vehicleMake, 60),
    vehicleModel: str(raw.vehicleModel, 60),
    vehicleYear: str(raw.vehicleYear, 8),
    vehicleColour: str(raw.vehicleColour, 40),
    rego: str(raw.rego, 12),
    driveable: bool(raw.driveable),

    serviceSlug: str(raw.serviceSlug, 80),
    damageTypes,
    description: str(raw.description, 4000),
    photoIds: photoIds as Id<"_storage">[],

    isClaim: bool(raw.isClaim) ?? false,
    insurer: str(raw.insurer, 120),
    claimNumber: str(raw.claimNumber, 80),

    source: {
      page: str(rawSource.page, 300),
      referrer: str(rawSource.referrer, 300),
      utmSource: str(rawSource.utmSource, 120),
      utmMedium: str(rawSource.utmMedium, 120),
      utmCampaign: str(rawSource.utmCampaign, 200),
      utmTerm: str(rawSource.utmTerm, 200),
      utmContent: str(rawSource.utmContent, 200),
      gclid: str(rawSource.gclid, 200),
    },
  };
}

/* --- POST /leads ---------------------------------------------------------- */

http.route({ path: "/leads", method: "OPTIONS", handler: preflight });
http.route({
  path: "/leads",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return json(request, { error: "Invalid JSON body." }, 400);
    }
    if (typeof raw !== "object" || raw === null) {
      return json(request, { error: "Invalid body." }, 400);
    }
    const body = raw as Record<string, unknown>;

    // Honeypot: a hidden field only a bot fills in. Answer 200 so the bot
    // cannot tell it was caught.
    if (typeof body.company === "string" && body.company.trim().length > 0) {
      console.log("[leads] honeypot triggered — submission discarded.");
      return json(request, { ok: true }, 200);
    }

    // A human cannot complete a five-step wizard in under three seconds.
    const elapsedMs = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
    if (elapsedMs > 0 && elapsedMs < 3000) {
      console.log("[leads] submission too fast — discarded.");
      return json(request, { ok: true }, 200);
    }

    if (!(await turnstileOk(body.turnstileToken))) {
      return json(request, { error: "Verification failed. Please try again." }, 403);
    }

    const key = await callerKey(request);
    const allowed = await ctx.runMutation(internal.leads.checkRateLimit, {
      key,
      kind: "submit",
    });
    if (!allowed) {
      return json(
        request,
        {
          error:
            "Too many enquiries from this connection. Please call us on (07) 3205 2988.",
        },
        429,
      );
    }

    const submission = pickSubmission(body);
    if (submission.name.length === 0 || submission.phone.length === 0) {
      return json(request, { error: "A name and phone number are required." }, 400);
    }

    try {
      const leadId = await ctx.runMutation(internal.leads.create, { submission });
      return json(request, { ok: true, leadId }, 200);
    } catch (error) {
      console.error("[leads] failed to record submission", error);
      return json(request, { error: "We could not save your enquiry." }, 500);
    }
  }),
});

/* --- POST /leads/upload --------------------------------------------------- */

http.route({ path: "/leads/upload", method: "OPTIONS", handler: preflight });
http.route({
  path: "/leads/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const contentType = request.headers.get("Content-Type") ?? "";
    if (!UPLOAD_LIMITS.contentTypes.includes(contentType)) {
      return json(
        request,
        { error: "Please upload a JPEG, PNG, WebP or HEIC image." },
        415,
      );
    }

    const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
    if (declaredLength > UPLOAD_LIMITS.maxBytes) {
      return json(request, { error: "That image is larger than 10MB." }, 413);
    }

    const key = await callerKey(request);
    const allowed = await ctx.runMutation(internal.leads.checkRateLimit, {
      key,
      kind: "upload",
    });
    if (!allowed) {
      return json(request, { error: "Too many uploads. Please try again later." }, 429);
    }

    const blob = await request.blob();
    if (blob.size > UPLOAD_LIMITS.maxBytes) {
      return json(request, { error: "That image is larger than 10MB." }, 413);
    }
    if (blob.size === 0) {
      return json(request, { error: "That file appears to be empty." }, 400);
    }

    const storageId = await ctx.storage.store(blob);
    return json(request, { ok: true, storageId }, 200);
  }),
});

export default http;
