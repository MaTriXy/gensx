import { Workflow } from "@/src/components/Workflow";
import { WorkflowContext } from "@/src/components/Workflow";
import { createWorkflowOutput } from "@/src/hooks/useWorkflowOutput";

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

  let blogPost = "";
  let tweet = "";

  const workflow = (
    <Workflow>
      <BlogWritingWorkflow
        title={
          new Promise(resolve => {
            resolve(title);
          })
        }
        prompt={prompt}
      >
        {blogPostResult => (
          <TweetWritingWorkflow content={blogPostResult}>
            {tweetResult => {
              blogPost = blogPostResult;
              tweet = tweetResult;
              return null;
            }}
          </TweetWritingWorkflow>
        )}
      </BlogWritingWorkflow>
    </Workflow>
  );

  const context = new WorkflowContext(workflow);
  await context.execute();

  console.log("\n=== Nested Workflow Results ===");
  console.log("Blog Post:", blogPost);
  console.log("Tweet:", tweet);
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
