import Head from "next/head";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Results from "../components/Results";
import Constellation from "../components/Constellation";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Search failed");
      } else {
        setResults((prev) => [{ ...data, _id: Date.now() }, ...prev]);
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
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
          <SearchBar
            onSearch={handleSearch}
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 20, color: "red", textAlign: "center" }}>
          {error}
        </div>
      )}

      <Results results={results} />
    </div>
  );
}
