import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* GLOBAL NAV */}
      <nav className="flex space-x-6 items-center p-6">
        <a href="/" className="hover:text-gray-300 transition">Home</a>
        <a href="/about" className="hover:text-gray-300 transition">About</a>
        <a
          href="/pricing"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90 transition"
        >
          Pricing
        </a>
      </nav>

      {/* PAGE CONTENT */}
      <Component {...pageProps} />

    </div>
  );
}
