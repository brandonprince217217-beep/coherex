export default function Layout({ children }) {
  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Inter, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>

      {/* CENTERED NAV */}
      <nav style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        marginBottom: "60px"
      }}>
        <a href="/" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "40px",
          fontWeight: "700",
          borderBottom: "2px solid white",
          paddingBottom: "8px"
        }}>Home</a>

        <a href="/about" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "40px",
          fontWeight: "700",
          borderBottom: "2px solid white",
          paddingBottom: "8px"
        }}>About</a>

        <a href="/pricing" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "40px",
          fontWeight: "700",
          borderBottom: "2px solid white",
          paddingBottom: "8px"
        }}>Pricing</a>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ width: "100%", maxWidth: "900px", padding: "20px" }}>
        {children}
      </main>

    </div>
  );
}
