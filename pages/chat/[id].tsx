import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ChatWindow from "../../components/ChatWindow";
import InputBar from "../../components/InputBar";
import Sidebar from "../../components/Sidebar";
import CognitivePanel from "../../components/CognitivePanel";
import CognitiveField3D from "../../components/CognitiveField3D";
import type { CognitiveAnalysis } from "../../lib/cognitive/model";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  conversation_id: string;
};

type StreamingState = {
  role: "assistant";
  segments: string[];
  visible: string;
  isStreaming: boolean;
} | null;

type Props = {
  conversationId: string;
};

export default function ChatPage({ conversationId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState<StreamingState>(null);
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages((data as Message[]) || []);
  };

  const summarizeHistory = () => {
    if (!messages || messages.length === 0) return "";
    const last = messages.slice(-6);
    return last
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");
  };

  const sendMessage = async (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      conversation_id: conversationId,
    };

    setMessages((prev) => [...prev, userMsg]);
    await supabase.from("messages").insert(userMsg);

    const { data: convo } = await supabase
      .from("conversations")
      .select("title")
      .eq("id", conversationId)
      .single();

    if (!convo?.title || convo.title === "New Conversation") {
      const titleRes = await fetch("/api/title", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });

      const { title } = await titleRes.json();

      await supabase
        .from("conversations")
        .update({ title })
        .eq("id", conversationId);
    }

    const historySummary = summarizeHistory();

    fetch("/api/cognitive", {
      method: "POST",
      body: JSON.stringify({ message: text, historySummary }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAnalysis(data);
      })
      .catch(() => {});

    const res = await fetch("/api/stream", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    let segments: string[] = [];
    let current = "";

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
        if (current.trim().length > 0) segments.push(current.trim());
        current = "";
      } else {
        current += chunk;
      }

      const all = [...segments, current];
      setStreaming({
        role: "assistant",
        segments: all,
        visible: all.join("\n\n"),
        isStreaming: true,
      });
    }

    if (current.trim().length > 0) segments.push(current.trim());

    const finalText = segments.join("\n\n");

    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: finalText,
      conversation_id: conversationId,
    };

    await supabase.from("messages").insert(assistantMsg);

    setMessages((prev) => [...prev, assistantMsg]);
    setStreaming(null);
  };

  const emotionalIntensity = analysis?.emotionalIntensity ?? 0;
  const breakthroughLikelihood = analysis?.breakthroughLikelihood ?? 0;

  return (
    <div className="chat-shell">
      <CognitiveField3D
        intensity={emotionalIntensity}
        breakthrough={breakthroughLikelihood}
      />

      <div className="layout chat-foreground">
        <Sidebar />

        <div className="chat-area">
          <ChatWindow messages={messages} streaming={streaming} />
          <InputBar onSend={sendMessage} />
        </div>

        <CognitivePanel analysis={analysis} />
      </div>
    </div>
  );
}

ChatPage.getInitialProps = ({ query }) => ({
  conversationId: query.id as string,
});
