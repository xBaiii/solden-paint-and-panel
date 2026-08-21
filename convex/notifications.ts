import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";
import { logEvent } from "./model/leads";

/**
 * Lead notifications via Resend.
 *
 * Called through the scheduler from leads.create, so a mail failure can never
 * fail the customer's submission. Every integration here is env-gated: with no
 * RESEND_API_KEY the action logs what it would have sent and returns, which
 * keeps the whole funnel working before a sending domain is verified.
 *
 * The Resend REST API is called with plain fetch rather than the SDK so this
 * runs in Convex's default runtime with no "use node" directive.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | undefined | null): string {
  if (value === undefined || value === null || value.length === 0) return "";
  return `<tr>
    <td style="padding:6px 16px 6px 0;color:#5b6560;font:14px/1.5 -apple-system,Segoe UI,sans-serif;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0e1211;font:600 14px/1.5 -apple-system,Segoe UI,sans-serif">${escapeHtml(value)}</td>
  </tr>`;
}

function vehicleLine(lead: Doc<"leads">): string {
  return [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel, lead.vehicleColour]
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(" ");
}

function shopEmailHtml(
  lead: Doc<"leads">,
  photoUrls: string[],
  dashboardUrl: string,
): string {
  const photos =
    photoUrls.length === 0
      ? ""
      : `<p style="margin:24px 0 8px;color:#5b6560;font:14px/1.5 -apple-system,Segoe UI,sans-serif">
           ${photoUrls.length} photo${photoUrls.length === 1 ? "" : "s"} attached:
         </p>
         <p style="margin:0">${photoUrls
           .map(
             (url, i) =>
               `<a href="${url}" style="color:#0e8c34;font:14px/1.5 -apple-system,Segoe UI,sans-serif;margin-right:12px">Photo ${i + 1}</a>`,
           )
           .join("")}</p>`;

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f7f5">
  <table role="presentation" style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #e5eae7;border-collapse:separate">
    <tr><td style="padding:28px 28px 0">
      <p style="margin:0 0 4px;color:#0e8c34;font:700 12px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.08em;text-transform:uppercase">
        ${lead.isClaim ? "New insurance enquiry" : "New website enquiry"}
      </p>
      <h1 style="margin:0 0 20px;color:#0e1211;font:700 24px/1.2 -apple-system,Segoe UI,sans-serif;letter-spacing:-.02em">
        ${escapeHtml(lead.name)}
      </h1>
      <table role="presentation" style="width:100%;border-collapse:collapse">
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Suburb", [lead.suburb, lead.postcode].filter(Boolean).join(" "))}
        ${row("Prefers", lead.preferredContact)}
        ${row("Best time", lead.bestTime)}
        ${row("Vehicle", vehicleLine(lead))}
        ${row("Rego", lead.rego)}
        ${row("Drivable", lead.driveable === undefined ? undefined : lead.driveable ? "Yes" : "No")}
        ${row("Job type", lead.damageTypes.join(", "))}
        ${row("From page", lead.serviceSlug)}
        ${row("Insurance claim", lead.isClaim ? "Yes" : "No")}
        ${row("Insurer", lead.insurer)}
        ${row("Claim number", lead.claimNumber)}
      </table>
      ${
        lead.description === undefined || lead.description.length === 0
          ? ""
          : `<p style="margin:20px 0 0;padding:14px 16px;background:#f4f7f5;border-radius:10px;color:#0e1211;font:14px/1.6 -apple-system,Segoe UI,sans-serif;white-space:pre-wrap">${escapeHtml(lead.description)}</p>`
      }
      ${photos}
      <p style="margin:28px 0 28px">
        <a href="${dashboardUrl}" style="display:inline-block;padding:12px 22px;background:#0e8c34;color:#fff;border-radius:999px;font:600 14px/1 -apple-system,Segoe UI,sans-serif;text-decoration:none">
          Open this lead
        </a>
      </p>
    </td></tr>
  </table>
</body></html>`;
}

function customerEmailHtml(lead: Doc<"leads">): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f7f5">
  <table role="presentation" style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #e5eae7">
    <tr><td style="padding:32px">
      <h1 style="margin:0 0 16px;color:#0e1211;font:700 22px/1.3 -apple-system,Segoe UI,sans-serif;letter-spacing:-.02em">
        Thanks ${escapeHtml(lead.name.split(" ")[0] ?? lead.name)}, we've got your details.
      </h1>
      <p style="margin:0 0 14px;color:#41504a;font:15px/1.65 -apple-system,Segoe UI,sans-serif">
        Your enquiry has landed with our team at Solden Paint &amp; Panel. We'll review
        what you've sent through and be in touch to talk you through your options and
        book a time that suits.
      </p>
      <p style="margin:0 0 14px;color:#41504a;font:15px/1.65 -apple-system,Segoe UI,sans-serif">
        If it's urgent, or your vehicle isn't drivable, give us a call on
        <a href="tel:+61732052988" style="color:#0e8c34;font-weight:600;text-decoration:none">(07) 3205 2988</a>
        and we'll sort it out over the phone.
      </p>
      <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5eae7;color:#5b6560;font:13px/1.6 -apple-system,Segoe UI,sans-serif">
        Solden Paint &amp; Panel<br />
        6 Aldinga Street, Brendale QLD 4500<br />
        Monday to Friday, 8:00am – 4:00pm
      </p>
    </td></tr>
  </table>
</body></html>`;
}

async function send(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; detail: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey === undefined || apiKey.length === 0) {
    console.log(
      `[notifications] RESEND_API_KEY not set — skipping email "${payload.subject}" to ${payload.to.join(", ")}`,
    );
    return { ok: false, detail: "RESEND_API_KEY not configured" };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      ...(payload.replyTo === undefined ? {} : { reply_to: payload.replyTo }),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[notifications] Resend rejected the send: ${detail}`);
    return { ok: false, detail };
  }
  return { ok: true, detail: "sent" };
}

export const sendLeadEmails = internalAction({
  args: { leadId: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.runQuery(internal.leads.getInternal, { leadId });
    if (lead === null) return null;

    const from = process.env.LEAD_FROM_EMAIL ?? "Solden Website <onboarding@resend.dev>";
    const recipients = (process.env.LEAD_NOTIFY_EMAILS ?? "")
      .split(",")
      .map((address) => address.trim())
      .filter((address) => address.length > 0);

    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
    const dashboardUrl = `${siteUrl}/dashboard/leads/${leadId}`;

    const urls: string[] = [];
    for (const storageId of lead.photoIds) {
      const url = await ctx.storage.getUrl(storageId);
      if (url !== null) urls.push(url);
    }

    // --- notify the shop --------------------------------------------------
    if (recipients.length === 0) {
      console.log(
        "[notifications] LEAD_NOTIFY_EMAILS not set — no shop notification sent.",
      );
    } else {
      const subject = `${lead.isClaim ? "Insurance enquiry" : "New enquiry"}: ${lead.name}${
        vehicleLine(lead).length > 0 ? ` — ${vehicleLine(lead)}` : ""
      }`;
      const result = await send({
        from,
        to: recipients,
        subject,
        html: shopEmailHtml(lead, urls, dashboardUrl),
        replyTo: lead.email,
      });
      if (result.ok) {
        await ctx.runMutation(internal.notifications.recordEmailSent, {
          leadId,
          body: `Notification emailed to ${recipients.join(", ")}.`,
        });
      }
    }

    // --- auto-reply to the customer ---------------------------------------
    if (lead.email !== undefined && lead.email.length > 0) {
      const result = await send({
        from,
        to: [lead.email],
        subject: "We've received your enquiry — Solden Paint & Panel",
        html: customerEmailHtml(lead),
      });
      if (result.ok) {
        await ctx.runMutation(internal.notifications.recordEmailSent, {
          leadId,
          body: `Confirmation emailed to ${lead.email}.`,
        });
      }
    }

    return null;
  },
});

/** Writes the audit trail entry for a successfully sent email. */
export const recordEmailSent = internalMutation({
  args: { leadId: v.id("leads"), body: v.string() },
  returns: v.null(),
  handler: async (ctx, { leadId, body }) => {
    await logEvent(ctx, { leadId, type: "email_sent", body });
    return null;
  },
});
