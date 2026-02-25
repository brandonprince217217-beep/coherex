export default function Layout({ children }) {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Inter, sans-serif",
      display: "flex"
    }}>

      {/* LEFT SIDEBAR NAV */}
      <nav style={{
        width: "200px",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "26px",
        borderRight: "1px solid #222"
      }}>
        <a href="/" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "26px",
          fontWeight: "600"
        }}>Home</a>

        <a href="/about" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "26px",
          fontWeight: "600"
        }}>About</a>

        <a href="/pricing" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "26px",
          fontWeight: "600"
        }}>Pricing</a>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "40px" }}>
        {children}
      </main>

    </div>
  );
}
