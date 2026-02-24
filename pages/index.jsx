import { useState } from "react";

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      {/* Navigation */}
      <nav className="flex items-center gap-6 p-6">
        <a href="/" className="hover:text-white">Home</a>
        <a href="/about" className="hover:text-white">About</a>
        <a href="/pricing" className="hover:text-white">Pricing</a>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-20">
        <div className="card-3d p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Coherex</h1>
          <p className="text-lg mb-8">
            Your cognitive OS for structured thinking.
          </p>

          {/* Try Demo Button */}
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
          <div className="bg-white text-black p-6 rounded-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4">Coherex Demo</h2>
            <p className="mb-6">This is where your demo content will go.</p>

            <button 
              className="px-4 py-2 bg-black text-white rounded"
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
