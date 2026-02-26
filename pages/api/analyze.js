// pages/api/analyze.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  if (!input || input.trim() === "") {
    return res.status(400).json({ error: "No input provided" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Coherex, a cognitive OS.

Always return JSON in this exact format:

{
  "layer1": "Core interpretation...",
  "layer2": "Pattern detection...",
  "layer3": "Mapping...",
  "layer4": "Agency..."
}

Do not include anything else.
          `,
        },
        {
          role: "user",
          content: input,
        },
      ],
      response_format: { type: "json_object" },
    });

    const json = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: json,
    });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({
      error: "Failed to analyze input",
      details: err.message,
    });
  }
}
