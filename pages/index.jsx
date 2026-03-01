import Head from "next/head";
import { useState } from "react";
import InputBar from "../components/InputBar";
import Constellation from "../components/Constellation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Search failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="home-page">
      <Head>
        <title>Coherex</title>
      </Head>

      <Constellation />

      <div className="hero">
        <h1>Coherex</h1>
        <p>Your cognitive OS.</p>

        <div className="search-container">
          <InputBar
            onSend={handleSearch}
            disabled={loading}
            buttonLabel={loading ? "Searching..." : "Search"}
          />
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 20, color: "red", textAlign: "center" }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            maxWidth: 700,
            marginInline: "auto",
            background: "rgba(0,0,0,0.3)",
            borderRadius: 12,
            color: "white",
            whiteSpace: "pre-wrap"
          }}
        >
          <h2 style={{ marginTop: 0 }}>AI Summary</h2>
          {result.answer}

          {result.results?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3>Sources</h3>
              <ul>
                {result.results.map((r, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>
                    <a href={r.url} style={{ color: "#4ea3ff" }}>
                      {r.title}
                    </a>
                    <div style={{ opacity: 0.8 }}>{r.snippet}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
