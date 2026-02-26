import Head from 'next/head';
import Constellation from '../components/Constellation';
import Vortex from '../components/Vortex';
import HoloCore from '../components/HoloCore';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Coherex</title>
        <meta name="description" content="Cognitive OS" />
      </Head>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'black'
        }}
      >
        {/* Background Constellation */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        >
          <Constellation />
        </div>

        {/* Vortex Layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2
          }}
        >
          <Vortex />
        </div>

        {/* HoloCore (center engine) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3
          }}
        >
          <HoloCore />
        </div>

        {/* Main Content */}
        <div
          style={{
            position: 'absolute',
            top: '70%',               // moved lower
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h1>Coherex Cognitive OS</h1>
          <p>Welcome to your cognitive engine.</p>

          <SearchBar />
        </div>
      </div>
    </Layout>
  );
}
