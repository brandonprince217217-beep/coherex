import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [hasAsked, setHasAsked] = useState(false);
  const [showLayer2, setShowLayer2] = useState(false);
  const [showLayer3, setShowLayer3] = useState(false);
  const [showLayer4, setShowLayer4] = useState(false);

  const [primaryInsight, setPrimaryInsight] = useState("");
  const [beliefs, setBeliefs] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [contradictions, setContradictions] = useState([]);
  const [values, setValues] = useState([]);
  const [rootCause, setRootCause] = useState("");
  const [reframes, setReframes] = useState([]);
  const [nextSteps, setNextSteps] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [mindMap, setMindMap] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setHasAsked(false);
    setShowLayer2(false);
    setShowLayer3(false);
    setShowLayer4(false);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      if (!res.ok) {
        throw new Error("Engine error");
      }

      const data = await res.json();

      setPrimaryInsight(data.primaryInsight);
      setBeliefs(data.beliefs || []);
      setPatterns(data.patterns || []);
      setContradictions(data.contradictions || []);
      setValues(data.values || []);
      setRootCause(data.rootCause || "");
      setReframes(data.reframes || []);
      setNextSteps(data.nextSteps || []);
      setDashboard(data.dashboard || null);
      setMindMap(data.mindMap || null);

      setHasAsked(true);
    } catch (err) {
      console.error(err);
      setPrimaryInsight("Something went wrong generating your cognitive map. Try again in a moment.");
      setHasAsked(true);
    } finally {
      setLoading(false);
    }
  }

  function handleExpand() {
    setShowLayer2(true);
  }

  function openDashboard() {
    setShowLayer3(true);
  }

  function openMindMap() {
    setShowLayer4(true);
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
      <h1 style={{ fontSize: "40px", fontWeight: "700" }}>Coherex</h1>

      <p style={{ fontSize: "18px", opacity: 0.8, maxWidth: "520px" }}>
        Type what’s on your mind. Coherex turns it into a layered cognitive map — from one insight to a full OS view.
      </p>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
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
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: "999px",
            border: "none",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(200,200,255,0.95))",
            color: "#000",
            fontWeight: "600",
            fontSize: "15px",
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </form>

      {/* LAYER 1 */}
      {hasAsked && (
        <div
          style={{
            marginTop: "26px",
            maxWidth: "640px",
            padding: "20px 22px",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.45)",
            boxShadow: "0 18px 45px rgba(0,0,0,0.55)"
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

          <div style={{ fontSize: "20px", lineHeight: 1.5 }}>{primaryInsight}</div>

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

      {/* LAYER 2 */}
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

          <Section title="Beliefs Extracted" items={beliefs} />
          <Section title="Patterns Detected" items={patterns} />
          <Section title="Contradictions" items={contradictions} />
          <Section title="Values Implied" items={values} />
          <Section title="Root Cause" items={[rootCause]} />
          <Section title="Recommended Reframes" items={reframes} />
          <Section title="Next Steps" items={nextSteps} />

          {!showLayer3 && (
            <button
              type="button"
              onClick={openDashboard}
              style={{
                marginTop: "20px",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
                color: "rgba(255,255,255,0.85)",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Open Cognitive Dashboard
            </button>
          )}
        </div>
      )}

      {/* LAYER 3 */}
      {showLayer3 && dashboard && (
        <div
          style={{
            marginTop: "20px",
            maxWidth: "900px",
            padding: "24px",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.25)",
            boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
            textAlign: "left"
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "18px" }}>
            Cognitive Dashboard
          </h2>

          <DashboardPanel title="Insight Summary">
            {primaryInsight}
          </DashboardPanel>

          <DashboardPanel title="Belief Graph (Text)">
            {(dashboard.beliefGraph || []).map((item, i) => (
              <div key={i}>• {item}</div>
            ))}
          </DashboardPanel>

          <DashboardPanel title="Emotional Map">
            {dashboard.emotionalMap && (
              <>
                <div>• Emotion: {dashboard.emotionalMap.emotion}</div>
                <div>• Intensity: {dashboard.emotionalMap.intensity}</div>
                <div>• Tone: {dashboard.emotionalMap.tone}</div>
              </>
            )}
          </DashboardPanel>

          <DashboardPanel title="Contradictions">
            {(dashboard.contradictionsPanel || []).map((item, i) => (
              <div key={i}>• {item}</div>
            ))}
          </DashboardPanel>

          <DashboardPanel title="Action Panel">
            {(dashboard.actionsPanel || []).map((item, i) => (
              <div key={i}>• {item}</div>
            ))}
          </DashboardPanel>

          {!showLayer4 && (
            <button
              type="button"
              onClick={openMindMap}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "transparent",
                color: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Show Mind Map
            </button>
          )}
        </div>
      )}

      {/* LAYER 4 */}
      {showLayer4 && mindMap && (
        <div
          style={{
            marginTop: "20px",
            maxWidth: "900px",
            padding: "24px",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.35)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            textAlign: "left"
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
            Cognitive Mind Map
          </h2>
          <MindMap mindMap={mindMap} />
        </div>
      )}
    </div>
  );
}

function Section({ title, items }) {
  if (!items || items.length === 0 || !items[0]) return null;

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

function DashboardPanel({ title, children }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "18px",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.12)"
      }}
    >
      <div
        style={{
          fontSize: "15px",
          opacity: 0.75,
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.08em"
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "16px", lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

function MindMap({ mindMap }) {
  const nodes = mindMap.nodes || [];
  const edges = mindMap.edges || [];

  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "18px",
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 55%), rgba(0,0,0,0.6)",
        border: "1px solid rgba(255,255,255,0.18)",
        fontSize: "14px",
        lineHeight: 1.6
      }}
    >
      <div style={{ marginBottom: "10px", opacity: 0.8 }}>
        Conceptual map of how this state is structured:
      </div>

      <pre
      
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "Menlo, Monaco, Consolas, monospace",
          fontSize: "13px",
          background: "rgba(0,0,0,0.55)",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)"
        }}
      >
{nodes.map((n, i) => `• ${n}`).join("\n")}

{edges.map(([a, b], i) => `${i === 0 ? "" : ""}${a}  →  ${b}`).join("\n")}
      </pre>

      <div style={{ marginTop: "10px", opacity: 0.85 }}>
        Each node is a belief or emotional state. Edges show how one state feeds into another.
        This is the textual version of the graph — later, this becomes a fully interactive visual map.
      </div>
    </div>
  );
}
