import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = JSON.parse(req.body || "{}");

    if (!input) {
      return res.status(400).json({ error: "Missing input" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: "You are the Coherex engine. Transform the input into a structured response.",
        },
        { role: "user", content: input },
      ],
    });

    const output = completion.choices?.[0]?.message?.content || "";

    res.status(200).json({ output });
  } catch (err) {
    console.error("Engine API error:", err);
    res.status(500).json({ output: "" });
  }
}
