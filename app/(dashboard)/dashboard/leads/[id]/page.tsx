import type { Metadata } from "next";
import { LeadDetail } from "@/components/dashboard/lead-detail";
import type { Id } from "@/convex/_generated/dataModel";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadDetailPage({
  params,
}: PageProps<"/dashboard/leads/[id]">) {
  const { id } = await params;
  return <LeadDetail leadId={id as Id<"leads">} />;
}
