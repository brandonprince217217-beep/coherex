import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Coherex</title>
        <meta name="description" content="Coherex — Cognitive OS for structured thinking and belief mapping." />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>Coherex</h1>
        <p style={styles.subtitle}>
          A cognitive operating system for mapping beliefs, contradictions, and meaning.
        </p>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.25rem",
    maxWidth: "600px",
    lineHeight: 1.5,
    opacity: 0.8,
  },
};
