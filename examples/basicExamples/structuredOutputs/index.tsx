import { ChatCompletion, OpenAIProvider } from "@gensx/openai";
import { gsx } from "gensx";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

interface ExtractEntitiesProps {
  text: string;
}

interface ExtractEntitiesBasicOutput {
  people: string[];
  places: string[];
  organizations: string[];
}

// Define the basic version of the component
const ExtractEntitiesBasic = gsx.Component<
  ExtractEntitiesProps,
  ExtractEntitiesBasicOutput
>(async ({ text }) => {
  const prompt = `Please review the following text and extract all the people, places, and organizations mentioned.

  <text>
  ${text}
  </text>
    
  Please return json with the following format:
  {
    "people": ["person1", "person2", "person3"],
    "places": ["place1", "place2", "place3"],
    "organizations": ["org1", "org2", "org3"]
  }`;
  return (
    <ChatCompletion
      model="gpt-4o-mini"
      messages={[
        {
          role: "user",
          content: prompt,
        },
      ]}
      response_format={{ type: "json_object" }}
    >
      {(response: string) => {
        return JSON.parse(response) as ExtractEntitiesBasicOutput;
      }}
    </ChatCompletion>
  );
});

// Define the Zod schema
const ExtractEntitiesSchema = z.object({
  people: z.array(z.string()),
  places: z.array(z.string()),
  organizations: z.array(z.string()),
});

type ExtractEntitiesOutput = z.infer<typeof ExtractEntitiesSchema>;

// Define the more advanced version of the component using zod
const ExtractEntities = gsx.Component<
  ExtractEntitiesProps,
  ExtractEntitiesOutput
>(async ({ text }) => {
  const prompt = `Please review the following text and extract all the people, places, and organizations mentioned.

  <text>
  ${text}
  </text>
    
  Please return json with the following format:
  {
    "people": ["person1", "person2", "person3"],
    "places": ["place1", "place2", "place3"],
    "organizations": ["org1", "org2", "org3"]
  }`;
  return (
    <ChatCompletion
      model="gpt-4o-mini"
      messages={[
        {
          role: "user",
          content: prompt,
        },
      ]}
      response_format={zodResponseFormat(ExtractEntitiesSchema, "entities")}
    >
      {(response: string) => {
        return ExtractEntitiesSchema.parse(JSON.parse(response));
      }}
    </ChatCompletion>
  );
});

async function main() {
  console.log("\n🚀 Starting the structured outputs example");

  console.log("\n🎯 Running the basic version");
  const result = await gsx.execute(
    <OpenAIProvider apiKey={process.env.OPENAI_API_KEY}>
      <ExtractEntitiesBasic text="John Doe is a software engineer at Google." />
    </OpenAIProvider>,
  );
  console.log(result);

  console.log("\n🎯 Running the advanced version");
  const result2 = await gsx.execute(
    <OpenAIProvider apiKey={process.env.OPENAI_API_KEY}>
      <ExtractEntities text="John Doe is a software engineer at Google." />
    </OpenAIProvider>,
  );
  console.log(result2);
  console.log("\n✅ Structured outputs example complete");
}

main().catch(console.error);
