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
          zIndex: 5
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            zIndex: 20
          }}
        >
          <h1>About Page</h1>
          <p>This is the About page.</p>
        </div>
      </div>
    </Layout>
  );
}
