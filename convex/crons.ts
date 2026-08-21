import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Photos are uploaded before the wizard is submitted, so an abandoned form can
 * leave files in storage that no lead references. Sweep them daily.
 */
const crons = cronJobs();

crons.daily(
  "clean up orphaned uploads",
  { hourUTC: 17, minuteUTC: 0 }, // 3am Brisbane (UTC+10)
  internal.files.cleanupOrphanedUploads,
  {},
);

export default crons;
