// pages/chat/[id].tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChatWindow from "../../components/ChatWindow";
import InputBar from "../../components/InputBar";
import CognitiveField3D from "../../components/CognitiveField3D";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  const [messages, setMessages] = useState<any[]>([]);
  const [streaming, setStreaming] = useState<{
    role: "assistant";
    segments: string[];
    visible: string;
    isStreaming: boolean;
  } | null>(null);

  const [emotionalIntensity, setEmotionalIntensity] = useState(0);
  const [breakthroughLikelihood, setBreakthroughLikelihood] = useState(0);

  useEffect(() => {
    if (!id) return;

    setMessages([
      { role: "assistant", content: "Welcome back. How are you feeling today?" }
    ]);
  }, [id]);

  const sendMessage = async (text: string) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    setStreaming({
      role: "assistant",
      segments: [],
      visible: "",
      isStreaming: true
    });

    let visible = "";
    const fakeResponse = "I'm here with you. Tell me more.";

    for (let i = 0; i < fakeResponse.length; i++) {
      visible += fakeResponse[i];
      await new Promise((res) => setTimeout(res, 20));

      setStreaming({
        role: "assistant",
        segments: [],
        visible,
        isStreaming: true
      });
    }

    setStreaming({
      role: "assistant",
      segments: [],
      visible,
      isStreaming: false
    });

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: fakeResponse }
    ]);

    setEmotionalIntensity(Math.floor(Math.random() * 100));
    setBreakthroughLikelihood(Math.floor(Math.random() * 100));
  };

  return (
    <div className="chat-page">
      <CognitiveField3D
        intensity={emotionalIntensity}
        breakthrough={breakthroughLikelihood}
      />

      <div className="layout chat-foreground">
        <div className="chat-area">
          <ChatWindow
            messages={messages}
            streaming={streaming?.isStreaming ?? false}
          />

          <InputBar onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
