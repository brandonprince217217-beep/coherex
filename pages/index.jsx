import Layout from '../components/Layout';
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState("");

  // THIS MAKES YOUR SEARCH WORK
  const handleSearch = (query) => {
    if (!query.trim()) return;
    setResult("Processing: " + query);
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

        {/* SEARCH BAR */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px'
          }}
        >
          <input
            type="text"
            placeholder="Ask Coherex anything..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(e.target.value);
            }}
            style={{
              width: '90%',
              maxWidth: '420px',
              padding: '14px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(0, 140, 255, 0.6)',
              background: 'rgba(0, 140, 255, 0.12)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 0 12px rgba(0, 140, 255, 0.4)',
              transition: '0.25s'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 22px rgba(0, 140, 255, 0.9)';
              e.target.style.background = 'rgba(0, 140, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 0 12px rgba(0, 140, 255, 0.4)';
              e.target.style.background = 'rgba(0, 140, 255, 0.12)';
            }}
          />
        </div>

        {/* SEARCH RESULT */}
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
