import Link from 'next/link';
import Layout from '../components/Layout';

export default function Pricing() {
  return (
    <Layout>
      <div style={{ minHeight: '100vh', color: '#f1f5f9', padding: '80px 24px 48px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Pricing</h1>
        <p style={{ opacity: 0.6, marginBottom: '40px', fontSize: '1.05rem' }}>
          Choose the plan that fits your cognitive workflow.
        </p>

        <div style={{ display: 'grid', gap: '24px', maxWidth: '480px' }}>
          <div style={{
            border: '1px solid rgba(0,140,255,0.4)',
            borderRadius: '14px',
            padding: '32px',
            background: 'rgba(0,0,0,0.55)',
            boxShadow: '0 0 32px rgba(0,140,255,0.12)',
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Coherex</h2>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(0,180,255,0.9)', marginBottom: '16px' }}>
              $4.99 <span style={{ fontSize: '1rem', opacity: 0.6 }}>/ month</span>
            </p>
            <p style={{ opacity: 0.65, marginBottom: '20px' }}>Full cognitive engine access for deep work.</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '28px', lineHeight: 1.8, opacity: 0.8 }}>
              <li>Unlimited cognitive queries</li>
              <li>Full contradiction &amp; hidden assumption detection</li>
              <li>Advanced rewrite generation</li>
              <li>Generative next-question engine</li>
              <li>Priority processing &amp; API access</li>
            </ul>
            <Link href="/chat" style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: '8px',
              background: 'rgba(0,140,255,0.85)',
              border: '1px solid rgba(0,140,255,0.9)',
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
