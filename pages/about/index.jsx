import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About — Coherex</title>
        <meta
          name="description"
          content="The purpose and architecture behind Coherex, a cognitive OS for mapping beliefs, contradictions, and meaning."
        />
      </Head>

      <main className="page-container">

        <section className="page-hero">
          <h1>About Coherex</h1>
          <p className="page-subtitle">
            A new way to understand how your mind fits together.
          </p>
        </section>

        <section className="page-section">
          <h2>The Problem</h2>
          <p>
            Human thinking is powerful, but unstructured. Beliefs accumulate without a map.
            Contradictions hide in plain sight. Meaning becomes scattered across experiences,
            memories, and assumptions. Most tools capture thoughts — none reveal the system
            behind them.
          </p>
        </section>

        <section className="page-section">
          <h2>The Insight</h2>
          <p>
            Your worldview is not a list of opinions. It is a network. A structure. A dynamic
            system of relationships. Once you can see that system clearly, you can understand
            yourself with a level of precision that was previously impossible.
          </p>
        </section>

        <section className="page-section">
          <h2>The Solution</h2>
          <p>
            Coherex is a cognitive OS designed to map that system. It analyzes your statements,
            identifies their connections, detects contradictions, and builds a coherent model
            of your beliefs. The result is not self‑help. It is self‑understanding.
          </p>
        </section>

        <section className="page-section">
          <h2>The Goal</h2>
          <p>
            To give every person a clear, navigable representation of their own mind — not as
            noise, but as structure. Not as fragments, but as coherence.
          </p>
        </section>

      </main>
    </>
  );
}
