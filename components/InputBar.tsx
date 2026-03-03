import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
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

    // Otherwise, navigate to the search results page
    router.push({ pathname: '/search', query: { q: text } });
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
