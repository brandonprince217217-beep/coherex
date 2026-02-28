// components/ChatWindow.tsx

interface ChatWindowProps {
  messages: any[];
  streaming: boolean;
}

export default function ChatWindow({ messages, streaming }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.map((msg: any, i: number) => (
        <div key={i} className="chat-message">
          {msg.role === "user" ? (
            <div className="user-message">{msg.content}</div>
          ) : (
            <div className="assistant-message">{msg.content}</div>
          )}
        </div>
      ))}

      {streaming && (
        <div className="assistant-message typing-indicator">
          …
        </div>
      )}
    </div>
  );
}
