import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = JSON.parse(req.body || "{}");

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Analyze the user's text and return a short summary.",
        },
        { role: "user", content: text },
      ],
    });

    const summary = completion.choices?.[0]?.message?.content || "";

    res.status(200).json({ summary });
  } catch (err) {
    console.error("Analyze API error:", err);
    res.status(500).json({ summary: "" });
  }
}
