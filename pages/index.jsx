import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import InputBar from "../components/InputBar";

const ParticleField3D = dynamic(
  () => import("../components/ParticleField3D"),
  { ssr: false }
);

function normalizeQuery(value) {
  return value.replace(/\s+/g, " ").trim();
}

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

      <ParticleField3D />

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
    </div>
  );
}
