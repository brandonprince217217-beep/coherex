import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import BrainBackground from './BrainBackground';

// Optionally: keep SpaceBackground for fallback/cosmic vibes
// const SpaceBackground = dynamic(() => import('./SpaceBackground'), { ssr: false });

export default function Layout({ children }) {
  return (
    <>
      <BrainBackground />
      {/* <SpaceBackground /> */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        minHeight: '100vh', 
        overflow: 'hidden',
        zIndex: 1,
      }}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
