import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import InputBar from "../components/InputBar";
import type { SearchResponse } from "./api/search";

const ParticleField3D = dynamic(
  () => import("../components/ParticleField3D"),
  { ssr: false }
);

type LoadingPhase = "retrieving" | "synthesising" | "formatting";

const LOADING_PHASES: { phase: LoadingPhase; label: string }[] = [
  { phase: "retrieving", label: "Retrieving sources…" },
  { phase: "synthesising", label: "Synthesising answer…" },
  { phase: "formatting", label: "Preparing response…" },
];

function LoadingState() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((p) => Math.min(p + 1, LOADING_PHASES.length - 1));
    }, 2_200);
    return () => clearInterval(id);
  }, []);

  const { label } = LOADING_PHASES[phaseIndex];

  return (
    <div className="search-loading">
      <div className="search-loading__dots">
        <span />
        <span />
        <span />
      </div>
      <p className="search-loading__label">{label}</p>
      <div className="search-loading__shimmer">
        <div className="shimmer-line shimmer-line--wide" />
        <div className="shimmer-line shimmer-line--medium" />
        <div className="shimmer-line shimmer-line--narrow" />
        <div className="shimmer-line shimmer-line--wide" />
        <div className="shimmer-line shimmer-line--medium" />
      </div>
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: SearchResponse["confidence"] }) {
  if (confidence === "high") return null;
  const msg =
    confidence === "low"
      ? "⚠️ Limited sources found — treat this as a starting point, not a definitive answer."
      : "ℹ️ Some sources were available but coverage may be incomplete.";
  return <div className="confidence-warning">{msg}</div>;
}

function AnswerCard({ data }: { data: SearchResponse }) {
  const { interpretation, reframing, relatedAngles, results, confidence, retrievedAt } = data;

  return (
    <div className="answer-card">
      <ConfidenceBadge confidence={confidence} />

      {interpretation && (
        <section className="answer-section">
          <h3 className="answer-section__heading">What you might be experiencing</h3>
          <p className="answer-section__body">{interpretation}</p>
        </section>
      )}

      {reframing && (
        <section className="answer-section">
          <h3 className="answer-section__heading">A gentle reframe</h3>
          <p className="answer-section__body">{reframing}</p>
        </section>
      )}

      {relatedAngles.length > 0 && (
        <section className="answer-section">
          <h3 className="answer-section__heading">Related themes</h3>
          <div className="answer-tags">
            {relatedAngles.map((tag, i) => (
              <span key={i} className="answer-tag">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {results.length > 0 && (
        <section className="answer-section answer-section--sources">
          <h3 className="answer-section__heading">Sources</h3>
          <ol className="sources-list">
            {results.map((r, i) => (
              <li key={i} className="source-item">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="source-link">
                  {r.title || r.url}
                </a>
                {r.snippet && <p className="source-snippet">{r.snippet}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="answer-meta">
        Retrieved {new Date(retrievedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}

function normalizeQuery(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export default function SearchPage() {
  const router = useRouter();
  const q = typeof router.query.q === "string" ? router.query.q : "";

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      setData(null);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        const json = await res.json();
        if (cancelled) return;

        if (!res.ok) throw new Error(json?.error || "Request failed");
        setData(json as SearchResponse);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [q]);

  const handleSearch = (text: string) => {
    const query = normalizeQuery(text);
    if (query.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-page">
      <Head>
        <title>{q ? `${q} — Coherex` : "Search — Coherex"}</title>
      </Head>

      <ParticleField3D />

      <div className="search-page__bar">
        <InputBar
          onSend={handleSearch}
          disabled={loading}
          buttonLabel={loading ? "Searching…" : "Search"}
          initialValue={q}
        />
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <div className="search-error">
          <p>{error}</p>
          <button className="search-error__retry" onClick={() => router.replace(router.asPath)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && <AnswerCard data={data} />}

      {!loading && !error && !data && q && (
        <p className="search-empty">No results found. Try rephrasing your query.</p>
      )}
    </div>
  );
}

