import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { message } = await req.json();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content:
          "Generate a short 3–6 word title summarizing the user's message. No quotes. No punctuation.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const title = completion.choices[0].message.content.trim();

  return new Response(JSON.stringify({ title }), {
    headers: { "Content-Type": "application/json" },
  });
}
