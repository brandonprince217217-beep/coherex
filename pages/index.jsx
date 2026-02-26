import { useState } from "react";
import { setCognitiveState } from "@/lib/cognitive/engine";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  async function runDemo() {
    // Universe reacts when user triggers the button
    setCognitiveState("CREATIVE_FLOW");

    setOutput("Thinking...");

    const res = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setOutput(data.output);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Coherex Cognitive Engine Demo</h1>

      <textarea
        className="w-full p-3 border rounded mb-4 text-black"
        rows={4}
        placeholder="Type a thought, belief, or idea..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);

          // Universe reacts while typing
          setCognitiveState("EXPLORATION");
        }}
      />

      <button
        onClick={runDemo}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Run Demo
      </button>

      <div className="mt-6 p-4 bg-gray-900 rounded">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <p>{output}</p>
      </div>
    </div>
  );
}
