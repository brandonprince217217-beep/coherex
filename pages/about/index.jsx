import React from "react";

export default function AboutPage() {
  return (
    <div className="about-root" style={{ background: "black", color: "white", minHeight: "100vh" }}>
      
      {/* TITLE WITH GLOW */}
      <div className="about-hero" style={{ textAlign: "center", padding: "60px 20px 20px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            marginBottom: "20px",
            textShadow: "0 0 18px rgba(255,255,255,0.35), 0 0 32px rgba(255,255,255,0.15)"
          }}
        >
          About Coherex
        </h1>

        <p style={{ maxWidth: "850px", margin: "0 auto", lineHeight: "1.7", fontSize: "1.15rem" }}>
          Coherex is a cognitive operating system built on a simple but radical idea:
          the mind has structure, and that structure can be mapped, understood, and
          aligned with reality. Every belief has a shape. Every contradiction has a
          location. Every worldview has an architecture beneath it. Coherex exists to
          reveal that architecture.
        </p>
      </div>

      {/* VIDEO SECTION */}
      <div className="about-video-wrapper" style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <video
          src="/coherex-about.mp4"
          controls
          style={{
            width: "90%",
            maxWidth: "900px",
            borderRadius: "12px",
            boxShadow: "0 0 25px rgba(255,255,255,0.15)"
          }}
        />
      </div>

      {/* ORIGINS */}
      <div className="about-section" style={{ maxWidth: "900px", margin: "60px auto 0", padding: "0 20px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>Origins and Vision</h2>
        <p style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
          Coherex was created by Brandon and Denise Prince, whose shared fascination
          with clarity, cognitive structure, and the mechanics of meaning shaped the
          foundation of the system. Their work blends systems design, psychology, and
          philosophy into an environment where thinking becomes visible and navigable.
          The project grew from a single belief: when you understand the structure of
          your mind, you understand the structure of your reality.
        </p>
      </div>

      {/* WHY COHEREX EXISTS */}
      <div className="about-section" style={{ maxWidth: "900px", margin: "50px auto 0", padding: "0 20px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>Why Coherex Exists</h2>
        <p style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
          Modern tools are built to capture attention. Coherex is built to return it.
          The world is noisy, fast, and emotionally overwhelming. Clear thinking
          requires a space where your mind can be seen as a system — where ideas can
          be examined, contradictions surfaced, and meaning made visible.
        </p>
        <p style={{ lineHeight: "1.7", fontSize: "1.1rem", marginTop: "15px" }}>
          Coherex provides that space. It is engineered for deep thinking, bold
          creation, structural clarity, psychological precision, and
          reality‑aligned self‑understanding. This isn’t self‑help. This is
          self‑architecture.
        </p>
      </div>

      {/* MISSION */}
      <div className="about-section" style={{ maxWidth: "900px", margin: "50px auto 60px", padding: "0 20px" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "15px" }}>The Mission</h2>
        <p style={{ lineHeight: "1.7", fontSize: "1.1rem" }}>
          Coherex is designed for thinkers, creators, analysts, and anyone who wants
          to understand how their mind fits together — not as opinions, but as a
          coherent structure. The mission is straightforward: to give people a clear,
          navigable model of their own mind — and the tools to align it with reality.
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", paddingBottom: "40px", opacity: 0.6 }}>
        Coherex © {new Date().getFullYear()}
      </div>
    </div>
  );
}
