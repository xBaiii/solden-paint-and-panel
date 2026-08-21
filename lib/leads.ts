/**
 * Client helpers for the public lead endpoints.
 *
 * These post to Convex HTTP actions on the deployment's `.site` domain rather
 * than calling a Convex mutation directly, because the HTTP layer is where the
 * IP rate limit, honeypot and Turnstile checks live. See convex/http.ts.
 */

const SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

export type Attribution = {
  page?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
};

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  suburb?: string;
  postcode?: string;
  preferredContact: "phone" | "email" | "sms";
  bestTime?: string;

  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColour?: string;
  rego?: string;
  driveable?: boolean;

  serviceSlug?: string;
  damageTypes: string[];
  description?: string;
  photoIds: string[];

  isClaim: boolean;
  insurer?: string;
  claimNumber?: string;

  source?: Attribution;
  /** Honeypot — must stay empty. Real users never see the field. */
  company?: string;
  /** Time from form mount to submit; a sub-3s submission is treated as a bot. */
  elapsedMs?: number;
  turnstileToken?: string;
};

function endpoint(path: string): string {
  if (SITE_URL === undefined || SITE_URL.length === 0) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_SITE_URL is not set — run `npx convex dev` to populate .env.local.",
    );
  }
  return `${SITE_URL}${path}`;
}

/** Captures UTM parameters, referrer and landing page. Call on mount. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key) ?? undefined;
  return {
    page: window.location.pathname,
    referrer: document.referrer.length > 0 ? document.referrer : undefined,
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    gclid: get("gclid"),
  };
}

export type UploadResult = { storageId: string };

/** Uploads one photo and returns its storage id. */
export async function uploadPhoto(file: File): Promise<UploadResult> {
  const response = await fetch(endpoint("/leads/upload"), {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  const body = (await response.json().catch(() => ({}))) as {
    storageId?: string;
    error?: string;
  };

  if (!response.ok || body.storageId === undefined) {
    throw new Error(body.error ?? "That photo could not be uploaded.");
  }
  return { storageId: body.storageId };
}

/** Submits the lead. Resolves with the new lead id on success. */
export async function submitLead(payload: LeadPayload): Promise<{ leadId?: string }> {
  const response = await fetch(endpoint("/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    leadId?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      body.error ??
        "We couldn't send that through. Please call us on (07) 3205 2988.",
    );
  }
  return { leadId: body.leadId };
}
