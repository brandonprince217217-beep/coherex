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
          paddingTop: '160px', // pushes content below the header
          paddingBottom: '60px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          About the Developers
        </h1>

        <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
          Coherex is created and shaped by <strong>Brandon Prince</strong> and
          <strong> Denise Prince</strong>, a partnership built on clarity,
          intelligence, and a shared vision for a cognitive operating system
          that feels alive, adaptive, and deeply personal.
        </p>

        <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '20px auto' }}>
          Together, they bring intention and precision to every layer of the
          system — from the cosmic environment to the HoloCore engine — crafting
          a digital space designed to enhance focus, creativity, and presence.
        </p>

        <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '20px auto' }}>
          Coherex represents a unified pursuit: building a living cognitive
          universe where users can think, create, and navigate with power and
          clarity.
        </p>
      </div>
    </Layout>
  );
}
