import Head from "next/head";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import InputBar from "../components/InputBar";

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

      <div className="hero" data-mind-section="hero">
        <h1 data-mind-role="headline">Coherex</h1>
        <p>Your cognitive OS.</p>

        <div className="search-container">
          <InputBar
            onSend={handleSearch}
            disabled={isSearching}
            buttonLabel={isSearching ? "Searching..." : "Search"}
            initialValue={initialQuery}
          />
        </div>

        <div data-mind-role="blocks" style={{ display: 'none' }}>
          <span data-block-id="intro" />
          <span data-block-id="features" />
          <span data-block-id="how" />
          <span data-block-id="pricing" />
        </div>
      </div>
    </div>
  );
}
