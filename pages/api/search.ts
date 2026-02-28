import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { getMissingServerEnv } from "../../lib/env";

type Source = { title: string; url: string; snippet: string; text: string };

const SEARCH_TIMEOUT_MS = 15_000;
const RELEVANCE_THRESHOLD = 1;
const MAX_RESULTS = 4;

// Lightweight greeting / small-talk detector — no retrieval for these
const GREETING_RE =
  /^(hi|hey|hello|howdy|yo|sup|good\s+(morning|afternoon|evening|day)|how\s+are\s+you|what'?s\s+up|thank(?:s|s?\s+you)?|bye|goodbye)\W*$/i;

function isGreeting(q: string): boolean {
  return GREETING_RE.test(q.trim());
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function score(query: string, haystack: string) {
  const q = query.toLowerCase().trim();
  const t = haystack.toLowerCase();
  if (!q) return 0;

  const parts = q.split(/\s+/).filter(Boolean);
  let s = 0;

  for (const p of parts) {
    const re = new RegExp(escapeRegExp(p), "g");
    const m = t.match(re);
    if (m) s += m.length;
  }
  return s;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query } = req.body || {};
  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "Missing query" });
  }

  // Validate required env vars at request time and return a structured error
  const missingEnv = getMissingServerEnv();
  if (missingEnv.length > 0) {
    return res.status(503).json({
      error: `Missing required configuration: ${missingEnv.join(", ")}. Set the environment variable(s) and redeploy.`,
    });
  }

  const debugEnabled = process.env.SEARCH_DEBUG === "true";

  // Greeting / small-talk: skip retrieval, return friendly prompt
  if (isGreeting(query)) {
    return res.status(200).json({
      answer:
        "Hi! I'm the Coherex search assistant. Ask me a specific question to get started.",
      results: [],
      ...(debugEnabled
        ? { _debug: { retrievalPerformed: false, fallbackUsed: true, fallbackReason: "greeting" } }
        : {}),
    });
  }

  // STARTER INTERNAL "INDEX" (easy + works now)
  // You can expand this later to real page content / embeddings.
  const sources: Source[] = [
    {
      title: "Home",
      url: "/",
      snippet: "Coherex homepage and tagline.",
      text: "Coherex. Your cognitive OS.",
    },
    {
      title: "About",
      url: "/about",
      snippet: "About Coherex and what it does.",
      text: "About Coherex and what it does.",
    },
    {
      title: "Pricing",
      url: "/pricing",
      snippet: "Plan details and pricing.",
      text: "Pricing plans, basic access, unlimited searches, engine access, and analysis features.",
    },
    {
      title: "Demo",
      url: "/demo",
      snippet: "Demo experience for Coherex.",
      text: "Demo page that shows example interactions and results.",
    },
  ];

  // Score and filter to only sources that actually match the query
  const ranked = sources
    .map((s) => ({ ...s, _score: score(query, `${s.title}\n${s.snippet}\n${s.text}`) }))
    .filter((s) => s._score >= RELEVANCE_THRESHOLD)
    .sort((a, b) => b._score - a._score)
    .slice(0, MAX_RESULTS);

  const debugBase = debugEnabled
    ? {
        model: "gpt-4o-mini",
        retrievalPerformed: true,
        candidatesRetrieved: sources.length,
        passingThreshold: ranked.length,
        threshold: RELEVANCE_THRESHOLD,
        fallbackUsed: false as boolean,
        fallbackReason: null as string | null,
      }
    : null;

  // No relevant docs — return truthful response without calling the LLM
  if (ranked.length === 0) {
    return res.status(200).json({
      answer:
        "I couldn't find any relevant information for that query. Try rephrasing or ask something specific about Coherex.",
      results: [],
      ...(debugBase
        ? { _debug: { ...debugBase, fallbackUsed: true, fallbackReason: "no-relevant-sources" } }
        : {}),
    });
  }

  const context = ranked
    .map(
      (s, i) =>
        `SOURCE ${i + 1}\nTitle: ${s.title}\nURL: ${s.url}\nContent: ${s.text}`
    )
    .join("\n\n");

  try {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("Search request timed out")),
        SEARCH_TIMEOUT_MS
      );
    });

    const completionPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a search engine for the Coherex site. Answer using ONLY the provided sources. " +
            "Add citations like [1], [2] that refer to the SOURCE numbers. Keep it concise.",
        },
        { role: "user", content: `Query: ${query}\n\n${context}` },
      ],
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    clearTimeout(timeoutId);
    const answer = completion.choices[0]?.message?.content ?? "";

    return res.status(200).json({
      answer,
      results: ranked.map(({ title, url, snippet }) => ({ title, url, snippet })),
      ...(debugBase ? { _debug: debugBase } : {}),
    });
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.message.includes("timed out");
    const message = isTimeout
      ? "The search request timed out. Please try again."
      : "Search is temporarily unavailable. Please try again later.";

    console.error("[search] handler error:", err);
    return res.status(503).json({ error: message });
  }
}
