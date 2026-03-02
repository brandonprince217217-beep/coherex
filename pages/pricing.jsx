export default function Pricing() {
  return (
    <div className="min-h-screen text-slate-100 px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="text-slate-400 mb-8">
        Choose the plan that fits your cognitive workflow.
      </p>

      <div className="grid gap-6 max-w-3xl">
        <div className="border border-slate-700 rounded-xl p-6 bg-black/40">
          <h2 className="text-xl font-semibold mb-2">Free Tier</h2>
          <p className="text-slate-400 mb-4">Basic cognitive analysis.</p>
        </div>

        <div className="border border-slate-700 rounded-xl p-6 bg-black/40">
          <h2 className="text-xl font-semibold mb-2">Pro</h2>
          <p className="text-slate-400 mb-4">Full cognitive engine access.</p>
        </div>
      </div>
    </div>
  );
}
