import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../lib/cognitive/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing query" });
    }

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

    let result;

    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      // fallback if model returns malformed JSON
      result = {
        belief_type: "other",
        emotional_charge: 0,
        core_need: "clarity",
        hidden_assumption: "The user expects a specific type of response.",
        contradiction: "There is no conflict in the user's message.",
        rewrite: "The user is initiating interaction.",
        next_question: "What would you like to explore?",
        answer: "It looks like you're starting a conversation. How can I help you today?"
      };
    }

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

    return res.status(500).json({
      belief_type: "other",
      emotional_charge: 0,
      core_need: "stability",
      hidden_assumption: "Something went wrong in processing.",
      contradiction: "The system expected valid output but failed.",
      rewrite: "There was an issue, but it can be resolved.",
      next_question: "Can you try your request again?",
      answer: "There was an internal issue processing your request. Please try again."
    });
  }
}
