import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";

const SYSTEM_PROMPT = `You are Coherex AI, a cognitive engine that breaks down any thought into its underlying structure.

For every user input, return a JSON object with:

beliefType: classify the belief (fear, shame, control, doubt, identity, worth, abandonment, other)
emotionalCharge: number from 0 to 1
coreNeed: the core psychological need behind the belief
hiddenAssumption: the assumption the user is making without realizing it
contradiction: any internal conflict or tension in the belief
rewrite: a clearer, more grounded version of the belief
nextQuestion: the single most important question the user should explore next
answer: a full, multi-paragraph natural-language explanation using real AI reasoning, written clearly and conversationally

Always respond in JSON. Always be direct, deep, and psychologically precise.`;

type CoherexResponse = {
  query: string;
  beliefType: string;
  emotionalCharge: number;
  coreNeed: string;
  hiddenAssumption: string;
  contradiction: string;
  rewrite: string;
  nextQuestion: string;
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return res.status(500).json({ error: "No response from AI" });
    }

    let parsed: Partial<CoherexResponse>;

    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", rawContent);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    const response: CoherexResponse = {
      query,
      beliefType: parsed.beliefType || "other",
      emotionalCharge:
        typeof parsed.emotionalCharge === "number" ? parsed.emotionalCharge : 0.5,
      coreNeed: parsed.coreNeed || "Unknown",
      hiddenAssumption: parsed.hiddenAssumption || "None identified",
      contradiction: parsed.contradiction || "None identified",
      rewrite: parsed.rewrite || query,
      nextQuestion: parsed.nextQuestion || "What matters most to you here?",
      answer:
        parsed.answer ||
        "I couldn't generate a detailed explanation. Please try rephrasing your question.",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in /api/search:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}
