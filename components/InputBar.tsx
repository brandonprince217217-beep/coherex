// components/InputBar.tsx

import { useState } from "react";

export default function InputBar({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSend(text);
    setText(""); // clear AFTER sending
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search anything..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
