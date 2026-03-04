import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const linkStyle = (href) => ({
    color: 'white',
    textDecoration: 'none',
    opacity: router.pathname === href ? 1 : 0.6,
    borderBottom: router.pathname === href ? '2px solid rgba(0,140,255,0.8)' : '2px solid transparent',
    paddingBottom: '4px',
  });

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
        backgroundColor: 'rgba(0,0,0,0.55)',
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
        <Link href="/" style={linkStyle('/')}>
          Home
        </Link>

        <Link href="/about" style={linkStyle('/about')}>
          About
        </Link>

        <Link href="/pricing" style={linkStyle('/pricing')}>
          Pricing
        </Link>

        <Link href="/thought-protector" style={linkStyle('/thought-protector')}>
          Thought Protector
        </Link>
      </nav>
    </header>
  );
}
