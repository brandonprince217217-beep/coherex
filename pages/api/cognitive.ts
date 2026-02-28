import { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { emptyAnalysis } from "../../lib/cognitive/model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Perform cognitive analysis." },
      { role: "user", content: text }
    ]
  });

  res.status(200).json({
    analysis: response.choices[0].message.content || emptyAnalysis
  });
}
