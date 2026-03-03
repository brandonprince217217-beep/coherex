import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

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
      let parsed;

      try {
        parsed = JSON.parse(data.reply);
      } catch {
        parsed = { error: "Invalid response format." };
      }

      setResult(parsed);
    } catch (err) {
      setResult({ error: "Engine failed." });
    }

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Thought Protector • Coherex</title>
      </Head>

      <div className="min-h-screen bg-black text-white">
        <header className="w-full border-b border-neutral-800 p-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold">
            Coherex
          </Link>

          <nav className="space-x-6 text-neutral-300">
            <Link href="/chat">Chat</Link>
            <Link href="/engine">Engine</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/thought-protector" className="text-white font-semibold">
              Thought Protector
            </Link>
          </nav>
        </header>

        <main className="max-w-2xl mx-auto py-16 px-6">
          <h1 className="text-4xl font-bold mb-6">Thought Protector</h1>
          <p className="text-neutral-300 mb-10">
            Predicts your next likely thought, detects harmful patterns, and gives you a safer,
            clearer alternative path.
          </p>

          <form onSubmit={analyzeThought} className="space-y-4">
            <textarea
              className="w-full h-32 p-4 rounded-lg bg-neutral-900 border border-neutral-700"
              placeholder="Type your thought here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="px-6 py-3 rounded-lg bg-white text-black font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Protect My Thought"}
            </button>
          </form>

          {result && (
            <div className="mt-10 p-6 rounded-lg bg-neutral-900 border border-neutral-700 space-y-4">
              {result.error && (
                <p className="text-red-400">{result.error}</p>
              )}

              {result.predictedNextThought && (
                <>
                  <div>
                    <h2 className="text-xl font-semibold">Predicted Next Thought</h2>
                    <p className="text-neutral-300">{result.predictedNextThought}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Why This Thought Appears</h2>
                    <p className="text-neutral-300">{result.whyItAppears}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Pattern Detected</h2>
                    <p className="text-neutral-300">{result.patternDetected}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Protected Thought</h2>
                    <p className="text-neutral-300">{result.protectedThought}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">Reasoning</h2>
                    <p className="text-neutral-300">{result.reasoning}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
