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
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '40px' }}>
          Pricing
        </h1>

        {/* PLAN 1 */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Basic Plan</h2>
          <p style={{ marginBottom: '20px' }}>$10 / month</p>

          <a
            href="https://buy.stripe.com/7sYdR14bX98ueSlc05asg02"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#0d6efd',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Subscribe
          </a>
        </div>

        {/* PLAN 2 */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Pro Plan</h2>
          <p style={{ marginBottom: '20px' }}>$20 / month</p>

          <a
            href="https://buy.stripe.com/8x214f23P3Oa25z3tzasg00"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#198754',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Subscribe
          </a>
        </div>

        {/* PLAN 3 */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Ultimate Plan</h2>
          <p style={{ marginBottom: '20px' }}>$50 / month</p>

          <a
            href="https://buy.stripe.com/bJedR15g1doKeSl2pvasg01"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#dc3545',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Subscribe
          </a>
        </div>
      </div>
    </Layout>
  );
}
