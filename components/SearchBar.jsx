import { useState, useEffect } from 'react';

const EXAMPLE_QUERIES = [
  "Why do I keep sabotaging myself when things start going well?",
  "Why do I feel guilty resting, even when I'm exhausted?",
  "Why do I always assume people are mad at me?",
  "Why do I shut down when someone tries to get close to me?",
  "Why do I feel like I'm behind in life all the time?",
  "Why do I replay old mistakes over and over in my head?",
  "Why do I panic when plans change at the last minute?",
  "Why do I feel responsible for everyone else's emotions?",
  "Why do I feel like I'm never doing enough, no matter what I do?",
  "Why do I stay in situations that I know are bad for me?"
];

export default function SearchBar({ onSearch, disabled }) {
  const [placeholder, setPlaceholder] = useState(EXAMPLE_QUERIES[0]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % EXAMPLE_QUERIES.length;
        setPlaceholder(EXAMPLE_QUERIES[next]);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (!disabled && input.trim() !== "") {
      onSearch(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ marginInline: "auto", maxWidth: "520px", width: "90%" }}>
      <input
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
          padding: "14px 18px",
          borderRadius: "14px",
          border: "1px solid rgba(0,140,255,0.7)",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          fontSize: "1rem",
          outline: "none",
          boxShadow: "0 0 14px rgba(0,140,255,0.4)",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={disabled}
        style={{
          marginTop: "12px",
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
          background: disabled ? "gray" : "rgba(0,140,255,0.9)",
          color: "white",
          border: "none",
          fontSize: "1rem",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: "0 0 14px rgba(0,140,255,0.6)",
        }}
      >
        Search
      </button>
    </div>
  );
}
