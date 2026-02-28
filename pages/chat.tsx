// pages/chat.tsx
import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(null);

  const sendMessage = async (text: string) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/stream", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const reader = res.body.getReader();
    let full = "";
    let segments: string[] = [];
    let currentSegment = "";

    setStreaming({
      role: "assistant",
      segments: [],
      visible: "",
      isStreaming: true,
    });

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);

      if (chunk.includes("[SEGMENT]")) {
        if (currentSegment.trim().length > 0) {
          segments.push(currentSegment.trim());
        }
        currentSegment = "";
      } else {
        currentSegment += chunk;
      }

      setStreaming({
        role: "assistant",
        segments: [...segments, currentSegment],
        visible: [...segments, currentSegment].join("\n\n"),
        isStreaming: true,
      });
    }

    if (currentSegment.trim().length > 0) {
      segments.push(currentSegment.trim());
    }

    const finalText = segments.join("\n\n");

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: finalText,
      },
    ]);

    setStreaming(null);
  };

  return (
    <div className="chat-page">
      <ChatWindow messages={messages} streaming={streaming} />
      <InputBar onSend={sendMessage} />
    </div>
  );
}
