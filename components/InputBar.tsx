// components/InputBar.tsx
import { useState } from "react";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="input-bar">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Type..."
      />
      <button onClick={submit}>Send</button>
    </div>
  );
}
