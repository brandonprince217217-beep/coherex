import Layout from '../components/Layout';

export default function Pricing() {
  return (
    <Layout>
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
        <h1>Pricing Page</h1>
        <p>This is the Pricing page.</p>
      </div>
    </Layout>
  );
}
