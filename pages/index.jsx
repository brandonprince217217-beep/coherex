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
        <section className="page-hero">
          <h1>Coherex</h1>
          <p className="page-subtitle">
            A cognitive OS for understanding how your mind fits together.
          </p>
        </section>
      </main>
    </>
  );
}
