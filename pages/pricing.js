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
           
