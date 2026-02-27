import { openai } from "../../lib/openai";

export default async function handler(req, res) {
  try {
    const { message } = JSON.parse(req.body || "{}");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "Generate a short, clean conversation title.",
        },
        { role: "user", content: message },
      ],
    });

    const title = completion.choices?.[0]?.message?.content || "Conversation";

    res.status(200).json({ title });
  } catch (err) {
    console.error("Title API error:", err);
    res.status(200).json({ title: "Conversation" });
  }
}
