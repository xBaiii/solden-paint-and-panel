import { z } from "zod";

/**
 * Validation for the multi-step quote wizard.
 *
 * One schema covers the whole form; each step declares which fields it owns, so
 * the wizard validates only that slice before advancing. Reordering or inserting
 * a step means editing QUOTE_STEPS — nothing else.
 */

export const DAMAGE_OPTIONS = [
  { value: "collision", label: "Collision / accident", hint: "Something hit me" },
  { value: "dent", label: "Dents & dings", hint: "Car park damage" },
  { value: "scratch", label: "Scratches & scuffs", hint: "Paint damage" },
  { value: "hail", label: "Hail damage", hint: "Storm damage" },
  { value: "rust", label: "Rust", hint: "Bubbling or corrosion" },
  { value: "respray", label: "Respray / colour change", hint: "Whole panel or car" },
  { value: "custom", label: "Custom paint", hint: "Airbrushing, wraps, liners" },
  { value: "glass", label: "Glass or windscreen", hint: "Chipped or cracked" },
  { value: "detailing", label: "Detailing / cut & polish", hint: "Paint correction" },
  { value: "other", label: "Something else", hint: "Tell us below" },
] as const;

export const CONTACT_OPTIONS = [
  { value: "phone", label: "Phone call" },
  { value: "sms", label: "Text message" },
  { value: "email", label: "Email" },
] as const;

export const TIME_OPTIONS = [
  "Any time",
  "Morning (8am – 12pm)",
  "Afternoon (12pm – 4pm)",
  "After hours",
] as const;

export const quoteSchema = z
  .object({
    // step 1
    damageTypes: z
      .array(z.string())
      .min(1, "Pick at least one so we know what we're looking at."),
    description: z
      .string()
      .max(4000, "That's a little long — 4000 characters max.")
      .optional(),

    // step 2
    vehicleMake: z.string().min(1, "What make is it?").max(60),
    vehicleModel: z.string().min(1, "And the model?").max(60),
    vehicleYear: z
      .string()
      .regex(/^(19|20)\d{2}$/, "Enter a four-digit year, e.g. 2019")
      .optional()
      .or(z.literal("")),
    vehicleColour: z.string().max(40).optional(),
    rego: z.string().max(12).optional(),
    driveable: z.enum(["yes", "no"], { message: "Let us know if it's drivable." }),

    // step 3 — photos are optional; storage ids are filled in as they upload
    photoIds: z.array(z.string()).max(10),

    // step 4
    isClaim: z.enum(["yes", "no", "unsure"], {
      message: "Let us know whether you're claiming.",
    }),
    insurer: z.string().max(120).optional(),
    claimNumber: z.string().max(80).optional(),

    // step 5
    name: z.string().min(2, "Please enter your name.").max(120),
    phone: z
      .string()
      .min(8, "Please enter a contact number.")
      .max(40)
      .regex(/^[\d\s()+-]+$/, "Numbers, spaces and + ( ) - only."),
    email: z
      .string()
      .email("That email address doesn't look right.")
      .max(200)
      .optional()
      .or(z.literal("")),
    suburb: z.string().max(120).optional(),
    postcode: z
      .string()
      .regex(/^\d{4}$/, "Australian postcodes are four digits.")
      .optional()
      .or(z.literal("")),
    preferredContact: z.enum(["phone", "sms", "email"]),
    bestTime: z.string().max(120).optional(),
  })
  .superRefine((values, ctx) => {
    // Email becomes mandatory if it's the only way we can reach them.
    if (
      values.preferredContact === "email" &&
      (values.email === undefined || values.email.length === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "We need an email address if you'd like us to email you.",
      });
    }
  });

export type QuoteValues = z.infer<typeof quoteSchema>;

export type QuoteStep = {
  id: string;
  title: string;
  /** Shown under the step title. */
  blurb: string;
  /** Fields validated before this step can be left. */
  fields: (keyof QuoteValues)[];
};

export const QUOTE_STEPS: QuoteStep[] = [
  {
    id: "damage",
    title: "What happened?",
    blurb: "Pick everything that applies — it helps us quote accurately.",
    fields: ["damageTypes", "description"],
  },
  {
    id: "vehicle",
    title: "Your vehicle",
    blurb: "So we can check parts, paint codes and booth space.",
    fields: [
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
      "vehicleColour",
      "rego",
      "driveable",
    ],
  },
  {
    id: "photos",
    title: "Photos of the damage",
    blurb: "Optional, but photos are the difference between a guess and a quote.",
    fields: ["photoIds"],
  },
  {
    id: "insurance",
    title: "Insurance",
    blurb: "If you're claiming, we'll handle the insurer and the paperwork.",
    fields: ["isClaim", "insurer", "claimNumber"],
  },
  {
    id: "contact",
    title: "How do we reach you?",
    blurb: "Last step — then we'll get back to you with a quote.",
    fields: [
      "name",
      "phone",
      "email",
      "suburb",
      "postcode",
      "preferredContact",
      "bestTime",
    ],
  },
];

export const quoteDefaults: QuoteValues = {
  damageTypes: [],
  description: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleColour: "",
  rego: "",
  driveable: "yes",
  photoIds: [],
  isClaim: "no",
  insurer: "",
  claimNumber: "",
  name: "",
  phone: "",
  email: "",
  suburb: "",
  postcode: "",
  preferredContact: "phone",
  bestTime: "Any time",
};
