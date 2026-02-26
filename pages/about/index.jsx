import Layout from '../../components/Layout';

export default function About() {
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
          fontFamily: 'Inter, sans-serif',
          animation: 'fadeIn 1.2s ease'
        }}
      >

        {/* Fade‑in animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <h1 style={{ fontSize: '2.4rem', marginBottom: '40px', letterSpacing: '1px' }}>
          About the Developers
        </h1>

        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.75,
            textAlign: 'left',
            opacity: 0.92,
            padding: '35px 40px',
            borderRadius: '14px',
            border: '2px solid rgba(0, 140, 255, 0.7)',
            boxShadow: '0 0 25px rgba(0, 140, 255, 0.5)',
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
          <p style={{ marginBottom: '22px' }}>
            Coherex is created by <strong>Brandon Prince</strong> and <strong>Denise Prince</strong>, 
            a builder–designer partnership focused on clarity, intelligence, and the future of human cognition. 
            Their work blends system architecture, psychology, and immersive digital design to create a platform 
            that feels alive, adaptive, and deeply intuitive.
          </p>

          <p style={{ marginBottom: '22px' }}>
            Brandon brings a precision‑driven approach to cognitive systems — designing structures that reduce 
            friction, sharpen thinking, and help people operate with more intention. Denise brings the emotional 
            intelligence, aesthetic clarity, and human‑centered design that makes Coherex feel warm, grounded, 
            and personal. Together, they build technology that respects how the mind actually works.
          </p>

          <p style={{ marginBottom: '22px' }}>
            Coherex is their shared mission: a cognitive environment engineered for people who think deeply, 
            create boldly, and want a space that elevates their mental clarity. Every layer — from the interface 
            to the underlying logic — is crafted with intention, intelligence, and a commitment to helping people 
            navigate life with more focus and power.
          </p>

          <p>
            Coherex isn’t just another app. It’s a new way of using your mind — a digital environment built for 
            clarity, creativity, and personal evolution.
          </p>
        </div>
      </div>
    </Layout>
  );
}
