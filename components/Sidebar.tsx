import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [convos, setConvos] = useState([]);
  const router = useRouter();
  const active = router.query.id;

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    setConvos(data || []);
  };

  const newConversation = async () => {
    const { data } = await supabase
      .from("conversations")
      .insert({ title: "New Conversation" })
      .select()
      .single();

    router.push(`/chat/${data.id}`);
  };

  return (
    <div className="sidebar">
      <button className="new-btn" onClick={newConversation}>
        + New
      </button>

      <div className="sidebar-list">
        {convos.map((c) => (
          <Link key={c.id} href={`/chat/${c.id}`}>
            <div
              className={
                c.id === active ? "sidebar-item active" : "sidebar-item"
              }
            >
              {c.title || "Untitled"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
