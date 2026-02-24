export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Intelligence Level</h1>
        <p className="text-gray-400 text-lg">
          Start free. Upgrade when you’re ready for deeper clarity.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* Basic */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-[#0d0d0d]">
          <h2 className="text-2xl font-semibold mb-2">Coherex Basic</h2>
          <p className="text-gray-400 mb-6">Free forever</p>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>• 1 Belief Map</li>
            <li>• 1 Contradiction Scan</li>
            <li>• Basic Insight Summary</li>
            <li>• Light Mode</li>
            <li>• No Export</li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-white text-black font-semibold">
            Start Free
          </button>
        </div>

        {/* Pro */}
        <div className="border border-gray-700 rounded-2xl p-8 bg-[#111] shadow-xl shadow-blue-500/10">
          <h2 className="text-2xl font-semibold mb-2">Coherex Pro</h2>
          <p className="text-gray-400 mb-6">$4.99 / month</p>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>• Unlimited Belief Maps</li>
            <li>• Unlimited Contradiction Scans</li>
            <li>• Deep Insight Engine</li>
            <li>• Timeline & History</li>
            <li>• Export to PDF / Text</li>
            <li>• Custom Themes</li>
            <li>• Priority Processing</li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold">
            Upgrade to Pro
          </button>
        </div>

        {/* Ultra */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-[#0d0d0d]">
          <h2 className="text-2xl font-semibold mb-2">Coherex Ultra</h2>
          <p className="text-gray-400 mb-6">$9.99 / month</p>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>• Everything in Pro</li>
            <li>• Advanced Cognitive Models</li>
            <li>• Multi‑Map Linking</li>
            <li>• Identity Graph</li>
            <li>• Long‑Term Pattern Detection</li>
            <li>• Offline Mode</li>
            <li>• Custom AI Personas</li>
          </ul>

          <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold">
            Go Ultra
          </button>
        </div>
      </div>

      {/* Lifetime */}
      <div className="max-w-3xl mx-auto mt-20 text-center border border-gray-800 rounded-2xl p-10 bg-[#0d0d0d]">
        <h2 className="text-3xl font-semibold mb-2">Lifetime Access</h2>
        <p className="text-gray-400 mb-6">$149 one‑time</p>
        <p className="text-gray-300 mb-8">
          Own the entire cognitive OS forever. No subscriptions. No limits.
        </p>

        <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold">
          Unlock Lifetime
        </button>
      </div>
    </div>
  );
}
