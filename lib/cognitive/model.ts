// lib/cognitive/model.ts

export interface CognitiveAnalysis {
  coreBelief: string;
  impliedMeaning: string;
  emotionalTone: string;
  emotionalIntensity: number;
  coreNeed: string;
  rewrite: string;
  nextQuestion: string;
}

export const emptyAnalysis: CognitiveAnalysis = {
  coreBelief: "",
  impliedMeaning: "",
  emotionalTone: "",
  emotionalIntensity: 0,
  coreNeed: "",
  rewrite: "",
  nextQuestion: ""
};
