import { useState } from "react";

interface InputBarProps {
  onSend: (text: string) => void;
}

export default function InputBar({ onSend }: InputBarProps) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="input-bar">
      <input
        className="input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button className="send-btn" onClick={send}>
        Send
      </button>
    </div>
  );
}
