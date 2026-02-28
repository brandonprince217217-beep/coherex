import '../styles/globals.css';
import '../styles/mind.css';
import Layout from '../components/Layout';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    let cleanup = () => {};
    import('../lib/mind/engine').then(({ initMindEngine }) => {
      cleanup = initMindEngine();
    });
    return () => cleanup();
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
