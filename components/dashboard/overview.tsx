"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Camera,
  Inbox,
  ShieldCheck,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { LeadStatus } from "@/convex/lib/constants";
import {
  DAMAGE_LABELS,
  STATUS_META,
  relativeTime,
  sourceLabel,
  vehicleLabel,
} from "@/lib/leads-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  leads: { label: "Enquiries", color: "var(--brand-600)" },
} satisfies ChartConfig;

export function DashboardOverview() {
  const stats = useQuery(api.leads.stats);
  const recent = useQuery(api.leads.list, {
    paginationOpts: { numItems: 8, cursor: null },
  });

  if (stats === undefined) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  // The 30-day window is zero-filled server-side (see convex/leads.ts stats).
  const series = stats.series;

  const sources = Object.entries(stats.bySource).sort((a, b) => b[1] - a[1]);
  const maxSource = sources[0]?.[1] ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Where every website enquiry is up to.
        </p>
      </div>

      {/* ---------- KPIs ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Inbox}
          label="Unactioned"
          value={stats.unactioned}
          hint="Nobody has opened these yet"
          emphasis={stats.unactioned > 0}
          href="/dashboard/leads?status=new"
        />
        <StatCard
          icon={TrendingUp}
          label="New this week"
          value={stats.newThisWeek}
          hint="Last 7 days"
        />
        <StatCard
          icon={Wrench}
          label="In the pipeline"
          value={stats.inPipeline}
          hint="Contacted through to booked in"
        />
        <StatCard
          icon={ShieldCheck}
          label="Insurance claims"
          value={stats.claims}
          hint="Of all open leads"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* ---------- chart ---------- */}
        <section className="rounded-xl border p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="font-semibold tracking-tight">Enquiries</h2>
              <p className="mt-1 text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <span className="font-mono text-2xl font-semibold tabular-nums">
              {series.reduce((sum, point) => sum + point.leads, 0)}
            </span>
          </div>

          <ChartContainer config={chartConfig} className="mt-6 h-[240px] w-full">
            <AreaChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand-500)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--brand-500)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(String(value)).toLocaleDateString("en-AU", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                      })
                    }
                  />
                }
              />
              <Area
                dataKey="leads"
                type="monotone"
                stroke="var(--brand-600)"
                strokeWidth={2}
                fill="url(#leadsFill)"
              />
            </AreaChart>
          </ChartContainer>
        </section>

        {/* ---------- sources ---------- */}
        <section className="rounded-xl border p-6">
          <h2 className="font-semibold tracking-tight">Where they came from</h2>
          <p className="mt-1 text-sm text-muted-foreground">All open leads</p>

          {sources.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No leads yet.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {sources.slice(0, 6).map(([source, count]) => (
                <li key={source}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="capitalize">{source}</span>
                    <span className="font-mono tabular-nums text-muted-foreground">
                      {count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${(count / maxSource) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ---------- recent ---------- */}
      <section className="rounded-xl border">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold tracking-tight">Latest enquiries</h2>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
          >
            All leads
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {recent === undefined ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : recent.page.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No enquiries yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Submissions from the website will land here the moment they arrive.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {recent.page.map((lead) => {
              const meta = STATUS_META[lead.status as LeadStatus];
              return (
                <li key={lead._id}>
                  <Link
                    href={`/dashboard/leads/${lead._id}`}
                    className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-accent/50"
                  >
                    {lead.readAt === undefined ? (
                      <span
                        aria-label="Unread"
                        className="size-1.5 shrink-0 rounded-full bg-brand-600"
                      />
                    ) : (
                      <span className="size-1.5 shrink-0" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "truncate",
                            lead.readAt === undefined ? "font-semibold" : "font-medium",
                          )}
                        >
                          {lead.name}
                        </span>
                        {lead.isClaim && (
                          <ShieldCheck className="size-3.5 shrink-0 text-brand-600" />
                        )}
                        {lead.photoIds.length > 0 && (
                          <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                            <Camera className="size-3" />
                            {lead.photoIds.length}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {vehicleLabel(lead)} ·{" "}
                        {lead.damageTypes
                          .map((type) => DAMAGE_LABELS[type] ?? type)
                          .join(", ")}{" "}
                        · {sourceLabel(lead.source)}
                      </p>
                    </div>

                    <Badge variant="outline" className={cn("gap-1.5 shrink-0", meta.badge)}>
                      <span className={cn("size-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </Badge>

                    <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
                      {relativeTime(lead._creationTime)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  emphasis = false,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint: string;
  emphasis?: boolean;
  href?: string;
}) {
  const body = (
    <div
      className={cn(
        "h-full rounded-xl border p-5 transition-colors",
        emphasis && "border-brand-300 bg-brand-50/60",
        href !== undefined && "hover:border-brand-400",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className={cn("size-4", emphasis ? "text-brand-700" : "text-muted-foreground")} />
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );

  return href === undefined ? body : <Link href={href}>{body}</Link>;
}
