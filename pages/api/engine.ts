import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are Thought Protector. Analyze the user's thought and respond ONLY with a raw JSON object — no markdown, no code fences, no extra text before or after the JSON.

The JSON must have exactly these fields:
{
  "predictedNextThought": "",
  "whyItAppears": "",
  "patternDetected": "",
  "protectedThought": "",
  "reasoning": ""
}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { thought, query, apiKey } = req.body;
    const input = thought || query;

    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "thought is required" });
    }

    const resolvedKey = apiKey || process.env.GROQ_API_KEY;
    if (!resolvedKey) {
      return res.status(503).json({ error: "No Groq API key available" });
    }

    const groq = new Groq({ apiKey: resolvedKey });

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content || "";

    if (!raw) {
      return res.status(500).json({ error: "No response from AI" });
    }

    let parsed: unknown;
    try {
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: "Invalid AI response format", raw });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Engine error:", err);
    return res.status(500).json({ error: "Engine error." });
  }
}
