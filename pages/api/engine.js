import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are Coherex, a cognitive OS. Analyze the user's text and return a structured JSON object with these fields:

{
  "primaryInsight": "...",
  "beliefs": [],
  "patterns": [],
  "contradictions": [],
  "values": [],
  "rootCause": "",
  "reframes": [],
  "nextSteps": [],
  "dashboard": {
    "beliefGraph": [],
    "emotionalMap": {
      "emotion": "",
      "intensity": "",
      "tone": ""
    },
    "contradictionsPanel": [],
    "actionsPanel": []
  },
  "mindMap": {
    "nodes": [],
    "edges": []
  }
}

Rules:
- Keep insights sharp and concise.
- Extract beliefs even if implicit.
- Detect contradictions.
- Infer values.
- Build a small mind-map with nodes + edges.
- ALWAYS return valid JSON.
- Do not include commentary outside the JSON.

User text:
"${text}"
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are Coherex, a cognitive OS." },
        { role: "user", content: prompt }
      ]
    });

    const data = JSON.parse(completion.choices[0].message.content);

    return res.status(200).json(data);

  } catch (err) {
    console.error("Engine error:", err);
    return res.status(500).json({
      error: "Engine failed",
      details: err.message
    });
  }
}
