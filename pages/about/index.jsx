import Layout from '../../components/Layout';

export default function About() {
  return (
    <Layout>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          backgroundColor: 'black',
          overflow: 'hidden',
          zIndex: 5,
          color: 'white',
          paddingTop: '150px',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
          About the Developer
        </h1>

        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          My name is <strong>Brandon Prince</strong>. I am the creator and
          developer of <strong>Coherex</strong>, a cognitive operating system
          designed to merge clarity, intelligence, and immersive digital
          experience into one unified environment.
        </p>

        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '20px auto' }}>
          Coherex is built to evolve into a living, adaptive system — a place
          where users can think, create, and navigate their world with precision
          and presence.
        </p>

        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '20px auto' }}>
          Every layer of Coherex — from the cosmic environment to the HoloCore —
          is crafted to feel alive, intelligent, and deeply personal.
        </p>
      </div>
    </Layout>
  );
}
