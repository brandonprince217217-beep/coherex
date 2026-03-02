export default function About() {
  return (
    <div
      className="min-h-screen text-slate-100 px-6 py-16 flex flex-col items-center"
      style={{
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 className="text-4xl font-bold mb-4 tracking-tight">
        About Coherex
      </h1>

      <p className="text-lg text-slate-400 max-w-2xl text-center mb-12 leading-relaxed">
        Coherex is a cognitive operating system designed to reveal the structure
        behind your thinking — beliefs, contradictions, emotional patterns, and
        the deeper architecture of meaning.
      </p>

      <div className="max-w-3xl space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-2">The Vision</h2>
          <p className="text-slate-400 leading-relaxed">
            Human thinking is powerful but unstructured. Coherex brings order to
            that complexity by mapping the relationships between your beliefs,
            assumptions, and emotional drivers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">The Architecture</h2>
          <p className="text-slate-400 leading-relaxed">
            At its core, Coherex is a cognitive engine that analyzes your
            statements, identifies hidden patterns, and generates a clear model
            of your internal logic.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">The Creator</h2>
          <p className="text-slate-400 leading-relaxed">
            Coherex was created by <strong>Brandon Prince</strong>, a systems
            architect focused on building tools that turn complexity into
            clarity.
          </p>
        </section>
      </div>
    </div>
  );
}
