import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";

type EngineResult = {
  belief_type: string;
  emotional_charge: string;
  core_need: string;
  rewrite: string;
  next_question: string;
  raw?: string;
};

type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EngineResult | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body as { query?: string };

  if (!query) {
    return res.status(400).json({ error: "Missing query in request body" });
  }

  try {
    const systemPrompt = `
You are the Coherex Cognitive Engine.

Given a single user input (which may be emotional, messy, or vague), you must analyze it and return a JSON object with this exact shape:

{
  "belief_type": string,
  "emotional_charge": string,
  "core_need": string,
  "rewrite": string,
  "next_question": string
}

Rules:
- Respond with valid JSON only.
- No markdown.
- No commentary.
- No extra keys.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices?.[0]?.message?.content ?? "{}";

    let parsed: EngineResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        belief_type: "unknown",
        emotional_charge: "unknown",
        core_need: "unknown",
        rewrite: "Unable to parse structured output.",
        next_question: "What feels most important to explore next?",
        raw: content,
      };
    }

    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error("[engine] handler error:", err);
    return res.status(503).json({
      error: "Engine is temporarily unavailable. Please try again later.",
    });
  }
}
