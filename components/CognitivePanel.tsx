import React from "react";
import type { CognitiveAnalysis } from "../lib/cognitive/model";

type Props = {
  analysis: CognitiveAnalysis | null;
};

export default function CognitivePanel({ analysis }: Props) {
  if (!analysis) {
    return (
      <aside className="cognitive-panel">
        <div className="cognitive-header">
          <span>COGNITIVE FIELD</span>
          <span className="breakthrough-pill">Idle</span>
        </div>
        <div className="cognitive-empty">
          The system will map beliefs, emotions, and contradictions as you type.
        </div>
      </aside>
    );
  }

  const {
    coreBelief,
    impliedMeaning,
    emotionalTone,
    emotionalIntensity,
    coreNeed,
    hiddenAssumptions,
    contradictions,
    breakthroughLikelihood,
    identityShift,
    nextQuestion,
    beliefGraph,
  } = analysis;

  const breakthroughLabel =
    breakthroughLikelihood > 0.75
      ? "High"
      : breakthroughLikelihood > 0.45
      ? "Warming"
      : "Low";

  const breakthroughClass =
    breakthroughLikelihood > 0.75
      ? "breakthrough-pill hot"
      : breakthroughLikelihood > 0.45
      ? "breakthrough-pill warm"
      : "breakthrough-pill";

  const intensityPercent = Math.round(emotionalIntensity * 100);
  const breakthroughPercent = Math.round(breakthroughLikelihood * 100);

  return (
    <aside className="cognitive-panel">
      <div className="cognitive-header">
        <span>COGNITIVE FIELD</span>
        <span className={breakthroughClass}>
          Breakthrough {breakthroughLabel} · {breakthroughPercent}%
        </span>
      </div>

      <section className="cognitive-section">
        <div className="cognitive-label">Core belief</div>
        <div className="cognitive-text">{coreBelief || "—"}</div>
      </section>

      <section className="cognitive-section">
        <div className="cognitive-label">Implied meaning</div>
        <div className="cognitive-text">{impliedMeaning || "—"}</div>
      </section>

      <section className="cognitive-grid">
        <div className="cognitive-block">
          <div className="cognitive-label">Emotional state</div>
          <div className="cognitive-text">
            {emotionalTone || "—"} · {intensityPercent}%
          </div>
        </div>
        <div className="cognitive-block">
          <div className="cognitive-label">Core need</div>
          <div className="cognitive-text">{coreNeed || "—"}</div>
        </div>
      </section>

      <section className="cognitive-section">
        <div className="cognitive-label">Hidden assumptions</div>
        <ul className="cognitive-list">
          {hiddenAssumptions && hiddenAssumptions.length > 0 ? (
            hiddenAssumptions.map((a, i) => <li key={i}>{a}</li>)
          ) : (
            <li>None detected yet.</li>
          )}
        </ul>
      </section>

      <section className="cognitive-section">
        <div className="cognitive-label">Contradictions</div>
        <ul className="cognitive-list contradictions">
          {contradictions && contradictions.length > 0 ? (
            contradictions.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>No active contradictions detected.</li>
          )}
        </ul>
      </section>

      <section className="cognitive-grid">
        <div className="cognitive-block">
          <div className="cognitive-label">Identity shift</div>
          <div className="cognitive-text">{identityShift || "—"}</div>
        </div>
        <div className="cognitive-block">
          <div className="cognitive-label">Next question</div>
          <div className="cognitive-text">{nextQuestion || "—"}</div>
        </div>
      </section>

      {beliefGraph && beliefGraph.length > 0 && (
        <section className="cognitive-section">
          <div className="cognitive-label">Belief graph</div>
          <div className="belief-graph">
            {beliefGraph.map((node, i) => (
              <div
                key={i}
                className={`belief-node belief-${node.kind || "belief"}`}
              >
                <div className="belief-label">{node.label}</div>
                <div className="belief-meta">
                  {node.kind} · strength {Math.round(node.strength * 100)}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
