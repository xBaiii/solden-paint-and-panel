"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  Archive,
  ArchiveRestore,
  Car,
  CheckCircle2,
  ChevronDown,
  ClipboardCopy,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  UserCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { LeadStatus } from "@/convex/lib/constants";
import {
  DAMAGE_LABELS,
  EVENT_LABELS,
  PRIORITY_META,
  STATUS_META,
  STATUS_ORDER,
  formatCurrency,
  formatDateTime,
  initials,
  relativeTime,
  sourceLabel,
  vehicleLabel,
} from "@/lib/leads-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LeadDetail({ leadId }: { leadId: Id<"leads"> }) {
  const data = useQuery(api.leads.get, { leadId });
  const team = useQuery(api.users.list);

  const setStatus = useMutation(api.leads.setStatus);
  const assign = useMutation(api.leads.assign);
  const addNote = useMutation(api.leads.addNote);
  const updateDetails = useMutation(api.leads.updateDetails);
  const setArchived = useMutation(api.leads.setArchived);
  const markRead = useMutation(api.leads.markRead);

  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [quoteInput, setQuoteInput] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Clear the unread marker the first time someone opens the lead.
  useEffect(() => {
    if (data?.lead !== undefined && data.lead.readAt === undefined) {
      void markRead({ leadId });
    }
  }, [data?.lead, leadId, markRead]);

  if (data === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <p className="font-medium">That lead no longer exists.</p>
        <Link
          href="/dashboard/leads"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
        >
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
      </div>
    );
  }

  const { lead, photos, events, actorNames, assigneeName } = data;
  const statusMeta = STATUS_META[lead.status as LeadStatus];
  const priorityMeta = PRIORITY_META[lead.priority] ?? PRIORITY_META.normal;

  const guard = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't work.");
    }
  };

  /** One-paste summary for dropping into an insurer email or a quote. */
  const copySummary = async () => {
    const lines = [
      `${lead.name} — ${lead.phone}${lead.email !== undefined ? ` — ${lead.email}` : ""}`,
      lead.suburb !== undefined
        ? `Location: ${lead.suburb}${lead.postcode !== undefined ? ` ${lead.postcode}` : ""}`
        : null,
      `Vehicle: ${vehicleLabel(lead)}${lead.vehicleColour !== undefined ? ` (${lead.vehicleColour})` : ""}${lead.rego !== undefined ? ` — rego ${lead.rego}` : ""}`,
      `Drivable: ${lead.driveable === undefined ? "not stated" : lead.driveable ? "yes" : "no"}`,
      `Job: ${lead.damageTypes.map((t) => DAMAGE_LABELS[t] ?? t).join(", ")}`,
      lead.isClaim
        ? `Insurance claim${lead.insurer !== undefined ? ` — ${lead.insurer}` : ""}${lead.claimNumber !== undefined ? ` — claim ${lead.claimNumber}` : ""}`
        : "Not an insurance claim",
      lead.description !== undefined ? `\nCustomer notes:\n${lead.description}` : null,
      photos.length > 0 ? `\n${photos.length} photo(s) attached.` : null,
    ].filter((line): line is string => line !== null);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Summary copied.");
    } catch {
      toast.error("Couldn't access the clipboard.");
    }
  };

  return (
    <div className="space-y-6">
      {/* ---------- header ---------- */}
      <div>
        <Link
          href="/dashboard/leads"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Leads
        </Link>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {lead.name}
              </h1>
              {lead.isClaim && (
                <Badge variant="outline" className="gap-1.5 border-brand-200 bg-brand-50 text-brand-800">
                  <ShieldCheck className="size-3.5" />
                  Insurance claim
                </Badge>
              )}
              {lead.archived && (
                <Badge variant="outline" className="gap-1.5">
                  <Archive className="size-3.5" />
                  Archived
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Received {formatDateTime(lead._creationTime)} ·{" "}
              <span className="capitalize">{sourceLabel(lead.source)}</span>
              {lead.source?.page !== undefined && ` · from ${lead.source.page}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${lead.phone.replace(/\s/g, "")}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <Phone className="size-4" />
              Call
            </a>
            {lead.email !== undefined && (
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent("Your enquiry — Solden Paint & Panel")}`}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Mail className="size-4" />
                Email
              </a>
            )}
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-input px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              <ClipboardCopy className="size-4" />
              Copy summary
            </button>
            <button
              type="button"
              onClick={() =>
                void guard(
                  () => setArchived({ leadIds: [leadId], archived: !lead.archived }),
                  lead.archived ? "Restored." : "Archived.",
                )
              }
              className="inline-flex size-10 items-center justify-center rounded-lg border border-input transition-colors hover:bg-accent"
              title={lead.archived ? "Restore" : "Archive"}
            >
              {lead.archived ? (
                <ArchiveRestore className="size-4" />
              ) : (
                <Archive className="size-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* ================= main column ================= */}
        <div className="space-y-6">
          {/* --- the job --- */}
          <section className="rounded-xl border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              The job
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {lead.damageTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {DAMAGE_LABELS[type] ?? type}
                </Badge>
              ))}
              {lead.serviceSlug !== undefined && (
                <Badge variant="outline">
                  Started from /services/{lead.serviceSlug}
                </Badge>
              )}
            </div>

            {lead.description !== undefined && lead.description.length > 0 && (
              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/60 p-4 text-[15px] leading-relaxed">
                {lead.description}
              </p>
            )}

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Detail icon={Car} label="Vehicle">
                {vehicleLabel(lead)}
                {lead.vehicleColour !== undefined && ` · ${lead.vehicleColour}`}
              </Detail>
              <Detail icon={Car} label="Registration">
                {lead.rego ?? "—"}
              </Detail>
              <Detail icon={CheckCircle2} label="Drivable">
                {lead.driveable === undefined
                  ? "Not stated"
                  : lead.driveable
                    ? "Yes"
                    : "No — needs off-site quote or tow"}
              </Detail>
              <Detail icon={Clock} label="Best time to call">
                {lead.bestTime ?? "Any time"}
              </Detail>
            </dl>
          </section>

          {/* --- photos --- */}
          {photos.length > 0 && (
            <section className="rounded-xl border p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Photos ({photos.length})
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <button
                    key={photo.storageId}
                    type="button"
                    onClick={() => setLightbox(photo.url)}
                    className="group relative aspect-4/3 overflow-hidden rounded-lg border bg-muted"
                  >
                    <Image
                      src={photo.url}
                      alt="Customer-supplied photo of the damage"
                      fill
                      unoptimized
                      sizes="(min-width: 640px) 200px, 45vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* --- insurance --- */}
          {lead.isClaim && (
            <section className="rounded-xl border border-brand-200 bg-brand-50/50 p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-brand-800">
                <ShieldCheck className="size-4" />
                Insurance claim
              </h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <Detail icon={ShieldCheck} label="Insurer">
                  {lead.insurer ?? "Not supplied"}
                </Detail>
                <Detail icon={ShieldCheck} label="Claim number">
                  {lead.claimNumber ?? "Not supplied"}
                </Detail>
              </dl>
            </section>
          )}

          {/* --- notes + timeline --- */}
          <section className="rounded-xl border p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Activity
            </h2>

            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (note.trim().length === 0) return;
                setSavingNote(true);
                try {
                  await addNote({ leadId, body: note });
                  setNote("");
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "Couldn't save that note.",
                  );
                } finally {
                  setSavingNote(false);
                }
              }}
              className="mt-4"
            >
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Add a note — what you discussed, what you quoted, when to follow up…"
                className="resize-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingNote || note.trim().length === 0}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-ink-900 px-4 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  Add note
                </button>
              </div>
            </form>

            <ol className="mt-6 space-y-4 border-l pl-6">
              {events.map((event) => (
                <li key={event._id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[1.9rem] top-1 flex size-4 items-center justify-center rounded-full border-2 border-background",
                      event.type === "note"
                        ? "bg-brand-600"
                        : event.type === "created"
                          ? "bg-ink-900"
                          : "bg-muted-foreground",
                    )}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-medium">
                      {EVENT_LABELS[event.type] ?? event.type}
                    </span>
                    {event.from !== undefined && event.to !== undefined && (
                      <span className="text-sm text-muted-foreground">
                        {STATUS_META[event.from as LeadStatus]?.label ?? event.from}
                        {" → "}
                        {STATUS_META[event.to as LeadStatus]?.label ?? event.to}
                      </span>
                    )}
                    {event.from === undefined && event.to !== undefined && (
                      <span className="text-sm text-muted-foreground">{event.to}</span>
                    )}
                    <span
                      className="text-xs text-muted-foreground"
                      title={formatDateTime(event._creationTime)}
                    >
                      · {relativeTime(event._creationTime)}
                      {event.actorId !== undefined &&
                        ` · ${actorNames[event.actorId] ?? "Unknown"}`}
                    </span>
                  </div>
                  {event.body !== undefined && (
                    <p
                      className={cn(
                        "mt-1.5 whitespace-pre-wrap text-[15px] leading-relaxed",
                        event.type === "note"
                          ? "rounded-lg bg-muted/60 p-3"
                          : "text-muted-foreground",
                      )}
                    >
                      {event.body}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* ================= sidebar ================= */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          {/* --- status --- */}
          <section className="rounded-xl border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Status
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="mt-3 flex w-full items-center justify-between rounded-lg border border-input px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
                <span className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", statusMeta.dot)} />
                  {statusMeta.label}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel>Move to</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS_ORDER.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() =>
                      void guard(
                        () => setStatus({ leadId, status: option }),
                        `Moved to ${STATUS_META[option].label}.`,
                      )
                    }
                  >
                    <span className={cn("size-2 rounded-full", STATUS_META[option].dot)} />
                    <span className="flex-1">{STATUS_META[option].label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="mt-2 text-xs text-muted-foreground">
              {statusMeta.description}
            </p>
          </section>

          {/* --- contact --- */}
          <section className="rounded-xl border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Contact
            </h2>
            <dl className="mt-3 space-y-3">
              <Detail icon={Phone} label="Phone">
                <a
                  href={`tel:${lead.phone.replace(/\s/g, "")}`}
                  className="text-brand-700 hover:underline"
                >
                  {lead.phone}
                </a>
              </Detail>
              <Detail icon={Mail} label="Email">
                {lead.email === undefined ? (
                  "Not supplied"
                ) : (
                  <a
                    href={`mailto:${lead.email}`}
                    className="break-all text-brand-700 hover:underline"
                  >
                    {lead.email}
                  </a>
                )}
              </Detail>
              <Detail icon={MapPin} label="Location">
                {lead.suburb ?? "Not supplied"}
                {lead.postcode !== undefined && ` ${lead.postcode}`}
              </Detail>
              <Detail icon={MessageSquare} label="Prefers">
                <span className="capitalize">{lead.preferredContact}</span>
              </Detail>
            </dl>
          </section>

          {/* --- ownership --- */}
          <section className="rounded-xl border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Assigned to
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="mt-3 flex w-full items-center justify-between rounded-lg border border-input px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
                <span className="flex items-center gap-2">
                  {assigneeName === null ? (
                    <>
                      <UserCircle2 className="size-4 text-muted-foreground" />
                      Unassigned
                    </>
                  ) : (
                    <>
                      <span className="flex size-5 items-center justify-center rounded-full bg-ink-900 text-[9px] font-semibold text-white">
                        {initials(assigneeName)}
                      </span>
                      {assigneeName}
                    </>
                  )}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuItem
                  onClick={() =>
                    void guard(
                      () => assign({ leadId, assignedTo: null }),
                      "Unassigned.",
                    )
                  }
                >
                  Unassigned
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {(team ?? [])
                  .filter((member) => member.active)
                  .map((member) => (
                    <DropdownMenuItem
                      key={member._id}
                      onClick={() =>
                        void guard(
                          () => assign({ leadId, assignedTo: member._id }),
                          `Assigned to ${member.name ?? member.email}.`,
                        )
                      }
                    >
                      {member.name ?? member.email}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Priority
              </h3>
              <div className="mt-2 flex gap-2">
                {(["low", "normal", "high"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      void guard(
                        () => updateDetails({ leadId, priority: option }),
                        "Priority updated.",
                      )
                    }
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                      lead.priority === option
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-input hover:bg-accent",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* --- quote --- */}
          <section className="rounded-xl border p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Quoted amount
            </h2>
            {lead.quotedAmount !== undefined ? (
              <div className="mt-3 flex items-center justify-between">
                <span className="font-mono text-xl font-semibold">
                  {formatCurrency(lead.quotedAmount)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    void guard(
                      () => updateDetails({ leadId, quotedAmount: null }),
                      "Quote cleared.",
                    )
                  }
                  className="text-xs text-muted-foreground underline underline-offset-2"
                >
                  Clear
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  const amount = Number(quoteInput);
                  if (!Number.isFinite(amount) || amount <= 0) {
                    toast.error("Enter an amount in dollars.");
                    return;
                  }
                  await guard(
                    () => updateDetails({ leadId, quotedAmount: amount }),
                    "Quote saved.",
                  );
                  setQuoteInput("");
                }}
                className="mt-3 flex gap-2"
              >
                <Input
                  value={quoteInput}
                  onChange={(event) => setQuoteInput(event.target.value)}
                  inputMode="decimal"
                  placeholder="2400"
                  className="h-10"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 shrink-0 items-center rounded-lg bg-ink-900 px-3 text-sm font-medium text-white"
                >
                  Save
                </button>
              </form>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Internal only — never shown to the customer.
            </p>
          </section>

          <p className="text-xs text-muted-foreground">
            Priority is set to <span className="font-medium">{priorityMeta.label}</span>.
            {lead.lastContactedAt !== undefined &&
              ` Last contacted ${relativeTime(lead.lastContactedAt)}.`}
          </p>
        </aside>
      </div>

      {/* ---------- photo lightbox ---------- */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink-950/92 p-4"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <Image
            src={lightbox}
            alt="Customer-supplied photo of the damage"
            width={1600}
            height={1200}
            unoptimized
            className="max-h-[85vh] w-auto rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium">{children}</dd>
      </div>
    </div>
  );
}
