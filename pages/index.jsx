// redeploy trigger

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [hasAsked, setHasAsked] = useState(false);
  const [showLayer2, setShowLayer2] = useState(false);
  const [showLayer3, setShowLayer3] = useState(false);
  const [showLayer4, setShowLayer4] = useState(false);

  // NEW: store AI result
  const [result, setResult] = useState(null);

  async function analyze() {
    if (!input.trim()) return;

    setLoading(true);
    setHasAsked(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      // NEW: save AI output
      setResult(data.data);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Coherex — A Cognitive OS
      </h1>

      <p style={{ fontSize: "20px", maxWidth: "600px", lineHeight: "1.5" }}>
        Understand how your mind fits together.  
        Map beliefs. Detect contradictions.  
        See the bigger picture.
      </p>

      {/* Input */}
      <div style={{ marginTop: "40px", maxWidth: "600px" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a belief, thought, or idea..."
          rows={4}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            fontSize: "16px",
          }}
        />

        <button
          onClick={analyze}
          style={{
            marginTop: "20px",
            padding: "14px 28px",
            background: "#4f46e5",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          {loading ? "Processing..." : "Analyze"}
        </button>
      </div>

      {/* Layer 1 */}
      {hasAsked && (
        <div style={{ marginTop: "50px", opacity: 0.9 }}>
          <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
            Layer 1 — Core Interpretation
          </h2>

          <p style={{ maxWidth: "600px", lineHeight: "1.6" }}>
            {result?.layer1 || "Processing your input..."}
          </p>

          {!showLayer2 && (
            <button
              onClick={() => setShowLayer2(true)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Expand Layer 2
            </button>
          )}
        </div>
      )}

      {/* Layer 2 */}
      {showLayer2 && (
        <div style={{ marginTop: "40px", opacity: 0.9 }}>
          <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
            Layer 2 — Pattern Detection
          </h2>

          <p style={{ maxWidth: "600px", lineHeight: "1.6" }}>
            {result?.layer2 || "Analyzing deeper patterns..."}
          </p>

          {!showLayer3 && (
            <button
              onClick={() => setShowLayer3(true)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Expand Layer 3
            </button>
          )}
        </div>
      )}

      {/* Layer 3 */}
      {showLayer3 && (
        <div style={{ marginTop: "40px", opacity: 0.9 }}>
          <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
            Layer 3 — Mapping
          </h2>

          <p style={{ maxWidth: "600px", lineHeight: "1.6" }}>
            {result?.layer3 || "Mapping internal structures..."}
          </p>

          {!showLayer4 && (
            <button
              onClick={() => setShowLayer4(true)}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Expand Layer 4
            </button>
          )}
        </div>
      )}

      {/* Layer 4 */}
      {showLayer4 && (
        <div style={{ marginTop: "40px", opacity: 0.9 }}>
          <h2 style={{ fontSize: "26px", marginBottom: "10px" }}>
            Layer 4 — Agency
          </h2>

          <p style={{ maxWidth: "600px", lineHeight: "1.6" }}>
            {result?.layer4 || "Generating actionable clarity..."}
          </p>
        </div>
      )}
    </div>
  );
}
