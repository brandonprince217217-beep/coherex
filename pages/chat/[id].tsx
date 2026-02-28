import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function runSearch() {
      try {
        setLoading(true);

        // ⭐ EXACT MATCH to your backend API
        const res = await fetch("/api/engine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: id }),
        });

        const data = await res.json();

        // ⭐ EXACT MATCH to your backend return shape
        setResponse(data.output || "No response.");
      } catch (err) {
        console.error(err);
        setResponse("Error loading response.");
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Coherex AI</h1>
      <p><strong>Search:</strong> {id}</p>

      {loading ? (
        <p>Thinking...</p>
      ) : (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          {response}
        </div>
      )}
    </div>
  );
}
