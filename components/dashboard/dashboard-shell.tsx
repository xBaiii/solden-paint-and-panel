"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ChevronsUpDown, ExternalLink, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { UserRole } from "@/convex/lib/constants";
import { visibleNav } from "@/lib/dashboard-nav";
import { initials } from "@/lib/leads-display";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dashboard chrome: sidebar, user menu and the live "new leads" toast.
 *
 * Built on shadcn's sidebar primitive so the collapse behaviour, mobile sheet
 * and keyboard shortcut come for free.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const me = useQuery(api.users.me);
  const counts = useQuery(api.leads.statusCounts, {});

  const nav = visibleNav((me?.role ?? null) as UserRole | null);
  const newCount = counts?.new ?? 0;

  return (
    // SidebarMenuButton renders a Tooltip when collapsed, which needs a
    // provider above it — SidebarProvider does not supply one.
    <TooltipProvider delayDuration={200}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-2 py-1.5"
            >
              <Image
                src="/images/brand/swoosh.png"
                alt=""
                width={512}
                height={512}
                className="h-7 w-auto shrink-0"
              />
              <span className="flex flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold tracking-tight">SOLDEN</span>
                <span className="text-[10px] font-medium text-brand-600">
                  Lead dashboard
                </span>
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => {
                    const active =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                            {item.badge === "unreadLeads" && newCount > 0 && (
                              <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-brand-600 px-1.5 text-[11px] tabular-nums text-white group-data-[collapsible=icon]:hidden">
                                {newCount}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View the website">
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    <span>View website</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <UserMenu
                  name={me?.name ?? null}
                  email={me?.email ?? null}
                  role={me?.role ?? null}
                  loading={me === undefined}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-xl">
            <SidebarTrigger className="-ml-1">
              <Menu />
            </SidebarTrigger>
            <NewLeadWatcher count={counts?.new} />
          </header>
          <div className="flex-1 p-4 lg:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

function UserMenu({
  name,
  email,
  role,
  loading,
}: {
  name: string | null;
  email: string | null;
  role: string | null;
  loading: boolean;
}) {
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-4 flex-1 group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-semibold text-white">
            {initials(name ?? email)}
          </span>
          <span className="flex min-w-0 flex-1 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium">
              {name ?? email ?? "Signed in"}
            </span>
            <span className="truncate text-xs capitalize text-muted-foreground">
              {role ?? "staff"}
            </span>
          </span>
          <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium">{name ?? "Signed in"}</span>
          {email !== null && (
            <span className="block truncate text-xs text-muted-foreground">
              {email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push("/sign-in");
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Convex queries are reactive, so `count` changes on its own when a lead is
 * submitted. This watches for it going up and toasts — the shop notices a new
 * enquiry without refreshing anything.
 */
function NewLeadWatcher({ count }: { count: number | undefined }) {
  const previous = useRef<number | null>(null);

  useEffect(() => {
    if (count === undefined) return;
    if (previous.current !== null && count > previous.current) {
      const added = count - previous.current;
      toast.success(
        added === 1 ? "New enquiry just came in" : `${added} new enquiries just came in`,
        { description: "Open Leads to see the details." },
      );
    }
    previous.current = count;
  }, [count]);

  return (
    <span
      className={cn(
        "ml-auto flex items-center gap-2 text-xs",
        count !== undefined && count > 0
          ? "text-brand-700"
          : "text-muted-foreground",
      )}
    >
      {count !== undefined && count > 0 && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
        </span>
      )}
      {count === undefined
        ? "Connecting…"
        : count === 0
          ? "No unactioned leads"
          : `${count} unactioned lead${count === 1 ? "" : "s"}`}
    </span>
  );
}
