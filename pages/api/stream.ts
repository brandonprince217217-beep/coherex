// pages/api/stream.ts
import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { message } = await req.json();

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    stream: true,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";

      for await (const chunk of response) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (!delta) continue;

        buffer += delta;

        if (buffer.includes("\n\n")) {
          const parts = buffer.split("\n\n");
          const complete = parts.slice(0, -1).join("\n\n");
          buffer = parts[parts.length - 1];

          controller.enqueue(encoder.encode(complete + "[SEGMENT]"));
        }
      }

      if (buffer.trim().length > 0) {
        controller.enqueue(encoder.encode(buffer + "[SEGMENT]"));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
