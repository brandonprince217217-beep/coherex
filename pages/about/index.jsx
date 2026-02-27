import Head from "next/head";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Coherex</title>
      </Head>

      <main className="about-root">
        <section className="about-hero">
          <h1>Understand your mind. Build your clarity.</h1>
          <p>
            Coherex is a next-generation cognitive operating system that reveals
            the deeper structure behind your thoughts, beliefs, and emotional
            signals—so you can make decisions with intention instead of
            uncertainty.
          </p>

          <div className="about-video-wrapper">
            <div className="about-video-placeholder">
              <span>90-second Coherex overview video</span>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>The Coherex perspective</h2>
          <p>
            Your thoughts, emotions, and decisions follow patterns. They&apos;re
            shaped by beliefs, experiences, and signals you may not always
            notice. Coherex is designed to help you see those patterns clearly,
            so you can make choices with confidence instead of uncertainty.
          </p>
          <p>
            When you express a thought, Coherex breaks it down into meaningful
            components—belief type, emotional charge, hidden assumptions,
            contradictions, core needs, and more. It doesn&apos;t just respond.
            It interprets. It helps you understand not just what you think, but
            why you think it.
          </p>
        </section>

        <section className="about-section">
          <h2>Our mission</h2>
          <p>
            Coherex exists to help you understand your mind with clarity and
            precision. We believe that self-awareness is not a mystery—it&apos;s
            a skill. By revealing the structure behind your thoughts and
            emotions, Coherex gives you tools to navigate life with confidence,
            intention, and insight.
          </p>
        </section>

        <section className="about-section">
          <h2>Our vision</h2>
          <p>
            We envision a world where every person has access to a cognitive
            operating system—a companion that helps them understand their
            patterns, challenge their assumptions, and build a more aligned
            version of themselves. Coherex is the first step toward that future.
          </p>
        </section>

        <section className="about-section">
          <h2>Our values</h2>
          <ul className="about-values">
            <li>
              <strong>Clarity:</strong> Understanding begins with seeing things
              as they are.
            </li>
            <li>
              <strong>Agency:</strong> You deserve tools that help you take
              control of your thinking.
            </li>
            <li>
              <strong>Insight:</strong> The mind has structure, and structure
              can be understood.
            </li>
            <li>
              <strong>Integrity:</strong> Your data, your privacy, your growth.
            </li>
            <li>
              <strong>Exploration:</strong> Curiosity drives transformation.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Why Coherex exists</h2>
          <p>
            Coherex was created to close the gap between what you feel and what
            you understand. Traditional tools help you organize your tasks.
            Coherex helps you organize your mind. By analyzing the deeper layers
            behind your thoughts—belief type, emotional charge, hidden
            assumptions, contradictions, core needs—the system reveals what&apos;s
            really driving your decisions.
          </p>
        </section>

        <section className="about-section about-founders">
          <p>
            Coherex is crafted as a living cognitive universe, architected by{" "}
            <strong>Brandon and Denise Prince</strong> with a single intention:
            to give you a clearer relationship with your own mind.
          </p>
        </section>
      </main>
    </>
  );
}
