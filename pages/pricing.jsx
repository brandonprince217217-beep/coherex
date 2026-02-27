import Layout from '../components/Layout';

export default function Pricing() {
  return (
    <Layout>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'black',
          color: 'white',
          paddingTop: '160px',
          paddingBottom: '60px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <h1 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>
          Pricing
        </h1>

        <p style={{ opacity: 0.7, marginBottom: '40px' }}>
          Unlock unlimited access to the Coherex Engine.
        </p>

        <div
          style={{
            marginInline: 'auto',
            maxWidth: '360px',
            padding: '24px 22px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 140, 255, 0.7)',
            background:
              'radial-gradient(circle at top left, rgba(0,140,255,0.25), rgba(0,0,0,0.9))',
            boxShadow: '0 0 24px rgba(0, 140, 255, 0.6)',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
            Basic Access
          </div>

          <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
            $4.99<span style={{ fontSize: '0.9rem', opacity: 0.7 }}> / month</span>
          </div>

          <ul style={{ paddingLeft: '18px', marginBottom: '18px' }}>
            <li style={{ marginBottom: '6px' }}>Unlimited searches</li>
            <li style={{ marginBottom: '6px' }}>Full Coherex Engine access</li>
            <li style={{ marginBottom: '6px' }}>Mind‑structure analysis</li>
            <li style={{ marginBottom: '6px' }}>Contradiction detection</li>
            <li style={{ marginBottom: '6px' }}>Implication mapping</li>
          </ul>

          <a
            href="https://buy.stripe.com/14A3cn4bXbgCh0t2pvasg04"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'rgba(0, 140, 255, 0.9)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '500',
              boxShadow: '0 0 16px rgba(0, 140, 255, 0.7)'
            }}
          >
            Get Unlimited Access
          </a>
        </div>
      </div>
    </Layout>
  );
}
