import { useState } from "react";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function runDemo() {
    if (!query.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/demo?q=" + encodeURIComponent(query));
      const data = await res.json();
      setResult(data.answer);
    } catch (err) {
      setResult("Something went wrong. Try again.");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: "800",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Coherex Demo
      </h1>

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          gap: "10px"
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything…"
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "10px",
            border: "1px solid #444",
            background: "#111",
            color: "white",
            fontSize: "18px"
          }}
        />

        <button
          onClick={runDemo}
          style={{
            padding: "16px 24px",
            background: "white",
            color: "black",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "18px"
          }}
        >
          Go
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
          minHeight: "300px",
          whiteSpace: "pre-wrap",
          fontSize: "18px",
          lineHeight: "1.6"
        }}
      >
        {loading ? "Thinking…" : result || "Your results will appear here."}
      </div>
    </div>
  );
}
