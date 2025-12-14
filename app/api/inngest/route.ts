import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { indexRepo } from "@/inngest/functions";
import { generateReview } from "@/inngest/functions/review";
// import { weeklyRepoDispatcher } from "@/inngest/functions/weekly-dispatcher";
import { repoWeeklySummary } from "@/inngest/functions/repo-weekly-summary";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    indexRepo,
    generateReview,
    // weeklyRepoDispatcher,
    repoWeeklySummary,
  ],
});
