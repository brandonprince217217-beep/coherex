import React from "react";
import ResultCard from "./ResultCard";

export interface CoherexResult {
  answer: string;
}

interface Props {
  results: CoherexResult[];
}

export default function Results({ results }: Props) {
  return (
    <div className="flex flex-col items-center mt-10 space-y-8">
      {results.map((r, i) => (
        <ResultCard key={i} answer={r.answer} />
      ))}
    </div>
  );
}
