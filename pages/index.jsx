import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import InputBar from "../components/InputBar";
import Constellation from "../components/Constellation";

function normalizeQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

const TECH_STACK = [
  {
    icon: "🧠",
    label: "GPT-4o mini",
    desc: "OpenAI large language model for deep semantic reasoning",
  },
  {
    icon: "🌐",
    label: "Three.js",
    desc: "GPU-accelerated 3D graphics rendered directly in the browser",
  },
  {
    icon: "⚡",
    label: "Real-time streaming",
    desc: "Token-by-token AI responses with zero-latency perception",
  },
  {
    icon: "🔍",
    label: "Semantic search",
    desc: "Ranked retrieval with citation-grounded AI summaries",
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

      <div className="tech-section">
        <h2 className="tech-heading">Powered by advanced technology</h2>
        <div className="tech-grid">
          {TECH_STACK.map(({ icon, label, desc }) => (
            <div key={label} className="tech-card">
              <span className="tech-icon">{icon}</span>
              <strong className="tech-label">{label}</strong>
              <p className="tech-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
