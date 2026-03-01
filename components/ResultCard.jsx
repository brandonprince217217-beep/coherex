import React from "react";
import { TypeAnimation } from "react-type-animation";

interface Props {
  answer: string;
}

export default function ResultCard({ answer }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <TypeAnimation
        sequence={[answer]}
        wrapper="div"
        cursor={true}
        speed={45}
        style={{
          whiteSpace: "pre-line",
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
          color: "#111",
        }}
      />
    </div>
  );
}
