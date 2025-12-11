import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { headers } from "next/headers";

// interface ContributionCollection {
//     user : {
//         contributionsCollection: {
//             contributionCalendar: {
//                 totalContributions: number;
//                 weeks: {
//                     contribuitonCount : number
//                     date: string | Date
//                     color: string
//                 }
//             }
//         }
//     }
// }

export const getGitHubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session found");
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account) {
    throw new Error("No GitHub account linked");
  }

  return account.accessToken;
};

export async function fetchUserContribution(
  token: string | null,
  username: string
) {
  const octokit = new Octokit({
    auth: token,
  });

  const query = `
    query($username: String!) {
        user(login: $username) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks{
                    contributionDays {
                        date
                        contributionCount
                        color
                    }}
                }  
             }
        }
    }`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await octokit.graphql(query, { username });
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw error;
  }
}
