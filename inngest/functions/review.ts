import { inngest } from "../client";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/module/github/lib/github";
import { retrieveContext } from "@/module/ai/lib/rag";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import prisma from "@/lib/db";
import type { ASTSymbolContext } from "@/types/review/types";

function formatASTContext(symbols: ASTSymbolContext[]) {
  if (symbols.length === 0) return "";

  return symbols
    .map(
      (s) => `File: ${s.path}
Symbol: ${s.symbolName ?? "unknown"}
Type: ${s.symbolType ?? "unknown"}
Lines: ${s.startLine ?? "?"}-${s.endLine ?? "?"}`
    )
    .join("\n\n");
}

export const generateReview = inngest.createFunction(
  { id: "generate-review", concurrency: 5 },
  { event: "pr.review.requested" },

  async ({ event, step }) => {
    const { owner, repo, prNumber, userId } = event.data;

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No GitHub access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repo,
          prNumber
        );

        return { ...data, token: account.accessToken };
      }
    );

    const astContext = await step.run("retrieve-ast-context", async () => {
      const query = `
          PR Title: ${title}
          PR Description: ${description || ""}
          Diff Summary:
          ${diff.slice(0, 2000)}
                `.trim();

      return (await retrieveContext(
        query,
        `${owner}/${repo}`
      )) as ASTSymbolContext[];
    });

    const review = await step.run("generate-ai-review", async () => {
      const formattedASTContext = formatASTContext(astContext);

      const prompt = `
          You are a senior software engineer performing a professional code review.

          This system uses AST-based indexing. The context below represents
          specific functions, routes, or classes related to the pull request.

          ====================
          PR METADATA
          ====================
          Title: ${title}
          Description: ${description || "No description provided"}

          ====================
          AST CONTEXT (Symbol-Level)
          ====================
          ${formattedASTContext || "No relevant symbols found"}

          ====================
          CODE CHANGES (DIFF)
          ====================
          \`\`\`diff
          ${diff}
          \`\`\`

          ====================
          REVIEW TASKS
          ====================
          1. Walk through the changes and explain WHAT changed and WHY.
          2. Identify logical, architectural, performance, or security issues.
          3. Comment on affected functions, routes, or handlers.
          4. Suggest concrete improvements with reasoning.
          5. If applicable, generate a SIMPLE Mermaid sequence diagram.
            - Valid Mermaid syntax only
            - Keep it minimal
            - Avoid special characters in labels

          Respond in clear, professional Markdown.
        `;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    await step.run("post-comment", async () => {
      await postReviewComment(token, owner, repo, prNumber, review);
    });

    await step.run("save-review", async () => {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repo,
        },
      });

      if (!repository) {
        return;
      }

      await prisma.review.create({
        data: {
          repositoryId: repository.id,
          prNumber,
          prTitle: title,
          prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          review,
          status: "completed",
        },
      });
    });

    return { success: true };
  }
);
