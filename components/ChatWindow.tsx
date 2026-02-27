// components/ChatWindow.tsx
import { useEffect, useRef, useState } from "react";
import MessageBlock from "./MessageBlock";
import StreamingBlock from "./StreamingBlock";
import SoftCursor from "./SoftCursor";

export default function ChatWindow({ messages, streaming }) {
  const ref = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    if (!ref.current) return;
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming, autoScroll]);

  const handleScroll = () => {
    const el = ref.current;
    const nearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setAutoScroll(nearBottom);
  };

  return (
    <div className="chat-window" ref={ref} onScroll={handleScroll}>
      <div className="chat-inner">
        {messages.map((m) => (
          <MessageBlock key={m.id} role={m.role} text={m.content} />
        ))}

        {streaming && <StreamingBlock state={streaming} />}

        {!streaming && <SoftCursor />}
      </div>
    </div>
  );
}
