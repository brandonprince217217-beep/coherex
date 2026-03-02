import { useState } from 'react';

export default function ResultCard({ result, isNested }) {
  const [expanded, setExpanded] = useState(false);
  const [deepResult, setDeepResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [replies, setReplies] = useState([]);

  const preview = result.answer ? result.answer.split("\n\n")[0] : "";

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);

    if (!deepResult) {
      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query:
              result.query +
              "\n\nGive me a deeper, more detailed explanation than before, going further into the patterns, beliefs, and core needs behind this.",
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setDeepResult(data);
        }
      } catch (err) {
        console.error("Failed to load deep result:", err);
      }
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const displayed = deepResult || result;
    const text = [
      `Query: ${displayed.query}`,
      `Belief Type: ${displayed.beliefType}`,
      `Emotional Charge: ${displayed.emotionalCharge}`,
      `Core Need: ${displayed.coreNeed}`,
      `Hidden Assumption: ${displayed.hiddenAssumption}`,
      `Contradiction: ${displayed.contradiction}`,
      `Rewrite: ${displayed.rewrite}`,
      `Next Question: ${displayed.nextQuestion}`,
      `Answer: ${displayed.answer}`,
    ].join("\n\n");
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const handleSendReply = async () => {
    if (!replyInput.trim()) return;
    const userReply = replyInput.trim();
    setReplyInput("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `This is a follow-up to: "${result.query}"\n\n${userReply}`,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setReplies((prev) => [...prev, { ...data, _id: Date.now() }]);
      }
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const displayed = deepResult || result;

  return (
    <div
      style={{
        marginLeft: isNested ? 32 : 0,
        marginBottom: 16,
        padding: 20,
        borderRadius: 14,
        background: "rgba(0,0,0,0.5)",
        border: expanded
          ? "1px solid rgba(0,140,255,1)"
          : "1px solid rgba(0,140,255,0.5)",
        color: "white",
        boxShadow: expanded
          ? "0 0 20px rgba(0,140,255,0.5)"
          : "0 0 10px rgba(0,140,255,0.2)",
        cursor: "pointer",
      }}
      onClick={!expanded ? handleExpand : undefined}
    >
      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: "1rem" }}>
        {result.query}
      </div>

      {!expanded && (
        <div style={{ opacity: 0.8, fontSize: "0.95rem" }}>{preview}</div>
      )}

      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          {loading ? (
            <div style={{ opacity: 0.6 }}>Loading deeper analysis…</div>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Belief Type</span>
                <div>{displayed.beliefType}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Emotional Charge</span>
                <div>{displayed.emotionalCharge}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Core Need</span>
                <div>{displayed.coreNeed}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Hidden Assumption</span>
                <div>{displayed.hiddenAssumption}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Contradiction</span>
                <div>{displayed.contradiction}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Rewrite</span>
                <div>{displayed.rewrite}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Next Question</span>
                <div>{displayed.nextQuestion}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Answer</span>
                <div>
                  {displayed.answer.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginTop: 8 }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "rgba(0,140,255,0.8)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={handleExpand}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Collapse
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  placeholder="Your reply…"
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0,140,255,0.5)",
                    background: "rgba(0,0,0,0.4)",
                    color: "white",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSendReply}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 10,
                    background: "rgba(0,140,255,0.9)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}

          {replies.map((reply) => (
            <ResultCard key={reply._id || reply.query} result={reply} isNested />
          ))}
        </div>
      )}
    </div>
  );
}
