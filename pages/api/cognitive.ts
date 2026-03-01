import { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";
import { emptyAnalysis } from "../../lib/cognitive/model";

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
        { role: "system", content: "Perform cognitive analysis." },
        { role: "user", content: text }
      ]
    });

    res.status(200).json({
      analysis: response.choices[0].message.content || emptyAnalysis
    });
  } catch (err) {
    console.error("[cognitive] handler error:", err);
    res.status(503).json({ error: "Cognitive analysis is temporarily unavailable. Please try again." });
  }
}
