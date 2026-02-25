export default function Pricing() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Pricing</h1>

      <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
        Choose the plan that fits your workflow. All plans include access to the
        Coherex cognitive OS demo and core features.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Free Plan */}
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Free</h2>
          <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
            Explore the basics of Coherex.
          </p>
          <ul style={{ marginBottom: "20px" }}>
            <li>Access to demo</li>
            <li>Basic cognitive tools</li>
            <li>Limited usage</li>
          </ul>
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#444",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "24px",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Pro</h2>
          <p style={{ fontSize: "1rem", marginBottom: "20px" }}>
            Unlock the full cognitive OS.
          </p>
          <ul style={{ marginBottom: "20px" }}>
            <li>Unlimited usage</li>
            <li>Advanced cognitive tools</li>
            <li>Priority access</li>
          </ul>
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#6a4dfc",
              color: "white",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
