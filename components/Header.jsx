import Link from 'next/link';

export default function Header() {
  return (
    <nav
      style={{
        position: 'absolute',
        top: '25%',        // moved higher
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px',
        zIndex: 10
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: '48px',
          color: 'white',
          textDecoration: 'none'
        }}
      >
        Home
      </Link>

      <Link
        href="/about"
        style={{
          fontSize: '48px',
          color: 'white',
          textDecoration: 'none'
        }}
      >
        About
      </Link>

      <Link
        href="/pricing"
        style={{
          fontSize: '48px',
          color: 'white',
          textDecoration: 'none'
        }}
      >
        Pricing
      </Link>
    </nav>
  );
}
