"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { usePaginatedQuery, useQuery, useMutation } from "convex/react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Archive,
  ArchiveRestore,
  Camera,
  ChevronDown,
  Download,
  Loader2,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { LeadStatus } from "@/convex/lib/constants";
import {
  DAMAGE_LABELS,
  PRIORITY_META,
  STATUS_META,
  STATUS_ORDER,
  initials,
  relativeTime,
  sourceLabel,
  vehicleLabel,
} from "@/lib/leads-display";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 25;

type Lead = Doc<"leads">;

export function LeadsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter state lives in the URL so a filtered view can be bookmarked and shared.
  const status = (searchParams.get("status") ?? "all") as LeadStatus | "all";
  const archived = searchParams.get("archived") === "1";
  const search = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(search);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useQuery(api.leads.statusCounts, { archived });
  const team = useQuery(api.users.list);
  const setStatus = useMutation(api.leads.bulkSetStatus);
  const setArchived = useMutation(api.leads.setArchived);

  const { results, status: loadStatus, loadMore } = usePaginatedQuery(
    api.leads.list,
    {
      status: status === "all" ? undefined : status,
      archived,
      search: search.length > 0 ? search : undefined,
    },
    { initialNumItems: PAGE_SIZE },
  );

  const setParam = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value.length === 0) params.delete(key);
        else params.set(key, value);
      }
      const query = params.toString();
      router.replace(query.length > 0 ? `/dashboard/leads?${query}` : "/dashboard/leads");
      setSelected(new Set());
    },
    [router, searchParams],
  );

  const assigneeNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of team ?? []) {
      map.set(member._id, member.name ?? member.email ?? "Unknown");
    }
    return map;
  }, [team]);

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all"
            checked={
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.every((row) => selected.has(row.original._id))
            }
            onCheckedChange={(checked) => {
              const next = new Set(selected);
              for (const row of table.getRowModel().rows) {
                if (checked === true) next.add(row.original._id);
                else next.delete(row.original._id);
              }
              setSelected(next);
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select ${row.original.name}`}
            checked={selected.has(row.original._id)}
            onCheckedChange={(checked) => {
              const next = new Set(selected);
              if (checked === true) next.add(row.original._id);
              else next.delete(row.original._id);
              setSelected(next);
            }}
            onClick={(event) => event.stopPropagation()}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => {
          const lead = row.original;
          const unread = lead.readAt === undefined;
          return (
            <div className="flex items-center gap-2.5">
              {unread && (
                <span
                  aria-label="Unread"
                  title="Not opened yet"
                  className="size-1.5 shrink-0 rounded-full bg-brand-600"
                />
              )}
              <div className={cn("min-w-0", !unread && "pl-4")}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate",
                      unread ? "font-semibold" : "font-medium",
                    )}
                  >
                    {lead.name}
                  </span>
                  {lead.isClaim && (
                    <span title="Insurance claim" className="flex shrink-0">
                      <ShieldCheck className="size-3.5 text-brand-600" />
                      <span className="sr-only">Insurance claim</span>
                    </span>
                  )}
                  {lead.photoIds.length > 0 && (
                    <span
                      className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground"
                      title={`${lead.photoIds.length} photos`}
                    >
                      <Camera className="size-3" />
                      {lead.photoIds.length}
                    </span>
                  )}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {lead.phone}
                  {lead.suburb !== undefined && ` · ${lead.suburb}`}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: "vehicle",
        header: "Vehicle",
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="truncate text-sm">{vehicleLabel(row.original)}</div>
            <div className="truncate text-xs text-muted-foreground">
              {row.original.damageTypes
                .map((type) => DAMAGE_LABELS[type] ?? type)
                .join(", ") || "—"}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const meta = STATUS_META[row.original.status as LeadStatus];
          return (
            <Badge variant="outline" className={cn("gap-1.5", meta.badge)}>
              <span className={cn("size-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
          const meta = PRIORITY_META[row.original.priority] ?? PRIORITY_META.normal;
          return (
            <Badge variant="outline" className={meta.className}>
              {meta.label}
            </Badge>
          );
        },
      },
      {
        id: "assignee",
        header: "Owner",
        cell: ({ row }) => {
          const assignedTo = row.original.assignedTo;
          if (assignedTo === undefined) {
            return <span className="text-xs text-muted-foreground">Unassigned</span>;
          }
          const name = assigneeNames.get(assignedTo) ?? "Unknown";
          return (
            <span className="flex items-center gap-2" title={name}>
              <span className="flex size-6 items-center justify-center rounded-full bg-ink-900 text-[10px] font-semibold text-white">
                {initials(name)}
              </span>
              <span className="truncate text-xs">{name}</span>
            </span>
          );
        },
      },
      {
        id: "source",
        header: "Source",
        cell: ({ row }) => (
          <span className="text-xs capitalize text-muted-foreground">
            {sourceLabel(row.original.source)}
          </span>
        ),
      },
      {
        accessorKey: "_creationTime",
        header: "Received",
        cell: ({ row }) => (
          <span
            className="whitespace-nowrap text-xs text-muted-foreground"
            title={new Date(row.original._creationTime).toLocaleString("en-AU")}
          >
            {relativeTime(row.original._creationTime)}
          </span>
        ),
      },
    ],
    [assigneeNames, selected],
  );

  const table = useReactTable({
    data: results,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const exportCsv = () => {
    const header = [
      "Received",
      "Name",
      "Phone",
      "Email",
      "Suburb",
      "Postcode",
      "Vehicle",
      "Rego",
      "Job type",
      "Insurance claim",
      "Insurer",
      "Claim number",
      "Status",
      "Priority",
      "Source",
      "Description",
    ];
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = results.map((lead) =>
      [
        new Date(lead._creationTime).toLocaleString("en-AU"),
        lead.name,
        lead.phone,
        lead.email ?? "",
        lead.suburb ?? "",
        lead.postcode ?? "",
        vehicleLabel(lead),
        lead.rego ?? "",
        lead.damageTypes.map((t) => DAMAGE_LABELS[t] ?? t).join("; "),
        lead.isClaim ? "Yes" : "No",
        lead.insurer ?? "",
        lead.claimNumber ?? "",
        lead.status,
        lead.priority,
        sourceLabel(lead.source),
        (lead.description ?? "").replace(/\r?\n/g, " "),
      ]
        .map((cell) => escape(String(cell)))
        .join(","),
    );

    const blob = new Blob([[header.join(","), ...rows].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solden-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${results.length} leads.`);
  };

  const bulk = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      toast.success(message);
      setSelected(new Set());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That didn't work.");
    }
  };

  const selectedIds = [...selected] as Id<"leads">[];
  const loading = loadStatus === "LoadingFirstPage";

  return (
    <div className="space-y-4">
      {/* ---------- status tabs ---------- */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill
          active={status === "all"}
          onClick={() => setParam({ status: null })}
          count={counts?.all}
        >
          All
        </FilterPill>
        {STATUS_ORDER.map((option) => (
          <FilterPill
            key={option}
            active={status === option}
            onClick={() => setParam({ status: option })}
            count={counts?.[option]}
            dot={STATUS_META[option].dot}
          >
            {STATUS_META[option].label}
          </FilterPill>
        ))}
      </div>

      {/* ---------- toolbar ---------- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setParam({ q: searchInput });
          }}
          className="relative w-full sm:max-w-xs"
        >
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by customer name…"
            className="h-10 pl-9 pr-9"
          />
          {searchInput.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setParam({ q: null });
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setParam({ archived: archived ? null : "1" })}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
              archived
                ? "border-brand-600 bg-brand-50 text-brand-800"
                : "border-input hover:bg-accent",
            )}
          >
            <Archive className="size-4" />
            {archived ? "Viewing archive" : "Archive"}
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={results.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-input px-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ---------- bulk actions ---------- */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
          <span className="text-sm font-medium text-brand-900">
            {selected.size} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-3 text-sm font-medium">
              Set status
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Move to</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {STATUS_ORDER.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() =>
                    void bulk(
                      () => setStatus({ leadIds: selectedIds, status: option }),
                      `Moved ${selected.size} to ${STATUS_META[option].label}.`,
                    )
                  }
                >
                  <span className={cn("size-1.5 rounded-full", STATUS_META[option].dot)} />
                  {STATUS_META[option].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() =>
              void bulk(
                () => setArchived({ leadIds: selectedIds, archived: !archived }),
                archived ? "Restored." : "Archived.",
              )
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-3 text-sm font-medium"
          >
            {archived ? (
              <>
                <ArchiveRestore className="size-3.5" /> Restore
              </>
            ) : (
              <>
                <Archive className="size-3.5" /> Archive
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-sm text-brand-800 underline underline-offset-2"
          >
            Clear
          </button>
        </div>
      )}

      {/* ---------- table ---------- */}
      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : header.column.getCanSort()
                          ? (
                              <button
                                type="button"
                                onClick={header.column.getToggleSortingHandler()}
                                className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                <ChevronDown
                                  className={cn(
                                    "size-3 transition-transform",
                                    header.column.getIsSorted() === "asc" && "rotate-180",
                                    header.column.getIsSorted() === false && "opacity-25",
                                  )}
                                />
                              </button>
                            )
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((_column, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading && table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-40 text-center">
                    <p className="font-medium">No leads here.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {search.length > 0
                        ? "Nothing matched that search."
                        : archived
                          ? "The archive is empty."
                          : "New enquiries from the website will appear here automatically."}
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => router.push(`/dashboard/leads/${row.original._id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ---------- pagination ---------- */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {results.length} lead{results.length === 1 ? "" : "s"}
        </p>
        {loadStatus === "CanLoadMore" && (
          <button
            type="button"
            onClick={() => loadMore(PAGE_SIZE)}
            className="inline-flex h-10 items-center rounded-lg border border-input px-4 text-sm font-medium hover:bg-accent"
          >
            Load more
          </button>
        )}
        {loadStatus === "LoadingMore" && (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading…
          </span>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  count,
  dot,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  dot?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ink-900 bg-ink-900 text-white"
          : "border-input text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {dot !== undefined && !active && (
        <span className={cn("size-1.5 rounded-full", dot)} />
      )}
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "rounded-full px-1.5 text-[11px] tabular-nums",
            active ? "bg-white/15" : "bg-muted",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
