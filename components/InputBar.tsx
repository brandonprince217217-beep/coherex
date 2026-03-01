import { useState } from "react";

type InputBarProps = {
  disabled?: boolean;
};

export default function InputBar({ disabled = false }: InputBarProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: text })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Search failed");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            background: "black",
            color: "white",
            border: "none"
          }}
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 16, color: "red" }}>
          {error}
        </div>
      )}

      {result && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f5f5f5",
            borderRadius: 8,
            whiteSpace: "pre-wrap"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
