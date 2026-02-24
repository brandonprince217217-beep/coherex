import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
<button className="demo-button" onClick={() => setShowDemo(true)}>
  Try Demo
</button>
