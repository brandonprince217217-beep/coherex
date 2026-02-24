export default function Home() {
  return (
    <>
      {/* Navigation */}
      <nav className="flex items-center gap-6 p-6">
        <a href="/" className="hover:text-white">Home</a>
        <a href="/about" className="hover:text-white">About</a>
        <a href="/pricing" className="hover:text-white">Pricing</a>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto mt-20">
        <div className="card-3d p-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Coherex</h1>
          <p className="text-lg mb-8">
            Your cognitive OS for structured thinking.
          </p>
          <button className="btn-glow">
            Try Demo
          </button>
        </div>
      </main>
    </>
  );
}
