import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { fetchWebResults, type WebResult } from "../../lib/webSearch";

const TIMEOUT_MS = 20_000;

export type SearchResponse = {
  answer: string;
  interpretation: string;
  reframing: string;
  relatedAngles: string[];
  results: Array<{ title: string; url: string; snippet: string }>;
  confidence: "high" | "medium" | "low";
  retrievedAt: string;
};

export type ErrorResponse = { error: string };

function normalizeQuery(q: string) {
  return q.replace(/\s+/g, " ").trim();
}

function confidenceFromSources(sources: WebResult[]): "high" | "medium" | "low" {
  if (sources.length >= 3) return "high";
  if (sources.length >= 1) return "medium";
  return "low";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body ?? {};
  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "Missing query" });
  }

  const normalized = normalizeQuery(query);
  const retrievedAt = new Date().toISOString();

  // Abort the whole pipeline after TIMEOUT_MS
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // 1. Retrieve live web sources (gracefully empty when key is absent)
    const webResults = await fetchWebResults(normalized, 5);
    const confidence = confidenceFromSources(webResults);

    // 2. Build source context for the LLM
    const context =
      webResults.length > 0
        ? webResults
            .map(
              (s, i) =>
                `SOURCE ${i + 1}\nTitle: ${s.title}\nURL: ${s.url}\nSnippet: ${s.snippet}`
            )
            .join("\n\n")
        : "No external sources were available for this query.";

    const confidenceNote =
      confidence === "low"
        ? " NOTE: source coverage is sparse — be transparent about uncertainty."
        : confidence === "medium"
        ? " NOTE: source coverage is limited — express appropriate confidence."
        : "";

    // 3. Synthesise a structured, supportive response
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0.6,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content:
              "You are a warm, insightful assistant for Coherex, a cognitive OS for self-understanding. " +
              "Your tone is supportive, clear, and non-prescriptive. " +
              "Respond ONLY with valid JSON matching this exact shape:\n" +
              "{\n" +
              '  "interpretation": "<one short paragraph: empathetic reflection on what the user might be experiencing>",\n' +
              '  "reframing": "<one short paragraph: a gentle reframe or constructive next step>",\n' +
              '  "relatedAngles": ["<tag or short phrase>", ...] // 2–4 related themes\n' +
              "}\n" +
              "Use the provided sources to ground your answer and add citations like [1], [2] where relevant." +
              confidenceNote,
          },
          {
            role: "user",
            content: `User query: "${normalized}"\n\nSources:\n${context}`,
          },
        ],
      },
      { signal: controller.signal as AbortSignal }
    );

    clearTimeout(timer);

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: { interpretation?: string; reframing?: string; relatedAngles?: string[] };
    try {
      // Strip possible markdown code fences and extract the first JSON object
      const fenceStripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/m, "");
      const jsonMatch = fenceStripped.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      parsed = {};
    }

    const interpretation = parsed.interpretation ?? raw;
    const reframing = parsed.reframing ?? "";
    const relatedAngles = Array.isArray(parsed.relatedAngles) ? parsed.relatedAngles : [];
    const answer = [interpretation, reframing].filter(Boolean).join("\n\n");

    return res.status(200).json({
      answer,
      interpretation,
      reframing,
      relatedAngles,
      results: webResults.map(({ title, url, snippet }) => ({ title, url, snippet })),
      confidence,
      retrievedAt,
    });
  } catch (err: unknown) {
    clearTimeout(timer);
    const isTimeout =
      err instanceof Error && (err.name === "AbortError" || err.message.includes("abort"));
    return res
      .status(isTimeout ? 504 : 500)
      .json({ error: isTimeout ? "Request timed out. Please try again." : "Search failed. Please try again." });
  }
}
