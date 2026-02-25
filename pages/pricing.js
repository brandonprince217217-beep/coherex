import { useState } from "react";

export default function Pricing() {
  return (
    <>
      {/* Header */}
      <header className="w-full px-6 py-10">
        <nav className="flex flex-col items-start space-y-10 text-4xl font-bold">
          <a href="/" className="hover:text-purple-400 transition">
            Home
          </a>
          <a href="/about" className="hover:text-purple-400 transition">
            About
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 bg-black text-white rounded-xl hover:opacity-80 transition"
          >
            Pricing
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-10">
        <div className="card-3d p-10">
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-lg mb-8">
            Choose the plan that fits your cognitive workflow.
          </p>

          <div className="space-y-6">
            <div className="p-6 bg-white text-black rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-2">Starter</h2>
              <p className="mb-4">Basic tools for structured thinking.</p>
              <p className="text-xl font-bold">$9 / month</p>
            </div>

            <div className="p-6 bg-white text-black rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-2">Pro</h2>
              <p className="mb-4">Advanced cognitive OS features.</p>
              <p className="text-xl font-bold">$29 / month</p>
            </div>

            <div className="p-6 bg-white text-black rounded-xl shadow">
              <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
              <p className="mb-4">Full system integration and support.</p>
              <p className="text-xl font-bold">Custom</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
