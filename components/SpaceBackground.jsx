export default function SpaceBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(0,20,60,0.8) 0%, rgba(2,6,23,1) 60%)',
      backgroundColor: '#020617',
    }} />
  );
}
