import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import ChatWindow from "../../../components/ChatWindow";
import InputBar from "../../../components/InputBar";
import Sidebar from "../../../components/Sidebar";

export default function ChatPage({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  const sendMessage = async (text) => {
    const userMsg = {
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

    if (!convo.title || convo.title === "New Conversation") {
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

    const res = await fetch("/api/stream", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const reader = res.body.getReader();
    let segments = [];
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

      setStreaming({
        role: "assistant",
        segments: [...segments, current],
        visible: [...segments, current].join("\n\n"),
        isStreaming: true,
      });
    }

    if (current.trim().length > 0) segments.push(current.trim());

    const finalText = segments.join("\n\n");

    const assistantMsg = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: finalText,
      conversation_id: conversationId,
    };

    await supabase.from("messages").insert(assistantMsg);

    setMessages((prev) => [...prev, assistantMsg]);
    setStreaming(null);
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="chat-area">
        <ChatWindow messages={messages} streaming={streaming} />
        <InputBar onSend={sendMessage} />
      </div>
    </div>
  );
}

ChatPage.getInitialProps = ({ query }) => ({
  conversationId: query.id,
});
