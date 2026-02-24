export default function Header() {
  return (
    <nav className="flex flex-col items-start gap-6 p-6 text-2xl">
      <a href="/" className="hover:text-white">Home</a>
      <a href="/about" className="hover:text-white">About</a>
      <a href="/pricing" className="hover:text-white">Pricing</a>
    </nav>
  );
}
