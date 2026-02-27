import { useMemo } from "react";
import type { CognitiveAnalysis } from "../lib/cognitive/model";

type Props = {
  analysis: CognitiveAnalysis | null;
};

export default function CognitivePanel({ analysis }: Props) {
  const breakthroughLevel = useMemo(() => {
    if (!analysis) return 0;
    return Math.round(analysis.breakthroughLikelihood * 100);
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="cognitive-panel">
        <div className="cognitive-header">Cognitive Field</div>
        <div className="cognitive-empty">
          Start typing to see your mindspace come alive.
        </div>
      </div>
    );
  }

  return (
    <div className="cognitive-panel">
      <div className="cognitive-header">
        Cognitive Field
        <span
          className={
            breakthroughLevel > 70
              ? "breakthrough-pill hot"
              : breakthroughLevel > 40
              ? "breakthrough-pill warm"
              : "breakthrough-pill"
          }
        >
          Breakthrough {breakthroughLevel}%
        </span>
      </div>

      <div className="cognitive-section">
        <div className="cognitive-label">Core Belief</div>
        <div className="cognitive-text">{analysis.coreBelief}</div>
      </div>

      <div className="cognitive-section">
        <div className="cognitive-label">Implied Meaning</div>
        <div className="cognitive-text">{analysis.impliedMeaning}</div>
      </div>

      <div className="cognitive-grid">
        <div className="cognitive-block">
          <div className="cognitive-label">Emotional State</div>
          <div className="cognitive-text">{analysis.emotionalState}</div>
        </div>
        <div className="cognitive-block">
          <div className="cognitive-label">Intensity</div>
          <div className="cognitive-text">
            {Math.round(analysis.emotionalIntensity * 100)}%
          </div>
        </div>
      </div>

      {analysis.hiddenAssumptions.length > 0 && (
        <div className="cognitive-section">
          <div className="cognitive-label">Hidden Assumptions</div>
          <ul className="cognitive-list">
            {analysis.hiddenAssumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.contradictions.length > 0 && (
        <div className="cognitive-section">
          <div className="cognitive-label">Contradictions Forming</div>
          <ul className="cognitive-list contradictions">
            {analysis.contradictions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="cognitive-section">
        <div className="cognitive-label">Predicted Next Thought</div>
        <div className="cognitive-text">{analysis.predictedNextThought}</div>
      </div>

      <div className="cognitive-section">
        <div className="cognitive-label">Identity Shift</div>
        <div className="cognitive-text">{analysis.identityShift}</div>
      </div>

      <div className="cognitive-section">
        <div className="cognitive-label">Belief Graph</div>
        <div className="belief-graph">
          {analysis.beliefGraph.nodes.map((n) => (
            <div
              key={n.id}
              className={`belief-node belief-${n.type}`}
              style={{
                opacity: 0.4 + n.strength * 0.6,
                boxShadow: `0 0 ${8 + n.emotionalCharge * 18}px rgba(255,255,255,${
                  0.1 + n.emotionalCharge * 0.5
                })`,
              }}
            >
              <div className="belief-label">{n.label}</div>
              <div className="belief-meta">
                {n.type} • {(n.strength * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
