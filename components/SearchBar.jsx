import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, disabled }) {
  const suggestions = [
    "Why do I feel stuck right now?",
    "Why do I keep overthinking things?",
    "Why am I scared to make a decision?",
    "Why do I feel like I'm not enough?",
    "Why do I repeat the same patterns?",
    "Why does this situation bother me so much?"
  ];

  const [placeholder, setPlaceholder] = useState(suggestions[0]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % suggestions.length;
        setPlaceholder(suggestions[next]);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
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
