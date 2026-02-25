export default function Pricing() {
  return (
    <div
      style={{
        textAlign: "center",
        color: "white",
        maxWidth: "900px",
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
        Choose the level of clarity, structure, and cognitive precision you want.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "center"
        }}
      >

        {/* BASIC / PREMIUM */}
        <div className="card">
          <h2 className="title">Basic</h2>
          <p className="desc">Essential clarity tools for everyday structure.</p>
          <p className="price">$4.99 / month</p>

          <a
            href="https://buy.stripe.com/14A3cn4bXbgCh0t2pvasg04"
            className="button"
          >
            Get Basic
          </a>
        </div>

        {/* PRO / ULTRA — MOST POPULAR */}
        <div className="card popular">
          <div className="badge">Most Popular</div>

          <h2 className="title">Pro</h2>
          <p className="desc">Advanced cognitive tools for deeper clarity and precision.</p>
          <p className="price">$9.99 / month</p>

          <a
            href="https://buy.stripe.com/bJedR15g1doKeSl2pvasg01"
            className="button"
          >
            Get Pro
          </a>
        </div>

        {/* LIFETIME */}
        <div className="card">
          <h2 className="title">Lifetime</h2>
          <p className="desc">One payment. Full access. Forever.</p>
          <p className="price">$149 one‑time</p>

          <a
            href="https://buy.stripe.com/7sYdR14bX98ueSlc05asg02"
            className="button"
          >
            Get Lifetime
          </a>
        </div>
      </div>

      <style jsx>{`
        .card {
          width: 100%;
          max-width: 520px;
          padding: 32px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          background-clip: padding-box;
          position: relative;
          transition: transform 200ms ease, box-shadow 200ms ease, border 200ms ease;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 14px;
          padding: 2px;
          background: linear-gradient(135deg, #6a5acd, #8a2be2, #00eaff);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 0 25px rgba(138, 43, 226, 0.4);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .popular {
          background: rgba(255, 255, 255, 0.12);
          border-color: #8a2be2;
          box-shadow: 0 0 25px rgba(138, 43, 226, 0.5);
        }

        .badge {
          position: absolute;
          top: -14px;
          right: 50%;
          transform: translateX(50%);
          background: linear-gradient(135deg, #8a2be2, #6a5acd);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 700;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .desc {
          font-size: 18px;
          opacity: 0.8;
          margin-bottom: 20px;
        }

        .price {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .button {
          display: inline-block;
          padding: 12px 26px;
          background: white;
          color: black;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: background 200ms ease, transform 200ms ease;
        }

        .button:hover {
          background: #dcdcff;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
