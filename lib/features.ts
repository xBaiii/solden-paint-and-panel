/**
 * Feature flags for the dashboard.
 *
 * The dashboard is expected to grow past lead management (jobs, bookings,
 * invoicing, reporting). Flags let a half-built area ship dark rather than
 * living on a long-running branch. Nav entries in lib/dashboard-nav.ts are
 * filtered by these.
 */
export const features = {
  leads: true,
  team: true,
  /** Planned: scheduling repairs into booth/bay slots. */
  jobs: false,
  /** Planned: quote documents and invoicing. */
  invoicing: false,
  /** Planned: deeper conversion and source reporting. */
  reporting: false,
} as const;

export type FeatureKey = keyof typeof features;

export function isEnabled(key: FeatureKey): boolean {
  return features[key];
}
