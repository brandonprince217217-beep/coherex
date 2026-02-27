import { useState } from "react";
import InputBar from "./InputBar";
import StreamingBlock from "./StreamingBlock";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState("");

  const sendMessage = async (text: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    // Start streaming
    setStreamingText("");

    const response = await fetch("/api/stream", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setStreamingText((prev) => prev + chunk);
    }

    // Finalize assistant message
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: streamingText + "" },
    ]);

    setStreamingText("");

    // Trigger cognitive engine
    fetch("/api/cognitive", {
      method: "POST",
      body: JSON.stringify({
        message: text,
        historySummary: "",
      }),
    });

    // Trigger title generator
    fetch("/api/title", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}

        {streamingText && <StreamingBlock text={streamingText} />}
      </div>

      <InputBar onSend={sendMessage} />
    </div>
  );
}
