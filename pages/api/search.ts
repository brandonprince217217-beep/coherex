import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { embed, cosine } from "../../lib/embeddings";

type Source = {
  title: string;
  url: string;
  snippet: string;
  text: string;
  embedding?: number[];
};

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

let cached = false;

async function ensureEmbeddings() {
  if (cached) return;

  for (const s of sources) {
    s.embedding = await embed(s.text);
  }

  cached = true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body || {};
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing query" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({ error: "Missing OPENAI_API_KEY" });
  }

  await ensureEmbeddings();

  const qEmbed = await embed(query);

  const ranked = sources
    .map((s) => ({
      ...s,
      score: cosine(qEmbed, s.embedding!),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const context = ranked
    .map(
      (s, i) =>
        `SOURCE ${i + 1}\nTitle: ${s.title}\nURL: ${s.url}\nContent: ${s.text}`
    )
    .join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are the Coherex AI search engine. Use ONLY the provided sources. Cite them using [1], [2], etc.",
      },
      {
        role: "user",
        content: `Query: ${query}\n\n${context}`,
      },
    ],
  });

  const answer = completion.choices?.[0]?.message?.content ?? "";

  return res.status(200).json({
    answer,
    results: ranked.map((s) => ({
      title: s.title,
      url: s.url,
      snippet: s.snippet,
    })),
  });
}
