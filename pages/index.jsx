import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [displayed, setDisplayed] = useState("");

  async function runDemo() {
    if (!query.trim()) return;

    setLoading(true);
    setResult("");
    setDisplayed("");

    try {
      const res = await fetch("/api/demo?q=" + encodeURIComponent(query));
      const data = await res.json();
      const fullText = data.answer;

      setResult(fullText);

      // Typing animation
      let i = 0;
      const speed = 12;

      function type() {
        setDisplayed(fullText.slice(0, i));
        i++;
        if (i <= fullText.length) {
          setTimeout(type, speed);
        }
      }

      type();
    } catch (err) {
      setDisplayed("Something went wrong. Try again.");
    }

    setLoading(false);
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    alert("Copied to clipboard!");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
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

      {/* Input */}
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

      {/* Output */}
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
          lineHeight: "1.7",
          fontFamily: "Inter, sans-serif",
          position: "relative"
        }}
      >
        {loading ? "Thinking…" : displayed || "Your results will appear here."}

        {/* Copy Button */}
        {result && (
          <button
            onClick={copyResult}
            style={{
              marginTop: "20px",
              padding: "10px 18px",
              background: "#4f46e5",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              position: "absolute",
              bottom: "20px",
              right: "20px"
            }}
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}
