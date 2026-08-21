import type { Metadata } from "next";
import { Suspense } from "react";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Leads</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every enquiry from the website. New ones appear here automatically — no
          need to refresh.
        </p>
      </div>

      {/* useSearchParams needs a Suspense boundary for the filter state in the URL. */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <LeadsTable />
      </Suspense>
    </div>
  );
}
