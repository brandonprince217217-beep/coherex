import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

export default function ThoughtProtector() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeThought(e: any) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
You are Thought Protector.

Analyze the user's thought and return JSON with these fields:

{
  "predictedNextThought": "",
  "whyItAppears": "",
  "patternDetected": "",
  "protectedThought": "",
  "reasoning": ""
}

User thought: "${input}"
          `,
        }),
      });

      const data = await res.json();

      let parsed: any = null;

      try {
        parsed = JSON.parse(data.reply);
      } catch {
        parsed = {
          error: "Invalid JSON returned from engine.",
          raw: data.reply,
        };
      }

      setResult(parsed);
    } catch (err) {
      setResult({ error: "Engine failed." });
    }

    setLoading(false);
  }

  return (
    <Layout>
      <Head>
        <title>Thought Protector • Coherex</title>
        <meta
          name="description"
          content="Predict your next thought, detect harmful patterns, and get a safer alternative path with Coherex Thought Protector."
        />
      </Head>

      <div style={{ minHeight: '100vh', color: '#f1f5f9', padding: '80px 24px 48px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
            Thought Protector
          </h1>
          <p style={{ opacity: 0.65, marginBottom: '36px', fontSize: '1.05rem' }}>
            Predicts your next likely thought, detects harmful patterns, and gives you a safer,
            clearer alternative path.
          </p>

          <form onSubmit={analyzeThought} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea
              style={{
                width: '100%',
                height: '128px',
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(0,0,0,0.55)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#f1f5f9',
                fontSize: '1rem',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              placeholder="Type your thought here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              style={{
                alignSelf: 'flex-start',
                padding: '12px 28px',
                borderRadius: '8px',
                background: 'rgba(0,140,255,0.85)',
                border: '1px solid rgba(0,140,255,0.9)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Protect My Thought"}
            </button>
          </form>

          {result && (
            <div style={{
              marginTop: '36px',
              padding: '28px',
              borderRadius: '14px',
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(0,140,255,0.4)',
              boxShadow: '0 0 32px rgba(0,140,255,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {result.error && (
                <p style={{ color: 'rgba(255,80,80,0.9)' }}>{result.error}</p>
              )}

              {result.predictedNextThought && (
                <>
                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      Predicted Next Thought
                    </h2>
                    <p style={{ opacity: 0.8 }}>{result.predictedNextThought}</p>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      Why This Thought Appears
                    </h2>
                    <p style={{ opacity: 0.8 }}>{result.whyItAppears}</p>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      Pattern Detected
                    </h2>
                    <p style={{ opacity: 0.8 }}>{result.patternDetected}</p>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      Protected Thought
                    </h2>
                    <p style={{ opacity: 0.8 }}>{result.protectedThought}</p>
                  </div>

                  <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                      Reasoning
                    </h2>
                    <p style={{ opacity: 0.8 }}>{result.reasoning}</p>
                  </div>
                </>
              )}

              {result.raw && (
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    Raw Output
                  </h2>
                  <p style={{ opacity: 0.8, whiteSpace: 'pre-wrap' }}>{result.raw}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
