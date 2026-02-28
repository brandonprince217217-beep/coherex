import { useRouter } from "next/router";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat</h1>
      <p>You searched for: <strong>{id}</strong></p>
    </div>
  );
}
