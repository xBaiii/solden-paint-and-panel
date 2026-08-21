"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { FieldShell, SegmentedControl, TextField } from "@/components/quote/fields";
import { captureAttribution, submitLead, type Attribution } from "@/lib/leads";
import { CONTACT_OPTIONS } from "@/lib/quote-schema";

/**
 * Short enquiry form for the contact page. Deliberately minimal — anyone who
 * needs a real quote is pointed at the wizard, which collects photos and
 * vehicle details. Both land in the same leads table.
 */
export function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [preferredContact, setPreferredContact] = useState("phone");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const attribution = useRef<Attribution>({});
  // Stamped on mount, not during render — Date.now() in render is impure.
  const startedAt = useRef(0);

  useEffect(() => {
    attribution.current = captureAttribution();
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = "Please enter your name.";
    if (phone.length < 8) nextErrors.phone = "Please enter a contact number.";
    if (preferredContact === "email" && email.length === 0) {
      nextErrors.email = "We need an email address to email you back.";
    }
    if (email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      nextErrors.email = "That email address doesn't look right.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email: email.length === 0 ? undefined : email,
        suburb: String(data.get("suburb") ?? "").trim() || undefined,
        preferredContact: preferredContact as "phone" | "sms" | "email",
        damageTypes: ["other"],
        description: message.length === 0 ? undefined : message,
        photoIds: [],
        isClaim: false,
        source: { ...attribution.current, page: "/contact" },
        company: String(data.get("company") ?? ""),
        elapsedMs: Date.now() - startedAt.current,
      });
      router.push("/quote/thanks");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please call us instead.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          name="name"
          label="Your name"
          placeholder="Jane Smith"
          autoComplete="name"
          error={errors.name}
        />
        <TextField
          id="contact-phone"
          name="phone"
          label="Phone"
          type="tel"
          inputMode="tel"
          placeholder="0400 000 000"
          autoComplete="tel"
          error={errors.phone}
        />
        <TextField
          id="contact-email"
          name="email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          optional={preferredContact !== "email"}
          error={errors.email}
        />
        <TextField
          id="contact-suburb"
          name="suburb"
          label="Suburb"
          placeholder="Brendale"
          autoComplete="address-level2"
          optional
        />
      </div>

      <FieldShell label="How should we get back to you?">
        <SegmentedControl
          name="Preferred contact method"
          options={CONTACT_OPTIONS}
          value={preferredContact}
          onChange={setPreferredContact}
        />
      </FieldShell>

      <FieldShell
        label="How can we help?"
        htmlFor="contact-message"
        hint="For a repair quote, our quote form lets you attach photos — you'll get a far more accurate answer."
      >
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Tell us what you need…"
          className="rounded-xl"
        />
      </FieldShell>

      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px] opacity-0">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send enquiry
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
