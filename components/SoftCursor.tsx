// components/SoftCursor.tsx
import { useEffect, useState } from "react";

export default function SoftCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="msg-assistant">
      {visible && <span className="soft-cursor">▌</span>}
    </div>
  );
}
