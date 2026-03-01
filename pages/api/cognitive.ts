import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/lib/cognitive/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing query" });
    }

    // Call GPT‑4o with a structured JSON instruction
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are Coherex, a cognitive engine. 
Always return a JSON object with these fields:

belief_type
emotional_charge
core_need
hidden_assumption
contradiction
rewrite
next_question
answer

Rules:
- Never leave any field empty.
- If the input is simple (like "hi"), still fill all fields with neutral interpretations.
- emotional_charge must be a number from -10 to +10.
- belief_type must be one of: limiting, empowering, observational, identity, fear-based, assumption, other.
- answer must be a clear, human explanation of what the user is expressing.
`
        },
        {
          role: "user",
          content: query
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json({
      belief_type: result.belief_type,
      emotional_charge: result.emotional_charge,
      core_need: result.core_need,
      hidden_assumption: result.hidden_assumption,
      contradiction: result.contradiction,
      rewrite: result.rewrite,
      next_question: result.next_question,
      answer: result.answer
    });

  } catch (err) {
    console.error("Cognitive API error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
