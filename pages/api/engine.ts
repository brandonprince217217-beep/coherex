import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.2,
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Engine error:", err);
    res.status(500).json({ reply: "Engine error." });
  }
}
