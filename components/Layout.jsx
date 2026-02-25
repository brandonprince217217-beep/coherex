export default function Layout({ children }) {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Inter, sans-serif"
    }}>
      
      {/* Header */}
      <header style={{
        padding: "20px 40px",
        borderBottom: "1px solid #222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Coherex</h2>

        <nav style={{ display: "flex", gap: "24px" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a>
          <a href="/about" style={{ color: "white", textDecoration: "none" }}>About</a>
          <a href="/pricing" style={{ color: "white", textDecoration: "none" }}>Pricing</a>
          <a href="/demo" style={{ color: "white", textDecoration: "none" }}>Demo</a>
        </nav>
      </header>

      {/* Page Content */}
      <main style={{ padding: "40px" }}>
        {children}
      </main>

    </div>
  );
}
