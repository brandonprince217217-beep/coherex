export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-purple-600 text-white">
      <nav className="flex flex-col items-start space-y-4 text-xl font-medium">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a
          href="/pricing"
          className="text-white bg-black px-4 py-2 rounded-lg"
        >
          Pricing
        </a>
      </nav>
    </header>
  );
}
