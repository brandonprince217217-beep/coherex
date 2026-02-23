import Head from 'next/head';
import '../../styles/sections.css';

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
