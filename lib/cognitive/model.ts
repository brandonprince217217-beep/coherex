import OpenAI from "openai";

export type BeliefNode = {
  id: string;
  label: string;
  type: "belief" | "value" | "fear" | "desire" | "assumption";
  strength: number; // 0–1
  emotionalCharge: number; // 0–1
};

export type BeliefEdge = {
  from: string;
  to: string;
  type: "supports" | "contradicts" | "causes" | "relates";
  weight: number; // 0–1
};

export type CognitiveAnalysis = {
  coreBelief: string;
  impliedMeaning: string;
  hiddenAssumptions: string[];
  emotionalState: string;
  emotionalIntensity: number; // 0–1
  contradictions: string[];
  predictedNextThought: string;
  breakthroughLikelihood: number; // 0–1
  identityShift: string;
  beliefGraph: {
    nodes: BeliefNode[];
    edges: BeliefEdge[];
  };
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function analyzeMessageDeep(
  message: string,
  historySummary: string | null
): Promise<CognitiveAnalysis> {
  const systemPrompt = `
You are Coherex Prime, a deep cognitive engine.

Given:
- the user's latest message
- an optional brief summary of their prior context

You will output a structured cognitive analysis with:
- core belief
- implied meaning
- hidden assumptions
- emotional state + intensity (0–1)
- contradictions
- predicted next thought
- breakthrough likelihood (0–1)
- identity shift description
- a belief graph (nodes + edges)

Be precise, compact, and psychologically sharp.
Return ONLY JSON matching the schema I will give you.
No extra text.
  `.trim();

  const schema = {
    type: "object",
    properties: {
      coreBelief: { type: "string" },
      impliedMeaning: { type: "string" },
      hiddenAssumptions: {
        type: "array",
        items: { type: "string" },
      },
      emotionalState: { type: "string" },
      emotionalIntensity: { type: "number" },
      contradictions: {
        type: "array",
        items: { type: "string" },
      },
      predictedNextThought: { type: "string" },
      breakthroughLikelihood: { type: "number" },
      identityShift: { type: "string" },
      beliefGraph: {
        type: "object",
        properties: {
          nodes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" },
                type: {
                  type: "string",
                  enum: ["belief", "value", "fear", "desire", "assumption"],
                },
                strength: { type: "number" },
                emotionalCharge: { type: "number" },
              },
              required: ["id", "label", "type", "strength", "emotionalCharge"],
            },
          },
          edges: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: { type: "string" },
                to: { type: "string" },
                type: {
                  type: "string",
                  enum: ["supports", "contradicts", "causes", "relates"],
                },
                weight: { type: "number" },
              },
              required: ["from", "to", "type", "weight"],
            },
          },
        },
        required: ["nodes", "edges"],
      },
    },
    required: [
      "coreBelief",
      "impliedMeaning",
      "hiddenAssumptions",
      "emotionalState",
      "emotionalIntensity",
      "contradictions",
      "predictedNextThought",
      "breakthroughLikelihood",
      "identityShift",
      "beliefGraph",
    ],
  };

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "cognitive_analysis",
        schema,
        strict: true,
      },
    },
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify({
          message,
          historySummary: historySummary || "",
        }),
      },
    ],
  });

  const raw = completion.choices[0].message.content || "{}";
  const parsed = JSON.parse(raw);

  return parsed as CognitiveAnalysis;
}
