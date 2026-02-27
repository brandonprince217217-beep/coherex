import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { section, userInput } = req.body;

  if (!section || !userInput) {
    return res.status(400).json({ error: "Missing section or userInput" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Coherex, a cognitive OS.
You generate deep psychological analysis inside a structured engine.
Your tone is calm, precise, and insightful.`
        },
        {
          role: "user",
          content: `Generate the "${section}" section for this user input: "${userInput}".
Return ONLY the text. No bullets unless the section requires them.`
        }
      ]
    });

    const output = response.choices[0].message.content?.trim() || "";
    res.status(200).json({ output });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI request failed" });
  }
}
