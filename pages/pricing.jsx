export default function Pricing() {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1 style={{ fontSize: "48px", fontWeight: "700", marginBottom: "20px" }}>
        Pricing
      </h1>

      <p style={{ fontSize: "20px", opacity: 0.85, marginBottom: "40px" }}>
        Choose the plan that fits your clarity journey.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "center"
        }}
      >
        {/* PREMIUM */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>Premium</h2>
          <p style={{ opacity: 0.8, marginBottom: "20px" }}>
            Full access to the cognitive OS.
          </p>
          <a
            href="https://buy.stripe.com/8x214f23P3Oa25z3tzasg00"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "#ffffff",
              color: "#000",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "20px"
            }}
          >
            Get Premium
          </a>
        </div>

        {/* ULTRA */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>Ultra</h2>
          <p style={{ opacity: 0.8, marginBottom: "20px" }}>
            Everything in Premium + deeper tools.
          </p>
          <a
            href="https://buy.stripe.com/bJedR15g1doKeSl2pvasg01"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "#ffffff",
              color: "#000",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "20px"
            }}
          >
            Get Ultra
          </a>
        </div>

        {/* LIFETIME */}
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>Lifetime</h2>
          <p style={{ opacity: 0.8, marginBottom: "20px" }}>
            One payment. Lifetime access.
          </p>
          <a
            href="https://buy.stripe.com/7sYdR14bX98ueSlc05asg02"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: "#ffffff",
              color: "#000",
              borderRadius: "8px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "20px"
            }}
          >
            Get Lifetime
          </a>
        </div>
      </div>
    </div>
  );
}
