import type { Metadata } from "next";
import { TeamSettings } from "@/components/dashboard/team-settings";

export const metadata: Metadata = { title: "Team" };

export default function TeamSettingsPage() {
  return <TeamSettings />;
}
