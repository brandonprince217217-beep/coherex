export type BeliefNodeKind =
  | "belief"
  | "value"
  | "fear"
  | "desire"
  | "assumption";

export type BeliefNode = {
  label: string;
  kind: BeliefNodeKind;
  strength: number; // 0–1
};

export type CognitiveAnalysis = {
  coreBelief: string;
  impliedMeaning: string;
  emotionalTone: string;
  emotionalIntensity: number; // 0–1
  coreNeed: string;
  hiddenAssumptions: string[];
  contradictions: string[];
  breakthroughLikelihood: number; // 0–1
  identityShift: string;
  nextQuestion: string;
  beliefGraph: BeliefNode[];
};

export function emptyAnalysis(): CognitiveAnalysis {
  return {
    coreBelief: "",
    impliedMeaning: "",
    emotionalTone: "",
    emotionalIntensity: 0,
    coreNeed: "",
    hiddenAssumptions: [],
    contradictions: [],
    breakthroughLikelihood: 0,
    identityShift: "",
    nextQuestion: "",
    beliefGraph: [],
  };
}
