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
        <h1 style={{ fontSize: '2.4rem', marginBottom: '50px', letterSpacing: '1px' }}>
          Choose Your Plan
        </h1>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* BASIC PLAN — MOST POPULAR */}
          <div
            style={{
              marginBottom: '60px',
              padding: '30px',
              borderRadius: '14px',
              border: '2px solid rgba(0, 140, 255, 0.7)',
              boxShadow: '0 0 25px rgba(0, 140, 255, 0.5)',
              position: 'relative',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 140, 255, 0.9)';
              e.currentTarget.style.border = '2px solid rgba(0, 140, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 140, 255, 0.5)';
              e.currentTarget.style.border = '2px solid rgba(0, 140, 255, 0.7)';
            }}
          >
            {/* MOST POPULAR BADGE */}
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #00aaff, #66d0ff)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'black',
                letterSpacing: '0.5px',
                boxShadow: '0 0 12px rgba(0, 140, 255, 0.8)'
              }}
            >
              MOST POPULAR
            </div>

            <h2 style={{ fontSize: '1.7rem', marginBottom: '10px' }}>Basic</h2>
            <p style={{ marginBottom: '25px', opacity: 0.8 }}>$4.99 / month</p>

            <a
              href="https://buy.stripe.com/14A3cn4bXbgCh0t2pvasg04"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'rgba(0, 140, 255, 0.15)',
                border: '1px solid rgba(0, 140, 255, 0.6)',
                borderRadius: '8px',
                color: '#00aaff',
                textDecoration: 'none',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
                boxShadow: '0 0 12px rgba(0, 140, 255, 0.5)',
                transition: '0.25s'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 22px rgba(0, 140, 255, 0.9)';
                e.target.style.background = 'rgba(0, 140, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 12px rgba(0, 140, 255, 0.5)';
                e.target.style.background = 'rgba(0, 140, 255, 0.15)';
              }}
            >
              Choose Basic
            </a>
          </div>

          {/* ULTRA PLAN */}
          <div
            style={{
              marginBottom: '60px',
              padding: '30px',
              borderRadius: '14px',
              border: '2px solid rgba(0, 255, 170, 0.7)',
              boxShadow: '0 0 25px rgba(0, 255, 170, 0.5)',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 255, 170, 0.9)';
              e.currentTarget.style.border = '2px solid rgba(0, 255, 170, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 170, 0.5)';
              e.currentTarget.style.border = '2px solid rgba(0, 255, 170, 0.7)';
            }}
          >
            <h2 style={{ fontSize: '1.7rem', marginBottom: '10px' }}>Ultra</h2>
            <p style={{ marginBottom: '25px', opacity: 0.8 }}>$9.99 / month</p>

            <a
              href="https://buy.stripe.com/bJedR15g1doKeSl2pvasg01"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'rgba(0, 255, 170, 0.15)',
                border: '1px solid rgba(0, 255, 170, 0.6)',
                borderRadius: '8px',
                color: '#00ffcc',
                textDecoration: 'none',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
                boxShadow: '0 0 12px rgba(0, 255, 170, 0.5)',
                transition: '0.25s'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 22px rgba(0, 255, 170, 0.9)';
                e.target.style.background = 'rgba(0, 255, 170, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 12px rgba(0, 255, 170, 0.5)';
                e.target.style.background = 'rgba(0, 255, 170, 0.15)';
              }}
            >
              Choose Ultra
            </a>
          </div>

          {/* LIFETIME PLAN */}
          <div
            style={{
              padding: '30px',
              borderRadius: '14px',
              border: '2px solid rgba(180, 90, 255, 0.7)',
              boxShadow: '0 0 25px rgba(180, 90, 255, 0.5)',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px rgba(180, 90, 255, 0.9)';
              e.currentTarget.style.border = '2px solid rgba(180, 90, 255, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px rgba(180, 90, 255, 0.5)';
              e.currentTarget.style.border = '2px solid rgba(180, 90, 255, 0.7)';
            }}
          >
            <h2 style={{ fontSize: '1.7rem', marginBottom: '10px' }}>Lifetime Access</h2>
            <p style={{ marginBottom: '25px', opacity: 0.8 }}>$149 one‑time</p>

            <a
              href="https://buy.stripe.com/7sYdR14bX98ueSlc05asg02"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'rgba(180, 90, 255, 0.15)',
                border: '1px solid rgba(180, 90, 255, 0.6)',
                borderRadius: '8px',
                color: '#b45aff',
                textDecoration: 'none',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
                boxShadow: '0 0 12px rgba(180, 90, 255, 0.5)',
                transition: '0.25s'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 0 22px rgba(180, 90, 255, 0.9)';
                e.target.style.background = 'rgba(180, 90, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 0 12px rgba(180, 90, 255, 0.5)';
                e.target.style.background = 'rgba(180, 90, 255, 0.15)';
              }}
            >
              Buy Lifetime
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
}
