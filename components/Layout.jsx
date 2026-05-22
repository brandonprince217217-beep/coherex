import React from "react";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "rgba(0,0,0,0.4)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <Link href="/" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
          Coherex
        </Link>

        <nav style={{ display: "flex", gap: "20px" }}>
          <Link href="/" className="footer-link">
            Home
          </Link>
          <Link href="/about" className="footer-link">
            About
          </Link>
          <Link href="/chat" className="footer-link">
            Chat
          </Link>
          <Link href="/search?q=coherex" className="footer-link">
            Search
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main style={{ flex: 1, paddingTop: "80px" }}>{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-logo">CX</div>
            <div className="footer-tagline">Cognitive Clarity Engine</div>
          </div>

          <div className="footer-right">
            <Link href="/about" className="footer-link">
              About
            </Link>
            <Link href="/chat" className="footer-link">
              Chat
            </Link>
            <Link href="/search?q=coherex" className="footer-link">
              Search
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
