import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      padding: '20px',
      borderBottom: '1px solid #eee',
      marginBottom: '40px'
    }}>
      <nav style={{
        display: 'flex',
        gap: '20px',
        fontSize: '16px'
      }}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  );
}
