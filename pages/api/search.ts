import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";

const SYSTEM_PROMPT = `You are Coherex AI, a cognitive engine that breaks down any thought into its underlying structure.

For every user input, respond ONLY with a raw JSON object — no markdown, no code fences, no extra text before or after the JSON.

The JSON must have exactly these fields:
{
  "beliefType": "fear | shame | control | doubt | identity | worth | abandonment | other",
  "emotionalCharge": 0.0,
  "coreNeed": "",
  "hiddenAssumption": "",
  "contradiction": "",
  "rewrite": "",
  "nextQuestion": "",
  "answer": "",
  "results": [
    { "title": "", "url": "", "snippet": "" },
    { "title": "", "url": "", "snippet": "" },
    { "title": "", "url": "", "snippet": "" }
  ]
}

Always include at least 3 plausible, relevant results. Always be direct, deep, and psychologically precise.`;

type Result = { title: string; url: string; snippet: string };
type CoherexResponse = {
  query: string;
  beliefType: string;
  emotionalCharge: number;
  coreNeed: string;
  hiddenAssumption: string;
  contradiction: string;
  rewrite: string;
  nextQuestion: string;
  answer: string;
  results: Result[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query is required" });
    }

    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages,
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return res.status(500).json({ error: "No response from AI" });
    }

    let parsed: Partial<CoherexResponse> = {};

    try {
      const cleaned = rawContent.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON.", rawContent);
      return res.status(500).json({ error: "Invalid AI response format", raw: rawContent });
    }

    // Normalize potential snake_case keys from the model to camelCase
    const normalized = {
      beliefType: parsed.beliefType ?? (parsed as any).belief_type,
      emotionalCharge: parsed.emotionalCharge ?? (parsed as any).emotional_charge,
      coreNeed: parsed.coreNeed ?? (parsed as any).core_need,
      hiddenAssumption: parsed.hiddenAssumption ?? (parsed as any).hidden_assumption,
      contradiction: parsed.contradiction ?? (parsed as any).contradiction,
      rewrite: parsed.rewrite ?? (parsed as any).rewrite,
      nextQuestion: parsed.nextQuestion ?? (parsed as any).next_question,
      answer: parsed.answer ?? (parsed as any).answer,
      results: parsed.results ?? (parsed as any).results,
    };

    const fallbackResults: Result[] = [
      {
        title: `Coherex: ${query}`,
        url: `https://coherex.app/search?q=${encodeURIComponent(query)}`,
        snippet: "Explore this topic further with Coherex AI.",
      },
      {
        title: `Understanding: ${query}`,
        url: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
        snippet: "Read more about this topic on Wikipedia.",
      },
      {
        title: `Research on: ${query}`,
        url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
        snippet: "Find academic research related to this topic.",
      },
    ];

    const response: CoherexResponse = {
      query,
      beliefType: normalized.beliefType || "other",
      emotionalCharge:
        typeof normalized.emotionalCharge === "number" ? normalized.emotionalCharge : 0.5,
      coreNeed: normalized.coreNeed || "Unknown",
      hiddenAssumption: normalized.hiddenAssumption || "None identified",
      contradiction: normalized.contradiction || "None identified",
      rewrite: normalized.rewrite || query,
      nextQuestion: normalized.nextQuestion || "What matters most to you here?",
      answer:
        normalized.answer ||
        "I couldn't generate a detailed explanation. Please try rephrasing your question.",
      results: Array.isArray(normalized.results) && normalized.results.length > 0
        ? (normalized.results as Result[])
        : fallbackResults,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in /api/search:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}