<p>TEST LINE -- Brandon was here</p>
 import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Coherex -- Cognitive OS</title>
        <meta
          name="description"
          content="Coherex helps you map beliefs, contradictions, and meaning with clarity."
        />
      </Head>

      <main className="page-container">

        {/* HERO */}
        <section className="hero">
          <h1 className="hero-title">Coherex</h1>
          <p className="hero-subtitle">
            A cognitive OS for understanding how your mind fits together.
          </p>
        </section>

        {/* SECTION 1 */}
        <section className="section">
          <h2 className="section-title">Map Your Beliefs</h2>
          <p className="section-text">
            Coherex helps you capture statements, assumptions, and ideas -- then
            organizes them into a structured worldview model.
          </p>
        </section>

        {/* SECTION 2 */}
        <section className="section">
          <h2 className="section-title">Detect Contradictions</h2>
          <p className="section-text">
            The system automatically identifies conflicts, tensions, and logical
            inconsistencies across your beliefs.
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="section">
          <h2 className="section-title">See the Bigger Picture</h2>
          <p className="section-text">
            Visualize how your ideas connect, evolve, and influence each other
            over time.
          </p>
        </section>

      </main>
    </>
  );
}
