import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  ChartNoAxesColumn,
  Users,
  Inbox,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { features, type FeatureKey } from "@/lib/features";
import { ADMIN_ROLES, type UserRole } from "@/convex/lib/constants";

/**
 * Dashboard navigation as data. A new feature area is a new entry here — the
 * sidebar, the mobile nav and the command palette all read from this list.
 */
export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  feature: FeatureKey;
  /** Restrict to these roles. Omit for everyone signed in. */
  roles?: UserRole[];
  /** Shows the unread-lead count when true. */
  badge?: "unreadLeads";
};

export const dashboardNav: DashboardNavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    feature: "leads",
  },
  {
    label: "Leads",
    href: "/dashboard/leads",
    icon: Inbox,
    feature: "leads",
    badge: "unreadLeads",
  },
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: CalendarClock,
    feature: "jobs",
  },
  {
    label: "Quotes & invoices",
    href: "/dashboard/invoicing",
    icon: FileText,
    feature: "invoicing",
  },
  {
    label: "Reporting",
    href: "/dashboard/reporting",
    icon: ChartNoAxesColumn,
    feature: "reporting",
  },
  {
    label: "Team",
    href: "/dashboard/settings/team",
    icon: Users,
    feature: "team",
    roles: ADMIN_ROLES,
  },
];

/** Nav filtered by feature flags and the signed-in user's role. */
export function visibleNav(role: UserRole | null): DashboardNavItem[] {
  return dashboardNav.filter((item) => {
    if (!features[item.feature]) return false;
    if (item.roles === undefined) return true;
    return role !== null && item.roles.includes(role);
  });
}
