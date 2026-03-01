import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

type Source = { title: string; url: string; snippet: string; text: string };

const SEARCH_TIMEOUT_MS = 15000;

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Search service not configured" });
  }

  const { query } = req.body || {};
  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "Missing query" });
  }

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

  const ranked = sources
    .map((s) => ({
      ...s,
      _score: score(query, `${s.title}\n${s.snippet}\n${s.text}`),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  const context = ranked
    .map(
      (s, i) =>
        `SOURCE ${i + 1}\nTitle: ${s.title}\nURL: ${s.url}\nContent: ${s.text}`
    )
    .join("\n\n");

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("Search request timed out")),
        SEARCH_TIMEOUT_MS
      );
    });

    const completionPromise = groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content:
            "You are the Coherex AI search engine. Use ONLY the provided sources. " +
            "Cite them using [1], [2], etc. Keep answers concise but helpful.",
        },
        {
          role: "user",
          content: `Query: ${query}\n\n${context}`,
        },
      ],
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    clearTimeout(timeoutId);

    const answer = completion.choices?.[0]?.message?.content ?? "";

    return res.status(200).json({
      answer,
      results: ranked.map(({ title, url, snippet }) => ({
        title,
        url,
        snippet,
      })),
    });
  } catch (err: any) {
    const isTimeout = err?.message?.includes("timed out");
    const message = isTimeout
      ? "The search request timed out. Please try again."
      : "Search is temporarily unavailable. Please try again later.";

    console.error("[search] handler error:", err);
    return res.status(503).json({ error: message });
  }
}
