import { NextRequest, NextResponse } from "next/server";
import { reviewPullRequest } from "@/module/ai/actions/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-gitHub-event");

    if (event === "ping") {
      return NextResponse.json({ message: "Pong" }, { status: 200 });
    }

    if (event === "pull_request") {
      const action = body.action;
      const repo = body.repository.full_name;
      const prNumber = body.number;

      const [owner, repoName] = repo.split("/");

      if (action === "opened" || action === "synchronize") {
        reviewPullRequest(owner, repoName, prNumber)
          .then(() => {
            console.log(`Review completed for ${repo}/#${prNumber}`);
          })
          .catch((err: Error) => {
            console.error(`Review failed for ${repo}/#${prNumber}:`, err);
          });
      }
    }

    return NextResponse.json({ message: "Event Processor" }, { status: 200 });
  } catch (error) {
    console.error("Error handling GitHub webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
