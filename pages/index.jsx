import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState("");
  const [hasAsked, setHasAsked] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    // First-layer: single, clean, synthesized insight.
    // Placeholder until the real Coherex engine is wired in.
    const generated =
      "You’re overwhelmed because you’re trying to move forward without first making your inner situation explicit.";

    setInsight(generated);
    setHasAsked(true);
  }

  function handleExpand() {
    // This will later trigger the deeper layers (breakdown, dashboard, mind map).
    alert("Deeper Coherex layers are coming next: breakdown, dashboard, and mind map.");
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "28px"
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "700",
          marginBottom: "4px"
        }}
      >
        Coherex
      </h1>
      <p
        style={{
          fontSize: "18px",
          opacity: 0.8,
          maxWidth: "520px"
        }}
      >
        Type what’s on your mind. Coherex returns one clear, distilled insight — the first layer of your cognitive OS.
      </p>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "10px",
          width: "100%",
          maxWidth: "560px",
          justifyContent: "center"
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I feel stuck because..."
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.25)",
            background: "rgba(0,0,0,0.35)",
            color: "white",
            outline: "none",
            fontSize: "16px"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(200,200,255,0.95))",
            color: "#000",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Generate
        </button>
      </form>

      {/* FIRST-LAYER INSIGHT */}
      {hasAsked && (
        <div
          style={{
            marginTop: "26px",
            maxWidth: "640px",
            padding: "20px 22px",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.45)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
            position: "relative"
          }}
        >
          <div
            style={{
              fontSize: "14px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: "10px"
            }}
          >
            Primary Insight
          </div>
          <div
            style={{
              fontSize: "20px",
              lineHeight: 1.5
            }}
          >
            {insight}
          </div>

          {/* EXPAND CONTROL */}
          <button
            type="button"
            onClick={handleExpand}
            style={{
              marginTop: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "transparent",
              color: "rgba(255,255,255,0.8)",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            <span>Expand</span>
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px"
              }}
            >
              +
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
