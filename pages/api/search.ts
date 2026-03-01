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

  try {
    const { query } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    res.status(200).json({
      query,
      beliefType: parsed.beliefType || "other",
      emotionalCharge: parsed.emotionalCharge || 0,
      coreNeed: parsed.coreNeed || "",
      hiddenAssumption: parsed.hiddenAssumption || "",
      contradiction: parsed.contradiction || "",
      rewrite: parsed.rewrite || "",
      nextQuestion: parsed.nextQuestion || "",
      answer: parsed.answer || "",
    });
  } catch (err) {
    console.error("Error in /api/search:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
