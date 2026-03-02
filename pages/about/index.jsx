import Layout from '../../components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="about-root">
        <div className="about-hero">
          <h1>About Coherex</h1>
          <p>
            Coherex is a cognitive operating system designed to reveal the structure
            behind your thinking — beliefs, contradictions, emotional patterns, and
            the deeper architecture of meaning.
          </p>
        </div>

        <div className="about-section">
          <h2>What is Coherex?</h2>
          <p>
            Coherex is a next-generation cognitive engine that maps the hidden
            architecture of your thinking. It surfaces beliefs, contradictions,
            emotional charges, and the deeper logic of your internal world.
          </p>
        </div>

        <div className="about-section">
          <h2>Architecture</h2>
          <p>
            At its core, Coherex is a cognitive engine that analyzes your
            statements, identifies hidden patterns, and generates a clear model
            of your internal logic. Built on a layered system of belief mapping,
            emotional parsing, and contradiction detection.
          </p>
        </div>

        <div className="about-section">
          <h2>Values</h2>
          <ul className="about-values">
            <li>Clarity over complexity — make the invisible visible</li>
            <li>Precision in language — words shape thought</li>
            <li>Radical honesty — surface contradictions without judgment</li>
            <li>Human-centered design — tools that serve your growth</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>The Team</h2>
          <div className="about-founders">
            <p>
              <strong>Brandon Prince</strong> — Systems architect focused on building
              tools that turn complexity into clarity. Creator and lead developer
              of Coherex.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
