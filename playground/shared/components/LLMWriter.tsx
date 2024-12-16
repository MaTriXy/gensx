import { createWorkflow } from "@/src/utils/workflowBuilder";

interface WriterProps {
  content: string;
}

interface WriterOutput {
  content: string;
  metadata: {
    wordCount: number;
    readingTime: number;
    keywords: string[];
  };
}

export const LLMWriter = createWorkflow<WriterProps, WriterOutput>(
  async (props, render) => {
    const processedContent = await Promise.resolve(
      `Written content based on: ${props.content}`,
    );
    const processedMetadata = {
      wordCount: processedContent.split(" ").length,
      readingTime: Math.ceil(processedContent.split(" ").length / 200),
      keywords: ["sample", "content", "test"],
    };

    return render({
      content: processedContent,
      metadata: processedMetadata,
    });
  },
);
