import Head from 'next/head';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Coherex — A Cognitive OS</title>
        <meta
          name="description"
          content="A cognitive OS for mapping beliefs, contradictions, and meaning."
        />
      </Head>

      <main className="home-container">

        {/* HERO */}
        <section className="hero">
          <h1>Coherex</h1>
          <p className="hero-subtitle">
            A cognitive OS for mapping beliefs, contradictions, and meaning.
          </p>
        </section>

        {/* PHILOSOPHY */}
        <section className="section philosophy">
          <h2>Understand Your Mind as a System</h2>
          <p>
            Every belief forms a structure. Every contradiction reveals a fault line.
            Coherex gives you a clear, navigable model of how your worldview fits together —
            not as opinions, but as a coherent architecture.
          </p>
        </section>

        {/* PRODUCT */}
        <section className="section product">
          <h2>The Engine Behind Coherence</h2>
          <p>
            Coherex analyzes your statements, maps their relationships, detects contradictions,
            and builds a dynamic model of your worldview. It is not a journal. It is not a
            chatbot. It is a cognitive instrument.
          </p>
        </section>

        {/* CLARITY */}
        <section className="section clarity">
          <h2>Precision Over Noise</h2>
          <p>
            No feeds. No distractions. No algorithms shaping your attention.
            Just a clean, deterministic environment for thinking clearly.
          </p>
        </section>

        {/* CTA */}
        <section className="section cta">
          <h2>Coming Soon</h2>
          <p>
            Coherex is preparing for public release.  
            A new way to understand your mind is almost here.
          </p>
        </section>

      </main>
    </>
  );
}
