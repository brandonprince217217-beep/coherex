import { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";

const SYSTEM_PROMPT = `You are Coherex Cognitive Engine. Analyze the user's input and return a JSON object with exactly these fields:

{
  "belief_type": "classify the belief (fear, shame, control, doubt, identity, worth, abandonment, other)",
  "emotional_charge": <number from 0 to 1>,
  "core_need": "the core psychological need behind the belief",
  "hidden_assumption": "the assumption the user is making without realizing it",
  "contradiction": "any internal conflict or tension in the belief",
  "rewrite": "a clearer, more grounded version of the belief",
  "answer": "a full, multi-paragraph natural-language explanation",
  "next_question": "the single most important question the user should explore next"
}

Always respond with valid JSON only. No markdown, no extra text.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text }
      ]
    });

    const rawContent = response.choices[0]?.message?.content || "";

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("[cognitive] failed to parse AI response as JSON:", parseError);
      parsed = {};
    }

    res.status(200).json({
      belief_type: parsed.belief_type || "other",
      emotional_charge: typeof parsed.emotional_charge === "number" ? parsed.emotional_charge : 0.5,
      core_need: parsed.core_need || "Unknown",
      hidden_assumption: parsed.hidden_assumption || "None identified",
      contradiction: parsed.contradiction || "None identified",
      rewrite: parsed.rewrite || text,
      answer: parsed.answer || "Unable to analyze.",
      next_question: parsed.next_question || "What matters most to you here?",
    });
  } catch (err) {
    console.error("[cognitive] handler error:", err);
    res.status(503).json({ error: "Cognitive analysis is temporarily unavailable. Please try again." });
  }
}
