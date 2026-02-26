import Link from 'next/link';

export default function Header() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        zIndex: 9999,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <nav
        style={{
          display: 'flex',
          gap: '40px',
          fontSize: '1.2rem'
        }}
      >
        <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>

        <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>
          About
        </Link>

        <Link href="/pricing" style={{ color: 'white', textDecoration: 'none' }}>
          Pricing
        </Link>
      </nav>
    </header>
  );
}
