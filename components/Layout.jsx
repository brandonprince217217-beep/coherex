import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import BrainBackground from './BrainBackground';

const SpaceBackground = dynamic(() => import('./SpaceBackground'), { ssr: false });

export default function Layout({ children }) {
  const router = useRouter();

  // Only show BrainBackground on homepage
  const showBrain = router.pathname === "/";

  return (
    <>
      {/* Safe everywhere */}
      <SpaceBackground />

      {/* Only homepage gets the 3D brain */}
      {showBrain && <BrainBackground />}

      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          zIndex: 2,
        }}
      >
        <Header />

        <main style={{ paddingTop: '80px' }}>
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}
