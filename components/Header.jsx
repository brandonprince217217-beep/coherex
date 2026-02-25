export default function Header() {
  return (
    <header className="w-full py-4 px-6 border-b border-gray-200">
      <nav className="flex flex-col space-y-4 text-lg font-medium">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a
          href="/pricing"
          className="bg-black text-white px-4 py-2 rounded-lg w-fit"
        >
          Pricing
        </a>
      </nav>
    </header>
  );
}
