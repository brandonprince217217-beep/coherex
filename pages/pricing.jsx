export default function Pricing() {
  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        lineHeight: "1.6",
        fontFamily: "Inter, sans-serif"
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: "800",
          marginBottom: "20px"
        }}
      >
        Pricing
      </h1>

      <p
        style={{
          fontSize: "20px",
          opacity: 0.85,
          marginBottom: "40px"
        }}
      >
        Coherex is designed to give you clarity, structure, and a smarter way to
        interact with your mind. Choose the plan that fits the level of depth and
        precision you want in your daily thinking.
      </p>

      {/* Pricing Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center"
        }}
      >
        {/* Basic Plan */}
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255,255,255,0.05)"
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>
            Basic
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.8, marginBottom: "20px" }}>
            Essential clarity tools for everyday structure.
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>
            $4.99 / month
          </p>
          <a
            href="#"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "white",
              color: "black",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Get Basic
          </a>
        </div>

        {/* Pro Plan */}
        <div
          style={{
            border: "1px solid #555",
            borderRadius: "12px",
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255,255,255,0.08)"
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>
            Pro
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.8, marginBottom: "20px" }}>
            Advanced cognitive tools for deeper clarity and precision.
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>
            $9.99 / month
          </p>
          <a
            href="#"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "white",
              color: "black",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Get Pro
          </a>
        </div>

        {/* Lifetime Plan */}
        <div
          style={{
            border: "1px solid #777",
            borderRadius: "12px",
            padding: "30px",
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255,255,255,0.12)"
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px" }}>
            Lifetime
          </h2>
          <p style={{ fontSize: "18px", opacity: 0.8, marginBottom: "20px" }}>
            One payment. Full access. Forever.
          </p>
          <p style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>
            $49.99 one‑time
          </p>
          <a
            href="#"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "white",
              color: "black",
              borderRadius: "8px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Get Lifetime
          </a>
        </div>
      </div>
    </div>
  );
}
