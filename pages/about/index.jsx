import React from "react";

export default function AboutPage() {
  return (
    <div className="about-root">
      {/* HERO */}
      <div className="about-hero">
        <h1>About Coherex</h1>
        <p>
          Coherex is a cognitive operating system built on a simple but radical
          idea: the mind has structure, and that structure can be mapped,
          understood, and aligned with reality. Every belief has a shape. Every
          contradiction has a location. Every worldview has an architecture
          beneath it. Coherex exists to reveal that architecture.
        </p>
      </div>

      {/* VIDEO SPOT */}
      <div className="about-video-wrapper">
        <video
          src="/coherex-about.mp4"
          controls
          className="about-video-placeholder"
        />
      </div>

      {/* ORIGINS */}
      <div className="about-section">
        <h2>Origins and Vision</h2>
        <p>
          Coherex was created by Brandon and Denise Prince, whose shared
          fascination with clarity, cognitive structure, and the mechanics of
          meaning shaped the foundation of the system. Their work blends systems
          design, psychology, and philosophy into an environment where thinking
          becomes visible and navigable. The project grew from a single belief:
          when you understand the structure of your mind, you understand the
          structure of your reality.
        </p>
      </div>

      {/* WHY COHEREX EXISTS */}
      <div className="about-section">
        <h2>Why Coherex Exists</h2>
        <p>
          Modern tools are built to capture attention. Coherex is built to
          return it. The world is noisy, fast, and emotionally overwhelming.
          Clear thinking requires a space where your mind can be seen as a
          system — where ideas can be examined, contradictions surfaced, and
          meaning made visible.
        </p>
        <p>
          Coherex provides that space. It is engineered for deep thinking, bold
          creation, structural clarity, psychological precision, and
          reality‑aligned self‑understanding. This isn’t self‑help. This is
          self‑architecture.
        </p>
      </div>

      {/* MISSION */}
      <div className="about-section">
        <h2>The Mission</h2>
        <p>
          Coherex is designed for thinkers, creators, analysts, and anyone who
          wants to understand how their mind fits together — not as opinions,
          but as a coherent structure. The mission is straightforward: to give
          people a clear, navigable model of their own mind — and the tools to
          align it with reality.
        </p>
      </div>

      {/* FOOTER */}
      <div className="about-founders">
        Coherex © {new Date().getFullYear()}
      </div>
    </div>
  );
}
