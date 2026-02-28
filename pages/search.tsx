import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Result = { title: string; url: string; snippet: string };

export default function SearchPage() {
  const router = useRouter();
  const q = typeof router.query.q === "string" ? router.query.q : "";

  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!q) return;

    (async () => {
      setLoading(true);
      setError("");
      setAnswer("");
      setResults([]);
      setSearched(false);

      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
          signal: AbortSignal.timeout(20_000),
        });

        let data: Record<string, unknown>;
        try {
          data = await res.json();
        } catch {
          throw new Error("Received an unexpected response from the server.");
        }

        if (!res.ok) {
          throw new Error(
            typeof data?.error === "string" ? data.error : "Request failed"
          );
        }

        setAnswer(typeof data.answer === "string" ? data.answer : "");
        setResults(Array.isArray(data.results) ? (data.results as Result[]) : []);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "TimeoutError") {
          setError("The search request timed out. Please try again.");
        } else if (e instanceof Error) {
          setError(e.message || "Something went wrong. Please try again.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
        setSearched(true);
      }
    })();
  }, [q]);

  const hasResults = answer || results.length > 0;
  const showEmpty = searched && !loading && !error && !hasResults && q;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>Search</h1>

      <div style={{ marginTop: 8, opacity: 0.8 }}>
        <strong>Query:</strong> {q || "(none)"}
      </div>

      {loading && (
        <p style={{ marginTop: 16 }} aria-live="polite">
          Thinking…
        </p>
      )}

      {error && (
        <p style={{ marginTop: 16, color: "tomato" }} role="alert">
          {error}
        </p>
      )}

      {showEmpty && (
        <p style={{ marginTop: 16, opacity: 0.7 }} aria-live="polite">
          No results found for &ldquo;{q}&rdquo;. Try a different search.
        </p>
      )}

      {!loading && !error && answer && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid rgba(0,140,255,0.35)",
            background: "rgba(0,0,0,0.2)",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2 style={{ marginTop: 0 }}>AI Summary</h2>
          {answer}
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h2>Sources</h2>
          <ul style={{ paddingLeft: 18 }}>
            {results.map((r, i) => (
              <li key={i} style={{ marginBottom: 12 }}>
                <a href={r.url} style={{ fontWeight: 700 }}>
                  {r.title}
                </a>
                <div style={{ opacity: 0.85 }}>{r.snippet}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
