import { useState } from "react";

type EngineResult = {
  belief_type: string;
  emotional_charge: string;
  core_need: string;
  rewrite: string;
  next_question: string;
  raw?: string;
};

export default function EnginePage() {
  const [apiKey, setApiKey] = useState("");
  const [thought, setThought] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought, apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "16px" }}>
        Coherex Cognitive Engine (BYOK – Together)
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" }}>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Paste your Together API key"
          style={{ padding: "8px", borderRadius: "6px", background: "#020617", color: "white", border: "1px solid #1f2937" }}
        />

        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder='e.g. "I feel sad and stuck and like nothing will ever change."'
          rows={4}
          style={{ padding: "8px", borderRadius: "6px", background: "#020617", color: "white", border: "1px solid #1f2937" }}
        />

        <button
          type="submit"
          disabled={loading || !apiKey || !thought}
          style={{
            padding: "10px",
            borderRadius: "999px",
            background: loading || !apiKey || !thought ? "#4b5563" : "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: loading || !apiKey || !thought ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "16px", padding: "10px", background: "#7f1d1d", borderRadius: "8px" }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "24px", padding: "16px", borderRadius: "12px", background: "#020617", border: "1px solid #1f2937" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Belief Breakdown</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr><td>Belief Type</td><td>{result.belief_type}</td></tr>
              <tr><td>Emotional Charge</td><td>{result.emotional_charge}</td></tr>
              <tr><td>Core Need</td><td>{result.core_need}</td></tr>
              <tr><td>Rewrite</td><td>{result.rewrite}</td></tr>
              <tr><td>Next Question</td><td>{result.next_question}</td></tr>
            </tbody>
          </table>

          {result.raw && <pre style={{ marginTop: "16px" }}>{result.raw}</pre>}
        </div>
      )}
    </div>
  );
}
