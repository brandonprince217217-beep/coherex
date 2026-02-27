import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState("");

  const handleSearch = (query) => {
    if (!query.trim()) return;
    setResult("You searched: " + query);
  };

  return (
    <Layout>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'black',
          color: 'white',
          paddingTop: '160px',
          paddingBottom: '60px',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <h1 style={{ fontSize: '2.4rem', marginBottom: '20px' }}>
          Coherex
        </h1>

        <p style={{ opacity: 0.7, marginBottom: '40px' }}>
          Your Cognitive Operating System
        </p>

        <SearchBar onSearch={handleSearch} />

        {result && (
          <div
            style={{
              marginTop: '20px',
              fontSize: '1.2rem',
              opacity: 0.9
            }}
          >
            {result}
          </div>
        )}
      </div>
    </Layout>
  );
}
