// pages/index.tsx

import { useState } from "react";
import Head from "next/head";
import InputBar from "../components/InputBar";

export default function Home() {
  const handleSearch = (text: string) => {
    if (!text.trim()) return;

    // Navigate to chat page with the query as the ID
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
