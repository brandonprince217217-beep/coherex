import { openai } from "../../lib/openai";
import { emptyAnalysis } from "../../lib/cognitive/model";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, historySummary } = JSON.parse(req.body || "{}");

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const systemPrompt = `
You are a cognitive architect analyzing a user's message.

Return a JSON object with this exact shape:

{
  "coreBelief": string,
  "impliedMeaning": string,
  "emotionalTone": string,
  "emotionalIntensity": number,
  "coreNeed": string,
  "hiddenAssumptions": string[],
  "contradictions": string[],
  "breakthroughLikelihood": number,
  "identityShift": string,
  "nextQuestion": string,
  "beliefGraph": [
    {
      "label": string,
      "kind": "belief" | "value" | "fear" | "desire" | "assumption",
      "strength": number
    }
  ]
}
`;

    const userPrompt = `
Recent conversation summary:
${historySummary || "(none)"}

Latest user message:
${message}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    let parsed = emptyAnalysis();

    try {
      parsed = { ...parsed, ...JSON.parse(raw) };
    } catch (e) {}

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Cognitive API error:", err);
    res.status(200).json(emptyAnalysis());
  }
}
