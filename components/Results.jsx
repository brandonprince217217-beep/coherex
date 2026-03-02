import React from "react";
import ResultCard from "./ResultCard";

export default function Results({ results }) {
  return (
    <div className="flex flex-col items-center mt-10 space-y-8">
      {results.map((item, index) => (
        <ResultCard key={index} answer={item.answer} />
      ))}
    </div>
  );
}
