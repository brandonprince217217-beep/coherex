import { NextApiRequest, NextApiResponse } from "next";
import { openai, groqModel } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: groqModel,
      messages: [
        { role: "system", content: "Run the cognitive engine." },
        { role: "user", content: text }
      ]
    });

    res.status(200).json({ output: response.choices[0].message.content });
  } catch (err) {
    console.error("[engine] handler error:", err);
    res.status(503).json({ error: "Engine is temporarily unavailable. Please try again." });
  }
}
