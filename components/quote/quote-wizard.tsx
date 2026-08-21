"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import {
  QUOTE_STEPS,
  quoteDefaults,
  quoteSchema,
  type QuoteValues,
} from "@/lib/quote-schema";
import { STEP_COMPONENTS } from "@/components/quote/steps";
import { captureAttribution, submitLead, type Attribution } from "@/lib/leads";

const DRAFT_KEY = "solden-quote-draft";

export function QuoteWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service") ?? undefined;

  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const attribution = useRef<Attribution>({});
  // Stamped on mount, not during render — Date.now() in render is impure.
  const startedAt = useRef<number>(0);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaults,
    mode: "onTouched",
  });

  // Capture where this visitor came from, once, on mount.
  useEffect(() => {
    attribution.current = captureAttribution();
    startedAt.current = Date.now();
  }, []);

  // Restore a draft so an accidental refresh doesn't lose four steps of typing.
  // Photo ids are dropped deliberately: the previews are gone, so showing them
  // as attached would be misleading.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved === null) return;
      const parsed = JSON.parse(saved) as Partial<QuoteValues>;
      form.reset({ ...quoteDefaults, ...parsed, photoIds: [] });
    } catch {
      // A malformed draft is not worth surfacing — just start fresh.
      sessionStorage.removeItem(DRAFT_KEY);
    }
  }, [form]);

  useEffect(() => {
    const unsubscribe = form.watch((values) => {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        // Private browsing / quota — the draft is a convenience, not a feature.
      }
    });
    return () => unsubscribe.unsubscribe();
  }, [form]);

  const step = QUOTE_STEPS[stepIndex];
  const StepBody = useMemo(() => STEP_COMPONENTS[step.id], [step.id]);
  const isLast = stepIndex === QUOTE_STEPS.length - 1;
  const progress = ((stepIndex + 1) / QUOTE_STEPS.length) * 100;

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = async () => {
    const valid = await form.trigger(step.fields);
    if (!valid) return;
    if (isLast) {
      await onSubmit();
      return;
    }
    setStepIndex((index) => index + 1);
    scrollToTop();
  };

  const back = () => {
    if (stepIndex === 0) return;
    setStepIndex((index) => index - 1);
    scrollToTop();
  };

  const onSubmit = async () => {
    // Validate everything, not just the last step, before sending.
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Some details need another look.");
      // Jump back to the first step that has an error.
      const errored = QUOTE_STEPS.findIndex((candidate) =>
        candidate.fields.some((field) => field in form.formState.errors),
      );
      if (errored >= 0) {
        setStepIndex(errored);
        scrollToTop();
      }
      return;
    }

    setSubmitting(true);
    const values = form.getValues();

    try {
      await submitLead({
        name: values.name,
        phone: values.phone,
        email: values.email === "" ? undefined : values.email,
        suburb: values.suburb === "" ? undefined : values.suburb,
        postcode: values.postcode === "" ? undefined : values.postcode,
        preferredContact: values.preferredContact,
        bestTime: values.bestTime,

        vehicleMake: values.vehicleMake,
        vehicleModel: values.vehicleModel,
        vehicleYear: values.vehicleYear === "" ? undefined : values.vehicleYear,
        vehicleColour: values.vehicleColour === "" ? undefined : values.vehicleColour,
        rego: values.rego === "" ? undefined : values.rego,
        driveable: values.driveable === "yes",

        serviceSlug,
        damageTypes: values.damageTypes,
        description: values.description === "" ? undefined : values.description,
        photoIds: values.photoIds,

        // "Not sure yet" is recorded as a claim so the shop follows it up as one.
        isClaim: values.isClaim !== "no",
        insurer: values.insurer === "" ? undefined : values.insurer,
        claimNumber: values.claimNumber === "" ? undefined : values.claimNumber,

        source: attribution.current,
        company: "", // honeypot
        elapsedMs: Date.now() - startedAt.current,
      });

      sessionStorage.removeItem(DRAFT_KEY);
      router.push("/quote/thanks");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please call us instead.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      {/* ---------- progress ---------- */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Step {stepIndex + 1} of {QUOTE_STEPS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/8">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* step rail — clickable back to any completed step */}
        <ol className="mt-5 hidden gap-1 sm:flex">
          {QUOTE_STEPS.map((candidate, index) => {
            const done = index < stepIndex;
            const current = index === stepIndex;
            return (
              <li key={candidate.id} className="flex-1">
                <button
                  type="button"
                  disabled={index > stepIndex}
                  onClick={() => {
                    setStepIndex(index);
                    scrollToTop();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                    current && "font-semibold text-brand-700",
                    done && "text-muted-foreground hover:bg-surface-2",
                    index > stepIndex && "cursor-default text-muted-foreground/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                      current && "border-brand-600 bg-brand-600 text-white",
                      done && "border-brand-600 bg-brand-50 text-brand-700",
                      index > stepIndex && "border-black/15",
                    )}
                  >
                    {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                  </span>
                  <span className="truncate">{candidate.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- card ---------- */}
      <FormProvider {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void next();
          }}
          noValidate
        >
          <div className="rounded-2xl border border-black/8 bg-card p-6 sm:p-9">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {step.title}
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">{step.blurb}</p>

            <div className="mt-8">
              <StepBody />
            </div>

            {/* honeypot — hidden from users, catnip for bots */}
            <div aria-hidden className="absolute left-[-9999px] opacity-0">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>
          </div>

          {/* ---------- nav ---------- */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-600 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : isLast ? (
                <>
                  Send my enquiry
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {stepIndex > 0 && (
              <button
                type="button"
                onClick={back}
                disabled={submitting}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 px-7 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            )}
          </div>
        </form>
      </FormProvider>

      <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        Would rather talk to someone?
        <a
          href={site.phone.primaryHref}
          className="inline-flex items-center gap-1.5 font-semibold text-brand-700"
        >
          <Phone className="size-3.5" />
          {site.phone.primary}
        </a>
      </p>
    </div>
  );
}
