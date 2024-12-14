import { Workflow } from "@/src/index";
import { WorkflowContext } from "@/src/index";
import { createWorkflowOutput } from "@/src/index";

import { BlogWritingWorkflow } from "./blog/BlogWritingWorkflow";
import { TweetWritingWorkflow } from "./tweet/TweetWritingWorkflow";

async function runParallelWorkflow() {
  const title = "Programmatic Secrets with ESC";
  const prompt = "Write an article...";

  const [blogPost, setBlogPost] = createWorkflowOutput("");
  const [tweet, setTweet] = createWorkflowOutput("");

  const workflow = (
    <Workflow>
      <BlogWritingWorkflow
        title={title}
        prompt={prompt}
        setOutput={setBlogPost}
      />
      <TweetWritingWorkflow content={blogPost} setOutput={setTweet} />
    </Workflow>
  );

  const context = new WorkflowContext(workflow);
  await context.execute();

  console.log("\n=== Parallel Workflow Results ===");
  console.log("Blog Post:", await blogPost);
  console.log("Tweet:", await tweet);
}

async function runNestedWorkflow() {
  const title = "Programmatic Secrets with ESC";
  const prompt = "Write an article...";

  const workflow = (
    <Workflow>
      <BlogWritingWorkflow title={title} prompt={prompt}>
        {blogPost => (
          <TweetWritingWorkflow content={blogPost}>
            {tweet => {
              console.log("\n=== Nested Workflow Results ===");
              console.log("Tweet:", tweet);
              console.log("Blog Post:", blogPost);
              return null;
            }}
          </TweetWritingWorkflow>
        )}
      </BlogWritingWorkflow>
    </Workflow>
  );

  const context = new WorkflowContext(workflow);
  await context.execute();
}

async function main() {
  try {
    await runParallelWorkflow();
    await runNestedWorkflow();
  } catch (error) {
    console.error("Workflow execution failed:", error);
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
