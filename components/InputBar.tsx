import { useState, useRef, useEffect } from "react";

type InputBarProps = {
  onSend?: (text: string) => void | Promise<void>;
  disabled?: boolean;
  buttonLabel?: string;
  initialValue?: string;
};

export default function InputBar({
  onSend,
  disabled = false,
  buttonLabel = "Search",
  initialValue = "",
}: InputBarProps) {
  const [text, setText] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const canSubmit = !disabled && text.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const now = Date.now();
    if (now - lastSubmitRef.current < 300) return;
    lastSubmitRef.current = now;

    // If a parent component provided onSend, use it (chat page)
    if (onSend) {
      await onSend(text);
      return;
    }

    // Otherwise, perform homepage search
    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();
      console.log("Search result:", data);
    } catch (err) {
      console.error("Search failed:", err);
    }

    setLoading(false);
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled || loading}
      />
      <button type="submit" disabled={!canSubmit || loading}>
        {loading ? "..." : buttonLabel}
      </button>
    </form>
  );
}
