"use client";

import { useFormContext } from "react-hook-form";
import { Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ChipGroup, FieldShell, SegmentedControl, TextField } from "@/components/quote/fields";
import { PhotoUpload } from "@/components/quote/photo-upload";
import {
  CONTACT_OPTIONS,
  DAMAGE_OPTIONS,
  TIME_OPTIONS,
  type QuoteValues,
} from "@/lib/quote-schema";

/**
 * The five wizard steps. Each one reads and writes the shared react-hook-form
 * context, so steps can be reordered or added by editing QUOTE_STEPS without
 * touching the container.
 */

const YES_NO = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export function StepDamage() {
  const { watch, setValue, register, formState } = useFormContext<QuoteValues>();
  const damageTypes = watch("damageTypes");

  return (
    <div className="space-y-7">
      <FieldShell
        label="What sort of work do you need?"
        error={formState.errors.damageTypes?.message}
      >
        <ChipGroup
          options={DAMAGE_OPTIONS}
          value={damageTypes}
          onChange={(next) =>
            setValue("damageTypes", next, { shouldValidate: true })
          }
        />
      </FieldShell>

      <FieldShell
        label="Tell us what happened"
        htmlFor="description"
        optional
        hint="What was damaged, how it happened, and anything else we should know."
        error={formState.errors.description?.message}
      >
        <Textarea
          id="description"
          rows={5}
          placeholder="Reversed into a pole in a car park — the rear bumper and left tail light took the damage. Still drivable."
          className="rounded-xl"
          {...register("description")}
        />
      </FieldShell>
    </div>
  );
}

export function StepVehicle() {
  const { register, watch, setValue, formState } = useFormContext<QuoteValues>();
  const driveable = watch("driveable");

  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="vehicleMake"
          label="Make"
          placeholder="Toyota"
          autoComplete="off"
          error={formState.errors.vehicleMake?.message}
          {...register("vehicleMake")}
        />
        <TextField
          id="vehicleModel"
          label="Model"
          placeholder="Hilux"
          autoComplete="off"
          error={formState.errors.vehicleModel?.message}
          {...register("vehicleModel")}
        />
        <TextField
          id="vehicleYear"
          label="Year"
          placeholder="2019"
          inputMode="numeric"
          optional
          error={formState.errors.vehicleYear?.message}
          {...register("vehicleYear")}
        />
        <TextField
          id="vehicleColour"
          label="Colour"
          placeholder="Silver"
          optional
          error={formState.errors.vehicleColour?.message}
          {...register("vehicleColour")}
        />
        <TextField
          id="rego"
          label="Registration"
          placeholder="ABC123"
          optional
          hint="Helps us look up the exact paint code."
          error={formState.errors.rego?.message}
          {...register("rego")}
          className="sm:col-span-2"
        />
      </div>

      <FieldShell
        label="Is the vehicle drivable?"
        error={formState.errors.driveable?.message}
      >
        <SegmentedControl
          name="Is the vehicle drivable?"
          options={YES_NO}
          value={driveable}
          onChange={(next) =>
            setValue("driveable", next as QuoteValues["driveable"], {
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      {driveable === "no" && (
        <div className="flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-700" />
          <p className="text-sm leading-relaxed text-brand-800">
            Don&rsquo;t drive it. We arrange off-site quotations for non-drivable
            vehicles by appointment — mention it below and we&rsquo;ll organise a
            time to come to you.
          </p>
        </div>
      )}
    </div>
  );
}

export function StepPhotos() {
  const { watch, setValue } = useFormContext<QuoteValues>();
  const photoIds = watch("photoIds");

  return (
    <PhotoUpload
      storageIds={photoIds}
      onChange={(next) => setValue("photoIds", next, { shouldValidate: true })}
    />
  );
}

export function StepInsurance() {
  const { register, watch, setValue, formState } = useFormContext<QuoteValues>();
  const isClaim = watch("isClaim");

  return (
    <div className="space-y-7">
      <FieldShell
        label="Are you making an insurance claim?"
        error={formState.errors.isClaim?.message}
      >
        <SegmentedControl
          name="Are you making an insurance claim?"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No, paying myself" },
            { value: "unsure", label: "Not sure yet" },
          ]}
          value={isClaim}
          onChange={(next) =>
            setValue("isClaim", next as QuoteValues["isClaim"], {
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      {isClaim === "yes" && (
        <div className="space-y-5">
          <div className="flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-700" />
            <p className="text-sm leading-relaxed text-brand-800">
              We&rsquo;re an approved repairer for all major insurers with choice of
              repairer policies. We&rsquo;ll liaise with your insurer and arrange
              the paperwork for you.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="insurer"
              label="Who are you insured with?"
              placeholder="RACQ, Suncorp, AAMI…"
              optional
              error={formState.errors.insurer?.message}
              {...register("insurer")}
            />
            <TextField
              id="claimNumber"
              label="Claim number"
              placeholder="If you already have one"
              optional
              error={formState.errors.claimNumber?.message}
              {...register("claimNumber")}
            />
          </div>
        </div>
      )}

      {isClaim === "unsure" && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          No problem — we&rsquo;ll quote it either way and talk you through whether
          claiming is worth it once you know the cost.
        </p>
      )}
    </div>
  );
}

export function StepContact() {
  const { register, watch, setValue, formState } = useFormContext<QuoteValues>();
  const preferredContact = watch("preferredContact");
  const bestTime = watch("bestTime");

  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="name"
          label="Your name"
          placeholder="Jane Smith"
          autoComplete="name"
          error={formState.errors.name?.message}
          {...register("name")}
        />
        <TextField
          id="phone"
          label="Phone"
          placeholder="0400 000 000"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={formState.errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          id="email"
          label="Email"
          placeholder="jane@example.com"
          type="email"
          autoComplete="email"
          optional={preferredContact !== "email"}
          hint="We'll send a copy of your enquiry."
          error={formState.errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="suburb"
          label="Suburb"
          placeholder="Brendale"
          autoComplete="address-level2"
          optional
          error={formState.errors.suburb?.message}
          {...register("suburb")}
        />
        <TextField
          id="postcode"
          label="Postcode"
          placeholder="4500"
          inputMode="numeric"
          autoComplete="postal-code"
          optional
          error={formState.errors.postcode?.message}
          {...register("postcode")}
        />
      </div>

      <FieldShell
        label="How would you like us to get back to you?"
        error={formState.errors.preferredContact?.message}
      >
        <SegmentedControl
          name="Preferred contact method"
          options={CONTACT_OPTIONS}
          value={preferredContact}
          onChange={(next) =>
            setValue("preferredContact", next as QuoteValues["preferredContact"], {
              shouldValidate: true,
            })
          }
        />
      </FieldShell>

      <FieldShell label="Best time to reach you" optional>
        <SegmentedControl
          name="Best time"
          options={TIME_OPTIONS.map((time) => ({ value: time, label: time }))}
          value={bestTime ?? "Any time"}
          onChange={(next) => setValue("bestTime", next)}
        />
      </FieldShell>
    </div>
  );
}

export const STEP_COMPONENTS: Record<string, () => React.JSX.Element> = {
  damage: StepDamage,
  vehicle: StepVehicle,
  photos: StepPhotos,
  insurance: StepInsurance,
  contact: StepContact,
};
