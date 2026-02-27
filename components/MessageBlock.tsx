// components/MessageBlock.tsx
export default function MessageBlock({ role, text }) {
  const lines = text.split("\n");

  return (
    <div className={role === "user" ? "msg-user" : "msg-assistant"}>
      {lines.map((line, i) => {
        if (line.trim().startsWith("- ")) {
          return (
            <p key={i} className="list-item">
              {line}
            </p>
          );
        }

        if (line.trim().startsWith("```") && line.trim().endsWith("```")) {
          const code = line.replace(/```/g, "").trim();
          return (
            <pre key={i} className="code-inline">
              <code>{code}</code>
            </pre>
          );
        }

        if (line.trim().length === 0) {
          return <div key={i} className="paragraph-spacer" />;
        }

        return (
          <p key={i} className="paragraph">
            {line}
          </p>
        );
      })}
    </div>
  );
}
