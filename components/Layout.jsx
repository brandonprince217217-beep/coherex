export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", color: "white", fontFamily: "Inter, sans-serif" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "38px",
          padding: "40px 0"
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
              fontSize: "28px",
              fontWeight: "700",
              paddingBottom: "6px",
              transition: "color 200ms ease"
            }}
          >
            {item.name}
            <span className="underline"></span>
          </a>
        ))}
      </nav>

      <main style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {children}
      </main>

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
