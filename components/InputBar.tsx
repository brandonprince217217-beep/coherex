import { useEffect, useRef, useState } from "react";

const ROTATING_PROMPTS = [
  "Why do I feel stuck right now?",
  "Why am I anxious about the future?",
  "Why do I keep overthinking things?",
  "What's making me feel this way?",
  "Why do I feel like I'm not enough?",
  "Why does this situation bother me so much?",
  "Why am I scared to make a decision?",
  "Why do I repeat the same patterns?",
];

const ROTATION_INTERVAL_MS = 5_000;

type InputBarProps = {
  onSend: (text: string) => void;
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
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  // Rotate placeholders; pause when input is focused
  useEffect(() => {
    if (isFocused) return;
    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isFocused]);

  const canSubmit = !disabled && text.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const now = Date.now();
    if (now - lastSubmitRef.current < 300) return; // debounce window
    lastSubmitRef.current = now;

    onSend(text);
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={ROTATING_PROMPTS[placeholderIndex]}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
      />
      <button type="submit" disabled={!canSubmit}>
        {buttonLabel}
      </button>
    </form>
  );
}

