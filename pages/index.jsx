import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [insight, setInsight] = useState("");
  const [hasAsked, setHasAsked] = useState(false);
  const [showLayer2, setShowLayer2] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    // First-layer: single distilled insight
    const generated =
      "You’re overwhelmed because you’re trying to move forward without first making your inner situation explicit.";

    setInsight(generated);
    setHasAsked(true);
  }

  function handleExpand() {
    setShowLayer2(true);
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

      {/* LAYER 1 — PRIMARY INSIGHT */}
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

          {/* EXPAND BUTTON */}
          {!showLayer2 && (
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
          )}
        </div>
      )}

      {/* LAYER 2 — STRUCTURED BREAKDOWN */}
      {showLayer2 && (
        <div
          style={{
            marginTop: "20px",
            maxWidth: "680px",
            padding: "24px",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.35)",
            boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
            textAlign: "left"
          }}
        >
          <h2 style={{ fontSize: "22px", marginBottom: "14px" }}>
            Cognitive Breakdown
          </h2>

          <Section title="Beliefs Extracted" items={[
            "I’m overwhelmed.",
            "I don’t have clarity.",
            "I need to move forward but can’t."
          ]} />

          <Section title="Patterns Detected" items={[
            "Avoidance of defining desires.",
            "High internal pressure.",
            "Fear of choosing incorrectly."
          ]} />

          <Section title="Contradictions" items={[
            "Wants clarity but avoids defining specifics.",
            "Wants progress but fears wrong direction."
          ]} />

          <Section title="Values Implied" items={[
            "Growth",
            "Direction",
            "Self‑alignment"
          ]} />

          <Section title="Root Cause" items={[
            "Lack of internal clarity, not lack of options."
          ]} />

          <Section title="Recommended Reframes" items={[
            "I don’t need the perfect direction — I need the next honest step."
          ]} />

          <Section title="Next Steps" items={[
            "Define what you actually want.",
            "Clarify constraints.",
            "Choose one micro‑action."
          ]} />
        </div>
      )}
    </div>
  );
}

/* SMALL REUSABLE COMPONENT FOR LAYER 2 */
function Section({ title, items }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontSize: "14px",
          opacity: 0.7,
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.08em"
        }}
      >
        {title}
      </div>
      <ul style={{ marginLeft: "18px", opacity: 0.9 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: "4px" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
