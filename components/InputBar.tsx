import { useEffect, useRef, useState } from "react";

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
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

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
        placeholder="Search anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={!canSubmit}>
        {buttonLabel}
      </button>
    </form>
  );
}
