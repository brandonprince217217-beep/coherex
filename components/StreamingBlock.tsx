// components/StreamingBlock.tsx
import { useEffect, useState } from "react";

export default function StreamingBlock({ state }) {
  const [text, setText] = useState(state.visible);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setCursor((v) => !v), 550);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setText(state.visible);
  }, [state.visible]);

  return (
    <pre className="msg-assistant stream-text">
      {text}
      {state.isStreaming && cursor && <span className="soft-cursor">▌</span>}
    </pre>
  );
}
