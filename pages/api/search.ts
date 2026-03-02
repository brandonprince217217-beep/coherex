import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "../../lib/groq";

const SYSTEM_PROMPT = `You are Coherex AI, a cognitive engine that breaks down any thought into its underlying structure.

For every user input, return a JSON object with:

beliefType: classify the belief (fear, shame, control, doubt, identity, worth, abandonment, other)
emotionalCharge: number from 0 to 1
coreNeed: the core psychological need behind the belief
hiddenAssumption: the assumption the user is making without realizing it
contradiction: any internal conflict or tension in the belief
rewrite: a clearer, more grounded version of the belief
nextQuestion: the single most important question the user should explore next
answer: a full, multi-paragraph natural-language explanation using real AI reasoning, written clearly and conversationally

Always respond in JSON. Always be direct, deep, and psychologically precise.`;

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

    let retrievedResults: Result[] = [];
    try {
      const g: any = groq as any;

      if (typeof g.documents?.search === "function") {
        const docs = await g.documents.search(query, { limit: 10 });
        if (Array.isArray(docs)) {
          retrievedResults = docs.map((d: any) => ({
            title: d.title || d.path || d.id || "Source",
            url: d.url || d.path || "",
            snippet: d.excerpt || d.snippet || (typeof d.content === "string" ? d.content.slice(0, 240) : ""),
          }));
        }
      } else if (typeof g.search === "function") {
        const docs = await g.search(query, { limit: 10 });
        if (Array.isArray(docs)) {
          retrievedResults = docs.map((d: any) => ({
            title: d.title || d.path || d.id || "Source",
            url: d.url || d.path || "",
            snippet: d.excerpt || d.snippet || (typeof d.content === "string" ? d.content.slice(0, 240) : ""),
          }));
        }
      }
    } catch (retrievalErr) {
      console.error("[search][retrieval] error:", retrievalErr);
      retrievedResults = [];
    }

    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    if (retrievedResults.length > 0) {
      const sourcesText = retrievedResults
        .map((r, i) => `[[${i + 1}]] ${r.title} - ${r.url}\n${r.snippet}`)
        .join("\n\n");

      messages.push({
        role: "system",
        content: `The following sources were retrieved for this query:\n\n${sourcesText}\n\nWhen returning JSON, include a top-level \"results\" array containing these sources (or a subset) in the same {title, url, snippet} shape.`,
      });
    }

    messages.push({ role: "user", content: query });

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
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON. Returning fallback.", rawContent);

      const fallbackResponse: CoherexResponse = {
        query,
        beliefType: "other",
        emotionalCharge: 0.5,
        coreNeed: "Unknown",
        hiddenAssumption: "None identified",
        contradiction: "None identified",
        rewrite: query,
        nextQuestion: "What matters most to you here?",
        answer: String(rawContent || ""),
        results: retrievedResults,
      };

      return res.status(200).json(fallbackResponse);
    }

    const response: CoherexResponse = {
      query,
      beliefType: parsed.beliefType || "other",
      emotionalCharge:
        typeof parsed.emotionalCharge === "number" ? parsed.emotionalCharge : 0.5,
      coreNeed: parsed.coreNeed || "Unknown",
      hiddenAssumption: parsed.hiddenAssumption || "None identified",
      contradiction: parsed.contradiction || "None identified",
      rewrite: parsed.rewrite || query,
      nextQuestion: parsed.nextQuestion || "What matters most to you here?",
      answer:
        parsed.answer ||
        "I couldn't generate a detailed explanation. Please try rephrasing your question.",
      results: retrievedResults.length > 0
        ? retrievedResults
        : Array.isArray(parsed.results)
        ? (parsed.results as Result[])
        : [],
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in /api/search:", error);
    return res.status(500).json({ error: "Internal error" });
  }
}