import { useState } from "react";

export default function Home() {
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
        background: "#0a0a0a",
        color: "white",
        padding: "60px 20px",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          fontWeight: "700",
          marginBottom: "20px",
          textAlign: "center"
        }}
      >
        Coherex — A Cognitive OS
      </h1>

      <p
        style={{
          fontSize: "22px",
          maxWidth: "650px",
          lineHeight: "1.6",
          opacity: 0.85,
          margin: "0 auto",
          textAlign: "center"
        }}
      >
        A system for understanding how your mind fits together.  
        Map beliefs. Reveal contradictions.  
        Build clarity from the inside out.
      </p>

      {/* Demo Input */}
      <div
        style={{
          maxWidth: "900px",
          margin: "50px auto 0",
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
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #444",
            background: "#111",
            color: "white",
            fontSize: "20px"
          }}
        />

        <button
          onClick={runDemo}
          style={{
            padding: "18px 26px",
            background: "#4f46e5",
            color: "white",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "18px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Go
        </button>
      </div>

      {/* Demo Output */}
      <div
        style={{
          marginTop: "40px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "30px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.1)",
          minHeight: "400px",
          whiteSpace: "pre-wrap",
          fontSize: "20px",
          lineHeight: "1.7"
        }}
      >
        {loading ? "Thinking…" : result || "Your results will appear here."}
      </div>
    </div>
  );
}
