/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { inngest } from "../client";
import prisma from "@/lib/db";

export const weeklyRepoDispatcher = inngest.createFunction(
  {
    id: "ai-code-reviewer-weekly-repo-email-dispatcher",
    cron: "30 4 * * 1", // Monday 10:00 AM IST (4:30 AM UTC)
  },
  async ({ step }) => {
    // Fetch all repositories that have at least one client mapped
    const repos = await step.run("fetch-repositories", async () => {
      return prisma.repository.findMany({
        where: {
          repositoryClients: {
            some: {},
          },
        },
        select: {
          id: true,
          name: true,
          repositoryClients: {
            select: {
              client: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    console.log(`Found ${repos.length} repositories with clients`);

    // Dispatch events for each repository
    const dispatched = await step.run("dispatch-events", async () => {
      const events = [];

      for (const repo of repos) {
        const clientCount = repo.repositoryClients.length;
        console.log(`Dispatching for ${repo.name} (${clientCount} clients)`);

        events.push({
          name: "repo.weekly.summary",
          data: {
            repositoryId: repo.id,
            triggeredBy: "cron",
          },
        });
      }

      // Send all events at once
      if (events.length > 0) {
        await inngest.send(events);
      }

      return events.length;
    });

    return {
      success: true,
      dispatched,
      timestamp: new Date().toISOString(),
    };
  }
);