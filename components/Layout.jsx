export default function Layout({ children }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* CENTERED NAV */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "38px",
          marginBottom: "60px"
        }}
      >
        {[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Pricing", href: "/pricing" }
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-item"
            style={{
              position: "relative",
              color: "white",
              textDecoration: "none",
              fontSize: "42px",
              fontWeight: "700",
              paddingBottom: "6px",
              transition: "color 200ms ease"
            }}
          >
            {item.name}

            {/* Underline */}
            <span className="underline"></span>
          </a>
        ))}
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ width: "100%", maxWidth: "900px", padding: "20px" }}>
        {children}
      </main>

      {/* ANIMATIONS + EFFECTS */}
      <style jsx>{`
        .nav-item .underline {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 0%;
          height: 3px;
          background: white;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
          transition: width 200ms ease;
        }

        .nav-item:hover {
          color: #b3b3ff;
        }

        .nav-item:hover .underline {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
