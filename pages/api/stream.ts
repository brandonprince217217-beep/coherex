import type { NextApiRequest, NextApiResponse } from "next";
import { openai, groqModel } from "../../lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const completion = await openai.chat.completions.create({
      model: groqModel,
      stream: true,
      messages: [
        { role: "system", content: "You are Coherex assistant." },
        { role: "user", content: message },
      ],
    });

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });

    for await (const chunk of completion) {
      const token = chunk.choices?.[0]?.delta?.content || "";
      if (token.trim() === "") continue;
      res.write(token);
    }

    res.end();
  } catch (err) {
    console.error("Stream API error:", err);
    res.status(500).end("Error");
  }
}
