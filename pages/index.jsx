import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import InputBar from "../components/InputBar";
import Constellation from "../components/Constellation";

function normalizeQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

const FEATURES = [
  {
    title: "GPT-4o mini",
    description: "Fast, cost-efficient reasoning powered by OpenAI's latest small model.",
  },
  {
    title: "Three.js",
    description: "Hardware-accelerated 3D visualizations rendered directly in the browser.",
  },
  {
    title: "Streaming",
    description: "Token-by-token streaming responses for a fluid, low-latency experience.",
  },
];

export default function Home() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const initialQuery = useMemo(() => {
    const q = typeof router.query.q === "string" ? router.query.q : "";
    return normalizeQuery(q);
  }, [router.query.q]);

  const handleSearch = (text) => {
    if (isSearching) return;

    const query = normalizeQuery(text);
    if (query.length < 2) return;

    setIsSearching(true);
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="home-page">
      <Head>
        <title>Coherex</title>
      </Head>

      <Constellation />

      <div className="hero">
        <h1>Coherex</h1>
        <p>Your cognitive OS.</p>

        <div className="search-container">
          <InputBar
            onSend={handleSearch}
            disabled={isSearching}
            buttonLabel={isSearching ? "Searching..." : "Search"}
            initialValue={initialQuery}
          />
        </div>
      </div>

      <section className="features-section">
        <h2 className="features-heading">Powered by advanced technology</h2>
        <div className="features-grid">
          {FEATURES.map(({ title, description }) => (
            <div key={title} className="feature-card">
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
