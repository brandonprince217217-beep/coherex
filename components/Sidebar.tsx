import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="sidebar">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/about">About</Link>
      </nav>

      <div className="auth-section">
        {user ? (
          <>
            <p>Signed in as {user.email}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <Link href="/auth">Sign In</Link>
        )}
      </div>
    </aside>
  );
}
