// pages/index.jsx

import Head from "next/head";
import InputBar from "../components/InputBar";

export default function Home() {
  const handleSearch = (text) => {
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
          <InputBar onSend={handleSearch} />
        </div>
      </div>
    </div>
  );
}
