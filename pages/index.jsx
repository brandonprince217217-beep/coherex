// pages/index.tsx

import Head from "next/head";
import InputBar from "../components/InputBar";

export default function Home() {
  // ⭐ This is the missing search function
  const handleSearch = (text: string) => {
    if (!text.trim()) return;
    window.location.href = `/chat/${encodeURIComponent(text)}`;
  };

  return (
    <div className="home-page">
      <Head>
        <title>Coherex</title>
      </Head>

      <div className="hero">
        <h1>Coherex</h1>
        <p>Your cognitive OS.</p>

        <div className="search-container">
          {/* ⭐ STEP 2 — Replace <InputBar /> with this */}
          <InputBar onSend={handleSearch} />
        </div>
      </div>
    </div>
  );
}
