// components/CognitivePanel.tsx

import React from "react";
import { CognitiveAnalysis } from "../lib/cognitive/model";

interface Props {
  analysis: CognitiveAnalysis;
}

export default function CognitivePanel({ analysis }: Props) {
  const {
    coreBelief,
    impliedMeaning,
    emotionalTone,
    emotionalIntensity,
    coreNeed,
    rewrite,
    nextQuestion
  } = analysis;

  return (
    <div className="cognitive-panel">
      <h2>Cognitive Analysis</h2>

      <div className="analysis-item">
        <label>Core Belief</label>
        <p>{coreBelief || "—"}</p>
      </div>

      <div className="analysis-item">
        <label>Implied Meaning</label>
        <p>{impliedMeaning || "—"}</p>
      </div>

      <div className="analysis-item">
        <label>Emotional Tone</label>
        <p>{emotionalTone || "—"}</p>
      </div>

      <div className="analysis-item">
        <label>Emotional Intensity</label>
        <p>{emotionalIntensity}</p>
      </div>

      <div className="analysis-item">
        <label>Core Need</label>
        <p>{coreNeed || "—"}</p>
      </div>

      <div className="analysis-item">
        <label>Rewrite</label>
        <p>{rewrite || "—"}</p>
      </div>

      <div className="analysis-item">
        <label>Next Question</label>
        <p>{nextQuestion || "—"}</p>
      </div>
    </div>
  );
}
