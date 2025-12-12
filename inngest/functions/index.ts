import { inngest } from "../client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("waita-a-moment", "1s");
    return { message: `hello ${event.data.email} !` };
  }
);
