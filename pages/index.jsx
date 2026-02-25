import { useState } from "react";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  async function runDemo() {
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
    <>
      {/* Navigation */}
      <nav className="flex flex-col items-start gap-6 p-6 text-2xl">
        <a href="/" className="hover:text-white">Home</a>
        <a href="/about" className="hover:text-white">About</a>
        <a href="/pricing" className="hover:text-white">Pricing</a>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-10">
        <div className="card-3d p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Coherex</h1>
          <p className="text-lg mb-8">
            Your cognitive OS for structured thinking.
          </p>

          <button 
            className="btn-glow"
            onClick={() => setShowDemo(true)}
          >
            Try Demo
          </button>
        </div>
      </main>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Coherex Mini Demo</h2>

            <textarea
              className="w-full p-3 border rounded mb-4 text-black"
              rows="4"
              placeholder="Type a thought, belief, or idea..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="px-4 py-2 bg-black text-white rounded w-full mb-4"
              onClick={runDemo}
            >
              Process
            </button>

            {output && (
              <div className="bg-gray-100 p-4 rounded text-black whitespace-pre-wrap">
                {output}
              </div>
            )}

            <button
              className="px-4 py-2 bg-black text-white rounded w-full mt-4"
              onClick={() => setShowDemo(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
