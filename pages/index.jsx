import { useState, useEffect } from "react";
import { initSoundEngine, soundTypingPulse } from "@/lib/cognitive/sound";
import { setCognitiveState } from "@/lib/cognitive/engine";
import Constellation from "@/components/Constellation";
import Vortex from "@/components/Vortex";
import HoloCore from "@/components/HoloCore";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    initSoundEngine();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setCognitiveState("CREATIVE_FLOW");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResponse(data.output || "");
  };

  return (
    <div className="min-h-screen coherex-bg text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <Constellation />
      <Vortex />
      <HoloCore />

      <h1 className="text-4xl font-bold mb-6 text-center relative z-10">
        Coherex Cognitive Engine
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-xl relative z-10">
        <textarea
          className="w-full p-4 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={5}
          placeholder="Type your thoughts..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCognitiveState("EXPLORATION");
            soundTypingPulse(e.target.value.length % 5);
          }}
        />

        <button
          type="submit"
          className="mt-4 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
        >
          Generate
        </button>
      </form>

      {response && (
        <div className="mt-8 w-full max-w-xl p-4 bg-white/10 rounded-lg border border-white/20 relative z-10">
          <h2 className="text-xl font-semibold mb-2">Response</h2>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
