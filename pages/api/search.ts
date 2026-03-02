import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";

const SYSTEM_PROMPT = `
You are Coherex AI, a cognitive engine that breaks down any thought into its underlying structure.

For every user input, return a JSON object with:

beliefType: classify the belief (fear, shame, control, doubt, identity, worth, abandonment, other)
emotionalCharge: number from 0 to 1
coreNeed: the core psychological need behind the belief
hiddenAssumption: the assumption the user is making without realizing it
contradiction: any internal conflict or tension in the belief
rewrite: a clearer, more grounded version of the belief
nextQuestion: the single most important question the user should explore next
answer: a full, multi-paragraph natural-language explanation using real AI reasoning, written clearly and conversationally

Always respond in JSON. Always be direct, deep, and psychologically precise.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ error: "No response from AI" });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.status(200).json({
      query,
      beliefType: parsed.beliefType || "other",
      emotionalCharge: parsed.emotionalCharge ?? 0.5,
      coreNeed: parsed.coreNeed || "Unknown",
      hiddenAssumption: parsed.hiddenAssumption || "None identified",
      contradiction: parsed.contradiction || "None identified",
      rewrite: parsed.rewrite || query,
      nextQuestion: parsed.nextQuestion || "What matters most to you here?",
      answer: parsed.answer || "",
    });
  } catch (err) {
    console.error("Error in /api/search:", err);
    return res.status(500).json({ error: (err as Error).message || "Internal error" });
  }
}
